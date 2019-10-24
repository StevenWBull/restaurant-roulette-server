require('dotenv').config();

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'the-test-secret';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;