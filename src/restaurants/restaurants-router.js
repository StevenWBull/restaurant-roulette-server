const express = require('express');
const RestaurantsService = require('./restaurants-service');

const restaurantRouter = express.Router();

restaurantRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const userId = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    RestaurantsService.getAllRestaurantsForUser(req.app.get('db'), userId)
      .then( restaurants => res.json(RestaurantsService.sanitizeEntry(restaurants)))
      .catch(next);
  });

module.exports = restaurantRouter;