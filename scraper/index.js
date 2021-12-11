const puppeteer = require("puppeteer");
const fs = require("fs");

const Log = require("../server/models/log");
const Product = require("../server/models/product");
const daraz = require("./daraz");

module.exports = async () => {
  const products = [];
  const error = {};
  const htmls = [];
  const startTime = Date.now();
  console.log("Scraping...");

  // products.push({
  //   url: "https://www.daraz.pk/products/wireless-ip-camera-360a-view-rotatable-hd-wifi-cctv-surveillance-camera-ptz-night-vision-two-way-audio-motion-detection-sd-card-slot-v380-white-i1446478-s1283078890.html?spm=a2a0e.searchlist.list.2.7f241290PYQMGi&search=1",
  //   seller: "daraz",
  //   category: { search: "Cameras" },
  // });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  const darazStartTime = Date.now();
  console.log("Scraping Daraz");
  await daraz(page, products, error, htmls);
  const darazTime = Date.now() - darazStartTime;

  await browser.close();

  fs.writeFileSync("products.json", JSON.stringify(products));

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
