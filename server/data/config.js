const filepath = '/home/webData';   // 网站数据存放目录
const rootP = '/';                  // 文件管理器根目录
const configObj = {
  port: 3000,
  filepath,
  rootP,
  userFileP: `${filepath}/userFile`,
};
module.exports = configObj;
