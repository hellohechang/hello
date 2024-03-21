const express = require('express'),
  fs = require('fs'),
  route = express.Router();

const configObj = require('../data/config');
const {
  insertData,
  updateData,
  queryData,
  deleteData,
} = require('../utils/sqlite');
const {
  formatDate,
  _readdir,
  _mkdir,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  nanoid,
  validaString,
  validationValue,
  paramErr,
  getWordCount,
  splitWord,
  getTimePath,
  getSuffix,
  errLog,
  hdChatSendMsg,
} = require('../utils/utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
route.post('/setdes', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { acc, des = '' } = req.body;
    if (!validaString(acc, 1, 1) || !validaString(des)) {
      paramErr(res, req);
      return;
    }
    if (account === acc || acc === 'chang') {
      _err(res);
      return;
    }
    if (des.length > 20) {
      _err(res, '请输入0-20位');
      return;
    }
    const tt = Date.now();
    let r = await updateData(
      'friends',
      { des, time: tt },
      `WHERE friend=? AND account=?`,
      [acc, account]
    );
    if (r.changes == 0) {
      let user = await queryData(
        'user',
        'account',
        `WHERE state = ? AND account = ?`,
        ['0', acc]
      );
      if (user.length > 0) {
        await insertData('friends', [
          {
            account,
            friend: acc,
            time: tt,
            islooK: 'y',
            des,
          },
          {
            account: acc,
            friend: account,
            time: tt,
            islooK: 'y',
            des: '',
          },
        ]);
      } else {
        _err(res);
        return;
      }
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/getdes', async (req, res) => {
  try {
    const { acc } = req.query,
      account = req._userInfo.account;
    if (!validaString(acc, 1, 1)) {
      paramErr(res, req);
      return;
    }
    if (acc == account || acc == 'chang') {
      _err(res);
      return;
    }
    const uarr = await queryData(
      'user',
      'username',
      `WHERE state = ? AND account = ?`,
      ['0', acc]
    );
    if (uarr.length == 0) {
      _err(res, '用户不存在');
      return;
    }
    let obj = uarr[0];
    obj.des = '';
    if (account) {
      const fArr = await queryData('friends', '*', `WHERE account=?`, [
        account,
      ]);
      const f = fArr.find((item) => item.friend == acc);
      if (f) {
        obj.des = f.des;
      }
    }
    _success(res, 'ok', obj);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//聊天处理
route.get('/getmsg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { acc, stu, flag = '', val = '' } = req.query;
    stu = parseInt(stu);
    if (
      !validaString(acc, 1, 1) ||
      !validaString(flag, 0, 1) ||
      !validaString(val) ||
      isNaN(stu) ||
      !validationValue(stu, [0, 1, 2])
    ) {
      paramErr(res, req);
      return;
    }
    let carr = [];
    let sarr = [];
    let tt = Date.now();
    // 标记已读
    if (account !== acc) {
      let r = await updateData(
        'friends',
        { islooK: 'y', time: tt },
        `WHERE friend=? AND account=?`,
        [acc, account]
      );
      if (r.changes == 0) {
        if (acc === 'chang') {
          await insertData('friends', [
            {
              account,
              friend: 'chang',
              time: tt,
              islooK: 'y',
              des: '',
            },
          ]);
        } else {
          let user = await queryData(
            'user',
            'account',
            `WHERE state = ? AND account = ?`,
            ['0', acc]
          );
          if (user.length > 0) {
            await insertData('friends', [
              {
                account,
                friend: acc,
                time: tt,
                islooK: 'y',
                des: '',
              },
              {
                account: acc,
                friend: account,
                time: tt,
                islooK: 'y',
                des: '',
              },
            ]);
          }
        }
      }
    }
    //读取消息
    if (acc === 'chang') {
      carr = await queryData('getchat', '*', `WHERE flag=?`, ['chang']);
    } else {
      carr = await queryData('getchat', '*', `WHERE flag in(?,?)`, [
        `${account}-${acc}`,
        `${acc}-${account}`,
      ]);
    }
    if (val) {
      val = splitWord(val);
      carr = carr.filter((item) => {
        let { name, data, date } = item;
        let str = name + data + date;
        return getWordCount(val, str) > 0;
      });
    }
    let flagStr = '';
    carr = carr.map((item) => {
      let d =
        item.date ||
        formatDate({ template: '{0}-{1}-{2}', timestamp: item.time });
      if (d === flagStr) {
        item.showTime = 'n';
      } else {
        item.showTime = 'y';
      }
      flagStr = d;
      return item;
    });
    // 获取消息
    if (carr.length > 0) {
      if (+stu === 0) {
        //打开聊天框
        sarr = carr.slice(-100);
      } else if (+stu === 1) {
        //向上滚动
        let ci = carr.findIndex((v) => v.id === flag);
        if (ci < 0) {
          sarr = [];
        } else {
          let st = ci - 100 <= 0 ? 0 : ci - 100;
          sarr = carr.slice(st, ci);
        }
      } else if (+stu === 2) {
        //新消息
        let ci = carr.findIndex((v) => v.id === flag);
        if (carr.length - 1 == ci) {
          sarr = [];
        } else {
          sarr = carr.slice(ci + 1);
        }
      }
      const friends = await queryData('friends', '*', `WHERE account=?`, [
        account,
      ]);
      sarr = sarr.map((item) => {
        item.des = '';
        const f = friends.find((y) => y.friend == item._from);
        if (f) {
          item.des = f.des;
        }
        return item;
      });
      _success(res, 'ok', sarr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 文件是否过期
route.get('/isexpired', async (req, res) => {
  try {
    let name = req.query.name;
    if (!validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    if (fs.existsSync(`${configObj.filepath}/upload/${name}`)) {
      _success(res);
      return;
    }
    _nothing(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
async function saveMsg(account, obj) {
  obj._from = account;
  obj.flag = obj._to === 'chang' ? 'chang' : `${account}-${obj._to}`;
  obj.id = nanoid();
  obj.time = Date.now();
  obj.date = formatDate({ template: '{0}-{1}-{2}', timestamp: obj.time });
  await insertData('chat', [obj]);
}
// 接收信息数据
route.post('/takemsg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { _to, data, isrc = '', size = '', hash = '', type } = req.body;
    if (
      !validaString(_to, 1, 1) ||
      !validaString(data, 1) ||
      !validaString(isrc) ||
      !validaString(hash, 0, 1) ||
      !validationValue(type, ['text', 'image', 'file', 'voice']) ||
      !validaString(size)
    ) {
      paramErr(res, req);
      return;
    }
    if (_to !== 'chang') {
      let user = await queryData(
        'user',
        'account',
        `WHERE state = ? AND account = ?`,
        ['0', _to]
      );
      if (user.length === 0) {
        _err(res, '用户不存在');
        return;
      }
    }
    let obj = {
      _to,
      data,
      isrc,
      size,
      hash,
      type,
    };
    await saveMsg(account, obj);
    await hdChatSendMsg(req, obj._to, 'addmsg', obj);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 查看是否有未读消息
route.get('/getnews', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let a = req.query.a;
    a = parseInt(a);
    if (isNaN(a) || !validationValue(a, [1, 2, 3])) {
      paramErr(res, req);
      return;
    }
    let arr = await queryData('friends', '*', `WHERE account=?`, [account]),
      i;
    if (a == 1) {
      //未读群聊消息
      i = arr.some((item) => item.friend === 'chang' && item.islook === 'n');
    } else if (a == 2) {
      //未读私聊消息
      i = arr.some((item) => item.friend !== 'chang' && item.islook === 'n');
    } else if (a == 3) {
      //有未读消息
      i = arr.some((item) => item.islook === 'n');
    }
    if (i) {
      //未读
      _nothing(res);
    } else {
      //已读
      _success(res);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//删除消息
route.post('/delmsg', async (req, res) => {
  try {
    let { tt, to } = req.body;
    if (!validaString(tt, 1, 1) || !validaString(to, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    await deleteData('chat', `WHERE id=? AND _from=?`, [tt, account]);
    await hdChatSendMsg(req, to, 'del', tt);
    _success(res, '撤回消息成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//清空消息
route.post('/clearmsg', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { ac } = req.body;
    if (!validaString(ac, 1, 1)) {
      paramErr(res, req);
      return;
    }
    if (ac === 'chang') {
      if (account === 'root') {
        await deleteData('chat', `WHERE _to=?`, ['chang']);
        await hdChatSendMsg(req, ac, 'clear');
        _success(res);
      } else {
        _err(res);
      }
    } else {
      await deleteData('chat', `WHERE flag in(?,?)`, [
        `${account}-${ac}`,
        `${ac}-${account}`,
      ]);
      await hdChatSendMsg(req, ac, 'clear');
      _success(res, '清空消息成功');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 查看群成员
route.get('/getmember', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let udata = [],
      farr = await queryData('friends', '*', `WHERE account=?`, [account]); //用户所在的所有聊天室
    let user = await queryData('user', '*', `WHERE state = ?`, ['0']);
    user.forEach((w) => {
      //遍历所有用户
      let { username, account: acc, time, logo } = w;
      let obj = {
        username,
        account: acc,
        logo,
        online: Date.now() - time > 1000 * 20 ? 'n' : 'y',
        des: '',
        time: 0,
      };
      if (account === acc) {
        obj.time = Date.now();
      }
      const f = farr.find((item) => item.friend == acc);
      if (f) {
        obj.islook = f.islook;
        obj.time = f.time;
        obj.des = f.des;
      }
      udata.push(obj);
    });
    _success(res, 'ok', udata);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 接收文件
route.post('/up', async (req, res) => {
  try {
    let { name, HASH } = req.query;
    if (!validaString(name, 1, 1) || !validaString(HASH, 1, 1)) {
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
//接收语音
route.post('/upp', async (req, res) => {
  try {
    let { HASH, name, _to, size = '' } = req.query;
    if (
      !/\.wav$/.test(name) ||
      !validaString(HASH, 1, 1) ||
      !validaString(_to, 1, 1) ||
      !validaString(size)
    ) {
      paramErr(res, req);
      return;
    }
    const time = Date.now();
    const timePath = getTimePath(time);
    const tDir = `${configObj.filepath}/upload/${timePath}`;
    const tName = `${HASH}.${getSuffix(name)[1]}`;
    await _mkdir(tDir);
    await receiveFiles(req, tDir, tName, 3);
    const fobj = {
      id: HASH,
      url: `${timePath}/${tName}`,
      time,
    };
    await insertData('upload', [fobj]);
    let obj = {
      _to,
      data: '语音',
      isrc: fobj.url,
      size,
      hash: HASH,
      type: 'voice',
    };
    await saveMsg(req._userInfo.account, obj);
    await hdChatSendMsg(req, obj._to, 'addmsg', obj);
    _success(res, 'ok', fobj);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//合并文件
route.post('/mergefile', async (req, res) => {
  try {
    let { HASH, count, name, _to, size = '', type } = req.body;
    count = parseInt(count);
    if (
      !validaString(name, 1) ||
      !validaString(HASH, 1, 1) ||
      !validaString(_to, 1, 1) ||
      !validationValue(type, ['image', 'file']) ||
      !validaString(size) ||
      isNaN(count) ||
      count < 1
    ) {
      paramErr(res, req);
      return;
    }
    const suffix = getSuffix(name)[1];
    const time = Date.now();
    const timePath = getTimePath(time);
    const tDir = `${configObj.filepath}/upload/${timePath}`;
    const tName = `${HASH}${suffix ? `.${suffix}` : ''}`;
    await _mkdir(tDir);
    await mergefile(
      count,
      `${configObj.filepath}/tem/${HASH}`,
      `${tDir}/${tName}`
    );
    const fobj = {
      id: HASH,
      url: `${timePath}/${tName}`,
      time,
    };
    await insertData('upload', [fobj]);
    let obj = {
      _to,
      data: name,
      isrc: fobj.url,
      size,
      hash: HASH,
      type,
    };
    await saveMsg(req._userInfo.account, obj);
    await hdChatSendMsg(req, obj._to, 'addmsg', obj);
    _success(res, 'ok', fobj);
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
    let { HASH } = req.body;
    if (!validaString(HASH, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const uploads = await queryData('upload', '*', `WHERE id=?`, [HASH]);
    if (uploads.length > 0) {
      _success(res, 'ok', uploads[0]);
      return;
    }
    _nothing(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
