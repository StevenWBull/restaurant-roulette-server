/* eslint-disable eqeqeq */
const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();

authRouter
  .post('/login', (req, res, next) => {
    const { user_name, password } = req.body;
    const loginUser = { user_name, password };

    for (const [key, value] of Object.entries(loginUser)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
    }

    AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
      .then( dbUser => {
        if (!dbUser) {
          return res.status(400).json({ error: 'Incorrect user_name or password' });
        }

        AuthService.comparePassword(loginUser.password, dbUser.password)
          .then( passwordsMatch => {
            if (!passwordsMatch) {
              return res.status(400).json({ error: 'Incorrect user_name or password' });
            }

            const sub = dbUser.user_name;
            const payload = { user_id: dbUser.id };
            res.send({
              authToken: AuthService.createJwt(sub, payload)
            });
          });
      })
      .catch(next);
  });

module.exports = authRouter;