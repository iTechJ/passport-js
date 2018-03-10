import passport from 'passport'
import {Strategy as FacebookStrategy} from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
import User from '../../models/user';
import configAuth from '../auth';

const handleFacebookAuth = async (token, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({'facebook.id': profile.id});

    if (user) {
      return done(null, user);
    } else {
      const newUser = new User();
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
      newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

      await newUser.save();
      return done(null, newUser);
    }

  } catch (error) {
    done(error, false)
  }
};

passport.use(new FacebookTokenStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
  },
  handleFacebookAuth
));

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  handleFacebookAuth
));