import {useCallback} from 'react';
import RNFS from 'react-native-fs';

export const useLocalTracks = () => {
  const scanLocalAudio = useCallback(async () => {
    const extensions = ['.mp3', '.m4a', '.wav', '.aac', '.flac'];

    const dirs = [
      RNFS.DocumentDirectoryPath,
      RNFS.DownloadDirectoryPath,
      RNFS.ExternalStorageDirectoryPath
        ? RNFS.ExternalStorageDirectoryPath + '/Music'
        : undefined,
    ].filter(Boolean) as string[];

    const found: any[] = [];

    for (const dir of dirs) {
      try {
        const exists = await RNFS.exists(dir);
        if (!exists) {
          console.log(`⚠️ Directory missing, creating: ${dir}`);
          await RNFS.mkdir(dir);
        }

        const items = await RNFS.readDir(dir);
        for (const f of items) {
          if (
            f.isFile() &&
            extensions.some(ext =>
              f.name.toLowerCase().endsWith(ext.toLowerCase()),
            )
          ) {
            found.push({
              id: f.path,
              url: 'file://' + f.path,
              title: f.name.replace(/\.[^/.]+$/, ''),
              artist: 'Local File',
            });
          }
        }
      } catch (err: any) {
        console.log(`⚠️ Cannot read directory ${dir}:`, err.message);
      }
    }

    return found;
  }, []);

  return {scanLocalAudio};
};
