const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category) => {
  try {
    for (let page = 1; page < 2; page++) {
      console.log(`Category: ${category}, Page: ${page}`);

      await puppeteerPage.goto(
        queryString.stringifyUrl({
          url,
          query: {
            page,
            q: category,
          },
        }),
        { waitUntil: "networkidle2" }
      );

      const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
      const $ = await cheerio.load(html);

      // const arr = $("a")
      //   .map((i, el) => "https:" + $(el).attr("href"))
      //   .get();

      // const set = arr.map((url) => {
      //   if (url.startsWith("https://www.daraz.pk/products")) return url;
      // });

      // const urls = [...new Set([...set])];

      // console.log(
      //   `Category: ${category}, Page: ${page}: Got ${urls.length} urls`
      // );

      // urls.map((url) => {
      //   products.push({ url, category, seller: "Daraz" });
      // });
      products.push({ html });
    }
  } catch (err) {
    throw err;
  }
};
