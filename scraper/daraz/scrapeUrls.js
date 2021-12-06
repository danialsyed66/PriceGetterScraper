const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category) => {
  try {
    for (let page = 1; page < 2; page++) {
      console.log(`Category: ${category}, Page: ${page}`);

      await puppeteerPage.goto(
        queryString.stringifyUrl(
          {
            url,
            query: {
              page,
              q: category,
            },
          },
          { waitUntil: "networkidle2" }
        )
      );

      const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
      const $ = await cheerio.load(html);

      const arr = $(
        "#root > div > div > div > div > div.ant-col-20.ant-col-push-4 > div > div > div > div > div > div > a"
      )
        .map((i, el) => "https:" + $(el).attr("href"))
        .get();
      const set = new Set([...arr]);

      const urls = [...set].slice(0, 10);

      console.log(
        `Category: ${category}, Page: ${page}: Got ${urls.length} urls`
      );
      console.log(urls);

      urls.map((url) => {
        products.push({ url, category, seller: "Daraz" });
      });
    }
  } catch (err) {
    throw err;
  }
};
