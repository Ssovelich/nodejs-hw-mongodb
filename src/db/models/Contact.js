import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from '../hooks.js';

// Створюємо mongo схему
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: 'personal',
      required: true,
    },
  },
  // versionKey: false прибирає додавання версії обєкту
  // timestamps: true додає дату та час створення та оновлення
  { versionKey: false, timestamps: true },
);

//після додавання сталося помилка, вона обробиться
contactSchema.post('save', handleSaveError);
//перед оновленням встанови
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
//підчас оновлення талося помилка, вона обробиться
contactSchema.post('findOneAndUpdate', handleSaveError);

// На основі схеми створюємо модель(клас), який зяв'зується з колекцією "contact"
const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
