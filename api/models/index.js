require('dotenv').config();

const mongoose = require('mongoose');

const User = require('./user');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

module.exports = { User };
