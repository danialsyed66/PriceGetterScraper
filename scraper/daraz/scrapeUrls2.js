const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category, htmls) => {
  await puppeteerPage.goto("https://www.daraz.pk/", {
    waitUntil: "networkidle2",
  });

  await puppeteerPage.waitForSelector("#q");

  console.log("calling $$eval");

  await puppeteerPage.$$eval(
    "#q",
    (el, category) => {
      el.value = category;
      console.log(el.value);
    },
    category
  );

  const html1 = await puppeteerPage.evaluate(() => document.body.innerHTML);
  await puppeteerPage.click(".search-box__button--1oH7");

  await puppeteerPage.waitForNavigation({ waitUntil: "networkidle2" });

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  htmls.push({ html1, html });

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
};
