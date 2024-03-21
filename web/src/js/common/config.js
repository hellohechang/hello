import backWindow from '../utils/backWindow';
import { getPreUrl, nanoid } from '../utils/utils';
export const _speed = 500;
export const LevelObj = {
  upProgressbox: 100, // 上传进度（静）
  rightBox: 101, // 右键菜单（静）
  copyEdit: 102, // 复制编辑（静）
  imgPreview: 102, // 图片预览（动）
  msg: 103, // 通知框（静）
  _progressBar: 104, // 调节器（动）
  popConfirm: 104, // 确认框（动）
  hechang: 105, // 何畅（静）
  loading: 107, // 加载动画（静）
  dianji: 107, // 点击（动）
};
let url = getPreUrl() + '/api';
export const serverURL = url;
export const mediaURL = url + '/getfile';
const searchEngineData = [
  {
    name: 'Bing',
    icon: '/images/searchlogo/bing-xs.png',
    logo: '/images/searchlogo/bing.png', // 图片h / w = 40%
    searchlink: 'https://bing.com/search?q={{}}',
    color: '#1B8473',
  },
  {
    name: 'Google',
    icon: '/images/searchlogo/google-xs.png',
    logo: '/images/searchlogo/google.png',
    searchlink: 'https://www.google.com/search?q={{}}',
    color: '#4285F4',
  },
  {
    name: 'Baidu',
    icon: '/images/searchlogo/baidu-xs.png',
    logo: '/images/searchlogo/baidu.png',
    searchlink: 'https://www.baidu.com/s?wd={{}}',
    color: '#2932E1',
  },
  {
    name: 'DuckDuckGo',
    icon: '/images/searchlogo/duckduckgo-xs.png',
    logo: '/images/searchlogo/duckduckgo.png',
    searchlink: 'https://duckduckgo.com/?q={{}}',
    color: '#EC2027',
  },
  {
    name: 'Yandex',
    icon: '/images/searchlogo/yandex-xs.png',
    logo: '/images/searchlogo/yandex.png',
    searchlink: 'https://yandex.com/search/?text={{}}',
    color: '#FD3D11',
  },
  {
    name: 'Wikipedia',
    icon: '/images/searchlogo/wikipedia-xs.png',
    logo: '/images/searchlogo/wikipedia.png',
    searchlink: 'https://zh.wikipedia.org/wiki/{{}}',
    color: '#000000',
  },
  {
    name: 'Github',
    icon: '/images/searchlogo/github-xs.png',
    logo: '/images/searchlogo/github.png',
    searchlink: 'https://github.com/search?q={{}}',
    color: '#1F1F1F',
  },
  {
    name: 'Youtube',
    icon: '/images/searchlogo/youtube-xs.png',
    logo: '/images/searchlogo/youtube.png',
    searchlink: 'https://www.youtube.com/results?search_query={{}}',
    color: '#FF0000',
  },
  {
    name: 'Bilibili',
    icon: '/images/searchlogo/bilibili-xs.png',
    logo: '/images/searchlogo/bilibili.png',
    searchlink: 'https://search.bilibili.com/all?keyword={{}}',
    color: '#E47494',
  },
  {
    name: 'Yahoo',
    icon: '/images/searchlogo/yahoo-xs.png',
    logo: '/images/searchlogo/yahoo.png',
    searchlink: 'https://search.yahoo.com/search?p={{}}',
    color: '#5F01D1',
  },
  {
    name: 'Sogou',
    icon: '/images/searchlogo/sougou-xs.png',
    logo: '/images/searchlogo/sougou.png',
    searchlink: 'https://www.sogou.com/web?query={{}}',
    color: '#F94E19',
  },
  {
    name: 'Toutiao',
    icon: '/images/searchlogo/toutiao-xs.png',
    logo: '/images/searchlogo/toutiao.png',
    searchlink: 'https://m.toutiao.com/search?keyword={{}}',
    color: '#ED2F28',
  },
  {
    name: 'Weibo',
    icon: '/images/searchlogo/weibo-xs.png',
    logo: '/images/searchlogo/weibo.png',
    searchlink: 'https://s.weibo.com/weibo?q={{}}',
    color: '#E6162D',
  },
  {
    name: 'Zhihu',
    icon: '/images/searchlogo/zhihu-xs.png',
    logo: '/images/searchlogo/zhihu.png',
    searchlink: 'https://www.zhihu.com/search?q={{}}',
    color: '#1087EB',
  },
];
const searchWord = [
  {
    type: 'close',
  },
  {
    type: 'Bing',
    link: 'https://api.bing.com/qsonhs.aspx?type=cb&q={{}}&cb=window.bing.sug',
  },
  {
    type: 'Google',
    link: 'https://suggestqueries.google.com/complete/search?client=youtube&q={{}}&jsonp=window.google.ac.h',
  },
  {
    type: 'Baidu',
    link: 'https://suggestion.baidu.com/su?wd={{}}&cb=window.baidu.sug',
  },
];
let zIdx = 100;
export function setZidx(el, id, close) {
  if (id && close) {
    backWindow.add(id, close);
  }
  zIdx++;
  el.style.zIndex = zIdx;
}
export const _d = {
  translator: 'https://bing.com/translator?text={{}}',
  temid: nanoid(),
  screen: 800,
  searchEngineData,
  searchWord,
  remoteState: false,
  checkColor: 'rgb(26 147 207 / 40%)',
  myTitle: 'Hello',
  todoList: [],
  emptyList: 'List is empty',
  localStorageDefaultData: {
    gentlemanLock: '',
    clockSize: 0.14,
    searchOpenPop: 'n',
    notebigwidth: 'n',
    username: '',
    uname: '',
    showpd: 'n',
    dark: 's',
    dian: 'n',
    sound: 'y',
    pagecolor: 0,
    lastvol: 0.7,
    fonttype: 'default',
    nodeshowpage: 20,
    bmshowpage: 20,
    fileshowpage: 20,
    editNoteFontSize: 0.22,
    editNoteCodeNum: true,
    fileUrl: '/',
    fileSort: { type: 'time', isDes: true },
    fileFontSize: 0.22,
    fileShowGrid: false,
    fileEditCodeNum: true,
    newNote: '',
    historyshowpage: 20,
    searchengine: 0,
    searchWordIdx: 1,
    filterbg: 0,
    lastpx: 'default',
    bgshowpage: 20,
    trashshowpage: 20,
    lastplaysd: ['x1', 1],
    showfy: false,
    lastweizi: {},
    lrcstatu: { size: 0.25, statu: 'left' },
    musicpagenum: 50,
    asidepagesize: 12,
    account: '',
    originurl: '/',
    themeObj: {
      fontsz: 0.22,
    },
  },
};
