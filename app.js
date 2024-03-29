const config = require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('express-async-errors');
const cors = require('cors');
const visitsRouter = require('./controllers/visits');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const path = require('path');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/visits', visitsRouter);
app.use('/api/users', usersRouter);

app.get('/AddLocation', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});
app.get('/VisitedPlaces', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
