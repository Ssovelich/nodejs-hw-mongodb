import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const sessionSchems = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

//після додавання сталося помилка, вона обробиться
sessionSchems.post('save', handleSaveError);
//перед оновленням включаємо валідацію
sessionSchems.pre('findOneAndUpdate', setUpdateSettings);
//підчас оновлення талося помилка, вона обробиться
sessionSchems.post('findOneAndUpdate', handleSaveError);

// На основі схеми створюємо модель
const sessionCollection = model('session', sessionSchems);

export default sessionCollection;
