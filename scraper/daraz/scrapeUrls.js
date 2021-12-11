const queryString = require("query-string");
const cheerio = require("cheerio");

module.exports = async (puppeteerPage, products, url, category, spm) => {
  for (let page = 1; page < 2; page++) {
    console.log(`Category: ${category}, Page: ${page}`);

    await puppeteerPage.goto("https://www.daraz.pk/", {
      waitUntil: "networkidle2",
    });

    await puppeteerPage.goto(
      queryString.stringifyUrl({
        url,
        query: {
          page: page === 1 ? undefined : page,
          q: category,
          _keyori: "ss",
          from: "input",
          spm,
        },
      }),
      { waitUntil: "networkidle2" }
    );

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

    const urls = [...new Set([...trimmed])].slice(0, 10);

    urls.map((url) => {
      if (!url) return;
      products.push({ url, category: { search: category }, seller: "Daraz" });
    });

    console.log(
      `Category: ${category}, Page: ${page}: Got ${urls.length} urls`
    );
  }
};
