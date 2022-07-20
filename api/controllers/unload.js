const { ObjectId } = require('mongodb');
const Unload = require('../models/unload');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Unload.findById(id).then(result => {
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
  Unload.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;
  const inventoryId = data.inventory_id;

  if (ObjectId.isValid(inventoryId)) {
    const unload = new Unload({
      ...data,
      inventory_id: ObjectId(inventoryId),
      date_created: new Date()
    });

    unload
      .save()
      .then(saved => res.json(saved))
      .catch(e => {
        res.json(e);
      });
  } else {
    res.status(404);
    res.json({ message: 'Invalid Inventory id!' });
  }
};

const update = (req, res) => {
  const id = req.swagger.params.id.value;
  const data = req.swagger.params.body.value;

  if (ObjectId.isValid(id)) {
    const inventoryId = data.inventory_id;

    if (ObjectId.isValid(inventoryId)) {
      data.inventory_id = ObjectId(inventoryId);

      Unload.findOneAndUpdate(
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
    Unload.deleteOne({ _id: ObjectId(id) }).then(result => {
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
