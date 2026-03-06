const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

/**
 * Finds an existing user by provider + providerId, or creates a new one.
 * Shared logic used by both Google and GitHub strategy callbacks.
 */
const findOrCreateUser = async (provider, profile) => {
  const existingUser = await User.findOne({
    provider,
    providerId: profile.id,
  });

  if (existingUser) {
    return existingUser;
  }

  const email =
    profile.emails && profile.emails.length > 0
      ? profile.emails[0].value
      : null;

  const avatar =
    profile.photos && profile.photos.length > 0
      ? profile.photos[0].value
      : null;

  const newUser = await User.create({
    provider,
    providerId: profile.id,
    displayName: profile.displayName || profile.username,
    email,
    avatar,
  });

  return newUser;
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser("google", profile);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser("github", profile);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
