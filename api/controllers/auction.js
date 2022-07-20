const lodashGet = require('lodash.get');

const { ObjectId } = require('mongodb');
const Auction = require('../models/auction');

const GetBestDealership = (car) => {
  const sum = (total, value) => {
    return total + value
  }

  let bestDealership = null

  if (car.dealerships) {
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

const GetRecommendedAction = (auction) => {
  if (auction) {
    const vehicleInformation = lodashGet(auction, 'vehicleInformation')
    const predictionInformation = lodashGet(auction, 'predictionInformation')
    const { currentBidPrice } = vehicleInformation

    const bestDealership = GetBestDealership(predictionInformation)
    if (bestDealership && bestDealership.prices) {
      const predictedPrice = bestDealership.prices[0]

      if (currentBidPrice) {
        if (currentBidPrice < predictedPrice) {
          return 'BUY'
        }

        return 'PASS'
      }
    }
  }

  return ''
}

const GetProfit = (bestDealership, currentBidPrice) => {
  let predictedPrice = 0
  if (bestDealership) {
    if (bestDealership.prices && bestDealership.prices.length > 0) {
      const { prices } = bestDealership
      predictedPrice = prices[0]
    }
  }

  if (!currentBidPrice) {
    return predictedPrice
  }

  return predictedPrice - Number(currentBidPrice)
}

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Auction.findById(id).then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404);
        res.json({ message: 'No exist!' });
      }
    });
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const list = (req, res) => {
  const page = req.swagger.params.page.value;
  const count = req.swagger.params.count.value;
  const order = req.swagger.params.order.value ? req.swagger.params.order.value : '_id';
  const sort = req.swagger.params.sort.value === 'asc' ? 1 : -1;

  let orderBy = {
    _id: sort
  }

  if (order === '_id') {
    orderBy = {
      _id: sort
    }
  } else if (order === 'year') {
    orderBy = {
      'vehicleInformation.year': sort
    }
  } else if (order === 'make') {
    orderBy = {
      'vehicleInformation.make': sort
    }
  } else if (order === 'model') {
    orderBy = {
      'vehicleInformation.model': sort
    }
  } else if (order === 'current_price') {
    orderBy = {
      'vehicleInformation.currentBidPrice': sort
    }
  } else if (order === 'dealer') {
    orderBy = {
      'bestDealership.name': sort
    }
  } else if (order === 'predicted_price') {
    orderBy = {
      'predictedPrice': sort
    }
  } else if (order === 'profit') {
    orderBy = {
      'profit': sort
    }
  } else if (order === 'auction_end_date') {
    orderBy = {
      'saleInformation.auctionEndDate': sort
    }
  } else if (order === 'recommendedAction') {
    orderBy = {
      'recommendedAction': sort
    }
  }

  const data = req.swagger.params.body.value;
  const { filter } = data;
  console.log(filter)
  const where = { "predictionInformation": { $exists: true },  "vehicleInformation.currentBidPrice": { $exists: true } };
  const filters = Object.keys(filter);
  for (let i = 0; i < filters.length; i += 1) {
    const key  = filters[i];
    const item = filter[key].filter;

    if (key === 'year') {
      where['vehicleInformation.year'] = {$eq: item};
    } else if (key === 'make') {
      where['vehicleInformation.make'] = { "$regex": item, "$options": "i" };
    } else if (key === 'model') {
      where['vehicleInformation.model'] = { "$regex": item, "$options": "i" };
    } else if (key === 'dealer') {
      where['bestDealership.name'] = { "$regex": item, "$options": "i" };
    } else if (key === 'current_price') {
      where['vehicleInformation.currentBidPrice'] = { "$eq": `${item}` };
    } else if (key === 'predicted_price') {
      where['predictedPrice'] = { "$gte": item };
    } else if (key === 'profit') {
      where['profit'] = { "$gte": item };
    } else if (key === 'recommendedAction') {
      where['recommendedAction'] = { "$eq": item.toUpperCase() };
    }
  }
  console.log(where)

  Auction.find(where)
  .sort(orderBy)
  .skip((page - 1) * count)
  .limit(count)
  .then(list =>
    res.json(
      {
        page,
        count,
        items: list
      }
    )
  );
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;

  const Auction = new Auction({
    ...data
  });

  lot
    .save()
    .then(saved => res.json(saved))
    .catch(e => {
      res.json(e);
    });
};

const update = (req, res) => {
  const id = req.swagger.params.id.value;
  const data = req.swagger.params.body.value;

  if (ObjectId.isValid(id)) {
    Auction.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: data },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          res.status(400);
          res.json({ message: 'Error!' });
        } else if (result) {
          res.json(result);
        } else {
          res.status(404);
          res.json({ message: 'No exist!' });
        }
      }
    );
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const remove = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Auction.deleteOne({ _id: ObjectId(id) }).then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404);
        res.json({ message: 'No exist!' });
      }
    });
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const getBestDealership = async (req, res) => {
  const cursor = Auction.find({ "predictionInformation": { $exists: true },  "vehicleInformation.currentBidPrice": { $exists: true } })
    .sort({
      _id: 'desc'
    })
    .cursor();
  for (let doc = await cursor.next(); doc !== null; doc = await cursor.next()) {
    const bestDealership = GetBestDealership(doc.predictionInformation);
    doc.bestDealership = bestDealership;
    doc.predictedPrice = bestDealership
      && bestDealership.prices
      && bestDealership.prices.length > 0
      && bestDealership.prices[0];
    doc.recommendedAction = GetRecommendedAction(doc);
    const { currentBidPrice } = doc.vehicleInformation;
    doc.profit = GetProfit(bestDealership, currentBidPrice);
    doc.save();
  }

  res.json({ message: 'Success' });
};

module.exports = {
  get,
  list,
  add,
  update,
  remove,
  getBestDealership
};
