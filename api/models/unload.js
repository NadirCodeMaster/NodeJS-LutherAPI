/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Unload schema
 */

const UnloadSchema = new Schema({
  inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  est_losss_today: { type: Number, default: 0 },
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

UnloadSchema.method({});

/**
 * Statics
 */

UnloadSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Unload', UnloadSchema);
