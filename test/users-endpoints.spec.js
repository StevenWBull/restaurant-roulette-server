const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', () => {
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

  describe('POST /api/users', () => {
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

      it('responds with 400 and \'Password must be at least 7 characters long\'', () => {
        const userInvalidPassword = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: '123456'
        };

        return supertest(app)
          .post('/api/users')
          .send(userInvalidPassword)
          .expect(400, {
            error: 'Password must be at least 7 characters long'
          });
      });

      it('responds with 400 and \'Password must not be more than 72 characters long\'', () => {
        const userInvalidPassword = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: '1'.repeat(73)
        };
        
        return supertest(app)
          .post('/api/users')
          .send(userInvalidPassword)
          .expect(400, {
            error: 'Password must not be more than 72 characters long'
          });
      });

      it('responds with 400 and \'Password must not start or end with a space\' when beginning with a space', () => {
        const userInvalidPassword = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: ' aA!123456789'
        };
        
        return supertest(app)
          .post('/api/users')
          .send(userInvalidPassword)
          .expect(400, {
            error: 'Password must not start or end with a space'
          });
      });

      it('responds with 400 and \'Password must not start or end with a space\' when ending with a space', () => {
        const userInvalidPassword = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: 'aA!123456789 '
        };
        
        return supertest(app)
          .post('/api/users')
          .send(userInvalidPassword)
          .expect(400, {
            error: 'Password must not start or end with a space'
          });
      });

      it('responds with 400 and \'Password must contain 1 uppercase, 1 lowercase, number and a special character\'', () => {
        const userInvalidPassword = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: '123456789'
        };
        
        return supertest(app)
          .post('/api/users')
          .send(userInvalidPassword)
          .expect(400, {
            error: 'Password must contain 1 uppercase, 1 lowercase, number and a special character'
          });
      });

      it('responds with 400 and \'Username already taken\' when user_name is not unique', () => {
        const userDuplicateUsername = {
          user_name: testUser.user_name,
          full_name: 'test full_name',
          password: 'aA!123456789'
        };

        return supertest(app)
          .post('/api/users')
          .send(userDuplicateUsername)
          .expect(400, {
            error: 'Username already taken'
          });
      });
    });

    context('Happy path', () => {
      it('responds with a 201, and posts new user with bcrypted password', () => {
        const newUser = {
          user_name: 'test user_name',
          full_name: 'test full_name',
          password: 'aA!123456789'
        };

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect( res => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('date_created');
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.full_name).to.eql(newUser.full_name);
            expect(res.body.password).to.not.eql(newUser.password);
          });
      });
    });
  });
});