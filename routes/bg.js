const express = require('express'),
  fs = require('fs'),
  { mediaurl } = require('../myconfig'),
  route = express.Router();
const {
  updateData,
} = require('../sqlite');
const {
  writelog,
  _readdir,
  _mkdir,
  _unlink,
  compressionImg,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next()
  } else {
    _nologin(res)
  }
})
// 随机壁纸
route.get('/randombg', async (req, res) => {
  try {
    let p = req.query.p,
      bgarr = await _readdir(`${mediaurl.filepath}/bg/${p}`),
      num = Math.round(Math.random() * (bgarr.length - 1 - 0) + 0);
    if (bgarr.length === 0) {
      _err(res, '壁纸库为空，请先上传壁纸~')
      return
    }
    _success(res, 'ok', {
      link: bgarr[num]
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 更新壁纸
route.post('/updatabg', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { flag, bg } = req.body,
      obj = {};
    obj[flag] = bg
    await updateData('user', obj, `WHERE account=? AND state=?`, [account, '0'])
    _success(res);
    await writelog(req, `更换壁纸[${bg}]`)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 壁纸获取
route.get("/getbg", async (req, res) => {
  try {
    let { flag, page, showpage = 40 } = req.query,
      bgarr = await _readdir(`${mediaurl.filepath}/bg/${flag}`),
      pagenum = Math.ceil(bgarr.length / showpage);
    // 创建时间排序
    bgarr.sort((a, b) => {
      a = fs.statSync(`${mediaurl.filepath}/bg/${flag}/${a}`).ctime.getTime();
      b = fs.statSync(`${mediaurl.filepath}/bg/${flag}/${b}`).ctime.getTime();
      return b - a;
    });
    page > pagenum ? page = pagenum : (page <= 0 ? page = 1 : null);
    let arr = bgarr.slice(showpage * (page - 1), showpage * page);
    // 压缩壁纸
    let proarr = [];
    arr.forEach(y => {
      if (!fs.existsSync(`${mediaurl.filepath}/bgys/${flag}/${y}`)) {
        let d = null;
        if (flag === 'bg') {
          d = compressionImg(`${mediaurl.filepath}/bg/${flag}/${y}`, `${mediaurl.filepath}/bgys/${flag}/${y}`, 600, 400);
        } else {
          d = compressionImg(`${mediaurl.filepath}/bg/${flag}/${y}`, `${mediaurl.filepath}/bgys/${flag}/${y}`, 400, 800);
        }
        proarr.push(d);
      }
    });
    Promise.all(proarr).then(() => {
      _success(res, 'ok', {
        total: bgarr.length,
        totalPage: pagenum,
        pageNo: page,
        data: arr
      });
    }).catch(() => {
      _err(res)
    })
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 删除壁纸
route.post("/delbg", async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作~')
      return
    }
    let url = req.body.url;
    _unlink(`${mediaurl.filepath}/bg/bg/${url}`);
    _unlink(`${mediaurl.filepath}/bg/bgxs/${url}`);
    _unlink(`${mediaurl.filepath}/bgys/bg/${url}`);
    _unlink(`${mediaurl.filepath}/bgys/bgxs/${url}`);
    await writelog(req, `删除壁纸[${url}]`)
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 上传壁纸
route.post("/up", async (req, res) => {
  try {
    let path = `${mediaurl.filepath}/upload/${req.query.HASH}`;
    await _mkdir(path);
    await receiveFiles(req, path, req.query.name)
    _success(res)
    await writelog(req, `上传壁纸[${req.query.HASH}]`)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//合并文件
route.post('/mergefile', async (req, res) => {
  try {
    let { HASH, count, name, flag } = req.body;
    await mergefile(count, `${mediaurl.filepath}/upload/${HASH}`, `${mediaurl.filepath}/bg/${flag}/${name}`)
    _success(res)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 断点续传
route.post('/breakpoint', async (req, res) => {
  let { HASH } = req.body,
    path = `${mediaurl.filepath}/upload/${HASH}`,
    arr = [];
  try {
    if (fs.existsSync(path)) {
      arr = await _readdir(path);
    }
    _success(res, 'ok', arr)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 检查上传文件是否重复
route.post('/repeatfile', (req, res) => {
  let { name, flag } = req.body;
  if (fs.existsSync(`${mediaurl.filepath}/bg/${flag}/${name}`)) {
    _success(res);
    return;
  }
  _nothing(res)
});

module.exports = route;