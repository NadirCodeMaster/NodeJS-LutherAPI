'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerTools = require('swagger-tools');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');
const auth = require('./api/helpers/auth');

require('dotenv').config();

const config = {
  appRoot: __dirname, // required config
  db: process.env.MONGODB_URL
};

module.exports = app; // for testing

const connection = connect();

const port = process.env.PORT || 10010;

connection
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', () => {
    swaggerTools.initializeMiddleware(swaggerDocument, middleware => {
      app.use(cors());
      //Serves the Swagger UI on /docs
      app.use(middleware.swaggerUi());
      app.use(middleware.swaggerMetadata()); // needs to go BEFORE swaggerSecurity
      app.use(
        middleware.swaggerSecurity({
          Bearer: auth.verifyToken
        })
      );
      // swaggerExpress.register(app);
      const routerConfig = {
        controllers: './api/controllers',
        useStubs: false
      };

      app.use(middleware.swaggerRouter(routerConfig));
    });
    app.listen(port);
  });

function connect() {
  const options = {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose.connect(config.db, options);
  return mongoose.connection;
}
