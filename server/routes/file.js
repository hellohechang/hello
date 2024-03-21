const express = require('express');
const fs = require('fs');
const {
  _nologin,
  validaString,
  readMenu,
  _success,
  _err,
  paramErr,
  _hdPath,
  getRootDir,
  hdPath,
  _stat,
  isTextFile,
  _readFile,
  _writeFile,
  _readdir,
  getFileDir,
  _mkdir,
  receiveFiles,
  mergefile,
  _delDir,
  validationValue,
  _type,
  _rename,
  _hdCopy,
  getSuffix,
  getRandomName,
  compressDir,
  compressFile,
  uncompress,
  nanoid,
  isParentDir,
  _nothing,
  isValid,
  errLog,
  hdFilename,
  syncUpdateData,
  isFilename,
} = require('../utils/utils');
const configObj = require('../data/config');
const { insertData, queryData } = require('../utils/sqlite');
const route = express.Router();

route.get('/share', async (req, res) => {
  try {
    let { id, pass = '' } = req.query;
    if (!validaString(id, 1, 1) || !validaString(pass)) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    const s = await queryData('getshare', '*', `WHERE id=? AND type IN(?,?)`, [
      id,
      'file',
      'dir',
    ]);
    if (s.length == 0) {
      _err(res, '分享已取消');
      return;
    }
    if (isValid(s[0].valid)) {
      _err(res, '分享已过期');
      return;
    }
    if (pass !== s[0].pass) {
      _nothing(res);
      return;
    }
    if (account && account != s[0].account) {
      const fArr = await queryData('friends', '*', `WHERE account=?`, [
        account,
      ]);
      const f = fArr.find((item) => item.friend == s[0].account);
      if (f) {
        s[0].username = f.des || s[0].username;
      }
    }
    _success(res, 'ok', {
      ...s[0],
      data: JSON.parse(s[0].data),
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//读取目录
route.get('/readsharedir', async (req, res) => {
  try {
    let { path, flag = '' } = req.query;
    if (!validaString(path, 1) || !validaString(flag)) {
      paramErr(res, req);
      return;
    }
    let p = '',
      rootP = '';
    const [id, pass] = flag.split('/');
    const sArr = await queryData(
      'share',
      '*',
      `WHERE id=? AND type=? AND pass=?`,
      [id, 'dir', pass]
    );
    if (sArr.length == 0 || isValid(sArr[0].valid)) {
      p = '';
    } else {
      const obj = JSON.parse(sArr[0].data);
      const { name } = obj;
      rootP = hdPath(getRootDir(sArr[0].account) + '/' + obj.path + '/' + name);
      p = hdPath(`${rootP}/${path}`);
    }
    if (fs.existsSync(p)) {
      const arr = (await readMenu(p)).map((item) => {
        let path = hdPath('/' + item.path.slice(rootP.length));
        return {
          ...item,
          path,
        };
      });
      _success(res, 'ok', arr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/getsharefile', async (req, res) => {
  try {
    let { path = '', flag = '' } = req.query;
    if (!validaString(path) || !validaString(flag)) {
      paramErr(res, req);
      return;
    }
    let p = '';
    const [id, pass] = flag.split('/');
    const sArr = await queryData(
      'share',
      '*',
      `WHERE id=? AND type IN(?,?) AND pass=?`,
      [id, 'file', 'dir', pass]
    );
    if (sArr.length == 0 || isValid(sArr[0].valid)) {
      p = '';
    } else {
      const obj = JSON.parse(sArr[0].data);
      const { name, type } = obj;
      const rootP = hdPath(
        getRootDir(sArr[0].account) + '/' + obj.path + '/' + name
      );
      if (type == 'file') {
        p = rootP;
      } else if (type == 'dir') {
        p = hdPath(`${rootP}/${path}`);
      }
    }
    if (!fs.existsSync(p)) {
      _err(res, '没有找到文件');
      return;
    }
    const stat = await _stat(p);
    if (!stat.isFile()) {
      _err(res, '没有找到文件');
      return;
    }
    if (isTextFile(p)) {
      //文本文件
      _success(res, 'ok', {
        type: 'text',
        data: (await _readFile(p)).toString(),
      });
    } else {
      _success(res, 'ok', {
        type: 'other',
      });
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
//读取目录
route.get('/readdir', async (req, res) => {
  try {
    let { path } = req.query;
    if (!validaString(path, 1)) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    const rootP = getRootDir(req._userInfo.account);
    if (fs.existsSync(p)) {
      const arr = (await readMenu(p)).map((item) => {
        let path = hdPath('/' + item.path.slice(rootP.length));
        return {
          ...item,
          path,
        };
      });
      _success(res, 'ok', arr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/getfile', async (req, res) => {
  try {
    let { path } = req.query;
    if (!validaString(path, 1)) {
      paramErr(res, req);
      return;
    }
    let fpath = _hdPath(req._userInfo.account, path);
    if (!fs.existsSync(fpath)) {
      _err(res, '没有找到文件');
      return;
    }
    const stat = await _stat(fpath);
    if (!stat.isFile()) {
      _err(res, '没有找到文件');
      return;
    }
    if (isTextFile(fpath)) {
      //文本文件
      _success(res, 'ok', {
        type: 'text',
        data: (await _readFile(fpath)).toString(),
      });
    } else {
      _success(res, 'ok', {
        type: 'other',
      });
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//新建文件
route.post('/addfile', async (req, res) => {
  try {
    let { path, name } = req.body;
    if (!validaString(path, 1) || !validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    if (!isFilename(name)) {
      _err(res, '名称包含了不允许的特殊字符');
      return;
    }
    const dir = _hdPath(req._userInfo.account, path);
    const fpath = hdPath(`${dir}/${name}`);
    if (fs.existsSync(fpath)) {
      _err(res, '已存在重名文件');
      return;
    }
    await _mkdir(dir);
    await _writeFile(fpath, '');
    _success(res, '创建成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/share', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { data, title, valid, pass = '' } = req.body;
    valid = parseInt(valid);
    if (
      !validaString(title, 1) ||
      !validaString(pass) ||
      isNaN(valid) ||
      (!_type.isObject(data) &&
        !validaString(data.name, 1) &&
        !validaString(data.path, 1) &&
        !validationValue(data.type, ['dir', 'file']))
    ) {
      paramErr(res, req);
      return;
    }
    data.name = hdFilename(data.name);
    if (!data.name) {
      paramErr(res, req);
      return;
    }
    await insertData('share', [
      {
        id: nanoid(),
        account,
        type: data.type,
        valid: valid == 0 ? 0 : Date.now() + valid * 24 * 60 * 60 * 1000,
        title,
        pass,
        data: JSON.stringify(data),
      },
    ]);
    syncUpdateData(req, 'sharelist');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 保存文件
route.post('/savefile', async (req, res) => {
  try {
    let { path, text = '' } = req.body;
    if (!validaString(path, 1) || !validaString(text)) {
      paramErr(res, req);
      return;
    }
    let fpath = _hdPath(req._userInfo.account, path);
    if (!fs.existsSync(fpath)) {
      _err(res);
      return;
    }
    await _writeFile(fpath, text);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//复制
route.post('/copy', async (req, res) => {
  try {
    let { path, data } = req.body;
    if (
      !validaString(path, 1) ||
      !_type.isArray(data) ||
      data.length == 0 ||
      !data.every(
        (item) =>
          _type.isObject(item) &&
          validaString(item.name, 1) &&
          validaString(item.path, 1)
      )
    ) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    if (!fs.existsSync(p)) {
      _err(res);
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let { name, path } = data[i];
      name = hdFilename(name);
      const f = _hdPath(req._userInfo.account, `${path}/${name}`);
      let to = hdPath(`${p}/${name}`);
      if (isParentDir(f, to) || !name) {
        continue;
      }
      if (fs.existsSync(to)) {
        to = hdPath(`${p}/${getRandomName(name)}`);
      }
      await _hdCopy(f, to);
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//移动
route.post('/move', async (req, res) => {
  try {
    let { path, data } = req.body;
    if (
      !validaString(path, 1) ||
      !_type.isArray(data) ||
      data.length == 0 ||
      !data.every(
        (item) =>
          _type.isObject(item) &&
          validaString(item.name, 1) &&
          validaString(item.path, 1)
      )
    ) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    if (!fs.existsSync(p)) {
      _err(res);
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let { name, path } = data[i];
      name = hdFilename(name);
      const f = _hdPath(req._userInfo.account, `${path}/${name}`);
      let t = hdPath(`${p}/${name}`);
      if (f === t || isParentDir(f, t) || !name) {
        continue;
      }
      if (fs.existsSync(t)) {
        t = hdPath(`${p}/${getRandomName(name)}`);
      }
      await _rename(f, t);
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//压缩
route.post('/zip', async (req, res) => {
  try {
    let { data } = req.body;
    if (
      !_type.isObject(data) &&
      !validaString(data.name, 1) &&
      !validaString(data.path, 1) &&
      !validationValue(data.type, ['file', 'dir'])
    ) {
      paramErr(res, req);
      return;
    }
    let { name, path, type } = data;
    name = hdFilename(name);
    if (!name) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    const f = hdPath(`${p}/${name}`);
    const fname = getSuffix(name)[0] + '.zip';
    let t = hdPath(`${p}/${fname}`);
    if (fs.existsSync(t)) {
      t = hdPath(`${p}/${getRandomName(fname)}`);
    }
    if (type === 'dir') {
      await compressDir(f, t);
    } else {
      await compressFile(f, t);
    }
    _success(res, 'ok');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//解压缩
route.post('/unzip', async (req, res) => {
  try {
    let { data } = req.body;
    if (
      !_type.isObject(data) &&
      !validaString(data.name, 1) &&
      getSuffix(data.name)[1].toLowerCase() != 'zip' &&
      !validaString(data.path, 1) &&
      !validationValue(data.type, ['file'])
    ) {
      paramErr(res, req);
      return;
    }
    let { name, path } = data;
    name = hdFilename(name);
    if (!name) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    const f = hdPath(`${p}/${name}`);
    const fname = getSuffix(name)[0];
    let t = hdPath(`${p}/${fname}`);
    if (fs.existsSync(t)) {
      t = hdPath(`${p}/${getRandomName(fname)}`);
      await uncompress(f, t);
    } else {
      await uncompress(f, hdPath(`${t}/`));
    }
    _success(res, 'ok');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//删除
route.post('/delete', async (req, res) => {
  try {
    let { data } = req.body;
    if (
      !_type.isArray(data) ||
      data.length == 0 ||
      !data.every(
        (item) =>
          _type.isObject(item) &&
          validaString(item.name, 1) &&
          validaString(item.path, 1)
      )
    ) {
      paramErr(res, req);
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const { path, name } = data[i];
      const p = _hdPath(req._userInfo.account, `${path}/${name}`);
      await _delDir(p);
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//新建目录
route.post('/adddir', async (req, res) => {
  try {
    let { path, name } = req.body;
    if (!validaString(path, 1) || !validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    if (!isFilename(name)) {
      _err(res, '名称包含了不允许的特殊字符');
      return;
    }
    let fpath = _hdPath(req._userInfo.account, `${path}/${name}`);
    if (fs.existsSync(fpath)) {
      _err(res, '已存在重名文件');
      return;
    }
    await _mkdir(fpath);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//重命名
route.post('/rename', async (req, res) => {
  try {
    let { data, name } = req.body;
    if (
      !validaString(name, 1) ||
      !_type.isObject(data) ||
      !validaString(data.name) ||
      !validaString(data.path)
    ) {
      paramErr(res, req);
      return;
    }
    if (!isFilename(name)) {
      _err(res, '名称包含了不允许的特殊字符');
      return;
    }
    let dir = _hdPath(req._userInfo.account, data.path);
    let p = hdPath(`${dir}/${data.name}`),
      t = hdPath(`${dir}/${name}`);
    if (fs.existsSync(t)) {
      _err(res, '已存在重名文件');
      return;
    }
    await _rename(p, t);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/up', async (req, res) => {
  try {
    let { HASH, name } = req.query;
    if (!validaString(HASH, 1, 1) || !validaString(name, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let path = `${configObj.filepath}/tem/${HASH}`;
    await _mkdir(path);
    await receiveFiles(req, path, name, 50);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//合并文件
route.post('/mergefile', async (req, res) => {
  try {
    let { HASH, count, path } = req.body;
    count = parseInt(count);
    if (
      !validaString(HASH, 1, 1) ||
      !validaString(path, 1) ||
      isNaN(count) ||
      count < 1
    ) {
      paramErr(res, req);
      return;
    }
    const fpath = _hdPath(req._userInfo.account, path);
    await _mkdir(getFileDir(fpath));
    await mergefile(count, `${configObj.filepath}/tem/${HASH}`, `${fpath}`);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 断点续传
route.post('/breakpoint', async (req, res) => {
  try {
    let { HASH } = req.body;
    if (!validaString(HASH, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let path = `${configObj.filepath}/tem/${HASH}`,
      arr = [];
    if (fs.existsSync(path)) {
      arr = await _readdir(path);
    }
    _success(res, 'ok', arr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 检查上传文件是否重复
route.post('/repeatfile', async (req, res) => {
  try {
    let { path } = req.body;
    if (!validaString(path, 1)) {
      paramErr(res, req);
      return;
    }
    const p = _hdPath(req._userInfo.account, path);
    if (fs.existsSync(p)) {
      _success(res);
      return;
    }
    _nothing(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
module.exports = route;
