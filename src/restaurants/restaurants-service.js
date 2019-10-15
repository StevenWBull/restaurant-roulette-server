const xss = require('xss');

const RestaurantsService = {
  getAllRestaurantsForUser(db, userId) {
    return db('rr_restaurants')
      .select('*')
      .where({ user_id: userId });
  },
  getById(db, id) {
    return this.getAllRestaurantsForUser(db, id)
      .where({ id })
      .first();
  },
  insertRestaurant(db, newRestaurant) {
    return db
      .insert(newRestaurant)
      .into('rr_restaurants')
      .returning('*')
      .then( ([restaurant]) => restaurant);
  },
  deleteRestaurant(db, id) {
    return db('rr_restaurants')
      .where({ id })
      .delete();
  },
  sanitizeEntry(entry) {
    console.log(entry);
    return {
      id: entry.id,
      restaurant_name: xss(entry.restaurant_name),
      street_address: xss(entry.street_address),
      state_address: xss(entry.state_address),
      cuisine_type: entry.cuisine_type,
      user_id: entry.user_id
    };
  }
};

module.exports = RestaurantsService;