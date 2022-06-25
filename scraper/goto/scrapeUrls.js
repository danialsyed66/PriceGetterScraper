const cheerio = require('cheerio');

const productExists = require('../../server/utils/productExists');

module.exports = async (
  puppeteerPage,
  products,
  url,
  category,
  error,
  direct = false
) => {
  for (let page = 1; page < 2; page++) {
    console.log(`Goto Category: ${category}, Page: ${page}`);

    const gotoUrl = direct ? url : `${url}q/${encodeURI(category)}`;

    await puppeteerPage.goto(gotoUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const arr = $('div.product-name > h2 > a')
      .map((i, el) => $(el).attr('href'))
      .get();

    const urls = [...new Set([...arr])];
    // const urls = [...new Set([...arr])].slice(0, 5);

    urls.map(async url => {
      if (!url) return;

      error.total += 1;

      if (await productExists(url)) return;

      products.push({ url, category: { search: category }, seller: 'Goto' });
    });

    console.log(`Category: ${category}, Got ${urls.length} urls`);
  }
};
