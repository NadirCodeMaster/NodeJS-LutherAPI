const { ObjectId } = require('mongodb');
const Transaction = require('../models/transaction');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Transaction.findById(id).then(result => {
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
  Transaction.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;
  const inventoryId = data.inventory_id;

  if (ObjectId.isValid(inventoryId)) {
    const transaction = new Transaction({
      ...data,
      inventory_id: ObjectId(inventoryId),
      date_sold: new Date(data.date_sold),
      date_created: new Date()
    });

    transaction
      .save()
      .then(saved => res.json(saved))
      .catch(e => {
        res.json(e);
      });
  } else {
    res.status(409);
    res.json({ message: 'Invalid Inventory id!' });
  }
};

const update = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    const inventoryId = data.inventory_id;
    const data = req.swagger.params.body.value;

    if (ObjectId.isValid(inventoryId)) {
      data.inventory_id = ObjectId(inventoryId);
      data.date_sold = new Date(data.date_sold);

      Transaction.findOneAndUpdate(
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
      res.json({ message: 'Invalid Inventory id!' });
    }
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const remove = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Transaction.deleteOne({ _id: ObjectId(id) }).then(result => {
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

module.exports = {
  get,
  list,
  add,
  update,
  remove
};
