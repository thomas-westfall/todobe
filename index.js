// Module dependencies;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

// Utilities;
const createLocalDatabase = require('./utilities/createLocalDatabase');

// Our database instance;
const db = require('./database');

// Our apiRouter;
const apiRouter = require('./routes/index');

// A helper function to sync our database;
const syncDatabase = () => {
    if (process.env.NODE_ENV === 'production') {
      db.sync();
    }
    else {
      console.log('As a reminder, the forced synchronization option is on');
      db.sync({ force: true })
        .catch(err => {
          if (err.name === 'SequelizeConnectionError') {
            createLocalDatabase();
          }
          else {
            console.log(err);
          }
        });
      }
  };

// Instantiate our express application;
const app = express();

// A helper function to create our app with configurations and middleware;
const configureApp = () => {
  app.use(helmet());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(cookieParser());
  app.use(cors({origin: 'http://localhost:3000'}));
  
  // Mount our apiRouter;
  app.use('/api', apiRouter);

  // Error handling;
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    }
    else {
      next();
    }
  });

  // More error handling;
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

// Main function declaration;
const bootApp = async () => {
  await syncDatabase();
  await configureApp();
};

// Main function invocation;

bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;

