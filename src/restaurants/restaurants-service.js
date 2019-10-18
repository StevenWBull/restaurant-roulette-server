const xss = require('xss');

const RestaurantsService = {
  getAllRestaurantsForUser(db, userId) {
    return db('rr_restaurants')
      .select('*')
      .where({ user_id: userId });
  },
  getById(db, id) {
    return db('rr_restaurants')
      .select('*')
      .where({ id: id })
      .first();
  },
  insertRestaurant(db, newRestaurant) {
    return db
      .insert(newRestaurant)
      .into('rr_restaurants')
      .returning('*')
      .then( (restaurant) => restaurant);
  },
  deleteRestaurant(db, id) {
    return db('rr_restaurants')
      .where({ id })
      .delete();
  },
  sanitizeEntry(entry) {
    const sanitizedEntries = entry.map( sanitize => {
      return {
        id: sanitize.id,
        restaurant_name: xss(sanitize.restaurant_name),
        street_address: xss(sanitize.street_address),
        state_address: xss(sanitize.state_address),
        zipcode: Number(xss(sanitize.zipcode)),
        cuisine_type: sanitize.cuisine_type,
        user_id: sanitize.user_id
      };
    });
    return sanitizedEntries;
  },
  getRandomRestaurant(db, userId) {
    return db('rr_restaurants')
      .select('*')
      .where({ user_id: userId })
      .orderByRaw('RANDOM()')
      .limit(1);
  }
};

module.exports = RestaurantsService;