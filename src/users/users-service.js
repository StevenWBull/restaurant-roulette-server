const xss = require('xss');
const bcrypt = require('bcryptjs');

// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  hasUserInDatabase(db, user_name) {
    return db('rr_users')
      .where({ user_name })
      .first()
      .then( user => !!user );
  },
  validatePassword(password) {
    if (password.length < 7) {
      return 'Password must be at least 7 characters long';
    }
    if (password.length > 72) {
      return 'Password must not be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with a space';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL(password)) {
      return 'Password must contain 1 uppercase, 1 lowercase, number and a special character';
    }
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10);
  },
  sanitizeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created)
    };
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('rr_users')
      .returning('*')
      .then( ([user]) => user );
  }
};

module.exports = UsersService;