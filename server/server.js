const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs').promises;
const cron = require('node-cron');

const scraper = require('../scraper');
const Product = require('../server/models/Product');
const createOrUpdateProducts = require('./utils/createOrUpdateProducts');

const app = express();

// eslint-disable-next-line no-undef
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!!! 💥');
  console.log(err.name, ': ', err.message);
  console.log(err.stack);
  console.log(`Shutting down the server due to an uncaught exception`);
  // eslint-disable-next-line no-undef
  process.exit(1);
});

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 8000, () =>
  // eslint-disable-next-line no-undef
  console.log(`Listening on port ${process.env.PORT || 8000}...`)
);

const db =
  'mongodb+srv://danialsyed66:5nnvU3ESdtXCz@cluster0.wbd6n.mongodb.net/price-getter?retryWrites=true&w=majority';

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(con =>
    console.log(`Connected to MongoDB Host: ${con.connection.host}...`)
  )
  .then(async () => {
    await scraper();
  });

cron.schedule('15 0 * * *', async function () {
  console.log('Running scraper...');
  // await scraper();
});

// eslint-disable-next-line no-undef
process.on('unhandledRejection', err => {
  console.log('UNCAUGHT REJECTION!!! 💥');
  console.log(err.name, ': ', err.message);
  console.log(err.stack);
  console.log('Shutting down server due to unhandled rejection');
  // eslint-disable-next-line no-undef
  process.exit(1);
});
