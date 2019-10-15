const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe.only('Auth Endpoints', () => {
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

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(db, testUsers);
    });

    const requiredFields = [ 'user_name', 'password' ];

    requiredFields.forEach( field => {
      const loginAttempt = {
        user_name: testUser.user_name,
        password: testUser.password
      };

      it(`responds with a 400 status if ${field} is missing in request body`, () => {
        delete loginAttempt[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttempt)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });
  });
});