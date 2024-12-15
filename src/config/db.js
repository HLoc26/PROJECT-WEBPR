import knexObj from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knex = knexObj({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,  
    port: process.env.DB_PORT,    
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 10 },
});

export default knex;