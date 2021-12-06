const puppeteer = require("puppeteer");

const Log = require("../server/models/log");
const Product = require("../server/models/product");
const daraz = require("./daraz");

module.exports = async () => {
  const products = [];
  const error = {};
  const startTime = Date.now();
  console.log("Scraping...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  const darazStartTime = Date.now();
  console.log("Scraping Daraz");
  await daraz(page, products, error);
  const darazTime = Date.now() - darazStartTime;

  await browser.close();

  if (products.length) {
    await Product.deleteMany();
    await Product.create(products);
  }

  const totalTime = Date.now() - startTime;

  await Log.create({
    startTime,
    darazTime,
    totalTime,
    error: error.position ? error : undefined,
  });

  console.log(`DONE IN ${totalTime}`);
};
