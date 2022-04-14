const queryString = require('query-string');
const cheerio = require('cheerio');

const productExists = require('../../server/utils/productExists');

module.exports = async (puppeteerPage, products, url, category, error) => {
  for (let page = 1; page < 2; page++) {
    console.log(`Daraz Category: ${category}, Page: ${page}`);

    // await puppeteerPage.goto(url, {
    //   waitUntil: 'networkidle2',
    // });

    await puppeteerPage.goto(
      queryString.stringifyUrl({
        url,
        query: {
          page: page === 1 ? undefined : page,
          q: category,
        },
      }),
      { waitUntil: 'load', timeout: 30000 }
    );

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const arr = $(
      '#root > div > div > div > div > div > div > div > div > div > div > div > a'
    )
      .map((i, el) => 'https:' + $(el).attr('href'))
      .get();

    const trimmed = arr.map(url => {
      if (url.startsWith('https://www.daraz.pk/products')) return url;
    });

    const urls = [...new Set([...trimmed])];
    // const urls = [...new Set([...trimmed])].slice(0, 5);

    urls.map(async url => {
      if (!url) return;

      error.total += 1;

      if (await productExists(url)) return;

      products.push({ url, category: { search: category }, seller: 'Daraz' });
    });

    console.log(
      `Category: ${category}, Page: ${page}: Got ${urls.length} urls`
    );
  }
};
