const queryString = require('query-string');
const cheerio = require('cheerio');

module.exports = async (puppeteerPage, products, url, category) => {
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
        { waitUntil: 'networkidle2' }
      )
    );

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const urls = $('div.c2iYAv > div > a')
      .map((i, el) => 'https:' + $(el).attr('href'))
      .get();

    urls.map(url => {
      products.push({ url, category, seller: 'Daraz' });
    });
  }
};
