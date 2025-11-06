import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import {SkipBack, SkipForward, Play, Pause, StopCircle} from 'lucide-react-native';

export const PlayerControls = () => {
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsPlaying(playbackState === State.Playing);
  }, [playbackState]);

  const handlePlayPause = async () => {
    try {
      setLoading(true);
      const currentState = await TrackPlayer.getState();
      if (currentState === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (err) {
      console.log('⚠️ handlePlayPause error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch {
      console.log('⚠️ No next track available.');
    }
  };

  const handlePrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch {
      console.log('⚠️ No previous track available.');
    }
  };

  const handleStop = async () => {
    await TrackPlayer.stop();
  };

  return (
    <View style={styles.container}>
      {/* Previous */}
      <TouchableOpacity onPress={handlePrevious} style={styles.button}>
        <SkipBack size={26} color="#ccc" />
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity
        onPress={handlePlayPause}
        style={[styles.button, styles.playButton]}
        activeOpacity={0.7}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : isPlaying ? (
          <Pause size={30} color="#fff" />
        ) : (
          <Play size={30} color="#fff" />
        )}
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <SkipForward size={26} color="#ccc" />
      </TouchableOpacity>

      {/* Stop */}
      <TouchableOpacity onPress={handleStop} style={styles.button}>
        <StopCircle size={24} color="#ff5555" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  button: {
    marginHorizontal: 14,
    padding: 10,
  },
  playButton: {
    backgroundColor: '#1DB954', // Spotify-style green
    borderRadius: 50,
    padding: 14,
    elevation: 4,
  },
});
