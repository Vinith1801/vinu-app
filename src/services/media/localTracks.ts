import RNFS from 'react-native-fs';

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.aac', '.flac'];

export async function scanLocalTracks() {
  const dirs = [
    RNFS.MusicDirectoryPath,
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
        console.log(`⚠️ Directory missing: ${dir}`);
        continue;
      }

      const items = await RNFS.readDir(dir);
      for (const f of items) {
        if (
          f.isFile() &&
          AUDIO_EXTENSIONS.some(ext =>
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
      console.log(`⚠️ Failed to scan ${dir}: ${err.message}`);
    }
  }

  return found;
}
