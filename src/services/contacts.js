import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 4,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where(`isFavourite`).equals(filter.isFavourite);
  }
  if (filter.userId) {
    contactsQuery.where(`userId`).equals(filter.userId);
  }
  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.find().merge(contactsQuery).countDocuments(),

    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const getContact = (filter) => ContactCollection.findOne(filter);

export const addContact = (contactData) =>
  ContactCollection.create(contactData);

// робимо асинхронний (async), бо тут буде кілька операцій
export const updateContact = async (filter, contactData, options = {}) => {
  const { upsert = false } = options;
  // Якщо передати 3-м аргументом об'єкт {new: true,}
  // то буде повертатися оновлений об'єкт
  const result = await ContactCollection.findOneAndUpdate(filter, contactData, {
    // якщо об'єкт не знадено, то він створиться
    upsert,
    // додаються в об'єкт відповіді додаткові значення
    // для визначення чи додався чи оновився об'єк
    // якщо є поле upserted, то об'єкт було додано
    includeResultMetadata: true,
  });

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
