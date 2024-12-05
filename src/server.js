import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  //створення серверу
  const app = express();
  //middleware дозволяє обмін інфою між веб-ресурсами з різних доменів
  app.use(cors);
  //middleware логування
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Start' });
  });

  //middleware для запитів на неіснуючі адреси
  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  // PORT - назва змінної оточкення налаштуваня комп'ютера
  // 3000 - значення за замовчуванням
  const port = Number(getEnvVar('PORT', 3000));
  // Запускаємо сервер
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
