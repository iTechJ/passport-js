import passport from 'passport'
import {Strategy as TwitterStrategy} from 'passport-twitter';
import User from '../../models/user';
import configAuth from '../auth';

passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const user = await User.findOne({'twitter.id': profile.id});

      if (user) {
        return done(null, user);
      } else {
        const newUser = new User();
        newUser.twitter.id = profile.id;
        newUser.twitter.token = token;
        newUser.twitter.username = profile.username;
        newUser.twitter.displayName = profile.displayName;
        newUser.save();
        return done(null, newUser);
      }
    } catch (error) {
      done(error, false)
    }
  }));

