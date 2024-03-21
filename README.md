```
mkdir -p /home/node/hello
```
```
git clone https://github.com/hellohechang/hello.git /home/node/hello
```
```
cd /home/node/hello/server
```
```
npm i
```
```
cd ../web
```
```
npm i
```
```
npm run build
```
```
cd ../server
```
```
vim data/config.js
```
```
const filepath = '/home/webData';   // 网站数据存放目录
const rootP = '/';                  // 文件管理根目录
const configObj = {
  port: 3000,
  filepath,
  rootP,
  userFileP: `${filepath}/userFile`,
};
module.exports = configObj;
```
```
node app
```