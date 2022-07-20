/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Lot schema
 */

const LotSchema = new Schema({
  name: { type: String, default: '' },
  address1: { type: String, default: '' },
  address2: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  postal_code: { type: String, default: '' },
  country: { type: String, default: '' },
  latitude: { type: Number, default: 0 },
  longitude: { type: String, default: '' },
  date_created: { type: Date, default: '' }
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

LotSchema.method({});

/**
 * Statics
 */

LotSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Lot', LotSchema);
