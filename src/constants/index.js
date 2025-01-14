import path from 'node:path';


export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const typeList = ['work', 'home', 'personal'];

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//час життя accessToken 15 хвилин
export const accessTokenLifetime = 1000 * 60 * 15;

//час життя refreshToken 30 днів
export const refreshTokenLifetime = 1000 * 60 * 60 * 24 * 30;


export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};


export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
