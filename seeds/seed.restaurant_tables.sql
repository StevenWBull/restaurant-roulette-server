BEGIN;

TRUNCATE 
  rr_users,
  rr_restaurants
    RESTART IDENTITY CASCADE;

INSERT INTO rr_users (user_name, full_name, password)
VALUES
  ('dunder', 'Dunder Mifflin', '$2a$12$UW7EZaSgpHwL6djciZrc0uEPEcg59a26IfVyX0OZggLs/rrJg.SFm'),
  ('b.deboop', 'Bodeep Deboop', '$2a$12$OubrfiDER.V9OTZxRY08aeF3r4Dt2TQnz.7ao/ir9pW24cs6aXCLa'),
  ('c.bloggs', 'Charlie Bloggs', '$2a$12$6r5RwRatfGhw8FIy70JDgejy/./un41FYhzr1mztDld6pJO7r/MTi'),
  ('s.smith', 'Sam Smith', '$2a$12$qBqoWgooQuLIZ1FM232nx.6ZS59I.fy8cq2VrREKxyZCCHp/.acPy'),
  ('lexlor', 'Alex Taylor', '$2a$12$p7Qytl3R/y.J.u1ryLcTeeMhud5pSaXN6ahHeVYzsX0IvqZZ8vlMW'),
  ('wippy', 'Ping Won In', '$2a$12$khv/BIBSDiSbsQObTskW9exTqi35ECaaYgPJdNS1ptergWBogsCom');

INSERT INTO rr_restaurants (restaurant_name, street_address, state_address, cuisine_type, user_id)
VALUES
  ('Gringos', '13456 Rosehill Rd', 'Cypress, TX', 'Mexican', 1),
  ('Pei Wei', '13456 Mueschke Rd', 'Cypress, TX', 'Chinese', 1),
  ('Whataburger', '16576 Kuykendall Rd', 'Cypress, TX', 'American', 1),
  ('McDonalds', '56867 Fry Rd', 'Cypress, TX', 'American', 2),
  ('Burger King', '86763 Telge Rd', 'Cypress, TX', 'American', 2),
  ('Salata', '45795 Winston Rd', 'Cypress, TX', 'Mexican', 3),
  ('Mos', '45397 Beltway Rd', 'Cypress, TX', 'Irish', 4),
  ('Lupe Tortilla', '26721 Texas St', 'Cypress, TX', 'Mexican', 4),
  ('Titos', '68566 San Antonio Rd', 'Cypress, TX', 'Mexican', 5),
  ('Shogun', '18563 Houston Rd', 'Cypress, TX', 'Japanese', 6),
  ('Olive Garden', '82894 blblahblah Rd', 'Cypress, TX', 'Italian', 6);

  COMMIT;