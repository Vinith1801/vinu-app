import React, {useEffect, useState} from 'react';
import {View,Text,StyleSheet,Image,TouchableOpacity,Dimensions,} from 'react-native';
import TrackPlayer, {useProgress,useActiveTrack,State,usePlaybackState,} from 'react-native-track-player';
import Animated, {useSharedValue,useAnimatedStyle,withSpring,} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {Music2, Pause, Play, Loader2, ChevronUp, ChevronDown} from 'lucide-react-native';
import {PlayerControls} from './PlayerControls';

const {height} = Dimensions.get('window');
const MIN_HEIGHT = 70;
const MAX_HEIGHT = height * 0.8;

export const NowPlaying = () => {
  const {position, duration} = useProgress(500);
  const track = useActiveTrack();
  const playbackState = usePlaybackState();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const translateY = useSharedValue(MAX_HEIGHT - MIN_HEIGHT);

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

  const progressWidth = duration > 0 ? `${(position / duration) * 100}%` : '0%';

  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isLoading = playbackState === State.Buffering;

  // Gesture for expand/collapse
  const panGesture = Gesture.Pan()
    .onChange(e => {
      translateY.value = Math.max(
        0,
        Math.min(MAX_HEIGHT - MIN_HEIGHT, translateY.value + e.changeY),
      );
    })
    .onEnd(() => {
      if (translateY.value > (MAX_HEIGHT - MIN_HEIGHT) / 2) {
        translateY.value = withSpring(MAX_HEIGHT - MIN_HEIGHT);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const toggleExpand = () => {
    translateY.value = withSpring(
      translateY.value === 0 ? MAX_HEIGHT - MIN_HEIGHT : 0,
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.playerContainer, animatedStyle]}>
        {/* Mini Player Header */}
        <TouchableOpacity style={styles.miniHeader} activeOpacity={0.9} onPress={toggleExpand}>
          {translateY.value === 0 ? (
            <ChevronDown color="#fff" />
          ) : (
            <ChevronUp color="#fff" />
          )}
          <View style={styles.miniInfo}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.miniArtist} numberOfLines={1}>
              {artist}
            </Text>
          </View>
          <TouchableOpacity onPress={togglePlayPause}>
            {isLoading ? (
              <Loader2 size={20} color="#1db954" />
            ) : isPlaying ? (
              <Pause size={22} color="#1db954" />
            ) : (
              <Play size={22} color="#1db954" />
            )}
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Expanded Full Player */}
        <View style={styles.fullPlayer}>
          {/* Artwork */}
          <View style={styles.artworkWrapper}>
            {track?.artwork ? (
              <Image source={{uri: track.artwork}} style={styles.artwork} />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <Music2 size={64} color="#555" />
              </View>
            )}
          </View>

          {/* Song Info */}
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

          {/* Player Controls (your component) */}
          <PlayerControls />

          {/* Playback State Text */}
          <View style={styles.stateRow}>
            {isLoading ? (
              <Loader2 size={18} color="#1db954" />
            ) : isPlaying ? (
              <Pause size={18} color="#1db954" />
            ) : (
              <Play size={18} color="#1db954" />
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
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#111',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  miniHeader: {
    height: MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  miniInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  miniTitle: {color: '#fff', fontSize: 15, fontWeight: '600'},
  miniArtist: {color: '#888', fontSize: 12},
  fullPlayer: {
    height: MAX_HEIGHT - MIN_HEIGHT,
    alignItems: 'center',
    paddingTop: 24,
  },
  artworkWrapper: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  artwork: {width: '100%', height: '100%'},
  artworkPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {alignItems: 'center', marginBottom: 16},
  trackTitle: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  artist: {color: '#aaa', fontSize: 14, marginTop: 2},
  progressContainer: {width: '80%', marginTop: 8},
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {height: '100%', backgroundColor: '#1db954'},
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {color: '#888', fontSize: 11},
  stateRow: {flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8},
  stateText: {color: '#777', fontSize: 13},
});
