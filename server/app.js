const os = require('os');

//Cookie
const cookieParser = require('cookie-parser');

const express = require('express');

const app = express();

// 获取访问设备信息
const UAParser = require('ua-parser-js');

// 操作SQLite数据库
let { queryData } = require('./utils/sqlite');
let {
  writelog,
  getClientIp,
  jwtde,
  getIn,
  _err,
  setCookie,
} = require('./utils/utils');
const { resolve } = require('path');
const configObj = require('./data/config.js');
//Cookie
app.use(cookieParser());
app.use(express.json({ limit: '20000kb' }));
app.use(express.urlencoded({ extended: true, limit: '20000kb' }));
app.use(express.static(resolve(__dirname, 'static')));
app.use(async (req, res, next) => {
  try {
    req._rp = req.path;
    req._temid = req.headers['temid'];
    req._jwt = jwtde(req.cookies.token); //解密token
    req._ip = getClientIp(req);
    const _clientConfig = new UAParser(req.headers['user-agent']).getResult(); //获取访问设备信息
    const osName = getIn(_clientConfig, ['os', 'name']) || 'other';
    const osVendor = getIn(_clientConfig, ['device', 'vendor']) || '';
    const osModel = getIn(_clientConfig, ['device', 'model']) || '';
    req._os = osName + (osVendor ? `(${osVendor} ${osModel})` : '');
    req._mt = req.method.toLocaleLowerCase();
    if (req._mt === 'get') {
      req._ct = JSON.stringify(req.query);
    } else if (req._mt === 'post') {
      req._ct = JSON.stringify(req.body);
    }
    await writelog(req, `${req._mt}(${req._rp}) - [ ${req._ct} ]`);
    next();
  } catch (error) {
    await writelog(req, `[ app.use ] - ${error}`, true);
    _err(res);
  }
});
app.use(
  '/api/font',
  express.static(`${configObj.filepath}/font`, { maxAge: 2592000000 })
);
app.use(
  '/api/logo',
  express.static(`${configObj.filepath}/logo`, { maxAge: 2592000000 })
);
app.use(
  '/api/picture',
  express.static(`${configObj.filepath}/pic`, { maxAge: 2592000000 })
);
app.use('/api/getfavicon', require('./routes/getfavicon'));
app.use(async (req, res, next) => {
  try {
    req._userInfo = {};
    const {
      userinfo: { account },
      iat,
      exp,
    } = req._jwt;
    if (account) {
      const uArr = await queryData(
        'user',
        '*',
        `WHERE state = ? AND account = ?`,
        ['0', account]
      );
      if (uArr.length > 0) {
        //对比token生成的时间
        if ((uArr[0].flag || 0) < iat) {
          req._userInfo = uArr[0];
          if (Date.now() / 1000 - iat >= (exp - iat) / 2) {
            let { account, username } = req._userInfo;
            setCookie(res, { account, username });
          }
        }
      }
    }
    next();
  } catch (error) {
    await writelog(req, `[ app.use ] - ${error}`, true);
    _err(res);
  }
});
app.use('/api/user', require('./routes/user'));
app.use('/api/bg', require('./routes/bg'));
app.use('/api/pic', require('./routes/pic'));
app.use('/api/root', require('./routes/root'));
app.use('/api/player', require('./routes/player'));
app.use('/api/bmk', require('./routes/bmk'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/search', require('./routes/search'));
app.use('/api/note', require('./routes/note'));
app.use('/api/getfile', require('./routes/getfile'));
app.use('/api/todo', require('./routes/todo'));
app.use('/api/file', require('./routes/file'));
app.use('/api/notepad', require('./routes/notepad'));
app.use((req, res) => {
  res.sendFile(resolve(__dirname, 'data/404.html'));
});
app.listen(configObj.port, () => {
  let arr = getLocahost().map(
    (item) =>
      `http://${item}${configObj.port == 80 ? '' : `:${configObj.port}`}`
  );
  console.log(`服务开启成功，访问地址为：\n${arr.join('\n')}`);
});
function getLocahost() {
  let obj = os.networkInterfaces();
  let arr = [];
  Object.keys(obj).forEach((item) => {
    let value = obj[item];
    if (Object.prototype.toString.call(value).slice(8, -1) === 'Array') {
      arr = [
        ...arr,
        ...value
          .filter((item) => item.family == 'IPv4')
          .map((item) => item.address),
      ];
    }
  });
  return arr;
}
