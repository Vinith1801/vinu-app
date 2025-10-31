import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {useLocalTracks} from './useLocalTracks';

export const useTrackPlayerSetup = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const {scanLocalAudio} = useLocalTracks();

  useEffect(() => {
    const setup = async () => {
      try {
        // Request permission
        if (Platform.OS === 'android') {
          const granted =
            Platform.Version >= 33
              ? await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                )
              : await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('❌ Storage permission denied.');
            return;
          }
        }

        // Initialize player
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({stopWithApp: true});
        console.log('✅ Track Player ready');

        // Scan + load tracks
        const localTracks = await scanLocalAudio();
        if (localTracks.length === 0) {
          console.warn('⚠️ No music files found.');
          setTracks([]);
          return;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(localTracks);
        await TrackPlayer.play();
        setTracks(localTracks);
      } catch (error) {
        console.error('💥 Error during setup:', error);
      }
    };

    setup();
  }, [scanLocalAudio]);

  return tracks;
};
