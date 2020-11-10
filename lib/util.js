'use strict';

exports.createUUID = ()=> {
  var s = [], i, uuid, hexDigits = '0123456789ABCDEF';
  for (i = 0; i < 32; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[12] = '4';
  s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
  uuid = s.join('');
  return uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20, 32);
};
exports.makeTime = (secs) => {
  var hours   = Math.floor(secs / 3600),
    minutes = Math.floor((secs - (hours * 3600)) / 60),
    seconds = Math.floor(secs - (hours * 3600) - (minutes * 60)),
    result;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  result = (hours === '00' ? '' : hours + ':') + minutes + ':' + seconds;
  if (/nan/i.test(result)) {
    return '';
  }
  return result;
};
// solution provided at:
// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
exports.escapeRegExp = function(s) {
  return (s || '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

exports.createRandomString = (length) =>{
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}