import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import RNFS from 'react-native-fs';

const App = () => {
  const [tracks, setTracks] = useState([]);

  // 🎧 Listen for playback state and errors
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], event => {
    if (event.type === Event.PlaybackState) {
      console.log('🎧 Playback state:', event.state);
      if (event.state === State.Playing) console.log('🎵 Now Playing');
      if (event.state === State.Paused) console.log('⏸️ Paused');
    } else if (event.type === Event.PlaybackError) {
      console.error('⚠️ Playback error:', event);
    }
  });

  useEffect(() => {
    const setup = async () => {
      try {
        // 1️⃣ Request permissions
        if (Platform.OS === 'android') {
          const granted =
            Platform.Version >= 33
              ? await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                  {
                    title: 'Access to Music Files',
                    message:
                      'This app needs access to your music files to play them offline.',
                    buttonPositive: 'OK',
                  },
                )
              : await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  {
                    title: 'Storage Permission',
                    message:
                      'This app needs access to your storage to read music files.',
                    buttonPositive: 'OK',
                  },
                );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('❌ Storage permission denied.');
            return;
          }
        }

        // 2️⃣ Initialize Track Player
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
        });
        console.log('✅ Track Player ready');

        // 3️⃣ Scan for local audio
        const localTracks = await scanLocalAudio();
        if (localTracks.length === 0) {
          console.warn('⚠️ No music files found.');
          setTracks([]);
          return;
        }

        // 4️⃣ Load & play
        await TrackPlayer.reset();
        await TrackPlayer.add(localTracks);
        console.log(`🎶 Loaded ${localTracks.length} tracks`);
        await TrackPlayer.play();
        setTracks(localTracks);
      } catch (error) {
        console.error('💥 Error during setup:', error);
      }
    };

    setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 Offline Music Player</Text>
      {tracks.length > 0 ? (
        <FlatList
          data={tracks}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item}) => (
            <Text style={styles.trackText}>{item.title}</Text>
          )}
        />
      ) : (
        <Text style={styles.noMusic}>No music files found.</Text>
      )}
    </View>
  );
};

// Required for background control
TrackPlayer.registerPlaybackService(() => require('./service'));
export default App;

//
// ============================
// 📁 Local Audio Scanner
// ============================
async function scanLocalAudio() {
  const extensions = ['.mp3', '.m4a', '.wav', '.aac', '.flac'];

  // Filter out undefined RNFS paths
  const dirs = [
    RNFS.MusicDirectoryPath,
    RNFS.DownloadDirectoryPath,
    RNFS.ExternalStorageDirectoryPath
      ? RNFS.ExternalStorageDirectoryPath + '/Music'
      : undefined,
  ].filter(Boolean);

  const found = [];

  for (const dir of dirs) {
    try {
      // Create dir if it doesn’t exist
      const exists = await RNFS.exists(dir);
      if (!exists) {
        console.log(`⚠️ Directory missing, creating: ${dir}`);
        await RNFS.mkdir(dir);
      }

      const items = await RNFS.readDir(dir);

      for (const f of items) {
        if (
          f.isFile() &&
          extensions.some(ext =>
            f.name.toLowerCase().endsWith(ext.toLowerCase()),
          )
        ) {
          found.push({
            id: f.path,
            url: 'file://' + f.path,
            title: f.name.replace(/\.[^/.]+$/, ''),
            artist: 'Local File',
          });
        }
      }
    } catch (err) {
      console.log(`⚠️ Cannot read directory ${dir}:`, err.message);
    }
  }

  return found;
}

//
// ============================
// 🎨 Styles
// ============================
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111', padding: 16},
  header: {fontSize: 18, color: '#fff', marginBottom: 12},
  trackText: {color: '#ccc', marginVertical: 4},
  noMusic: {color: '#888', textAlign: 'center', marginTop: 20},
});
