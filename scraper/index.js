const fs = require('fs');
const puppeteer = require('puppeteer');

const createOrUpdateProducts = require('../server/utils/createOrUpdateProducts')
const Log = require('../server/models/log')

const scrapeDaraz = require('./daraz');
const scrapeYayvo = require('./yayvo');
const scrapeGoto = require('./goto');

module.exports = async () => {
  console.log('Scraping...');

  const error = { total: 0 };
  const products = [];
  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  const darazStartTime = Date.now();
  console.log('Scraping Daraz');
  await scrapeDaraz(page, products, error);
  const darazTime = Date.now() - darazStartTime;

  const yayvoStartTime = Date.now();
  console.log('Scraping Yayvo');
  await scrapeYayvo(page, products, error);
  const yayvoTime = Date.now() - yayvoStartTime;

  const gotoStartTime = Date.now();
  console.log('Scraping Goto');
  await scrapeGoto(page, products, error);
  const gotoTime = Date.now() - gotoStartTime;

  await browser.close();

  await createOrUpdateProducts(products);

  const totalTime = Date.now() - startTime;

  await Log.create({
    startTime,
    darazTime,
    yayvoTime,
    gotoTime,
    totalTime,
    error: error.position ? error : undefined,
  });

  fs.writeFileSync(
    'products.json',
    JSON.stringify({ results: products.length, products })
  );

  console.log(`DONE IN ${totalTime}`);
};
