const express = require('express');
const fs = require('fs');
const {
  errLog,
  _err,
  validaString,
  paramErr,
  _readFile,
  _success,
  _mkdir,
  _writeFile,
  _delDir,
} = require('../utils/utils');
const configObj = require('../data/config');
const route = express.Router();
route.get('/', async (req, res) => {
  try {
    const { k } = req.query;
    if (!validaString(k, 1, 1)) {
      paramErr(res, req);
      return;
    }
    let note = '';
    const p = `${configObj.filepath}/notepad/${k}.md`;
    if (fs.existsSync(p)) {
      note = (await _readFile(p)).toString();
    }
    _success(res, 'ok', note);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});
route.post('/', async (req, res) => {
  try {
    const { k, data = '' } = req.body;
    if (!validaString(k, 1, 1) || !validaString(data)) {
      paramErr(res, req);
      return;
    }
    const p = `${configObj.filepath}/notepad/${k}.md`;
    if (data) {
      if (!fs.existsSync(p)) {
        await _mkdir(`${configObj.filepath}/notepad`);
      }
      await _writeFile(p, data);
    } else {
      if (fs.existsSync(p)) {
        await _delDir(p).catch(() => {});
      }
    }
    _success(res);
  } catch (error) {
    await errLog(req, error);
    _err(res);
  }
});

module.exports = route;
