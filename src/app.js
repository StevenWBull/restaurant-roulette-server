require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandler');
const usersRouter = require('./users/users-router');
const restaurantsRouter = require('./restaurants/restaurants-router');
const randomRestaurantsRouter = require('./restaurants/random-restaurant');
const authRouter = require('./auth/auth-router');

const app = express();
const jsonBodyParser = express.json();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(jsonBodyParser);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/random-restaurants', randomRestaurantsRouter);

app.get('/', ( req, res ) => {
  res.send('Welcome to the Restaurant Roulette Server');
});

app.use(errorHandler);

module.exports = app;