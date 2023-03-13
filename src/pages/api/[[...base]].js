import axios from "axios";
import https from "https";

export default async function handler(req, res) {
  const { method, query, body, headers } = req;

  try {
    // if (method !== "GET" && method !== "POST") {
    //   res.status(405).json({ message: "Method Not Allowed" });
    //   return;
    // }

    let response;
    if (method === "GET") {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      response = await axios.get(
        `${process.env.FORWARD_DOMAIN}${query.endpoint}`,
        { headers, httpsAgent }
      );
    } else if (method === "POST") {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      response = await axios.post(
        `${process.env.FORWARD_DOMAIN}${query.endpoint}`,
        body,
        { headers, httpsAgent }
      );
    }

    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
