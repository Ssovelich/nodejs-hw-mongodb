import createError from 'http-errors';
// Імпортуємо всі іменовані імпорти у змінну contactServices
import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  //дописуємо поле id у філтьтр
  filter.userId = req.user._id;
  // Робимо запит до бази та отримуємо список контактів
  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  // Повертаємо повідомлення про успішну відповідь та списов контактів на фронтенд
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  //отримуємо userId
  const { _id: userId } = req.user;
  // Отримаємо id контакту з параметрів маршруту (req.params)
  const { id: _id } = req.params;
  // Робимо запит до бази та отримуємо відповідний контакт
  const data = await contactServices.getContact({ _id, userId });

  if (!data) {
    //Викликаємо помилку з певним статусом на повідомленням за допомогою npm пакету
    throw createError(404, `Contact with id: ${_id} not found`);
    // // Якщо немає контакту з таким id, створюємо помилку зі статусом 404
    // // та відповідним текстом
    // const error = new Error(`Contact with id: ${id} not found`);
    // // додаємо до помилки статут 404
    // error.status = 404;
    // // прокидаємо помилку
    // throw error;
  }
  // Повертаємо повідомлення про успішну відповідь та відповідний контакт на фронтенд
  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  // Отримуємо данні з тіла запиту
  const data = await contactServices.addContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  // Отримаємо id контакту з параметрів маршруту (req.params)
  const { id: _id } = req.params;
  //отримоєму id користувача
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  // Робимо запит до бази та отримуємо відповідний контакт (передається id та тіло запиту)
  // {upsert: true,} - додає новий об'єкт якщо такого об'єкту немає
  // Якщо isNew = true, то об'єкт додано
  const { isNew, data } = await contactServices.updateContact(
    { _id, userId },
    { ...req.body, userId, photo: photoUrl },
    {upsert: true},
  );

  // Якщо isNew = true, то статус 201 інакше 200
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upsert a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  // Отримаємо id контакту з параметрів маршруту (req.params)
  const { id: _id } = req.params;
  //отримоєму id користувача
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  // Робимо запит до бази та отримуємо відповідний контакт (передається id та тіло запиту)
  const result = await contactServices.updateContact({ _id, userId }, {...req.body, photo: photoUrl});

  if (!result) {
    throw createError(404, `Contact with id: ${_id} not found`);
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  // Отримаємо id контакту з параметрів маршруту (req.params)
  const { id: _id } = req.params;
  //отримоєму id користувача
  const { _id: userId } = req.user;
  // Робимо запит до бази та отримуємо відповідний контакт (передається id та тіло запиту)
  const data = await contactServices.deleteContact({ _id, userId });

  if (!data) {
    throw createError(404, `Contact with id: ${_id} not found`);
  }
  res.status(204).send();
};
