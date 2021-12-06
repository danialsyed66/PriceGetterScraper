const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category) => {
  try {
    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    products.push({ html });
  } catch (err) {
    throw err;
  }
};
