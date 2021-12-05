const scrapeUrls = require("./scrapeUrls");
const scrapeDescriptionPage = require("./scrapeDescriptionPage");

const CATEGORIES = require("../../utils/categories");

const url = "https://www.daraz.pk/catalog/";

const scrapeAllUrls = async (puppeteerPage, products) => {
  console.log("Scraping Urls");
  for (let index = 0; index < CATEGORIES.length; index++) {
    const category = CATEGORIES[index];

    await scrapeUrls(puppeteerPage, products, url, category);
  }
};

const scrapeAllDescriptionPages = async (puppeteerPage, products) => {
  console.log("Scraping Description Page");

  for (let index = 0; index < products.length; index++) {
    // for (let index = 0; index < 2; index++) {
    console.log(`Product: ${index + 1}`);
    const product = products[index];

    await scrapeDescriptionPage(puppeteerPage, product, index);
  }
};

module.exports = async (puppeteerPage, products) => {
  await scrapeAllUrls(puppeteerPage, products);

  await scrapeAllDescriptionPages(puppeteerPage, products);
};
