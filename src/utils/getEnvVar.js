import 'dotenv/config';

export const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];

  // якщо є в налаштуваннях комп'ютера порт, то він повертається
  if (value) return value;
  // якщо немає то повертається значеннь за замовчуванням
  if (defaultValue) return defaultValue;

  throw new Error(`Missing ${name} enviroment variable`);
};
