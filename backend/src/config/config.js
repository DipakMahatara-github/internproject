import dotenv from 'dotenv';

dotenv.config();
console.log("Loaded config:", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT);

export const config = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'interndb',
    port: Number(process.env.DB_PORT) || 5432
  },
  jwtSecret: process.env.JWT_SECRET || 'changeme'
};
