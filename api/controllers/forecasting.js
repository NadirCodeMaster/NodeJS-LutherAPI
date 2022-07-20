const { ObjectId } = require('mongodb');
const Forecasting = require('../models/forecasting');

const get = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    Forecasting.findById(id).then(result => {
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
  Forecasting.find().then(list => res.json(list));
};

const add = (req, res) => {
  const data = req.swagger.params.body.value;

  const forecasting = new Forecasting({
    ...data
  });

  forecasting
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
    Forecasting.findOneAndUpdate(
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
    Forecasting.deleteOne({ _id: ObjectId(id) }).then(result => {
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
