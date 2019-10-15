const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe.only('Restaurants Endpoints', () => {
  let db;

  const { testUsers } = helpers.makeRestaurantsFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('protected endpoints', () => {
    
  });

  describe('GET /api/restaurants', () => {

  });

  describe('GET /api/restaurants/id', () => {

  });

  describe('POST /api/restaurants', () => {

  });
});