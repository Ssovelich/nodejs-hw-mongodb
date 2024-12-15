import ContactCollection from '../db/models/Contact.js';

export const getContacts = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (contactData) =>
  ContactCollection.create(contactData);

// робимо асинхронний (async), бо тут буде кілька операцій
export const updateContact = async (_id, contactData, options = {}) => {
  const { upsert = false } = options;
  // Якщо передати 3-м аргументом об'єкт {new: true,}
  // то буде повертатися оновлений об'єкт
  const result = await ContactCollection.findOneAndUpdate(
    { _id },
    contactData,
    {
      new: true,
      // якщо об'єкт не знадено, то він створиться
      upsert,
      // додаються в об'єкт відповіді додаткові значення
      // для визначення чи додався чи оновився об'єк
      // якщо є поле upserted, то об'єкт було додано
      includeResultMetadata: true,
    },
  );

  if (!result || !result.value) return null;

  // якщо в об'єкті lastErrorObject поле upserted має булеве значення
  const isNew = Boolean(result.lastErrorObject.upserted);

  return {
    isNew,
    data: result.value,
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
