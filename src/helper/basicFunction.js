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
};

// full dateformat hh:mm:ss
export const convertDateFormatfull = (jsondate) => {
  if(jsondate !== undefined && jsondate !== null){
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
  }else{
    return null
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

export const convertDMSToDD  = (dms) => {
  let parts = dms.split(/[^\d+(\,\d+)\d+(\.\d+)?\w]+/);
  let degrees = parseFloat(parts[0]);
  let minutes = parseFloat(parts[1]);
  let seconds = parseFloat(parts[2].replace(',','.'));
  let direction = parts[3];

  // console.log('degrees: '+degrees)
  // console.log('minutes: '+minutes)
  // console.log('seconds: '+seconds)
  // console.log('direction: '+direction)

  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}
