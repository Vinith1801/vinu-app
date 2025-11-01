import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {useTrackPlayerSetup} from './src/hooks/useTrackPlayerSetup';
import {useTrackPlayerEventsLogger} from './src/hooks/useTrackPlayerEvents';
import {TrackList} from './src/components/TrackList';
import {PlayerControls} from './src/components/PlayerControls';
import {NowPlaying} from './src/components/NowPlaying';

const App = () => {
  const tracks = useTrackPlayerSetup();
  useTrackPlayerEventsLogger();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 Offline Music Player</Text>
      <NowPlaying />
      <PlayerControls />
      <TrackList tracks={tracks} />
    </View>
  );
};

TrackPlayer.registerPlaybackService(() => require('./src/services/playerService'));
export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111', padding: 16},
  header: {fontSize: 18, color: '#fff', marginBottom: 12},
});
