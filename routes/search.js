const express = require('express'),
  route = express.Router();
const {
  insertData,
  updateData,
  deleteData,
  queryData
} = require('../sqlite');
const {
  writelog,
  _success,
  _nologin,
  _err,
  nanoid,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next()
  } else {
    _nologin(res)
  }
})

//搜索历史处理
// 搜索搜索历史
route.get('/history', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a, page, showpage = 80 } = req.query,
      arr = await queryData('history', '*', `WHERE state=? AND account=?`, ['0', account]);
    if (a) {
      let f = a[0].toLowerCase();//搜索词首字符
      arr = arr.filter(v => {//包含搜索词的历史记录
        let { data } = v,
          n = data.toLowerCase(),
          aa = a.toLowerCase();
        return n.includes(aa)
      });
      if (arr.length > 0) {
        arr.sort((a, b) => {
          let x = a.data.toLowerCase(),
            y = b.data.toLowerCase();
          return x.indexOf(f) - y.indexOf(f);
        });
      }
    } else {
      arr = arr.reverse();
    }
    arr = arr.map(item => {
      delete item.state
      return item
    })
    let pagenum = Math.ceil(arr.length / showpage);
    page > pagenum ? page = pagenum : (page <= 0 ? page = 1 : null);
    let sdata = arr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: arr.length,
      totalPage: pagenum,
      pageNo: page,
      data: sdata
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 保存搜索历史
route.post('/add', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let a = req.body.a;
    await deleteData('history', `WHERE account=? AND data=?`, [account, a])
    await insertData('history', [{
      id: nanoid(),
      data: a,
      account
    }])
    await writelog(req, `搜索内容[${a}]`)
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 搜索 搜索历史 笔记 书签
route.get('/getsearchdata', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a } = req.query,
      se = await queryData('history', '*', `WHERE state=? AND account=?`, ['0', account]);//搜索历史
    if (!a) {
      _success(res, 'ok', se.reverse().slice(0, 10))
      return
    }
    let arr = [],
      arr1 = [],
      note = await queryData('note', '*', `WHERE state=? AND account=?`, ['0', account]),//笔记
      bmk = await queryData('bookmk', '*', `WHERE state=? AND account=?`, ['0', account]);

    let f = a[0].toLowerCase();//搜索词首字符

    note.forEach(item => {//笔记名包含搜索词的笔记
      let { name, id } = item,
        n = name.toLowerCase(),
        aa = a.toLowerCase();
      if (n.includes(aa)) {
        arr1.push({ name, id, type: 'note' });
      }
    });

    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        let x = a.name.toLowerCase(),//首字母先后出现排序
          y = b.name.toLowerCase();
        return x.indexOf(f) - y.indexOf(f);
      });
      arr = [...arr1.slice(0, 5)];
    }

    arr1 = [];
    bmk.forEach(item => {//包含搜索词的书签
      let { name, link } = item,
        n = (name + link).toLowerCase(),
        aa = a.toLowerCase();
      if (n.includes(aa)) {
        arr1.push({ name: name, link: link, type: 'bmk' });
      }
    });

    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        let x = (a.name + a.link).toLowerCase(),
          y = (b.name + b.link).toLowerCase();
        return x.indexOf(f) - y.indexOf(f);
      });
      arr = [...arr, ...arr1.slice(0, 5)];
    }

    arr1 = [];
    se.forEach(v => {//包含搜索词的历史记录
      let { id, data } = v,
        n = data.toLowerCase(),
        aa = a.toLowerCase();
      if (n.includes(aa)) {
        arr1.push({ name: data, id, type: 'ss' });
      }
    });
    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        let x = a.name.toLowerCase(),
          y = b.name.toLowerCase();
        return x.indexOf(f) - y.indexOf(f);
      });
      arr = [...arr, ...arr1.slice(0, 5)];
    }
    if (arr.length > 0) {
      _success(res, 'ok', arr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});
// 删除搜索历史记录
route.post('/del', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr } = req.body;
    await updateData('history', { state: '1' }, `WHERE id IN (${new Array(arr.length).fill('?').join(',')}) AND account=? AND state=?`, [...arr, account, '0'])
    await writelog(req, `删除搜索历史[${arr.join(',')}]`)
    _success(res)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`)
    _err(res)
  }
});

module.exports = route