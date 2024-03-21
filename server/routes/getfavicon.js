const express = require('express');
const route = express.Router();
const fs = require('fs');
const { resolve } = require('path');
const cheerio = require('cheerio');
const { default: axios } = require('axios');
const { _mkdir, compressionImg, _writeFile } = require('../utils/utils');
const configObj = require('../data/config');
function base64ToBuffer(data) {
  const base64 = data.replace(/^data:image\/\w+;base64,/, ''); //去掉图片base64码前面部分data:image/png;base64
  return Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
}
async function downFile(url, path) {
  const res = await axios({
    method: 'get',
    url,
    responseType: 'arraybuffer',
    timeout: 5000,
  });
  return _writeFile(path, Buffer.from(res.data, 'binary'));
}
route.get('/', async (req, res) => {
  try {
    const u = new URL(req.query.u);
    const eu = encodeURIComponent(u.host);
    const p = decodeURI(`${configObj.filepath}/favicon/${eu}.png`);
    if (fs.existsSync(p)) {
      res.sendFile(p);
      return;
    }
    await _mkdir(`${configObj.filepath}/favicon`);
    let result = await axios({
      method: 'get',
      url: `${u.protocol}//${u.host}`,
      timeout: 5000,
    });
    const $ = cheerio.load(result.data);
    const arr = $('link');
    let icon = null;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i],
        { rel, href } = item.attribs;
      if (item.name === 'link' && href && rel && rel.includes('icon')) {
        icon = item;
        break;
      }
    }
    if (!icon) {
      await downFile(`${u.protocol}//${u.host}/favicon.ico`, p);
    } else {
      let iconUrl = icon.attribs.href;
      if (/^data\:image/i.test(iconUrl)) {
        const buf = base64ToBuffer(iconUrl);
        await _writeFile(p, buf);
      } else {
        if (iconUrl.startsWith('//')) {
          // '//aa.com/img/xxx.png
          iconUrl = u.protocol + iconUrl;
        } else if (!iconUrl.startsWith('http')) {
          let str = `${u.protocol}//${u.host}`;
          if (iconUrl.startsWith('/')) {
            // '/img/xxx.png'
            iconUrl = str + iconUrl;
          } else if (iconUrl.startsWith('.')) {
            // './img/xxx.png'
            iconUrl = str + iconUrl.slice(1);
          } else {
            // 'img/xxx.png'
            iconUrl = str + '/' + iconUrl;
          }
        }
        await downFile(iconUrl, p);
      }
    }
    if (fs.existsSync(p)) {
      try {
        const buf = await compressionImg(p);
        await _writeFile(p, buf);
      } catch (error) {}
      res.sendFile(p);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.sendFile(resolve(__dirname, '../img/mrlogo.png'));
  }
});

module.exports = route;
