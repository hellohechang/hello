//目录同步
let fs = require('fs')
//过滤目录文件配置
let filterObj = { f: [], d: [] }
// 处理过滤
function hdFilterFile(dirPath, filterFile) {
  let d = [],//过滤目录
    f = [];//过滤文件
  filterFile.forEach(item => {
    let { path, file = [] } = item;
    if (file.length === 0) {
      d.push(`${dirPath}${path}`)
    } else {
      file.forEach(v => {
        f.push(`${dirPath}${path}/${v}`)
      })
    }
  });
  return { f, d }
}
// 递归获取目录中所有文件信息
function getAllFile(dirPath) {
  let arr = [],
    { f, d } = filterObj;//过滤对象
  (function next(dirPath) {
    fs.readdirSync(dirPath).forEach(item => {
      let fpath = `${dirPath}/${item}`,
        s = fs.statSync(fpath);
      if (s.isDirectory()) {
        if (!d.includes(fpath)) {
          next(fpath)
        }
      } else {
        if (!f.includes(fpath)) {
          arr.push({
            name: item,
            path: dirPath,
            size: s.size
          })
        }
      }
    })
  })(dirPath)

  return arr.map(item => {
    return { ...item, path: item.path.replace(dirPath, '') }
  })
}
// 获取当前目录下的文件和目录
function getDirObj(dirPath) {
  let fileArr = [],
    DirArr = [],
    { f, d } = filterObj;
  fs.readdirSync(dirPath).forEach((item) => {
    let fpath = `${dirPath}/${item}`,
      s = fs.statSync(fpath);
    if (s.isDirectory()) {
      if (!d.includes(fpath)) {
        DirArr.push(item)
      }
    } else {
      if (!f.includes(fpath)) {
        fileArr.push(item)
      }
    }
  })
  return {
    fileArr,
    DirArr
  }
}
// 删除目录
function _delDir(p) {
  if (fs.existsSync(p)) {
    fs.readdirSync(p).forEach((v) => {
      let path = `${p}/${v}`,
        stats = fs.statSync(path);
      if (stats.isFile()) {
        fs.unlinkSync(path)
      } else {
        _delDir(path)
      }
    })
    fs.rmdirSync(p)
  }
}
// 记录执行信息
function wlog(str) {
  str = str + '';
  if (str.trim() === '') return;
  console.log(str);
  fs.appendFileSync('./hello.log', `${str}\n`)
}
// 清除多出文件和目录
function clear(from, to) {
  ~function _remove(from, to) {
    // 读取目录中文件和目录
    let aobj = getDirObj(from)
    let bobj = getDirObj(to)
    //遍历删除多出文件
    bobj.fileArr.forEach(item => {
      if (!aobj.fileArr.some(y => y == item)) {
        fs.unlinkSync(`${to}/${item}`)
        wlog(`删除文件 ${to}/${item}`)
      }
    })
    //遍历删除多出的目录
    bobj.DirArr.forEach(item => {
      if (!aobj.DirArr.some(y => y == item)) {
        _delDir(`${to}/${item}`)
        wlog(`删除目录 ${to}/${item}`)
      }
    })
    // 继续使用相同方法操作剩下的目录
    aobj.DirArr.forEach(item => {
      if (!fs.existsSync(`${to}/${item}`)) {
        fs.mkdirSync(`${to}/${item}`, { recursive: true })//空目录处理
      }
      _remove(`${from}/${item}`, `${to}/${item}`)
    })
  }(from, to);
}

// 执行目录文件同步
function sync(obj) {
  try {
    let { from, to, filter = [] } = obj;
    // 禁止同步到被同步的目录或目录下
    if (from === to.slice(0, from.length)) {
      wlog('SB')
      return
    }

    // 生成过滤配置
    filterObj = hdFilterFile(from, filter)

    // 创建to目录
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true })
    }

    // 获取from和to目录所有文件信息
    let fromAllFile = getAllFile(from),
      toAllFile = getAllFile(to);

    //记录已存在被移动文件移动到的目录，方便复用，下次有相同文件直接内部复制文件
    let flagArr = [];

    wlog(`开始同步[${from}=>${to}](${fromAllFile.length})`)
    // 遍历from下所有文件
    fromAllFile.forEach(item => {
      //查找to是否有相同文件
      let sameArr = toAllFile.filter(y => y.name == item.name && y.size == item.size);

      // 没有相同文件
      if (sameArr.length === 0) {
        //创建目录
        fs.mkdirSync(`${to}${item.path}`, { recursive: true })

        // 再次在已经被移动到新目录的文件中查找是否有相同文件，有则复制，没有则在from目录中复制文件
        if (flagArr.find(y => y.name == item.name && y.size == item.size)) {
          fs.copyFileSync(`${to}${f.path}/${item.name}`, `${to}${item.path}/${item.name}`);//复制文件
          wlog(`复制文件 ${to}${item.path}/${item.name}`)
        } else {
          fs.copyFileSync(`${from}${item.path}/${item.name}`, `${to}${item.path}/${item.name}`);//复制文件
          wlog(`新增文件 ${to}${item.path}/${item.name}`)
        }

        // 已经有相同文件
      } else {
        //已经有相同文件，但是在不同目录
        if (!sameArr.some(v => v.path == item.path)) {
          //创建目录
          fs.mkdirSync(`${to}${item.path}`, { recursive: true })

          //把已有的文件移动到指定目录
          fs.renameSync(`${to}${sameArr[0].path}/${item.name}`, `${to}${item.path}/${item.name}`);

          //记录文件移动到的目录，下一次还有相同文件，则在此目录下复制文件
          flagArr.push({
            name: sameArr[0].name,
            size: sameArr[0].size,
            path: item.path
          })

          //在在同步文件数组中清除已被移动的文件
          toAllFile = toAllFile.filter(v => !(v.name == sameArr[0].name && v.path == sameArr[0].path && v.size == sameArr[0].size));
          wlog(`移动文件 ${to}${item.path}/${item.name}`)
        }
      }
    });
    // 清除多出文件和目录
    clear(from, to)
    wlog(`同步完毕[${from}=>${to}]`)
  } catch (error) {
    wlog(error)
  }
}
// sync({
//     from: 'xxx',
//     to: 'xxx',
//     filter: [
//         {
//             path: '/xxx/xxx',
//             file: ['xxx', 'xxx']
//         }
//     ]
// })
module.exports = sync;