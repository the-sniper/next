import generateSitemap from "../../generate-sitemap";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const sitemap = await generateSitemap();
      res.setHeader("Content-Type", "application/xml");
      res.write(sitemap);
      res.end();
    } catch (error) {
      console.error(error, "checkError");
      res.status(500).send("Error generating sitemap");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
};
