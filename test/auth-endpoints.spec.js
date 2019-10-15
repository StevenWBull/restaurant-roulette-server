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

    it('responds with 400 and \'Invalid user_name or password\' when bad user_name', () => {
      const badUserName = { user_name: 'notValid', password: testUser.password };

      return supertest(app)
        .post('/api/auth/login')
        .send(badUserName)
        .expect(400, {
          error: 'Incorrect user_name or password'
        });
    });

    it('responds with 400 and \'Invalid user_name or password\' when bad password', () => {
      const badPassword = { user_name: testUser.user_name, password: 'notValid' };

      return supertest(app)
        .post('/api/auth/login')
        .send(badPassword)
        .expect(400, {
          error: 'Incorrect user_name or password'
        });
    });

    it('responds with 200 and JWT auth token when valid credentials', () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          algorithm: 'HS256',
        });
      
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, { authToken: expectedToken });
    });
  });
});