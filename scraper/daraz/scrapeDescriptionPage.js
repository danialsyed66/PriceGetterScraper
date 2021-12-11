const cheerio = require("cheerio");

module.exports = async (puppeteerPage, product) => {
  await puppeteerPage.goto(product.url, { waitUntil: "networkidle2" });

  const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);

  product.name = $("#module_product_title_1 > div > div > span").text();
  product.discount = $("span.pdp-product-price__discount").text();
  product.installment = $("#module_installment > div > div > div > p").text();
  product.rating = +$(
    "#module_product_review > div > div:nth-child(1) > div.mod-rating > div > div > div.summary > div.score > span.score-average"
  ).text();
  product.brand = $("#module_product_brand_1 > div > a:nth-child(2)").text();
  product.warranty = $(
    "#module_seller_warranty > div > div > div:nth-child(3) > div > div > div > div"
  ).text();
  product.noOfReviews = parseInt(
    $(
      "#module_product_review > div > div:nth-child(1) > div.mod-rating > div > div > div.summary > div.count"
    ).text()
  );

  const price = $("#module_product_price_1 > div > div > span")
    .text()
    .slice(4)
    .replace(/,/g, "");
  product.price = parseFloat(price);
  const shippingCost = $(
    "div.delivery__content > div > div:nth-child(1) > div > div.delivery-option-item__body > div.delivery-option-item__shipping-fee"
  )
    .text()
    .slice(4)
    .replace(/,/g, "");
  product.shippingCost = parseFloat(shippingCost);

  product.stock = $(
    "#module_quantity-input > div > div > div > div > a"
  )[0].attribs.class.includes("next-number-picker-handler-up-disabled")
    ? "Out of Stock"
    : "In Stock";

  const categories = $("#J_breadcrumb > li > span > a > span");

  product.category.head = categories[0]?.children[0]?.data;
  product.category.sub = categories[1]?.children[0]?.data;
  product.category.base = categories[2]?.children[0]?.data;

  const lis = $("#module_product_detail > div > div > div > ul > li");

  let description = "";

  for (let index = 0; index < lis.length; index++) {
    description = `${description}, ${index + 1}: ${$(lis[index]).text()}`;
  }

  product.description = description.slice(2);

  product.reviews = [];

  const reviewsContent = $(
    "#module_product_review > div > div:nth-child(3) > div.mod-reviews > div > div.item-content > div.content"
  );

  for (let index = 0; index < reviewsContent.length; index++) {
    const stars = $(
      $(
        `#module_product_review > div > div:nth-child(3) > div.mod-reviews > div:nth-child(${
          index + 1
        }) > div.top > div`
      )[0]
    ).html();

    product.reviews.push({
      review: $(reviewsContent[index]).text(),
      rating: stars.match(/TB19ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png/g).length,
    });
  }

  const images = $(
    "#module_item_gallery_1 > div > div > div > div > div > div > div > img.item-gallery__thumbnail-image"
  )
    .map((i, img) => {
      const val = img?.attribs?.src;
      const sliceTo = val?.indexOf(".jpg") + 4;
      return val?.slice(0, sliceTo);
    })
    .get();

  product.images = images.map((img) => ({ url: img }));
};
