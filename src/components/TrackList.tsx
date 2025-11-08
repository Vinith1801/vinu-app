import React, {useEffect, useState} from 'react';
import {FlatList,Text,View,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native';
import {Music2, PlayCircle} from 'lucide-react-native';
import TrackPlayer, {Track} from 'react-native-track-player';

interface TrackListProps {
  tracks?: Track[];
}

export const TrackList = ({tracks}: TrackListProps) => {
  const [queue, setQueue] = useState<Track[] | null>(tracks || null);
  const [loading, setLoading] = useState(!tracks);

  // 🔁 If no tracks prop provided, fetch from TrackPlayer queue
  useEffect(() => {
    const fetchQueue = async () => {
      if (!tracks) {
        try {
          const currentQueue = await TrackPlayer.getQueue();
          setQueue(currentQueue);
        } catch (err) {
          console.log('⚠️ Error fetching queue:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQueue();
  }, [tracks]);

  const handlePlayTrack = async (track: Track, index: number) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(queue || []);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    } catch (err) {
      console.log('⚠️ Error playing track:', err);
    }
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1DB954" />
        <Text style={styles.loadingText}>Loading tracks...</Text>
      </View>
    );
  }

  // ⚠️ Empty State
  if (!queue || queue.length === 0) {
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
      data={queue}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#aaa',
    marginLeft: 10,
  },
});
