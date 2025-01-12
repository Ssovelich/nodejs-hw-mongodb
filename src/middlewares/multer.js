import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

// створюємо налаштування(де зберігати файл та під яким ім'ям)
const storage = multer.diskStorage({
  // destination: TEMP_UPLOAD_DIR,
  destination: function (req, file, cb) {
    // null означає, що помилок немає і вказуємо шляж до папаки в яку треба зберегти(TEMP_UPLOAD_DIR)
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // створюємо унікальний префікс для створення унікальтного імені файлу
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random()*1E9)}`;
    // додаємо префікс до оригінального імені файлу
    const filename = `${uniqueSuffix}_${file.originalname}`;
    cb(null, filename);
  },
});

// створюємо не обовязкове налаштування лімін розміру файлу
const limits = {
  fileSize: 1024 *1024 * 5,
};
// створюємо не обовязкове налаштування фільтруємо збереження exe файлів
const fileFilter = (req, file, cb)=>{
  const extention = file.originalname.split(".").pop();
  if(extention === "exe"){
    return cb(createHttpError(400, "File with .exe extention not allow"));
  }
  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
