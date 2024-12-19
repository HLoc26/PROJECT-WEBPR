import bcrypt from 'bcrypt';
import db from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function isHashedPassword(password) {
  try {
    // bcrypt hashes start with $ and have exactly 3 $ separators
    if (!password.startsWith('$') || password.split('$').length !== 4) {
      return false;
    }
    // Verify it's a valid bcrypt hash by checking rounds
    return bcrypt.getRounds(password) > 0;
  } catch (error) {
    return false; // If getRounds fails, it's not a valid hash
  }
}

async function updatePasswords() {
  try {
    const users = await db('users').select('user_id', 'password');
    const rounds = +process.env.PASSWORD_ROUND || 10;
    
    for (const user of users) {
      // Skip if password is already hashed
      if (await isHashedPassword(user.password)) {
        console.log(`Skipping already hashed password for user ID: ${user.user_id}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, rounds);
      await db('users')
        .where('user_id', user.user_id)
        .update({ password: hashedPassword });
      
      console.log(`Updated password for user ID: ${user.user_id}`);
    }

    console.log('Password update process completed');
    process.exit(0);

  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords();

// run with node scripts/update_passwords.js