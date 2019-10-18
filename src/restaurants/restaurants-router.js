/* eslint-disable eqeqeq */
const express = require('express');
const path = require('path');
const RestaurantsService = require('./restaurants-service');
const { requireAuthentication } = require('../middleware/jwt-auth');

const restaurantRouter = express.Router();

restaurantRouter
  .route('/')
  .all(requireAuthentication)
  .get((req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    RestaurantsService.getAllRestaurantsForUser(req.app.get('db'), user.id)
      .then( restaurants => res.json(RestaurantsService.sanitizeEntry(restaurants)))
      .catch(next);
  })
  .post((req, res, next) => {
    const { restaurant_name, street_address, state_address, zipcode, cuisine_type } = req.body;
    const newRestaurant = { restaurant_name, street_address, state_address, zipcode, cuisine_type };

    for (const [key, value] of Object.entries(newRestaurant)) {
      if (value == null || value == '') {
        return res.status(400).json({ error: `Missing '${key}' in request body`});
      }
    }

    const submitNewRestaurant = { 
      ...newRestaurant,
      user_id: req.user.id 
    };

    RestaurantsService.insertRestaurant(req.app.get('db'), submitNewRestaurant)
      .then( restaurant => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
          .json(RestaurantsService.sanitizeEntry(restaurant));
      })
      .catch(next);
  });

restaurantRouter
  .route('/:id')
  .all(requireAuthentication)
  .all((req, res, next) => {
    RestaurantsService.getById(req.app.get('db'), req.params.id)
      .then( restaurant => {
        if (!restaurant) {
          return res.status(400).json({
            error: 'Restaurant not found'
          });
        }
        res.restaurant = restaurant;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(RestaurantsService.sanitizeEntry(res.restaurant));
  })
  .delete((req, res, next) => {
    RestaurantsService.deleteRestaurant(req.app.get('db'), req.params.id)
      .then( () => res.status(204).end() )
      .catch(next);
  });

restaurantRouter
  .route('/random')
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

module.exports = restaurantRouter;