import knexObj from 'knex';

const knex = knexObj({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',     //database host
    user: 'root',          //MySQL username
    password: '',
    port: 3306,  
    database: 'OnlineNewspaper' //databasename
  },
  pool: { min: 0, max: 10 },
});

export default knex;