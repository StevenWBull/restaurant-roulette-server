const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Users Endpoints', () => {
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

  describe.only('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

      const requiredFields = ['full_name', 'user_name', 'password'];

      requiredFields.forEach( field => {
        const registerAttemptUser = {
          full_name: 'test fullname',
          user_name: 'test username',
          password: 'test password'
        };

        it(`responds with a 400 status code and error that '${field}' is missing`, () => {
          delete registerAttemptUser[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptUser)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });
    });

    context('Happy path', () => {

    });
  });
});