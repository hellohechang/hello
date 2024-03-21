const express = require('express'),
  route = express.Router();
const {
  queryData,
  updateData,
  deleteData,
  insertData,
} = require('../utils/sqlite');
const {
  _nologin,
  _err,
  _success,
  nanoid,
  validaString,
  paramErr,
  errLog,
  syncUpdateData,
} = require('../utils/utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
route.get('/list', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let arr = await queryData('todo', '*', `WHERE account=?`, [account]);
    arr.sort((a, b) => {
      return b.time - a.time;
    });
    _success(res, 'ok', arr);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/add', async (req, res) => {
  try {
    const { data } = req.body;
    if (!validaString(data, 1)) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    await insertData('todo', [
      {
        id: nanoid(),
        account,
        data,
        time: Date.now(),
        state: '0',
      },
    ]);
    syncUpdateData(req, 'todolist');
    _success(res, `添加待办事项成功`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/del', async (req, res) => {
  try {
    const { id = '' } = req.query;
    if (!validaString(id, 0, 1)) {
      paramErr(res, req);
      return;
    }
    const account = req._userInfo.account;
    if (id) {
      if (id == 'all') {
        await deleteData('todo', `WHERE account=?`, [account]);
      } else {
        await deleteData('todo', `WHERE id=?`, [id]);
      }
    } else {
      await deleteData('todo', `WHERE account=? AND state=?`, [account, '1']);
    }
    syncUpdateData(req, 'todolist');
    _success(res, `操作成功`);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.get('/state', async (req, res) => {
  try {
    const { id, flag = '' } = req.query;
    if (!validaString(id, 1, 1) || !validaString(flag)) {
      paramErr(res, req);
      return;
    }
    let obj = {};
    if (flag) {
      obj = {
        state: '0',
        time: Date.now(),
      };
    } else {
      obj = { state: '1' };
    }
    await updateData('todo', obj, `WHERE id=?`, [id]);
    syncUpdateData(req, 'todolist');
    _success(res, flag ? '标记为未完成' : '标记为已完成');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/edit', async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!validaString(id, 1, 1) || !validaString(data, 1)) {
      paramErr(res, req);
      return;
    }
    await updateData('todo', { data, time: Date.now() }, `WHERE id=?`, [id]);
    syncUpdateData(req, 'todolist');
    _success(res, '操作成功');
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
