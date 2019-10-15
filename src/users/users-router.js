const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();

usersRouter
  .post('/', (req, res, next) => {
    const { full_name, user_name, password } = req.body;
    const user = { full_name, user_name, password };

    for (const [key, value] of Object.entries(user)) {
      // eslint-disable-next-line eqeqeq
      if (value == null || value == '') { 
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    const passwordValidation = UsersService.validatePassword(password);

    if (passwordValidation) {
      return res.status(400).json({ error: passwordValidation });
    }

    UsersService.hasUserInDatabase(req.app.get('db'), user_name)
      .then( hasDuplicateUser => {
        if (hasDuplicateUser) {
          return res.status(400).json({ error: 'Username already taken' });
        }

        return UsersService.hashPassword(password) 
          .then( hashedPassword => {
            const newUser = {
              user_name,
              full_name,
              password: hashedPassword,
              date_created: 'now()'
            };

            return UsersService.insertUser(req.app.get('db'), newUser)
              .then( user => {
                res.status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.sanitizeUser(user));
              });
          });
      })
      .catch(next);
  });

module.exports = usersRouter;