import {useProgress} from 'react-native-track-player';

export const usePlayerProgress = (updateInterval = 500) => {
  const {position, duration, buffered} = useProgress(updateInterval);
  return {
    position,
    duration,
    buffered,
    progress: duration > 0 ? position / duration : 0,
  };
};
