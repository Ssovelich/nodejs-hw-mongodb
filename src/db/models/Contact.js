import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';
import { typeList } from '../../constants/index.js';

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    photo: {
       type: String
    },
  },
  // versionKey: false прибирає додавання версії обєкту
  // timestamps: true додає дату та час створення та оновлення
  { versionKey: false, timestamps: true },
);

//після додавання сталося помилка, вона обробиться
contactSchema.post('save', handleSaveError);
//перед оновленням включаємо валідацію
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
//підчас оновлення талося помилка, вона обробиться
contactSchema.post('findOneAndUpdate', handleSaveError);

// На основі схеми створюємо модель(клас), який зяв'зується з колекцією "contact"
const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
