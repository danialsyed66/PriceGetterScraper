const scrapeUrls = require('./scrapeUrls');
const scrapeDescriptionPage = require('./scrapeDescriptionPage');

const CATEGORIES = require('../../server/utils/categories');

const url = 'https://www.daraz.pk/catalog/';

const scrapeAllUrls = async (puppeteerPage, products, error) => {
  console.log('Scraping Daraz Urls');
  for (let index = 0; index < CATEGORIES.length; index++) {
    try {
      const category = CATEGORIES[index];

      await scrapeUrls(puppeteerPage, products, url, category, error);
    } catch (err) {
      error.position = 'scrapeDarazUrls';
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

const scrapeAllDescriptionPages = async (puppeteerPage, products, error) => {
  console.log('Scraping Daraz Description Page');

  for (let index = 0; index < products.length; index++) {
    try {
      const product = products[index];
      if (product.seller !== 'Daraz') continue;

      if (product.name) continue;

      console.log(`Product: ${index + 1}`);

      await scrapeDescriptionPage(puppeteerPage, product, index);

      product.seller = '6222415a65458731887a8ff4';
    } catch (err) {
      error.position = 'scrapeDarazDescriptionPages';
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

module.exports = async (puppeteerPage, products, error) => {
  await scrapeAllUrls(puppeteerPage, products, error);

  await scrapeAllDescriptionPages(puppeteerPage, products, error);
};
