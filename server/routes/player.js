const express = require('express'),
  fs = require('fs'),
  route = express.Router();
const {
  insertData,
  updateData,
  queryData,
  deleteData,
  runSqlite,
} = require('../utils/sqlite');
const {
  handleMusicList,
  _readFile,
  _writeFile,
  _mkdir,
  getSuffix,
  deepClone,
  getSongInfo,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  nanoid,
  isImgFile,
  getMusicObj,
  isMusicFile,
  validaString,
  _type,
  validationValue,
  paramErr,
  _delDir,
  parseLrc,
  getWordCount,
  unique,
  splitWord,
  createFillString,
  getTimePath,
  getFileDir,
  getPathFilename,
  isVideoFile,
  isValid,
  errLog,
  syncUpdateData,
} = require('../utils/utils');
const _d = require('../data/data');
const configObj = require('../data/config');

//获取歌词
route.get('/lrc', async (req, res) => {
  const errData = [
    {
      t: 0,
      p: '未找到歌词',
      fy: '',
    },
  ];
  try {
    const account = req._userInfo.account;
    let { id, flag = '' } = req.query;
    if (!validaString(id, 1, 1) || !validaString(flag)) {
      paramErr(res, req);
      return;
    }
    if (!account) {
      const [pid, pass] = flag.split('/');
      const sArr = await queryData(
        'share',
        '*',
        `WHERE id=? AND type=? AND pass=?`,
        [pid, 'music', pass]
      );
      if (sArr.length == 0 || isValid(sArr[0].valid)) {
        _err(res, '请求被拒绝');
        return;
      } else {
        const arr = JSON.parse(sArr[0].data);
        if (!arr.some((item) => item == id)) {
          _err(res, '请求被拒绝');
          return;
        }
      }
    }
    const info = await queryData('musics', 'lrc,title,artist', `WHERE id=?`, [
      id,
    ]);
    if (info.length == 0) {
      _success(res, 'ok', errData);
      return;
    }
    await runSqlite(`update musics set play_count=play_count+1 where id=?`, [
      id,
    ]);
    let url = `${configObj.filepath}/music/${info[0].lrc}`;
    if (fs.existsSync(url)) {
      let str = (await _readFile(url)).toString(),
        rod = parseLrc(str);
      rod.unshift({
        t: 0,
        p: '',
        fy: '',
      });
      if (rod.length === 1) {
        _success(res, 'ok', errData);
      } else {
        _success(res, 'ok', rod);
      }
    } else {
      _success(res, 'ok', errData);
    }
  } catch (error) {
    await errLog(req, error);
    _success(res, 'ok', errData);
  }
});
route.get('/getsonginfo', async (req, res) => {
  try {
    const { id } = req.query;
    const arr = await queryData('musics', '*', `WHERE id=?`, [id]);
    if (arr.length == 0) {
      _err(res, '歌曲不存在');
      return;
    }
    _success(res, 'ok', arr[0]);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/musicshare', async (req, res) => {
  try {
    let { id, pass = '' } = req.query;
    if (!validaString(id, 1, 1) || !validaString(pass)) {
      paramErr(res, req);
      return;
    }
    let account = req._userInfo.account;
    let sArr = await queryData('getshare', '*', `WHERE id=? AND type=?`, [
      id,
      'music',
    ]);
    if (sArr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    if (isValid(sArr[0].valid)) {
      _err(res, '分享已过期');
      return;
    }
    if (pass !== sArr[0].pass) {
      _nothing(res);
      return;
    }
    let arr = JSON.parse(sArr[0].data);
    let mObj = getMusicObj(await queryData('musics', '*'));
    for (let i = 0; i < arr.length; i++) {
      if (mObj.hasOwnProperty(arr[i])) {
        arr[i] = mObj[arr[i]];
      } else {
        arr.splice(i, 1);
        i--;
      }
    }
    if (arr.length == 0) {
      _err(res, '歌曲不存在');
      return;
    }
    if (account && account != sArr[0].account) {
      const fArr = await queryData('friends', '*', `WHERE account=?`, [
        account,
      ]);
      const f = fArr.find((item) => item.friend == sArr[0].account);
      if (f) {
        sArr[0].username = f.des || sArr[0].username;
      }
    }
    _success(res, 'ok', {
      ...sArr[0],
      data: arr,
    });
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
//搜索
route.get('/search', async (req, res) => {
  try {
    let { a } = req.query;
    if (!validaString(a, 1)) {
      paramErr(res, req);
      return;
    }
    a = splitWord(a);
    let ar = await queryData('musics', '*');
    ar.reverse();
    let sArr = [];
    ar.forEach((item) => {
      let { title, artist } = item;
      let str = `${title}${artist}`;
      let sNum = getWordCount(a, str);
      if (sNum > 0) {
        sArr.push({
          ...item,
          sNum,
        });
      }
    });
    sArr.sort((a, b) => {
      return b.sNum - a.sNum;
    });
    ar = sArr.map((item) => {
      delete item.sNum;
      return item;
    });
    _success(res, 'ok', { list: ar, splitWord: a });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
async function getMusicList(account) {
  let arr = await queryData('musicinfo', 'data', `WHERE account=?`, [account]);
  if (arr.length == 0) {
    arr = [
      { name: '播放历史', pic: 'img/history.jpg', item: [], id: 'history' },
      { name: '收藏', pic: 'img/music.jpg', item: [], id: 'favorites' },
    ];
    await insertData('musicinfo', [
      {
        account,
        data: JSON.stringify(arr),
      },
    ]);
    return arr;
  }
  return JSON.parse(arr[0].data);
}
//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { id = '' } = req.query;
    if (!validaString(id, 0, 1)) {
      paramErr(res, req);
      return;
    }
    let arr = await queryData('musics', '*'),
      mObj = getMusicObj(arr),
      uArr = await getMusicList(account);
    let flag = false;
    uArr.forEach((item) => {
      for (let i = 0; i < item.item.length; i++) {
        let y = item.item[i];
        if (mObj.hasOwnProperty(y.id)) {
          item.item[i] = mObj[y.id];
        } else {
          flag = true;
          item.item.splice(i, 1);
          i--;
        }
      }
    });
    if (flag) {
      let marr = deepClone(uArr);
      marr.forEach((item) => {
        item.item = item.item.map((y) => ({ id: y.id }));
      });
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(marr),
        },
        `WHERE account=?`,
        [account]
      );
    }
    uArr.splice(2, 0, { id: 'all', item: arr.reverse() });
    for (let i = 0; i < 3; i++) {
      uArr[i].name = _d.songList[i].name;
      uArr[i].des = _d.songList[i].des;
    }
    uArr = handleMusicList(uArr); //处理封面
    id ? null : (id = uArr[1].id);
    uArr = uArr.map((item, i) => {
      item.num = i;
      if (item.id !== id && i != 1) {
        delete item.item;
      } else {
        item.item = item.item.map((o, idx) => ({ ...o, num: idx }));
      }
      return item;
    });
    _success(res, 'ok', uArr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//更新当前播放歌曲进度
route.post('/updatemusicinfo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { history, lastplay, currentTime, duration } = req.body;
    currentTime = +currentTime;
    duration = +duration;
    if (
      !validationValue(history, ['y', 'n']) ||
      !_type.isObject(lastplay) ||
      isNaN(duration) ||
      isNaN(currentTime)
    ) {
      paramErr(res, req);
      return;
    }
    let obj = { lastplay, history, currentTime, duration };
    let r = await updateData(
      'lastmusic',
      {
        data: JSON.stringify(obj),
      },
      `WHERE account=?`,
      [account]
    );
    if (r.changes == 0) {
      await insertData('lastmusic', [
        {
          account,
          data: JSON.stringify(obj),
        },
      ]);
    }
    // 增加播放历史记录
    if (history === 'y') {
      let arr = await getMusicList(account);
      arr[0].item.unshift({ id: lastplay.id });
      arr[0].item = unique(arr[0].item, ['id']);
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      syncUpdateData(req, 'music');
    } else {
      syncUpdateData(req, 'musicinfo');
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

//获取最后播放记录
route.get('/getmusicinfo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let lastm = await queryData('lastmusic', 'data', `WHERE account=?`, [
      account,
    ]);
    let obj = {
      currentTime: 0,
      duration: 0,
      lastplay: {},
    };
    if (lastm.length > 0) {
      obj = JSON.parse(lastm[0].data);
    }
    _success(res, 'ok', obj);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//更新当前播放列表
route.post('/updateplaying', async (req, res) => {
  try {
    const arr = req.body.data;
    if (!_type.isArray(arr) || !arr.every((item) => validaString(item, 1, 1))) {
      paramErr(res, req);
      return;
    }
    let account = req._userInfo.account;
    let r = await updateData(
      'playing',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    if (r.changes == 0) {
      await insertData('playing', [
        {
          account,
          data: JSON.stringify(arr),
        },
      ]);
    }
    syncUpdateData(req, 'playinglist');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//获取当前播放列表
route.get('/getplaying', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let arr = await queryData('playing', 'data', `WHERE account=?`, [account]);
    if (arr.length > 0) {
      const musics = await queryData('musics', '*');
      let mObj = getMusicObj(musics);
      arr = JSON.parse(arr[0].data);
      for (let i = 0; i < arr.length; i++) {
        if (mObj.hasOwnProperty(arr[i])) {
          arr[i] = mObj[arr[i]];
        } else {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    _success(res, 'ok', arr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
async function songlistMoveLocation(account, fId, tId) {
  if (fId == tId) return;
  const arr = await getMusicList(account);
  const fIdx = arr.findIndex((item) => item.id === fId),
    tIdx = arr.findIndex((item) => item.id === tId);
  if (fIdx > 1 && tIdx > 1 && fIdx !== tIdx) {
    arr.splice(tIdx, 0, ...arr.splice(fIdx, 1));
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
  }
}
// 歌单列表移动
route.post('/listmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { fromId, toId } = req.body;
    if (!validaString(fromId, 1, 1) || !validaString(toId, 1, 1)) {
      paramErr(res, req);
      return;
    }
    await songlistMoveLocation(account, fromId, toId);
    syncUpdateData(req, 'music');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除歌单列表
route.post('/dellist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.body;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      arr.splice(i, 1)[0];
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      syncUpdateData(req, 'music');
      _success(res, '删除歌单成功');
      return;
    }
    _err(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 歌单编辑
route.post('/editlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, name, des = '', toId = '' } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !validaString(name, 1) ||
      !validaString(des) ||
      !validaString(toId)
    ) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    let i = arr.findIndex((item) => item.id === id);
    if (id == 'all' && account == 'root') {
      _d.songList[2].name = name;
      _d.songList[2].des = des;
      _success(res);
    } else if (i < 2 && i >= 0 && account == 'root') {
      _d.songList[i].name = name;
      _d.songList[i].des = des;
      _success(res);
    } else if (i > 1) {
      arr[i].name = name;
      arr[i].des = des;
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      if (toId) {
        await songlistMoveLocation(account, id, toId);
      }
      syncUpdateData(req, 'music');
      _success(res, '更新歌单信息成功');
    } else {
      _err(res);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 歌单歌曲
route.post('/editsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '请求被拒绝');
      return;
    }
    let { id, title, artist, album, year } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !validaString(title, 1) ||
      !validaString(artist, 1) ||
      !validaString(album, 1) ||
      !validaString(year, 1)
    ) {
      paramErr(res, req);
      return;
    }
    await updateData('musics', { title, artist, album, year }, `WHERE id=?`, [
      id,
    ]);
    syncUpdateData(req, 'music');
    _success(res, '更新歌曲信息成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 添加歌单
route.post('/addlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { name, des = '' } = req.body;
    if (!validaString(name, 1) || !validaString(des)) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    let id = nanoid();
    arr.push({
      name,
      des,
      item: [],
      id,
    });
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    syncUpdateData(req, 'music');
    _success(res, '添加歌单成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 歌曲移动位置
async function songMoveLocation(account, pId, fId, tId) {
  if (fId == tId) return;
  const arr = await getMusicList(account);
  let i = arr.findIndex((item) => item.id === pId);
  if (i > 0) {
    const fIdx = arr[i].item.findIndex((item) => item.id == fId),
      tIdx = arr[i].item.findIndex((item) => item.id == tId);
    if (fIdx < 0 || tIdx < 0 || fIdx == tIdx) return;
    arr[i].item.splice(tIdx, 0, ...arr[i].item.splice(fIdx, 1));
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
  }
}
route.post('/songmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { fid, tid, id } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !validaString(fid, 1, 1) ||
      !validaString(tid, 1, 1)
    ) {
      paramErr(res, req);
      return;
    }
    await songMoveLocation(account, id, fid, tid);
    syncUpdateData(req, 'music');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 收藏歌曲
route.post('/collectsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { ar } = req.body;
    if (
      !_type.isArray(ar) ||
      ar.length == 0 ||
      !ar.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    let add = ar.map((item) => ({ id: item }));
    arr[1].item = [...add, ...arr[1].item];
    arr[1].item = unique(arr[1].item, ['id']);
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    await runSqlite(
      `update musics set collect_count=collect_count+1 WHERE id IN (${createFillString(
        ar.length
      )})`,
      [...ar]
    );
    syncUpdateData(req, 'music');
    _success(res, '收藏歌曲成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/closecollectsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.body;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    arr[1].item = arr[1].item.filter((v) => v.id !== id);
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    syncUpdateData(req, 'music');
    _success(res, '移除收藏歌曲成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 选中删除
route.post('/delsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, ar } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !_type.isArray(ar) ||
      ar.length == 0 ||
      !ar.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    if (id == 'all') {
      if (account !== 'root') {
        _err('请求被拒绝');
        return;
      }
      const del = await queryData(
        'musics',
        'url',
        `WHERE id IN (${createFillString(ar.length)})`,
        [...ar]
      );
      for (let i = 0; i < del.length; i++) {
        const { url } = del[i];
        await _delDir(`${configObj.filepath}/music/${getFileDir(url)}`).catch(
          (err) => {}
        );
      }
      await deleteData(
        'musics',
        `WHERE id IN (${createFillString(ar.length)})`,
        [...ar]
      );
    } else {
      let arr = await getMusicList(account);
      let i = arr.findIndex((item) => item.id === id);
      if (i >= 0) {
        arr[i].item = arr[i].item.filter(
          (item) => !ar.some((y) => y == item.id)
        );
        await updateData(
          'musicinfo',
          { data: JSON.stringify(arr) },
          `WHERE account=?`,
          [account]
        );
      }
    }
    syncUpdateData(req, 'music');
    _success(res, `${id == 'all' ? '删除' : '移除'}歌曲成功`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
    return;
  }
});
// 音乐移动目录
route.post('/songtolist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, tid, ar } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !validaString(tid, 1, 1) ||
      !_type.isArray(ar) ||
      ar.length == 0 ||
      !ar.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let arr = await getMusicList(account);
    ar = ar.map((item) => ({ id: item }));
    let i = arr.findIndex((item) => item.id === id),
      ii = arr.findIndex((item) => item.id === tid);
    if ((id == 'all' && ii > 1 && id !== tid) || (i >= 0 && i < 2 && ii > 1)) {
      arr[ii].item = [...ar, ...arr[ii].item];
      arr[ii].item = unique(arr[ii].item, ['id']);
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      syncUpdateData(req, 'music');
      _success(res, '添加歌曲成功');
      return;
    }
    if ((i > 1 && ii > 1, id !== tid)) {
      arr[i].item = arr[i].item.filter(
        (item) => !ar.some((y) => y.id == item.id)
      );
      arr[ii].item = [...ar, ...arr[ii].item];
      arr[ii].item = unique(arr[ii].item, ['id']);
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      syncUpdateData(req, 'music');
      _success(res, '移动歌曲成功');
      return;
    }
    _err(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//删除mv
route.post('/delmv', async (req, res) => {
  try {
    const account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '请求被拒绝');
      return;
    }
    let { id } = req.body;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const del = await queryData('musics', 'mv', `WHERE id=?`, [id]);
    for (let i = 0; i < del.length; i++) {
      const { mv } = del[i];
      if (mv) {
        await _delDir(`${configObj.filepath}/music/${mv}`).catch((err) => {});
      }
    }
    await updateData('musics', { mv: '' }, `WHERE id=?`, [id]);
    syncUpdateData(req, 'music');
    _success(res, '删除MV成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 编辑歌词
route.get('/getlrc', async (req, res) => {
  try {
    let { id } = req.query;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let m = await queryData('musics', 'lrc', `WHERE id=?`, [id]);
    if (m.length == 0) {
      _err(res, '歌曲不存在');
    }
    let url = `${configObj.filepath}/music/${m[0].lrc}`;
    if (fs.existsSync(url)) {
      let str = (await _readFile(url)).toString();
      _success(res, 'ok', str);
    } else {
      await _mkdir(`${configObj.filepath}/music/${getFileDir(m[0].lrc)}`);
      await _writeFile(url, '');
      _success(res, 'ok', '');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/editlrc', async (req, res) => {
  try {
    const account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '请求被拒绝');
      return;
    }
    let { id, val } = req.body;
    if (!validaString(id, 1, 1) || !validaString(val)) {
      paramErr(res, req);
      return;
    }
    let m = await queryData('musics', 'lrc', `WHERE id=?`, [id]);
    if (m.length == 0) {
      _err(res, '歌曲不存在');
    }
    let url = `${configObj.filepath}/music/${m[0].lrc}`;
    await _mkdir(`${configObj.filepath}/music/${getFileDir(m[0].lrc)}`);
    await _writeFile(url, val);
    _success(res, '更新歌词成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 歌曲分享
route.post('/musicshare', async (req, res) => {
  try {
    let { list, title, valid, pass = '' } = req.body;
    valid = parseInt(valid);
    if (
      !validaString(title, 1) ||
      !validaString(pass) ||
      isNaN(valid) ||
      !_type.isArray(list) ||
      list.length == 0 ||
      !list.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let account = req._userInfo.account;
    let id = nanoid();
    let obj = {
      id,
      valid: valid == 0 ? 0 : Date.now() + valid * 24 * 60 * 60 * 1000,
      title,
      pass,
      data: JSON.stringify(list),
      account,
      type: 'music',
    };
    await insertData('share', [obj]);
    syncUpdateData(req, 'sharelist');
    _success(res, '分享歌曲成功', { id });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 歌曲上传
route.post('/up', async (req, res) => {
  try {
    const { HASH = '', name, type, id = '' } = req.query;
    if (
      !validaString(name, 1) ||
      !validaString(HASH, 0, 1) ||
      !validationValue(type, ['song', 'cover', 'mv']) ||
      !validaString(id, 0, 1)
    ) {
      paramErr(res, req);
      return;
    }
    if (type === 'song') {
      if (!validaString(HASH, 1, 1)) {
        paramErr(res, req);
        return;
      }
      if (!isMusicFile(name)) {
        _err(res, '文件格式错误');
        return;
      }
      const creat_time = Date.now();
      const timePath = getTimePath(creat_time);
      const suffix = getSuffix(name)[1];
      const tDir = `${configObj.filepath}/music/${timePath}/${HASH}`;
      const tName = `${HASH}.${suffix}`;
      await _mkdir(tDir);
      await receiveFiles(req, tDir, tName, 20);
      const songInfo = await getSongInfo(`${tDir}/${tName}`);
      let { album, year, title, duration, artist, pic, lrc, picFormat } =
        songInfo;
      if (pic) {
        await _writeFile(
          `${tDir}/${HASH}.${getPathFilename(picFormat)[0]}`,
          pic
        );
        pic = `${timePath}/${HASH}/${HASH}.${getPathFilename(picFormat)[0]}`;
      }
      await _writeFile(`${tDir}/${HASH}.lrc`, lrc);
      await insertData('musics', [
        {
          id: nanoid(),
          artist,
          title,
          duration,
          mv: '',
          collect_count: 0,
          play_count: 0,
          album,
          year,
          hash: HASH,
          pic,
          url: `${timePath}/${HASH}/${tName}`,
          lrc: `${timePath}/${HASH}/${HASH}.lrc`,
          creat_time,
        },
      ]);
    } else if (type === 'cover') {
      if (!validaString(id, 1, 1)) {
        paramErr(res, req);
        return;
      }
      if (!isImgFile(name)) {
        _err(res, '文件格式错误');
        return;
      }
      const m = await queryData('musics', 'url,pic', `WHERE id=?`, [id]);
      if (m.length == 0) {
        _err(res, '歌曲不存在');
        return;
      }
      const { url, pic } = m[0];
      const tDir = `${configObj.filepath}/music/${getFileDir(url)}`;
      const tName = `${getPathFilename(url)[1]}.${getSuffix(name)[1]}`;
      await _mkdir(tDir);
      await receiveFiles(req, tDir, tName, 5);
      if (getPathFilename(pic)[0] != tName) {
        if (pic) {
          await _delDir(`${tDir}/${getPathFilename(pic)[0]}`).catch(
            (err) => {}
          );
        }
        await updateData(
          'musics',
          { pic: `${getSuffix(url)[0]}.${getSuffix(name)[1]}` },
          `WHERE id=?`,
          [id]
        );
      }
      syncUpdateData(req, 'music');
    } else if (type === 'mv') {
      if (!validaString(id, 1, 1)) {
        paramErr(res, req);
        return;
      }
      if (!isVideoFile(name)) {
        _err(res, '文件格式错误');
        return;
      }
      const m = await queryData('musics', 'url,mv', `WHERE id=?`, [id]);
      if (m.length == 0) {
        _err(res, '歌曲不存在');
        return;
      }
      const { url, mv } = m[0];
      const tDir = `${configObj.filepath}/music/${getFileDir(url)}`;
      const tName = `${getPathFilename(url)[1]}.${getSuffix(name)[1]}`;
      await _mkdir(tDir);
      await receiveFiles(req, tDir, tName, 200);
      if (getPathFilename(mv)[0] != tName) {
        if (mv) {
          await _delDir(`${tDir}/${getPathFilename(mv)[0]}`).catch((err) => {});
        }
        await updateData(
          'musics',
          { mv: `${getSuffix(url)[0]}.${getSuffix(name)[1]}` },
          `WHERE id=?`,
          [id]
        );
      }
    }
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
    const m = await queryData('musics', 'hash', `WHERE hash=?`, [HASH]);
    if (m.length > 0) {
      _success(res);
      return;
    }
    _nothing(res);
  } catch (error) {
    await errLog(req, error);
    _success(res, 'ok', []);
  }
});
route.get('/savesharesongs', async function (req, res) {
  try {
    const account = req._userInfo.account;
    let { id, name } = req.query;
    if (!validaString(id, 1, 1) || !validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    let arr = await queryData('share', 'data', `WHERE id=? AND type=?`, [
      id,
      'music',
    ]);
    if (arr.length < 0) {
      _err(res);
      return;
    }
    arr = JSON.parse(arr[0].data);
    arr = arr.map((item) => ({ id: item }));
    let uArr = await getMusicList(account);
    uArr.push({
      name,
      id: nanoid(),
      item: arr,
      des: '',
    });
    await updateData(
      'musicinfo',
      { data: JSON.stringify(uArr) },
      `WHERE account=?`,
      [account]
    );
    syncUpdateData(req, 'music');
    _success(res, '保存歌单成功');
  } catch (error) {
    await errLog(req, error);
    _success(res, 'ok', []);
  }
});
module.exports = route;
