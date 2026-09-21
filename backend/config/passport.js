const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: Math.random().toString(36).slice(-10), // Random password for social login
          role: 'student' // Default to student
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: Math.random().toString(36).slice(-10),
          role: 'student'
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
