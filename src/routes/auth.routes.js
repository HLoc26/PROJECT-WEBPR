import express from 'express';
import passport from 'passport';
import userService from '../services/user.service.js';

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    if (req.user.isNewUser) {
      return res.redirect('/auth/register/oauth');
    }
    req.session.user = req.user;
    res.redirect('/homepage');
  }
);

// OAuth registration routes
router.get('/register/oauth', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('vwLogin/RegisterOAuth', {
    layout: 'layouts/login.main.ejs',
    user: req.user,
    error: null
  });
});

router.post('/register/oauth', async (req, res) => {
  try {
    const { username, full_name, dob } = req.body;
    const user = req.user;

    // Update user profile
    await userService.updateUserProfile(user.user_id, {
      username,
      full_name,
      dob: new Date(dob),
      is_active: 1
    });

    // Get updated user data
    const updatedUser = await userService.findUserById(user.user_id);
    req.session.user = updatedUser;

    res.redirect('/homepage');
  } catch (error) {
    console.error('OAuth registration error:', error);
    res.render('vwLogin/RegisterOAuth', {
      layout: 'layouts/login.main.ejs',
      user: req.user,
      error: 'Failed to complete registration'
    });
  }
});

// Facebook OAuth routes
router.get('/facebook', 
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    if (req.user.isNewUser) {
      return res.redirect('/auth/register/oauth');
    }
    req.session.user = req.user;
    res.redirect('/homepage');
  }
);

export default router;