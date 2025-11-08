import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import TrackPlayer, {State} from 'react-native-track-player';
import {SkipBack, SkipForward, Play, Pause, StopCircle} from 'lucide-react-native';
import {usePlayer} from '../providers/PlayerProvider';

export const PlayerControls = () => {
  const {playbackState, play, pause, next, previous} = usePlayer();
  const [uiPlaying, setUiPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPlaying = playbackState === State.Playing;
  const isBuffering =
    playbackState === State.Buffering || playbackState === State.Connecting;

  // 🧠 Keep UI in sync with real state when it updates
  React.useEffect(() => {
    setUiPlaying(isPlaying);
  }, [isPlaying]);

  const handlePlayPause = async () => {
    try {
      // ⚡️ Instantly toggle UI for responsiveness
      setUiPlaying(prev => !prev);
      setLoading(true);

      if (isPlaying) await pause();
      else await play();
    } catch (err) {
      console.log('⚠️ handlePlayPause error:', err);
      // rollback UI if command fails
      setUiPlaying(isPlaying);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      await pause();
      await TrackPlayer.seekTo(0);
      setUiPlaying(false);
    } catch (err) {
      console.log('⚠️ handleStop error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={previous} style={styles.button}>
        <SkipBack size={26} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePlayPause}
        style={[styles.button, styles.playButton]}
        activeOpacity={0.7}>
        {loading || isBuffering ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : uiPlaying ? (
          <Pause size={30} color="#fff" />
        ) : (
          <Play size={30} color="#fff" />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={next} style={styles.button}>
        <SkipForward size={26} color="#ccc" />
      </TouchableOpacity>

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
    backgroundColor: '#1DB954',
    borderRadius: 50,
    padding: 14,
    elevation: 4,
  },
});
