// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
      client: 'mysql2', // Use 'mysql2' or 'mysql' package
      connection: {
          host: '127.0.0.1', // Database host
          user: 'root', // Database user
          password: '', // Database password
          database: 'onlinenewspaper' // Database name
      },
      migrations: {
          directory: './src/migrations' // Directory for migration files
      },
      seeds: {
          directory: './seeds' // Directory for seed files
      }
  },

  production: {
      client: 'mysql2',
      connection: {
          host: 'your_production_host',
          user: 'your_production_user',
          password: 'your_production_password',
          database: 'your_production_database'
      },
      migrations: {
          directory: './src/migrations'
      },
      seeds: {
          directory: './seeds'
      }
  }
};

