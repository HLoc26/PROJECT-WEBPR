import bcrypt from 'bcrypt';
import { UserModel } from '../models/users.model.js';
import { generateOTP, sendOTPEmail } from '../utils/emailService.js';

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Email received:', email);

    // Find user
    const user = await UserModel.findByEmail(email);
    console.log(user);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    
    try {
        const hashedOTP = await bcrypt.hash(otp, 10);
        console.log('Hashed OTP:', hashedOTP);
      
        const expiryTime = new Date(Date.now() + 600000); // 10 minutes
        console.log('Expiry Time:', expiryTime);
      
        await UserModel.updateResetToken(email, hashedOTP, expiryTime);
        console.log('Reset token updated in the database');
      
        await sendOTPEmail(email, otp);
        console.log('OTP email sent');
      } catch (error) {
        console.error('Error occurred:', error.message);
      }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in password reset request',
      error: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user || !user.reset_password_otp || 
        new Date(user.reset_password_expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.reset_password_otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset fields
    await UserModel.updatePassword(email, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in password reset',
      error: error.message
    });
  }
};
