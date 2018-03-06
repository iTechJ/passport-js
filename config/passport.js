import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import User from '../models/user';
import configAuth from './auth';

export default passport => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err)
          return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          const newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(err => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        return done(null, user);
      });
    }));

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'email', 'first_name', 'last_name'],
    },
    (token, refreshToken, profile, done) => {
      User.findOne({'facebook.id': profile.id}, (err, user) => {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
          newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

          newUser.save(err => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }));

  passport.use(new TwitterStrategy({
      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL,
    },
    (token, tokenSecret, profile, done) => {
      User.findOne({'twitter.id': profile.id}, (err, user) => {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;
          newUser.save(err => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }));

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
    },
    (token, refreshToken, profile, done) => {
      User.findOne({'google.id': profile.id}, (err, user) => {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;
          newUser.save(err => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });

    }));

};
