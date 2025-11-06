import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Music2, PlayCircle} from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';

interface Track {
  title: string;
  artist?: string;
  artwork?: string;
  url: string;
}

interface TrackListProps {
  tracks: Track[];
}

export const TrackList = ({tracks}: TrackListProps) => {
  const handlePlayTrack = async (track: Track, index: number) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    } catch (err) {
      console.log('⚠️ Error playing track:', err);
    }
  };

  if (!tracks.length) {
    return <Text style={styles.noMusic}>No music files found.</Text>;
  }

  const renderItem = ({item, index}: {item: Track; index: number}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      onPress={() => handlePlayTrack(item, index)}>
      {/* Album Art or Placeholder */}
      {item.artwork ? (
        <Image source={{uri: item.artwork}} style={styles.artwork} />
      ) : (
        <View style={styles.artworkPlaceholder}>
          <Music2 size={18} color="#777" />
        </View>
      )}

      {/* Track Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || 'Unknown Title'}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist || 'Unknown Artist'}
        </Text>
      </View>

      {/* Play Icon */}
      <PlayCircle size={22} color="#1db954" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tracks}
      keyExtractor={(_, i) => i.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 80,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 12,
  },
  artworkPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  artist: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  noMusic: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});
