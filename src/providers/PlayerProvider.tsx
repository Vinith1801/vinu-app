// src/providers/PlayerProvider.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import TrackPlayer, {
  Event,
  State,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player';

interface PlayerContextType {
  playbackState: State;
  currentTrack?: Track | null;
  queue: Track[];
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  skipTo: (index: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const [playbackState, setPlaybackState] = useState<State>(State.None);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // 🔁 Listen for player events
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackTrackChanged, Event.PlaybackQueueEnded],
    async event => {
      if (event.type === Event.PlaybackState) {
        const state = event.state;

        // 🚫 Ignore short-lived buffering for local files
        if (state === State.Buffering) {
          try {
            const id = await TrackPlayer.getCurrentTrack();
            const current = id != null ? await TrackPlayer.getTrack(id) : null;
            if (current?.url?.startsWith('file://')) {
              console.log('⚙️ Ignoring fake buffering (local track)');
              return;
            }
          } catch (err) {
            console.warn('⚠️ Buffering check failed:', err);
          }
        }

        setPlaybackState(state);

        if ([State.Ready, State.Stopped, State.None].includes(state)) {
          try {
            const q = await TrackPlayer.getQueue();
            if (q && q.length) {
              setQueue(q);
              console.log(`📦 Queue synced (${q.length} tracks)`);
            }
          } catch (err) {
            console.log('⚠️ Queue sync failed:', err);
          }
        }
      } else if (event.type === Event.PlaybackTrackChanged) {
        const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
        setCurrentTrack(nextTrack || null);
      } else if (event.type === Event.PlaybackQueueEnded) {
        console.log('🎵 Queue ended');
      }
    },
  );

  // Initial queue load (retry until initialized)
  useEffect(() => {
    let mounted = true;
    const loadQueueWhenReady = async () => {
      try {
        let attempts = 0;
        while (attempts < 10) {
          try {
            const state = await TrackPlayer.getState();
            if (state !== undefined) break;
          } catch {}
          await new Promise(res => setTimeout(res, 300));
          attempts++;
        }

        const q = await TrackPlayer.getQueue();
        if (mounted && q && q.length > 0) {
          setQueue(q);
          console.log(`📦 Initial queue loaded (${q.length} tracks)`);
        }

        const id = await TrackPlayer.getCurrentTrack();
        if (mounted && id != null) {
          const track = await TrackPlayer.getTrack(id);
          setCurrentTrack(track || null);
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch queue after setup:', err);
      }
    };

    loadQueueWhenReady();
    return () => {
      mounted = false;
    };
  }, []);

  // Playback controls
  const play = async () => {
    try {
      await TrackPlayer.play();
    } catch (err) {
      console.log('⚠️ Error starting playback:', err);
    }
  };

  const pause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.log('⚠️ Error pausing playback:', err);
    }
  };

  const next = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch {
      console.log('⚠️ No next track available');
    }
  };

  const previous = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch {
      console.log('⚠️ No previous track available');
    }
  };

  const skipTo = async (index: number) => {
    try {
      const q = await TrackPlayer.getQueue();
      if (!q || index < 0 || index >= q.length) {
        console.log('⚠️ Invalid track index');
        return;
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      const id = await TrackPlayer.getCurrentTrack();
      if (id != null) {
        const track = await TrackPlayer.getTrack(id);
        setCurrentTrack(track || null);
      }

      console.log(`🎶 Skipped to index: ${index}`);
    } catch (err) {
      console.warn('⚠️ Error skipping to track:', err);
    }
  };

  const isPlaying = playbackState === State.Playing;

  return (
    <PlayerContext.Provider
      value={{
        playbackState,
        currentTrack,
        queue,
        isPlaying,
        play,
        pause,
        next,
        previous,
        skipTo,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
};
