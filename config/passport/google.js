import passport from 'passport'
import {Strategy as GoogleTokenStrategy} from 'passport-token-google';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import User from '../../models/user';
import configAuth from '../auth';

const handleGoogleAuth = async (token, refreshToken, profile, done) => {
  console.log(token);
  try {
    const user = await User.findOne({'google.id': profile.id});

    if (user) {
      return done(null, user);
    } else {
      const newUser = new User();
      newUser.google.id = profile.id;
      newUser.google.token = token;
      newUser.google.name = profile.displayName;
      newUser.google.email = profile.emails[0].value;
      newUser.save();
      return done(null, newUser);
    }

  } catch (error) {
    done(error, false)
  }
};

passport.use(new GoogleTokenStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
  },
  handleGoogleAuth
));

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
  handleGoogleAuth
));

