export default {
  facebookAuth: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_URL,
  },
  twitterAuth: {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_URL,
  },
  googleAuth: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_URL,
  },
  JWT: {
    secret: process.env.SECRET_JWT,
    live: process.env.JWT_LIVE
  }

};