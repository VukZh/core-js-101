/* *******************************************************************************************
 *                                                                                           *
 * Plese read the following tutorial before implementing tasks:                              *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Date_object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date     *
 *                                                                                           *
 ******************************************************************************************* */


/**
 * Parses a rfc2822 string date representation into date value
 * For rfc2822 date specification refer to : http://tools.ietf.org/html/rfc2822#page-14
 *
 * @param {string} value
 * @return {date}
 *
 * @example:
 *    'December 17, 1995 03:24:00'    => Date()
 *    'Tue, 26 Jan 2016 13:48:02 GMT' => Date()
 *    'Sun, 17 May 1998 03:00:00 GMT+01' => Date()
 */
function parseDataFromRfc2822(value) {
  const flagGMT = value.includes('GMT');
  const parse1 = value.replace(',', '').replace('+', '').replace('GMT', '');
  const valueArr = parse1.split(' ');
  let year;
  let mnt;
  let dy;
  let hr;
  let min;
  let sc;
  let offs;
  let wd;
  let tm;
  if (valueArr[0].length === 3) {
    [wd, dy, mnt, year, tm, offs] = valueArr;
    [hr, min, sc] = tm.split(':');
  } else {
    [mnt, dy, year, tm] = valueArr;
    [hr, min, sc] = tm.split(':');
  }
  wd = '';
  mnt += wd;
  if (mnt === 'December') {
    mnt = 11;
  } else if (mnt === 'Jan') {
    mnt = 0;
  } else if (mnt === 'May') {
    mnt = 4;
  }
  // console.log(`y ${year} m ${mnt} d ${dy} h ${hr} m ${min} s ${sc} w ${wd} o ${offs}`);
  if (offs) {
    const o = Number(offs.substr(0, 2));
    hr -= o;
  }
  return (flagGMT) ? new Date(Date.UTC(year, mnt, dy, hr, min, sc))
    : new Date(year, mnt, dy, hr, min, sc);
}

/**
 * Parses an ISO 8601 string date representation into date value
 * For ISO 8601 date specification refer to : https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {string} value
 * @return {date}
 *
 * @example :
 *    '2016-01-19T16:07:37+00:00'    => Date()
 *    '2016-01-19T08:07:37Z' => Date()
 */
function parseDataFromIso8601(value) {
  const parse1 = value.split('T');
  const parse11 = parse1[0].split('-');
  const parse12 = parse1[1].split(':');
  const parse121 = parse12[2];
  const year = parse11[0];
  const mnt = parse11[1];
  const dy = parse11[2];
  const hr = parse12[0];
  const min = parse12[1];
  const sc = parse121.slice(0, 2);
  return new Date(Date.UTC(year, mnt - 1, dy, hr, min, sc));
}


/**
 * Returns true if specified date is leap year and false otherwise
 * Please find algorithm here: https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param {date} date
 * @return {bool}
 *
 * @example :
 *    Date(1900,1,1)    => false
 *    Date(2000,1,1)    => true
 *    Date(2001,1,1)    => false
 *    Date(2012,1,1)    => true
 *    Date(2015,1,1)    => false
 */
function isLeapYear(date) {
  const year = date.getUTCFullYear();
  let res = false;
  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    res = true;
  }
  return res;
}


/**
 * Returns the string represention of the timespan between two dates.
 * The format of output string is "HH:mm:ss.sss"
 *
 * @param {date} startDate
 * @param {date} endDate
 * @return {string}
 *
 * @example:
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,11,0,0)   => "01:00:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,30,0)       => "00:30:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,20)        => "00:00:20.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,0,250)     => "00:00:00.250"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,15,20,10,453)   => "05:20:10.453"
 */
function timeSpanToString(startDate, endDate) {
  const dif = endDate - startDate;
  const h = Math.trunc(dif / 3600000);
  const m = Math.trunc((dif - h * 3600000) / 60000);
  const s = Math.trunc((dif - h * 3600000 - m * 60000) / 1000);
  const ms = Math.abs(h * 3600000 + m * 60000 + s * 1000 - dif);
  const hStr = (h < 10) ? `0${h}` : `${h}`;
  const mStr = (m < 10) ? `0${m}` : `${m}`;
  const sStr = (s < 10) ? `0${s}` : `${s}`;
  let msStr;
  if (ms < 10) {
    msStr = `00${ms}`;
  } else if (ms < 100) {
    msStr = `0${ms}`;
  } else {
    msStr = `${ms}`;
  }
  const difStr = `${hStr}:${mStr}:${sStr}.${msStr}`;
  return difStr;
}


/**
 * Returns the angle (in radians) between the hands of an analog clock
 * for the specified Greenwich time.
 * If you have problem with solution please read: https://en.wikipedia.org/wiki/Clock_angle_problem
 *
 * @param {date} date
 * @return {number}
 *
 * @example:
 *    Date.UTC(2016,2,5, 0, 0) => 0
 *    Date.UTC(2016,3,5, 3, 0) => Math.PI/2
 *    Date.UTC(2016,3,5,18, 0) => Math.PI
 *    Date.UTC(2016,3,5,21, 0) => Math.PI/2
 */
function angleBetweenClockHands(date) {
  const hour = (date.getUTCHours() > 12) ? date.getUTCHours() - 12 : date.getUTCHours();
  const minute = date.getUTCMinutes();
  let angle = (hour + (minute / 60)) * 30 - minute * 6;
  if (angle > 180) {
    angle = 360 - angle;
  }
  return (Math.abs(angle) * Math.PI) / 180;
}

module.exports = {
  parseDataFromRfc2822,
  parseDataFromIso8601,
  isLeapYear,
  timeSpanToString,
  angleBetweenClockHands,
};
