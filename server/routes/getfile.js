const express = require('express'),
  fs = require('fs'),
  route = express.Router();
const configObj = require('../data/config');
const {
  _err,
  _nologin,
  _stat,
  _mkdir,
  compressionImg,
  getCompressionSize,
  _writeFile,
  isImgFile,
  getPathFilename,
  validaString,
  paramErr,
  hdPath,
  _hdPath,
  isValid,
  getRootDir,
  errLog,
} = require('../utils/utils');
const { queryData } = require('../utils/sqlite');

route.get('/', async (req, res) => {
  try {
    const account = req._userInfo.account;
    const { t = '', p, pass = '' } = req.query;
    if (!validaString(t) || !validaString(pass) || !validaString(p, 1)) {
      paramErr(res, req);
      return;
    }
    let url = hdPath('/' + p);
    // 获取访问目录
    const pArr = url.split('/').filter((item) => item);
    let dir = pArr[0];
    let publicArr = ['pic', 'sharemusic', 'sharefile'];
    let verifyArr = ['bg', 'upload', 'file', 'music'];
    if (publicArr.includes(dir)) {
    } else if (verifyArr.includes(dir)) {
      if (!account) {
        _nologin(res);
        return;
      }
    } else {
      _err(res, '文件不存在或已过期');
      return;
    }
    // 合并url
    let path = '';
    if (dir === 'upload') {
      const id = pArr[1];
      const cArr = await queryData('chat', 'flag,isrc', `WHERE id=?`, [id]);
      if (cArr.length > 0) {
        if (
          cArr[0].isrc &&
          (cArr[0].flag == 'chang' || cArr[0].flag.includes(account))
        ) {
          path = hdPath(`${configObj.filepath}/upload/${cArr[0].isrc}`);
        }
      }
    } else if (dir === 'file') {
      path = _hdPath(account, pArr.slice(1).join('/'));
    } else if (dir === 'sharefile') {
      const id = pArr[1];
      const sArr = await queryData(
        'share',
        '*',
        `WHERE id=? AND pass=? AND type IN(?,?)`,
        [id, pass, 'file', 'dir']
      );
      if (sArr.length > 0 && !isValid(sArr[0].valid)) {
        const obj = JSON.parse(sArr[0].data);
        const { name, type } = obj;
        const rootP = hdPath(
          getRootDir(sArr[0].account) + '/' + obj.path + '/' + name
        );
        if (type == 'file') {
          path = rootP;
        } else if (type == 'dir') {
          path = hdPath(`${rootP}/${pArr.slice(2).join('/')}`);
        }
      }
    } else if (dir === 'sharemusic') {
      if (account) {
        path = `${configObj.filepath}/music/${pArr.slice(3).join('/')}`;
      } else {
        const id = pArr[1];
        const mid = pArr[2];
        const sArr = await queryData(
          'share',
          '*',
          `WHERE id=? AND type=? AND pass=?`,
          [id, 'music', pass]
        );
        if (sArr.length > 0 && !isValid(sArr[0].valid)) {
          const arr = JSON.parse(sArr[0].data);
          if (arr.some((item) => item == mid)) {
            path = `${configObj.filepath}/music/${pArr.slice(3).join('/')}`;
          }
        }
      }
    } else {
      path = configObj.filepath + url;
    }
    path = hdPath(path);
    if (!fs.existsSync(path)) {
      _err(res, '文件不存在或已过期');
      return;
    }
    const stat = await _stat(path);
    if (!stat.isFile()) {
      _err(res, '文件不存在或已过期');
      return;
    }
    try {
      if (
        isImgFile(path) &&
        stat.size > 150 * 1024 &&
        t &&
        [
          'pic',
          'music',
          'bg',
          'upload',
          'file',
          'sharefile',
          'sharemusic',
        ].includes(dir)
      ) {
        if (dir === 'sharefile') {
          dir = 'file';
        }
        if (dir === 'sharemusic') {
          dir = 'music';
        }
        const thumbP = `${configObj.filepath}/thumb/${dir}`;
        const tp = `${thumbP}/${getPathFilename(url)[1]}_${stat.size}.png`;
        if (!fs.existsSync(tp)) {
          await _mkdir(thumbP);
          const { x, y } = getCompressionSize(dir);
          const buf = await compressionImg(path, x, y, 20);
          await _writeFile(tp, buf);
        }
        path = tp;
      }
    } catch (error) {}
    res.sendFile(path);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
module.exports = route;
