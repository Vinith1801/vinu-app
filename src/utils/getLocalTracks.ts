import RNFS from 'react-native-fs';

export const getLocalTracks = async () => {
  const musicDir = RNFS.ExternalStorageDirectoryPath + '/Music'; // Android default
  try {
    const files = await RNFS.readDir(musicDir);
    const audioFiles = files.filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav'));

    return audioFiles.map(file => ({
      id: file.path,
      url: 'file://' + file.path,
      title: file.name.replace(/\.(mp3|wav)$/i, ''),
      artist: 'Unknown Artist',
    }));
  } catch (e) {
    console.log('Error reading local tracks:', e);
    return [];
  }
};
