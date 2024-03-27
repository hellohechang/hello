const express = require('express'),
  fs = require('fs'),
  route = express.Router();

const configObj = require('../data/config');
const _d = require('../data/data');
const {
  updateData,
  deleteData,
  queryData,
  runSqlite,
} = require('../utils/sqlite');
const timedTask = require('../utils/timedTask');
const {
  _success,
  _err,
  getSuffix,
  validaString,
  validationValue,
  paramErr,
  _readFile,
  _delDir,
  readMenu,
  generateKey,
  getAllFile,
  delEmptyFolder,
  delDir,
  errLog,
  cleanUpload,
  hdFilename,
  getPathFilename,
} = require('../utils/utils');
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account !== 'root') {
    _err(res, '请求被拒绝');
  } else {
    next();
  }
});
//管理员处理
// 重置密码
route.get('/resetpass', async (req, res) => {
  try {
    let a = req.query.a;
    if (!validaString(a, 1, 1)) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'user',
      {
        password: '', //密码重置为空
        flag: parseInt(Date.now() / 1000),
      },
      `WHERE account=? AND state=?`,
      [a, '0']
    );
    _success(res, '重置密码成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//获取用户列表
route.get('/userlist', async (req, res) => {
  try {
    let arr = await queryData('user', '*');
    arr = arr.map((item) => {
      return {
        ...item,
        online: Date.now() - item.time > 1000 * 20 ? 'n' : 'y',
      };
    });
    _success(res, 'ok', {
      uploadSaveDay: _d.uploadSaveDay,
      registerstate: _d.registerstate,
      trash: _d.trash,
      list: arr,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//通过管理员注销账号
route.post('/deluser', async (req, res) => {
  try {
    let { ac, flag = '1' } = req.body;
    if (!validaString(ac, 1, 1) || !validationValue(flag, ['0', '1'])) {
      paramErr(res, req);
      return;
    }
    if (ac !== 'root') {
      await updateData(
        'user',
        {
          state: flag,
        },
        `WHERE account=?`,
        [ac]
      );
      if (flag == '0') {
        _success(res, '激活账号成功');
      } else {
        _success(res, '关闭账号成功');
      }
    } else {
      _err(res, '请求被拒绝');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//通过管理员注销账号
route.post('/delaccount', async (req, res) => {
  try {
    let { ac } = req.body;
    if (!validaString(ac, 1, 1)) {
      paramErr(res, req);
      return;
    }
    if (ac !== 'root') {
      await deleteData('user', `WHERE account=?`, [ac]);
      await _delDir(`${configObj.filepath}/logo/${ac}`).catch((err) => {});
      _success(res, '销毁账号成功');
    } else {
      _err(res, '请求被拒绝');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//删除多余歌曲文件
route.get('/delmusicfile', async (req, res) => {
  try {
    const musicDir = `${configObj.filepath}/music`;
    if (fs.existsSync(musicDir)) {
      const musics = await queryData('musics', '*');
      const allMusicFile = await getAllFile(musicDir);
      for (let i = 0; i < allMusicFile.length; i++) {
        const { path, name } = allMusicFile[i];
        const url = `${path.slice(musicDir.length + 1)}/${getSuffix(name)[0]}`;
        if (!musics.some((item) => getSuffix(item.url)[0] == url)) {
          await _delDir(`${path}/${name}`).catch((err) => {});
        }
      }
      await delEmptyFolder(musicDir).catch((err) => {});
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/delbgfile', async (req, res) => {
  try {
    const bgDir = `${configObj.filepath}/bg`;
    if (fs.existsSync(bgDir)) {
      const bgs = await queryData('bg', '*');
      const allBgFile = await getAllFile(bgDir);
      for (let i = 0; i < allBgFile.length; i++) {
        const { path, name } = allBgFile[i];
        const url = `${path.slice(bgDir.length + 1)}/${name}`;
        if (!bgs.some((item) => item.url == url)) {
          await _delDir(`${path}/${name}`).catch((err) => {});
        }
      }
      await delEmptyFolder(bgDir).catch((err) => {});
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/delpicfile', async (req, res) => {
  try {
    const picDir = `${configObj.filepath}/pic`;
    if (fs.existsSync(picDir)) {
      const pics = await queryData('pic', '*');
      const allPicFile = await getAllFile(picDir);
      for (let i = 0; i < allPicFile.length; i++) {
        const { path, name } = allPicFile[i];
        const url = `${path.slice(picDir.length + 1)}/${name}`;
        if (!pics.some((item) => item.url == url)) {
          await _delDir(`${path}/${name}`).catch((err) => {});
        }
      }
      await delEmptyFolder(picDir).catch((err) => {});
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/cleantrash', async (req, res) => {
  try {
    await delDir(`${configObj.filepath}/trash`).catch((err) => {});
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/cleanthumb', async (req, res) => {
  try {
    const { type } = req.query;
    if (!validationValue(type, ['pic', 'music', 'bg', 'upload', 'all'])) {
      paramErr(res, req);
    }
    const delP =
      type == 'all'
        ? `${configObj.filepath}/thumb`
        : `${configObj.filepath}/thumb/${type}`;
    await _delDir(delP).catch((err) => {});
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//设置注册状态
route.post('/isregister', async (req, res) => {
  try {
    _d.registerstate = _d.registerstate == 'y' ? 'n' : 'y';
    _success(res, 'ok', _d.registerstate);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/updatetoken', async (req, res) => {
  try {
    _d.tokenKey = generateKey(30);
    _success(res, '更新tokenKey成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/uploadsaveday', async (req, res) => {
  try {
    let { day } = req.body;
    day = parseInt(day);
    if (isNaN(day) || day < 0) {
      paramErr(res, req);
      return;
    }
    _d.uploadSaveDay = day;
    cleanUpload();
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/getlog', async (req, res) => {
  try {
    const { name } = req.query;
    if (!validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    const log = (await _readFile(`${configObj.filepath}/log/${name}`))
      .toString()
      .split('\n');
    log.pop();
    log.reverse();
    _success(res, 'ok', log);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/loglist', async (req, res) => {
  try {
    const list = await readMenu(`${configObj.filepath}/log`);
    list.sort((a, b) => b.time - a.time);
    _success(res, 'ok', list);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/dellog', async (req, res) => {
  try {
    let { name } = req.body;
    if (!validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    name = hdFilename(name);
    if (!name) {
      paramErr(res, req);
      return;
    }
    if (name == 'all') {
      await _delDir(`${configObj.filepath}/log`).catch((err) => {});
    } else {
      await _delDir(`${configObj.filepath}/log/${name}`).catch((err) => {});
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/trash', async (req, res) => {
  try {
    _d.trash = _d.trash == 'y' ? 'n' : 'y';
    _success(res, 'ok', _d.trash);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/cleandatabase', async (req, res) => {
  try {
    await runSqlite('VACUUM;');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/cleanlogo', async (req, res) => {
  try {
    let bmk = await queryData('bookmk', 'logo', `WHERE logo!=?`, ['']);
    bmk = bmk.map((item) => getPathFilename(item.logo)[0]);
    let user = await queryData('user', 'logo', `WHERE logo!=?`, ['']);
    user = user.map((item) => getPathFilename(item.logo)[0]);
    const logos = [...bmk, ...user];
    const logoFiles = await getAllFile(`${configObj.filepath}/logo`);
    for (let i = 0; i < logoFiles.length; i++) {
      const { name, path } = logoFiles[i];
      const p = `${path}/${name}`;
      if (!logos.some((item) => item == name)) {
        await _delDir(p).catch((err) => {});
      }
    }
    await delEmptyFolder(`${configObj.filepath}/logo`).catch((err) => {});
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
timedTask.add(async (flag) => {
  if (flag.slice(-6) == '002000') {
    await cleanUpload();
  }
});
module.exports = route;
