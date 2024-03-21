const fs = require('fs');
const { resolve } = require('path');
const configObj = require('./config');
let config = JSON.parse(fs.readFileSync(resolve(__dirname, 'config.json')));
const configP = `${configObj.filepath}/data/config.json`;
config.tokenKey = generateKey(30);
if (fs.existsSync(configP)) {
  config = JSON.parse(fs.readFileSync(configP));
}
const _d = deepProxy(config, save);
if (!fs.existsSync(configP)) {
  save();
}
function save() {
  fs.mkdirSync(`${configObj.filepath}/data`, { recursive: true });
  fs.writeFileSync(configP, JSON.stringify(_d, null, 2));
}
function deepProxy(target, callback) {
  let handler = {
    get(target, key) {
      let res = Reflect.get(target, key);
      return res !== null && typeof res === 'object'
        ? new Proxy(res, handler)
        : res;
    },
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      callback && callback();
      return res;
    },
  };
  return new Proxy(target, handler);
}
function generateKey(keyLength) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const charactersLength = characters.length;
  for (let i = 0; i < keyLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = _d;
