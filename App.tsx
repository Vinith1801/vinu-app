import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const App = () => {
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        console.log('Track Player initialized successfully');
      } catch (error) {
        console.log('Error setting up track player:', error);
      }
    };
    setupPlayer();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Music App - Ready!</Text>
    </View>
  );
};

// Register playback service
TrackPlayer.registerPlaybackService(() => require('./service'));

export default App;