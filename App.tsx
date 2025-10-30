import React, {useEffect} from 'react';
import {View, Text, PermissionsAndroid, Platform} from 'react-native';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
  State,
} from 'react-native-track-player';

const App = () => {
  // Hook-based event listener (replaces addEventListener in v4+)
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], event => {
    if (event.type === Event.PlaybackState) {
      console.log('Playback state changed:', event.state);
      if (event.state === State.Playing) console.log('🎵 Now Playing');
      if (event.state === State.Paused) console.log('⏸️ Paused');
    }

    if (event.type === Event.PlaybackError) {
      console.error('Playback error:', { code: event.code, message: event.message });
    }
  });

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        // Request storage/audio permission
        if (Platform.OS === 'android') {
          if (Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
              {
                title: 'Access to Music Files',
                message:
                  'This app needs access to your local music files to play them offline.',
                buttonPositive: 'OK',
              },
            );
            console.log('READ_MEDIA_AUDIO permission:', granted);
          } else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission',
                message:
                  'This app needs access to your storage to read music files.',
                buttonPositive: 'OK',
              },
            );
            console.log('READ_EXTERNAL_STORAGE permission:', granted);
          }
        }

        console.log('🎧 Track Player configured.');
      } catch (error) {
        console.error('❌ Error setting up Track Player:', error);
      }
    };

    setupPlayer();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>🎶 Music App - Ready!</Text>
    </View>
  );
};

// Register background playback service
TrackPlayer.registerPlaybackService(() => require('./service'));

export default App;
