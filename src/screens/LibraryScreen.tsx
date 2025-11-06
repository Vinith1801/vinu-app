// src/screens/LibraryScreen.tsx
import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useTrackPlayerSetup} from '../hooks/useTrackPlayerSetup';
import TrackPlayer from 'react-native-track-player';

export const LibraryScreen = () => {
  const tracks = useTrackPlayerSetup();

  const handlePlay = async (track: any) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  };

  const renderTrack = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.trackItem} onPress={() => handlePlay(item)}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist || 'Unknown Artist'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTrack}
        contentContainerStyle={{paddingBottom: 80}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 8,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtist: {
    color: '#999',
    fontSize: 14,
  },
});
