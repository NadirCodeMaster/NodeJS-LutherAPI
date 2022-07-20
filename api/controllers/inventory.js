const { ObjectId } = require('mongodb');
const Inventory = require('../models/inventory');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Inventory.findById(id).then(result => {
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
  Inventory.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;
  const lotId = data.lot_id;

  if (ObjectId.isValid(lotId)) {
    const inventory = new Inventory({
      ...data,
      lot_id: ObjectId(lotId),
      date_created: new Date()
    });

    inventory
      .save()
      .then(saved => res.json(saved))
      .catch(e => {
        res.json(e);
      });
  } else {
    res.status(409);
    res.json({ message: 'Invalid lot id!' });
  }
};

const update = (req, res) => {
  const id = req.swagger.params.id.value;
  const data = req.swagger.params.body.value;

  if (ObjectId.isValid(id)) {
    const lotId = data.lot_id;

    if (ObjectId.isValid(lotId)) {
      data.lot_id = ObjectId(lotId);

      Inventory.findOneAndUpdate(
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
      res.json({ message: 'Invalid lot id!' });
    }
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const remove = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Inventory.deleteOne({ _id: ObjectId(id) }).then(result => {
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
