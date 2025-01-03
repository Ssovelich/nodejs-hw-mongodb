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
