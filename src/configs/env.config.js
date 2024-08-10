const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'chat-app',
    user: process.env.DEV_DB_USER,
    pass: process.env.DEV_DB_PASS,
  },
  jwt: {
    key: process.env.DEV_JWT_SECRET_KEY,
    expiresIn: process.env.DEV_JWT_EXPIRES_IN || '1h',
  },
};

const prod = {
  app: {
    port: parseInt(process.env.PROD_APP_PORT) || 80,
  },
  db: {
    host: process.env.PROD_DB_HOST,
    port: parseInt(process.env.PROD_DB_PORT),
    name: process.env.PROD_DB_NAME,
    user: process.env.PROD_DB_USER,
    pass: process.env.PROD_DB_PASS,
  },
  jwt: {
    key: process.env.PROD_JWT_SECRET_KEY,
    expiresIn: process.env.PROD_JWT_EXPIRES_IN || '7d',
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';


module.exports = config[env];
