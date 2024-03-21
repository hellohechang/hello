const express = require('express'),
  route = express.Router();
const {
  insertData,
  updateData,
  queryData,
  runSqlite,
} = require('../utils/sqlite');
const {
  _success,
  _nologin,
  _err,
  nanoid,
  validaString,
  _type,
  validationValue,
  paramErr,
  getWordContent,
  getWordCount,
  splitWord,
  createFillString,
  errLog,
  syncUpdateData,
  _setTimeout,
} = require('../utils/utils');

route.get('/getnote', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { v: id } = req.query;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let ntobj = (await queryData('getnote', '*', `WHERE id=?`, [id]))[0];
    if (ntobj) {
      let {
        username,
        share,
        name,
        data,
        account: acc,
        time,
        utime,
        visit_count,
        state,
        logo,
      } = ntobj;
      await runSqlite(`update note set visit_count=visit_count+1 where id=?`, [
        id,
      ]);
      if ((share === 'y' && state === '0') || acc === account) {
        let own = 'n';
        if (ntobj.account === account) {
          own = 'y';
        }
        if (account && own == 'n') {
          const fArr = await queryData('friends', '*', `WHERE account=?`, [
            account,
          ]);
          const f = fArr.find((item) => item.friend == acc);
          if (f) {
            username = f.des || username;
          }
        }
        _success(res, 'ok', {
          username,
          name,
          data,
          visit_count,
          account: acc,
          time,
          utime,
          own,
          logo,
        });
      } else {
        _err(res, '当前笔记未公开');
      }
    } else {
      _err(res, '当前笔记不存在');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 笔记搜索处理
route.get('/allsearchlist', async (req, res) => {
  try {
    let { acc, a = '', page = 1, showpage = 20 } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      !validaString(acc, 1, 1) ||
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
    let aa = await queryData(
      'getnote',
      '*',
      `WHERE state=? AND account = ? AND share=?`,
      ['0', acc, 'y']
    );
    aa.reverse();
    if (a) {
      a = splitWord(a);
      let arr = [];
      aa.forEach((item) => {
        let { name, data, id, share, visit_count } = item;
        data = data.replace(/[\n\r]/g, '');
        let sNum = getWordCount(a, data);
        let tNum = getWordCount(a, name);
        if (sNum > 0 || tNum > 0) {
          let con = getWordContent(a, data).slice(0, 30);
          arr.push({
            id,
            share,
            name,
            visit_count,
            con,
            tNum,
            sNum,
          });
        }
      });
      if (arr.length > 0) {
        arr.sort((a, b) => {
          return b.sNum - a.sNum;
        });
        arr.sort((a, b) => {
          return b.tNum - a.tNum;
        });
      }
      aa = arr;
    }

    aa = aa.map((v) => {
      delete v.data;
      delete v.time;
      delete v.state;
      return v;
    });
    let pagenum = Math.ceil(aa.length / showpage) || 1;
    page > pagenum ? (page = pagenum) : null;
    let sdata = aa.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: aa.length,
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
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
// 笔记
// 公开和锁定笔记
route.post('/locking', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr, noteflag = 'n' } = req.body;
    if (
      !_type.isArray(arr) ||
      !validationValue(noteflag, ['n', 'y']) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'note',
      { share: noteflag },
      `WHERE id IN (${createFillString(arr.length)}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    syncUpdateData(req, 'note');
    _success(res, `${noteflag == 'n' ? '锁定' : '公开'}笔记成功`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

// 笔记搜索处理
route.get('/searchlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { a = '', page = 1, showpage = 20, showLock = 'n' } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      !validaString(a) ||
      !validationValue(showLock, ['y', 'n']) ||
      isNaN(page) ||
      isNaN(showpage) ||
      page < 1 ||
      showpage < 1 ||
      showpage > 200
    ) {
      paramErr(res, req);
      return;
    }
    let aa = await queryData('getnote', '*', `WHERE state=? AND account=?`, [
      '0',
      account,
    ]);
    if (showLock == 'y') {
      aa = aa.filter((item) => item.share == 'n');
    }
    aa.reverse();
    if (a) {
      a = splitWord(a);
      let arr = [];
      aa.forEach((item) => {
        let { name, data, id, share, visit_count } = item;
        data = data.replace(/[\n\r]/g, '');
        let sNum = getWordCount(a, data);
        let tNum = getWordCount(a, name);
        if (sNum > 0 || tNum > 0) {
          let con = getWordContent(a, data).slice(0, 30);
          arr.push({
            id,
            share,
            name,
            visit_count,
            con,
            tNum,
            sNum,
          });
        }
      });
      if (arr.length > 0) {
        arr.sort((a, b) => {
          return b.sNum - a.sNum;
        });
        arr.sort((a, b) => {
          return b.tNum - a.tNum;
        });
      }
      aa = arr;
    }

    aa = aa.map((v) => {
      delete v.data;
      return v;
    });
    let pagenum = Math.ceil(aa.length / showpage) || 1;
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let sdata = aa.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: aa.length,
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
// 删除笔记
route.post('/delnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr } = req.body;
    if (
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    arr = arr.filter((item) => item !== 'about');
    await updateData(
      'note',
      { state: '1' },
      `WHERE id IN (${createFillString(arr.length)}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    syncUpdateData(req, 'note');
    _setTimeout(() => {
      syncUpdateData(req, 'trash');
    }, 100);
    _success(res, '删除笔记成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 获取笔记内容
route.get('/geteditnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { id } = req.query;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let noteobj = (await queryData('getnote', '*', `WHERE id=?`, [id]))[0];
    if (noteobj) {
      if (
        (noteobj.share === 'y' && noteobj.state === '0') ||
        noteobj.account === account
      ) {
        let name = noteobj.name;
        let data = noteobj.data;
        _success(res, 'ok', { name, data });
      } else {
        _err(res, '当前笔记未公开');
      }
    } else {
      _err(res, '当前笔记不存在');
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 编辑笔记
route.post('/editnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { id, vn, vt = '' } = req.body;
    if (!validaString(id, 1, 1) || !validaString(vn, 1) || !validaString(vt)) {
      paramErr(res, req);
      return;
    }
    let r = await updateData(
      'note',
      {
        name: vn,
        data: vt,
        utime: Date.now(),
      },
      `WHERE id=? AND account=?`,
      [id, account]
    );
    if (r.changes == 0) {
      id = nanoid();
      await insertData('note', [
        {
          id,
          name: vn,
          data: vt,
          time: Date.now(),
          share: 'n',
          account,
          visit_count: '0',
          utime: '',
          state: '0',
        },
      ]);
      syncUpdateData(req, 'note');
      _success(res, '新增笔记成功', { id });
    } else {
      _success(res, '更新笔记成功');
      syncUpdateData(req, 'note', id);
      _setTimeout(() => {
        syncUpdateData(req, 'trash');
      }, 100);
    }
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
