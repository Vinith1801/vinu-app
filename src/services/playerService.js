// src/services/playerService.js
const TrackPlayer = require('react-native-track-player').default;
const {Event} = require('react-native-track-player');

module.exports = async function () {
  console.log('🎧 Background service started');

  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext().catch(() => console.log('⚠️ No next track available')),
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious().catch(() => console.log('⚠️ No previous track available')),
  );
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());
};
