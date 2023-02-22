import axios from "axios";
const biddercheck = async (data) => {
  let site_url = `${global.site_url}/api/bidderchecker`;

  let type = "application/json";

  const config = {
    headers: {
      "content-type": type,
      "Access-Control-Allow-Origin": "*",
    },
  };
  data.user_id = data.userid;
  data.id = data.id ? data.id : data.auction_id;
  try {
    data = data ? data : {};
    const res = await axios.post(`${site_url}`, data, config);
    // console.log("+++++++++++++++++++++++++++++++++++=",res.data.success)
    if (res.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // console.log("responsode error from api", err);
  }
};

export { biddercheck };
