const express = require('express'),
  fs = require('fs'),
  route = express.Router();
const configObj = require('../data/config');
const { queryData, deleteData, insertData } = require('../utils/sqlite');
const {
  _readdir,
  _mkdir,
  _success,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  isImgFile,
  _nologin,
  getSuffix,
  _type,
  paramErr,
  _delDir,
  getTimePath,
  validaString,
  createFillString,
  nanoid,
  errLog,
} = require('../utils/utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
// 上传
route.post('/up', async (req, res) => {
  try {
    const { HASH, name } = req.query;
    if (!validaString(HASH, 1, 1) || !isImgFile(name)) {
      paramErr(res, req);
      return;
    }
    const [title, suffix] = getSuffix(name);
    const time = Date.now();
    const timePath = getTimePath(time);
    const tDir = `${configObj.filepath}/pic/${timePath}`;
    const tName = `${HASH}.${suffix}`;
    await _mkdir(tDir);
    await receiveFiles(req, tDir, tName, 5);
    const obj = {
      id: nanoid(),
      hash: HASH,
      url: `${timePath}/${tName}`,
      time,
      title,
    };
    await insertData('pic', [obj]);
    _success(res, 'ok', obj);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 检查上传文件是否重复
route.post('/repeatfile', async (req, res) => {
  try {
    let { HASH } = req.body;
    if (!validaString(HASH, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const pic = await queryData('pic', '*', `WHERE hash=?`, [HASH]);
    if (pic.length > 0) {
      _success(res, 'ok', pic[0]);
      return;
    }
    _nothing(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

route.use((req, res, next) => {
  if (req._userInfo.account === 'root') {
    next();
  } else {
    _err(res, '请求被拒绝');
  }
});
// 图床
// 获取
route.get('/getlist', async (req, res) => {
  try {
    let { page = 1, showpage = 40 } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      isNaN(page) ||
      isNaN(showpage) ||
      page < 1 ||
      showpage < 1 ||
      showpage > 100
    ) {
      paramErr(res, req);
      return;
    }
    let picArr = await queryData('pic', '*'),
      pagenum = Math.ceil(picArr.length / showpage) || 1;
    picArr.reverse();
    page > pagenum ? (page = pagenum) : null;
    let arr = picArr.slice(showpage * (page - 1), showpage * page);

    _success(res, 'ok', {
      total: picArr.length,
      totalPage: pagenum,
      pageNo: page,
      data: arr,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除
route.post('/delpic', async (req, res) => {
  try {
    let arr = req.body;
    if (
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 100 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    const del = await queryData(
      'pic',
      'url',
      `WHERE id IN (${createFillString(arr.length)})`,
      [...arr]
    );
    for (let i = 0; i < del.length; i++) {
      const { url } = del[i];
      await _delDir(`${configObj.filepath}/pic/${url}`).catch((err) => {});
    }
    await deleteData('pic', `WHERE id IN (${createFillString(arr.length)})`, [
      ...arr,
    ]);
    _success(res, '删除图片成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
