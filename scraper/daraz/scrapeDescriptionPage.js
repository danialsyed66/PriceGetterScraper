const cheerio = require("cheerio");

module.exports = async (puppeteerPage, product) => {
  try {
    await puppeteerPage.goto(product.url, { waitUntil: "networkidle2" });

    const html = await puppeteerPage.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    product.name = $("#module_product_title_1 > div > div > span").text();

    const price = $("#module_product_price_1 > div > div > span")
      .text()
      .slice(4)
      .replace(/,/g, "");
    product.price = parseFloat(price);

    product.discount = $("span.pdp-product-price__discount").text();
    product.installment = $("#module_installment > div > div > div > p").text();
    product.rating = $(
      "#module_product_review > div > div:nth-child(1) > div.mod-rating > div > div > div.summary > div.score > span.score-average"
    ).text();
    product.brand = $("#module_product_brand_1 > div > a:nth-child(2)").text();
    product.noOfReviews = parseInt(
      $(
        "#module_product_review > div > div:nth-child(1) > div.mod-rating > div > div > div.summary > div.count"
      ).text()
    );

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
  } catch (err) {
    throw err;
  }
};
