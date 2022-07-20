/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  roles: { type: Array, default: [] },
  date_created: { type: Date, default: '' },
  is_deleted: { type: Boolean, default: false },
  dealerships: { type: [String], default: [] },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({});

/**
 * Statics
 */

UserSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('User', UserSchema);
