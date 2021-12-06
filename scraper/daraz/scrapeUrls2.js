const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category) => {
  try {
    await puppeteerPage.goto("https://www.daraz.pk/", {
      waitUntil: "networkidle2",
    });
    await puppeteerPage.waitForSelector("#q");

    await puppeteerPage.$eval("#q", (el) => (el.value = category));

    await puppeteerPage.click(".search-box__button--1oH7");

    await puppeteerPage.waitForSelector(".c2bxk7.c1pRUd.c2CJAA");

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const arr = $("a")
      .map((i, el) => "https:" + $(el).attr("href"))
      .get();

    const set = arr.map((url) => {
      if (url.startsWith("https://www.daraz.pk/products")) return url;
    });

    const urls = [...new Set([...set])];

    console.log(
      `Category: ${category}, Page: ${page}: Got ${urls.length} urls`
    );

    urls.map((url) => {
      products.push({ url, category, seller: "Daraz" });
    });
  } catch (err) {
    throw err;
  }
};
