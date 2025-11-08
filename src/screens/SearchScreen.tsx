import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {usePlayer} from '../providers/PlayerProvider';
import {Search, ArrowLeft, Music2, PlayCircle} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

export const SearchScreen = () => {
  const {queue, skipTo, currentTrack, isPlaying} = usePlayer();
  const [query, setQuery] = useState('');
  const navigation = useNavigation<any>();

  // 🔍 Filter queue in real-time (case-insensitive)
  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter(
      t =>
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q),
    );
  }, [queue, query]);

  const handlePlay = async (index: number) => {
    Keyboard.dismiss();
    await skipTo(index);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isCurrent = currentTrack?.id === item.id && isPlaying;
    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrent && styles.activeTrack]}
        onPress={() => handlePlay(index)}>
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
        <PlayCircle
          size={22}
          color={isCurrent ? '#1DB954' : '#999'}
          style={{marginRight: 6}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Search size={18} color="#ccc" style={{marginRight: 8}} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search songs or artists..."
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>
      </View>

      {/* Results */}
      {filteredTracks.length === 0 ? (
        <Text style={styles.noResults}>No tracks found.</Text>
      ) : (
        <FlatList
          data={filteredTracks}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 100}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  activeTrack: {
    backgroundColor: '#151515',
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
  noResults: {
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
