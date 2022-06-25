const cheerio = require('cheerio');

const productExists = require('../../server/utils/productExists');

module.exports = async (puppeteerPage, products, url, category, error) => {
  for (let page = 1; page < 2; page++) {
    console.log(`iBucket Category: ${category}, Page: ${page}`);

    await puppeteerPage.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const arr = $('.product-content > .caption > .name > a')
      .map((i, el) => $(el).attr('href'))
      .get();

    const arr2 = $('.product-content > .block-inner > .image > a > img')
      .map((i, el) => {
        const val = $(el).attr('src');
        const sliceTo = val?.indexOf('.jpg') + 4;
        return val?.slice(0, sliceTo);
      })
      .get();

    const urls = [...new Set([...arr])];
    // const urls = [...new Set([...arr])].slice(0, 5);

    urls.map(async (url, i) => {
      if (!url) return;

      error.total += 1;

      if (await productExists(url)) return;

      products.push({
        url,
        category: { search: category },
        seller: 'iBucket',
        images: [{ url: arr2[i] }],
      });
    });

    console.log(`Category: ${category}, Got ${urls.length} urls`);
  }

  return products;
};
