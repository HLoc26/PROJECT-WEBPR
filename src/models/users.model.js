import knex from '../config/db.js';

export const UserModel = {
  // Find user by email
  findByEmail: async (email) => {
    return await knex('users').where({ email }).first();
  },

  // Update user's OTP and expiry
  updateResetToken: async (email, hashedOTP, expiryTime) => {
    return await knex('users')
      .where({ email })
      .update({
        reset_password_otp: hashedOTP,
        reset_password_expires: expiryTime
      });
  },

  // Update password and clear reset tokens
  updatePassword: async (email, hashedPassword) => {
    return await knex('users')
      .where({ email })
      .update({
        password: hashedPassword,
        reset_password_otp: null,
        reset_password_expires: null
      });
  }
};
