import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import sessionCollection from '../db/models/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/index.js';

import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';

import { getEnvVar } from '../utils/getEnvVar.js';

import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';

import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

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

  const sessionData = createSessionData();

  return await sessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await sessionCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async (payload) => {
  // перевіряємо чи є така сесія
  const oldSession = await sessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  //якщо сесіхї немає, викидаємо помилку
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  //перевіряємо якщо потосний час бильше ніж живе токен, викидаємо помилку
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await sessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return await sessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const getUser = (filter) => UserCollection.findOne(filter);

export const getSession = (filter) => sessionCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const loginOrRegisterWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    const name = getFullNameFromGoogleTokenPayload(payload);
    const password = await bcrypt.hash(randomBytes(10).toString("base64"), 10);
    user = await UserCollection.create({
      email: payload.email,
      name,
      password,
    });
  }

   const sessionData = createSessionData();

  return await sessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

