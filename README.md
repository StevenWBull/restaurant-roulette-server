## Restaurant Roulette

### Live Link

* https://restaurant-roulette.now.sh/

### Restaurant Roulette Client

* https://github.com/StevenWBull/restaurant-roulette-client

### API Endpoints

* API URL: 'https://restaurant-roulette-server.herokuapp.com/api'

#### Allows GET and POST OF restaurants associated with logged in user 
* '/restaurants'

#### Allows for PATCH and DELETE of specific restaurants in user's pool of restaurants
* '/restaurants/:id'

#### Generates a random restaurant from a user's pool of saved restaurants
* '/random-restaurant'

#### Allows POST for new users

* '/users'

#### Handles verification of user for login purposes

* '/auth/login'

## Summary

![Restaurant Roulette Homepage](https://i.imgur.com/QwfS6Wa.jpg)

Restaurant Roulette is a application where a user can save their favorite restaurants in one easy to access place. Users are only able to see their own restaurants. The main feature of the application is the ability to to randomly pull out one restaurant from the entire saved list. This functionality allows the user to simplify their dining experience by not having to have the dreaded 'Where do you want to eat?' conversation with family, friends or significant others. For added effect, if the randomly generated restaurant doesn't fit the current craving of the user, a single button on the same page can be clicked to generate a new random restaurant.

### Technologies Used

React, React Hooks, CSS, HTML, Node, Express, and PostgreSQL.