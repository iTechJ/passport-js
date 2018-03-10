import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import User from '../../models/user';
import configAuth from '../auth';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: configAuth.JWT.secret
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error, false)
  }
}));