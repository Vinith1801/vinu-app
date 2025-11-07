 import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {AppNavigator} from './src/navigation/Navigation';

declare global {
  var _trackPlayerServiceRegistered: boolean;
}

const App = () => {
  return <AppNavigator />;
};

// Ensure TrackPlayer service is registered only once
if (!globalThis._trackPlayerServiceRegistered) {
  TrackPlayer.registerPlaybackService(() => require('./src/services/playerService'));
  globalThis._trackPlayerServiceRegistered = true;
}

export default App;