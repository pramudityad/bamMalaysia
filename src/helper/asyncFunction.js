import axios from "axios";

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
    let respond = await axios.get(
      process.env.REACT_APP_API_URL_NODE + url,

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

export const getDatafromAPINODE2 = async (url, props) => {
  try {
    let respond = await axios.get(
      process.env.REACT_APP_API_URL_NODE + url,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props,
        },
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // console.log(progressEvent.lengthComputable);
          console.log("% ", percentCompleted);
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

export const getDatafromAPINODEFile = async (url, props, data) => {
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

export const postDatatoAPINODE = async (url, data, props) => {
  try {
    let respond = await axios.post(
      process.env.REACT_APP_API_URL_NODE + url,
      data,
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
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
        Authorization: "Bearer " + props,
      },
      data: data,
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

/**
 *
 * @param {data_email} data
 */
export const apiSendEmail = async (data) => {
  try {
    let respond = await axios.post(process.env.REACT_APP_API_EMAIL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return respond;
  } catch (err) {
    let respond = undefined;
    return respond;
  }
};
export const generateTokenACT = async () => {
  const proxyurl = "https://dev-corsanywhere.e-dpm.com/";
  const url = "https://api.act.e-dpm.com/api/get_token_auth";
  try {
    let body = {
      email: "a.fariz.mursyidan@ericsson.com",
      user_cu_id: "MYSLBD",
      user_cust_id: "All",
      user_type_parent: 1,
      user_type_child: "2",
      cu_id: "MYSLBD",
      account_id: "digi",
      project_id: "madd",
      project_type: "dynamic",
    };
    let respond = await axios.post(proxyurl + url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic YWRtaW50YWJsZWF1OlRhYmxlYXUhMTIz",
      },
    });
    if (respond.status >= 200 && respond.status < 300) {
      console.log("respond token", respond.data.access_token);
    }
    return respond.data.access_token;
  } catch (err) {
    let respond = err;
    console.log("respond token", err);
    return respond;
  }
};
