const fs = require('fs').promises;
const puppeteer = require('puppeteer');

const createOrUpdateProducts = require('../server/utils/createOrUpdateProducts');
const Product = require('../server/models/Product');

const Log = require('../server/models/log');

// const scrapeDaraz = require('./daraz');
// const scrapeYayvo = require('./yayvo');
// const scrapeGoto = require('./goto');
const scrapeiBucket = require('./iBucket');

module.exports = async () => {
  console.log('Scraping...');
  const startTime = Date.now();

  const error = { total: 0 };
  // const products = [];
  const { products } = JSON.parse(await fs.readFile('products.json', 'binary'));

  console.log('Scraping... 2');
  Product.insertMany(products);
  console.log('Scraping... 3');

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: ['--no-sandbox'],
  // });
  // const page = await browser.newPage();

  // const darazStartTime = Date.now();
  // console.log('Scraping Daraz');
  // await scrapeDaraz(page, products, error);
  // const darazTime = Date.now() - darazStartTime;

  // const yayvoStartTime = Date.now();
  // console.log('Scraping Yayvo');
  // await scrapeYayvo(page, products, error);
  // const yayvoTime = Date.now() - yayvoStartTime;

  // const gotoStartTime = Date.now();
  // console.log('Scraping Goto');
  // await scrapeGoto(page, products, error);
  // const gotoTime = Date.now() - gotoStartTime;

  // const iBucketStartTime = Date.now();
  // console.log('Scraping iBucket');
  // await scrapeiBucket(page, products, error);
  // const iBucketTime = Date.now() - iBucketStartTime;

  // await browser.close();

  // await createOrUpdateProducts(products);

  const totalTime = Date.now() - startTime;

  await Log.create({
    startTime,
    // darazTime,
    // yayvoTime,
    // gotoTime,
    // iBucketTime,
    totalTime,
    error: error.position ? error : undefined,
  });

  // await fs.writeFile(
  //   'products.json',
  //   JSON.stringify({ results: products.length, products })
  // );

  console.log(`DONE IN ${totalTime}`);
};
