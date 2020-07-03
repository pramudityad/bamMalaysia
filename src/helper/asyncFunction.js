import axios from "axios";

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const API_URL_MAS = "https://api-dev.mas.pdb.e-dpm.com/masapi";
const usernameMAS = "mybotprpo";
const passwordMAS = "mybotprpo2020";

// EXCEL
export const getDatafromAPIMY = async (url) => {
    try {
      let respond = await axios.get(API_URL_MAS + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameMAS,
          password: passwordMAS,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Get Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
    }
  }

export const getDatafromAPINODE = async (url, props) => {
  try {
    let respond = await axios.get(API_URL_NODE + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props,
      },
    });
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond Post Data", respond);
    }
    return respond;
  } catch (err) {
    let respond = err;
    console.log("respond Post Data err", err);
    return respond;
  }
};

export const postDatatoAPINODE = async (url, data, props) => {
  try {
    let respond = await axios.post(API_URL_NODE + url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props,
      },
    });
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond Post Data", respond);
    }
    return respond;
  } catch (err) {
    let respond = err;
    console.log("respond Post Data err", err);
    return respond;
  }
};

export const patchDatatoAPINODE = async (url, data, props) => {
  try {
    let respond = await axios.patch(API_URL_NODE + url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props,
      },
    });
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond patch Data", respond);
    }
    return respond;
  } catch (err) {
    let respond = err;
    console.log("respond patch Data err", err);
    return respond;
  }
};

export const deleteDataFromAPINODE = async (url, props) => {
  try {
    let respond = await axios.delete(API_URL_NODE + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props,
      },
    });
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond delete Data", respond);
    }
    return respond;
  } catch (err) {
    let respond = err;
    console.log("respond delete Data err", err);
    return respond;
  }
};
