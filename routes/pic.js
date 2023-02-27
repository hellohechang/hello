const express = require('express'),
  fs = require('fs'),
  { mediaurl } = require('../myconfig'),
  route = express.Router();
const {
  writelog,
  _readdir,
  _mkdir,
  _unlink,
  compressionImg,
  _success,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account === 'root') {
    next()
  } else {
    _err(res, '当前账号没有权限执行该操作~')
  }
})
// 图床
// 获取
route.get("/getlist", async (req, res) => {
  try {
    let { page, showpage = 40 } = req.query,
      bgarr = await _readdir(`${mediaurl.filepath}/pic`),
      pagenum = Math.ceil(bgarr.length / showpage);
    bgarr.sort((a, b) => {
      a = fs.statSync(`${mediaurl.filepath}/pic/${a}`).ctime.getTime();
      b = fs.statSync(`${mediaurl.filepath}/pic/${b}`).ctime.getTime();
      return b - a;
    });
    page > pagenum ? page = pagenum : (page <= 0 ? page = 1 : null);
    let arr = bgarr.slice(showpage * (page - 1), showpage * page);
    let proarr = [];
    arr.forEach(y => {
      if (!fs.existsSync(`${mediaurl.filepath}/picys/${y}`)) {
        let d = compressionImg(`${mediaurl.filepath}/pic/${y}`, `${mediaurl.filepath}/picys/${y}`, 500, 500);
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
// 删除
route.post("/delpic", async (req, res) => {
  try {
    let url = req.body.url;
    _unlink(`${mediaurl.filepath}/pic/${url}`);
    _unlink(`${mediaurl.filepath}/picys/${url}`);
    _success(res);
    await writelog(req,`删除图片[${url}]`)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 上传
route.post("/up", async (req, res) => {
  try {
    let path = `${mediaurl.filepath}/upload/${req.query.HASH}`;
    await _mkdir(path);
    await receiveFiles(req, path, req.query.name)
    await writelog(req,`上传图片[${req.query.name}]`)
    _success(res)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//合并文件
route.post('/mergefile', async (req, res) => {
  try {
    let { HASH, count, name } = req.body;
    await mergefile(count, `${mediaurl.filepath}/upload/${HASH}`, `${mediaurl.filepath}/pic/${name}`)
    _success(res)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 断点续传
route.post('/breakpoint', async (req, res) => {
  try {
    let { HASH } = req.body,
      path = `${mediaurl.filepath}/upload/${HASH}`,
      arr = [];
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
  let { name } = req.body;
  if (fs.existsSync(`${mediaurl.filepath}/pic/${name}`)) {
    _success(res);
    return;
  }
  _nothing(res)
});

module.exports = route;