import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from './utils/getEnvVar.js';
// Імпортуємо всі іменовані імпорти у змінну contactServices
import * as contactServices from './services/contacts.js';

export const setupServer = () => {
  //створення серверу
  const app = express();
  //middleware дозволяє обмін інфою між веб-ресурсами з різних доменів
  app.use(cors());
  //middleware логування
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Додаємо обробник маршруту: /contacts
  app.get('/contacts', async (req, res) => {
    // Робимо запит до бази та отримуємо список контактів
    const data = await contactServices.getContacts();
    // Повертаємо повідомлення про успішну відповідь та списов контактів на фронтенд
    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data,
    });
  });

  // Додаємо обробник маршруту: /contacts/:id
  app.get('/contacts/:id', async (req, res) => {
    // Отримаємо id контакту з параметрів маршруту (req.params)
    const { id } = req.params;
    // Робимо запит до бази та отримуємо відповідний контакт
    const data = await contactServices.getContactById(id);
    // Якщо немає контакту з таким id, повернути статус 404 та повідомлення про це
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id: ${id} not found`,
      });
    }
    // Повертаємо повідомлення про успішну відповідь та відповідний контакт на фронтенд
    res.json({
      status: 200,
      message: `Successfully found contact with id: ${id}`,
      data,
    });
  });

  // middleware для запитів на неіснуючі адреси
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
