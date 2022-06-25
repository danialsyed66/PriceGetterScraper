const cheerio = require('cheerio');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

module.exports = async (puppeteerPage, product) => {
  await puppeteerPage.goto(product.url, { waitUntil: 'domcontentloaded' });

  // await puppeteerPage.goto(product.url, {
  //   waitUntil: 'domcontentloaded',
  //   timeout: 10000,
  // });

  // await puppeteerPage.waitForSelector('figure>div>img');

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  product.name = $('.product_title')?.text()?.trim();

  product.price = Math.round(
    +$('.information > .summary > .price > ins')
      ?.text()
      ?.trim()
      ?.slice(1)
      ?.replace(/,/g, '')
  );

  if (product.price > 0) {
    product.oldPrice = Math.round(
      +$('.information > .summary > .price > del')
        ?.text()
        ?.trim()
        ?.slice(1)
        ?.replace(/,/g, '')
    );

    if (product.oldPrice)
      product.discount =
        ((product?.oldPrice - product?.price) * 100) / product?.oldPrice;
  } else {
    const price = $('.information > .summary > .price > span > bdi')?.text();

    const indexOfRs = price.slice(1).indexOf(price[0]);

    if (indexOfRs < 0)
      product.price = Math.round(+price?.slice(1).trim()?.replace(/,/g, ''));
    else
      product.price = Math.round(
        +price
          .slice(1, indexOfRs + 1)
          ?.trim()
          ?.replace(/,/g, '')
      );
  }

  product.brand = $('.yith-wcbr-brands > span > a')?.text()?.trim();

  let categories = $('.posted_in > a');

  categories = categories
    .map((i, cat) => {
      return cat.children[0].data;
    })
    .get();

  console.log(categories);

  product.category.head = categories[0];
  product.category.sub = categories[1];
  product.category.base = categories[2];

  // let images = $('ol>div>div>li>img');

  // if (images.length === 0) images = $('figure>div>img');

  // images = images
  //   .map((i, img) => {
  //     const val = img?.attribs?.src;
  //     console.log(val);
  //     const sliceTo = val?.indexOf('.jpg') + 4;
  //     return val?.slice(0, sliceTo);
  //   })
  //   .get();

  // product.images = images.map(img => ({ url: img }));

  const $2 = await cheerio.load($('.title-desc')[0].parentNode);

  product.description = $2('p').text();

  const lis = $2('ol > li');

  if (lis?.length > 0)
    for (let index = 0; index < lis.length; index++) {
      const element = lis[index];
      product.description = `${product.description} ${index + 1}. ${
        element.innerHTML
      }`;
    }
};
