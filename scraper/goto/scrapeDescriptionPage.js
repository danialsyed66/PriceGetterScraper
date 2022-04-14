const cheerio = require('cheerio');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

module.exports = async (puppeteerPage, product) => {
  // await puppeteerPage.goto(product.url, { waitUntil: 'domcontentloaded' });
  await puppeteerPage.goto(product.url, { waitUntil: 'load', timeout: 10000 });
  await scrollPageToBottom(puppeteerPage, {
    size: 500,
    delay: 1000,
    stepsLimit: 4,
  });
  await puppeteerPage.waitForSelector('div.pdp-product-highlights > ul > li');
  await puppeteerPage.waitForSelector('div.item-content > div.content');

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  product.name = $('span.pdp-mod-product-badge-title').text().trim();
  product.discount = $('span.pdp-product-price__discount')
    .text()
    .trim()
    .slice(1);
  product.installment = $('#module_installment > div > div > div > p')
    .text()
    .trim();
  product.rating = +$('span.score-average').text().trim();
  product.brand = $('#module_product_brand_1 > div > a:nth-child(2)')
    .text()
    .trim();
  product.warranty = $(
    'div.delivery-option-item_type_warranty > div > div > div.delivery-option-item__title'
  )
    .text()
    .trim();
  product.noOfReviews = parseInt($('div.summary > div.count').text().trim());

  const price = $('span.pdp-price_type_normal')
    .text()
    .trim()
    .slice(4)
    .replace(/,/g, '');
  product.price = parseFloat(price);

  const oldPrice = $('span.pdp-price_type_deleted')
    .text()
    .trim()
    .slice(4)
    .replace(/,/g, '');
  product.oldPrice = parseFloat(oldPrice);

  const shippingCost = $('div.delivery-option-item__shipping-fee')
    .text()
    .trim()
    .slice(4)
    .replace(/,/g, '');
  product.shippingCost = parseFloat(shippingCost);

  product.stock = $(
    'a.next-number-picker-handler-up'
  )?.attribs?.class?.includes('next-number-picker-handler-up-disabled')
    ? 'Out of Stock'
    : 'In Stock';

  const categories = $('#J_breadcrumb > li > span > a > span');

  product.category.head = categories[0]?.children[0]?.data;
  product.category.sub = categories[1]?.children[0]?.data;
  product.category.base = categories[2]?.children[0]?.data;

  const lis = $('div.pdp-product-highlights > ul > li');

  let description = '';

  for (let index = 0; index < lis.length; index++) {
    description = `${description}, ${index + 1}: ${$(lis[index])
      .text()
      .trim()}`;
  }

  product.description = description.slice(2);

  product.reviews = [];

  const reviewsContent = $('div.item-content > div.content');

  for (let index = 0; index < reviewsContent.length; index++) {
    const stars = $($(`div.starCtn`)[0]).html();

    product.reviews.push({
      review: $(reviewsContent[index]).text().trim(),
      rating: stars.match(/TB19ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png/g).length,
    });
  }

  const images = $('img.item-gallery__thumbnail-image')
    .map((i, img) => {
      const val = img?.attribs?.src;
      const sliceTo = val?.indexOf('.jpg') + 4;
      return val?.slice(0, sliceTo);
    })
    .get();

  product.images = images.map((img) => ({ url: img }));
};
