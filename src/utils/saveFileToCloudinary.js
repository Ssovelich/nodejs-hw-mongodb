import cloudinary from 'cloudinary';
import fs from 'fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  // додаємо файл у хмаоне сховище в папку Photos
  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'Photos',
  });
  // Видаляємо файл з папаки temp
  await fs.unlink(file.path);
  return response.secure_url;
};
