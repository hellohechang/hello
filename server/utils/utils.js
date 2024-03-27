const fs = require('fs');

const sharp = require('sharp');

const _d = require('../data/data');
// token加密
const jwt = require('jsonwebtoken');
// 歌曲信息解析
const mm = require('music-metadata');
// 接收上传文件
const formidable = require('formidable');
// ip地理位置
const IP2Region = require('ip2region').default;
const queryIP = new IP2Region();
// 压缩文件
const compressing = require('compressing');
const configObj = require('../data/config');
const { queryData, deleteData, updateData } = require('./sqlite');
const msg = require('../data/msg');
function getCity(ip) {
  const res = { country: '**', province: '**', city: '**', isp: '**' };
  try {
    const obj = queryIP.search(ip);
    Object.keys(res).forEach((key) => {
      const value = obj[key];
      if (value) {
        res[key] = value;
      }
    });
  } catch (error) {}
  return res;
}
// 记录日志
async function writelog(req, str, isErr) {
  str = str + '';
  str = str.trim().replace(/[\n\r]+/g, ' ');
  if (str.trim() === '') return;
  const date = formatDate({ template: '{0}-{1}-{2} {3}:{4}' });
  if (req) {
    const { country, province, city, isp } = getCity(req._ip);
    const { username, account } = req._jwt.userinfo;
    str = `[${date}]${username || account ? ' - ' : ''}${username || ''}${
      account ? `(${account})` : ''
    } - ${str} - [${country} ${province} ${city} ${isp}](${req._ip}) - ${
      req._os
    }\n`;
  } else {
    str = `[${date}] - ${str}\n`;
  }
  await _mkdir(`${configObj.filepath}/log`);
  const hp = `${configObj.filepath}/log/${isErr ? 'error' : 'hello'}.log`;
  // console.log(str);
  fs.appendFileSync(hp, str);
  const s = await _stat(hp);
  if (s.size > 10 * 1024 * 1024) {
    await _rename(
      hp,
      `${configObj.filepath}/log/${formatDate({
        template: '{0}{1}{2}_{3}{4}{5}',
      })}${isErr ? '.error' : ''}.log`
    );
  }
}
function errLog(req, err) {
  return writelog(req, `${req._mt}(${req._rp}) - ${err}`, true);
}
function paramErr(res, req) {
  _err(res, '参数错误');
  writelog(req, `${req._mt}(${req._rp}) - 参数错误：[ ${req._ct} ]`, true);
}
// 压缩文件
function compressFile(p1, p2) {
  return compressing.zip.compressFile(p1, p2);
}
// 压缩目录
function compressDir(p1, p2) {
  return compressing.zip.compressDir(p1, p2);
}
// 解压
function uncompress(p1, p2) {
  return compressing.zip.uncompress(p1, p2);
}
async function compressionImg(path, x = 400, y = 400, quality) {
  try {
    const inputBuf = await _readFile(path);
    const img = sharp(inputBuf);
    const meta = await img.metadata();
    const buf = await img
      .resize(x, y, { fit: 'inside' }) // 保持比例
      .png(
        ['gif', 'raw', 'tile'].includes(meta.format) || !quality
          ? {}
          : { quality }
      )
      .toBuffer();
    return Promise.resolve(buf);
  } catch (error) {
    return Promise.reject(error);
  }
}
async function getImgInfo(path) {
  try {
    const inputBuf = await _readFile(path);
    const img = sharp(inputBuf);
    return img.metadata();
  } catch (error) {
    return Promise.reject(error);
  }
}
function getCompressionSize(type) {
  let x = 400,
    y = 400;
  if (type == 'pic') {
    x = y = 500;
  } else if (type == 'bg') {
    x = 600;
  } else if (type == 'bgxs') {
    y = 800;
  }
  return { x, y };
}
// 获取和保存文件
function _readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _readdir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _appendFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
//复制文件
function _hdCopy(p1, p2) {
  return new Promise((resolve, reject) => {
    fs.cp(p1, p2, { recursive: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
// 移动文件
function _rename(p1, p2) {
  return new Promise((resolve, reject) => {
    fs.rename(p1, p2, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
// 客户端ip获取
function getClientIp(req) {
  let ip = '';
  try {
    ip =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      '';
  } catch (error) {
    ip = '';
  }
  let reg =
    /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
  ip = ip.match(reg);
  return ip ? ip[0] : '0.0.0.0';
}
// 文件随机后缀
function getRandomName(str) {
  let r = '_' + Math.random().toString().slice(-6),
    arr = getSuffix(str);
  return arr[0] + r + `${arr[1] === '' ? '' : `.${arr[1]}`}`;
}
async function _delDir(path) {
  try {
    if (_d.trash == 'y') {
      const trashDir = `${configObj.filepath}/trash`;
      if (
        path === trashDir ||
        isParentDir(path, trashDir) ||
        isParentDir(trashDir, path)
      ) {
        return delDir(path);
      }
      await _mkdir(trashDir);
      let fname = getPathFilename(path)[0];
      if (fs.existsSync(`${trashDir}/${fname}`)) {
        fname = getRandomName(fname);
      }
      return _rename(path, `${trashDir}/${fname}`);
    } else if (_d.trash == 'n') {
      return delDir(path);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
function delDir(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, function (err, status) {
      if (err) {
        reject(err);
        return;
      }
      if (status.isDirectory()) {
        fs.readdir(path, function (err, file) {
          if (err) {
            reject(err);
            return;
          }
          let res = file.map((item) => delDir(`${path}/${item}`));
          Promise.all(res)
            .then(() => {
              fs.rmdir(path, (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }
    });
  });
}
function formatDate(opt = {}) {
  let { template = '{0}-{1}-{2} {3}:{4}:{5}', timestamp = Date.now() } = opt;
  let date = new Date(+timestamp);
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    week = date.getDay(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  let weekArr = ['日', '一', '二', '三', '四', '五', '六'],
    timeArr = [year, month, day, hour, minute, second, week];
  return template.replace(/\{(\d+)\}/g, function () {
    let key = arguments[1];
    if (key == 6) return weekArr[timeArr[key]];
    let val = timeArr[key] + '';
    if (val == 'undefined') return '';
    return val.length < 2 ? '0' + val : val;
  });
}
// 获取扩展名
function getSuffix(str) {
  let idx = str.lastIndexOf('.'),
    a = '',
    b = '';
  if (idx < 0) {
    a = str;
  } else {
    a = str.slice(0, idx);
    b = str.slice(idx + 1);
  }
  return [a, b];
}
// 用户密码二次加密
function encryption(str) {
  return str.slice(10, -10).split('').reverse().join('');
}
//处理返回的结果
function _send(res, options) {
  res.status(200);
  res.type('application/json');
  res.send(
    Object.assign(
      {
        code: 0,
        codeText: 'OK',
        data: null,
      },
      options
    )
  );
}
function _success(res, codeText = '操作成功', data = null) {
  _send(res, {
    data,
    codeText,
  });
}
function _nologin(res) {
  _send(res, {
    code: 2,
    codeText: `当前未登录，请登录后再操作`,
  });
}
function _nothing(res, data = null) {
  _send(res, {
    code: 3,
    data,
  });
}
function _err(res, codeText = '操作失败，请稍后再试', data = null) {
  _send(res, {
    code: 1,
    codeText,
  });
}
function delay(time) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      resolve();
    }, time);
  });
}
// 定时器
function _setTimeout(callback, time) {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    callback();
  }, time);
  return timer;
}
// 生成token
function jwten(userinfo) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
      userinfo,
    },
    _d.tokenKey
  );
}
// 解密token
function jwtde(token) {
  try {
    let obj = jwt.verify(token, _d.tokenKey);
    obj.userinfo = obj.userinfo || {};
    return obj;
  } catch (error) {
    return { userinfo: {} };
  }
}
//接收文件
function receiveFiles(req, path, filename, maxFileSize = 5) {
  return new Promise((resolve, reject) => {
    maxFileSize = maxFileSize * 1024 * 1024;
    formidable({
      multiples: false,
      uploadDir: path, //上传路径
      keepExtensions: true, //包含原始文件的扩展名
      maxFileSize, //限制上传文件的大小。
    }).parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
      } else {
        let newPath = `${path}/${files.attrname.newFilename}`,
          originalPath = `${path}/${hdFilename(filename)}`;
        fs.rename(newPath, originalPath, function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }
    });
  });
}
// 合并切片
async function mergefile(count, from, to) {
  try {
    let list = await _readdir(from);
    if (list.length !== count) {
      return Promise.reject('切片数不符合');
    }
    list.sort((a, b) => {
      a = a.split('_')[1];
      b = b.split('_')[1];
      return a - b;
    });
    await _delDir(to).catch((err) => {});
    for (let i = 0; i < list.length; i++) {
      const u = `${from}/${list[i]}`;
      const f = await _readFile(u);
      await _appendFile(to, f);
      await delDir(u);
    }
    await delDir(from);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
function nanoid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function randomNum(x, y) {
  return Math.round(Math.random() * (y - x) + x);
}
// 音乐排序
function arrSortMinToMax(arr, property) {
  arr.sort((a, b) => {
    return mixedSort(a[property], b[property]);
  });
  return arr;
}
// 混合排序
function mixedSort(a, b) {
  if (/^\d+/.test(a) && /^\d+/.test(b)) {
    return /^\d+/.exec(a) - /^\d+/.exec(b);
  } else if (isChinese(a) && isChinese(b)) {
    return a.localeCompare(b, 'zh-CN');
  } else {
    return a.localeCompare(b, 'en');
  }
}
function isChinese(str) {
  if (
    /^[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]+/.test(
      str
    )
  ) {
    return true;
  } else {
    return false;
  }
}
// 更新歌单图
function handleMusicList(arr) {
  arr.forEach((v, i) => {
    if (i === 0) {
      v.pic = 'history';
      return;
    }
    if (v.item.length != 0) {
      v.pic = `/music/${v.item[0].pic}`;
    } else {
      v.pic = 'default';
    }
  });
  return arr;
}
function bookSort(arr) {
  return arr.sort((a, b) => a.num - b.num);
}
// 判断网址
function isurl(url) {
  try {
    const newUrl = new URL(url);
    if (newUrl.protocol === 'http:' || newUrl.protocol === 'https:') {
      return newUrl;
    }
    return false;
  } catch (err) {
    return false;
  }
}
// 获取url域名
function getHost(url) {
  let res = url.match(/\/\/([^/?#]+)/)[1];
  return res || 'hello.com';
}
// 读取目录文件
async function readMenu(path) {
  try {
    const list = await _readdir(path);
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      const name = list[i];
      const f = `${path}/${name}`;
      const s = await _stat(f);
      if (s.isDirectory()) {
        arr.push({
          path,
          type: 'dir',
          name,
          time: s.ctime.getTime(),
          size: 0,
        });
      } else if (s.isFile()) {
        arr.push({
          path,
          type: 'file',
          name,
          time: s.ctime.getTime(),
          size: s.size,
        });
      }
    }
    return Promise.resolve(arr);
  } catch (error) {
    return Promise.resolve([]);
  }
}
function isImgFile(name) {
  return /(\.jpg|\.jpeg|\.png|\.ico|\.svg|\.webp|\.gif)$/gi.test(name);
}
function encodeStr(keyword) {
  return keyword.replace(
    /[\[\(\$\^\.\]\*\\\?\+\{\}\\|\)]/gi,
    (key) => `\\${key}`
  );
}
function getWordIdx(searchVal, content) {
  searchVal = searchVal.trim();
  if (!searchVal) return [];
  const idx = searchVal.lastIndexOf('-');
  let searchArr = [];
  if (idx < 0) {
    searchArr = searchVal.split(' ');
  } else {
    searchArr = searchVal.slice(0, idx).split(' ');
  }
  searchArr = unique(searchArr);
  let regStr = '(';
  searchArr.forEach((item, idx) => {
    if (idx > 0) {
      regStr += '|';
    }
    regStr += encodeStr(item);
  });
  regStr += ')';
  let reg = new RegExp(regStr, 'ig');
  const res = [];
  content.replace(reg, (...[, $1, $2]) => {
    res.push({
      word: $1,
      start: $2,
      end: $2 + $1.length - 1,
    });
  });
  return res;
}
function getWordContent(searchVal, content) {
  let arr = getWordIdx(searchVal, content);
  if (arr.length < 1) return [];
  const spacing = 200,
    res = [],
    oneS = arr[0].start,
    oneE = arr[0].end;
  res.push({
    type: 'text',
    value: content.slice(oneS < spacing ? 0 : oneS - spacing, oneS),
  });
  res.push({ type: 'word', value: content.slice(oneS, oneE + 1) });
  if (arr.length > 1) {
    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1],
        item = arr[i];
      let prevE = prev.end,
        itemS = item.start,
        itemE = item.end;
      if (itemS <= prevE) {
        if (itemE < prevE) {
          item.end = prevE;
        } else {
          res.push({
            type: 'word',
            value: content.slice(prevE + 1, itemE + 1),
          });
        }
      } else {
        const diff = itemS - prevE;
        if (diff <= spacing) {
          res.push({ type: 'text', value: content.slice(prevE + 1, itemS) });
        } else {
          res.push({
            type: 'text',
            value: content.slice(prevE + 1, prevE + spacing / 2),
          });
          res.push({ type: 'icon', value: '...' });
          res.push({
            type: 'text',
            value: content.slice(itemS - spacing / 2, itemS),
          });
        }
        res.push({ type: 'word', value: content.slice(itemS, itemE + 1) });
      }
    }
  }
  const lastE = arr[arr.length - 1].end;
  res.push({ type: 'text', value: content.slice(lastE + 1, lastE + spacing) });
  return res;
}
function getWordCount(searchVal, content) {
  searchVal = searchVal.trim();
  if (!searchVal) return 0;
  let lowerContent = content.toLowerCase(),
    searchArr = [];
  const idx = searchVal.lastIndexOf('-');
  if (idx < 0) {
    searchArr = searchVal.split(' ');
  } else {
    const o = searchVal.slice(idx + 1);
    searchArr = searchVal.slice(0, idx).split(' ');
    searchArr.push(o);
  }
  searchArr = unique(searchArr);
  return searchArr.reduce((pre, item) => {
    let lowerItem = item.toLowerCase();
    if (lowerContent.includes(lowerItem)) {
      pre++;
    }
    return pre;
  }, 0);
}
function unique(arr, keys) {
  const obj = {};
  return arr.filter((item) => {
    if (keys) {
      keys.forEach((k) => {
        item = item[k];
      });
    }
    return obj.hasOwnProperty(typeof item + item)
      ? false
      : (obj[typeof item + item] = true);
  });
}
function splitWord(str) {
  str = str.trim();
  if (!str) return '';
  try {
    const intl = new Intl.Segmenter('cn', { granularity: 'word' });
    const obj = {};
    return (
      [...intl.segment(str)]
        .reduce((pre, item) => {
          const word = item.segment.trim();
          if (word && !obj.hasOwnProperty(typeof word + word)) {
            obj[typeof word + word] = true;
            pre.push(word);
          }
          return pre;
        }, [])
        .join(' ') + `-${str}`
    );
  } catch (error) {
    return str.split(' ') + `-${str}`;
  }
}
function getMusicObj(arr) {
  return arr.reduce((total, item) => {
    total[item.id] = item;
    return total;
  }, {});
}
function deepClone(obj) {
  //判断传入对象为数组或者对象
  let result = Array.isArray(obj) ? [] : {};
  // for in遍历
  for (let key in obj) {
    // 判断是否为自身的属性值（排除原型链干扰）
    if (obj.hasOwnProperty(key)) {
      // 判断对象的属性值中存储的数据类型是否为对象
      if (typeof obj[key] === 'object') {
        // 有可能等于null
        if (obj[key] === null) {
          result[key] = null;
          continue;
        }
        // 递归调用
        result[key] = deepClone(obj[key]); //递归复制
      }
      // 不是的话直接赋值
      else {
        result[key] = obj[key];
      }
    }
  }
  // 返回新的对象
  return result;
}
// const util = require('util')
async function getSongInfo(path) {
  try {
    const metadata = await mm.parseFile(path);
    // console.log(util.inspect(metadata, { showHidden: false, depth: null }));
    let duration = getIn(metadata, ['format', 'duration']) || 0,
      artist = getIn(metadata, ['common', 'artist']) || '未知',
      title = getIn(metadata, ['common', 'title']) || '未知',
      album = getIn(metadata, ['common', 'album']) || '--',
      year = getIn(metadata, ['common', 'year']) || '--',
      pic = getIn(metadata, ['common', 'picture', '0', 'data']) || '',
      picFormat = getIn(metadata, ['common', 'picture', '0', 'format']) || '',
      lrc = getIn(metadata, ['native', `ID3v2.3`]) || [];
    lrc = lrc.find(
      (item) => item !== null && typeof item === 'object' && item.id == 'USLT'
    );
    lrc = (lrc && getIn(lrc, ['value', 'text'])) || '';
    return Promise.resolve({
      duration,
      pic,
      lrc,
      artist,
      title,
      album,
      year,
      picFormat,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
function isMusicFile(str) {
  return /\.(mp3)$/i.test(str);
}
function isVideoFile(str) {
  return /\.(mp4)$/i.test(str);
}
function validationValue(target, arr) {
  return arr.includes(target);
}
function validaString(target, min = 0, w) {
  if (!_type.isString(target) || !_type.isNumber(min)) return false;
  if (target.length >= min) {
    if (w && min > 0) {
      return /^[\w]+$/.test(target);
    }
    return true;
  }
  return false;
}
const _type = (function () {
  const _obj = {
      isNumber: 'Number',
      isBoolean: 'Boolean',
      isString: 'String',
      isNull: 'Null',
      isUndefined: 'Undefined',
      isSymbol: 'Symbol',
      isObject: 'Object',
      isArray: 'Array',
      isRegExp: 'RegExp',
      isDate: 'Date',
      isFunction: 'Function',
      isWindow: 'Window',
    },
    _toString = _obj.toString,
    _type = {};
  for (let key in _obj) {
    if (!_obj.hasOwnProperty(key)) break;
    let reg = new RegExp('\\[object ' + _obj[key] + '\\]');
    _type[key] = function (val) {
      return reg.test(_toString.call(val));
    };
  }
  return _type;
})();
function setCookie(res, userinfo) {
  let token = jwten(userinfo);
  res.cookie('token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    httpOnly: true,
  });
}
function parseLrc(lrc) {
  const reg = /\[(\d+\:\d+(\.\d+)?)\]([^\[\n\r]+)/gi,
    res = [];
  lrc.replace(reg, (...[, $1, , $2]) => {
    const parr = $2.split('<=>'),
      tarr = $1.split(':');
    res.push({
      t: parseInt(tarr[0] * 60) + Math.round(tarr[1]),
      p: parr[0].trim(),
      fy: parr[1] ? parr[1].trim() : '',
    });
  });
  res.sort((a, b) => a.t - b.t);
  return res;
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
function getTimePath(timestamp) {
  return formatDate({
    template: '{0}/{1}/{2}',
    timestamp: timestamp || Date.now(),
  });
}
function createFillString(len) {
  return new Array(len).fill('?').join(',');
}
function getIn(target, keys) {
  if (!target) return;
  for (let i = 0; i < keys.length; i++) {
    target = target[keys[i]];
    if (!target) break;
  }
  return target;
}
function getFileDir(path) {
  return path.split('/').slice(0, -1).join('/');
}
function getPathFilename(path) {
  const filename = path.split('/').slice(-1)[0];
  const [a, b] = getSuffix(filename);
  return [filename, a, b];
}
async function delEmptyFolder(path) {
  try {
    const s = await _stat(path);
    if (s.isDirectory()) {
      const list = await _readdir(path);
      for (let i = 0; i < list.length; i++) {
        await delEmptyFolder(`${path}/${list[i]}`);
      }
      // 清除空文件夹
      if ((await _readdir(path)).length == 0) {
        await _delDir(path);
      }
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
async function getAllFile(path) {
  try {
    let arr = [];
    async function pool(path) {
      const s = await _stat(path);
      if (s.isDirectory()) {
        const list = await _readdir(path);
        for (let i = 0; i < list.length; i++) {
          await pool(`${path}/${list[i]}`);
        }
      } else {
        arr.push({
          name: getPathFilename(path)[0],
          path: getFileDir(path),
          size: s.size,
          atime: s.atimeMs, //最近一次访问文件的时间戳
          ctime: s.ctimeMs, //最近一次文件状态的修改的时间戳
          birthtime: s.birthtimeMs, //文件创建时间的时间戳
        });
      }
    }
    await pool(path);
    return Promise.resolve(arr);
  } catch (error) {
    return Promise.reject(error);
  }
}
function getRootDir(acc) {
  let path = configObj.rootP;
  if (acc !== 'root') {
    path = `${configObj.userFileP}/${acc}`;
  }
  return hdPath(path);
}
function _hdPath(acc, p) {
  return hdPath(getRootDir(acc) + '/' + p);
}
function hdPath(path) {
  return path.replace(/(\/){2,}/g, '/');
}
// 检查文件是否文本文件
function isTextFile(filepath, length) {
  fd = fs.openSync(filepath, 'r');
  length = length || 1000;
  for (var i = 0; i < length; i++) {
    buf = new Buffer.alloc(1);
    var bytes = fs.readSync(fd, buf, 0, 1, i);
    char = buf.toString().charCodeAt();
    if (bytes === 0) {
      return true;
    } else if (bytes === 1 && char === 0) {
      return false;
    }
  }
  return true;
}
function isParentDir(parentP, childP) {
  if (childP === parentP) return false;
  return parentP === childP.slice(0, parentP.length);
}
function isInteger(obj) {
  return Math.floor(obj) === obj;
}
function isValid(t) {
  return t != 0 && t <= Date.now();
}
async function cleanUpload() {
  try {
    if (_d.uploadSaveDay > 0) {
      let uploads = await queryData('upload', '*');
      let now = Date.now();
      const msgObj = {};
      (
        await queryData('chat', 'hash', `WHERE isrc!=? AND time>?`, [
          '',
          now - _d.uploadSaveDay * 24 * 60 * 60 * 1000,
        ])
      ).forEach((item) => {
        const { hash } = item;
        msgObj[hash] = true;
      });
      let del = uploads.filter((item) => !msgObj.hasOwnProperty(item.id));
      for (let i = 0; i < del.length; i++) {
        const { url } = del[i];
        await _delDir(`${configObj.filepath}/upload/${url}`).catch((err) => {});
      }
      await delEmptyFolder(`${configObj.filepath}/upload`).catch((err) => {});
      del = del.map((item) => item.id);
      await deleteData(
        'upload',
        `WHERE id IN (${createFillString(del.length)})`,
        [...del]
      );
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
function hdFilename(str, fill) {
  return str.replace(/[\\\\/]/gi, fill || '');
}
function syncUpdateData(req, flag, id = '') {
  msg.set(req._userInfo.account, req._temid, { type: 'updatedata', flag, id });
}
async function hdChatSendMsg(req, to, flag, tt) {
  const { account, logo, username } = req._userInfo;
  const data = {
    type: 'chat',
    flag,
    to,
    from: {
      logo,
      account,
      username,
    },
  };
  if (flag === 'addmsg') {
    data.msgData = tt;
  } else {
    data.tt = tt;
  }
  let t = Date.now() + '';
  let meIsWhoFriend = await queryData('friends', '*', `WHERE friend=?`, [
    account,
  ]);
  if (data.to === 'chang') {
    //群消息
    if (flag === 'addmsg') {
      await updateData('friends', { islooK: 'n', time: t }, `WHERE friend=?`, [
        'chang',
      ]);
    }
    Object.keys(msg.getConnect()).forEach((key) => {
      //通知所有用户
      let des = '';
      let f = meIsWhoFriend.find((item) => item.account == key);
      if (f) {
        des = f.des;
      }
      data.from.des = des;
      msg.set(key, key === account ? nanoid() : req._temid, data);
    });
  } else {
    if (flag === 'addmsg' && data.to !== account) {
      await updateData(
        'friends',
        { islooK: 'n', time: t },
        `WHERE account=? AND friend=?`,
        [data.to, account]
      );
    }
    let des = '';
    let f = meIsWhoFriend.find((item) => item.account == data.to);
    if (f) {
      des = f.des;
    }
    data.from.des = des;
    msg.set(data.to, req._temid, data);
    msg.set(account, nanoid(), data);
  }
}
function isFilename(name) {
  return !/[?\\\\/<>*|]/g.test(name);
}
module.exports = {
  hdFilename,
  syncUpdateData,
  hdChatSendMsg,
  isFilename,
  cleanUpload,
  isValid,
  isInteger,
  isParentDir,
  errLog,
  isTextFile,
  getRootDir,
  _hdPath,
  hdPath,
  compressFile,
  compressDir,
  uncompress,
  getAllFile,
  delEmptyFolder,
  getPathFilename,
  getFileDir,
  getIn,
  getImgInfo,
  getTimePath,
  isVideoFile,
  generateKey,
  parseLrc,
  createFillString,
  getRandomName,
  setCookie,
  validaString,
  _type,
  validationValue,
  isMusicFile,
  getCity,
  getSongInfo,
  deepClone,
  getMusicObj,
  getWordIdx,
  _hdCopy,
  compressionImg,
  getCompressionSize,
  isImgFile,
  _stat,
  getHost,
  bookSort,
  readMenu,
  handleMusicList,
  arrSortMinToMax,
  writelog,
  _readFile,
  _writeFile,
  _readdir,
  _mkdir,
  _appendFile,
  getClientIp,
  getWordCount,
  _delDir,
  delDir,
  formatDate,
  getSuffix,
  encryption,
  isurl,
  _send,
  _success,
  _nologin,
  _nothing,
  _err,
  _setTimeout,
  delay,
  jwten,
  jwtde,
  getWordContent,
  splitWord,
  receiveFiles,
  mergefile,
  nanoid,
  _rename,
  randomNum,
  paramErr,
  encodeStr,
  unique,
};
