const cheerio = require('cheerio');

module.exports = async (puppeteerPage, product) => {
  await puppeteerPage.goto(product.url, {
    waitUntil: 'domcontentloaded',
    timeout: 10000,
  });

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  product.name = $('div.product-name > h1').text().trim();
  product.stock = $('div.quantity_stock > div > span').text().trim();

  product.description = $(
    '#product_tabs_description_tabbed_contents > div > div.std'
  )
    .text()
    .trim();

  let price = $('span.price').text().trim().slice(5).replace(/,/g, '');
  const oldPrice = $('p.old-price > span.price')
    .text()
    .trim()
    .slice(5)
    .replace(/,/g, '');
  if (oldPrice) {
    price = $('p.special-price > span.price')
      .text()
      .trim()
      .slice(5)
      .replace(/,/g, '');
    product.oldPrice = parseFloat(oldPrice);
    product.discount = `${Math.ceil(100 - (price * 100) / oldPrice)}%`;
  }
  product.price = parseFloat(price);

  product.brand = $('div.brand-area > div:nth-child(1) > span').text().trim();

  product.images = [];
  const images = $('div.owl-stage-outer > div > div > div > li > a')
    .map((i, img) => img?.attribs?.href)
    .get();

  images.forEach((image) => product.images.push({ url: image }));

  // ----------------

  // product.installment =
  // product.rating =
  // product.warranty =
  // product.noOfReviews =
  // product.shippingCost =
  // product.category.head =
  // product.category.sub =
  // product.category.base =
  // product.reviews =
};
