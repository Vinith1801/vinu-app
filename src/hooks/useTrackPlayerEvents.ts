import {useTrackPlayerEvents, Event, State} from 'react-native-track-player';

export const useTrackPlayerEventsLogger = () => {
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], event => {
    if (event.type === Event.PlaybackState) {
      console.log('🎧 Playback state:', event.state);
      if (event.state === State.Playing) console.log('🎵 Now Playing');
      if (event.state === State.Paused) console.log('⏸️ Paused');
    } else if (event.type === Event.PlaybackError) {
      console.error('⚠️ Playback error:', event);
    }
  });
};
