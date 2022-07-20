/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Sold Projection schema
 */

const SoldProjectionSchema = new Schema({
  lot_id: { type: Number, default: 0 },
  inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  estimated_sell_date: { type: Date, default: '' },
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

SoldProjectionSchema.method({});

/**
 * Statics
 */

SoldProjectionSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('SoldProjection', SoldProjectionSchema);
