const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const helpers = {
  makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'Test-user-1',
        full_name: 'test user 1',
        password: 'password'
      },
      {
        id: 2,
        user_name: 'Test-user-2',
        full_name: 'test user 2',
        password: 'password'
      },
      {
        id: 3,
        user_name: 'Test-user-3',
        full_name: 'test user 3',
        password: 'password'
      },
      {
        id: 4,
        user_name: 'Test-user-4',
        full_name: 'test user 4',
        password: 'password'
      },
    ];
  },
  makeRestaurantsArray(users) {
    return [
      {
        id: 1,
        restaurant_name: 'test restaurant 1',
        street_address: '1111 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: users[0].id
      },
      {
        id: 2,
        restaurant_name: 'test restaurant 2',
        street_address: '2222 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: users[1].id
      },
      {
        id: 3,
        restaurant_name: 'test restaurant 3',
        street_address: '3333 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: users[2].id
      },
      {
        id: 4,
        restaurant_name: 'test restaurant 4',
        street_address: '4444 test',
        state_address: 'Test, TX',
        zipcode: 12345,
        cuisine_type: 'Testican',
        user_id: users[3].id
      }
    ];
  },
  makeRestaurantsFixtures() {
    const testUsers = this.makeUsersArray();
    const testRestaurants = this.makeRestaurantsArray(testUsers);
    return { testUsers, testRestaurants };
  },
  cleanTables(db) {
    return db.raw(
      `TRUNCATE
        rr_restaurants,
        rr_users
        RESTART IDENTITY CASCADE`
    );
  },
  seedUsers(db, users) {
    const preppedUsers = users.map( user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }));
  
    return db.into('rr_users').insert(preppedUsers)
      .then( () => {
        db.raw(
          // eslint-disable-next-line quotes
          `SELECT setval('rr_users_id_seq', ?)`,
          [users[users.length - 1].id]
        );
      });
  },
  seedRrTables(db, users, restaurants) {
    return db.transaction( async trx => {
      await this.seedUsers(trx, users);
      await trx.into('rr_restaurants').insert(restaurants);

      await trx.raw(
        // eslint-disable-next-line quotes
        `SELECT setval('rr_restaurants_id_seq', ?)`,
        [restaurants[restaurants.length -1].id]
      );
    });
  },
  makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256'
    });

    return `Bearer ${token}`;
  },
  makeExpectedRestaurants(user, restaurants) {
    return restaurants.filter( restaurant => restaurant.user_id === user.id);
  }
};

module.exports = helpers;