import User from './database/User';
import { ConnectionOptions } from 'typeorm';
import Token from './database/Token';

const databaseCredentials: ConnectionOptions = {
  type: (process.env.DB_TYPE as any) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'hexagon',
  entities: [User, Token],
  synchronize: true,
  logging: false,
};

export default databaseCredentials;
