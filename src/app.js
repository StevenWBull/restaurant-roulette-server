require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandler');

const app = express();
const jsonBodyParser = express.json();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(jsonBodyParser);

app.get('/', ( req, res ) => {
  res.send('Hello world!');
});

app.use(errorHandler);

module.exports = app;