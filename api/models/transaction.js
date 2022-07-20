/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Transaction schema
 */

const TransactionSchema = new Schema({
  inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  price: { type: Number, default: 0 },
  date_sold: { type: Date, default: '' },
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

TransactionSchema.method({});

/**
 * Statics
 */

TransactionSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Transaction', TransactionSchema);
