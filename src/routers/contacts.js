import { Router } from 'express';
import * as ContactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(ContactsController.getContactsController));

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(ContactsController.getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(ContactsController.addContactController),
);

// upsert = update + insert (якщо є об'єкт з таким id, то він оновлюється,
// якщо немає, то створюється новий об'єкт з таким id)
contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(ContactsController.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(ContactsController.patchContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(ContactsController.deleteContactController),
);

export default contactsRouter;
