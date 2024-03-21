const express = require('express'),
  route = express.Router();
const fs = require('fs');
const { resolve } = require('path');
const msg = require('../data/msg');
const _d = require('../data/data');
const configObj = require('../data/config');
const pdErr = require('../utils/pdErr');
let {
    writelog,
    _mkdir,
    encryption,
    _success,
    _nologin,
    _nothing,
    _err,
    nanoid,
    _readFile,
    _readdir,
    validaString,
    validationValue,
    _type,
    paramErr,
    setCookie,
    getWordCount,
    splitWord,
    receiveFiles,
    getTimePath,
    getSuffix,
    createFillString,
    errLog,
    syncUpdateData,
    _setTimeout,
    isImgFile,
    hdChatSendMsg,
  } = require('../utils/utils'),
  {
    insertData,
    updateData,
    deleteData,
    queryData,
    runSqlite,
  } = require('../utils/sqlite');
const timedTask = require('../utils/timedTask');
// 前端错误记录
route.post('/panelerror', async (req, res) => {
  try {
    const { err } = req.body;
    if (!validaString(err, 1)) {
      paramErr(res, req);
      return;
    }
    await writelog(req, `[ ${err} ]`, true);
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//获取字体
route.get('/getfont', async (req, res) => {
  try {
    let arr = [];
    const p = `${configObj.filepath}/font`;
    if (fs.existsSync(p)) {
      arr = await _readdir(p);
    }
    _success(res, 'ok', arr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/isregister', async (req, res) => {
  try {
    _success(res, 'ok', _d.registerstate);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
queryData('user', 'account')
  .then(() => {})
  .catch(async () => {
    try {
      await runSqlite(`CREATE TABLE booklist (
        state   TEXT DEFAULT (0) 
                     NOT NULL,
        id      TEXT NOT NULL
                     UNIQUE
                     PRIMARY KEY,
        account TEXT NOT NULL,
        num     INT  NOT NULL,
        name    TEXT NOT NULL,
        share   TEXT NOT NULL
                     DEFAULT n
    );
    
`);
      await runSqlite(`CREATE TABLE bookmk (
        state   TEXT DEFAULT (0) 
                     NOT NULL,
        num     INT  NOT NULL,
        id      TEXT NOT NULL
                     UNIQUE
                     PRIMARY KEY,
        listid  TEXT NOT NULL,
        account TEXT NOT NULL,
        name    TEXT NOT NULL,
        link    TEXT NOT NULL,
        logo    TEXT NOT NULL
                     DEFAULT (''),
        des     TEXT NOT NULL
                     DEFAULT ('') 
    );`);
      await runSqlite(`CREATE TABLE chat (
        id    TEXT NOT NULL
                   UNIQUE
                   PRIMARY KEY,
        _from TEXT NOT NULL,
        _to   TEXT NOT NULL,
        flag  TEXT NOT NULL,
        time  TEXT NOT NULL,
        date  TEXT NOT NULL,
        data  TEXT NOT NULL,
        isrc  TEXT NOT NULL
                   DEFAULT (''),
        size  TEXT NOT NULL
                   DEFAULT (''),
        hash  TEXT NOT NULL
                   DEFAULT (''),
        type  TEXT NOT NULL
                   DEFAULT text
    );        
`);
      await runSqlite(`CREATE TABLE friends (
        account TEXT NOT NULL,
        friend  TEXT NOT NULL,
        islook  TEXT DEFAULT y
                     NOT NULL,
        time    TEXT NOT NULL,
        des     TEXT NOT NULL
                     DEFAULT ('') 
    );    
`);
      await runSqlite(`CREATE TABLE history (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    id      TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    account TEXT NOT NULL,
    data    TEXT NOT NULL
);
`);
      await runSqlite(`CREATE TABLE lastmusic (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
      await runSqlite(`CREATE TABLE musicinfo (
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
      await runSqlite(`CREATE TABLE upload (
        id   TEXT UNIQUE
                  NOT NULL
                  PRIMARY KEY,
        url  TEXT NOT NULL,
        time TEXT NOT NULL
                  DEFAULT (0) 
    );
    `);
      await runSqlite(`CREATE TABLE bg (
        id    TEXT PRIMARY KEY
                   UNIQUE
                   NOT NULL,
        hash  TEXT UNIQUE
                   NOT NULL,
        url   TEXT NOT NULL
                   DEFAULT (''),
        time  TEXT NOT NULL
                   DEFAULT (0),
        type  TEXT NOT NULL,
        title TEXT NOT NULL
                   DEFAULT ('') 
    );`);
      await runSqlite(`CREATE TABLE pic (
      id    TEXT PRIMARY KEY
                 UNIQUE
                 NOT NULL,
      url   TEXT NOT NULL
                 DEFAULT (''),
      hash  TEXT NOT NULL
                 UNIQUE,
      time  TEXT NOT NULL
                 DEFAULT (0),
      title TEXT NOT NULL
                 DEFAULT ('') 
  );
  `);
      await runSqlite(`CREATE TABLE musics (
        id            TEXT UNIQUE
                           NOT NULL
                           PRIMARY KEY,
        title         TEXT NOT NULL,
        artist        TEXT NOT NULL,
        duration      TEXT NOT NULL
                           DEFAULT (0),
        mv            TEXT DEFAULT ('') 
                           NOT NULL,
        collect_count TEXT DEFAULT (0) 
                           NOT NULL,
        play_count    TEXT DEFAULT (0) 
                           NOT NULL,
        album         TEXT NOT NULL
                           DEFAULT (''),
        year          TEXT NOT NULL
                           DEFAULT (''),
        creat_time    TEXT NOT NULL
                           DEFAULT (''),
        hash          TEXT NOT NULL
                           DEFAULT (''),
        url           TEXT NOT NULL
                           DEFAULT (''),
        pic           TEXT NOT NULL
                           DEFAULT (''),
        lrc           TEXT DEFAULT ('') 
                           NOT NULL
    );`);
      await runSqlite(`CREATE TABLE note (
    state       TEXT DEFAULT (0) 
                     NOT NULL,
    id          TEXT NOT NULL
                     UNIQUE
                     PRIMARY KEY,
    account     TEXT NOT NULL,
    name        TEXT NOT NULL,
    share       TEXT DEFAULT n
                     NOT NULL,
    data        TEXT NOT NULL,
    time        TEXT NOT NULL,
    visit_count TEXT NOT NULL
                     DEFAULT (0),
    utime       TEXT NOT NULL
                     DEFAULT ('') 
);
`);
      await runSqlite(`CREATE TABLE playing (
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
      await runSqlite(`CREATE TABLE share (
        type    TEXT DEFAULT (0) 
                     NOT NULL,
        id      TEXT NOT NULL
                     UNIQUE
                     PRIMARY KEY,
        account TEXT NOT NULL,
        data    TEXT NOT NULL,
        title   TEXT NOT NULL,
        valid   TEXT NOT NULL
                     DEFAULT (0),
        pass    TEXT NOT NULL
                     DEFAULT ('') 
    );
    `);
      await runSqlite(`CREATE TABLE todo (
    id      TEXT PRIMARY KEY
                 UNIQUE
                 NOT NULL,
    account TEXT NOT NULL,
    data    TEXT NOT NULL,
    time    TEXT NOT NULL,
    state   TEXT NOT NULL
                 DEFAULT (0) 
);
`);
      await runSqlite(`CREATE TABLE user (
        state     TEXT DEFAULT (0) 
                       NOT NULL,
        account   TEXT NOT NULL
                       UNIQUE
                       PRIMARY KEY,
        username  TEXT NOT NULL,
        password  TEXT NOT NULL,
        time      TEXT NOT NULL,
        bg        TEXT NOT NULL,
        bgxs      TEXT NOT NULL,
        dailybg   TEXT DEFAULT n
                       NOT NULL,
        flag      TEXT DEFAULT (0) 
                       NOT NULL,
        login_key TEXT NOT NULL
                       DEFAULT (''),
        logo      TEXT NOT NULL
                       DEFAULT ('') 
    );
`);
      await runSqlite(`CREATE VIEW getchat AS
      SELECT u.username name,
             u.logo,
             c._from,
             c.id,
             c._to,
             c.flag,
             c.time,
             c.date,
             c.data,
             c.isrc,
             c.hash,
             c.type,
             c.size
        FROM chat AS c
             LEFT JOIN
             user AS u ON u.account = c._from;`);
      await runSqlite(`CREATE VIEW getnote AS
      SELECT u.username,
             u.logo,
             n.visit_count,
             n.state,
             n.id,
             n.account,
             n.name,
             n.time,
             n.data,
             n.share,
             n.utime
        FROM note AS n
             LEFT JOIN
             user AS u ON u.account = n.account;
`);
      await runSqlite(`CREATE VIEW getshare AS
      SELECT u.username,
             u.logo,
             s.id,
             s.title,
             s.valid,
             s.pass,
             s.account,
             s.type,
             s.data
        FROM share AS s
             LEFT JOIN
             user AS u ON u.account = s.account;`);
      await runSqlite(`CREATE TRIGGER deluser
         AFTER DELETE
            ON user
BEGIN
    DELETE FROM friends
          WHERE account = old.account OR 
                friend = old.account;
    DELETE FROM share
          WHERE account = old.account;
    DELETE FROM playing
          WHERE account = old.account;
    DELETE FROM musicinfo
          WHERE account = old.account;
    DELETE FROM lastmusic
          WHERE account = old.account;
    DELETE FROM bookmk
          WHERE account = old.account;
    DELETE FROM booklist
          WHERE account = old.account;
    DELETE FROM history
          WHERE account = old.account;
    DELETE FROM note
          WHERE account = old.account;
    DELETE FROM todo
          WHERE account = old.account;
    DELETE FROM chat
          WHERE (_from = old.account OR 
                 _to = old.account) AND 
                flag != 'chang';
END;
`);
      await insertData('user', [
        {
          username: 'admin',
          account: 'root',
          time: Date.now(),
          bg: '',
          bgxs: '',
          dailybg: 'n',
          flag: '0',
          password: '',
          state: '0',
          logo: '',
          login_key: '',
        },
      ]);

      await insertData('note', [
        {
          id: 'about',
          name: 'About',
          data: (
            await _readFile(resolve(__dirname, '../data/default_about.md'))
          ).toString(),
          time: Date.now(),
          share: 'y',
          account: 'root',
          state: '0',
          utime: '',
          visit_count: '0',
        },
      ]);
    } catch (error) {
      await writelog(false, `[ ${error} ]`, true);
    }
  });
let registerNum = 0;
timedTask.add((flag) => {
  if (flag.slice(-6) === '000000') {
    registerNum = 0;
  }
});
// 注册
route.post('/register', async (req, res) => {
  try {
    if (_d.registerstate === 'n' || registerNum > 20) {
      _err(res);
      return;
    }
    let { username, password } = req.body;
    if (!validaString(username, 1) || !validaString(password, 1)) {
      paramErr(res, req);
      return;
    }
    if (username.length < 1 || username.length > 20) {
      _err(res, '请输入1-20位');
      return;
    }
    // 写入用户数据
    let account = nanoid();
    let now = Date.now();
    await insertData('user', [
      {
        username,
        account,
        time: now,
        password: encryption(password),
        bg: '',
        bgxs: '',
        dailybg: 'n',
        flag: '0',
        state: '0',
        logo: '',
        login_key: '',
      },
    ]);
    // 生成token
    setCookie(res, { account, username });
    registerNum++;
    _success(res, '注册账号成功', account);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//登录
route.post('/qclogin', async (req, res) => {
  try {
    const { code } = req.body;
    if (!validaString(code, 1)) {
      paramErr(res, req);
      return;
    }
    const [account, key] = code.split('-'),
      userInfo = await queryData('user', '*', `WHERE account=? AND state=?`, [
        account,
        '0',
      ]);
    if (userInfo.length == 0) {
      _err(res, '登录码已过期');
      return;
    }
    const [k, t] = userInfo[0].login_key.split('-'),
      now = Date.now();
    if (now - t > 1000 * 60 * 5 || key !== k) {
      _err(res, '登录码已过期');
      return;
    }
    setCookie(res, {
      account: userInfo[0].account,
      username: userInfo[0].username,
    });
    await updateData('user', { login_key: '' }, `WHERE account=? AND state=?`, [
      account,
      '0',
    ]);
    _success(res, '登录成功', {
      account: userInfo[0].account,
      username: userInfo[0].username,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/login', async (req, res) => {
  try {
    let account = req.body.account,
      password = req.body.password,
      _ip = req._ip;
    if (!validaString(account, 1) || !validaString(password, 1, 1)) {
      paramErr(res, req);
      return;
    }
    // 过滤登录密码三次错误的登录IP地址
    if (pdErr.allow(_ip)) {
      //验证用户名和账号是否存在
      let ruser = await queryData(
        'user',
        '*',
        `WHERE (account = ? OR username =?) AND state = ?`,
        [account, account, '0']
      );
      if (ruser.length === 0) {
        _err(res, '账号不存在');
        return;
      }
      //验证密码
      let _userinfo = ruser.find(
        (item) => item.password === encryption(password) || !item.password
      );

      if (_userinfo) {
        setCookie(res, {
          account: _userinfo.account,
          username: _userinfo.username,
        });
        _success(res, '登录成功', _userinfo.account);
      } else {
        pdErr.add(_ip);
        _err(res, '登录密码错误，请重新输入');
      }
    } else {
      _err(res, '登录密码多次错误，请10分钟后再试');
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
route.get('/updatetoken', async (req, res) => {
  try {
    const { account, username } = req._userInfo;
    setCookie(res, {
      account,
      username,
    });
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/qclogin', async (req, res) => {
  try {
    const account = req._userInfo.account,
      t = Date.now(),
      k = Math.random().toFixed(6).slice(2);
    await updateData(
      'user',
      { login_key: `${k}-${t}` },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    _success(res, 'ok', `${account}-${k}`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 修改密码
route.post('/changepass', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { oldpassword, newpassword } = req.body;
    if (!validaString(oldpassword, 1, 1) || !validaString(newpassword, 1, 1)) {
      paramErr(res, req);
      return;
    }
    //对比原密码
    if (
      encryption(oldpassword) === req._userInfo.password ||
      !req._userInfo.password
    ) {
      await updateData(
        'user',
        {
          password: encryption(newpassword),
        },
        `WHERE account=? AND state=?`,
        [account, '0']
      );
      _success(res, '修改密码成功');
    } else {
      _err(res, '原密码错误，请重新输入');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 退出登录
route.get('/signout', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { all } = req.query;
    if (!validationValue(all, ['y', 'n'])) {
      paramErr(res, req);
      return;
    }
    if (all === 'y') {
      //退出所有登录设备
      await updateData(
        'user',
        {
          flag: parseInt(Date.now() / 1000),
        },
        `WHERE account=? AND state=?`,
        [account, '0']
      );
    }
    res.clearCookie('token');
    _success(res, '退出登录成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 修改用户名
route.post('/changeusername', async (req, res) => {
  try {
    let account = req._userInfo.account,
      usname = req.body.username;
    if (!validaString(usname, 1)) {
      paramErr(res, req);
      return;
    }
    if (usname.length > 20) {
      _err(res, '请输入1-20位');
      return;
    }
    await updateData(
      'user',
      {
        username: usname,
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    syncUpdateData(req, 'userinfo');
    _success(res, '修改昵称成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
    return;
  }
});
// 注销账号
route.post('/delaccount', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account === 'root') {
      _err(res, '请求被拒绝');
    } else {
      await updateData(
        'user',
        {
          state: '1',
        },
        `WHERE account=?`,
        [account]
      );
      res.clearCookie('token');
      _success(res, '注销账号成功');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//获取配置数据
route.get('/getuserinfo', async (req, res) => {
  try {
    delete req._userInfo.flag;
    delete req._userInfo.state;
    delete req._userInfo.password;
    delete req._userInfo.time;
    const { bg, bgxs } = req._userInfo;
    const bgs = await queryData('bg', '*', `WHERE id IN (?,?)`, [bg, bgxs]);
    const bgObj = {};
    bgs.forEach((item) => {
      const { id } = item;
      bgObj[id] = item;
    });
    req._userInfo.bgObj = bgObj;
    _success(res, 'ok', req._userInfo);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 上传头像
route.post('/updatalogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    const { url } = req.body;
    if (!validaString(url, 1)) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'user',
      {
        logo: url,
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    syncUpdateData(req, 'userinfo');
    _success(res, '更新头像成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/dellogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    await updateData(
      'user',
      {
        logo: '',
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    syncUpdateData(req, 'userinfo');
    _success(res, '删除头像成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/uplogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { name, HASH } = req.query;
    if (!isImgFile(name) || !validaString(HASH, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const timePath = getTimePath();
    let path = `${configObj.filepath}/logo/${account}/${timePath}`;
    await _mkdir(path);
    await receiveFiles(req, path, `${HASH}.${getSuffix(name)[1]}`, 5);
    _success(res, 'ok', {
      logo: `${timePath}/${HASH}.${getSuffix(name)[1]}`,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//每日更新壁纸
route.get('/dailybg', async (req, res) => {
  try {
    let account = req._userInfo.account,
      ff;
    if (!req._userInfo.dailybg || req._userInfo.dailybg === 'n') {
      ff = 'y';
      _success(res, '成功开启');
    } else {
      ff = 'n';
      _success(res, '成功关闭');
    }
    await updateData(
      'user',
      {
        dailybg: ff,
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    syncUpdateData(req, 'userinfo');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/updatetime', async (req, res) => {
  try {
    await updateData(
      'user',
      {
        time: Date.now(),
      },
      `WHERE account=? AND state=?`,
      [req._userInfo.account, '0']
    );
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 数据同步
route.get('/realtime', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let id = req._temid;
    let { flag } = req.query; //标识和设备ID
    if (!validaString(id, 1, 1) || !validaString(flag, 1, 1)) {
      paramErr(res, req);
      return;
    }
    const con = msg.get(account, cb);
    flag == 0 ? (flag = con.flag) : null; //初始化指令标识
    function cb() {
      if (!con.id || con.id == id || con.flag == flag) return;
      stop(1);
    }
    let timer = setTimeout(stop, 20000);
    cb();
    function stop(state) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      con.cbs = con.cbs.filter((item) => item !== cb);
      if (state) {
        _success(res, 'ok', con);
      } else {
        _nothing(res, { flag: con.flag });
      }
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//接收指令
route.post('/realtime', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let id = req._temid;
    let { data } = req.body; //指令内容和登录设备ID
    if (
      !validaString(id, 1, 1) ||
      !_type.isObject(data) ||
      !validationValue(data.type, [
        'updatedata',
        'chat',
        'playmode',
        'play',
        'vol',
        'progress',
      ])
    ) {
      paramErr(res, req);
      return;
    }
    // 多端同步数据
    if (data.type === 'updatedata') {
      if (
        !validationValue(data.flag, [
          'bookmark',
          'userinfo',
          'playinglist',
          'musicinfo',
          'todolist',
          'music',
          'bg',
          'sharelist',
          'note',
          'trash',
          'history',
        ])
      ) {
        paramErr(res, req);
        return;
      }
      data.to = account;
      syncUpdateData(req, data.flag, data.id);
      _success(res);
      return;
    }
    // 播放
    if (data.type == 'play') {
      if (!validationValue(data.state, ['y', 'n'])) {
        paramErr(res, req);
        return;
      }
      if (data.state == 'y') {
        if (!_type.isObject(data.obj)) {
          paramErr(res, req);
          return;
        }
      }
      data.to = account;
      msg.set(data.to, id, data);
      _success(res);
      return;
    }
    // 播放状态
    if (data.type == 'playmode') {
      if (!validationValue(data.state, [true, false, 1])) {
        paramErr(res, req);
        return;
      }
      data.to = account;
      msg.set(data.to, id, data);
      _success(res);
      return;
    }
    // 音量
    if (data.type == 'vol') {
      data.value = +data.value;
      if (isNaN(data.value) || data.value > 1 || data.value < 0) {
        paramErr(res, req);
        return;
      }
      data.to = account;
      msg.set(data.to, id, data);
      _success(res);
      return;
    }
    // 进度
    if (data.type == 'progress') {
      data.value = +data.value;
      if (isNaN(data.value) || data.value > 1 || data.value < 0) {
        paramErr(res, req);
        return;
      }
      data.to = account;
      msg.set(data.to, id, data);
      _success(res);
      return;
    }
    // 聊天室
    if (data.type == 'chat') {
      if (
        !validaString(data.to, 1, 1) ||
        !validationValue(data.flag, ['addmsg', 'del', 'clear'])
      ) {
        paramErr(res, req);
        return;
      }
      // 撤回、清空操作
      if (data.flag == 'del' || data.flag == 'clear') {
        if (data.flag == 'del') {
          if (!validaString(data.tt, 1, 1)) {
            paramErr(res, req);
            return;
          }
        }
        await hdChatSendMsg(req, data.to, data.flag, data.tt);
        _success(res);
        return;
      }
      // 发送新消息
      if (data.flag == 'addmsg') {
        await hdChatSendMsg(req, data.to, data.flag, data.msgData);
        _success(res);
      }
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 分享列表
route.post('/deleteshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id = '' } = req.body;
    if (!validaString(id, 0, 1)) {
      paramErr(res, req);
      return;
    }
    if (id) {
      await deleteData('share', `WHERE id=? AND account=?`, [id, account]);
      _success(res, '删除分享成功');
    } else {
      await deleteData('share', `WHERE account=?`, [account]);
      _success(res, '清空分享列表成功');
    }
    syncUpdateData(req, 'sharelist');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/sharelist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let arr = await queryData(
      'share',
      'id, type, title, pass, valid',
      `WHERE account=?`,
      [account]
    );
    _success(res, 'ok', arr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//编辑分享
route.post('/editshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, title, valid, pass = '' } = req.body;
    valid = parseInt(valid);
    if (
      !validaString(id, 1, 1) ||
      !validaString(title, 1) ||
      !validaString(pass) ||
      isNaN(valid)
    ) {
      paramErr(res, req);
      return;
    }
    let obj = {
      valid: valid == 0 ? 0 : Date.now() + valid * 24 * 60 * 60 * 1000,
      title,
      pass,
    };
    await updateData('share', obj, `WHERE id=? AND account=?`, [id, account]);
    syncUpdateData(req, 'sharelist');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 回收站
route.get('/gettrash', async (req, res) => {
  try {
    let { a = '', type, page = 1, showpage = 20 } = req.query,
      account = req._userInfo.account,
      str = 'id,name';
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      !validationValue(type, ['note', 'bookmk', 'booklist', 'history']) ||
      !validaString(a) ||
      isNaN(page) ||
      isNaN(showpage) ||
      page < 1 ||
      showpage < 1 ||
      showpage > 200
    ) {
      paramErr(res, req);
      return;
    }
    if (type === 'bookmk') {
      str = 'id,name,link,des';
    } else if (type === 'history') {
      str = 'id,data';
    }
    let arr = await queryData(type, str, `WHERE account=? AND state=?`, [
      account,
      '1',
    ]);
    arr.reverse();
    if (a) {
      a = splitWord(a);
      arr = arr.map((item) => {
        let content = '';
        if (type === 'bookmk') {
          const { name, link, des } = item;
          content = '' + name + link + des;
        } else if (type === 'history') {
          content = item.data;
        } else {
          content = item.name;
        }
        item.sNum = getWordCount(a, content);
        return item;
      });
      arr.sort((a, b) => b.sNum - a.sNum);
      arr = arr.filter((item) => item.sNum > 0);
    }
    let pagenum = Math.ceil(arr.length / showpage) || 1;
    page > pagenum ? (page = pagenum) : null;
    let sdata = arr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: arr.length,
      totalPage: pagenum,
      pageNo: page,
      data: sdata,
      splitWord: a,
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除回收站内容
route.post('/deletetrash', async (req, res) => {
  try {
    let { arr, type } = req.body;
    if (
      !validationValue(type, ['booklist', 'bookmk', 'note', 'history']) ||
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let account = req._userInfo.account;
    await deleteData(
      type,
      `WHERE id IN (${createFillString(arr.length)}) AND account=? AND state=?`,
      [...arr, account, '1']
    );
    if (type === 'booklist') {
      await deleteData(
        'bookmk',
        `WHERE listid IN (${createFillString(arr.length)}) AND account=?`,
        [...arr, account]
      );
    }
    syncUpdateData(req, 'trash');
    _success(res, '删除成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 恢复回收站内容
route.post('/recovertrash', async (req, res) => {
  try {
    let { arr, type } = req.body;
    if (
      !validationValue(type, ['booklist', 'bookmk', 'note', 'history']) ||
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let account = req._userInfo.account;
    await updateData(
      type,
      { state: '0' },
      `WHERE id IN (${createFillString(arr.length)}) AND account=? AND state=?`,
      [...arr, account, '1']
    );
    syncUpdateData(req, 'trash');
    if (type === 'booklist' || type === 'bookmk') {
      type = 'bookmark';
    }
    _setTimeout(() => {
      syncUpdateData(req, type);
    }, 100);
    _success(res, '恢复成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
module.exports = route;
