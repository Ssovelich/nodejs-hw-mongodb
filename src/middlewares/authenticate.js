import createHttpError from 'http-errors';
import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  //   const { athorization } = req.headers;
  const authHeader = req.get('Authorization');
  //переверяємо чи переданий заголовок
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header not found'));
  }
  //якщо заголовок є, ділемо його на 2 слова
  const [bearer, accessToken] = authHeader.split(' ');
  //та перевіряємо, якщо перше слово не bearer, викидаємо помилку
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must be Bearer type'));
  }
  //перевіряємо чи є взагалі така сесія
  const session = await getSession({ accessToken });
  // якщо такої сесії немає, відправляємо помилку
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  //перевіряємо чи не закінчився час дії токену, якщо закінчився відправляємо помилку
  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }
  //перевіряємо чи є користувач з таким id
  const user = await getUser({ _id: session.userId });
  //якщо такого користувача немає, викидаємо помилку
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  //якщо всі перевірки продено викликаємо next
  next();
};
