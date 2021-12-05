const puppeteer = require("puppeteer");

const Log = require("../server/models/log");
const Product = require("../server/models/product");
const daraz = require("./daraz");

module.exports = async () => {
  const products = [];
  const startTime = Date.now();
  console.log("Scraping...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  const darazStartTime = Date.now();
  console.log("Scraping Daraz");
  await daraz(page, products);
  const darazTime = Date.now() - darazStartTime;

  await browser.close();

  await Product.create(products);

  const totalTime = Date.now() - startTime;

  await Log.create({
    startTime,
    darazTime,
    totalTime,
  });
  console.log(`DONE in ${totalTime}`);
};
