import axios from "axios";

const apiCall = async (method, url, data, headertype, baseurl) => {
  let site_url = `${global.site_url}/api_buyer/`;
  if (baseurl) {
    site_url = `${global.site_url}/api_buyer/${baseurl}/`;
  }
  if (
    url.includes("mobileapi") ||
    url.includes("api_bidding") ||
    url.includes("plugin")
  ) {
    site_url = `${global.site_url}/`;
  }
  return new Promise(async (resolve, reject) => {
    let type = "";
    if (headertype && headertype === "formdata") {
      type = "multipart/form-data";
    } else {
      type = "application/json";
    }
    const config = {
      headers: {
        "content-type": type,
        "Access-Control-Allow-Origin": "*",
      },
    };
    switch (method) {
      case "post":
        try {
          data = data ? data : {};
          const res = await axios.post(`${site_url}${url}`, data, config);
          // console.log("responsode from api", res);
          resolve(res);
          break;
        } catch (err) {
          // console.log("responsode error from api", err);
          resolve(err);
          break;
        }
      case "get":
        try {
          // console.log("get method", url, config);
          let addedParam = null;
          if (data) {
            addedParam = new URLSearchParams(data).toString();
          }
          const res = await axios.get(
            `${site_url}${url}${addedParam ? `?${addedParam}` : ""}`,
            config
          );
          // console.log("response get ode from api", res);
          resolve(res);
          break;
        } catch (err) {
          // console.log("responsode error from api", err);
          resolve(err);
          break;
        }
      default:
        return null;
    }
  });
};

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["authorization"] = `Basic ${token}`;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
};

const setIPAddress = (ipaddress) => {
  if (ipaddress) {
    axios.defaults.headers.common["ipaddress"] = ipaddress;
  } else {
    delete axios.defaults.headers.common["ipaddress"];
  }
};
export { apiCall, setAuthToken, setIPAddress };
