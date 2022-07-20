/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GetBestDealership = (car) => {
  const sum = (total, value) => {
    return total + value
  }

  let bestDealership = null

  if (car && car.dealerships) {
    const { dealerships } = car
    let besDealershipSum = 0

    for (let i = 0; i < dealerships.length; i += 1) {
      const dealership = dealerships[i]
      if (dealership.prices && dealership.prices.length > 0) {
        const tempSum = dealership.prices.reduce(sum)
        if (tempSum > besDealershipSum) {
          bestDealership = dealership
          besDealershipSum = tempSum
        }
      }
    }
  }

  return bestDealership
}

/**
 * Auction schema
 */

const AuctionSchema = new Schema({
  saleInformation: { type: Schema.Types.Mixed, default: {} },
  vehicleInformation: { type: Schema.Types.Mixed, default: {} },
  predictionInformation: { type: Schema.Types.Mixed, default: {} },
  bestDealership: { type: Schema.Types.Mixed, default: {} },
  predictedPrice: { type: Schema.Types.Number },
  profit: { type: Schema.Types.Number },
  recommendedAction: { type: Schema.Types.String }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
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

AuctionSchema.method({});

/**
 * Statics
 */

AuctionSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model('Auction', AuctionSchema, 'auction');
