import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    // перевіряємо чи є папка
    await fs.access(url);
  } catch (err) {
    // якщо папки енмає, створюємо її
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
