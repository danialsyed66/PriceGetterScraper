const cheerio = require('cheerio');

module.exports = async (puppeteerPage, product) => {
  await puppeteerPage.goto(product.url, { waitUntil: 'domcontentloaded' });
  // await puppeteerPage.goto(product.url, { waitUntil: 'load', timeout: 10000 });

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  product.name = $('.product-name').text().trim();

  product.price = +$('#specialPriceBox > span').text().trim().replace(/,/g, '');

  product.rating = +$('.if-rating-zero > .badge').text().trim();

  product.description = $('#description').text().trim();

  product.noOfReviews = parseInt($('.if-rating-zero > .badge').text().trim());

  product.brand = $('.product-brand').text().trim();

  const breadcrumbs = $('.breadcrumbs > li > a > span');

  product.category.head = breadcrumbs[1]?.children[0]?.data;
  product.category.sub = breadcrumbs[2]?.children[0]?.data;
  product.category.base = breadcrumbs[3]?.children[0]?.data;

  product.reviews = [];

  const reviewText = $('.scrollStyle > li .rev-des');
  const reviewRating = $('.scrollStyle > li .badge');

  for (let index = 0; index < reviewText?.length; index++) {
    const review = reviewText[index].textContent.trim();
    const rating = +reviewRating[index].textContent.trim();

    product.reviews.push({ review, rating });
  }

  product.shippingCost = +$('.shipping-price')
    .text()
    .trim()
    .slice(4)
    .replace(/,/g, '');

  product.stock = 'In Stock';
};
