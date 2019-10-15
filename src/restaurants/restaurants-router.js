const express = require('express');
const RestaurantsService = require('./restaurants-service');
const { requireAuthentication } = require('../../middleware/jwt-auth');

const restaurantRouter = express.Router();

restaurantRouter
  .route('/:user_id')
  .all(requireAuthentication)
  .get((req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    RestaurantsService.getAllRestaurantsForUser(req.app.get('db'), user.id)
      .then( restaurants => res.json(RestaurantsService.sanitizeEntry(restaurants)))
      .catch(next);
  });

module.exports = restaurantRouter;