const express = require('express'),
  fs = require('fs'),
  route = express.Router();
const configObj = require('../data/config');
const {
  updateData,
  insertData,
  queryData,
  deleteData,
} = require('../utils/sqlite');
const timedTask = require('../utils/timedTask');
const {
  _readdir,
  _mkdir,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  isImgFile,
  getSuffix,
  randomNum,
  validationValue,
  _type,
  validaString,
  paramErr,
  _delDir,
  getTimePath,
  getImgInfo,
  createFillString,
  nanoid,
  errLog,
  getIn,
  syncUpdateData,
} = require('../utils/utils');
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
timedTask.add(async (flag) => {
  if (flag.slice(-6) === '000000') {
    //每日切换壁纸
    const bgarr = await queryData('bg', 'type,id');
    const bg = bgarr.filter((item) => item.type == 'bg');
    const bgxs = bgarr.filter((item) => item.type == 'bgxs');
    let num = randomNum(0, bg.length - 1),
      xsnum = randomNum(0, bgxs.length - 1);
    await updateData(
      'user',
      {
        bg: getIn(bg, [num, 'id']) || '',
        bgxs: getIn(bgxs, [xsnum, 'id']) || '',
      },
      `WHERE dailybg=? AND state=?`,
      ['y', '0']
    );
  }
});
// 随机壁纸
route.get('/randombg', async (req, res) => {
  try {
    let p = req.query.p;
    if (!validationValue(p, ['bg', 'bgxs'])) {
      paramErr(res, req);
      return;
    }
    const bgarr = await queryData('bg', '*', `WHERE type=?`, [p]);
    const num = randomNum(0, bgarr.length - 1);
    if (bgarr.length === 0) {
      _err(res, '壁纸库为空，请先上传壁纸');
      return;
    }
    _success(res, 'ok', bgarr[num]);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 更新壁纸
route.post('/updatabg', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { flag, bg } = req.body;
    if (!validationValue(flag, ['bg', 'bgxs']) || !validaString(bg, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let obj = {};
    obj[flag] = bg;
    await updateData('user', obj, `WHERE account=? AND state=?`, [
      account,
      '0',
    ]);
    syncUpdateData(req, 'userinfo');
    _success(res, '更换壁纸成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 壁纸获取
route.get('/getbg', async (req, res) => {
  try {
    let { flag, page = 1, showpage = 40 } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      !validationValue(flag, ['bg', 'bgxs']) ||
      isNaN(page) ||
      isNaN(showpage) ||
      page < 1 ||
      showpage < 1 ||
      showpage > 100
    ) {
      paramErr(res, req);
      return;
    }

    let bgarr = await queryData('bg', '*', `WHERE type=?`, [flag]),
      pagenum = Math.ceil(bgarr.length / showpage) || 1;
    bgarr.reverse();
    page > pagenum ? (page = pagenum) : null;
    let arr = bgarr.slice(showpage * (page - 1), showpage * page);

    _success(res, 'ok', {
      total: bgarr.length,
      totalPage: pagenum,
      pageNo: page,
      data: arr,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除壁纸
route.post('/delbg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '请求被拒绝');
      return;
    }
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
      'bg',
      'url',
      `WHERE id IN (${createFillString(arr.length)})`,
      [...arr]
    );
    for (let i = 0; i < del.length; i++) {
      const { url } = del[i];
      await _delDir(`${configObj.filepath}/bg/${url}`).catch((err) => {});
    }
    await deleteData('bg', `WHERE id IN (${createFillString(arr.length)})`, [
      ...arr,
    ]);
    syncUpdateData(req, 'bg');
    _success(res, '删除壁纸成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 上传壁纸
route.post('/up', async (req, res) => {
  try {
    let { HASH, name } = req.query;
    if (!validaString(HASH, 1, 1) || !isImgFile(name)) {
      paramErr(res, req);
      return;
    }
    const [title, suffix] = getSuffix(name);
    const time = Date.now();
    const timePath = getTimePath(time);
    const tDir = `${configObj.filepath}/bg/${timePath}`;
    const tName = `${HASH}.${suffix}`;
    await _mkdir(tDir);
    await receiveFiles(req, tDir, tName, 20);
    const { width, height } = await getImgInfo(`${tDir}/${tName}`);
    const type = width < height ? 'bgxs' : 'bg';
    await insertData('bg', [
      {
        id: nanoid(),
        hash: HASH,
        url: `${timePath}/${tName}`,
        time,
        type,
        title,
      },
    ]);
    _success(res);
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
    const bg = await queryData('bg', 'hash', `WHERE hash=?`, [HASH]);
    if (bg.length > 0) {
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
