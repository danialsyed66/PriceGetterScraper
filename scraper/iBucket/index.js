const scrapeUrls = require('./scrapeUrls');
const scrapeDescriptionPage = require('./scrapeDescriptionPage');

const { iBucketCategoryPages } = require('../../server/utils/categoryPages');

const scrapeAllUrls = async (puppeteerPage, products, error) => {
  console.log('Scraping iBucket Urls');

  for (let index = 0; index < iBucketCategoryPages.length; index++) {
    try {
      const iBucketCategoryPage = iBucketCategoryPages[index];

      await scrapeUrls(
        puppeteerPage,
        products,
        iBucketCategoryPage.url,
        iBucketCategoryPage.category,
        error
      );
    } catch (err) {
      error.position = 'scrapeIBucketUrls';
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

const scrapeAllDescriptionPages = async (puppeteerPage, products, error) => {
  console.log('Scraping iBucket Description Page');

  for (let index = 0; index < products.length; index++) {
    // for (let index = 0; index < 2; index++) {
    try {
      const product = products[index];
      if (product.seller !== 'iBucket') continue;

      console.log(`Product: ${index + 1}`);

      await scrapeDescriptionPage(puppeteerPage, product, index);
      product.seller = '628955047249d31c084d5301';
    } catch (err) {
      error.position = 'scrapeIBucketDescriptionPages';
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

module.exports = async (puppeteerPage, products, error) => {
  // await scrapeAllUrls(puppeteerPage, products, error);

  await scrapeAllDescriptionPages(puppeteerPage, products, error);
};
