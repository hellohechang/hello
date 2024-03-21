const express = require('express'),
  route = express.Router();
const { default: axios } = require('axios');
const {
  batchUpdateData,
  insertData,
  updateData,
  queryData,
} = require('../utils/sqlite');
const {
  bookSort,
  _success,
  _nologin,
  _err,
  nanoid,
  isurl,
  validaString,
  _type,
  paramErr,
  validationValue,
  getWordCount,
  splitWord,
  createFillString,
  _nothing,
  isValid,
  errLog,
  syncUpdateData,
  _setTimeout,
  isImgFile,
} = require('../utils/utils');
const cheerio = require('cheerio');

route.get('/share', async (req, res) => {
  try {
    let { id, pass = '' } = req.query;
    if (!validaString(id, 1, 1) || !validaString(pass)) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    const s = await queryData('getshare', '*', `WHERE id=? AND type=?`, [
      id,
      'bookmk',
    ]);
    if (s.length === 0) {
      _err(res, '分享已取消');
      return;
    }
    if (isValid(s[0].valid)) {
      _err(res, '分享已过期');
      return;
    }
    if (pass !== s[0].pass) {
      _nothing(res);
      return;
    }
    if (account && account != s[0].account) {
      const fArr = await queryData('friends', '*', `WHERE account=?`, [
        account,
      ]);
      const f = fArr.find((item) => item.friend == s[0].account);
      if (f) {
        s[0].username = f.des || s[0].username;
      }
    }
    _success(res, 'ok', {
      ...s[0],
      data: JSON.parse(s[0].data),
    });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 搜索书签
route.get('/searchbm', async (req, res) => {
  try {
    let { a = '', page = 1, showpage = 20, acc = '' } = req.query;
    page = parseInt(page);
    showpage = parseInt(showpage);
    if (
      !validaString(a) ||
      !validaString(acc, 0, 1) ||
      isNaN(page) ||
      isNaN(showpage) ||
      page < 1 ||
      showpage < 1 ||
      showpage > 200
    ) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    if (!acc && !account) {
      if (!account) {
        _nologin(res);
        return;
      }
    }
    let booklist = await queryData(
      'booklist',
      '*',
      `WHERE state=? AND account=?`,
      ['0', acc || account]
    );
    let arr = await queryData('bookmk', '*', `WHERE state=? AND account=?`, [
      '0',
      acc || account,
    ]);
    if (acc) {
      booklist = booklist.filter((item) => item.share == 'y');
    } else {
      booklist.push({ id: 'home' });
    }
    arr = arr.filter((item) => booklist.some((y) => y.id == item.listid));
    arr.reverse();
    if (a) {
      a = splitWord(a);
      arr = arr.map((item) => {
        const { name, link, des } = item;
        item.snum = getWordCount(a, '' + name + link + des);
        return item;
      });
      arr.sort((a, b) => b.snum - a.snum);
      arr = arr.filter((item) => item.snum > 0);
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
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
// 获取网站信息
route.get('/getsiteinfo', async (req, res) => {
  const r = { title: '', des: '' };
  try {
    let { u } = req.query;
    if (!isurl(u)) {
      paramErr(res, req);
      return;
    }
    let result = await axios({
      method: 'get',
      url: u,
      timeout: 5000,
    });
    const $ = cheerio.load(result.data);
    const $title = $('head title');
    const $des = $('head meta[name="description"]');
    r.title = $title.text() || '';
    r.des = $des.attr('content') || '';
    _success(res, 'ok', r);
  } catch (error) {
    _success(res, 'ok', r);
  }
});

//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.query;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let home = [];
    let it = bookSort(
      await queryData(
        'bookmk',
        '*',
        `WHERE listid=? AND state=? AND account=?`,
        [id, '0', account]
      )
    );
    let side = bookSort(
      await queryData('booklist', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ])
    );
    it = it.map((item, idx) => ({ ...item, num: idx }));
    side = side.map((item, idx) => ({ ...item, num: idx }));
    if (id == 'home') {
      home = it;
    } else {
      side = side.map((item) => {
        if (item.id === id) {
          item.item = it;
        }
        return item;
      });
    }
    _success(res, 'ok', { side, home });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
async function bookListMoveLocation(account, fId, tId) {
  if (fId == tId) return;
  const side = bookSort(
    await queryData('booklist', 'id,num', `WHERE account=? AND state=?`, [
      account,
      '0',
    ])
  );
  const fIdx = side.findIndex((item) => item.id === fId),
    tIdx = side.findIndex((item) => item.id === tId);
  if (fIdx >= 0 && tIdx >= 0) {
    side.splice(tIdx, 0, ...side.splice(fIdx, 1));
    let ob = {
      where: 'id',
      key: 'num',
      data: [],
    };
    side.forEach((item, i) => {
      ob.data.push({
        id: item.id,
        num: i,
      });
    });
    await batchUpdateData('booklist', [ob]);
  }
}
// 列表移动
route.post('/listmove', async (req, res) => {
  try {
    const account = req._userInfo.account;
    const { fromId, toId } = req.body;
    if (!validaString(fromId, 1, 1) || !validaString(toId, 1, 1)) {
      paramErr(res, req);
      return;
    }
    await bookListMoveLocation(account, fromId, toId);
    syncUpdateData(req, 'bookmark');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
async function bookmarkMoveLocation(account, pid, fId, tId) {
  if (fId == tId) return;
  const it = bookSort(
    await queryData(
      'bookmk',
      'id,num',
      `WHERE listid=? AND state=? AND account=?`,
      [pid, '0', account]
    )
  );
  const fIdx = it.findIndex((item) => item.id === fId),
    tIdx = it.findIndex((item) => item.id === tId);
  if (fIdx >= 0 && tIdx >= 0) {
    it.splice(tIdx, 0, ...it.splice(fIdx, 1));
    let ob = {
      where: 'id',
      key: 'num',
      data: [],
    };
    it.forEach((item, i) => {
      ob.data.push({
        id: item.id,
        num: i,
      });
    });
    await batchUpdateData('bookmk', [ob]);
  }
}
// 书签移动
route.post('/bmkmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { pid, fromId, toId } = req.body;
    if (
      !validaString(pid, 1, 1) ||
      !validaString(fromId, 1, 1) ||
      !validaString(toId, 1, 1)
    ) {
      paramErr(res, req);
      return;
    }
    await bookmarkMoveLocation(account, pid, fromId, toId);
    syncUpdateData(req, 'bookmark');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 新建列表
route.post('/addlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { name } = req.body;
    if (!validaString(name, 1)) {
      paramErr(res, req);
      return;
    }
    let total =
      (
        await queryData('booklist', 'MAX(num)', `WHERE account=? AND state=?`, [
          account,
          '0',
        ])
      )[0]['MAX(num)'] || 0;
    let id = nanoid();
    await insertData('booklist', [
      {
        id,
        name,
        account,
        num: total + 1,
        share: 'n',
        state: '0',
      },
    ]);
    syncUpdateData(req, 'bookmark');
    _success(res, '添加分组成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除列表
route.post('/dellist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { arr } = req.body;
    if (
      !_type.isArray(arr) ||
      arr.length == 0 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'booklist',
      { state: '1' },
      `WHERE id IN (${createFillString(arr.length)}) AND state=? AND account=?`,
      [...arr, '0', account]
    );
    syncUpdateData(req, 'bookmark');
    _setTimeout(() => {
      syncUpdateData(req, 'trash');
    }, 100);
    _success(res, '删除书签分组成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/locklist', async (req, res) => {
  try {
    const { share, arr } = req.body;
    let account = req._userInfo.account;
    if (
      !validationValue(share, ['y', 'n']) ||
      !_type.isArray(arr) ||
      arr.length == 0 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'booklist',
      { share },
      `WHERE id IN (${createFillString(arr.length)}) AND state=? AND account=?`,
      [...arr, '0', account]
    );
    syncUpdateData(req, 'bookmark');
    _success(res, `${share == 'y' ? '公开' : '锁定'}书签分组成功`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 书签logo设置
route.post('/setlogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { pid, cid, purl } = req.body;
    if (
      !validaString(pid, 1, 1) ||
      !validaString(cid, 1, 1) ||
      !isImgFile(purl)
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'bookmk',
      { logo: purl },
      `WHERE account=? AND id=? AND state=? AND listid=?`,
      [account, cid, '0', pid]
    );
    syncUpdateData(req, 'bookmark');
    _success(res, '上传书签图标成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 编辑列表
route.post('/editlist', async (req, res) => {
  try {
    const account = req._userInfo.account;
    const { id, name, toId = '' } = req.body;
    if (
      !validaString(name, 1) ||
      !validaString(id, 1, 1) ||
      !validaString(toId, 0, 1)
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'booklist',
      { name },
      `WHERE account=? AND state=? AND id=?`,
      [account, '0', id]
    );
    if (toId) {
      await bookListMoveLocation(account, id, toId);
    }
    syncUpdateData(req, 'bookmark');
    _success(res, '更新书签分组标题成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 上传书签
route.post('/addbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { arr, id } = req.body;
    if (
      !validaString(id, 1, 1) ||
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every(
        (item) =>
          _type.isObject(item) &&
          validaString(item.name, 1) &&
          isurl(item.link) &&
          validaString(item.des)
      )
    ) {
      paramErr(res, req);
      return;
    }
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          [id, account, '0']
        )
      )[0]['MAX(num)'] || 0;
    arr = arr.map((item, i) => ({
      id: nanoid(),
      account,
      num: total + i + 1,
      listid: id,
      state: '0',
      name: item.name,
      link: item.link,
      logo: '',
      des: item.des,
    }));
    await insertData('bookmk', arr);
    syncUpdateData(req, 'bookmark');
    _success(res, '添加书签成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 编辑书签
route.post('/editbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { pid, cid, name, link, des, tid = '' } = req.body;
    if (
      !validaString(pid, 1, 1) ||
      !validaString(cid, 1, 1) ||
      !validaString(tid, 0, 1) ||
      !validaString(name, 1) ||
      !isurl(link) ||
      !validaString(des)
    ) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'bookmk',
      { name, link, des },
      `WHERE account=? AND state=? AND id=? AND listid=?`,
      [account, '0', cid, pid]
    );
    if (tid) {
      await bookmarkMoveLocation(account, pid, cid, tid);
    }
    syncUpdateData(req, 'bookmark');
    _success(res, '更新书签信息成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 书签移动目录
route.post('/bmktolist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { arr, toid } = req.body;
    if (
      !validaString(toid, 1, 1) ||
      !_type.isArray(arr) ||
      arr.length == 0 ||
      arr.length > 200 ||
      !arr.every((item) => validaString(item, 1, 1))
    ) {
      paramErr(res, req);
      return;
    }
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          [toid, account, '0']
        )
      )[0]['MAX(num)'] || 0;
    let ob = [
      {
        key: 'num',
        where: 'id',
        data: [],
      },
      {
        key: 'listid',
        where: 'id',
        data: [],
      },
    ];
    arr.forEach((item) => {
      total++;
      ob[0].data.push({
        id: item,
        num: total,
      });
      ob[1].data.push({
        id: item,
        listid: toid,
      });
    });
    await batchUpdateData('bookmk', ob, `account="${account}" AND state="0"`);
    syncUpdateData(req, 'bookmark');
    _success(res, '书签移动分组成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
// 删除书签
route.post('/delbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
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
      'bookmk',
      { state: '1' },
      `WHERE id IN (${createFillString(arr.length)}) AND state=? AND account=?`,
      [...arr, '0', account]
    );
    syncUpdateData(req, 'bookmark');
    _setTimeout(() => {
      syncUpdateData(req, 'trash');
    }, 100);
    _success(res, '删除书签成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
//列表分享
route.post('/share', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let r = nanoid(),
      { id, title, valid, pass = '' } = req.body;
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
    let arr = bookSort(
      await queryData(
        'bookmk',
        '*',
        `WHERE listid=? AND state=? AND account=?`,
        [id, '0', account]
      )
    );
    if (arr.length === 0) {
      _err(res, '当前组为空');
      return;
    }
    let obj = {
      id: r,
      valid: valid == 0 ? 0 : Date.now() + valid * 24 * 60 * 60 * 1000,
      title,
      pass,
      data: JSON.stringify(arr),
      account,
      type: 'bookmk',
    };
    await insertData('share', [obj]);
    syncUpdateData(req, 'sharelist');
    _success(res, 'ok', { id: r });
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

//收藏分享
route.get('/saveshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, name, pass = '' } = req.query;
    if (
      !validaString(id, 1, 1) ||
      !validaString(name, 1) ||
      !validaString(pass)
    ) {
      paramErr(res, req);
      return;
    }
    let arr = await queryData('share', '*', `WHERE id=? AND type=?`, [
      id,
      'bookmk',
    ]);
    if (arr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    if (isValid(arr[0].valid)) {
      _err(res, '分享已过期');
      return;
    }
    if (arr[0].pass !== pass) {
      _err(res, '提取码错误');
      return;
    }
    arr = JSON.parse(arr[0].data);
    let total =
      (
        await queryData('booklist', 'MAX(num)', `WHERE account=? AND state=?`, [
          account,
          '0',
        ])
      )[0]['MAX(num)'] || 0;
    let pid = nanoid();
    await insertData('booklist', [
      {
        id: pid,
        name,
        account,
        num: total + 1,
        share: 'n',
        state: '0',
      },
    ]);
    arr = arr.map((item) => {
      const { name, link, des, num } = item;
      return {
        name,
        link,
        des,
        num,
        state: '0',
        id: nanoid(),
        listid: pid,
        account,
        logo: '',
      };
    });
    await insertData('bookmk', arr);
    syncUpdateData(req, 'bookmark');
    _success(res, '保存书签成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/getbooklist', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let list = await queryData('booklist', '*', `WHERE state=? AND account=?`, [
      '0',
      account,
    ]);
    _success(res, 'ok', list);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/importbm', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr } = req.body;
    if (
      !_type.isArray(arr) ||
      !arr.every(
        (item) =>
          _type.isObject(item) &&
          validaString(item.name, 1) &&
          _type.isArray(item.list) &&
          item.list.every((y) => validaString(y.name, 1) && isurl(y.url))
      )
    ) {
      paramErr(res, req);
      return;
    }
    let total =
      (
        await queryData('booklist', 'MAX(num)', `WHERE account=? AND state=?`, [
          account,
          '0',
        ])
      )[0]['MAX(num)'] || 0;
    for (let i = 0; i < arr.length; i++) {
      let { name, list } = arr[i];
      let pid = nanoid();
      await insertData('booklist', [
        {
          id: pid,
          name,
          account,
          num: total + 1 + i,
          share: 'n',
          state: '0',
        },
      ]);
      list = list.map((item, i) => ({
        id: nanoid(),
        account,
        num: total + i + 1,
        listid: pid,
        state: '0',
        name: item.name,
        link: item.url,
        logo: '',
        des: '',
      }));
      await insertData('bookmk', list);
    }
    syncUpdateData(req, 'bookmark');
    _success(res, '导入书签成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/exportbm', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let list = await queryData('bookmk', '*', `WHERE state=? AND account=?`, [
      '0',
      account,
    ]);
    let side = await queryData('booklist', '*', `WHERE state=? AND account=?`, [
      '0',
      account,
    ]);
    side.push({ id: 'home', name: '主页' });
    side = side.map((item) => {
      const children = list.filter((y) => y.listid == item.id);
      return {
        name: item.name,
        children,
      };
    });
    _success(res, 'ok', side);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/cleanlogo', async (req, res) => {
  try {
    const account = req._userInfo.account;
    const { id } = req.body;
    if (!validaString(id, 1, 1)) {
      paramErr(res, req);
      return;
    }
    await updateData(
      'bookmk',
      { logo: '' },
      `WHERE state=? AND account=? AND id=?`,
      ['0', account, id]
    );
    syncUpdateData(req, 'bookmark');
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
module.exports = route;
