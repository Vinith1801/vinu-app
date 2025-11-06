import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import {Music2, Pause, Play, Loader2} from 'lucide-react-native';

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

  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isLoading = playbackState === State.Buffering;

  return (
    <View style={styles.container}>
      {/* Album Art */}
      <View style={styles.artworkWrapper}>
        {track?.artwork ? (
          <Image source={{uri: track.artwork}} style={styles.artwork} />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Music2 size={32} color="#555" />
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.infoSection}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, {width: progressWidth}]} />
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Playback State Indicator */}
      <View style={styles.statusRow}>
        {isLoading ? (
          <Loader2 size={18} color="#1db954" />
        ) : isPlaying ? (
          <Play size={18} color="#1db954" />
        ) : isPaused ? (
          <Pause size={18} color="#ccc" />
        ) : (
          <Music2 size={18} color="#666" />
        )}
        <Text style={styles.stateText}>
          {isPlaying
            ? 'Playing'
            : isPaused
            ? 'Paused'
            : isLoading
            ? 'Loading...'
            : 'Stopped'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    marginHorizontal: 16,
    elevation: 2,
  },
  artworkWrapper: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  artworkPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  progressContainer: {
    width: '85%',
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1db954',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#888',
    fontSize: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  stateText: {
    color: '#777',
    fontSize: 12,
  },
});
