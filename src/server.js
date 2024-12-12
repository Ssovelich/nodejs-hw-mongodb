import express from 'express';
import cors from 'cors';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';

import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  //створення серверу
  const app = express();

  //middleware дозволяє обмін інфою між веб-ресурсами з різних доменів
  app.use(cors());

  //middleware логування
  app.use(logger);

  // Якщо прийде запит який починається з /contacts, шукає обробку
  // цього запиту в обє'кті contactsRouter
  app.use('/contacts', contactsRouter);

  // middleware для запитів на неіснуючі адреси
  app.use(notFoundHandler);

  // middleware для обробки помилок
  app.use(errorHandler);

  // PORT - назва змінної оточкення налаштуваня комп'ютера
  // 3000 - значення за замовчуванням
  const port = Number(getEnvVar('PORT', 3000));

  // Запускаємо сервер
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
