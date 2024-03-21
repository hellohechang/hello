const express = require('express'),
  route = express.Router();
const {
  insertData,
  updateData,
  deleteData,
  queryData,
} = require('../utils/sqlite');
const {
  _success,
  _nologin,
  _err,
  nanoid,
  validaString,
  _type,
  paramErr,
  getWordCount,
  splitWord,
  createFillString,
  errLog,
  syncUpdateData,
  _setTimeout,
} = require('../utils/utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
route.get('/getsplitword', async (req, res) => {
  try {
    let { a } = req.query;
    if (!validaString(a, 1)) {
      paramErr(res, req);
      return;
    }
    a = splitWord(a);
    _success(res, 'ok', a);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//搜索历史处理
// 搜索搜索历史
route.get('/history', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a = '', page = 1, showpage = 80 } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
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
    let arr = await queryData('history', '*', `WHERE state=? AND account=?`, [
      '0',
      account,
    ]);
    arr.reverse();
    if (a) {
      a = splitWord(a);
      let sArr = [];
      arr.forEach((v) => {
        let { data } = v;
        let flag = getWordCount(a, data);
        if (flag > 0) {
          sArr.push({
            ...v,
            flag,
          });
        }
      });
      if (sArr.length > 0) {
        sArr.sort((a, b) => {
          return b.flag - a.flag;
        });
      }
      arr = sArr;
    }
    arr = arr.map((item) => {
      delete item.state;
      delete item.flag;
      return item;
    });
    let pagenum = Math.ceil(arr.length / showpage) || 1;
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
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
// 保存搜索历史
route.post('/add', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let a = req.body.a;
    if (!validaString(a, 1)) {
      paramErr(res, req);
      return;
    }
    await deleteData('history', `WHERE account=? AND data=?`, [account, a]);
    await insertData('history', [
      {
        id: nanoid(),
        data: a,
        account,
        state: '0',
      },
    ]);
    syncUpdateData(req, 'history');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 搜索 搜索历史 笔记 书签
route.get('/getsearchdata', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a = '' } = req.query;
    if (!validaString(a)) {
      paramErr(res, req);
      return;
    }
    let se = await queryData(
      'history',
      'id,data',
      `WHERE state=? AND account=?`,
      ['0', account]
    ); //搜索历史
    se.reverse();
    if (!a) {
      _success(res, 'ok', {
        list: se.slice(0, 10).map((item) => {
          return {
            ...item,
            type: 'ss',
          };
        }),
        splitWord: '',
      });
      return;
    }
    a = splitWord(a);
    let arr = [],
      note = await queryData('note', 'id,name', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]), //笔记
      bmk = await queryData(
        'bookmk',
        'name,link,des,id',
        `WHERE state=? AND account=?`,
        ['0', account]
      ),
      music = await queryData('musics', '*'),
      userList = await queryData('user', 'username,account', `WHERE state=?`, [
        '0',
      ]),
      farr = await queryData('friends', '*', `WHERE account=?`, [account]);
    music.reverse();
    note.reverse();
    bmk.reverse();
    userList.reverse();

    se.forEach((v) => {
      //包含搜索词的历史记录
      let { data } = v;
      let sNum = getWordCount(a, data);
      if (sNum > 0) {
        arr.push({ ...v, type: 'ss', sNum });
      }
    });
    userList.forEach((v) => {
      let { username, account: acc } = v;
      let des = '';
      const f = farr.find((item) => item.friend == acc);
      if (f) {
        des = f.des;
      }
      let sNum = getWordCount(a, username + (des || ''));
      if (sNum > 0) {
        arr.push({
          ...v,
          id: acc,
          type: 'user',
          des,
          sNum,
        });
      }
    });

    note.forEach((item) => {
      //笔记名包含搜索词的笔记
      let { name } = item;
      let sNum = getWordCount(a, name);
      if (sNum > 0) {
        arr.push({ ...item, type: 'note', sNum });
      }
    });

    bmk.forEach((item) => {
      //包含搜索词的书签
      let { name, link, des } = item,
        n = `${name}${link}${des || ''}`;
      let sNum = getWordCount(a, n);
      if (sNum > 0) {
        arr.push({
          ...item,
          type: 'bmk',
          sNum,
        });
      }
    });

    music.forEach((item) => {
      let { title, artist } = item,
        n = `${artist}${title}`;
      let sNum = getWordCount(a, n);
      if (sNum > 0) {
        arr.push({
          ...item,
          type: 'music',
          sNum,
        });
      }
    });
    arr.sort((a, b) => {
      return b.sNum - a.sNum;
    });
    _success(res, 'ok', { list: arr.slice(0, 50), splitWord: a });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除搜索历史记录
route.post('/del', async (req, res) => {
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
    await updateData(
      'history',
      { state: '1' },
      `WHERE id IN (${createFillString(arr.length)}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    syncUpdateData(req, 'history');
    _setTimeout(() => {
      syncUpdateData(req, 'trash');
    }, 100);
    _success(res, '删除搜索历史成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
