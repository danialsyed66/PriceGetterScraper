const queryString = require('query-string');
const cheerio = require('cheerio');

const productExists = require('../../server/utils/productExists');

module.exports = async (puppeteerPage, products, url, category, error) => {
  console.log(`Yayvo Category: ${category}`);

  await puppeteerPage.goto(
    queryString.stringifyUrl({
      url: `${url}`,
      query: {
        q: category,
      },
    }),
    { waitUntil: 'load', timeout: 30000 }
  );

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  const arr = $('div.main-container > div > div > div > ul > li > a')
    .map((i, el) => $(el).attr('href'))
    .get();

  const urls = [...new Set([...arr])];
  // const urls = [...new Set([...arr])].slice(0, 5);

  urls.map(async (url) => {
    if (!url) return;

    error.total += 1;

    if (await productExists(url)) return;

    products.push({ url, category: { search: category }, seller: 'Yayvo' });
  });

  console.log(`Category: ${category}, Got ${urls.length} urls`);
};
