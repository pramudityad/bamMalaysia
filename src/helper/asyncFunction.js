import axios from "axios";

// EXCEL
export const getDatafromAPIMY = async (url) => {
  try {
    let respond = await axios.get(process.env.REACT_APP_API_URL_MAS + url, {
      headers: { "Content-Type": "application/json" },
      auth: {
        username: process.env.REACT_APP_usernameMAS,
        password: process.env.REACT_APP_passwordMAS,
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
};

export const getDatafromAPINODE = async (url, props) => {
  try {
    let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
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

export const getDatafromAPINODEFile = async (url, props, con_type) => {
  try {
    let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
      responseType: "blob",
      headers: {
        // "Content-Type": con_type,
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
    let respond = await axios.post(
      process.env.REACT_APP_API_URL_NODE + url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props,
        },
      }
    );
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

export const postDatatoAPILogin = async (url, data) => {
  try {
    let respond = await axios.post(
      process.env.REACT_APP_API_URL_NODE + url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
      }
    );
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond Post Data", respond);
    }
    return respond;
  } catch (err) {
    let respond = err;
    console.log("respond Post Data", err);
    return respond;
  }
};

export const patchDatatoAPINODE = async (url, data, props) => {
  try {
    let respond = await axios.patch(
      process.env.REACT_APP_API_URL_NODE + url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props,
        },
      }
    );
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
    let respond = await axios.delete(process.env.REACT_APP_API_URL_NODE + url, {
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

export const deleteDataFromAPINODE2 = async (url, props, data) => {
  try {
    let respond = await axios.delete(process.env.REACT_APP_API_URL_NODE + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props,
      },
      data,
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
