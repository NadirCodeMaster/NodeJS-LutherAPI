const { ObjectId } = require('mongodb');
const ValueProjection = require('../models/valueProjection');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    ValueProjection.findById(id).then(result => {
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
  ValueProjection.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;

  const inventoryId = data.inventory_id;
  const lotId = data.lot_id;

  if (ObjectId.isValid(inventoryId) && ObjectId.isValid(lotId)) {
    const valueProjection = new ValueProjection({
      ...data,
      date: new Date(data.date),
      date_created: new Date()
    });

    valueProjection
      .save()
      .then(saved => res.json(saved))
      .catch(e => {
        res.json(e);
      });
  } else {
    res.status(409);
    res.json({ message: 'Invalid id provided!' });
  }
};

const update = (req, res) => {
  const id = req.swagger.params.id.value;
  const data = req.swagger.params.body.value;
  const inventoryId = data.inventory_id;
  const lotId = data.lot_id;

  if (
    ObjectId.isValid(id) &&
    ObjectId.isValid(inventoryId) &&
    ObjectId.isValid(lotId)
  ) {
    data.date = new Date(data.date);

    ValueProjection.findOneAndUpdate(
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
    res.json({ message: 'Invalid id provided!' });
  }
};

const remove = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    ValueProjection.deleteOne({ _id: ObjectId(id) }).then(result => {
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
