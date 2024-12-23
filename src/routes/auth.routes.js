import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/homepage'
  })
);

// Facebook OAuth routes  
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/homepage'
  })
);

export default router;