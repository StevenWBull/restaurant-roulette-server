CREATE TABLE rr_restaurants (
  id SERIAL PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  state_address TEXT NOT NULL,
  zipcode INTEGER NOT NULL,
  cuisine_type TEXT NOT NULL,
  user_id INTEGER
    REFERENCES rr_users(id) ON DELETE CASCADE NOT NULL
);