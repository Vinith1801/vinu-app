import {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import {setupPlayer} from '../services/player/setupPlayer';

export const useSetupTrackPlayer = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) setIsReady(true);
    };

    init();
  }, []);

  return isReady;
};
