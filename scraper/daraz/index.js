const scrapeUrls = require("./scrapeUrls");
const scrapeDescriptionPage = require("./scrapeDescriptionPage");

const CATEGORIES = require("../../server/utils/categories");
const spm = require("../../server/utils/spm");

const url = "https://www.daraz.pk/catalog/";

const scrapeAllUrls = async (puppeteerPage, products, error, htmls) => {
  console.log("Scraping Urls");
  for (let index = 0; index < CATEGORIES.length; index++) {
    try {
      const category = CATEGORIES[index];

      await scrapeUrls(
        puppeteerPage,
        products,
        url,
        category,
        spm[category],
        htmls
      );
    } catch (err) {
      error.position = "scrapeAllUrls";
      error.stack = err.stack;
      console.log(`Error at: ${error.position}: ${err.message}`);
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
      console.log(`Error at: ${error.position}: ${err.message}`);
    }
  }
};

module.exports = async (puppeteerPage, products, error, htmls) => {
  await scrapeAllUrls(puppeteerPage, products, error, htmls);

  await scrapeAllDescriptionPages(puppeteerPage, products, error);
};
