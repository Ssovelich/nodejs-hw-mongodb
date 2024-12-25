import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import sessionCollection from '../db/models/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/index.js';

export const register = async (payload) => {
  //додається email та password нового користувача
  const { email, password } = payload;
  //перевіряється чи є користувач з таким email
  const user = await UserCollection.findOne({ email });
  //якщо є то викидається помилка, з повідомленням
  if (user) {
    throw createHttpError(409, 'This email is already in use!');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  // при додаванні користувача, в поле пароло додається захешована версія пароля
  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  return newUser;
};

export const login = async ({ email, password }) => {
  //перевірка чи є користувачь з таким email
  const user = await UserCollection.findOne({ email });
  //якщо немає, то викидається помилка з поведомленням
  if (!user) {
    throw createHttpError(401, 'Email or password invalid!');
  }
  // перевірка чи зпівпадає пароль що прийшов з зашешованою версією яка є в базі
  const passwordCompare = await bcrypt.compare(password, user.password);
  //якщо паролі не співпадяють, викидається помилка
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid!');
  }
  //коли відбувається логін, попередня сесія видаляється
  await sessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  });
};
