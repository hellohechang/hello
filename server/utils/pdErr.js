const data = {};
const waitTime = 10; // 分
const errNum = 3; // 次
function add(key) {
  key = 'key_' + key;
  const t = Date.now();
  if (data.hasOwnProperty(key)) {
    data[key]['n']++;
    data[key]['t'] = t;
  } else {
    data[key] = { n: 1, t };
  }
}
function allow(key) {
  key = 'key_' + key;
  const nt = Date.now();
  Object.keys(data).forEach((k) => {
    const { t } = data[k];
    if (nt - t > waitTime * 60 * 1000) {
      delete data[k];
    }
  });
  if (data.hasOwnProperty(key) && data[key]['n'] >= errNum) {
    return false;
  }
  return true;
}
const pdErr = {
  add,
  allow,
};
module.exports = pdErr;
