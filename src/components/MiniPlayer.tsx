import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import TrackPlayer, {usePlaybackState, useTrackPlayerEvents, Event} from 'react-native-track-player';
import {Play, Pause, ChevronUp} from 'lucide-react-native';

const {height} = Dimensions.get('window');
const MIN_HEIGHT = 70;
const MAX_HEIGHT = height * 0.8;

export const MiniPlayer = () => {
  const [track, setTrack] = useState<any>(null);
  const playback = usePlaybackState();

  const translateY = useSharedValue(MAX_HEIGHT - MIN_HEIGHT);

  // Listen to current track
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const info = await TrackPlayer.getTrack(event.nextTrack);
      setTrack(info);
    }
  });

  const expandGesture = Gesture.Pan()
    .onChange(e => {
      translateY.value = Math.max(0, Math.min(MAX_HEIGHT - MIN_HEIGHT, translateY.value + e.changeY));
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

  const togglePlay = async () => {
    const state = await TrackPlayer.getState();
    if (state === 'playing') await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  return (
    <GestureDetector gesture={expandGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.header}
          onPress={() =>
            (translateY.value = withSpring(translateY.value === 0 ? MAX_HEIGHT - MIN_HEIGHT : 0))
          }>
          <ChevronUp color="#fff" />
          <Text style={styles.title} numberOfLines={1}>
            {track?.title || 'Nothing Playing'}
          </Text>
          <TouchableOpacity onPress={togglePlay}>
            {playback === 'playing' ? <Pause color="#fff" /> : <Play color="#fff" />}
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Full Player View */}
        <View style={styles.fullView}>
          <Text style={styles.trackInfo}>{track?.artist}</Text>
          {/* Add PlayerControls or NowPlaying here if you want */}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#222',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    height: MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {color: '#fff', fontSize: 16, flex: 1, marginHorizontal: 12},
  fullView: {
    height: MAX_HEIGHT - MIN_HEIGHT,
    padding: 20,
    backgroundColor: '#111',
  },
  trackInfo: {color: '#aaa', fontSize: 14, marginBottom: 20},
});
