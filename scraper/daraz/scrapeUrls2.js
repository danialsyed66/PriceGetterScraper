const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category) => {
  try {
    await puppeteerPage.goto("https://www.daraz.pk/", {
      waitUntil: "networkidle2",
    });

    await puppeteerPage.waitForSelector("#q");

    await puppeteerPage.$eval(
      "#q",
      (el, category) => (el.value = category),
      category
    );

    await puppeteerPage.click(".search-box__button--1oH7");

    await puppeteerPage.waitForSelector('[data-tracking="product-card"]');

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const arr = $(
      "#root > div > div > div > div > div > div > div > div > div > div > div > a"
    )
      .map((i, el) => "https:" + $(el).attr("href"))
      .get();

    const trimmed = arr.map((url) => {
      if (url.startsWith("https://www.daraz.pk/products")) return url;
    });

    const urls = [...new Set([...trimmed])];

    urls.map((url) => {
      if (!url) return;
      products.push({ url, category, seller: "Daraz" });
    });
  } catch (err) {
    throw err;
  }
};
