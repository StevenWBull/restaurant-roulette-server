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
      if (value == null) { 
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    
  });