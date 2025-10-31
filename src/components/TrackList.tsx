import React from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';

interface TrackListProps {
  tracks: Array<{title: string}>;
}

export const TrackList = ({tracks}: TrackListProps) => {
  if (!tracks.length) {
    return <Text style={styles.noMusic}>No music files found.</Text>;
  }

  return (
    <View>
      <FlatList
        data={tracks}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item}) => <Text style={styles.trackText}>{item.title}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  trackText: {color: '#ccc', marginVertical: 4},
  noMusic: {color: '#888', textAlign: 'center', marginTop: 20},
});
