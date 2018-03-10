import User from '../models/user';
import jwt from "jsonwebtoken";
import configAuth from '../config/auth';

const generateToken = (id) => {
  const token = jwt.sign(
    {
      id,
      exp: Math.floor(Date.now() / 1000) + parseInt(configAuth.JWT.live)
    },
    configAuth.JWT.secret);
  return {token: "bearer " + token}
};

export const login = async (payload) => {
  const {email, password} = payload;

  try {
    const user = await User.findOne({'local.email': email});
    if (!user) return {message: 'No user found.'};

    if (!user.validPassword(password))
      return {message: 'Oops! Wrong password.'};

    return generateToken(user.id)

  } catch (error) {
    console.error(error);
    return {success: false, message: 'Authentication failed.'}
  }
};


export const signup = async (payload) => {
  const {email, password} = payload;

  try {
    const user = await User.findOne({'local.email': email});
    if (user) return {message: 'That email is already taken.'};

    const newUser = new User();
    newUser.local.email = email;
    newUser.local.password = newUser.generateHash(password);
    await newUser.save();

    return generateToken(newUser.id)

  } catch (error) {
    console.error(error);
    return {success: false, message: 'Registration failed.'}
  }
};