const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const { DirectAPICAll } = require("./common/components");
const { titleFormatter } = require("./Utils");
const fs = require("fs");
const path = require("path");

async function generateSitemap() {
  // Fetch data for all the dynamic pages
  const response = await DirectAPICAll(
    "post",
    `https://forwardapidev.auctionsoftware.com/api_buyer/searchLotAPI`,
    {
      title: "",
      type: "",
      auctionId: "",
      localpickup: "",
      shipping: "",
      categoryId: "",
      sellername: "",
      seller_id: "",
      country: "",
      page: 1,
      perpage: 15,
      auctionDate: "",
      state: "",
      userid: "",
      startPrice: false,
      endPrice: false,
    }
  );

  const products = response.data;

  // Create a stream to write the sitemap
  const stream = new SitemapStream({
    hostname: process.env.BUYER_DOMAIN,
  });

  // Add static routes
  const staticRoutes = [
    { url: "/", changefreq: "monthly", priority: 1.0 },
    { url: "/auctions", changefreq: "monthly", priority: 0.8 },
    { url: "/auctions/events", changefreq: "monthly", priority: 0.7 },
    { url: "/team", changefreq: "monthly", priority: 0.6 },
    { url: "/static/terms", changefreq: "daily", priority: 0.4 },
    { url: "/static/privacy", changefreq: "monthly", priority: 0.4 },
    // Add more static routes if needed
  ];

  staticRoutes.forEach((route) => {
    stream.write(route);
  });

  // Add dynamic routes for products
  products?.response?.results.forEach((product) => {
    stream.write({
      url: `/productView/${product.id}?auctionId=${
        product.auction_id
      }&title=${titleFormatter(product.title)}`,
      changefreq: "daily",
      priority: 0.9,
    });
  });

  // End the sitemap stream
  stream.end();

  // Get the sitemap as a string
  const sitemap = await streamToPromise(Readable.from(stream)).then((data) =>
    data.toString()
  );

  const sitemapPath = path.join(
    process.cwd(),
    "public",
    "static",
    "sitemap.xml"
  );

  fs.writeFileSync(sitemapPath, sitemap);

  return sitemap;
}

module.exports = generateSitemap;
