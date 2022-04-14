// const scrapeUrls = require('./scrapeUrls');
const scrapeDescriptionPage = require('./scrapeDescriptionPage');

// const CATEGORIES = require('../../server/utils/categories');

// const url = 'http://yayvo.com/search/result/';

// const scrapeAllUrls = async (puppeteerPage, products, error) => {
//   console.log('Scraping Yayvo Urls');
//   for (let index = 0; index < CATEGORIES.length; index++) {
//     try {
//       const category = CATEGORIES[index];

//       await scrapeUrls(puppeteerPage, products, url, category, error);
//     } catch (err) {
//       error.position = 'scrapeYayoUrls';
//       error.stack = err.stack;
//       console.log(`Error at: ${error.position}: ${err.message}`);
//     }
//   }
// };

const scrapeAllDescriptionPages = async (puppeteerPage, products, error) => {
  console.log('Scraping Yayvo Description Page');

  for (let index = 0; index < products.length; index++) {
    try {
      const product = products[index];
      if (product.seller !== 'Yayvo') continue;

      if (product.name) continue;

      console.log(`Product: ${index + 1}`);

      await scrapeDescriptionPage(puppeteerPage, product, index);
    } catch (err) {
      error.position = 'scrapeYayoDescriptionPages';
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

module.exports = async (puppeteerPage, products, error) => {
  // await scrapeAllUrls(puppeteerPage, products, error);

  await scrapeAllDescriptionPages(puppeteerPage, products, error);
};
