/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Forecasting schema
 */

const ForecastingSchema = new Schema({
  make: { type: String, default: '' },
  model: { type: String, default: '' },
  year: { type: Number, default: 0 },
  trim: { type: String, default: '' },
  demand_category: {
    type: String,
    enum: ['none', 'low', 'high'],
    default: 'none'
  },
  mileage_category: {
    type: String,
    enum: ['none', 'low', 'high'],
    default: 'none'
  }
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

ForecastingSchema.method({});

/**
 * Statics
 */

ForecastingSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Forecasting', ForecastingSchema);
