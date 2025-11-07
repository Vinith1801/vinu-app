import React, {useState} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Animated,} from 'react-native';
import {Search, Settings, X} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

export const Header = ({onSearch}: {onSearch?: (text: string) => void}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
    const navigation = useNavigation<any>();

  const heightAnim = new Animated.Value(searchVisible ? 90 : 60);

  const toggleSearch = () => {
    setSearchVisible(prev => !prev);
    Animated.timing(heightAnim, {
      toValue: !searchVisible ? 90 : 60,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearch) onSearch(text);
  };

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>🎵 My Library</Text>

        <View style={styles.iconRow}>
          {/* Search Toggle */}
          <TouchableOpacity onPress={toggleSearch} style={styles.iconBtn}>
            {searchVisible ? <X size={22} color="#fff" /> : <Search size={22} color="#fff" />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsScreen')}
            style={styles.iconBtn}>
            <Settings size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            value={searchText}
            onChangeText={handleSearchChange}
            placeholder="Search songs, albums..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 8,
  },
  searchContainer: {
    marginTop: 10,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
});