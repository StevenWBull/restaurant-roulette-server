const express = require('express');
const RestaurantsService = require('./restaurants-service');
const { requireAuthentication } = require('../middleware/jwt-auth');

const randomRestaurantRouter = express.Router();

randomRestaurantRouter
  .route('/')
  .all(requireAuthentication)
  .get((req, res, next) => {
    
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    RestaurantsService.getRandomRestaurant(req.app.get('db'), user.id)
      .then ( randomRestaurant => RestaurantsService.sanitizeEntry(randomRestaurant))
      .catch(next);
  });

module.exports = randomRestaurantRouter;