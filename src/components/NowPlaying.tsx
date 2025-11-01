import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  State,
  usePlaybackState,
} from 'react-native-track-player';

export const NowPlaying = () => {
  const {position, duration} = useProgress(500); // updates every 500ms
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  useEffect(() => {
    if (track) {
      setTitle(track.title || 'Unknown Title');
      setArtist(track.artist || 'Unknown Artist');
    } else {
      setTitle('No Track Playing');
      setArtist('');
    }
  }, [track]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progressWidth =
    duration > 0 ? `${(position / duration) * 100}%` : '0%';

  return (
    <View style={styles.container}>
      <Text style={styles.trackTitle}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progress, {width: progressWidth}]} />
      </View>

      <Text style={styles.timeText}>
        {formatTime(position)} / {formatTime(duration)}
      </Text>

      <Text style={styles.stateText}>
        {playbackState === State.Playing
          ? '▶️ Playing'
          : playbackState === State.Paused
          ? '⏸️ Paused'
          : '⏹️ Stopped'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 4,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1db954',
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  stateText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});
