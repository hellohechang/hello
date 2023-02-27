*Hello* - 一个简洁的书签收藏导航

### 快捷键
- s: 打开/关闭搜索框
- f: 搜索框焦点
- a: 打开/关闭左侧菜单
- m: 播放器切换
- l: 打开/关闭桌面歌词
- r: 切换播放模式
- space: 播放/暂停
- ctrl + up/down: 音量调节
- ctrl + left/right: 上一曲/下一曲
- delete: 清空搜索框
- c: 关闭播放器
- h: 跳转到你说搜索记录
- n: 跳转到笔记

## 表格 & 文本样式
|样式|语法|示例|
|:--:|--|--|
|加粗|前后 `**` 或  `__`|**加粗1** __加粗2__|
|斜体|前后 `*` 或  `_`|*斜体1* _斜体2_|
|删除线|前后 `~~`|~~删除线~~|
|内联代码|前后 `|`let code = 8`|
|下划线|前 `<u>`  后 `</u>`|<u>下划线</u>|

## 链接
[hello](/)

## 图片
![LOGO](/img/bg.jpg)

## 无序列表

- 项目
  - 项目 1
    - 项目 A
    - 项目 B
  - 项目 2

## 有序列表

1. 项目 1
   1. 项目 A
   2. 项目 B
2. 项目 2

## 任务列表

- [x] A 计划
  - [x] A1 计划
  - [ ] A2 计划
- [ ] B 计划

## 代码块

```javascript
function myShuffle(arr) {
  let leng = arr.length,
    idx,
    flag;
  while (leng) {
    idx = Math.floor(Math.random() * leng--);
    flag = arr[leng];
    arr[leng] = arr[idx]
    arr[idx] = flag
  }
  return arr;
}
```