import TrackPlayer, {Capability} from 'react-native-track-player';
import {PermissionsAndroid, Platform} from 'react-native';
import {scanLocalTracks} from '../media/localTracks';

let initialized = false;

export async function setupPlayer() {
  if (initialized) {
    console.log('⚙️ TrackPlayer already initialized.');
    return;
  }

  try {
    // 1️⃣ Request permissions (Android only)
    if (Platform.OS === 'android') {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('❌ Storage permission denied.');
        return;
      }
    }

    // 2️⃣ Setup player
    await TrackPlayer.setupPlayer();
    initialized = true;
    console.log('✅ Track Player ready');

    // 3️⃣ Configure playback capabilities
    await TrackPlayer.updateOptions({
      alwaysPauseOnInterruption: true,
      progressUpdateEventInterval: 1,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
    });

    // 4️⃣ Load local tracks
    const localTracks = await scanLocalTracks();
    if (!localTracks || localTracks.length === 0) {
      console.warn('⚠️ No local tracks found.');
      return;
    }

    // 5️⃣ Add to queue
    await TrackPlayer.reset();
    await TrackPlayer.add(localTracks);

    console.log(`🎶 Loaded ${localTracks.length} tracks`);
  } catch (err) {
    console.error('💥 Error setting up TrackPlayer:', err);
  }
}
