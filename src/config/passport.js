import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userService from '../services/user.service.js';

export default function configurePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findUserById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userService.findByEmail(profile.emails[0].value);
      
      if (!user) {
        const newUser = {
          username: profile.displayName.toLowerCase().replace(/\s/g, ''),
          email: profile.emails[0].value,
          full_name: profile.displayName,
          user_role: 'reader',
          is_active: 0,
          oauth_provider: 'google',
          oauth_id: profile.id
        };
        
        const userId = await userService.addOAuthUser(newUser);
        user = await userService.findUserById(userId);
        user.isNewUser = true;
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}