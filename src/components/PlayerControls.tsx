import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';

export const PlayerControls = () => {
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(playbackState === State.Playing);
  }, [playbackState]);

  const handlePlayPause = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
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
      <TouchableOpacity onPress={handlePrevious} style={styles.button}>
        <Text style={styles.icon}>⏮️</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
        <Text style={styles.icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.icon}>⏭️</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleStop} style={styles.button}>
        <Text style={styles.icon}>⏹️</Text>
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
    marginHorizontal: 10,
    padding: 8,
  },
  icon: {
    fontSize: 26,
    color: '#fff',
  },
});
