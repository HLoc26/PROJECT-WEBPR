import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import userService from "../services/user.service.js";

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

  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userService.findByEmail(profile.emails[0].value);
      
      if (!user) {
        // Create new user
        const newUser = {
          username: profile.displayName.replace(/\s/g, '').toLowerCase(),
          email: profile.emails[0].value,
          full_name: profile.displayName,
          user_role: 'reader',
          is_active: 1,
          password: null // OAuth users don't need password
        };
        
        await userService.addReader(newUser);
        user = await userService.findByEmail(profile.emails[0].value);
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userService.findByEmail(profile.emails[0].value);
      
      if (!user) {
        const newUser = {
          username: `fb_${profile.id}`,
          email: profile.emails[0].value,
          full_name: `${profile.name.givenName} ${profile.name.familyName}`,
          user_role: 'reader',
          is_active: 1,
          password: null
        };
        
        await userService.addReader(newUser);
        user = await userService.findByEmail(profile.emails[0].value);
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}