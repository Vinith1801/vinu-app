import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {usePlayer} from '../providers/PlayerProvider';
import {PlayCircle, Music2} from 'lucide-react-native';

export const LibraryScreen = () => {
  const {queue, currentTrack, isPlaying, skipTo} = usePlayer();

  const handlePlayTrack = async (index: number) => {
    await skipTo(index);
  };

  if (!queue || queue.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTracks}>No tracks found.</Text>
      </View>
    );
  }

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isCurrent =
      currentTrack && item.id === currentTrack.id && isPlaying;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrent && styles.activeTrack]}
        onPress={() => handlePlayTrack(index)}>
        {item.artwork ? (
          <Image source={{uri: item.artwork}} style={styles.artwork} />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Music2 size={18} color="#777" />
          </View>
        )}

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title || 'Unknown Title'}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist || 'Unknown Artist'}
          </Text>
        </View>

        <PlayCircle size={22} color={isCurrent ? '#1DB954' : '#888'} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={queue}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}}
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
  noTracks: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  activeTrack: {
    backgroundColor: '#151515',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
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
  artwork: {
    width: 42,
    height: 42,
    borderRadius: 6,
  },
  artworkPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
