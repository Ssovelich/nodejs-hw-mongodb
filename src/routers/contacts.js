import { Router } from 'express';

import * as ContactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(ContactsController.getContactsController));

contactsRouter.get(
  '/:id',
  ctrlWrapper(ContactsController.getContactByIdController),
);

contactsRouter.post('/', ctrlWrapper(ContactsController.addContactController));

// upsert = update + insert (якщо є об'єкт з таким id, то він оновлюється,
// якщо немає, то створюється новий об'єкт з таким id)
contactsRouter.put(
  '/:id',
  ctrlWrapper(ContactsController.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(ContactsController.patchContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(ContactsController.deleteContactController),
);

export default contactsRouter;
