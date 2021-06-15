export function toTimeZone(dateTime) {
  const dateIn = dateTime + " GMT+0000";
  const date = new Date(dateIn);
  const DateNow =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return DateNow;
}

export function checkValue(props) {
  //Swap undefined to null
  if (typeof props == "undefined") {
    return null;
  } else {
    return props;
  }
}

export const convertDateFormat = (jsondate) => {
  if (jsondate !== null && jsondate !== undefined) {
    let date = new Date(jsondate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  }
  return null;
};

export const convertDateFormat_firefox = (jsondate) => {
  if (jsondate !== null && jsondate !== undefined) {
    let timestring = ["T17:00:00.000Z"];
    let time = jsondate.split("T");
    jsondate = time[0].concat(timestring);
    let date = new Date(jsondate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  }
  return null;
};

// full dateformat hh:mm:ss
export const convertDateFormatfull = (jsondate) => {
  if (jsondate !== undefined && jsondate !== null) {
    let date = new Date(jsondate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt + " " + hh + ":" + mm + ":" + ss;
  } else {
    return null;
  }
};

// for export all
export const numToSSColumn = (num) => {
  var s = "",
    t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
};

export const convertDMSToDD = (dms) => {
  let parts = dms.split(/[^\d+(\,\d+)\d+(\.\d+)?\w]+/);
  let degrees = parseFloat(parts[0]);
  let minutes = parseFloat(parts[1]);
  let seconds = parseFloat(parts[2].replace(",", "."));
  let direction = parts[3];

  // console.log('degrees: '+degrees)
  // console.log('minutes: '+minutes)
  // console.log('seconds: '+seconds)
  // console.log('direction: '+direction)

  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
};

export const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export const formatMoney = (
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};

export const arraychunk = (inputArray, perChunk) => {
  const result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);
    // console.log(result);
    return resultArray;
  }, []);
};

export const convertArray = (array) => {
  var convertedArray = [];

  var length = array.length;
  for (var i = 0; i < length; i++) {
    var rowArray = [];
    var colArray = [];
    var innerLength = array[i].length;
    for (var j = 0; j < innerLength; j++) {
      colArray.push(array[i][j]);
      if ((j + 1) % 2 === 0) {
        rowArray.push(colArray);
        colArray = [];
      }
    }
    convertedArray.push(rowArray);
  }
  return convertedArray;
};
