const express = require('express'),
  { mediaurl } = require('../myconfig'),
  route = express.Router();

const {
  updateData,
  deleteData,
  queryData
} = require('../sqlite');
const {
  writelog,
  _readFile,
  _writeFile,
  _readdir,
  _unlink,
  delDir,
  qucong,
  _success,
  _err,
  jwten,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account !== 'root') {
    _err(res, '当前账号没有权限执行该操作~');
  } else {
    next()
  }
})
//管理员处理
// 重置密码
route.get('/resetpass', async (req, res) => {
  try {
    let a = req.query.a;
    await updateData('user', {
      password: '90089e402b00',//密码重置为空
      flag: parseInt(Date.now() / 1000)
    }, `WHERE account=? AND state=?`, [a, '0'])
    await writelog(req, `重置[${a}]密码为空`)
    _success(res, '重置密码成功~');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//获取用户列表
route.get('/userlist', async (req, res) => {
  try {
    let arr = await queryData('user', "*")
    arr = arr.map(item => {
      return {
        ...item,
        online: Date.now() - item.time > 1000 * 30 ? 'n' : 'y'
      }
    })
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//通过管理员注销账号
route.post('/deluser', async (req, res) => {
  try {
    let { ac, flag = '1' } = req.body;
    if (ac !== 'root') {
      await updateData('user', {
        state: flag
      }, `WHERE account=?`, [ac])
      if (flag == 0) {
        _success(res, '成功激活账号~');
      } else {
        await deleteData('friends', `WHERE account = ? OR friend = ?`, [ac, ac])
        _success(res, '成功关闭账号~');
      }
      await writelog(req, `${flag == 0 ? '激活' : '关闭'} 账号[${ac}]`);
    } else {
      _err(res, '当前账号没有权限执行该操作~');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//通过管理员注销账号
route.post('/delaccount', async (req, res) => {
  try {
    let { ac } = req.body;
    if (ac !== 'root' && ac !== 'test') {
      await deleteData('user', `WHERE account=?`, [ac])
      await deleteData('friends', `WHERE account = ? OR friend = ?`, [ac, ac])
      await deleteData('share', `WHERE account = ?`, [ac])
      await deleteData('playing', `WHERE account = ?`, [ac])
      await deleteData('musicinfo', `WHERE account = ?`, [ac])
      await deleteData('lastmusic', `WHERE account = ?`, [ac])
      await deleteData('booklist', `WHERE account = ?`, [ac])
      await deleteData('bookmk', `WHERE account = ?`, [ac])
      await deleteData('history', `WHERE account = ?`, [ac])
      await deleteData('note', `WHERE account = ?`, [ac])
      await deleteData('chat', `WHERE (_from=? OR _to=?) AND flag != ?`, [ac, ac, 'chang'])
      await delDir(`${mediaurl.filepath}/logo/${ac}`)
      await writelog(req, `销毁账号[${ac}]`)
      _success(res, '成功销毁账号~')
    } else {
      _err(res, '当前账号没有权限执行该操作~');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//登录其他
route.post('/loginother', async (req, res) => {
  try {
    const ac = req.body.a;
    let token = jwten(ac);
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true })
    _success(res, 'ok')
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 清空upload
route.get('/clearup', async (req, res) => {
  try {
    let up = await _readdir(`${mediaurl.filepath}/upload`);
    up.forEach(async v => {
      let p = `${mediaurl.filepath}/upload/${v}`;
      let pys = `${mediaurl.filepath}/uploadys/${v}`;
      delDir(p)
      delDir(pys)
    });
    await writelog(req, '清空upload目录')
    _success(res, '成功清空upload目录~');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//日志处理
//搜索日志
route.get("/logsearch", async (req, res) => {
  try {
    let { page, context, showpage = 100 } = req.query,
      arr = [];
    arr = (await _readFile('./hello.log', true)).toString().split('\n')
    arr.pop()
    arr.reverse();
    if (context) {
      arr = arr.filter(item => item.toLowerCase().includes(context.toLowerCase()))
    }
    let pagenum = Math.ceil(arr.length / showpage);
    page > pagenum ? page = pagenum : (page <= 0 ? page = 1 : null);
    let arr1 = arr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: arr.length,
      totalPage: pagenum,
      pageNo: page,
      data: arr1
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 清空日志
route.post("/logclear", async (req, res) => {
  try {
    await _writeFile('./hello.log', '')
    await writelog(req, "清空日志");
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 删除多余聊天记录
route.get("/clearchatdata", async (req, res) => {
  try {
    await deleteData('chat', `WHERE state=?`, ['1'])
    await writelog(req, "清理已删除的聊天记录");
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
//删除多余歌曲文件
route.get('/delmusicfile', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let musics = [];
    let arr = JSON.parse((await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0].data);
    arr.forEach((v, i) => {
      if (i < 2) return;
      v.item.forEach((y) => {
        musics.push(y);
      });
    });
    musics = qucong(musics);
    let delarr = '';
    (await _readdir(`${mediaurl.filepath}/music`)).forEach(item => {
      let i = item.lastIndexOf('.');
      if (!musics.some(v => `${v.artist}-${v.name}` === item.slice(0, i))) {
        _unlink(`${mediaurl.filepath}/music/${item}`)
        delarr += `${item}\n`
      }
      if (item.slice(i).toLowerCase() === '.mp4') {
        if (musics.some(v => `${v.artist}-${v.name}` === item.slice(0, i) && v.mv === '')) {
          _unlink(`${mediaurl.filepath}/music/${item}`)
          delarr += `${item}\n`
        }
      };
    });
    (await _readdir(`${mediaurl.filepath}/musicys`)).forEach(item => {
      let i = item.lastIndexOf('.');
      if (!musics.some(v => `${v.artist}-${v.name}` === item.slice(0, i))) {
        _unlink(`${mediaurl.filepath}/musicys/${item}`)
        delarr += `${item}\n`
      }
    })
    await writelog(req, `更新歌曲文件`)
    if (delarr.length === 0) {
      _success(res, 'ok', '没有多余歌曲文件~')
      return
    }
    _success(res, 'ok', `删除文件:\n ${delarr}`)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
})


module.exports = route;