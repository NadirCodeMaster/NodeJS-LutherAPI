/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Forecasting Projection schema
 */

const ForecastingProjectionSchema = new Schema({
  forecasting_id: { type: Schema.Types.ObjectId, ref: 'Forecasting' },
  date: { type: Date, default: '' },
  est_no_solds: { type: Number, default: '' },
  est_avg_sell_price: { type: Number, default: 0 },
  est_avg_cost_price: { type: Number, default: 0 },
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

ForecastingProjectionSchema.method({});

/**
 * Statics
 */

ForecastingProjectionSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model(
  'ForecastingProjection',
  ForecastingProjectionSchema
);
