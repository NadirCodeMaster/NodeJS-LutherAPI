const { ObjectId } = require('mongodb');
const Move = require('../models/move');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Move.findById(id).then(result => {
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
  Move.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;

  const inventoryId = data.inventory_id;
  const lotFromId = data.lot_from_id;
  const lotToId = data.lot_to_id;

  if (
    ObjectId.isValid(inventoryId) &&
    ObjectId.isValid(lotFromId) &&
    ObjectId.isValid(lotToId)
  ) {
    const move = new Move({
      ...data,
      date_created: new Date()
    });

    move
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
  const lotFromId = data.lot_from_id;
  const lotToId = data.lot_to_id;

  if (
    ObjectId.isValid(id) &&
    ObjectId.isValid(inventoryId) &&
    ObjectId.isValid(lotFromId) &&
    ObjectId.isValid(lotToId)
  ) {
    Move.findOneAndUpdate(
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
    Move.deleteOne({ _id: ObjectId(id) }).then(result => {
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
