/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Inventory schema
 */

const InventorySchema = new Schema({
  lot_id: { type: Schema.Types.ObjectId, ref: 'Lot' },
  make: { type: String, default: '' },
  model: { type: String, default: '' },
  year: { type: Number, default: 0 },
  color: { type: String, default: '' },
  trim: { type: String, default: '' },
  miles: { type: String, default: '' },
  condition: { type: String, default: '' },
  picture: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
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

InventorySchema.method({});

/**
 * Statics
 */

InventorySchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Inventory', InventorySchema);
