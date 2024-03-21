const express = require('express');
const route = express.Router();
const fs = require('fs');
const { resolve } = require('path');
const cheerio = require('cheerio');
const { default: axios } = require('axios');
const { _mkdir, compressionImg, _writeFile } = require('../utils/utils');
const configObj = require('../data/config');
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
    const prefix = `${u.protocol}//${u.host}`;
    await _mkdir(`${configObj.filepath}/favicon`);
    let result = await axios({
      method: 'get',
      url: prefix,
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
    let iconUrl = `${prefix}/favicon.ico`;
    if (icon) {
      const href = icon.attribs.href;
      if (!/^data\:image/i.test(href)) {
        if(/^http/i.test(href)){
          iconUrl = href;
        }else if (/^\/\//.test(href)) {
          // '//aa.com/img/xxx.png
          iconUrl = u.protocol + href;
        } else if (/^\//.test(href)) {
          // '/img/xxx.png'
          iconUrl = prefix + href;
        } else if (/^\./.test(href)) {
          // './img/xxx.png'
          iconUrl = prefix + href.slice(1);
        } else {
          // 'img/xxx.png'
          iconUrl = prefix + '/' + href;
        }
      }
    }
    await downFile(iconUrl, p);
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