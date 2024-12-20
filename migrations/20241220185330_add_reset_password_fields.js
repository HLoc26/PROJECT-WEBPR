/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.table('users', table => {
      table.string('reset_password_otp');
      table.timestamp('reset_password_expires');
    });
  }
  
  export function down(knex) {
    return knex.schema.table('users', table => {
      table.dropColumn('reset_password_otp');
      table.dropColumn('reset_password_expires');
    });
  }
