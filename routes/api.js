import express from 'express';
import passport from 'passport';
import * as authService from '../services/auth'
const router = express.Router();

router.get('/', (req, res, next) => {
    res.json('Welcome to passport example api');
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const response = await authService.login(req.body);
  res.json(response);
});

router.post('/signup', async (req, res) => {
  const response = await authService.signup(req.body);
  res.json(response);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json(req.user);
});

router.post('/google', passport.authenticate('google-token'),
  (req, res) => {
    res.json(req.user);
  });

router.post('/facebook', passport.authenticate('facebook-token'),
  (req, res) => {
    res.json(req.user);
  }
);

router.post('/twitter', passport.authenticate('twitter-token'),
  (req, res) => {
    res.json(req.user);
  }
);

export default router;