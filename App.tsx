import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTrackPlayerSetup} from './src/hooks/useTrackPlayerSetup';
import {TrackList} from './src/components/TrackList';
import TrackPlayer, {Event, State, useTrackPlayerEvents} from 'react-native-track-player';

// 🎧 Listen to track player events
const usePlayerEvents = () => {
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], event => {
    if (event.type === Event.PlaybackState) {
      console.log('🎧 Playback state:', event.state);
      if (event.state === State.Playing) console.log('🎵 Now Playing');
      if (event.state === State.Paused) console.log('⏸️ Paused');
    } else if (event.type === Event.PlaybackError) {
      console.error('⚠️ Playback error:', event);
    }
  });
};

const App = () => {
  const tracks = useTrackPlayerSetup();
  usePlayerEvents();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 Offline Music Player</Text>
      <TrackList tracks={tracks} />
    </View>
  );
};

TrackPlayer.registerPlaybackService(() => require('./service'));
export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111', padding: 16},
  header: {fontSize: 18, color: '#fff', marginBottom: 12},
});
