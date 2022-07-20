/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Value Projection schema
 */

const ValueProjectionSchema = new Schema({
  lot_id: { type: Schema.Types.ObjectId, ref: 'Lot' },
  inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  date: { type: Date, default: '' },
  estimate: { type: String, default: '' },
  error: { type: String, default: '' },
  version: { type: String, default: '' },
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

ValueProjectionSchema.method({});

/**
 * Statics
 */

ValueProjectionSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('ValueProjection', ValueProjectionSchema);
