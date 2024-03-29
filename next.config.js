/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: ["@material-ui/core", "@material-ui/icons"],
  images: {
    domains: [
      "localhost",
      "auction-io.ecommerce.auction",
      "forwardapidev.auctionsoftware.com",
      "auction.moblearn.net",
      "next-seven-tawny.vercel.app",
    ],
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  reactStrictMode: true,
};
