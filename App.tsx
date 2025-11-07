import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import TrackPlayer from 'react-native-track-player';

declare global {
  var _trackPlayerServiceRegistered: boolean;
}
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTrackPlayerSetup} from './src/hooks/useTrackPlayerSetup';
import {useTrackPlayerEventsLogger} from './src/hooks/useTrackPlayerEvents';
import {TrackList} from './src/components/TrackList';
import {NowPlaying} from './src/components/NowPlaying';
import {Header} from './src/components/Header'; // ← new collapsible header

const App = () => {
  const tracks = useTrackPlayerSetup();
  useTrackPlayerEventsLogger();

  const [filteredTracks, setFilteredTracks] = useState(tracks);

  // Keep filteredTracks synced when new tracks load
  useEffect(() => {
    setFilteredTracks(tracks);
  }, [tracks]);

  const handleSearch = (text: string) => {
    const lower = text.toLowerCase();
    const filtered = tracks.filter(
      t =>
        t.title?.toLowerCase().includes(lower) ||
        t.artist?.toLowerCase().includes(lower) ||
        t.album?.toLowerCase().includes(lower),
    );
    setFilteredTracks(filtered);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Header onSearch={handleSearch} />
        <TrackList tracks={filteredTracks} />
      </View>

      {/* Expandable Mini Player (NowPlaying) */}
      <NowPlaying />
    </GestureHandlerRootView>
  );
};

if (!globalThis._trackPlayerServiceRegistered) {
  TrackPlayer.registerPlaybackService(() => require('./src/services/playerService'));
  globalThis._trackPlayerServiceRegistered = true;
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 10,
  },
});
