import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {useLocalTracks} from './useLocalTracks';

// Prevent re-initialization across Fast Refresh
let playerInitialized = false;

export const useTrackPlayerSetup = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const {scanLocalAudio} = useLocalTracks();

  useEffect(() => {
    const setup = async () => {
      try {
        // 🛑 Skip if already initialized
        if (playerInitialized) {
          console.log('⚙️ Player already initialized — skipping setup');
          const existingQueue = await TrackPlayer.getQueue();
          if (existingQueue.length > 0) setTracks(existingQueue);
          return;
        }

        // 1️⃣ Request permissions (Android)
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

        // 2️⃣ Initialize Track Player
        await TrackPlayer.setupPlayer();
        playerInitialized = true;
        console.log('✅ Track Player ready');

        // 3️⃣ Configure background capabilities
        await TrackPlayer.updateOptions({
          alwaysPauseOnInterruption: true,
          progressUpdateEventInterval: 1,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
        });

        // 4️⃣ Scan local tracks
        const localTracks = await scanLocalAudio();
        if (!localTracks || localTracks.length === 0) {
          console.warn('⚠️ No music files found.');
          setTracks([]);
          return;
        }

        // 5️⃣ Load & start playback
        await TrackPlayer.reset();
        await TrackPlayer.add(localTracks);
        await TrackPlayer.play();
        setTracks(localTracks);
        console.log(`🎶 Loaded ${localTracks.length} tracks`);
      } catch (error) {
        console.error('💥 Error during setup:', error);
      }
    };

    setup();

    return () => {};
  }, [scanLocalAudio]);

  return tracks;
};
