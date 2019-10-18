const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe('Restaurants Endpoints', () => {
  let db;

  const { testUsers, testRestaurants } = helpers.makeRestaurantsFixtures();

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
    beforeEach('insert users and restaurants', () => 
      helpers.seedRrTables(db, testUsers, testRestaurants)
    );

    context('GET /api/restaurants', () => {
      it('responds with 401 and \'Missing bearer token\'', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(401, {
            error: 'Missing bearer token'
          });
      });

      it('responds with 401 and \'Unauthorized request\' with invalid jwt', () => {
        const validUser = testUsers[0];
        const invalidSecret = 'invalid-secret';

        return supertest(app)
          .get('/api/restaurants')
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, {
            error: 'Unauthorized request'
          });
      });

      it('responds with 401 and \'Unauthorized request\' with invalid credentials', () => {
        const invalidUserCreds = { user_name: 'invalid-user', password: 'invalid-pass'};

        return supertest(app)
          .get('/api/restaurants')
          .set('Authorization', helpers.makeAuthHeader(invalidUserCreds))
          .expect(401, {
            error: 'Unauthorized request'
          });
      });
    });
  });

  describe('GET /api/restaurants', () => {
    context('given no restaurants', () => {
      beforeEach('insert users', () => 
        helpers.seedUsers(db, testUsers)
      );
    
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/restaurants')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('given restaurants in the database', () => {
      beforeEach('insert users and restaurants', () => 
        helpers.seedRrTables(db, testUsers, testRestaurants)
      );

      it('responds with 200 and all restaurants', () => {
        const expectedRestaurants = helpers.makeExpectedRestaurants(testUsers[0], testRestaurants);
        return supertest(app)
          .get('/api/restaurants')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedRestaurants);
      });
    }); 
  });

  describe.only('GET /api/restaurants/random', () => {
    context('given no restaurants', () => {
      beforeEach('insert users', () => 
        helpers.seedUsers(db, testUsers)
      );
    
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/random-restaurants')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('given restaurants in the database', () => {
      beforeEach('insert users and restaurants', () => 
        helpers.seedRrTables(db, testUsers, testRestaurants)
      );

      it('responds with 200 and one restaurant', () => {
        return supertest(app)
          .get('/api/random-restaurants')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then( res => {
            expect(res.length).to.eql(1);
          });
      });
    });
  });

  describe('DELETE /api/restaurants/id', () => {
    beforeEach('insert users and restaurants', () => 
      helpers.seedRrTables(db, testUsers, testRestaurants)
    );
      
    it('responds with 204 and nothing', () => {
      return supertest(app)
        .delete('/api/restaurants/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(204, {});
    });
  });

  describe('POST /api/restaurants', () => {
    beforeEach('insert users and restaurants', () => 
      helpers.seedRrTables(db, testUsers, testRestaurants)
    );

    const requiredRestaurantFields = [
      'restaurant_name',
      'street_address',
      'state_address',
      'zipcode',
      'cuisine_type'
    ];

    requiredRestaurantFields.forEach( field => {
      const newRestaurant = {
        restaurant_name: 'test restaurant',
        street_address: '1234 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: 1
      };

      it(`responds with 400 and '${field}' is missing`, () => {
        delete newRestaurant[field];

        return supertest(app)
          .post('/api/restaurants')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newRestaurant)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });
    
    
    it('responds with 201 and posted restaurant', () => {
      const postingUser = testUsers[0];
      
      const newRestaurant = {
        restaurant_name: 'test restaurant 5',
        street_address: '5555 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: postingUser.id
      };

      const expectedRestaurant = [{
        id: (testRestaurants.length + 1),
        ...newRestaurant
      }];

      return supertest(app)
        .post('/api/restaurants')
        .set('Authorization', helpers.makeAuthHeader(postingUser))
        .send(newRestaurant)
        .expect(201, expectedRestaurant);
    });
  });
});