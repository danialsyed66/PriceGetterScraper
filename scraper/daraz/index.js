const scrapeUrls2 = require("./scrapeUrls2");
const scrapeDescriptionPage = require("./scrapeDescriptionPage");

const CATEGORIES = require("../../server/utils/categories");

const url = "https://www.daraz.pk/catalog/";

const scrapeAllUrls = async (puppeteerPage, products, error, html) => {
  console.log("Scraping Urls");
  for (let index = 0; index < CATEGORIES.length; index++) {
    try {
      const category = CATEGORIES[index];

      await scrapeUrls2(puppeteerPage, products, url, category, html);
    } catch (err) {
      error.position = "scrapeAllUrls";
      error.stack = err.stack;
      console.log(error.position);
      console.log(error.stack);
    }
  }
};

const scrapeAllDescriptionPages = async (puppeteerPage, products, error) => {
  console.log("Scraping Description Page");

  for (let index = 0; index < products.length; index++) {
    // for (let index = 0; index < 2; index++) {
    try {
      console.log(`Product: ${index + 1}`);
      const product = products[index];

      await scrapeDescriptionPage(puppeteerPage, product, index);
    } catch (err) {
      error.position = "scrapeAllDescriptionPages";
      error.stack = err.stack;
      console.log(error.position);
      console.log(error.stack);
    }
  }
};

module.exports = async (puppeteerPage, products, error, html) => {
  await scrapeAllUrls(puppeteerPage, products, error, html);

  // await scrapeAllDescriptionPages(puppeteerPage, products, error);
};
