import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local';
import User from '../../models/user';

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
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({'local.email': email});

      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        const newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        await newUser.save();
        return done(null, newUser);

      }
    } catch (error) {
      done(error, false)
    }
  }));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({'local.email': email});

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);

    } catch (error) {
      done(error, false)
    }
  }));
