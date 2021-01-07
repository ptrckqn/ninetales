import imageCompression from 'browser-image-compression';
import shortid from 'shortid';
import { storage } from './index';

export const uploadPhoto = async (file, folder) => {
  const id = shortid.generate();
  const regex = /(?:\.([^.]+))?$/;
  const ext = regex.exec(file.name)[1];
  const compressedImage = await imageCompression(file, { maxSizeMB: 1 });

  const filename = `${id}.${ext}`;

  const storageRef = storage.ref(`/${folder}/${filename}}`);
  await storageRef.put(compressedImage);

  const url = await storageRef.getDownloadURL();

  return { id, url, filename };
};
