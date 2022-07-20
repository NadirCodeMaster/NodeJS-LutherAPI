/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Move schema
 */

const MoveSchema = new Schema({
  inventory_id: { type: Number, default: 0 },
  lot_from_id: { type: Schema.Types.ObjectId, ref: 'Lot' },
  lot_to_id: { type: Schema.Types.ObjectId, ref: 'Lot' },
  lot_to_est_price: { type: Number, default: 0 },
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

MoveSchema.method({});

/**
 * Statics
 */

MoveSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Move', MoveSchema);
