import createError from 'http-errors';

// Імпортуємо всі іменовані імпорти у змінну contactServices
import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  // Робимо запит до бази та отримуємо список контактів
  const data = await contactServices.getContacts();
  // Повертаємо повідомлення про успішну відповідь та списов контактів на фронтенд
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  // Отримаємо id контакту з параметрів маршруту (req.params)
  const { id } = req.params;
  // Робимо запит до бази та отримуємо відповідний контакт
  const data = await contactServices.getContactById(id);

  if (!data) {
    //Викликаємо помилку з певним статусом на повідомленням за допомогою npm пакету
    throw createError(404, `Contact with id: ${id} not found`);
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
    message: `Successfully found contact with id: ${id}`,
    data,
  });
};
