import $ from 'jquery';
import md5 from 'md5';
import '../../css/common/reset.css';
import '../../css/common/animate.css';
import '../../js/common/common.js';
import './pwa.js';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import imgMrLogo from '../../images/img/mrlogo.png';
import imgBgSvg from '../../images/img/bg.svg';
import imgTianjia from '../../images/img/tianjia.png';
import imgWave from '../../images/img/wave.gif';
import imgHistory from '../../images/img/history.jpg';
import imgMusic from '../../images/img/music.jpg';
import imgGqImg from '../../images/img/gqimg.png';
import imgVoice from '../../images/img/voice.mp3';
import loadSvg from '../../images/img/loading.svg';
import loadfailImg from '../../images/img/loadfail.png';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _delData,
  _setTimeout,
  getSuffix,
  throttle,
  debounce,
  playSound,
  getSelectText,
  _getTarget,
  fileSlice,
  myShuffle,
  imgjz,
  isurl,
  isios,
  arrSortMinToMax,
  mixedSort,
  _mySlide,
  _postAjax,
  _getAjax,
  _upFile,
  formatDate,
  copyText,
  computeSize,
  encodeHtml,
  _imgSize,
  deepClone,
  _position,
  _progressBar,
  isImgFile,
  fileLogoType,
  downloadFile,
  imgPreview,
  unique,
  toLogin,
  sendNotification,
  isMusicFile,
  getPhrase,
  darkMode,
  ContentScroll,
  formatNum,
  myDrag,
  toCenter,
  toHide,
  myResize,
  getScreenSize,
  myToMax,
  myToRest,
  toSetSize,
  getPreUrl,
  showQcode,
  getMinIndex,
  loadingImg,
  isFullScreen,
  wrapInput,
  percentToValue,
  upStr,
  getbookmark,
  downloadText,
  hdTextMsg,
  creatSelect,
  inputPageNo,
  formartSongTime,
  longPress,
  isMobile,
  hdTitleHighlight,
  getTextImg,
  hdOnce,
  getFiles,
  isBigScreen,
  isVideoFile,
  getIn,
  getPathFilename,
  getFilePath,
  nanoid,
  getWordCount,
  createShare,
  _getDataTem,
  _setDataTem,
  hdPath,
  isInteger,
  _delDataTem,
  LazyLoad,
} from '../../js/utils/utils.js';
import { _speed, _d, setZidx } from '../../js/common/config';
import pagination from '../../js/plugins/pagination';
import { inpMenu, rightMenu, selectMenu } from '../../js/plugins/rightMenu';
import { UpProgress } from '../../js/plugins/UpProgress';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import realtime from '../../js/plugins/realtime';
import backWindow from '../../js/utils/backWindow.js';
import loadingPage from '../../js/plugins/loading/index.js';
import record from '../../js/utils/recorder.js';
const $pageBg = $('.page_bg'),
  $minimizeBox = $('.minimize_box'),
  $asideBtn = $('.aside_btn'),
  $asideWrap = $('.aside_wrap'),
  $aside = $asideWrap.find('.aside'),
  $searchBoxMask = $('.search_box_mask'),
  $searchLogo = $searchBoxMask.find('.search_logo'),
  $searchInpWrap = $searchBoxMask.find('.search_inp_wrap'),
  $homeBmWrap = $searchBoxMask.find('.home_bm_wrap'),
  $homeFootMenu = $searchBoxMask.find('.home_foot_menu'),
  $myAudio = $(new Audio()),
  $miniPlayer = $('.mini_player'),
  $miniLrcWrap = $('.mini_lrc_wrap'),
  $musicPlayerBox = $('.music_player_box'),
  $musicFootProgress = $musicPlayerBox.find('.music_foot_progress'),
  $searchMusicWrap = $musicPlayerBox.find('.search_music_wrap'),
  $musicPlayerBg = $musicPlayerBox.find('.music_palyer_bg'),
  $playingListWrap = $musicPlayerBox.find('.playing_list_mask'),
  $pMusicListBox = $playingListWrap.find('.p_music_list_wrap'),
  $musicHeadWrap = $musicPlayerBox.find('.head_wrap'),
  $msuicContentBox = $musicPlayerBox.find('.content_box'),
  $songListWrap = $musicPlayerBox.find('.song_list_wrap'),
  $songListUl = $songListWrap.find('ul'),
  $listItemsWarp = $musicPlayerBox.find('.list_items_wrap'),
  $songItemsBox = $listItemsWarp.find('.items_box'),
  $musicFootBox = $musicPlayerBox.find('.music_foot_box'),
  $playingSongLogo = $musicFootBox.find('.logo_img'),
  $musicLrcWrap = $musicPlayerBox.find('.music_lrc_wrap'),
  $lrcBg = $musicLrcWrap.find('.lrc_bg'),
  $lrcHead = $musicLrcWrap.find('.lrc_head'),
  $lrcListWrap = $musicLrcWrap.find('.lrc_list_wrap'),
  $lrcMenuWrap = $musicLrcWrap.find('.lrc_menu_wrap'),
  $lrcFootWrap = $musicLrcWrap.find('.lrc_foot_wrap'),
  $lrcProgressBar = $lrcFootWrap.find('.progress_bar'),
  $lrcFootBtnWrap = $lrcFootWrap.find('.foot_btn_wrap'),
  $editLrcWrap = $('.edit_lrc_wrap'),
  $musicMvWrap = $('.music_mv_wrap'),
  $myVideo = $musicMvWrap.find('.my_video'),
  $userLogoBtn = $('.user_logo_btn'),
  $rightMenuMask = $('.right_menu_mask'),
  $rightBox = $rightMenuMask.find('.right_box'),
  $userInfoWrap = $('.user_info_wrap'),
  $chatAudio = $('.chat_ausio'),
  $chatRoomWrap = $('.chat_room_wrap'),
  $userListBox = $chatRoomWrap.find('.user_list_box'),
  $chatHeadBtns = $chatRoomWrap.find('.c_head_btns'),
  $chatListBox = $chatRoomWrap.find('.chat_list_box'),
  $chatFootBox = $chatRoomWrap.find('.chat_foot_box'),
  $showChatRoomBtn = $('.show_chat_room_btn'),
  $randomChangeBgBtn = $('.random_change_bg_btn'),
  $allBgWrap = $('.all_bg_wrap'),
  $bgList = $allBgWrap.find('.bg_list'),
  $bgFooter = $allBgWrap.find('.bg_footer'),
  $searchBoxBtn = $('.search_box_btn'),
  $mainid = $('#main'),
  $clock = $('.clock'),
  $todoBox = $('.todo_box'),
  $theadBtns = $todoBox.find('.t_head_btns'),
  $todoList = $todoBox.find('.todo_list'),
  $weatherBox = $('.weather_box');
$myAudio[0].preload = 'none';
_d.isHome = true;
let $document = $(document),
  dmwidth = $document.width(),
  curSearchIdx = _getData('searchengine'),
  searchWordIdx = _getData('searchWordIdx'),
  curFilterBg = _getData('filterbg'),
  curBgPageSize = _getData('bgshowpage'),
  curPlaySpeed = _getData('lastplaysd'),
  lrcstatu = _getData('lrcstatu'),
  clockSize = _getData('clockSize'),
  curPlayVol = _getData('lastvol'),
  musicPageSize = _getData('musicpagenum'),
  asidePageSize = _getData('asidepagesize'),
  curSongListSort = _getData('lastpx'),
  boxpositon = _getData('lastweizi'),
  curPageColor = _getData('pagecolor'),
  curFontType = _getData('fonttype'),
  gentlemanLock = _getData('gentlemanLock'),
  dark = _getData('dark');
if (!_getData('account')) {
  toLogin();
} else {
  // 君子锁
  ~(function getGentlemanLock() {
    if (gentlemanLock) {
      const pd = _getDataTem('gentlemanLock') || prompt('请输入君子锁密码：');
      if (pd !== gentlemanLock) {
        getGentlemanLock();
      } else {
        _setDataTem('gentlemanLock', pd);
      }
    }
  })();
}
function renderPhrase() {
  getPhrase()
    .then((res) => {
      let { from, hitokoto } = res,
        str = `<div class="phrase">${encodeHtml(hitokoto || 'xxx')}</div>
          <div class="phrase_from">— 「 ${encodeHtml(from || 'xxx')} 」</div>`;
      $weatherBox.html(str).stop().fadeIn(_speed);
    })
    .catch(() => {
      $weatherBox.stop().fadeOut(_speed);
    });
}
$weatherBox.on('click', function (e) {
  let data = [
    { id: 1, text: '复制', beforeIcon: 'iconfont icon-fuzhi' },
    { id: 2, text: '刷新', beforeIcon: 'iconfont icon-suijibofang' },
  ];
  selectMenu(
    e,
    data,
    ({ close, id }) => {
      if (id == 1) {
        copyText($weatherBox.text());
        close();
      } else if (id == 2) {
        renderPhrase();
        close();
      }
    },
    '一言'
  );
});
~(function () {
  // 动画
  let _head = document.querySelectorAll('head')[0],
    _style = document.createElement('style');
  _style.type = 'text/css';
  _head.appendChild(_style);
  const clock = document.querySelector('.clock');
  const domHour = clock.querySelector('.hour');
  const domMin = clock.querySelector('.min');
  const domSec = clock.querySelector('.sec');
  function clockRun(sec, min, hour) {
    if (domHour.animate) {
      domHour.animate(
        { transform: [`rotate(${hour}deg`, `rotate(${hour + 360}deg`] },
        { duration: 216000 * 1000, iterations: Infinity }
      );
      domMin.animate(
        { transform: [`rotate(${min}deg`, `rotate(${min + 360}deg`] },
        { duration: 3600 * 1000, iterations: Infinity }
      );
      domSec.animate(
        { transform: [`rotate(${sec}deg`, `rotate(${sec + 360}deg`] },
        { duration: 60 * 1000, iterations: Infinity }
      );
      return;
    }
    let arr = [];
    new Array(3).fill(null).forEach(() => {
      arr.push('a' + Math.random().toString(36).slice(2));
    });
    let str = '';
    // 遍历三个参数
    [].forEach.call(arguments, (item, index) => {
      str += `@keyframes ${arr[index]}{
            0%{
                transform: rotate(${item}deg);
            }
            100%{
                transform: rotate(${item + 360}deg);
            }
        }`;
    });
    _style.innerHTML = str;
    domHour.style.animation = `${arr[2]} 216000s infinite linear`;
    domMin.style.animation = `${arr[1]} 3600s infinite linear`;
    domSec.style.animation = `${arr[0]} 60s infinite linear`;
  }
  // 刻度
  function drawLines(className, total, translateX) {
    const gap = 360 / total;
    let strHtml = '';
    for (let i = 0; i < total; i++) {
      strHtml += `<li style="transform:rotate(${
        i * gap
      }deg) translate(${translateX}px,-50%);"></li>`;
    }
    const wrap = document.querySelector(className);
    wrap.innerHTML = strHtml;
  }
  // 数字
  function drawNumbers(className) {
    const wrap = document.querySelector(className),
      radius = wrap.clientWidth / 2;

    let strHtml = '';
    for (let i = 1; i <= 12; i++) {
      const myAngle = ((i - 3) / 6) * Math.PI,
        myX = radius + radius * Math.cos(myAngle),
        myY = radius + radius * Math.sin(myAngle);
      strHtml += `<li style="left:${myX}px; top:${myY}px">${i}</li>`;
    }
    wrap.innerHTML = strHtml;
  }
  // 指针旋转
  function clockMove() {
    const now = new Date(),
      hour = now.getHours(),
      min = now.getMinutes(),
      sec = now.getSeconds(),
      secAngle = sec * 6 - 90,
      minAngle = min * 6 + sec * 0.1 - 90,
      hourAngle = hour * 30 + min * 0.5 - 90;
    clockRun(secAngle, minAngle, hourAngle);
  }
  function clockinit() {
    drawLines('.line-min', 60, 90);
    drawLines('.line-hour', 12, 85);
    drawNumbers('.number');
  }
  clockinit();
  clockMove();
  clock.addEventListener('click', function (e) {
    clockMove();
    if (e.target.tagName.toLowerCase() == 'i') {
      _progressBar(e, clockSize, (percent) => {
        $clock.css('transform', `scale(${percentToValue(0.5, 4, percent)})`);
        clockSize = percent;
        _setData('clockSize', clockSize);
      });
    }
  });
})();
$clock.css('transform', `scale(${percentToValue(0.5, 4, clockSize)})`);
// 关闭页面加载
let closeLoading = (function () {
  return function () {
    loadingPage.end();
    $searchBoxBtn.stop().show(_speed, () => {
      _msg.info(`Welcome ${_d.userInfo.username}`);
      _getAjax('/chat/getnews', { a: 3 }, { parallel: 1 })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            $showChatRoomBtn.attr(
              'class',
              'show_chat_room_btn iconfont icon-liaotian'
            );
          } else {
            $showChatRoomBtn.attr(
              'class',
              'show_chat_room_btn run iconfont icon-xiaoxi'
            );
            _msg.warning(`您有新的消息，请注意查收`, (type) => {
              if (type == 'click') {
                showChatRoom();
              }
            });
          }
        })
        .catch((err) => {});
      _getAjax('/todo/list').then((res) => {
        if (res.code == 0) {
          _d.todoList = res.data;
          todoMsg();
        }
      });
    });
    $pageBg.removeClass('sce');
    renderPhrase();
  };
})();
function todoMsg() {
  let arr = _d.todoList.filter((item) => item.state == '0');
  if (arr.length == 0) return;
  _msg.warning(`您有 ${arr.length} 条未完成事项`, (type) => {
    if (type == 'click') {
      showTodoBox();
    }
  });
}
function todoLoading() {
  let str = '';
  new Array(30).fill(null).forEach(() => {
    let w = Math.round(Math.random() * (90 - 20) + 20);
    str += `<p style="pointer-events: none;background-color:var(--color9);height:30px;width:100%;margin:10px 0;"></p>
            ${
              w % 2 === 0
                ? '<p style="pointer-events: none;background-color:var(--color9);height:30px;width:100%;margin:10px 0;"></p>'
                : ''
            }
            <p style="pointer-events: none;background-color:var(--color9);height:30px;width:${w}%;margin:10px 0;"></p>
      `;
  });
  $todoList.html(str).scrollTop(0);
}
function renderTodoList() {
  if ($todoList.children().length == 0) {
    todoLoading();
  }
  _getAjax('/todo/list').then((res) => {
    if (res.code == 0) {
      _d.todoList = res.data;
      todoNum = 0;
      rTodoList();
    }
  });
}
function rTodoList() {
  if ($todoBox.is(':hidden')) return;
  let str = `<div style="padding-bottom: 10px;">
    <button cursor class="add_btn btn btn_primary">添加</button>${
      _d.todoList.some((item) => item.state == '1')
        ? '<button cursor class="clear_btn btn btn_danger">清除已完成</button>'
        : ''
    }
    ${
      _d.todoList.length > 0
        ? '<button cursor class="clear_all_btn btn btn_danger">清空</button>'
        : ''
    }
        </div>`;
  if (_d.todoList.length == 0) {
    str += `<p style="padding: 20px 0;pointer-events: none;text-align: center;">暂无待办事项</p>`;
    $todoList.html(str);
    return;
  }
  _d.todoList.sort((a, b) => a.state - b.state);
  _d.todoList.forEach((item) => {
    let { id, data, state, time } = item;
    str += `<ul data-id="${id}">
          <li cursor class="todo_state iconfont ${
            state == '0' ? 'icon-xuanzeweixuanze' : 'icon-xuanzeyixuanze'
          }"></li>
          <li class="todo_text">
            <div class="text ${state == '0' ? '' : 'del'}">${hdTextMsg(
      data
    )}</div>
            <div class="time">updated ${formatDate({
              template: '{0}-{1}-{2} {3}:{4}',
              timestamp: time,
            })}</div>
          </li>
          <li cursor class="set_btn iconfont icon-icon"></li>
        </ul>`;
  });
  $todoList.html(str);
}
function getTodoList(id) {
  return _d.todoList.find((item) => item.id == id);
}
function closeTodoBox() {
  toHide(
    $todoBox[0],
    {
      to: 'bottom',
      scale: 'small',
    },
    () => {
      backWindow.remove('todo');
      $todoList.html('');
    }
  );
}
$theadBtns.on('click', '.t_close_btn', closeTodoBox);
function addTodo(e) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        text: {
          type: 'textarea',
          placeholder: '待办内容',
          verify(val) {
            if (val.trim() == '') {
              return '请输入待办内容';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let va = inp.text;
        _postAjax('/todo/add', { data: va })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              _msg.success(result.codeText);
              renderTodoList();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '新增待办事项'
  );
}
function delTodo(e, id, cb) {
  let opt = {
      e,
      text: '确认清除已完成事项？',
      confirm: { type: 'danger', text: '清除' },
    },
    param = {};
  if (id) {
    param = { id };
    if (id == 'all') {
      opt = {
        e,
        text: '确认清空事项？',
        confirm: { type: 'danger', text: '清空' },
      };
    } else {
      opt = {
        e,
        text: '确认删除？',
        confirm: { type: 'danger', text: '删除' },
      };
    }
  }
  _pop(opt, (type) => {
    if (type == 'confirm') {
      _getAjax('/todo/del', param)
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _msg.success(result.codeText);
            renderTodoList();
            cb && cb();
            return;
          }
        })
        .catch((err) => {});
    }
  });
}
function editTodo(e, todo) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        text: {
          type: 'textarea',
          placeholder: '待办内容',
          value: todo.data,
          verify(val) {
            if (val.trim() == '') {
              return '请输入待办内容';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let va = inp.text;
        if (va == todo.data) return;
        _postAjax('/todo/edit', { id: todo.id, data: va })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close(true);
              _msg.success(result.codeText);
              renderTodoList();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '编辑待办事项'
  );
}
$todoList
  .on('click', '.add_btn', function (e) {
    addTodo(e);
  })
  .on('click', '.clear_btn', function (e) {
    delTodo(e);
  })
  .on('click', '.clear_all_btn', function (e) {
    delTodo(e, 'all');
  })
  .on('click', '.set_btn', function (e) {
    const todo = getTodoList($(this).parent().attr('data-id'));
    let data = [
      {
        id: 'copy',
        text: '复制',
        beforeIcon: 'iconfont icon-fuzhi',
      },
    ];
    if (todo.state == 0) {
      data.push({
        id: 'edit',
        text: '编辑',
        beforeIcon: 'iconfont icon-bianji',
      });
    }
    data.push({
      id: 'del',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    });
    selectMenu(
      e,
      data,
      function ({ e, close, id }) {
        if (id == 'edit') {
          editTodo(e, todo);
        } else if (id == 'del') {
          delTodo(e, todo.id, () => {
            close();
          });
        } else if (id == 'copy') {
          copyText(todo.data);
          close();
        }
      },
      todo.data
    );
  })
  .on(
    'click',
    '.todo_state',
    debounce(
      function () {
        changeTodoState($(this).parent().attr('data-id'));
      },
      1000,
      true
    )
  );
function changeTodoState(id) {
  const todo = getTodoList(id);
  let obj = { id: todo.id };
  if (todo.state == '1') {
    obj.flag = 'y';
  }
  _getAjax('/todo/state', obj)
    .then((res) => {
      if (res.code == 0) {
        _msg.success(res.codeText);
        renderTodoList();
      }
    })
    .catch((err) => {});
}
// 拖动移动列表位置
~(function () {
  let fromDom = null;
  $aside
    .find('.list')
    .on('dragstart', '.bm_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.bm_item', function (e) {
      let $this = $(this),
        $fromDom = $(fromDom),
        pid = $this.parent().prev().attr('data-id'),
        fromId = $fromDom.attr('data-id'),
        toId = $this.attr('data-id');
      if (fromDom) {
        if (fromId != toId) {
          dragMoveBookmark(pid, fromId, toId);
        }
        fromDom = null;
      }
    })
    .on('dragover', '.bm_item', function (e) {
      e.preventDefault();
    });
})();
function bmListMove(fromId, toId) {
  _postAjax('/bmk/listmove', { fromId, toId })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        renderAsideList();
        return;
      }
    })
    .catch((err) => {});
}
// 拖动移动书签位置
~(function () {
  let fromDom = null;
  $aside
    .find('.list')
    .on('dragstart', '.list_title', function (e) {
      fromDom = this;
    })
    .on('drop', '.list_title', function (e) {
      let $this = $(this),
        fromId = $(fromDom).attr('data-id'),
        toId = $this.attr('data-id');
      if (fromDom) {
        if (fromId !== toId) {
          bmListMove(fromId, toId);
        }
        fromDom = null;
      }
    })
    .on('dragover', '.list_title', function (e) {
      e.preventDefault();
    });
})();
// 渲染左导航
$asideBtn.activeId = 'hide'; //记录开启列表
function renderAsideList(p) {
  if ($asideWrap.is(':hidden')) return;
  let id = $asideBtn.activeId;
  _getAjax('/bmk/getlist', { id })
    .then((result) => {
      if (result.code === 0) {
        _d.bookmark = result.data;
        if (!$asideBtn.activeId) {
          if (_d.bookmark.side.length > 0) {
            $asideBtn.activeId = _d.bookmark.side[0].id;
          }
        }
        rAsideList(p);
      }
    })
    .catch((err) => {});
}
let asidePageNum = 1;
let bmState = true;
function showCheckBtn() {
  const $fMenu = $aside.find('.foot_menu');
  if (bmState) {
    $fMenu.removeClass('liststate');
  } else {
    $fMenu.addClass('liststate');
  }
}
function rAsideList(p) {
  if ($asideWrap.is(':hidden')) return;
  $aside.find('.foot_menu').stop().slideUp(_speed).find('div').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
  let id = $asideBtn.activeId,
    _nav = _d.bookmark.side,
    str = '';
  _nav.forEach((item) => {
    let name = encodeHtml(item.name);
    if (item.id === id) {
      str += `<div class="list_title jzxz" data-id="${
        item.id
      }" flag="on" draggable="true">
      <div cursor check="n" class="check_bmlist"></div>
      <i cursor class="iconfont ${
        item.share == 'y' ? 'icon-24gl-unlock4' : 'icon-24gl-unlock2 active'
      }"></i>
        <em cursor>${name}</em>
        </div>
        <ul style="display:'block'">`;
      let pageTotal = Math.ceil(item.item.length / asidePageSize);
      asidePageNum < 1
        ? (asidePageNum = pageTotal)
        : asidePageNum > pageTotal
        ? (asidePageNum = 1)
        : null;
      item.item
        .slice((asidePageNum - 1) * asidePageSize, asidePageNum * asidePageSize)
        .forEach((y) => {
          let name = encodeHtml(y.name);
          let des = y.des ? encodeHtml(y.des) : '';
          str += `<li title="${name}\n${encodeHtml(
            y.link
          )}\n${des}" class="bm_item jzxz" data-id="${
            y.id
          }" cursor draggable="true">
          <div cursor check="n" class="check_bm"></div>
          <div class="bm_logo"></div>
          <div class="bm_name">${name}</div>
          <p>${des || '描述'}</p>
          </li>`;
        });
      if (pageTotal > 1) {
        str += `<div style="padding:20px 0;text-align:center;float: left;line-height: 26px;
          width: 100%;" class="bm_list_paging jzxz">
          <span class="prev_page iconfont icon-prev" cursor></span>
          <span cursor class="input_num" style="margin:0 30px">${asidePageNum}/${pageTotal}</span>
          <span class="next_page iconfont icon-page-next" cursor></span>
          <span class="aside_page_size" cursor style="margin-left:30px">${asidePageSize}/页</span>
          </div>`;
      }
      str += '</ul>';
    } else {
      str += `<div data-id="${
        item.id
      }" flag="off" draggable="true" class="list_title jzxz">
      <div cursor check="n" class="check_bmlist"></div>
      <i cursor class="iconfont ${
        item.share == 'y' ? 'icon-24gl-unlock4' : 'icon-24gl-unlock2 active'
      }"></i>
      <em cursor>${name}</em></div>
      <ul style="display:'none'"></ul>`;
    }
  });
  str += `<div cursor title="添加分组" class="add_list_btn iconfont icon-jiajian1"></div>`;
  const $aList = $aside.find('.list');
  $aList.html(str);
  if (p) {
    let curIdx = _d.bookmark.side.findIndex(
      (item) => item.id == $asideBtn.activeId
    );
    if (curIdx >= 0) {
      const $listTitle = $aList.find('.list_title').eq(curIdx);
      $aList.stop().animate(
        {
          scrollTop: _position($listTitle[0]).top + $aList[0].scrollTop - 5,
        },
        _speed
      );
    }
  }
  hdAsideListItemLogo();
}
const asideLoadImg = new LazyLoad();
//处理侧边书签logo
function hdAsideListItemLogo() {
  if ($asideBtn.activeId === 'hide') return;
  asideLoadImg.bind($aside[0].querySelectorAll('.bm_item'), (item) => {
    let $item = $(item);
    let { logo, link } = getBmItemData(
      $asideBtn.activeId,
      $item.attr('data-id')
    );
    if (logo) {
      logo = hdPath(`/api/${logo}`);
    } else {
      logo = `/api/getfavicon?u=${encodeURIComponent(link)}`;
    }
    let $bm_logo = $item.find('.bm_logo');
    imgjz(
      logo,
      () => {
        $bm_logo.css('background-image', `url(${logo})`).addClass('load');
      },
      () => {
        $bm_logo.css('background-image', `url(${imgMrLogo})`).addClass('load');
      }
    );
  });
}

//侧边导航缩放
function getBmListTitleData(id) {
  return _d.bookmark.side.find((item) => item.id === id);
}
function getBmItemData(pid, id) {
  let p = _d.bookmark.side.find((item) => item.id === pid);
  return p.item.find((item) => item.id == id);
}
function getAsideCheckBmItem() {
  let $bmItem = $aside.find('.bm_item'),
    $checkArr = $bmItem.filter(
      (_, item) => $(item).find('.check_bm').attr('check') === 'y'
    );
  let arr = [];
  $checkArr.each((_, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  return arr;
}
function getAsideCheckBmList() {
  let $bmItem = $aside.find('.list_title'),
    $checkArr = $bmItem.filter(
      (_, item) => $(item).find('.check_bmlist').attr('check') === 'y'
    );
  let arr = [];
  $checkArr.each((_, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  return arr;
}
function addBmList(e) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        text: {
          placeholder: '标题',
          verify(val) {
            if (val.trim() == '') {
              return '请输入标题';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let va = inp.text;
        _postAjax('/bmk/addlist', { name: va })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              _msg.success(result.codeText);
              renderAsideList();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '添加书签分组'
  );
}
function delBm(e, arr, cb, text) {
  _pop(
    {
      e,
      text: `确认删除${text ? `：${text}` : ''}？`,
      confirm: { type: 'danger', text: '删除' },
    },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/bmk/delbmk', { arr })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              _msg.success(result.codeText);
              cb && cb();
              renderAsideList();
              renderHomebook();
            }
          })
          .catch((err) => {});
      }
    }
  );
}
$asideWrap
  .on(
    'click',
    '.list_title em',
    debounce(
      function () {
        let $this = $(this).parent(),
          id = $this.attr('data-id');
        $asideBtn.activeId = id;
        if ($this.attr('flag') === 'on') {
          $this.next().css('display', 'none').html('');
          $asideBtn.activeId = 'hide';
          $this.attr('flag', 'off');
          return;
        }
        $this.next().css('display', 'block');
        loadingImg($this.next()[0]);
        asidePageNum = 1;
        renderAsideList(1);
      },
      500,
      true
    )
  )
  .on('click', '.list_title i', function (e) {
    let $this = $(this).parent();
    asideBmMenu(
      e,
      getBmListTitleData($this.attr('data-id')),
      $this.find('.check_bmlist')[0]
    );
  })
  .on('click', '.prev_page', function () {
    asidePageNum--;
    rAsideList(1);
  })
  .on('click', '.next_page', function () {
    asidePageNum++;
    rAsideList(1);
  })
  .on('click', '.input_num', function (e) {
    inputPageNo(e, { value: asidePageNum }, (val) => {
      asidePageNum = val;
      rAsideList(1);
    });
  })
  .on('click', '.aside_page_size', function (e) {
    creatSelect(
      e,
      { data: [12, 24], active: asidePageSize },
      ({ value, close }) => {
        close();
        asidePageSize = value;
        _setData('asidepagesize', asidePageSize);
        asidePageNum = 1;
        rAsideList(1);
      }
    );
  })
  .on('click', '.bm_item', function (e) {
    let { link } = getBmItemData($asideBtn.activeId, $(this).attr('data-id'));
    myOpen(link, '_blank');
  })
  .on('click', '.add_list_btn', (e) => {
    // 新建列表
    addBmList(e);
  })
  .on('contextmenu', '.list_title', function (e) {
    //操作列表
    e.preventDefault();
    if (isMobile()) return;
    let $this = $(this);
    asideBmMenu(
      e,
      getBmListTitleData($this.attr('data-id')),
      $this.find('.check_bmlist')[0]
    );
  })
  .on('click', '.bm_logo', function (e) {
    e.stopPropagation();
    let $this = $(this).parent();
    let pid = $asideBtn.activeId;
    bookMarkSetting(
      e,
      {
        pid,
        ...getBmItemData(pid, $this.attr('data-id')),
      },
      0,
      this.parentNode.querySelector('.check_bm')
    );
  })
  .on('contextmenu', '.bm_item', function (e) {
    //操作书签
    e.preventDefault();
    if (isMobile()) return;
    let $this = $(this);
    let pid = $asideBtn.activeId;
    bookMarkSetting(
      e,
      {
        pid,
        ...getBmItemData(pid, $this.attr('data-id')),
      },
      0,
      this.querySelector('.check_bm')
    );
  })
  .on('click', '.foot_menu div', function () {
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $aside.find('.foot_menu div').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    if (bmState) {
      let $sidenav = $aside.find('.bm_item');
      $sidenav
        .find('.check_bm')
        .attr('check', che)
        .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
      _msg.botMsg(`选中：${che === 'y' ? $sidenav.length : 0}项`);
    } else {
      let $sidenav = $aside.find('.list_title');
      $sidenav
        .find('.check_bmlist')
        .attr('check', che)
        .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
      _msg.botMsg(`选中：${che === 'y' ? $sidenav.length : 0}项`);
    }
  })
  .on('click', '.check_bm', function (e) {
    e.stopPropagation();
    checkAsideBm(this);
  })
  .on('click', '.check_bmlist', function (e) {
    checkAsideBmList(this);
  })
  .on('click', '.delete_bm', function (e) {
    if (bmState) {
      let arr = getAsideCheckBmItem();
      if (arr.length === 0) return;
      delBm(e, arr);
    } else {
      let arr = getAsideCheckBmList();
      if (arr.length === 0) return;
      delBmList(e, arr);
    }
  })
  .on('click', '.move_bm', function (e) {
    let arr = getAsideCheckBmItem();
    let pid = $asideBtn.activeId;
    if (arr.length === 0) return;
    moveBookMark(e, pid, arr);
  })
  .on('click', '.clock_bm', function (e) {
    if (bmState) return;
    let arr = getAsideCheckBmList();
    if (arr.length === 0) return;
    changeBmListState('n', arr);
  })
  .on('click', '.open_bm', function (e) {
    if (bmState) return;
    let arr = getAsideCheckBmList();
    if (arr.length === 0) return;
    changeBmListState('y', arr);
  })
  .on('click', '.close', function (e) {
    if (bmState) {
      let $sidenav = $aside.find('.bm_item');
      $sidenav
        .find('.check_bm')
        .css('display', 'none')
        .attr('check', 'n')
        .css('background-color', 'transparent');
    } else {
      let $sidenav = $aside.find('.list_title');
      $sidenav
        .find('.check_bmlist')
        .css('display', 'none')
        .attr('check', 'n')
        .css('background-color', 'transparent');
    }
    $aside.find('.foot_menu').stop().slideUp(_speed);
  })
  .on('click', function (e) {
    if (_getTarget(this, e, '.aside_wrap', 1)) {
      hideAside();
    }
  });
function checkAsideBm(el) {
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $sidenav = $aside.find('.bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) => $(item).find('.check_bm').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $sidenav.length) {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
function checkAsideBmList(el) {
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $sidenav = $aside.find('.list_title'),
    $checkArr = $sidenav.filter(
      (_, item) => $(item).find('.check_bmlist').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $sidenav.length) {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
function moveBookMark(e, pid, arr) {
  let data = [
    {
      id: 'home',
      text: '主页',
      beforeIcon: 'iconfont icon-shoucang',
      param: { id: 'home', name: '主页' },
    },
  ];
  if (pid == 'home') {
    data = [];
  }
  _d.bookmark.side.forEach((item) => {
    if (item.id != pid) {
      data.push({
        id: item.id,
        text: item.name,
        beforeIcon: 'iconfont icon-shoucang',
        param: { id: item.id, name: item.name },
      });
    }
  });
  if (data.length == 0) {
    _msg.error('没有可移动的书签分组');
    return;
  }
  selectMenu(
    e,
    data,
    ({ e, close, id, param }) => {
      if (id) {
        let toid = param.id,
          listname = param.name;
        _pop({ e, text: `确认移动到 ${listname}？` }, (type) => {
          if (type == 'confirm') {
            _postAjax('/bmk/bmktolist', { arr, toid })
              .then((result) => {
                if (parseInt(result.code) === 0) {
                  close(true);
                  _msg.success(result.codeText);
                  renderAsideList();
                  renderHomebook();
                }
              })
              .catch((err) => {});
          }
        });
      }
    },
    '移动书签到分组'
  );
}
longPress($aside[0], '.list_title', function (e) {
  let $this = $(this),
    ev = e.changedTouches[0];
  asideBmMenu(
    ev,
    getBmListTitleData($this.attr('data-id')),
    $this.find('.check_bmlist')[0]
  );
});
longPress($aside[0], '.bm_item', function (e) {
  let $this = $(this),
    ev = e.changedTouches[0];
  let pid = $asideBtn.activeId;
  bookMarkSetting(
    ev,
    {
      pid,
      ...getBmItemData(pid, $this.attr('data-id')),
    },
    0,
    this.querySelector('.check_bm')
  );
});
function addBookMark(e, pid) {
  inpMenu(
    e,
    {
      subText: '添加',
      items: {
        link: {
          beforeText: '网址：',
          placeholder: 'https://',
          verify(val) {
            if (!isurl(val)) {
              return '请输入正确的网址';
            }
          },
        },
      },
    },
    debounce(
      function ({ e, inp, close }) {
        const u = inp.link;
        _getAjax('/bmk/getsiteinfo', { u })
          .then((result) => {
            if (result.code == 0) {
              close();
              const { title, des } = result.data;
              inpMenu(
                e,
                {
                  subText: '提交',
                  items: {
                    title: {
                      placeholder: '标题',
                      beforeText: '标题：',
                      value: title,
                      verify(val) {
                        if (val.trim() == '') {
                          return '请输入书签标题';
                        }
                      },
                    },
                    link: {
                      beforeText: '网址：',
                      placeholder: 'https://',
                      value: u,
                      verify(val) {
                        if (!isurl(val)) {
                          return '请输入正确的网址';
                        }
                      },
                    },
                    des: {
                      beforeText: '描述：',
                      value: des,
                      type: 'textarea',
                      placeholder: '描述',
                    },
                  },
                },
                debounce(
                  function ({ close, inp }) {
                    let an = inp.title,
                      al = inp.link,
                      des = inp.des;
                    _postAjax('/bmk/addbmk', {
                      id: pid,
                      arr: [
                        {
                          name: an,
                          link: al,
                          des,
                        },
                      ],
                    })
                      .then((result) => {
                        if (parseInt(result.code) === 0) {
                          close(true);
                          _msg.success(result.codeText);
                          if ($asideBtn.activeId == pid) {
                            renderAsideList();
                          }
                          if (pid == 'home') {
                            renderHomebook();
                          }
                        }
                      })
                      .catch((err) => {});
                  },
                  1000,
                  true
                ),
                '添加书签'
              );
            }
          })
          .catch(() => {});
      },
      1000,
      true
    ),
    '添加书签'
  );
}
function editBmList(e, obj) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        idx: {
          beforeText: '序号',
          inputType: 'number',
          placeholder: '序号',
          value: obj.num + 1,
          verify(val) {
            let value = parseFloat(val.trim());
            if (!isInteger(value) || value <= 0) {
              return '请输正整数';
            }
          },
        },
        text: {
          beforeText: '标题',
          placeholder: '标题',
          value: obj.name,
          verify(val) {
            if (val.trim() == '') {
              return '请输入标题';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let ni = inp.text;
        let idx = inp.idx - 1;
        if (ni === obj.name && idx == obj.num) return;
        let toId = '';
        if (idx != obj.num) {
          const lastNum = _d.bookmark.side.length - 1;
          if (idx > lastNum) {
            idx = lastNum;
          }
          toId =
            (_d.bookmark.side.find((item) => item.num == idx) || {}).id || '';
        }
        _postAjax('/bmk/editlist', { id: obj.id, name: ni, toId })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close(true);
              _msg.success(result.codeText);
              renderAsideList();
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '编辑书签分组'
  );
}
function shareBmList(e, obj) {
  createShare(
    e,
    { name: obj.name, title: '分享书签分组' },
    ({ close, inp }) => {
      const { title, pass, valid } = inp;
      _postAjax('/bmk/share', { id: obj.id, title, pass, valid })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            hideAside();
            close(1);
            openIframe(`/sharelist`, '分享列表');
          }
        })
        .catch((err) => {});
    }
  );
}
function delBmList(e, arr, cb, text) {
  _pop(
    {
      e,
      text: `确认删除${text ? `：${text}` : ''}？`,
      confirm: { type: 'danger', text: '删除' },
    },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/bmk/dellist', { arr })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              cb && cb();
              _msg.success(result.codeText);
              renderAsideList();
            }
          })
          .catch((err) => {});
      }
    }
  );
}
function changeBmListState(share, arr, cb) {
  _postAjax('/bmk/locklist', {
    arr,
    share,
  }).then((res) => {
    if (res.code == 0) {
      cb && cb();
      _msg.success(res.codeText);
      renderAsideList();
    }
  });
}
//操作列表
function asideBmMenu(e, obj, el) {
  let data = [
    {
      id: 'share',
      text: obj.share == 'y' ? '锁定' : '公开',
      beforeIcon: 'iconfont icon-suo',
    },
  ];
  if ($aside.find('.foot_menu').is(':hidden')) {
    data.push({
      id: 'check',
      text: '选中',
      beforeIcon: 'iconfont icon-duoxuan',
    });
  }
  data = [
    ...data,
    {
      id: 'rename',
      text: '编辑分组',
      beforeIcon: 'iconfont icon-bianji',
    },
    {
      id: 'add',
      text: '添加书签',
      beforeIcon: 'iconfont icon-icon-test',
    },
    {
      id: 'toshare',
      text: '分享',
      beforeIcon: 'iconfont icon-fenxiang_2',
    },
    {
      id: 'del',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    },
  ];
  selectMenu(
    e,
    data,
    ({ e, id, close }) => {
      // 编辑列表
      if (id == 'rename') {
        editBmList(e, obj);
      } else if (id == 'add') {
        // 新增书签
        addBookMark(e, obj.id);
      } else if (id == 'toshare') {
        //分享列表
        shareBmList(e, obj);
      } else if (id == 'del') {
        //删除列表
        delBmList(
          e,
          [obj.id],
          () => {
            close();
          },
          obj.name
        );
      } else if (id == 'share') {
        changeBmListState(obj.share == 'y' ? 'n' : 'y', [obj.id], () => {
          close();
        });
      } else if (id == 'check') {
        bmState = false;
        showCheckBtn();
        $aside.find('.foot_menu').stop().slideDown(_speed).find('div').attr({
          class: 'iconfont icon-xuanzeweixuanze',
          check: 'n',
        });
        $aside.find('ul').css('display', 'none').html('');
        let $sidenav = $aside.find('.list_title');
        $asideBtn.activeId = 'hide';
        $sidenav.attr('flag', 'off');
        $sidenav.find('.check_bmlist').css('display', 'block');
        checkAsideBmList(el);
        close();
      }
    },
    obj.name
  );
}
async function upLogo(cb) {
  try {
    const files = await getFiles({
      accept: '.jpg,.jpeg,.png,.ico,.svg,.webp,.gif',
    });
    if (files.length == 0) return;
    const file = files[0];
    if (!isImgFile(file.name)) {
      _msg.error(`图片格式错误`);
      return;
    }
    const pro = new UpProgress(file.name);
    if (file.size <= 0 || file.size >= 5 * 1024 * 1024) {
      pro.fail();
      _msg.error(`图片大小必须0~5M范围`);
      return;
    }
    const { HASH } = await fileSlice(file, (percent) => {
      pro.loading(percent);
    });
    _upFile(
      { url: `/user/uplogo`, param: { HASH, name: file.name } },
      file,
      function (percent) {
        pro.update(percent);
      }
    )
      .then((result) => {
        if (parseInt(result.code) === 0) {
          pro.close();
          let logo = result.data.logo;
          cb && cb(logo);
          return;
        }
        return Promise.reject();
      })
      .catch(() => {
        pro.fail();
      });
  } catch (error) {
    _msg.error('上传失败');
    return;
  }
}
function upBmLogo(obj, isHome) {
  upLogo((purl) => {
    _postAjax('/bmk/setlogo', {
      pid: isHome ? 'home' : obj.pid,
      cid: obj.id,
      purl: `/logo/${_d.userInfo.account}/${purl}`,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        _msg.success(result.codeText);
        renderAsideList();
        renderHomebook();
        return;
      }
    });
  });
}
function editBm(e, obj, isHome) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        idx: {
          placeholder: '序号',
          inputType: 'number',
          beforeText: '序号：',
          value: obj.num + 1,
          verify(val) {
            let value = parseFloat(val.trim());
            if (!isInteger(value) || value <= 0) {
              return '请输正整数';
            }
          },
        },
        title: {
          placeholder: '标题',
          beforeText: '标题：',
          value: obj.name,
          verify(val) {
            if (val.trim() == '') {
              return '请输入书签标题';
            }
          },
        },
        link: {
          beforeText: '网址：',
          placeholder: 'https://',
          value: obj.link,
          verify(val) {
            if (!isurl(val)) {
              return '请输入正确的网址';
            }
          },
        },
        des: {
          beforeText: '描述：',
          type: 'textarea',
          placeholder: '描述',
          value: obj.des,
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let an = inp.title,
          al = inp.link,
          idx = inp.idx - 1,
          des = inp.des;
        if (
          an === obj.name &&
          al === obj.link &&
          des === obj.des &&
          idx == obj.num
        )
          return;
        const pid = isHome ? 'home' : obj.pid;
        let tid = '';
        if (idx != obj.num) {
          let lastNum = 0;
          if (pid == 'home') {
            lastNum = _d.bookmark.home.length - 1;
            if (idx > lastNum) {
              idx = lastNum;
            }
            tid =
              (_d.bookmark.home.find((item) => item.num == idx) || {}).id || '';
          } else {
            const arr =
              (_d.bookmark.side.find((item) => item.id == pid) || {}).item ||
              [];
            lastNum = arr.length - 1;
            if (idx > lastNum) {
              idx = lastNum;
            }
            tid = (arr.find((item) => item.num == idx) || {}).id || '';
          }
        }
        let requestObj = {
          pid,
          cid: obj.id,
          des,
          name: an,
          link: al,
          tid,
        };
        _postAjax('/bmk/editbmk', requestObj)
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close(true);
              _msg.success(result.codeText);
              renderAsideList();
              renderHomebook();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '编辑书签'
  );
}
//操作书签
function bookMarkSetting(e, obj, isHome, el) {
  let data = [];
  if (!isMobile()) {
    data.push({
      id: '1',
      text: '弹窗打开',
      beforeIcon: 'iconfont icon-24gl-minimize',
    });
  }
  data.push({
    id: '2',
    text: '书签图标',
    beforeIcon: 'iconfont icon-tupian',
  });
  if (
    (!isHome && $aside.find('.foot_menu').is(':hidden')) ||
    (isHome && $homeFootMenu.is(':hidden'))
  ) {
    data.push({
      id: '3',
      text: '选中',
      beforeIcon: 'iconfont icon-duoxuan',
    });
  }
  data = [
    ...data,
    {
      id: '4',
      text: '编辑书签',
      beforeIcon: 'iconfont icon-bianji',
    },
    {
      id: '5',
      text: '移动到',
      beforeIcon: 'iconfont icon-moveto',
    },
    {
      id: '6',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    },
  ];
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        close();
        hideAside();
        openIframe(obj.link, obj.name);
      } else if (id == '2') {
        //上传图标
        // close();
        let data = [
          {
            id: '1',
            text: '自定义图标',
          },
        ];
        if (obj.logo) {
          data.push({
            id: '2',
            text: '使用自动获取图标',
          });
        }
        selectMenu(
          e,
          data,
          ({ e, close, id }) => {
            if (id == '1') {
              close(1);
              upBmLogo(obj, isHome);
            } else if (id == '2') {
              _pop(
                {
                  e,
                  text: '确认清除自定义图标，使用自动获取图标？',
                },
                (type) => {
                  if (type == 'confirm') {
                    _postAjax('/bmk/cleanlogo', { id: obj.id })
                      .then((res) => {
                        if (res.code == 0) {
                          close(1);
                          renderHomebook();
                          renderAsideList();
                        }
                      })
                      .catch(() => {});
                  }
                }
              );
            }
          },
          '图标设置'
        );
      } else if (id == '3') {
        //多选
        if (isHome) {
          $homeFootMenu.stop().slideDown(_speed).find('div').attr({
            class: 'iconfont icon-xuanzeweixuanze',
            check: 'n',
          });
          let $sidenav = $homeBmWrap.find('.home_bm_item');
          $sidenav.find('.check_home_bm').css('display', 'block');
          checkedHomeBm(el);
        } else {
          bmState = true;
          showCheckBtn();
          $aside.find('.foot_menu').stop().slideDown(_speed).find('div').attr({
            class: 'iconfont icon-xuanzeweixuanze',
            check: 'n',
          });
          let $sidenav = $aside.find('.bm_item');
          $sidenav.find('.check_bm').css('display', 'block');
          checkAsideBm(el);
        }
        close();
      } else if (id == '4') {
        // 修改书签
        editBm(e, obj, isHome);
      } else if (id == '5') {
        // 移动书签
        moveBookMark(e, isHome ? 'home' : obj.pid, [obj.id]);
      } else if (id == '6') {
        // 删除书签
        delBm(
          e,
          [obj.id],
          () => {
            close();
          },
          obj.name
        );
      }
    },
    obj.name
  );
}
function toggleAside() {
  if ($asideWrap.is(':hidden')) {
    showAside();
  } else {
    hideAside();
  }
}
$asideBtn.on('click', toggleAside);
// 显示和隐藏侧栏
function showAside() {
  backWindow.add('aside', hideAside);
  $asideWrap.css('display', 'block');
  let menuw = $aside.outerWidth();
  loadingImg($aside.find('.list')[0]);
  $mainid.css({
    transform: `translateX(${menuw}px)`,
  });
  $aside.css({
    transform: 'translateX(0px)',
  });
  $asideBtn.find('.boxtop').addClass('active');
  $asideBtn.find('.boxdow').addClass('active');
  $asideBtn.find('.boxcon').css('opacity', '0');
  renderAsideList(1);
}
function hideAside() {
  backWindow.remove('aside');
  let menuw = $aside.outerWidth();
  $mainid.css({
    transform: 'none',
  });
  $aside.css({
    transform: `translateX(-${menuw}px)`,
  });
  $asideBtn.find('.boxtop').removeClass('active');
  $asideBtn.find('.boxdow').removeClass('active');
  $asideBtn.find('.boxcon').css('opacity', '1');
  $asideWrap.stop().fadeOut(_speed, () => {
    asideLoadImg.unBind();
    $aside.find('.list').html('');
  });
}
const onceInit = hdOnce(function () {
  chatobj.account = _d.userInfo.account;
  if (_d.userInfo.account !== 'root') {
    $rightBox.find('.admin').remove();
  }
  const urlParmes = queryURLParams(myOpen());
  if (urlParmes.c) {
    if (urlParmes.c === _d.userInfo.account) {
      myOpen('/');
      return;
    }
    chatobj.account = urlParmes.c;
    showChatRoom();
  }
  if (urlParmes.p) {
    showMusicPlayerBox();
  }
  const isBig = isBigScreen();
  const { bg, bgxs } = _d.userInfo;
  if ((isBig && !bg) || (!isBig && !bgxs)) {
    bgInterval();
  }
});
function updateUserInfo(cb) {
  _getAjax('/user/getuserinfo')
    .then((result) => {
      if (parseInt(result.code) === 0) {
        _d.userInfo = result.data;
        onceInit();
        let { logo, username, account, bg, bgxs, bgObj } = _d.userInfo;
        const uname = _getData('uname');
        const loginName = _getData('username');
        if (uname !== username) {
          _getAjax('/user/updatetoken')
            .then((res) => {
              if (res.code == 0) {
                _setData('uname', username);
              }
            })
            .catch(() => {});
          if (loginName !== account) {
            _setData('username', username);
          }
        }
        _d.myTitle = `Hello ${username}`;
        if ($myAudio[0].paused) {
          document.title = _d.myTitle;
        }
        $rightBox
          .find('.user_name')
          .text(username)
          .attr('title', username)
          .stop()
          .fadeIn(_speed);
        logo = logo
          ? hdPath(`/api/logo/${account}/${logo}`)
          : getTextImg(username);
        $userLogoBtn.css('background-image', `url(${logo})`);
        const isBig = isBigScreen();
        if ((isBig && !bg) || (!isBig && !bgxs)) {
          $pageBg.css('background-image', `url(${imgBgSvg})`);
          cb && cb();
          return;
        }
        let bgUrl = '';
        if (isBig) {
          bgUrl = getFilePath(`/bg/${getIn(bgObj, [bg, 'url']) || ''}`);
        } else {
          bgUrl = getFilePath(`/bg/${getIn(bgObj, [bgxs, 'url']) || ''}`);
        }
        imgjz(
          bgUrl,
          () => {
            $pageBg.css('background-image', `url(${bgUrl})`);
            cb && cb();
          },
          () => {
            $pageBg.css('background-image', `url(${imgBgSvg})`);
            cb && cb();
          }
        );
        handleUserinfo();
      }
    })
    .catch((err) => {});
}
updateUserInfo(closeLoading);
function dragMoveBookmark(pid, fromId, toId) {
  _postAjax('/bmk/bmkmove', { pid, fromId, toId })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        renderHomebook();
        renderAsideList();
        return;
      }
    })
    .catch((err) => {});
}
// 主页书签
~(function () {
  let fromDom = null;
  $homeBmWrap
    .find('ul')
    .on('dragstart', '.home_bm_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.home_bm_item', function (e) {
      let fromId = $(fromDom).attr('data-id'),
        toId = $(this).attr('data-id');
      if (fromDom) {
        if (fromId && toId && fromId !== toId) {
          dragMoveBookmark('home', fromId, toId);
        }
        fromDom = null;
      }
    })
    .on('dragover', '.home_bm_item', function (e) {
      e.preventDefault();
    });
})();
//主页书签渲染
function renderHomebook() {
  if ($searchBoxMask.is(':hidden')) return;
  let a = $homeBmWrap.find('ul').children();
  if (a.length === 0) {
    renderhomebookdefault();
  }
  _getAjax('/bmk/getlist', { id: 'home' })
    .then((result) => {
      if (result.code === 0) {
        _d.bookmark = result.data;
        renderhomebook();
        return;
      }
    })
    .catch((err) => {});
}
function renderhomebookdefault() {
  let str = '';
  let color = '#ffffff54';
  new Array(21).fill(null).forEach((v, i) => {
    str += `<li style="pointer-events: none;" class="home_bm_item">
              <div style="background-color:${color}" class="home_bm_logo"></div>
              <p></p>
              </li>`;
  });
  $homeBmWrap.find('ul').html(str);
}
function getHomeBmData(id) {
  return _d.bookmark.home.find((item) => item.id == id);
}
function getHomeCheckBmItem() {
  const $homeBmItem = $homeBmWrap.find('.home_bm_item'),
    $checkArr = $homeBmItem.filter(
      (_, item) => $(item).find('.check_home_bm').attr('check') === 'y'
    );
  let arr = [];
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  return arr;
}

function renderhomebook() {
  if ($searchBoxMask.is(':hidden')) return;
  $homeFootMenu.stop().slideUp(_speed).find('div').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
  let homearr = _d.bookmark.home,
    str = '';
  homearr.forEach((v) => {
    let name = encodeHtml(v.name);
    let des = v.des ? encodeHtml(v.des) : '';
    str += `<li title="${name}\n${encodeHtml(
      v.link
    )}\n${des}" class="home_bm_item" data-id="${v.id}" draggable="true">
              <div cursor check="n" class="check_home_bm"></div>
              <div class="home_bm_logo" cursor></div>
              <p cursor>${name}</p>
              </li>`;
  });
  str += `<li class="home_bm_item">
                <div cursor x="add" style="background-image:url(${imgTianjia})" class="home_bm_logo">
                </div>
                <p></p>
              </li>`;
  $homeBmWrap.find('ul').html(str);
  homeLoadImg.bind(
    $homeBmWrap.find('ul')[0].querySelectorAll('.home_bm_item'),
    (item) => {
      let $item = $(item);
      let flag = $item.find('.home_bm_logo').attr('x');
      if (flag == 'add') return;
      let { logo, link } = getHomeBmData($item.attr('data-id'));
      const $homeBmLogo = $item.find('.home_bm_logo');
      if (logo) {
        logo = hdPath(`/api/${logo}`);
      } else {
        logo = `/api/getfavicon?u=${encodeURIComponent(link)}`;
      }
      imgjz(
        logo,
        () => {
          $homeBmLogo
            .css({
              'background-image': `url(${logo})`,
            })
            .addClass('load');
        },
        () => {
          $homeBmLogo
            .css({
              'background-image': `url(${imgMrLogo})`,
            })
            .addClass('load');
        }
      );
    }
  );
}
const homeLoadImg = new LazyLoad();
$searchBoxMask
  .on('click', '.home_bm_logo', function (e) {
    let $this = $(this);
    if ($this.attr('x') === 'add') {
      addBookMark(e, 'home');
    } else {
      let { link } = getHomeBmData($this.parent().attr('data-id'));
      myOpen(link, '_blank');
    }
  })
  .on('contextmenu', '.home_bm_logo', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    let $this = $(this);
    let id = $this.parent().attr('data-id');
    if (!id) return;
    bookMarkSetting(
      e,
      getHomeBmData(id),
      'home',
      this.parentNode.querySelector('.check_home_bm')
    );
  })
  .on('click', '.home_bm_item p', function (e) {
    e.stopPropagation();
    let $this = $(this);
    let id = $this.parent().attr('data-id');
    if (!id) return;
    bookMarkSetting(
      e,
      getHomeBmData(id),
      'home',
      this.parentNode.querySelector('.check_home_bm')
    );
  })
  .on('click', '.home_foot_menu div', function () {
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $homeFootMenu.find('div').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    let $folder = $homeBmWrap.find('.home_bm_item').find('.check_home_bm');
    $folder
      .attr('check', che)
      .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
    _msg.botMsg(`选中：${che === 'y' ? $folder.length : 0}项`);
  })
  .on('click', '.check_home_bm', function (e) {
    e.stopPropagation();
    checkedHomeBm(this);
  })
  .on('click', '.delete_bm', function (e) {
    let arr = getHomeCheckBmItem();
    if (arr.length === 0) return;
    delBm(e, arr);
  })
  .on('click', '.move_bm', function (e) {
    let arr = getHomeCheckBmItem();
    if (arr.length === 0) return;
    if (_d.bookmark.side.length === 0) {
      _msg.error('没有可移动的分组');
      return;
    }
    moveBookMark(e, 'home', arr);
  })
  .on('click', '.close', function (e) {
    let $sidenav = $homeBmWrap.find('.home_bm_item');
    $sidenav
      .find('.check_home_bm')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $homeFootMenu.stop().slideUp(_speed);
  })
  .on('click', function (e) {
    if (_getTarget(this, e, '.search_box_mask', 1)) {
      hideSearchBox();
    }
  });
function hideSearchBox() {
  backWindow.remove('search');
  homeLoadImg.unBind();
  $homeBmWrap.find('ul').html('');
  $searchBoxMask.stop().hide(_speed);
  $searchBoxBtn.stop().show(_speed);
  $pageBg.removeClass('sce');
}
function checkedHomeBm(el) {
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $sidenav = $homeBmWrap.find('.home_bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) =>
        $(item).attr('data-id') &&
        $(item).find('.check_home_bm').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $sidenav.length - 1) {
    $homeFootMenu.find('div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $homeFootMenu.find('div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
longPress($searchBoxMask[0], '.home_bm_logo', function (e) {
  let $this = $(this),
    ev = e.changedTouches[0];
  let id = $this.parent().attr('data-id');
  if (!id) return;
  bookMarkSetting(
    ev,
    getHomeBmData(id),
    'home',
    this.parentNode.querySelector('.check_home_bm')
  );
});
function showSearchBox() {
  $searchBoxMask.stop().show(_speed, () => {
    renderHomebook();
  });
  setZidx($searchBoxMask[0], 'search', hideSearchBox);
  $searchBoxBtn.stop().hide(_speed);
  $pageBg.addClass('sce');
  $searchLogo.find('.logo_box').addClass('active');
}
$searchBoxBtn.on('click', showSearchBox);

//搜索相关
function isSearchOpenPop() {
  return _getData('searchOpenPop') == 'y';
}
const searchInput = wrapInput($searchInpWrap.find('.inp_box input')[0], {
  change(val) {
    if (val.trim() == '') {
      $searchInpWrap.find('.inp_box i').css('display', 'none');
      $searchInpWrap.find('.translate_btn').css('display', 'none');
      $searchInpWrap.find('.search_submit').css('display', 'none');
    } else {
      $searchInpWrap.find('.inp_box i').css('display', 'block');
      $searchInpWrap.find('.translate_btn').css('display', 'block');
      $searchInpWrap.find('.search_submit').css('display', 'block');
    }
  },
  focus() {
    $searchInpWrap.find('.search_list_box').css('display', 'block');
    $searchInpWrap.find('.content').addClass('active');
    let val = searchInput.getValue();
    hdSearchBoxInput(val);
  },
});
function getSearchEngine() {
  return _d.searchEngineData[curSearchIdx] || _d.searchEngineData[0];
}
function getSearchWordLink() {
  return _d.searchWord[searchWordIdx] || _d.searchWord[0];
}
//切换搜索引擎
function switchSearchEngine() {
  let { icon, logo, color } = getSearchEngine();
  $searchInpWrap.find('.content').css('borderColor', color);
  $searchLogo.find('img').attr({ src: logo });
  $searchLogo.find('.logo_box').addClass('active');
  $searchBoxBtn.attr('src', icon);
  $searchInpWrap.find('.inp_box input').attr({
    placeholder: '输入搜索内容或网址',
  });
}
switchSearchEngine();
// 搜索提示词
function tosearch(val) {
  const action = getSearchEngine().searchlink;
  if (val === '') return;
  saveSearchText(val);
  let u = val;
  if (!isurl(val)) {
    u = action.replace(/\{\{\}\}/, encodeURIComponent(val));
  }
  if (isSearchOpenPop()) {
    openIframe(u, val);
    return;
  }
  myOpen(u, '_blank');
}
const _hdSearchBoxInput = debounce(hdSearchBoxInput, 1000);
function hdSearchBoxInput(val) {
  renderSearchList(val.trim());
}
let numff = -1;
function delHistory(el, arr) {
  _postAjax('/search/del', { arr })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        _msg.success(result.codeText);
        el.remove();
        return;
      }
    })
    .catch((err) => {});
}
$searchInpWrap
  .on('click', '.search_submit', (e) => {
    let val = searchInput.getValue().trim();
    tosearch(val);
  })
  .on('click', '.translate_btn', function (e) {
    let a = searchInput.getValue().trim();
    if (a === '') return;
    saveSearchText(a);
    let u = _d.translator.replace(/\{\{\}\}/, encodeURIComponent(a));
    if (isSearchOpenPop()) {
      openIframe(u, a);
      return;
    }
    myOpen(u, '_blank');
  })
  .on('keyup', '.inp_box input', function (e) {
    e.stopPropagation();
    e.preventDefault();
    let key = e.key;
    if (key == 'Enter') {
      let val = searchInput.getValue().trim();
      tosearch(val);
    }
  })
  .on('keydown', '.inp_box input', function (e) {
    let key = e.key,
      listlength =
        $searchInpWrap.find('.search_list_box ul').children('li').length - 1;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') {
      numff = -1;
      return;
    }
    if (key === 'ArrowDown') {
      numff++;
      if (numff > listlength) {
        numff = 0;
      }
    } else if (key === 'ArrowUp') {
      numff--;
      if (numff < 0) {
        numff = listlength;
      }
    }
    let $searchItem = $searchInpWrap.find('.search_list_box ul .search_item');
    $searchItem.removeClass('active').eq(numff).addClass('active');
    let aa = $searchItem.eq(numff).text().trim();
    searchInput.setValue(aa);
    let dw = parseInt(numff * 41);
    $searchInpWrap.find('.search_list_box').scrollTop(dw);
  })
  .on('input', '.inp_box input', function () {
    let val = searchInput.getValue();
    _hdSearchBoxInput(val);
  })
  .on('click', '.inp_box i', function () {
    searchInput.setValue('');
    searchInput.target.focus();
  })
  .find('.search_list_box')
  .on('click', '.text', function (e) {
    let $this = $(this).parent(),
      type = $this.data('type'),
      text = $this.text().trim(),
      id = $this.data('id');
    if (type === 'ss') {
      tosearch(text);
    } else if (type === 'note') {
      let u = `/note/?v=${id}`;
      if (isSearchOpenPop()) {
        openIframe(u, text);
      } else {
        myOpen(u, '_blank');
      }
    } else if (type === 'bmk') {
      let { link } = getSearchItem(id);
      if (isSearchOpenPop()) {
        openIframe(link, text);
      } else {
        myOpen(link, '_blank');
      }
    } else if (type === 'music') {
      showMusicPlayerBox();
      const list = $searchInpWrap.list.filter((item) => item.type == 'music');
      let obj = getSearchItem(id);
      musicarr = deepClone(list);
      _d.playingList = deepClone(list);
      renderPlayingList();
      updatePlayingList();
      musicPlay(obj);
    } else if (type === 'user') {
      chatobj.account = id;
      showChatRoom();
    }
  })
  .on('click', '.dellss', function (e) {
    const $p = $(this).parent();
    let x = $p.data('id');
    delHistory($p, [x]);
  })
  .on('contextmenu', 'li', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    let xx = $(this).text().trim();
    searchInput.setValue(xx);
    searchInput.target.focus();
  });
// 保存搜索历史
function saveSearchText(str) {
  str = str.trim();
  if (str === '') return;
  _postAjax('/search/add', { a: str })
    .then((res) => {})
    .catch((err) => {});
}
function getSearchItem(id) {
  return $searchInpWrap.list.find((item) => item.id == id);
}
function rSearchList() {
  const list = $searchInpWrap.list;
  const splitWord = $searchInpWrap.splitWord;
  let searchstr = '';
  if (list.length > 0) {
    list.forEach((v) => {
      let { type, id, name, data, link, des, flag, title, username, artist } =
        v;
      if (type === 'ss') {
        searchstr += `<li title="${encodeHtml(
          data
        )}" data-type="${type}" data-id="${id}" class="search_item">
        <span class="type_logo iconfont ${
          flag == 'ts' ? 'icon-tishi' : 'icon-history'
        }"></span>
        <span cursor class="text">${hdTitleHighlight(splitWord, data)}</span>
        ${
          flag == 'ts'
            ? ''
            : '<span cursor class="dellss iconfont icon-guanbi"></span>'
        }
        </li>`;
      } else if (type === 'note') {
        searchstr += `<li title="${encodeHtml(
          name
        )}" data-type="${type}" data-id="${id}" class="search_item">
        <span class="type_logo iconfont icon-jilu"></span>
        <span cursor class="text">${hdTitleHighlight(splitWord, name)}</span>
        </li>`;
      } else if (type === 'bmk') {
        searchstr += `<li title="${encodeHtml(name)}\n${encodeHtml(link)}\n${
          des ? encodeHtml(des) : ''
        }" data-type="${type}" data-id="${id}" class="search_item">
        <span class="type_logo iconfont icon-shuqian"></span>
        <span cursor class="text">${hdTitleHighlight(splitWord, name)}</span>
        </li>`;
      } else if (type === 'music') {
        searchstr += `<li title="${encodeHtml(artist)}-${encodeHtml(
          title
        )}" data-type="${type}" data-id="${id}" class="search_item">
        <span style="font-size:20px" class="type_logo iconfont icon-yinle1"></span>
        <span cursor class="text">${hdTitleHighlight(
          splitWord,
          `${artist}-${title}`
        )}</span>
        </li>`;
      } else if (type === 'user') {
        searchstr += `<li title="${encodeHtml(username)}${
          des ? `(${encodeHtml(des)})` : ''
        }" data-type="${type}" data-id="${id}" class="search_item">
        <span class="type_logo iconfont icon-chengyuan"></span>
        <span cursor class="text">
        ${hdTitleHighlight(splitWord, `${username}${des ? `(${des})` : ''}`)}
        </span>
        </li>`;
      }
    });
  }
  $searchInpWrap.find('.search_list_box ul').html(searchstr);
  numff = -1;
}
$searchInpWrap.list = [];
function renderSearchList(val) {
  loadingImg($searchInpWrap.find('.search_list_box ul')[0]);
  _getAjax('/search/getsearchdata', { a: val })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        const { splitWord, list } = result.data;
        $searchInpWrap.splitWord = splitWord;
        $searchInpWrap.list = list;
        rSearchList();
      }
      const wordLink = getSearchWordLink();
      if (wordLink.link && val) {
        const script = document.createElement('script');
        script.src = wordLink.link.replace(/\{\{\}\}/, encodeURIComponent(val));
        document.body.appendChild(script);
        document.body.removeChild(script);
      }
    })
    .catch((err) => {});
}
window.baidu = {
  sug: hdSearchWord,
};
window.bing = {
  sug: hdSearchWord,
};
window.google = {
  ac: {
    h: hdSearchWord,
  },
};
function hdSearchWord(res) {
  const { type } = getSearchWordLink();
  if (type == 'close') return;
  if (type == 'Google') {
    res = getIn(res, [1]);
    if (res && res.length > 0) {
      res = res.map((item) => item[0]);
    } else {
      res = [];
    }
  } else if (type == 'Baidu') {
    res = getIn(res, ['s']) || [];
  } else if (type == 'Bing') {
    res = getIn(res, ['AS', 'Results']) || [];
    let arr = [];
    res.forEach((item) => {
      let ar = getIn(item, ['Suggests']) || [];
      ar.forEach((titem) => {
        arr.push(titem.Txt);
      });
    });
    res = arr;
  } else {
    res = [];
  }
  if (!res || res.length == 0) return;
  const val = $searchInpWrap.splitWord;
  res = res.map((item, idx) => ({
    data: item,
    flag: 'ts',
    type: 'ss',
    id: idx + 1,
    sNum: getWordCount(val, item),
  }));
  $searchInpWrap.list = [...$searchInpWrap.list, ...res];
  $searchInpWrap.list.sort((a, b) => b.sNum - a.sNum);
  rSearchList();
}
longPress($searchInpWrap.find('.search_list_box')[0], 'li', function (e) {
  let xx = $(this).text().trim();
  searchInput.setValue(xx);
  searchInput.target.focus();
});

$searchBoxMask
  .on('click', '.setting', function (e) {
    let openInPop = _getData('searchOpenPop');
    let data = [
      {
        id: '3',
        text: '搜索历史',
        beforeIcon: 'iconfont icon-history',
      },
      {
        id: '4',
        text: '书签夹',
        beforeIcon: 'iconfont icon-shuqian',
      },
      {
        id: '5',
        text: '切换搜索引擎',
        beforeIcon: 'iconfont icon-search',
      },
      {
        id: '1',
        text: '切换搜索提示词服务',
        beforeIcon: 'iconfont icon-tishi',
      },
    ];
    if (!isMobile()) {
      data.push({
        id: '2',
        text: '弹窗打开搜索结果',
        beforeIcon: 'iconfont icon-24gl-minimize',
        afterIcon:
          openInPop === 'y'
            ? 'iconfont icon-kaiguan-kai1'
            : 'iconfont icon-kaiguan-guan',
        param: { openInPop },
      });
    }
    selectMenu(
      e,
      data,
      ({ e, close, resetMenu, id, param }) => {
        if (id == '1') {
          let data = [];
          const lObj = getSearchWordLink();
          _d.searchWord.forEach((item, idx) => {
            const { type } = item;
            data.push({
              id: idx + 1,
              text: type == 'close' ? '关闭' : type,
              active: lObj.type == type,
            });
          });
          selectMenu(
            e,
            data,
            ({ close, id }) => {
              if (id) {
                searchWordIdx = id - 1;
                _setData('searchWordIdx', searchWordIdx);
                close(1);
                _msg.success();
              }
            },
            '选择提示词服务'
          );
        } else if (id == '2') {
          let flag = param.openInPop;
          if (flag === 'y') {
            data[4].param.openInPop = 'n';
            data[4].afterIcon = 'iconfont icon-kaiguan-guan';
            _setData('searchOpenPop', 'n');
            _msg.success('关闭成功');
          } else {
            data[4].param.openInPop = 'y';
            data[4].afterIcon = 'iconfont icon-kaiguan-kai1';
            _setData('searchOpenPop', 'y');
            _msg.success('开启成功');
          }
          resetMenu(data);
        } else if (id == '3') {
          close();
          openIframe('/history/', '搜索历史');
        } else if (id == '5') {
          selectSearch(e);
        } else if (id == '4') {
          close();
          openIframe('/bmk/', '书签夹');
        }
      },
      '设置'
    );
  })
  .on('click', '.logo_box', selectSearch);
function selectSearch(e) {
  let str = ``;
  _d.searchEngineData.forEach((v, i) => {
    let { name, icon } = v;
    str += `<div cursor class="item ${
      getSearchEngine().name == name ? 'active' : ''
    }" xi=${i}><img style="width: 40px;height: 40px;border-radius: 4px;" src="${icon}"><span style="margin-left:10px;">${name}</span></div>`;
  });
  rightMenu(
    e,
    str,
    function ({ close, e, box }) {
      let _this = _getTarget(box, e, '.item');
      if (_this) {
        $searchLogo.find('.logo_box').removeClass('active');
        let xi = $(_this).attr('xi'),
          { logo } = _d.searchEngineData[xi];
        close(true);
        imgjz(
          logo,
          () => {
            curSearchIdx = xi;
            switchSearchEngine();
            _setData('searchengine', xi);
            _msg.success('切换成功');
          },
          () => {
            _msg.error('切换失败');
          }
        );
      }
    },
    '选择搜索引擎'
  );
}
//壁纸相关
//壁纸模糊处理
$pageBg.css({
  filter: `blur(${curFilterBg}px)`,
});
//随机背景
function bgInterval() {
  let _flag = isBigScreen() ? 'bg' : 'bgxs';
  $randomChangeBgBtn.addClass('open').find('img').addClass('open');
  _getAjax('/bg/randombg', { p: _flag })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        setBg(result.data);
        return;
      }
      $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
    })
    .catch((err) => {
      $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
    });
}

// 上传壁纸
async function hdUpBg(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { name, size } = file;
    const pro = new UpProgress(name);
    if (!isImgFile(name)) {
      pro.fail();
      _msg.error(`图片格式错误`);
      continue;
    }
    if (size <= 0 || size >= 20 * 1024 * 1024) {
      pro.fail();
      _msg.error(`图片大小必须0~20M范围`);
      continue;
    }
    try {
      //文件切片
      const { HASH } = await fileSlice(files[i], (percent) => {
        pro.loading(percent);
      });
      const isrepeat = await _postAjax('/bg/repeatfile', {
        HASH,
      }); //是否已经存在文件

      if (parseInt(isrepeat.code) === 0) {
        pro.close('壁纸已存在');
        //文件已经存在操作
        continue;
      }
      const result = await _upFile(
        {
          url: `/bg/up`,
          param: { name, HASH },
        },
        file,
        (percent) => {
          pro.update(percent);
        }
      );
      if (parseInt(result.code) === 0) {
        pro.close();
      } else {
        pro.fail();
      }
    } catch (error) {
      pro.fail();
    }
  }
  realtime.send({ type: 'updatedata', flag: 'bg' });
  bgpage = 1;
  bgxuanran(true);
}
function closeBgBox() {
  $allBgWrap.stop().fadeOut(_speed, () => {
    bglazyImg.unBind();
    backWindow.remove('bg');
    $bgList.html('');
  });
}
$allBgWrap
  .on('click', '.upload_bg', async function () {
    const files = await getFiles({
      multiple: true,
      accept: '.jpg,.jpeg,.png,.ico,.svg,.webp,.gif',
    });
    if (files.length == 0) return;
    hdUpBg(files);
  })
  .on('click', '.b_close_btn', closeBgBox);
~(function () {
  let allbg = $bgList[0];
  allbg.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  allbg.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  allbg.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files];
    if (files.length == 0) return;
    hdUpBg(files);
  });
})();
function setBg(obj, cb) {
  $randomChangeBgBtn.addClass('open').find('img').addClass('open');
  let url = getFilePath(`/bg/${obj.url}`);
  cb && cb();
  imgjz(
    url,
    () => {
      $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
      _postAjax('/bg/updatabg', { flag: obj.type, bg: obj.id })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _msg.success(result.codeText);
            updateUserInfo();
            return;
          }
        })
        .catch((err) => {});
    },
    (err) => {
      _msg.error('壁纸加载失败');
      $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
    }
  );
}
function delBg(e, arr, cb) {
  _pop(
    {
      e,
      text: '确认删除？',
      confirm: { type: 'danger', text: '删除' },
    },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/bg/delbg', arr)
          .then((result) => {
            if (parseInt(result.code) === 0) {
              cb && cb();
              _msg.success(result.codeText);
              bgxuanran();
              return;
            }
          })
          .catch((err) => {});
      }
    }
  );
}
function bgitemmenu(e, obj, el) {
  let data = [
    {
      id: '1',
      text: '设为壁纸',
      beforeIcon: 'iconfont icon-tupian',
    },
    {
      id: '2',
      text: '下载',
      beforeIcon: 'iconfont icon-xiazai1',
    },
  ];
  if (_d.userInfo.account === 'root') {
    if ($bgFooter.is(':hidden')) {
      data.push({
        id: '3',
        text: '选中',
        beforeIcon: 'iconfont icon-duoxuan',
      });
    }
    data.push({
      id: '4',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    });
  }
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        $allBgWrap.stop().fadeOut(_speed, () => {
          $bgList.html('');
        });
        setBg(obj, () => {
          close();
        });
      } else if (id == '4') {
        if (_d.userInfo.account === 'root') {
          delBg(e, [obj.id], () => {
            close();
          });
        }
      } else if (id == '2') {
        close();
        downloadFile(
          getFilePath(`/bg/${obj.url}`),
          getPathFilename(obj.url)[0]
        );
      } else if (id == '3') {
        close();
        $bgList.find('.check_level').css('display', 'block');
        $bgFooter.stop().slideDown(_speed).find('span').attr({
          class: 'iconfont icon-xuanzeweixuanze',
          check: 'n',
        });
        checkedBg(el);
      }
    },
    '壁纸选项'
  );
}

// 获取壁纸
var bgpage = 1;
function bgxuanrandefault() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<div style="pointer-events: none;" class="bg_item">
            <div class="bg_img"></div>
            </div>`;
  });
  $bgList.html(str).scrollTop(0);
}
function getBgItem(id) {
  return $allBgWrap.list.find((item) => item.id == id);
}
$allBgWrap.list = [];
const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
function bgxuanran(y) {
  if ($allBgWrap.is(':hidden')) return;
  if (y) {
    bgxuanrandefault();
  }
  let str = '',
    _flag = isBigScreen() ? 'bg' : 'bgxs',
    showpage = curBgPageSize;
  _getAjax('/bg/getbg', { flag: _flag, page: bgpage, showpage })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        if ($allBgWrap.is(':hidden')) return;
        let { total, totalPage, data, pageNo } = result.data;
        bgpage = pageNo;
        $allBgWrap.list = data;
        if (data.length == 0) {
          str += defaultRes;
        } else {
          data.forEach((v) => {
            const { id, url } = v;
            str += `<div class="bg_item" data-id="${id}">
                  <div check="n" class="check_level"></div>
                  <i cursor class="menu_btn iconfont icon-shoucang"></i>
                  <div class="bg_img" data-src="${getFilePath(
                    `/bg/${url}`
                  )}"></div>
                      </div>`;
          });
          str += `<div class="bg_paging_box">`;
          str += bgPgnt.getHTML(
            { pageNo, pageSize: showpage, total },
            getScreenSize().w <= _d.screen
          );
          str += `</div > `;
        }
        $bgList.html(str);
        $bgFooter.stop().slideUp(_speed);
        if (y) {
          $bgList.scrollTop(0);
        }
        bglazyImg.bind($bgList[0].querySelectorAll('.bg_img'), (item) => {
          let $img = $(item);
          let url = $img.attr('data-src') + '&t=1';
          imgjz(
            url,
            () => {
              $img
                .css({
                  'background-image': `url(${url})`,
                })
                .addClass('load');
            },
            () => {
              $img.css({
                'background-image': `url(${loadfailImg})`,
              });
            }
          );
        });
        return;
      }
    })
    .catch((err) => {});
}
const bglazyImg = new LazyLoad();
const bgPgnt = pagination($bgList[0], {
  pageSize: curBgPageSize,
  select: [20, 40, 60, 80, 100],
  change(val) {
    bgpage = val;
    bgxuanran(true);
    _msg.botMsg(`第 ${bgpage} 页`);
  },
  sizeChange(val) {
    curBgPageSize = val;
    _setData('bgshowpage', curBgPageSize);
    bgpage = 1;
    bgxuanran(true);
    _msg.botMsg(`第 ${bgpage} 页`);
  },
  top() {
    $bgList.stop().animate(
      {
        scrollTop: 0,
      },
      _speed
    );
  },
});
$bgList
  .on('contextmenu', '.bg_img', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    let obj = getBgItem($(this).parent().data('id'));
    bgitemmenu(e, obj, this.parentNode.querySelector('.check_level'));
  })
  .on('click', '.menu_btn', function (e) {
    let obj = getBgItem($(this).parent().data('id'));
    bgitemmenu(e, obj, this.parentNode.querySelector('.check_level'));
  })
  .on('click', '.bg_img', function () {
    let $this = $(this);
    let idx = $this.index('.bg_img');
    let arr = [];
    $bgList.find('.bg_img').each((idx, item) => {
      let $item = $(item);
      let u1 = $item.attr('data-src');
      let u2 = `${u1}&t=1`;
      arr.push({
        u2,
        u1,
      });
    });
    imgPreview(arr, idx);
  })
  .on('click', '.check_level', function () {
    checkedBg(this);
  });
function checkedBg(el) {
  const $this = $(el);
  let check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $bgItem = $bgList.find('.bg_item'),
    $checkArr = $bgItem.filter(
      (_, item) => $(item).find('.check_level').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $bgItem.length) {
    $bgFooter.find('span').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $bgFooter.find('span').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
longPress($bgList[0], '.bg_img', function (e) {
  let ev = e.changedTouches[0];
  let obj = getBgItem($(this).parent().data('id'));
  bgitemmenu(ev, obj, this.parentNode.querySelector('.check_level'));
});
$bgFooter
  .on('click', '.f_delete', function (e) {
    let $bgItem = $bgList.find('.bg_item'),
      $checkArr = $bgItem.filter(
        (_, item) => $(item).find('.check_level').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.data('id'));
    });
    delBg(e, arr);
  })
  .on('click', '.f_close', function () {
    let $bgItem = $bgList.find('.bg_item');
    $bgItem
      .find('.check_level')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $bgFooter.stop().slideUp(_speed);
  })
  .on('click', 'span', function () {
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $bgFooter.find('span').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    let $bgItem = $bgList.find('.bg_item');
    $bgItem
      .find('.check_level')
      .attr('check', che)
      .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
    _msg.botMsg(`选中：${che === 'y' ? $bgItem.length : 0}项`);
  });
function openbgku() {
  hideRightMenu();
  $allBgWrap.stop().slideDown(_speed, () => {
    bgxuanran(true);
  });
  setZidx($allBgWrap[0], 'bg', closeBgBox);
}
longPress($randomChangeBgBtn[0], function (e) {
  if (!_d.userInfo) return;
  const { bg, bgxs, bgObj } = _d.userInfo;
  let obj = isBigScreen() ? getIn(bgObj, [bg]) : getIn(bgObj, [bgxs]);
  if (!obj) return;
  let ev = e.changedTouches[0];
  hdHomeBgBtn(ev, obj);
});
function hdHomeBgBtn(e, obj) {
  let data = [
    {
      id: '2',
      text: '查看',
      beforeIcon: 'iconfont icon-yanjing_xianshi_o',
    },
    {
      id: '3',
      text: '下载壁纸',
      beforeIcon: 'iconfont icon-xiazai1',
    },
  ];
  if (_d.userInfo.account === 'root') {
    data.push({
      id: '1',
      text: '删除壁纸',
      beforeIcon: 'iconfont icon-shanchu',
    });
  }
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        delBg(e, [obj.id], () => {
          close();
          bgInterval();
        });
      } else if (id == '2') {
        close();
        imgPreview([
          {
            u1: getFilePath(`/bg/${obj.url}`),
            u2: getFilePath(`/bg/${obj.url}`, 1),
          },
        ]);
      } else if (id == '3') {
        close();
        downloadFile(
          getFilePath(`/bg/${obj.url}`),
          getPathFilename(obj.url)[0]
        );
      }
    },
    '壁纸选项'
  );
}
$randomChangeBgBtn
  .on(
    'click',
    throttle(function () {
      bgInterval();
    }, 2000)
  )
  .on('contextmenu', function (e) {
    e.preventDefault();
    if (!_d.userInfo) return;
    const { bg, bgxs, bgObj } = _d.userInfo;
    let obj = isBigScreen() ? getIn(bgObj, [bg]) : getIn(bgObj, [bgxs]);
    if (!obj || isMobile()) return;
    hdHomeBgBtn(e, obj);
  });

// 时间日期
let musicflagnum = 0;
let todoNum = 0;
function updateMusicInfo(history, y) {
  _postAjax(
    '/player/updatemusicinfo',
    {
      history,
      lastplay: musicobj,
      currentTime: $myAudio[0].currentTime,
      duration: musicobj.duration,
    },
    { load: false }
  )
    .then((result) => {
      if (result.code == 0) {
        if (y) {
          if (!$musicPlayerBox.is(':hidden')) {
            if (
              _d.music &&
              _d.music.findIndex((item) => item.id === $songListWrap.listId) ===
                0
            ) {
              renderMusicItem();
            }
          }
        }
        return;
      }
    })
    .catch((err) => {});
}
setInterval(showTime, 1000);
let updateUserTime = 0;
_getAjax('/user/updatetime', {}, { load: 0, stopErrorMsg: 1 })
  .then(() => {})
  .catch(() => {});
function showTime() {
  let arr = formatDate({
      template: '{0}-{1}-{2}-{3}-{4}-{5}-{6}',
      timestamp: +Date.now(),
    }).split('-'),
    [, , , hour, minute, second] = arr;
  if (
    (minute == 59 && second >= 30) ||
    (minute == 29 && second >= 30) ||
    (minute == 0 && second == 0) ||
    (minute == 30 && second == 0)
  ) {
    _msg.botMsg(`整点报时：${hour}:${minute}:${second}`, 1);
  }

  if (!$myAudio[0].paused) {
    //标题跑马灯
    let title = document.title,
      first = title.charAt(0),
      other = title.substring(1);
    document.title = other + first;
  }
  updateUserTime++;
  if (updateUserTime >= 20) {
    updateUserTime = 0;
    _getAjax('/user/updatetime', {}, { load: 0, stopErrorMsg: 1 })
      .then(() => {})
      .catch(() => {});
  }
  // 同步播放进度
  musicflagnum++;
  if (musicflagnum >= 10) {
    musicflagnum = 0;
    if (!$myAudio[0].paused && musicobj) {
      updateMusicInfo('n');
    }
  }
  todoNum++;
  if (todoNum >= 30 * 60) {
    todoNum = 0;
    todoMsg();
  }
}

//音乐播放器
let actionLrcIndex = 0,
  randomplay = true,
  musicarr,
  musicarrjl,
  musicobj = {};
//播放模式切换
function switchPlayMode() {
  if (!_d.music) return;
  if (_d.remoteState) {
    realtime.send({
      type: 'playmode',
      state: randomplay,
    });
  }
  var a;
  switch (randomplay) {
    case true:
      {
        randomplay = false;
        $myAudio.attr('loop', null);
        $lrcFootBtnWrap
          .find('.random_play_btn')
          .attr('class', 'random_play_btn iconfont icon-suiji');
        a = '随机播放';
        musicarr = myShuffle(deepClone(_d.playingList));
      }
      break;
    case false:
      {
        randomplay = 1;
        $myAudio.attr('loop', 'loop');
        $lrcFootBtnWrap
          .find('.random_play_btn')
          .attr('class', 'random_play_btn iconfont icon-ttpodicon');
        a = '单曲播放';
      }
      break;
    case 1:
      {
        randomplay = true;
        $myAudio.attr('loop', null);
        $lrcFootBtnWrap
          .find('.random_play_btn')
          .attr('class', 'random_play_btn iconfont icon-shunxubofang');
        a = '顺序播放';
        musicarr = deepClone(_d.playingList);
      }
      break;
  }
  _msg.info(a);
}
function openPlayingList() {
  playingListLoading();
  $playingListWrap.stop().fadeIn(100, () => {
    $pMusicListBox.stop().slideDown(_speed, () => {
      if (!_d.playingList) {
        _d.playingList = [];
      }
      let idx = _d.playingList.findIndex((v) => musicobj.id === v.id);
      if (idx >= 0) {
        playingPageNum = Math.ceil((idx + 1) / playingSize);
      } else {
        playingPageNum = 1;
      }
      renderPlayingList();
      playingListHighlight(true);
    });
  });
}
function playPrev() {
  let index;
  if (!_d.music) return;
  if (musicarr.length == 0) {
    _msg.error('播放列表为空');
    audioPause();
    return;
  }
  index = musicarr.findIndex((x) => x.id === musicobj.id);
  index--;
  index < 0 ? (index = musicarr.length - 1) : null;
  musicPlay(musicarr[index]);
}
function playNext() {
  $musicFootProgress.css({
    width: 0,
  });
  $lrcProgressBar.find('.pro2').width('0');
  let index;
  if (!_d.music) return;
  if (musicarr.length == 0) {
    _msg.error('播放列表为空');
    audioPause();
    return;
  }
  index = musicarr.findIndex((x) => x.id === musicobj.id);
  index++;
  index > musicarr.length - 1 ? (index = 0) : null;
  musicPlay(musicarr[index]);
}
function changePlayState() {
  if ($myAudio[0].paused) {
    audioPlay();
  } else {
    audioPause();
  }
}
$lrcFootBtnWrap
  .on('click', '.random_play_btn', switchPlayMode)
  .on('click', '.playing_list_btn', openPlayingList)
  .on('click', '.prev_play_btn', playPrev)
  .on('click', '.next_play', playNext)
  .on('click', '.play_btn', changePlayState);
$miniPlayer
  .on('click', '.play_btn', changePlayState)
  .on('click', '.next_btn', playNext)
  .on('click', '.prev_btn', playPrev)
  .on('mouseenter', function () {
    if (!musicobj.hash) return;
    $(this).attr('title', `${musicobj.artist} - ${musicobj.title}`);
  })
  .on('click', '.to_max', function () {
    showMusicPlayerBox();
  })
  .on('click', '.show_lrc', toggleMiniLrc);
function toggleMiniLrc() {
  $miniLrcWrap.fadeToggle(_speed)._isone = true;
  setZidx($miniLrcWrap[0]);
}
// 暂停
function audioPause() {
  $myAudio[0].pause();
  document.title = _d.myTitle;
  $lrcProgressBar.find('.dolt').css('animation-play-state', 'paused');
  $playingSongLogo.css('animation-play-state', 'paused');
  $musicFootBox
    .find('.right_btns .play_btn')
    .attr('class', 'play_btn iconfont icon-65zanting')
    .css('animation', 'none');
  $lrcFootBtnWrap
    .find('.play_btn')
    .attr('class', 'play_btn iconfont icon-65zanting')
    .css('animation', 'none');
  $miniPlayer
    .find('.play_btn')
    .attr('class', 'play_btn iconfont icon-65zanting')
    .css('animation', 'none');
}
//播放音乐
function audioPlay() {
  if (!$musicMvWrap.is(':hidden')) {
    closeMvBox();
  }
  if (!musicobj.hash) {
    _msg.error('请选择需要播放的歌曲');
    return;
  }
  if (_d.remoteState) {
    //远程播放
    realtime.send({
      type: 'play',
      state: 'y',
      obj: musicobj,
    });
  } else {
    document.title = `\xa0\xa0\xa0♪正在播放：${musicobj.artist} - ${musicobj.title}`;
    $myAudio[0].play();
    if ($myAudio[0]._rod.length === 0) {
      _renderLrc();
    }
  }
  //保持播放速度
  $myAudio[0].playbackRate = curPlaySpeed[1];
}

function videoPause() {
  $myVideo[0].pause();
}
function videoPlay() {
  audioPause();
  $myVideo[0].play();
}
const _renderLrc = debounce(renderLrc, 2000);
//歌词处理
$myAudio[0]._rod = [];
function renderLrc() {
  if (!musicobj.hash) return;
  const id = musicobj.id;
  _getAjax('/player/lrc', {
    id,
  })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let rod = result.data;
        if (id !== musicobj.id) return;
        rod = rod.map((item, idx) => {
          item.idx = idx;
          return item;
        });
        $myAudio[0]._rod = rod;
        let hasfy = !rod.every((item) => item.fy === '');
        if (hasfy) {
          $lrcMenuWrap.find('.lrc_translate_btn').stop().show(_speed);
        } else {
          $lrcMenuWrap.find('.lrc_translate_btn').stop().hide(_speed);
        }
        let str = '';
        rod.forEach((item) => {
          let { p, fy } = item;
          p = encodeHtml(p);
          fy = encodeHtml(fy);
          str += `<div>
          <p class="elrc">${p}</p>
          <p style="display: ${
            _getData('showfy') && hasfy ? 'block' : 'none'
          };" class="lrcfy">${fy}</p></div>`;
        });
        $lrcListWrap
          .find('.lrc_items')
          .css({
            'text-align': lrcstatu.statu,
            'font-size': percentToValue(14, 30, lrcstatu.size),
          })
          .html(str);
        setActionLrcIndex();
        lrcScroll(true);
      }
    })
    .catch((err) => {
      $myAudio[0]._rod = [];
    });
}
// 设置最接近播放进度的歌词索引
function setActionLrcIndex() {
  const cTime = Math.round($myAudio[0].currentTime);
  actionLrcIndex = getMinIndex(
    $myAudio[0]._rod.map((item) => Math.abs(cTime - item.t))
  );
}
function lrcScroll(y) {
  const $lrc = $lrcListWrap.find('.lrc_items');
  if ($myAudio[0]._rod.length === 0) return;
  let $lrcdiv = $lrc.children('div'),
    $activediv = $lrcdiv.eq(actionLrcIndex),
    wH = $lrcListWrap.outerHeight(),
    lrcmtop = parseFloat(
      window.getComputedStyle($lrc[0]).transform.slice(7).split(',').slice(-1)
    ),
    mtop = lrcmtop - _position($activediv[0]).top + wH * 0.4;
  $lrcdiv.removeClass('active');
  $activediv.addClass('active');
  if (y) {
    $lrc.css({
      transition: '0s',
      transform: `translateY(${mtop}px)`,
    });
  } else {
    $lrc.css({
      transition: 'transform .5s ease-in-out',
      transform: `translateY(${mtop}px)`,
    });
  }
}

$lrcListWrap.on('click', function () {
  if ($lrcFootWrap._flag !== 'y') return;
  if (this._isop) {
    $lrcListWrap.css('opacity', 1);
    $lrcBg.removeClass('open');
    this._isop = false;
  } else {
    $lrcListWrap.css('opacity', 0);
    $lrcBg.addClass('open');
    this._isop = true;
  }
});
// 音乐事件
let upprog = throttle(function () {
  $lrcProgressBar
    .find('.current_time')
    .text(formartSongTime($myAudio[0].currentTime));
  proTime($myAudio[0].currentTime / musicobj.duration, true);
}, 500);
let lrcCount = -1; //歌词计数
$myAudio
  .on('loadedmetadata', function () {
    //元数据加载完
  })
  .on('waiting', function () {
    //缺少数据加载效果
    if ($myAudio[0].paused) return;
    $lrcProgressBar
      .find('.dolt')
      .css('animation', 'bgcolor .3s infinite linear alternate');
    $miniPlayer
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-65zanting')
      .css('animation', 'fontcolor .5s infinite linear alternate');
    $lrcFootBtnWrap
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-65zanting')
      .css('animation', 'fontcolor .5s infinite linear alternate');
    $musicFootBox
      .find('.right_btns .play_btn')
      .attr('class', 'play_btn iconfont icon-65zanting')
      .css('animation', 'fontcolor .5s infinite linear alternate');
  })
  .on('playing', function () {
    //准备开始播放
    if ($myAudio[0].paused) return;
    $lrcProgressBar
      .find('.dolt')
      .css('animation', 'bgcolor 2s infinite linear alternate');
    $lrcFootBtnWrap
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-zanting')
      .css('animation', 'none');
    $miniPlayer
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-zanting')
      .css('animation', 'none');
    $musicFootBox
      .find('.right_btns .play_btn')
      .attr('class', 'play_btn iconfont icon-zanting')
      .css('animation', 'none');
    $playingSongLogo.css({
      animation: 'rotate360 8s infinite linear',
    });
  })
  .on('error', function () {
    _msg.error('歌曲加载失败');
    audioPause();
  })
  .on('ended', function () {
    if (randomplay === 1) return;
    playNext();
  })
  .on('timeupdate', function () {
    let times = this.currentTime,
      timm = Math.round(times);
    upprog();
    if ($myAudio[0]._flag == timm) return;
    let rod = $myAudio[0]._rod || [];
    rod
      .filter((item) => item.t == timm)
      .forEach((item, i) => {
        lrcCount++;
        $myAudio[0]._flag = timm;
        _setTimeout(() => {
          actionLrcIndex = item.idx;
          lrcCount--;
          if ($musicLrcWrap.css('transform') === 'none') {
            if (lrcCount > 0) {
              lrcScroll(true);
            } else {
              lrcScroll();
            }
          }
          let activep = '',
            activep1 = '',
            showfy = _getData('showfy');
          let curObj = rod[actionLrcIndex] || {},
            nextObj = rod[actionLrcIndex + 1] || {};
          let p = encodeHtml(curObj.p || ''),
            fy = encodeHtml(curObj.fy || ''),
            p1 = encodeHtml(nextObj.p || ''),
            fy1 = encodeHtml(nextObj.fy || '');
          activep = showfy
            ? `<p>${p}</p><p class='fy' style="font-size: 0.6em">${fy}</p>`
            : `<p>${p}</p>`;
          if (actionLrcIndex + 1 === rod.length) {
            activep1 = '';
          } else {
            activep1 = showfy
              ? `<p>${p1}</p><p class='fy' style="font-size: 0.6em">${fy1}</p>`
              : `<p>${p1}</p>`;
          }
          const $lb = $miniLrcWrap.find('.lrcbot');
          if ($lb.attr('x') === '0') {
            $lb.find('.one').html(activep).addClass('open');
            $lb.find('.tow').html(activep1).removeClass('open');
            $lb.attr('x', '1');
          } else {
            $lb.find('.one').html(activep1).removeClass('open');
            $lb.find('.tow').html(activep).addClass('open');
            $lb.attr('x', '0');
          }
        }, lrcCount * 100);
      });
  });

// 歌词设置样式和编辑
$editLrcWrap.find('textarea').on('keydown', function (e) {
  let key = e.key,
    ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && key === 's') {
    saveLrc();
    e.preventDefault();
  }
});
function closeEditLrcBox() {
  backWindow.remove('editlrc');
  toHide(
    $editLrcWrap[0],
    {
      to: 'bottom',
      scale: 'small',
    },
    () => {
      $editLrcWrap.find('textarea').val('');
    }
  );
  editLrcHeadContentScroll.close();
}
function saveLrc() {
  let val = $editLrcWrap.find('textarea').val();
  if ($editLrcWrap._val === val || _d.userInfo.account != 'root') return;
  $editLrcWrap._val = val;
  _postAjax('/player/editlrc', {
    id: $editLrcWrap._mobj.id,
    val,
  })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        $editLrcWrap._val = val;
        _msg.success(result.codeText);
        return;
      }
    })
    .catch((err) => {});
}
$editLrcWrap
  .on('click', '.close', function () {
    closeEditLrcBox();
  })
  .on('click', '.save', saveLrc);
// 进度条处理
function proTime(percent, y) {
  percent <= 0 ? (percent = 0) : percent >= 1 ? (percent = 1) : null;
  let val =
    (pro1.offsetWidth - dolt.offsetWidth) * percent +
    dolt.offsetWidth / 2 +
    'px';
  let per = percent * 100 + '%';
  if (dolt.offsetWidth) {
    pro2.style.width = val;
  } else {
    pro2.style.width = per;
  }
  $musicFootProgress.css({
    width: per,
  });
  if (!y) {
    $myAudio[0].currentTime = percent * musicobj.duration;
  }
}
function hideLrcBox() {
  $musicLrcWrap.removeClass('active');
}
//远程播放
$lrcHead
  .on('click', '.remote_play', function (e) {
    initMusicLrc();
    if (_d.remoteState) {
      _d.remoteState = !_d.remoteState;
      _msg.success('关闭远程播放');
      $lrcHead.find('.remote_play').removeClass('red');
      realtime.send({
        type: 'play',
        state: 'n',
      });
    } else {
      if (!musicobj.hash) return;
      _d.remoteState = !_d.remoteState;
      _msg.success('开启远程播放');
      $myAudio[0]._rod = [];
      audioPause();
      $lrcHead.find('.remote_play').addClass('red');
      realtime.send({
        type: 'play',
        state: 'y',
        obj: musicobj,
      });
    }
  })
  .on('click', '.close', hideLrcBox)
  .on('click', '.artist_name_text', function (e) {
    e.stopPropagation();
    musicSearchInput.setValue(musicobj.artist);
  });
//歌单播放
function musicobjInit(obj) {
  obj = deepClone(obj);
  obj.title || (obj.title = '真相永远只有一个！');
  obj.artist || (obj.artist = '江户川柯南');
  obj.ppic = getFilePath(`/music/${obj.pic}`);
  obj.uurl = getFilePath(`/music/${obj.url}`);
  obj.mmv = getFilePath(`/music/${obj.mv}`);
  return obj;
}
function initMusicLrc() {
  actionLrcIndex = 0;
  $miniLrcWrap.find('.lrcbot').find('.one').text('');
  $miniLrcWrap.find('.lrcbot').find('.tow').text('');
  $myAudio[0]._rod = [];
  $lrcListWrap.find('.lrc_items').html('');
}
let playtimer = null;
function musicPlay(obj) {
  if (playtimer) {
    clearTimeout(playtimer);
    playtimer = null;
  }
  musicobj = musicobjInit(obj); //初始化音乐数据
  if (!musicobj.hash) {
    _msg.error('请选择需要播放的歌曲');
    return;
  }
  $myAudio[0].currentTime = 0; //时间进度归零
  $lrcProgressBar.find('.total_time').text(formartSongTime(musicobj.duration));
  $musicFootProgress.css({ width: 0 });
  $lrcBg.addClass('lrcbgss'); //背景透明
  $musicPlayerBg.addClass('lrcbgss');
  $playingSongLogo.css('animation', 'none');
  updateMusicShowInfo();
  initMusicLrc();
  toggleLrcMenuWrapBtnsState();
  // 高亮显示正在播放歌曲
  songListHighlight(false);
  playingListHighlight(false);
  let a = `♪♪ ${musicobj.artist} - ${musicobj.title}`;
  _msg.info(a, (type) => {
    if (type == 'click') {
      if ($musicPlayerBox.is(':hidden')) {
        showMusicPlayerBox();
      }
    }
  });
  audioPlay();
  playtimer = setTimeout(() => {
    clearTimeout(playtimer);
    playtimer = null;
    if (!_d.remoteState) {
      //未开启远程
      musicflagnum = 0; //初始化倒计时
      updateMusicInfo('y', 1);
    }
  }, 2000);
}

// 播放列表相关
$musicFootBox
  .on('click', '.right_btns .playing_list_btn', openPlayingList)
  .on('click', '.right_btns .next_btn', playNext)
  .on('click', '.right_btns .play_btn', changePlayState)
  .on('click', '.playing_song_info', function () {
    showLrcBox();
  });

function playingListLoading() {
  let str = ``;
  new Array(50).fill(null).forEach(() => {
    str += `<li style="pointer-events: none;margin: 2px 0;" class="song_item"></li>`;
  });
  $pMusicListBox.find('.p_foot').html(str);
}

//处理播放列表
let playingPageNum = 1;
let playingSize = 100;
function getPlayingItemData(id) {
  return _d.playingList.find((item) => item.id == id);
}
function renderPlayingList() {
  if ($pMusicListBox.is(':hidden')) return;
  $pMusicListBox._checked = true;
  switchPlayingChecked();
  let scObj = getCollectSongs();
  let str = '';
  if (!_d.playingList || _d.playingList.length == 0) {
    $pMusicListBox.find('.left').text(`正在播放(0)`);
    $pMusicListBox
      .find('.p_foot')
      .html(
        `<p style="padding: 20px 0;text-align: center;pointer-events: none;">${_d.emptyList}</p>`
      );
    return;
  }
  $pMusicListBox.find('.left').text(`正在播放(${_d.playingList.length})`);
  let totalPage = Math.ceil(_d.playingList.length / playingSize);
  playingPageNum < 1
    ? (playingPageNum = totalPage)
    : playingPageNum > totalPage
    ? (playingPageNum = 1)
    : null;
  let arr = _d.playingList.slice(
    (playingPageNum - 1) * playingSize,
    playingPageNum * playingSize
  );
  arr.forEach((v) => {
    let { title, artist, mv, id, pic } = v;
    let issc = scObj.hasOwnProperty(id);
    title = encodeHtml(title);
    artist = encodeHtml(artist);
    str += `<li class="song_item" cursor data-id="${id}" data-issc="${issc}">
            <div cursor="" check="n" class="check_state"></div>
          <div class="logo_wrap">
          <div class="logo" data-src="${getFilePath(`/music/${pic}`, 1)}"></div>
          <img class="play_gif" src="${imgWave}">
          </div>
          <div class="song_info_wrap">
          <span class = "song_name">${title}</span>
          <span class="artist_name"><i class="artist_name_text">${artist}</i></span>
          </div>
          ${mv ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
          <div class="like_hear iconfont ${
            issc ? 'icon-hear-full active' : 'icon-hear'
          }"></div>
          <div cursor class="del iconfont icon-guanbi"></div>
        </li>`;
  });
  str += `<div style="padding:20px 0;text-align:center;line-height: 26px;" class="playing_list_paging jzxz">
      ${
        totalPage > 1
          ? `<span cursor class="prev_page iconfont icon-prev"></span>
      <span cursor class="input_num" style="margin:0 30px">${playingPageNum}/${totalPage}</span>
      <span cursor class="next_page iconfont icon-page-next"></span>`
          : ''
      }
    </div>`;
  $pMusicListBox.find('.p_foot').html(str);
  pLazyImg.bind(
    $pMusicListBox.find('.p_foot')[0].querySelectorAll('.logo'),
    musicLoadImg
  );
}
const pLazyImg = new LazyLoad();
const lLazyImg = new LazyLoad();
const mLazyImg = new LazyLoad();
const sLazyImg = new LazyLoad();
function unMusicLoadImg() {
  pLazyImg.unBind();
  lLazyImg.unBind();
  mLazyImg.unBind();
  sLazyImg.unBind();
}
function musicLoadImg(item) {
  const $img = $(item);
  const u = $img.attr('data-src');
  imgjz(
    u,
    () => {
      $img.css('background-image', `url(${u})`).addClass('load');
    },
    () => {
      $img.css('background-image', `url(${imgMusic})`).addClass('load');
    }
  );
}
function shareSongList(e, arr, cb) {
  createShare(e, { title: '分享歌曲' }, ({ close, inp }) => {
    const { title, pass, valid } = inp;
    _postAjax('/player/musicshare', { list: arr, title, pass, valid })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          close(1);
          cb && cb();
          openIframe(`/sharelist`, '分享列表');
        }
      })
      .catch((err) => {});
  });
}
function switchPlayingChecked() {
  if ($pMusicListBox._checked) {
    $pMusicListBox._checked = false;
    $pMusicListBox.find('.p_foot_menu').stop().slideUp(_speed);
    $pMusicListBox.find('.check_state').css('display', 'none');
  } else {
    $pMusicListBox._checked = true;
    $pMusicListBox
      .find('.p_foot_menu')
      .stop()
      .slideDown(_speed)
      .find('div')
      .attr({
        class: 'iconfont icon-xuanzeweixuanze',
        check: 'n',
      });
    $pMusicListBox
      .find('.check_state')
      .css({
        display: 'block',
        'background-color': 'transparent',
      })
      .attr('check', 'n');
  }
}
longPress($pMusicListBox.find('.p_foot')[0], '.song_item', function (e) {
  if (!$pMusicListBox._checked) {
    switchPlayingChecked();
    checkedPlayingListItem(this.querySelector('.check_state'));
  }
});
//清空播放列表
$pMusicListBox
  .on('click', '.check_btn', switchPlayingChecked)
  .on('click', '.p_foot_menu div', function () {
    let $this = $(this);
    let state = $this.attr('check');
    state = state == 'y' ? 'n' : 'y';
    let $item = $pMusicListBox.find('.check_state');
    $this.attr({
      class:
        state == 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: state,
    });
    $item
      .attr('check', state)
      .css('background-color', state == 'y' ? _d.checkColor : 'transparent');
    _msg.botMsg(`选中：${state == 'y' ? $item.length : 0}项`);
  })
  .on('click', '.delete_btn', function () {
    let arr = getPlayingListCheck();
    if (arr.length == 0) return;
    let obj = {};
    arr.forEach((item) => {
      obj[item] = true;
    });
    _d.playingList = _d.playingList.filter((v) => !obj[v.id]);
    musicarr = musicarr.filter((v) => !obj[v.id]);
    renderPlayingList();
    playingListHighlight();
    updatePlayingList();
  })
  .on('click', '.move_btn', function (e) {
    let arr = getPlayingListCheck();
    if (arr.length == 0) return;
    moveSongToList(e, 'all', arr);
  })
  .on('click', '.collect_songs_btn', function (e) {
    let arr = getPlayingListCheck();
    if (arr.length == 0) return;
    songCollect(arr);
  })
  .on('click', '.close', function () {
    $pMusicListBox._checked = true;
    switchPlayingChecked();
  })
  .on('click', '.clear_playing_list', function (e) {
    if (_d.playingList.length == 0) return;
    _d.playingList = [];
    musicarr = [];
    renderPlayingList();
    updatePlayingList();
  })
  .on('click', '.share_playing_list', function (e) {
    let arr = _d.playingList.map((item) => item.id);
    if (arr.length == 0) {
      _msg.error('播放列表为空');
      return;
    }
    shareSongList(e, arr);
  });
function songCloseCollect(id, cb) {
  _postAjax('/player/closecollectsong', { id })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        _msg.success(result.codeText);
        cb && cb();
        renderMusicList();
        return;
      }
    })
    .catch((err) => {});
}
function songCollect(arr, cb) {
  _postAjax('/player/collectsong', {
    ar: arr,
  })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        renderMusicList();
        _msg.success(result.codeText);
        cb && cb();
        return;
      }
    })
    .catch((err) => {});
}
//选择播放列表歌曲播放
function playPlayingList(id, e) {
  let obj = getPlayingItemData(id);
  if (musicobj.id == obj.id) {
    changePlayState();
    return;
  }
  changePlayingAnimate(e);
  musicPlay(obj);
}
function checkedPlayingListItem(el) {
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $item = $pMusicListBox.find('.song_item');
  let $checkArr = $item.filter(
    (_, item) =>
      $(item).attr('data-id') &&
      $(item).find('.check_state').attr('check') === 'y'
  );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $item.length) {
    $pMusicListBox.find('.p_foot_menu div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $pMusicListBox.find('.p_foot_menu div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
function getPlayingListCheck() {
  let res = [];
  $pMusicListBox.find('.check_state').each((_, item) => {
    if (item.getAttribute('check') === 'y') {
      res.push(item.parentNode.dataset.id);
    }
  });
  return res;
}
$pMusicListBox
  .find('.p_foot')
  .on('click', '.check_state', function (e) {
    checkedPlayingListItem(this);
  })
  .on('contextmenu', '.song_item', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    if (!$pMusicListBox._checked) {
      switchPlayingChecked();
      checkedPlayingListItem(this.querySelector('.check_state'));
    }
  })
  .on('click', '.song_info_wrap', function (e) {
    let $this = $(this).parent();
    playPlayingList($this.attr('data-id'), e);
  })
  .on('click', '.artist_name_text', function (e) {
    e.stopPropagation();
    musicSearchInput.setValue(this.innerText);
    $pMusicListBox.css('display', 'none').find('.p_foot').html('');
    $playingListWrap.css('display', 'none');
  })
  .on('click', '.play_mv', function () {
    let $this = $(this).parent();
    let sobj = getPlayingItemData($this.attr('data-id'));
    musicMv(sobj);
  })
  .on('click', '.prev_page', function () {
    playingPageNum--;
    $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
    renderPlayingList();
    playingListHighlight();
  })
  .on('click', '.next_page', function () {
    playingPageNum++;
    $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
    renderPlayingList();
    playingListHighlight();
  })
  .on('click', '.input_num', function (e) {
    inputPageNo(e, { value: playingPageNum }, (val) => {
      playingPageNum = val;
      $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
      renderPlayingList();
      playingListHighlight();
    });
  })
  .on('click', '.del', function (e) {
    e.stopPropagation();
    let $this = $(this);
    let id = $this.parent().attr('data-id');
    _d.playingList = _d.playingList.filter((v) => v.id !== id);
    musicarr = musicarr.filter((v) => v.id !== id);
    renderPlayingList();
    playingListHighlight();
    updatePlayingList();
  })
  .on('click', '.logo_wrap', function (e) {
    let $this = $(this).parent();
    playPlayingList($this.attr('data-id'), e);
  })
  .on(
    'click',
    '.like_hear',
    throttle(function () {
      let $this = $(this).parent();
      let issc = $this.attr('data-issc');
      let sobj = getPlayingItemData($this.attr('data-id'));
      if (issc == 'true') {
        songCloseCollect(sobj.id);
      } else {
        songCollect([sobj.id]);
      }
    }, 2000)
  );
const updatePlayingList = debounce(function () {
  _postAjax('/player/updateplaying', {
    data: _d.playingList.map((item) => item.id),
  })
    .then((result) => {})
    .catch((err) => {});
}, 1000);
function playingListHighlight(isPosition) {
  if ($pMusicListBox.is(':hidden') || !musicobj.hash || !_d.playingList) return;
  let $song_item = $pMusicListBox.find('.p_foot').find('.song_item');
  $song_item.removeClass('active').find('.play_gif').removeClass('show');
  let y = Array.prototype.findIndex.call(
    $song_item,
    (item) => item.dataset.id == musicobj.id
  );
  if (y < 0) return;
  let cur = $song_item.eq(y);
  if (isPosition) {
    let sp =
      $pMusicListBox.find('.p_foot').scrollTop() + cur.position().top - 42;
    $pMusicListBox.find('.p_foot').scrollTop(sp);
  }
  cur.addClass('active').find('.play_gif').addClass('show');
}

//隐藏播放列表
$playingListWrap.on('click', function (e) {
  if (_getTarget(this, e, '.playing_list_mask', 1)) {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox.stop().slideUp(_speed, () => {
      $playingListWrap.stop().fadeOut(100);
    });
  }
});
const musicSearchInput = wrapInput(
  $musicHeadWrap.find('.search_music_inp input')[0],
  {
    focus(target) {
      $(target).parent().addClass('focus');
    },
    blur(target) {
      $(target).parent().removeClass('focus');
    },
    change(val) {
      if (val.trim() == '') {
        $musicHeadWrap.find('.search_music_inp i').css('display', 'none');
        $searchMusicWrap.css('display', 'none').find('ul').html('');
      } else {
        $musicHeadWrap.find('.search_music_inp i').css('display', 'block');
        $searchMusicWrap.css('display', 'block');
        searchMusicPageNo = 1;
        loadingImg($searchMusicWrap.find('ul')[0]);
      }
      _renderSearchMusicList();
    },
  }
);
// 音乐返回按钮
function hideMusicPlayBox() {
  backWindow.remove('music');
  if (isBigScreen()) {
    if (!$musicPlayerBox.is(':hidden')) {
      $miniPlayer.stop().show(_speed);
      setZidx($miniPlayer[0]);
      if (!$miniLrcWrap._isone) {
        $miniLrcWrap.stop().fadeIn(_speed);
        setZidx($miniLrcWrap[0]);
      }
    }
  }
  toHide($musicPlayerBox[0], { to: 'bottom', scale: 'small' }, () => {
    $songItemsBox.html('');
    $songListUl.html('');
    closeMusicTitleScroll();
    unMusicLoadImg();
  });
}
function closeMusicPlayer() {
  toHide($musicPlayerBox[0], { to: 'bottom', scale: 'small' }, () => {
    backWindow.remove('music');
    $songItemsBox.html('');
    $songListUl.html('');
    closeMusicTitleScroll();
    unMusicLoadImg();
  });
  closeMvBox();
  closeEditLrcBox();
  musicMvContentScroll.close();
  $miniPlayer.stop().hide(_speed);
  $miniLrcWrap.stop().fadeOut(_speed);
  audioPause();
  videoPause();
}
function musicBackBtn() {
  if (!$searchMusicWrap.is(':hidden')) {
    musicSearchInput.setValue('');
  } else if ($musicLrcWrap.css('transform') === 'none') {
    hideLrcBox();
  } else if (
    $msuicContentBox.find('.list_items_wrap').css('transform') === 'none'
  ) {
    $songListWrap.listId = '';
    $songListWrap.removeClass('open');
    $msuicContentBox.find('.list_items_wrap').removeClass('open');
    _setTimeout(() => {
      $songItemsBox.html('');
    }, 800);
    $musicHeadWrap.find('.song_list_name').css('opacity', 0);
  } else if (!$musicPlayerBox.is(':hidden')) {
    if (!isBigScreen()) {
      toHide($musicPlayerBox[0], { to: 'bottom', scale: 'small' }, () => {
        $songItemsBox.html('');
        $songListUl.html('');
        closeMusicTitleScroll();
        unMusicLoadImg();
      });
    } else {
      hideMusicPlayBox();
    }
  }
}
$musicHeadWrap
  .on('click', '.back', musicBackBtn)
  .on('click', '.close', closeMusicPlayer)
  .on('click', '.hide', hideMusicPlayBox)
  .on('click', '.search_music_inp i', function () {
    musicSearchInput.setValue('');
    musicSearchInput.target.focus();
  })
  .on('click', '.volume', function (e) {
    _progressBar(
      e,
      curPlayVol,
      throttle(function (per, type) {
        curPlayVol = per;
        vobellm();
        if (type === 'up') {
          if (_d.remoteState) {
            realtime.send({
              type: 'vol',
              value: curPlayVol,
            });
          }
        }
      }, 500)
    );
  });
$document
  .on('mousedown', (e) => {
    if (isMobile()) return;
    hdZidx(e);
  })
  .on('touchstart', (e) => {
    if (!isMobile()) return;
    hdZidx(e.changedTouches[0]);
  });
//层级处理
function hdZidx(e) {
  if (_getTarget(this, e, '.search_box_wrap')) {
    setZidx($searchBoxMask[0], 'search', hideSearchBox);
  } else if (_getTarget(this, e, '.music_player_box')) {
    setZidx($musicPlayerBox[0], 'music', hideMusicPlayBox);
  } else if (_getTarget(this, e, '.mini_player')) {
    setZidx($miniPlayer[0]);
  } else if (_getTarget(this, e, '.mini_lrc_wrap')) {
    setZidx($miniLrcWrap[0]);
  } else if (_getTarget(this, e, '.music_mv_wrap')) {
    setZidx($musicMvWrap[0], 'mv', closeMvBox);
  } else if (_getTarget(this, e, '.todo_box')) {
    setZidx($todoBox[0], 'todo', closeTodoBox);
  } else if (_getTarget(this, e, '.chat_room_wrap')) {
    setZidx($chatRoomWrap[0], 'chat', closeChatRoom);
  } else if (_getTarget(this, e, '.edit_lrc_wrap')) {
    setZidx($editLrcWrap[0], 'editlrc', closeEditLrcBox);
  } else if (_getTarget(this, e, '.all_bg_wrap')) {
    setZidx($allBgWrap[0], 'bg', closeBgBox);
  } else if (_getTarget(this, e, '.userinfobox')) {
    setZidx($userInfoWrap[0], 'userinfo', hideUserInfo);
  } else if (_getTarget(this, e, '.clock')) {
    setZidx($clock[0]);
  }
}
$document
  .on('click', function (e) {
    if (!_getTarget(this, e, '.search_box_mask .content')) {
      $searchInpWrap.find('.search_list_box').css('display', 'none');
      $searchInpWrap.find('.content').removeClass('active');
    }
  })
  .on('contextmenu', function (e) {
    if (_getTarget(this, e, '#main', 1)) {
      e.preventDefault();
      if (isMobile()) return;
      settingMenu(e, 1);
    }
  });
longPress(document, '#main', function (e) {
  let ev = e.changedTouches[0];
  if (_getTarget(this, ev, '#main', 1)) {
    settingMenu(ev, 1);
  }
});
let searchMusicList = [];
let searchMusicPageNo = 1;
function getSearchSongItemData(id) {
  return searchMusicList.find((item) => item.id == id);
}
$searchMusicWrap.splitWord = '';
let _renderSearchMusicList = debounce(renderSearchMusicList, 1000);
function renderSearchMusicList(update) {
  let a = musicSearchInput.getValue('').trim();
  if (a !== '') {
    _getAjax('/player/search', { a })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          let { list: arr, splitWord } = result.data;
          searchMusicList = arr;
          $searchMusicWrap.splitWord = splitWord;
          if (arr.length > 0) {
            if (!update) {
              $searchMusicWrap.find('ul').html('');
            }
            rSearchMusicList(arr, update);
          } else {
            $searchMusicWrap
              .find('ul')
              .html(
                `<p style="padding: 20px 0;text-align: center;pointer-events: none;">${_d.emptyList}</p>`
              );
          }
          return;
        }
      })
      .catch((err) => {});
  }
}
function getCollectSongs() {
  let obj = {};
  if (_d.music) {
    obj = _d.music[1].item.reduce((total, item) => {
      total[item.id] = 'y';
      return total;
    }, {});
  }
  return obj;
}
function rSearchMusicList(list, update) {
  let val = $searchMusicWrap.splitWord;
  let arr = [];
  if (update) {
    arr = list.slice(0, searchMusicPageNo * 50);
  } else {
    arr = list.slice((searchMusicPageNo - 1) * 50, searchMusicPageNo * 50);
  }
  if (arr.length == 0) return;
  if ($musicPlayerBox.is(':hidden') || $searchMusicWrap.is(':hidden')) return;
  let scObj = getCollectSongs();
  let str = '';
  arr.forEach((v) => {
    let { artist, title, mv, id, pic } = v;
    let issc = scObj.hasOwnProperty(id);
    str += `<li class="song_item" data-id="${id}" data-issc="${issc}" cursor>
          <div class="add_palying_list iconfont icon-icon-test"></div>
          <div class="logo_wrap">
          <div class="logo" data-src="${getFilePath(`/music/${pic}`, 1)}"></div>
          </div>
          <div class="song_info_wrap">
            <span class="song_name">${hdTitleHighlight(val, title)}</span>
            <span class="artist_name">${hdTitleHighlight(val, artist)}</span>
          </div>
          ${mv ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
          <div class="like_hear iconfont ${
            issc ? 'icon-hear-full active' : 'icon-hear'
          }"></div>
          <div class="set_menu iconfont icon-icon"></div>
        </li>`;
  });
  if (update) {
    $searchMusicWrap.find('ul').html(str);
  } else {
    $searchMusicWrap.find('ul').append(str);
  }
  sLazyImg.bind(
    $searchMusicWrap.find('ul')[0].querySelectorAll('.logo'),
    musicLoadImg
  );
}
function diffPlayingList(arr) {
  const res =
    _d.playingList.length !== arr.length ||
    !arr.every(
      (item, idx) =>
        item.id === _d.playingList[idx].id &&
        item.title === _d.playingList[idx].title &&
        item.artist === _d.playingList[idx].artist
    );
  return res;
}
function delSong(e, pid, arr, title, cb, text) {
  let opt = {};
  if (title == 'del') {
    opt = {
      e,
      text: `确认删除${text ? `：${text}` : ''}？`,
      confirm: { type: 'danger', text: '删除' },
    };
  } else if (title == 'clean') {
    opt = { e, text: '确认清空？' };
  } else {
    opt = { e, text: `确认移除${text ? `：${text}` : ''}？` };
  }
  _pop(opt, (type) => {
    if (type == 'confirm') {
      _postAjax('/player/delsong', {
        id: pid,
        ar: arr,
      })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _msg.success(result.codeText);
            renderMusicList();
            cb && cb();
          }
        })
        .catch((err) => {});
    }
  });
}
function moveSongToList(e, pid, ar) {
  let str = '';
  let cIdx = 0;
  _d.music.forEach((v, i) => {
    if (v.id == pid) {
      cIdx = i;
    }
    if (i < 3 || v.id == pid) return;
    let name = encodeHtml(v.name),
      pic = getFilePath(v.pic, 1);
    if (v.pic == 'history') {
      pic = imgHistory;
    } else if (v.pic == 'default') {
      pic = imgMusic;
    }
    str += `<div data-name="${name}" cursor class="item" data-id="${v.id}"><img style="width: 40px;height: 40px;border-radius: 4px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
  });
  if (str == '') {
    _msg.error('没有可选歌单');
    return;
  }
  rightMenu(
    e,
    str,
    function ({ close, box, e }) {
      let _this = _getTarget(box, e, '.item');
      if (_this) {
        let $this = $(_this),
          tid = $this.attr('data-id'),
          listname = $this.attr('data-name');
        _pop(
          {
            e,
            text: `确认${
              pid == 'all' || cIdx < 3 ? '添加到' : '移动到'
            } ${listname}？`,
          },
          (type) => {
            if (type == 'confirm') {
              _postAjax('/player/songtolist', {
                id: pid,
                tid,
                ar,
              })
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    close(true);
                    _msg.success(result.codeText);
                    renderMusicList();
                    return;
                  }
                })
                .catch((err) => {});
            }
          }
        );
      }
    },
    `${pid == 'all' || cIdx < 3 ? '添加歌曲' : '移动歌曲'}到歌单`
  );
}
function editSongInfo(e, sobj) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        artist: {
          value: sobj.artist,
          beforeText: '歌手名：',
          placeholder: '歌手名',
          verify(val) {
            if (val.trim() == '') {
              return '请输入歌手名';
            }
          },
        },
        name: {
          value: sobj.title,
          beforeText: '歌曲名：',
          placeholder: '歌曲名',
          verify(val) {
            if (val.trim() == '') {
              return '请输入歌曲名';
            }
          },
        },
        album: {
          value: sobj.album,
          placeholder: '专辑',
          beforeText: '专辑：',
          verify(val) {
            if (val.trim() == '') {
              return '请输入专辑名';
            }
          },
        },
        year: {
          value: sobj.year,
          placeholder: '年份',
          beforeText: '年份：',
          verify(val) {
            if (val.trim() == '') {
              return '请输入发布年份';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let newName = inp.name;
        let newArtist = inp.artist;
        let newAlbum = inp.album;
        let newYear = inp.year;
        if (
          newName + newArtist + newAlbum + newYear ==
          sobj.title + sobj.artist + sobj.album + sobj.year
        )
          return;
        _postAjax('/player/editsong', {
          id: sobj.id,
          title: newName,
          artist: newArtist,
          album: newAlbum,
          year: newYear,
        })
          .then((res) => {
            if (res.code == 0) {
              close(true);
              _msg.success(res.codeText);
              renderMusicList();
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '编辑歌曲信息'
  );
}
function showSongInfo(e, sobj) {
  _getAjax('/player/getsonginfo', { id: sobj.id })
    .then((res) => {
      if (res.code == 0) {
        let {
          title,
          artist,
          duration,
          album,
          year,
          collect_count,
          play_count,
          creat_time,
        } = res.data;
        let data = [
          {
            text: title,
            beforeText: '歌曲：',
          },
          {
            text: artist,
            beforeText: '歌手：',
          },
          {
            text: album || '--',
            beforeText: '专辑：',
          },
          {
            text: year || '--',
            beforeText: '发布年份：',
          },
          {
            text: formartSongTime(duration),
            beforeText: '时长：',
          },
          {
            text: formatNum(play_count),
            beforeText: '播放量：',
          },
          {
            text: formatNum(collect_count),
            beforeText: '收藏量：',
          },
          {
            text: formatDate({
              template: `{0}-{1}-{2}`,
              timestamp: creat_time,
            }),
            beforeText: '添加时间：',
          },
        ];
        data.forEach((item, idx) => {
          (item.pointer = false), (item.id = idx + 1);
        });
        selectMenu(e, data, false, '歌曲信息');
      }
    })
    .catch((err) => {});
}
function delMv(e, id, cb, text) {
  if (_d.userInfo.account !== 'root') return;
  _pop(
    {
      e,
      text: `确认删除MV${text ? `：${text}` : ''}？`,
      confirm: { type: 'danger', text: '删除' },
    },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/player/delmv', { id })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              _msg.success(result.codeText);
              renderMusicList();
              cb && cb();
            }
          })
          .catch((err) => {});
      }
    }
  );
}
function searchListSongSetting(e, sobj) {
  sobj = musicobjInit(sobj);
  let data = [
    {
      id: '1',
      text: '分享歌曲',
      beforeIcon: 'iconfont icon-fenxiang_2',
    },
    {
      id: '2',
      text: '复制歌曲名',
      beforeIcon: 'iconfont icon-fuzhi',
    },
    {
      id: '3',
      text: '编辑歌词',
      beforeIcon: 'iconfont icon-bianji',
    },
    {
      id: '4',
      text: '封面',
      beforeIcon: 'iconfont icon-tupian',
    },
    {
      id: '5',
      text: '歌曲信息',
      beforeIcon: 'iconfont icon-about',
    },
    {
      id: '6',
      text: '添加到',
      beforeIcon: 'iconfont icon-icon-test',
    },
    {
      id: '7',
      text: '下载',
      beforeIcon: 'iconfont icon-xiazai1',
    },
  ];
  data.push({
    id: '12',
    text: '上传 MV',
    beforeIcon: 'iconfont icon-shangchuan1',
  });
  if (_d.userInfo.account === 'root') {
    data.push({
      id: '11',
      text: '上传封面',
      beforeIcon: 'iconfont icon-shangchuan1',
    });
    data.push({
      id: '8',
      text: '编辑歌曲信息',
      beforeIcon: 'iconfont icon-bianji',
    });
    if (sobj.mv) {
      data.push({
        id: '10',
        text: '删除 MV',
        beforeIcon: 'iconfont icon-shanchu',
      });
    }
    data.push({
      id: '9',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    });
  }
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        shareSongList(e, [sobj.id]);
      } else if (id == '9') {
        delSong(
          e,
          'all',
          [sobj.id],
          'del',
          () => {
            close();
          },
          `${sobj.artist} - ${sobj.title}`
        );
      } else if (id == '7') {
        close();
        let fname = `${sobj.artist} - ${sobj.title}`;
        downloadFile(sobj.uurl, `${fname}.${getSuffix(sobj.url)[1]}`);
      } else if (id == '6') {
        moveSongToList(e, 'all', [sobj.id]);
      } else if (id == '2') {
        close();
        copyText(sobj.artist + ' - ' + sobj.title);
      } else if (id == '8') {
        if (_d.userInfo.account != 'root') return;
        editSongInfo(e, sobj);
      } else if (id == '3') {
        close();
        showEditLrc(sobj);
      } else if (id == '4') {
        close();
        sobj = musicobjInit(sobj);
        let u1 = sobj.ppic;
        imgPreview([
          {
            u1,
            u2: `${u1}&t=1`,
          },
        ]);
      } else if (id == '5') {
        showSongInfo(e, sobj);
      } else if (id == '10') {
        delMv(
          e,
          sobj.id,
          () => {
            close();
          },
          `${sobj.artist} - ${sobj.title}`
        );
      } else if (id == '11') {
        close();
        updateSongCover(sobj);
      } else if (id == '12') {
        close();
        upMv(sobj);
      }
    },
    `${sobj.artist} - ${sobj.title}`
  );
}
function playSearchList(id, e) {
  let obj = getSearchSongItemData(id);
  if (diffPlayingList(searchMusicList)) {
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(searchMusicList))
        : deepClone(searchMusicList);
    _d.playingList = deepClone(searchMusicList);
    renderPlayingList();
    updatePlayingList();
  }
  if (musicobj.id == obj.id) {
    changePlayState();
    return;
  }
  changePlayingAnimate(e);
  musicPlay(obj);
}
$searchMusicWrap
  .find('ul')
  .on(
    'scroll',
    debounce(function () {
      if (this.clientHeight + this.scrollTop > this.scrollHeight - 50) {
        searchMusicPageNo++;
        rSearchMusicList(searchMusicList);
      }
    }, 500)
  )
  .on('click', '.song_info_wrap', function (e) {
    let $this = $(this).parent();
    playSearchList($this.attr('data-id'), e);
  })
  .on('click', '.set_menu', function (e) {
    let $this = $(this).parent();
    let sobj = getSearchSongItemData($this.attr('data-id'));
    searchListSongSetting(e, sobj);
  })
  .on('click', '.add_palying_list', function (e) {
    let $this = $(this).parent();
    let mobj = getSearchSongItemData($this.attr('data-id'));
    _d.playingList.push(mobj);
    musicarr.push(mobj);
    _d.playingList.reverse();
    musicarr.reverse();
    _d.playingList = unique(_d.playingList, ['id']);
    musicarr = unique(musicarr, ['id']);
    _d.playingList.reverse();
    musicarr.reverse();
    renderPlayingList();
    playingListHighlight();
    updatePlayingList();
    changePlayingAnimate(e);
  })
  .on(
    'click',
    '.like_hear',
    throttle(function () {
      let $this = $(this).parent();
      let issc = $this.attr('data-issc');
      let sobj = getSearchSongItemData($this.attr('data-id'));
      if (issc == 'true') {
        songCloseCollect(sobj.id);
      } else {
        songCollect([sobj.id]);
      }
    }, 2000)
  )
  .on('click', '.play_mv', function () {
    let $this = $(this).parent();
    let sobj = getSearchSongItemData($this.attr('data-id'));
    if (diffPlayingList(searchMusicList)) {
      musicarr =
        randomplay === false
          ? myShuffle(deepClone(searchMusicList))
          : deepClone(searchMusicList);
      _d.playingList = deepClone(searchMusicList);
      updatePlayingList();
    }
    musicMv(sobj);
  })
  .on('click', '.logo_wrap', function (e) {
    let $this = $(this).parent();
    playSearchList($this.attr('data-id'), e);
  });
$searchMusicWrap.on('click', function (e) {
  if (_getTarget(this, e, '.search_music_wrap', 1)) {
    musicSearchInput.setValue('');
  }
});
//进度条
var probox = $lrcProgressBar.find('.probox')[0],
  pro1 = $lrcProgressBar.find('.pro1')[0],
  pro2 = $lrcProgressBar.find('.pro2')[0],
  dolt = $lrcProgressBar.find('.dolt')[0],
  mmlist = $musicPlayerBox[0];
probox.addEventListener('touchstart', function (e) {
  $lrcProgressBar.find('.dolt').addClass('open');
  $lrcProgressBar.find('.pro1').addClass('open');
  let percent;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let ev = e.targetTouches[0];
    let a = pro1.offsetLeft + mmlist.offsetLeft;
    percent =
      (ev.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(percent);
  }
  function mend(e) {
    if (_d.remoteState) {
      realtime.send({
        type: 'progress',
        value: percent,
      });
    }
    setActionLrcIndex();
    lrcScroll();
    $lrcProgressBar.find('.dolt').removeClass('open');
    $lrcProgressBar.find('.pro1').removeClass('open');
    probox.removeEventListener('touchmove', mmove);
    probox.removeEventListener('touchend', mend);
  }
  probox.addEventListener('touchmove', mmove);
  probox.addEventListener('touchend', mend);
});

probox.addEventListener('mousedown', function (e) {
  let percent;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let a = pro1.offsetLeft + mmlist.offsetLeft;
    percent =
      (e.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(percent);
  }
  function mup() {
    if (_d.remoteState) {
      realtime.send({
        type: 'progress',
        value: percent,
      });
    }
    setActionLrcIndex();
    lrcScroll();
    document.removeEventListener('mousemove', mmove);
    document.removeEventListener('mouseup', mup);
  }
  document.addEventListener('mousemove', mmove);
  document.addEventListener('mouseup', mup);
});

let remoteVol = debounce(function () {
  realtime.send({
    type: 'vol',
    value: curPlayVol,
  });
}, 500);
// 主页全局键盘事件
document.onkeydown = function (e) {
  let key = e.key,
    ctrl = e.ctrlKey || e.metaKey;
  let isFocus = $('input').is(':focus') || $('textarea').is(':focus');
  if (!isFocus) {
    if (ctrl && key === 'ArrowLeft') playPrev();
    if (ctrl && key === 'ArrowRight') playNext();
    //音量+
    if (ctrl && key === 'ArrowUp') {
      e.preventDefault();
      curPlayVol += 0.1;
      if (curPlayVol >= 1) {
        curPlayVol = 1;
      }
      vobellm();
      if (_d.remoteState) {
        remoteVol();
      }
      _msg.info(parseInt(curPlayVol * 100) + '%');
    }
    //音量-
    if (ctrl && key === 'ArrowDown') {
      e.preventDefault();
      curPlayVol -= 0.1;
      if (curPlayVol <= 0) {
        curPlayVol = 0;
      }
      vobellm();
      if (_d.remoteState) {
        remoteVol();
      }
      _msg.info(parseInt(curPlayVol * 100) + '%');
    }
    //暂停/播放
    if (key === ' ') {
      if (!_d.music) return;
      if ($musicMvWrap.is(':hidden')) {
        changePlayState();
      } else {
        if ($myVideo[0].paused) {
          videoPlay();
        } else {
          videoPause();
        }
      }
    }
    // 迷你切换
    if (key === 'm') {
      if ($musicPlayerBox.is(':hidden')) {
        showMusicPlayerBox();
      } else {
        hideMusicPlayBox();
      }
    }
    // 歌词
    if (key === 'l') {
      toggleMiniLrc();
    }
    // 书签
    if (key === 's' && !ctrl) {
      if ($searchBoxMask.is(':hidden')) {
        showSearchBox();
      }
    }
    // 跳到历史记录
    if (key === 'h') {
      openIframe('/history/', '搜索历史');
    }
    // 书签管理
    if (key === 'b') {
      openIframe('/bmk/', '书签夹');
    }
    // 文件管理
    if (key === 'f') {
      openIframe('/file/', '文件管理');
    }
    // 回收站
    if (key === 't') {
      openIframe('/trash/', '回收站');
    }
    // 跳到笔记
    if (key === 'n') {
      openNote();
    }
    // 打开记事本
    if (key === 'e') {
      openIframe('/notepad/', '记事本');
    }
    // 打开图床
    if (key === 'p') {
      openIframe('/pic/', '图床');
    }
    // 侧边栏
    if (key === 'a' && !ctrl) {
      toggleAside();
    }
    // 播放模式
    if (key === 'r') {
      switchPlayMode();
    }
    // 停止歌曲并关闭所有音乐窗口
    if (key === 'c' && !ctrl) {
      closeMusicPlayer();
    }
  }
};

if (curPlayVol <= 0) {
  $musicHeadWrap
    .find('.volume')
    .attr('class', 'volume iconfont icon-24gl-volumeCross');
}
//音量
$myAudio[0].volume = curPlayVol;
$myVideo[0].volume = curPlayVol;
function vobellm() {
  $myAudio[0].volume = curPlayVol;
  $myVideo[0].volume = curPlayVol;
  _setData('lastvol', curPlayVol);
  if (curPlayVol <= 0) {
    $musicHeadWrap
      .find('.volume')
      .attr('class', 'volume iconfont icon-24gl-volumeCross');
  } else {
    $musicHeadWrap
      .find('.volume')
      .attr('class', 'volume iconfont icon-24gl-volumeHigh');
  }
}

//歌曲封面
function showLrcBox() {
  $musicLrcWrap.addClass('active');
  lrcHeadContentScrollName.init(musicobj.title);
  lrcHeadContentScrollArtist.init(musicobj.artist);
  _setTimeout(() => {
    lrcScroll(true);
  }, 600);
  $lrcHead.find('.close').stop().fadeIn(_speed);
}
$playingSongLogo.on('click', showLrcBox);
function toggleLrcMenuWrapBtnsState() {
  if (musicobj && musicobj.mv) {
    $lrcMenuWrap.find('.play_mv_btn').stop().show(_speed);
  } else {
    $lrcMenuWrap.find('.play_mv_btn').stop().hide(_speed);
  }
  if (_d.music && _d.music[1].item.some((v) => v.id === musicobj.id)) {
    $lrcMenuWrap
      .find('.collect_song_btn')
      .attr('class', 'collect_song_btn iconfont icon-hear-full active');
  } else {
    $lrcMenuWrap
      .find('.collect_song_btn')
      .attr('class', 'collect_song_btn iconfont icon-hear');
  }
}
//歌单列表
(function () {
  let fromDom = null;
  $songListWrap
    .on('dragstart', '.song_list_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.song_list_item', function (e) {
      let a = $(fromDom).index(),
        b = $(this).index(),
        fromId = $(fromDom).attr('data-id'),
        toId = $(this).attr('data-id');
      if (fromDom) {
        if (a > 2 && b > 2 && a !== b) {
          _postAjax('/player/listmove', { fromId, toId })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                renderMusicList();
                return;
              }
            })
            .catch((err) => {});
        }
        fromDom = null;
      }
    })
    .on('dragover', '.song_list_item', function (e) {
      e.preventDefault();
    });
})();
//处理歌曲列表
function renderMusicList() {
  if ($musicPlayerBox.is(':hidden')) return;
  let a = $songListUl.children();
  if (a.length === 0) {
    rendermusiclistdefault();
  }
  let id = $songListWrap.listId;
  _getAjax('/player/getmusicinfo')
    .then((result) => {
      if (parseInt(result.code) === 0) {
        if ($musicPlayerBox.is(':hidden')) return;
        if ($myAudio[0].paused) {
          let _musicinfo = result.data;
          let { currentTime = 0, duration = 0, lastplay } = _musicinfo;
          musicobj = musicobjInit(lastplay);
          updateMusicShowInfo();
          $myAudio[0].currentTime = currentTime;
          upprog();
          $lrcProgressBar.find('.total_time').text(formartSongTime(duration));
        } else {
          initMusicTitleScroll();
        }
        _getAjax('/player/getlist', { id })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              _d.music = result.data;
              toggleLrcMenuWrapBtnsState();
              renderPlayingList();
              playingListHighlight();
              rendermusiclist();
              renderSearchMusicList(1);
              return;
            }
          })
          .catch((err) => {});
      }
    })
    .catch((err) => {});
  if (!_d.playingList) {
    _getAjax('/player/getplaying')
      .then((result) => {
        if (parseInt(result.code) === 0) {
          _d.playingList = result.data;
          musicarr = deepClone(_d.playingList);
          renderPlayingList();
          playingListHighlight(true);
          return;
        }
      })
      .catch((err) => {});
  }
}
function rendermusiclistdefault() {
  let str = '';
  new Array(50).fill(null).forEach((item) => {
    str += `<li style="pointer-events: none;" class="song_list_item">
      <div class="list_logo" style="background-color:var(--color8);background-image:none;box-shadow: none;"></div>
      </li>`;
  });
  $songListUl.html(str);
}
function rendermusiclist() {
  if ($musicPlayerBox.is(':hidden')) return;
  let arr = _d.music,
    str = '';
  arr.forEach((item) => {
    let name = encodeHtml(item.name);
    let des = item.des ? encodeHtml(item.des) : '';
    let pic = getFilePath(item.pic, 1);
    if (item.pic == 'history') {
      pic = imgHistory;
    } else if (item.pic == 'default') {
      pic = imgMusic;
    }
    str += `<li class="song_list_item" title="${name}\n${des}" data-id="${item.id}" cursor draggable="true">
      <div class="list_logo">
        <div class="logo" data-src="${pic}"></div></div>
        <span>${name}</sapn>
        </li>`;
  });
  str += `<li cursor class="add_song_list"><img src="${imgTianjia}"></li>`;
  $songListUl.html(str);
  lLazyImg.bind($songListUl[0].querySelectorAll('.logo'), musicLoadImg);
  if (!$songListWrap.listId) return;
  rendermusicitem();
}
let musicPageNum = 1;
function renderMusicItem() {
  let id = $songListWrap.listId;
  if (!id) return;
  _getAjax('/player/getlist', { id })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        _d.music = result.data;
        if (!id) return;
        rendermusicitem();
        return;
      }
    })
    .catch((err) => {});
}
function rendermusicitemdefault() {
  let str = '';
  str += `<div style="pointer-events: none;" class="items_list_top_wrap">
        <div style="background-color:var(--color8);background-image:none" class="song_list_cover"></div>
        <div style="background-color:var(--color8); height: 40px;width: 100px;margin: 30px;" class="song_list_info"></div>
      </div>
      <div style="pointer-events: none; height: 40px;width: 100%;box-sizing: border-box;padding: 0 5px;overflow:hidden;">
          <div style="background-color:var(--color8);height: 40px;width:50%;float:left;"></div>
          <div style="background-color:var(--color8);height: 40px;width:30%;float:right;"></div>
      </div>`;
  new Array(50).fill(null).forEach((item) => {
    str += `<div style="pointer-events: none;" data-flag="default" class="song_item">
        <div style="background-color:var(--color8);background-image:none" class="song_logo_box"></div>
        <div class="song_info_wrap">
          <span style="background-color:var(--color8);margin: 8px 0 0 0;width: 110px;height:15px" class="song_name"></span>
          <span style="background-color:var(--color8);margin: 5px 0 0 0;width: 110px;height:15px" class="artist_name"></span>
        </div>
        <div style="background-color:var(--color8);width:100px;height: 40px;margin: 10px 0 0 10px;" class="set_song_btn"></div>
      </div>`;
  });
  $songItemsBox.html(str);
}

function rendermusicitem(gao) {
  let id = $songListWrap.listId,
    listpx = curSongListSort;
  if (!id) return;
  let ind = _d.music.findIndex((item) => item.id === id);
  if (ind < 0) return;
  let marr = deepClone(_d.music[ind]);
  if (ind > 0) {
    if (listpx === 'artist') {
      marr.item = arrSortMinToMax(marr.item, 'artist');
    } else if (listpx === 'name') {
      marr.item = arrSortMinToMax(marr.item, 'title');
    } else if (listpx === 'playCount') {
      marr.item.sort((a, b) => {
        return b.play_count - a.play_count;
      });
    } else if (listpx === 'collectCount') {
      marr.item.sort((a, b) => {
        return b.collect_count - a.collect_count;
      });
    }
  }
  let scObj = ind == 1 ? {} : getCollectSongs();
  let str = '';
  let name = encodeHtml(marr.name);
  let des = marr.des ? encodeHtml(marr.des) : '';
  let pic = getFilePath(marr.pic, 1);
  if (marr.pic == 'history') {
    pic = imgHistory;
  } else if (marr.pic == 'default') {
    pic = imgMusic;
  }
  str += `<div class="items_list_top_wrap">
        <div class="song_list_cover">
          <div class="logo" data-src="${pic}"></div>
      </div>
      <div class="song_list_info">
        <div class="song_list_name" title="${name}">${name}</div>
        ${des ? `<div class="song_list_des">${des}</div>` : ''}
      </div>
    </div>
    <div class="items_list_top_menu">
      <div cursor class="play_list_btn iconfont icon-65zanting"></div>
      <div class="list_total_num">播放全部<span>(${
        marr.item.length
      })</span></div>
      ${
        ind > 2 || _d.userInfo.account == 'root'
          ? `<div cursor class="edit_song_list_btn"><i class="iconfont icon-bianji"></i></div>`
          : ''
      }
      ${
        ind == 2
          ? '<div cursor class="upload_song_btn"><i class="iconfont icon-shangchuan1"></i></div>'
          : ''
      }
      <div cursor class="share_song_list_btn"><i class="iconfont icon-fenxiang_2"></i></div>
      <div cursor class="checked_song_btn"><i class="iconfont icon-duoxuan"></i></div>
      ${
        ind > 0
          ? `<div cursor class="sort_songs"><i class="iconfont icon-paixu"></i></div>`
          : ''
      }
    </div>`;
  let pageTotal = Math.ceil(marr.item.length / musicPageSize);
  musicPageNum < 1
    ? (musicPageNum = pageTotal)
    : musicPageNum > pageTotal
    ? (musicPageNum = 1)
    : null;
  marr.item
    .slice((musicPageNum - 1) * musicPageSize, musicPageNum * musicPageSize)
    .forEach((item) => {
      let { title, artist, mv, id, pic } = item;
      let issc = scObj.hasOwnProperty(id);
      title = encodeHtml(title);
      artist = encodeHtml(artist);
      str += `<div class="song_item" data-id="${id}" draggable="true" data-issc="${issc}" cursor>
        <div cursor check="n" class="check_state"></div>
        <div class="song_logo_box">
          <div class="logo" data-src="${getFilePath(`/music/${pic}`, 1)}"></div>
          <img class="play_gif" src="${imgWave}">
        </div>
        <div class="song_info_wrap">
          <span class="song_name">${title}</span>
          <span class="artist_name"><i class="viptu iconfont icon-vip1"></i><i class="artist_name_text">${artist}</i></span>
        </div>
        ${mv ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
        ${
          ind == 1
            ? ''
            : `<div class="like_hear iconfont ${
                issc ? 'icon-hear-full active' : 'icon-hear'
              }"></div>`
        }
        <div title="添加到播放列表" class="add_song_playing_btn iconfont icon-icon-test"></div>
        <div class="set_song_btn iconfont icon-icon"></div>
      </div>`;
    });
  str += `<div style="padding:20px 0;text-align:center;line-height: 26px;" class="song_list_paging jzxz">
      ${
        pageTotal > 1
          ? `<span class="prev_page iconfont icon-prev" cursor></span>
      <span cursor class="input_num" style="margin:0 30px">${musicPageNum}/${pageTotal}</span>
      <span class="next_page iconfont icon-page-next" cursor></span>`
          : ''
      }
    </div>`;
  str += `
      <div class="check_all_menu_wrap">
        <div cursor x='1' class="check_all_song_btn">全选</div>
        <div cursor class="share_all_song_btn">分享</div>
        ${ind == 1 ? '' : '<div cursor class="collect_songs_btn">收藏</div>'}
        <div cursor class="add_song_btn">添加到</div>
        ${ind > 2 ? '<div cursor class="move_song_btn">移动到</div>' : ''}
        <div cursor class="download_song_btn">下载</div>
        ${ind == 2 ? '' : '<div cursor class="remove_song_btn">移除</div>'}
        ${
          _d.userInfo.account === 'root'
            ? '<div cursor class="del_songs_btn">删除</div>'
            : ''
        }
        ${ind < 2 ? '<div cursor class="clear_all_song_btn">清空</div>' : ''}
        <div cursor class="cancel_btn">取消</div>
      </div>`;
  $songItemsBox.html(str)._check = false;
  musicarrjl = marr.item;
  if (!gao) {
    songListHighlight();
  } else {
    songListHighlight(1);
  }
  $msuicContentBox.find('.list_items_wrap').scroll();
  mLazyImg.bind(
    $msuicContentBox.find('.list_items_wrap')[0].querySelectorAll('.logo'),
    musicLoadImg
  );
}
function addSongList(e) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        title: {
          placeholder: '标题',
          beforeText: '标题：',
          verify(val) {
            if (val.trim() == '') {
              return '请输入标题';
            }
          },
        },
        des: {
          type: 'textarea',
          beforeText: '描述：',
          placeholder: '描述',
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let val = inp.title;
        let des = inp.des;
        _postAjax('/player/addlist', { name: val, des })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              _msg.success(result.codeText);
              renderMusicList();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '添加歌单'
  );
}
//打开列表
$songListWrap
  .on(
    'click',
    '.song_list_item',
    debounce(
      function (e) {
        rendermusicitemdefault();
        $songListWrap.addClass('open').listId = $(this).attr('data-id');
        $msuicContentBox.find('.list_items_wrap').addClass('open').scrollTop(0);
        musicPageNum = 1;
        _setTimeout(() => {
          renderMusicItem();
        }, 500);
      },
      1000,
      true
    )
  )
  .on('click', '.add_song_list', function (e) {
    // 添加歌单
    addSongList(e);
  })
  .on('contextmenu', '.song_list_item', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    const id = $(this).attr('data-id');
    gedanmenu(e, id);
  })
  .on('click', '.song_list_item span', function (e) {
    e.stopPropagation();
    const id = $(this).parent().attr('data-id');
    gedanmenu(e, id);
  });
longPress($songListWrap[0], '.song_list_item', function (e) {
  const id = $(this).attr('data-id');
  let ev = e.changedTouches[0];
  gedanmenu(ev, id);
});

// 删除歌单
function gedanmenu(e, sid) {
  let index = _d.music.findIndex((item) => item.id === sid);
  let { des, name, num } = _d.music[index];
  let data = [
    {
      id: '1',
      text: '编辑',
      beforeIcon: 'iconfont icon-bianji',
    },
    {
      id: '2',
      text: '移除歌单',
      beforeIcon: 'iconfont icon-guanbi1',
    },
  ];
  if (_d.userInfo.account == 'root') {
    if (index < 3) {
      data.splice(1, 1);
    }
  } else {
    if (index < 3) return;
  }
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        editSongList(e, { name, des, num }, sid);
      } else if (id == '2') {
        _pop(
          {
            e,
            text: `确认移除歌单：${name}？`,
            confirm: { type: 'danger', text: '移除' },
          },
          (type) => {
            if (type == 'confirm') {
              _postAjax('/player/dellist', { id: sid })
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    _msg.success(result.codeText);
                    renderMusicList();
                    return;
                  }
                })
                .catch((err) => {});
            }
          }
        );
      }
    },
    name
  );
}
function playList(e) {
  if (musicarrjl.length === 0) {
    _msg.error('播放列表为空');
    return;
  }
  const diff = diffPlayingList(musicarrjl);
  musicarr =
    randomplay === false
      ? myShuffle(deepClone(musicarrjl))
      : deepClone(musicarrjl);
  _d.playingList = deepClone(musicarrjl);
  if (diff) {
    updatePlayingList();
  }
  changePlayingAnimate(e);
  musicPlay(musicarr[0]);
}
let songItemsBoxHide = debounce(function () {
  $listItemsWarp.find('.position_btn').stop().fadeOut(_speed);
}, 10000);
// 歌单列表编辑
function getSongListItemData(id) {
  let p = _d.music.find((item) => item.id == $songListWrap.listId);
  return p.item.find((item) => item.id == id);
}
function getCheckSongItem() {
  let $songItem = $msuicContentBox.find('.list_items_wrap .song_item'),
    $selectarr = $songItem.filter(
      (_, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  let arr = [];
  $selectarr.each((i, v) => {
    let $v = $(v);
    arr.push(getSongListItemData($v.attr('data-id')));
  });
  return arr;
}
const editLrcHeadContentScroll = new ContentScroll(
  $editLrcWrap.find('.song_info_text p')[0]
);
function showEditLrc(sobj) {
  if (_d.userInfo.account !== 'root') {
    $editLrcWrap.find('.save').remove();
  }
  setZidx($editLrcWrap[0], 'editlrc', closeEditLrcBox);
  $editLrcWrap.stop().fadeIn(_speed, () => {
    editLrcHeadContentScroll.init(`${sobj.artist} - ${sobj.title}`);
    $editLrcWrap.css('display', 'flex').find('textarea').val('');
    $editLrcWrap._mobj = deepClone(sobj);
    _getAjax('/player/getlrc', {
      id: sobj.id,
    })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          $editLrcWrap._val = result.data;
          $editLrcWrap.find('textarea').val(result.data);
          return;
        }
      })
      .catch((err) => {});
  });
  if (!$editLrcWrap._once) {
    $editLrcWrap._once = true;
    toSetSize($editLrcWrap[0], 800, 800);
    toCenter($editLrcWrap[0]);
  }
}
function editSongList(e, obj, sid) {
  let { name, des } = obj;
  let option = {
    subText: '提交',
    items: {
      idx: {
        beforeText: '序号',
        inputType: 'number',
        placeholder: '序号',
        value: obj.num + 1,
        verify(val) {
          let value = parseFloat(val.trim());
          if (!isInteger(value) || value <= 0) {
            return '请输正整数';
          }
        },
      },
      title: {
        beforeText: '标题：',
        placeholder: '标题',
        value: name,
        verify(val) {
          if (val.trim() == '') {
            return '请输入标题';
          }
        },
      },
      des: {
        beforeText: '描述：',
        type: 'textarea',
        placeholder: '描述',
        value: des || '',
      },
    },
  };
  if (obj.num < 3) {
    delete option.items.idx;
  }
  inpMenu(
    e,
    option,
    debounce(
      function ({ close, inp }) {
        let nname = inp.title,
          idx = inp.idx - 1,
          ndes = inp.des;
        if (nname + ndes == name + (des || '') && idx == obj.num) return;
        let toId = '';
        if (idx != obj.num) {
          const lastNum = _d.music.length - 1;
          idx = idx > lastNum ? lastNum : idx < 3 ? 3 : idx;
          toId = (_d.music.find((item) => item.num == idx) || {}).id || '';
        }
        _postAjax('/player/editlist', { id: sid, name: nname, des: ndes, toId })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close(true);
              _msg.success(result.codeText);
              renderMusicList();
              return;
            }
          })
          .catch((err) => {});
      },
      1000,
      true
    ),
    '编辑歌单'
  );
}
async function updateSongCover(obj) {
  try {
    const files = await getFiles({
      accept: '.jpg,.jpeg,.png',
    });
    if (files.length == 0) return;
    const file = files[0];
    const { name, size } = file;
    const pro = new UpProgress(file.name);
    if (!isImgFile(name)) {
      pro.fail();
      _msg.error(`图片格式错误`);
      return;
    }
    if (size <= 0 || size >= 5 * 1024 * 1024) {
      pro.fail();
      _msg.error(`图片大小必须0~5M范围`);
      return;
    }
    const result = await _upFile(
      {
        url: `/player/up`,
        param: {
          name,
          id: obj.id,
          type: 'cover',
        },
      },
      file,
      function (percent) {
        pro.update(percent);
      }
    );
    if (parseInt(result.code) === 0) {
      pro.close();
      renderMusicList();
    } else {
      pro.fail();
    }
  } catch (error) {
    _msg.error('上传封面失败');
    return;
  }
}
async function upMv(obj) {
  const files = await getFiles({
    accept: '.mp4',
  });
  if (files.length == 0) return;
  const file = files[0];
  const { name, size } = file;
  const pro = new UpProgress(name);
  if (!isVideoFile(name)) {
    pro.fail();
    _msg.error(`MV 格式错误`);
    return;
  }
  if (size <= 0 || size >= 200 * 1024 * 1024) {
    pro.fail();
    _msg.error(`MV大小必须0~200M范围`);
    return;
  }
  try {
    const result = await _upFile(
      {
        url: `/player/up`,
        param: {
          name,
          id: obj.id,
          type: 'mv',
        },
      },
      file,
      (percent) => {
        pro.update(percent);
      }
    );
    if (parseInt(result.code) === 0) {
      pro.close();
      realtime.send({ type: 'updatedata', flag: 'music' });
      renderMusicList();
    } else {
      pro.fail();
    }
  } catch (error) {
    pro.fail();
  }
}
async function upSong() {
  const files = await getFiles({
    multiple: true,
    accept: '.mp3',
  });
  if (files.length == 0) return;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { name, size } = file;
    const pro = new UpProgress(name);
    if (!isMusicFile(name)) {
      pro.fail();
      _msg.error(`歌曲格式错误`);
      continue;
    }
    if (size <= 0 || size >= 20 * 1024 * 1024) {
      pro.fail();
      _msg.error(`歌曲大小必须0~20M范围`);
      continue;
    }
    try {
      //文件切片
      let { HASH } = await fileSlice(file, (percent) => {
        pro.loading(percent);
      });
      let isrepeat = await _postAjax('/player/repeatfile', { HASH }); //是否已经存在文件

      if (parseInt(isrepeat.code) === 0) {
        //文件已经存在操作
        pro.close('歌曲已存在');
        continue;
      }
      const result = await _upFile(
        {
          url: `/player/up`,
          param: {
            name,
            HASH,
            type: 'song',
          },
        },
        file,
        (percent) => {
          pro.update(percent);
        }
      );
      if (parseInt(result.code) === 0) {
        pro.close();
      } else {
        pro.fail();
      }
    } catch (error) {
      pro.fail();
    }
  }
  realtime.send({ type: 'updatedata', flag: 'music' });
  renderMusicList();
}
function switchSongChecked() {
  let $qxcz = $msuicContentBox.find('.check_all_menu_wrap'),
    $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state');
  if ($songItemsBox._check) {
    $qxcz.css('display', 'none');
    $duoxuan.css('display', 'none');
    $songItemsBox._check = false;
  } else {
    $qxcz.css('display', 'block');
    $duoxuan.css('display', 'block');
    $songItemsBox._check = true;
  }
  $duoxuan.attr('check', 'n').css('background-color', 'transparent');
  $msuicContentBox.find('.list_items_wrap .check_all_song_btn').attr('x', '1');
}
$msuicContentBox
  .find('.list_items_wrap')
  .on('click', '.edit_song_list_btn', function (e) {
    let id = $songListWrap.listId;
    let index = _d.music.findIndex((item) => item.id === id);
    let { des, name, num } = _d.music[index];
    editSongList(e, { name, des, num }, id);
  })
  .on('click', '.share_song_list_btn', function (e) {
    let id = $songListWrap.listId;
    let index = _d.music.findIndex((item) => item.id === id);
    if (index < 0) return;
    let arr = _d.music[index].item.map((item) => item.id);
    shareSongList(e, arr);
  })
  .on('click', '.upload_song_btn', async function (e) {
    // 上传歌曲
    _pop(
      {
        e,
        text: '请阅读上传指南后，再上传歌曲！',
        confirm: { text: '开始上传' },
        cancel: { text: '查看指南' },
      },
      (type) => {
        if (type == 'confirm') {
          upSong();
        } else if (type == 'cancel') {
          openIframe('/note/?v=about', '关于');
        }
      }
    );
  })
  .on('scroll', function () {
    //列表滚动
    $listItemsWarp.find('.position_btn').css('display', 'block');
    songItemsBoxHide();
    if (this.scrollTop > 115) {
      $msuicContentBox.find('.items_list_top_menu').addClass('sct');
      $msuicContentBox.find('.items_list_top_wrap').addClass('lbxma');
      $musicHeadWrap
        .find('.song_list_name')
        .text($songItemsBox.find('.song_list_name').text())
        .css('opacity', 1);
    } else {
      $msuicContentBox.find('.items_list_top_menu').removeClass('sct');
      $msuicContentBox.find('.items_list_top_wrap').removeClass('lbxma');
      $musicHeadWrap.find('.song_list_name').css('opacity', 0);
    }
  })
  .on('click', '.play_list_btn', playList)
  .on('click', '.add_song_playing_btn', function (e) {
    //添加到播放列表
    let $this = $(this);
    let mobj = getSongListItemData($this.parent().attr('data-id'));
    _d.playingList.push(mobj);
    musicarr.push(mobj);
    _d.playingList.reverse();
    musicarr.reverse();
    _d.playingList = unique(_d.playingList, ['id']);
    musicarr = unique(musicarr, ['id']);
    _d.playingList.reverse();
    musicarr.reverse();
    updatePlayingList();
    changePlayingAnimate(e);
  })
  .on('click', '.checked_song_btn', switchSongChecked)
  .on('click', '.check_all_song_btn', function () {
    //全选/全不选
    let $this = $(this),
      $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state');
    let num = 0;
    if ($this.attr('x') === '1') {
      $duoxuan.attr('check', 'y').css('background-color', _d.checkColor);
      $this.attr('x', '2');
      num = $duoxuan.length;
    } else {
      $duoxuan.attr('check', 'n').css('background-color', 'transparent');
      $this.attr('x', '1');
      num = 0;
    }
    _msg.botMsg(`选中：${num}项`);
  })
  .on('click', '.cancel_btn', switchSongChecked)
  .on('click', '.share_all_song_btn', function (e) {
    let arr = getCheckSongItem().map((item) => item.id);
    if (arr.length === 0) return;
    shareSongList(e, arr, switchSongChecked);
  })
  .on('click', '.download_song_btn', function () {
    let arr = getCheckSongItem();
    if (arr.length === 0) return;
    arr.forEach((item) => {
      let fname = `${item.artist}-${item.title}`;
      downloadFile(
        getFilePath(`/music/${item.url}`),
        `${fname}.${getSuffix(item.url)[1]}`
      );
    });
    switchSongChecked();
  })
  .on(
    'click',
    '.collect_songs_btn',
    debounce(
      function (e) {
        //收藏选中
        let ar = getCheckSongItem().map((item) => item.id);
        if (ar.length === 0) return;
        songCollect(ar);
      },
      1000,
      true
    )
  )
  .on('click', '.del_songs_btn', function (e) {
    // 删除选中
    let ar = getCheckSongItem().map((item) => item.id);
    if (ar.length === 0) return;
    delSong(e, 'all', ar, 'del');
  })
  .on('click', '.remove_song_btn', function (e) {
    // 移除选中
    let id = $songListWrap.listId;
    let ar = getCheckSongItem().map((item) => item.id);
    if (ar.length === 0 || id == 'all') return;
    delSong(e, id, ar, '');
  })
  .on('click', '.clear_all_song_btn', function (e) {
    let id = $songListWrap.listId;
    let idx = _d.music.findIndex((item) => item.id === id);
    if (idx > 1 || id == 'all') return;
    delSong(
      e,
      id,
      _d.music[idx].item.map((y) => y.id),
      'clean'
    );
  })
  .on('click', '.move_song_btn', function (e) {
    // 全选移动
    let id = $songListWrap.listId;
    let ar = getCheckSongItem().map((item) => item.id);
    if (ar.length === 0) return;
    moveSongToList(e, id, ar);
  })
  .on('click', '.add_song_btn', function (e) {
    let data = [
      { id: '1', text: '播放列表' },
      { id: '2', text: '歌单' },
    ];
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          close();
          // 选中添加到播放列表
          let arr = getCheckSongItem();
          if (arr.length === 0) return;
          _d.playingList = [..._d.playingList, ...arr];
          musicarr = [...musicarr, ...arr];
          _d.playingList.reverse();
          musicarr.reverse();
          _d.playingList = unique(_d.playingList, ['id']);
          musicarr = unique(musicarr, ['id']);
          _d.playingList.reverse();
          musicarr.reverse();
          changePlayingAnimate(e);
          switchSongChecked();
          updatePlayingList();
        } else if (id == '2') {
          let arr = getCheckSongItem().map((item) => item.id);
          moveSongToList(e, 'all', arr);
        }
      },
      '添加歌曲到'
    );
  })
  .on('click', '.song_info_wrap', function (e) {
    let $this = $(this).parent();
    playSongList($this.attr('data-id'), e);
  })
  .on('click', '.artist_name_text', function (e) {
    e.stopPropagation();
    musicSearchInput.setValue(this.innerText);
  })
  .on('click', '.song_logo_box', function () {
    let $this = $(this).parent();
    playSongList($this.attr('data-id'));
    showLrcBox();
  })
  .on('click', '.play_mv', function () {
    let $this = $(this).parent();
    let sobj = getSongListItemData($this.attr('data-id'));
    if (diffPlayingList(musicarrjl)) {
      musicarr =
        randomplay === false
          ? myShuffle(deepClone(musicarrjl))
          : deepClone(musicarrjl);
      _d.playingList = deepClone(musicarrjl);
      updatePlayingList();
    }
    musicMv(sobj);
  })
  .on(
    'click',
    '.like_hear',
    throttle(function () {
      let $this = $(this).parent();
      let issc = $this.attr('data-issc');
      let sobj = getSongListItemData($this.attr('data-id'));
      if (issc == 'true') {
        songCloseCollect(sobj.id);
      } else {
        songCollect([sobj.id]);
      }
    }, 2000)
  )
  .on('click', '.set_song_btn', function (e) {
    let $this = $(this).parent();
    let sobj = musicobjInit(getSongListItemData($this.attr('data-id')));
    let ii = _d.music.findIndex((item) => item.id === $songListWrap.listId);
    if (ii < 0) return;
    let data = [
      {
        id: '1',
        text: '分享歌曲',
        beforeIcon: 'iconfont icon-fenxiang_2',
      },
      {
        id: '2',
        text: '复制歌曲名',
        beforeIcon: 'iconfont icon-fuzhi',
      },
      {
        id: '3',
        text: '编辑歌词',
        beforeIcon: 'iconfont icon-bianji',
      },
      {
        id: '4',
        text: '封面',
        beforeIcon: 'iconfont icon-tupian',
      },
      {
        id: '5',
        text: '歌曲信息',
        beforeIcon: 'iconfont icon-about',
      },
      {
        id: '6',
        text: '添加到',
        beforeIcon: `iconfont icon-icon-test`,
      },
    ];
    if (
      ii > 0 &&
      $songListWrap.listId != 'all' &&
      curSongListSort === 'default'
    ) {
      data.unshift({
        id: '14',
        text: '置顶',
        beforeIcon: 'iconfont icon-up',
      });
    }
    if (ii > 2) {
      data.push({
        id: '11',
        text: '移动到',
        beforeIcon: `iconfont icon-moveto`,
      });
    }
    data.push({
      id: '7',
      text: '下载',
      beforeIcon: 'iconfont icon-xiazai1',
    });
    data.push({
      id: '13',
      text: '上传 MV',
      beforeIcon: 'iconfont icon-shangchuan1',
    });
    if (_d.userInfo.account === 'root') {
      data.push({
        id: '12',
        text: '上传封面',
        beforeIcon: 'iconfont icon-shangchuan1',
      });
      data.push({
        id: '8',
        text: '编辑歌曲信息',
        beforeIcon: 'iconfont icon-bianji',
      });
      if (sobj.mv) {
        data.push({
          id: '10',
          text: '删除 MV',
          beforeIcon: 'iconfont icon-shanchu',
        });
      }
    }
    if (ii != 2) {
      data.push({
        id: '15',
        text: '移除',
        beforeIcon: 'iconfont icon-guanbi1',
      });
    }
    if (_d.userInfo.account === 'root') {
      data.push({
        id: '9',
        text: '删除',
        beforeIcon: `iconfont icon-shanchu`,
      });
    }
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          shareSongList(e, [sobj.id]);
        } else if (id == '9') {
          delSong(
            e,
            'all',
            [sobj.id],
            'del',
            () => {
              close();
            },
            `${sobj.artist} - ${sobj.title}`
          );
        } else if (id == '15') {
          let id = $songListWrap.listId;
          delSong(
            e,
            id,
            [sobj.id],
            '',
            () => {
              close();
            },
            `${sobj.artist} - ${sobj.title}`
          );
        } else if (id == '7') {
          close();
          let fname = `${sobj.artist}-${sobj.title}`;
          downloadFile(sobj.uurl, `${fname}.${getSuffix(sobj.url)[1]}`);
        } else if (id == '6') {
          moveSongToList(e, 'all', [sobj.id]);
        } else if (id == '2') {
          close();
          copyText(sobj.artist + ' - ' + sobj.title);
        } else if (id == '8') {
          if (_d.userInfo.account !== 'root') return;
          editSongInfo(e, sobj);
        } else if (id == '3') {
          close();
          showEditLrc(sobj);
        } else if (id == '4') {
          close();
          let u1 = sobj.ppic;
          imgPreview([
            {
              u1,
              u2: `${u1}&t=1`,
            },
          ]);
        } else if (id == '5') {
          showSongInfo(e, sobj);
        } else if (id == '10') {
          delMv(
            e,
            sobj.id,
            () => {
              close();
            },
            `${sobj.artist} - ${sobj.title}`
          );
        } else if (id == '11') {
          let id = $songListWrap.listId;
          moveSongToList(e, id, [sobj.id]);
        } else if (id == '12') {
          close();
          updateSongCover(sobj);
        } else if (id == '13') {
          close();
          upMv(sobj);
        } else if (id == '14') {
          close();
          const list = _d.music[ii].item || [];
          let toId = list[0].id;
          if (toId == sobj.id) return;
          _postAjax('/player/songmove', {
            id: $songListWrap.listId,
            fid: sobj.id,
            tid: toId,
          })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                renderMusicList();
                return;
              }
            })
            .catch((err) => {});
        }
      },
      `${sobj.artist} - ${sobj.title}`
    );
  })
  .on('contextmenu', '.song_item', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    if ($songItemsBox._check) return;
    switchSongChecked();
    checkedSong(this.querySelector('.check_state'));
  })
  .on('click', '.sort_songs', function (e) {
    //歌曲排序
    let data = [
      {
        id: '1',
        text: '默认排序',
        param: { value: 'default' },
      },
      {
        id: '2',
        text: '按歌手名排序',
        param: { value: 'artist' },
      },
      {
        id: '3',
        text: '按歌曲名排序',
        param: { value: 'name' },
      },
      {
        id: '4',
        text: '按播放量排序',
        param: { value: 'playCount' },
      },
      {
        id: '5',
        text: '按收藏量排序',
        param: { value: 'collectCount' },
      },
    ];
    data.forEach((item) => {
      if (item.param.value === curSongListSort) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    selectMenu(
      e,
      data,
      ({ resetMenu, close, id, param }) => {
        if (id) {
          curSongListSort = param.value;
          resetMenu(data);
          _setData('lastpx', curSongListSort);
          musicPageNum = 1;
          close();
          $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
          if (
            curSongListSort == 'playCount' ||
            curSongListSort == 'collectCount'
          ) {
            renderMusicItem();
          } else {
            rendermusicitem();
          }
        }
      },
      '选择歌曲排序方式'
    );
  })
  .on('click', '.to_top', function () {
    //列表回到顶部底部和定位到当前播放歌曲
    $msuicContentBox.find('.list_items_wrap').stop().animate(
      {
        scrollTop: 0,
      },
      _speed
    );
  })
  .on('click', '.to_bot', function () {
    $msuicContentBox
      .find('.list_items_wrap')
      .stop()
      .animate(
        {
          scrollTop: $msuicContentBox
            .find('.list_items_wrap')
            .prop('scrollHeight'),
        },
        _speed
      );
  })
  .on('click', '.get_location', function () {
    let idx = musicarrjl.findIndex((item) => item.id === musicobj.id);
    if (idx >= 0) {
      let page = Math.ceil((idx + 1) / musicPageSize);
      if (page != musicPageNum) {
        musicPageNum = page;
        rendermusicitem(1);
        return;
      }
      songListHighlight(true);
    }
  })
  .on('click', '.music_list_setting', function (e) {
    creatSelect(
      e,
      { data: [50, 100, 200], active: musicPageSize },
      ({ value, close }) => {
        musicPageSize = value;
        _setData('musicpagenum', musicPageSize);
        musicPageNum = 1;
        $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
        rendermusicitem();
        close();
      }
    );
  })
  .on('click', '.check_state', function (e) {
    checkedSong(this);
  })
  .on('click', '.prev_page', function () {
    musicPageNum--;
    $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
    rendermusicitem();
  })
  .on('click', '.next_page', function () {
    musicPageNum++;
    $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
    rendermusicitem();
  })
  .on('click', '.input_num', function (e) {
    inputPageNo(e, { value: musicPageNum }, (val) => {
      musicPageNum = val;
      $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
      rendermusicitem();
    });
  });
function checkedSong(el) {
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state'),
    $checkArr = $duoxuan.filter((_, item) => $(item).attr('check') === 'y');
  _msg.botMsg(`选中：${$checkArr.length}项`);
}
longPress(
  $msuicContentBox.find('.list_items_wrap')[0],
  '.song_item',
  function () {
    if ($songItemsBox._check) return;
    switchSongChecked();
    checkedSong(this.querySelector('.check_state'));
  }
);
function playSongList(id, e) {
  let sobj = getSongListItemData(id);
  if (diffPlayingList(musicarrjl)) {
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(musicarrjl))
        : deepClone(musicarrjl);
    _d.playingList = deepClone(musicarrjl);
    updatePlayingList();
  }
  if (musicobj.id == sobj.id) {
    changePlayState();
  } else {
    if (e) {
      changePlayingAnimate(e);
    }
    musicPlay(sobj);
  }
}
// 移动歌曲
(function () {
  let fromDom = null;
  $msuicContentBox
    .find('.list_items_wrap')
    .on('dragstart', '.song_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.song_item', function (e) {
      let fid = $(fromDom).attr('data-id'),
        tid = $(this).attr('data-id'),
        id = $songListWrap.listId,
        index = _d.music.findIndex((item) => item.id === id);
      if (fromDom) {
        if (
          curSongListSort === 'default' &&
          fid != tid &&
          index > 0 &&
          id !== 'all'
        ) {
          _postAjax('/player/songmove', { id, fid, tid })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                renderMusicList();
                return;
              }
            })
            .catch((err) => {});
        }
        fromDom = null;
      }
    })
    .on('dragover', '.song_item', function (e) {
      e.preventDefault();
    });
})();

$lrcMenuWrap
  .on(
    'click',
    '.collect_song_btn',
    throttle(function (e) {
      if (!musicobj.hash) return;
      const $this = $(this);
      if (!$this.hasClass('active')) {
        songCollect([musicobj.id], () => {
          $this.attr(
            'class',
            'collect_song_btn iconfont icon-hear-full active'
          );
        });
      } else {
        songCloseCollect(musicobj.id, () => {
          $this.attr('class', 'collect_song_btn iconfont icon-hear');
        });
      }
    }, 2000)
  )
  .on('click', '.play_mv_btn', function () {
    if (!musicobj.hash) return;
    $myVideo.attr('src', musicobj.mmv);
    $musicMvWrap.stop().fadeIn(_speed).css('display', 'flex');
    if (!$musicMvWrap.once) {
      $musicMvWrap.once = true;
      toSetSize($musicMvWrap[0], 600, 600);
      toCenter($musicMvWrap[0]);
    }
    musicMvContentScroll.init(`${musicobj.artist} - ${musicobj.title}`);
    videoPlay();
    setZidx($musicMvWrap[0], 'mv', closeMvBox);
  })
  .on('click', '.lrc_translate_btn', (e) => {
    let showfy = _getData('showfy');
    if (showfy) {
      $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'none');
    } else {
      $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'block');
    }
    lrcScroll(true);
    showfy = !showfy;
    _setData('showfy', showfy);
  })
  .on('click', '.share_song_btn', function (e) {
    if (!musicobj.hash) return;
    shareSongList(e, [musicobj.id]);
  })
  .on('click', '.set_lrc_btn', function (e) {
    if (!musicobj.hash) return;
    let data = [
      {
        id: '1',
        text: '字体大小',
        beforeIcon: 'iconfont icon-font-size',
      },
      {
        id: '2',
        text: '靠左',
        beforeIcon: 'iconfont icon-kaozuo1',
      },
      {
        id: '3',
        text: '居中',
        beforeIcon: 'iconfont icon-geci',
      },
      {
        id: '4',
        text: '靠右',
        beforeIcon: 'iconfont icon-kaoyou1',
      },
      {
        id: '5',
        text: '编辑歌词',
        beforeIcon: 'iconfont icon-bianji',
      },
      {
        id: '6',
        text: '封面',
        beforeIcon: 'iconfont icon-tupian',
      },
      {
        id: '7',
        text: '复制歌曲名',
        beforeIcon: 'iconfont icon-fuzhi',
      },
      {
        id: '8',
        text: '歌曲信息',
        beforeIcon: 'iconfont icon-about',
      },
      {
        id: '9',
        text: '添加到',
        beforeIcon: 'iconfont icon-icon-test',
      },
      {
        id: '10',
        text: '下载',
        beforeIcon: 'iconfont icon-xiazai1',
      },
    ];
    if (_d.userInfo.account == 'root') {
      data.push({
        id: '11',
        text: '删除',
        beforeIcon: 'iconfont icon-shanchu',
      });
    }
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          close();
          let { size } = lrcstatu;
          _progressBar(e, size, (percent) => {
            $lrcListWrap.find('.lrc_items').css({
              'font-size': percentToValue(14, 30, percent) + 'px',
            });
            lrcstatu.size = percent;
            _setData('lrcstatu', lrcstatu);
            lrcScroll(true);
          });
        } else if (id == '2') {
          close();
          lrcstatu.statu = 'left';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'left',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '3') {
          close();
          lrcstatu.statu = 'center';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'center',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '4') {
          close();
          lrcstatu.statu = 'right';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'right',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '5') {
          if (!musicobj.hash) return;
          close();
          showEditLrc(musicobj);
        } else if (id == '6') {
          close();
          let u1 = musicobj.ppic;
          imgPreview([
            {
              u1,
              u2: `${u1}&t=1`,
            },
          ]);
        } else if (id == '7') {
          close();
          copyText(musicobj.artist + ' - ' + musicobj.title);
        } else if (id == '9') {
          moveSongToList(e, 'all', [musicobj.id]);
        } else if (id == '11') {
          if (!musicobj.hash) return;
          let sobj = deepClone(musicobj);
          delSong(
            e,
            'all',
            [sobj.id],
            'del',
            () => {
              close();
            },
            `${sobj.artist} - ${sobj.title}`
          );
        } else if (id == '8') {
          showSongInfo(e, musicobj);
        } else if (id == '10') {
          close();
          let fname = `${musicobj.artist}-${musicobj.title}`;
          downloadFile(musicobj.uurl, `${fname}.${getSuffix(musicobj.url)[1]}`);
        }
      },
      `${musicobj.artist} - ${musicobj.title}`
    );
  })
  .on('click', '.play_speed_btn', function (e) {
    let data = [];
    [2, 1.75, 1.5, 1.25, 1, 0.75, 0.25].forEach((item, idx) => {
      data.push({
        id: idx + 1,
        text: 'x' + item,
        param: {
          b: item,
          a: 'x' + item,
        },
        active: curPlaySpeed[1] == item ? true : false,
      });
    });
    selectMenu(
      e,
      data,
      ({ id, resetMenu, param }) => {
        if (id) {
          let { a, b } = param;
          $lrcMenuWrap.find('.play_speed_btn').text(a);
          $myAudio[0].playbackRate = b;
          curPlaySpeed = [a, b];
          data.forEach((item) => {
            if (item.param.b == curPlaySpeed[1]) {
              item.active = true;
            } else {
              item.active = false;
            }
          });
          resetMenu(data);
          _setData('lastplaysd', curPlaySpeed);
          _msg.info(b + 'X');
        }
      },
      '歌曲播放速度'
    );
  })
  .find('.play_speed_btn')
  .text(curPlaySpeed[0]);
// 自动触发定时函数
function zidonghide(timemax, el, ell, fn, fn2, fel) {
  let time = timemax,
    timer = null;
  function fun() {
    time--;
    if (time <= 0) {
      fn2();
      return;
    }
    timer = _setTimeout(fun, 1000);
  }
  $(el)
    .on('mouseup touchstart mousemove', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      time = timemax;
      if (!_getTarget(this, e, fel)) {
        fn();
      }
      if (_getTarget(this, e, ell) && isBigScreen()) return;
      fun();
    })
    .on('mouseleave', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      fn2();
    });
}

//定位播放歌曲
function songListHighlight(isPosition) {
  if (!$songListWrap.listId) return;
  if (musicarrjl != undefined && musicobj) {
    if (musicarrjl.some((item) => item.id === musicobj.id)) {
      $listItemsWarp.find('.get_location').stop().slideDown(_speed);
    } else {
      $listItemsWarp.find('.get_location').stop().slideUp(_speed);
    }
    let $songlist = $msuicContentBox.find('.list_items_wrap .song_item');
    $songlist.removeClass('active').find('.play_gif').removeClass('show');
    let ii = [].findIndex.call($songlist, (item) => {
      let $item = $(item);
      return $item.attr('data-id') == musicobj.id;
    });

    if (ii >= 0) {
      if (isPosition) {
        let sp =
          $msuicContentBox.find('.list_items_wrap').scrollTop() +
          $songlist.eq(ii).position().top -
          100;
        $msuicContentBox.find('.list_items_wrap').stop().animate(
          {
            scrollTop: sp,
          },
          _speed
        );
      }
      $songlist.eq(ii).addClass('active').find('.play_gif').addClass('show');
    }
  }
}

//MV
function closeMvBox() {
  videoPause();
  toHide($musicMvWrap[0], { to: 'bottom', scale: 'small' }, () => {
    backWindow.remove('mv');
  });
  musicMvContentScroll.close();
}
$musicMvWrap.on('click', '.m_close', closeMvBox);

$miniLrcWrap.find('.close').on('click', function () {
  $miniLrcWrap.stop().fadeOut(_speed)._isone = true;
});
const musicMvContentScroll = new ContentScroll(
  $musicMvWrap.find('.m_top_space p')[0]
);
//MV播放函数
function musicMv(obj) {
  musicobj = musicobjInit(obj);
  updateMusicShowInfo();
  audioPause();
  $myVideo.attr('src', musicobj.mmv);
  videoPlay();
  $musicMvWrap.stop().fadeIn(_speed).css('display', 'flex');
  if (!$musicMvWrap.once) {
    $musicMvWrap.once = true;
    toSetSize($musicMvWrap[0], 600, 600);
    toCenter($musicMvWrap[0]);
  }
  musicMvContentScroll.init(`${musicobj.artist} - ${musicobj.title}`);
  setZidx($musicMvWrap[0], 'mv', closeMvBox);
  songListHighlight(false);
  playingListHighlight(false);
  toggleLrcMenuWrapBtnsState();
  updateMusicInfo('y', 1);
}
$myVideo[0].onerror = function (e) {
  _msg.error(`MV 加载失败`);
};
//拖动
myDrag({
  trigger: $clock[0],
  border: true,
  create({ target }) {
    if (boxpositon.hasOwnProperty('lastmyclock')) {
      target.style.left = boxpositon['lastmyclock'].left + 'px';
      target.style.top = boxpositon['lastmyclock'].top + 'px';
    }
  },
  up({ x, y }) {
    boxpositon['lastmyclock'] = {
      left: x,
      top: y,
    };
    _setData('lastweizi', boxpositon);
  },
});
myDrag({
  trigger: $miniPlayer[0],
  border: true,
  create({ target }) {
    if (boxpositon.hasOwnProperty('lastmusichide')) {
      target.style.left = boxpositon['lastmusichide'].left + 'px';
      target.style.top = boxpositon['lastmusichide'].top + 'px';
    }
  },
  up({ x, y }) {
    boxpositon['lastmusichide'] = {
      left: x,
      top: y,
    };
    _setData('lastweizi', boxpositon);
  },
});
myDrag({
  trigger: $miniLrcWrap[0],
  border: true,
  create({ target }) {
    if (boxpositon.hasOwnProperty('lastwingc')) {
      target.style.left = boxpositon['lastwingc'].left + 'px';
      target.style.top = boxpositon['lastwingc'].top + 'px';
    }
  },
  up({ x, y }) {
    boxpositon['lastwingc'] = {
      left: x,
      top: y,
    };
    _setData('lastweizi', boxpositon);
  },
});
myDrag({
  trigger: $chatHeadBtns.find('.chat_title')[0],
  target: $chatRoomWrap[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y, pointerX }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target, pointerX);
    }
  },
});
myResize({
  target: $chatRoomWrap[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});
myDrag({
  trigger: $userInfoWrap[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y }) {
    target.style.transition = '0.5s ease-in-out';
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      const { x, y } = target._op;
      target.style.top = y + 'px';
      target.style.left = x + 'px';
    } else {
      target._op = { x, y };
    }
  },
});
myDrag({
  trigger: $theadBtns.find('.t_space')[0],
  target: $todoBox[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y, pointerX }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target, pointerX);
    }
  },
});
myResize({
  target: $todoBox[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});
myDrag({
  trigger: $musicMvWrap.find('.m_top_space')[0],
  target: $musicMvWrap[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y, pointerX }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target, pointerX);
    }
  },
});
myResize({
  target: $musicMvWrap[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});
myDrag({
  trigger: $musicHeadWrap.find('.song_list_name')[0],
  target: $musicPlayerBox[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y, pointerX }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target, pointerX);
    }
  },
});
myResize({
  target: $musicPlayerBox[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});
myDrag({
  trigger: $editLrcWrap.find('.song_info_text')[0],
  target: $editLrcWrap[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y, pointerX }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target, pointerX);
    }
  },
});
myResize({
  target: $editLrcWrap[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});

// 监听浏览器返回事件
function pushHistory() {
  window.history.pushState(null, '', myOpen());
}
pushHistory();
window.addEventListener('popstate', function (e) {
  backWindow.back();
  pushHistory();
});
// 移动端触控效果
//主页
_mySlide({
  el: '#main',
  up(e) {
    if (!_getTarget(this, e, '#main', 1)) return;
    showMusicPlayerBox();
  },
  down(e) {
    if (!_getTarget(this, e, '#main', 1)) return;
    openbgku();
  },
  right(e) {
    if (!_getTarget(this, e, '#main', 1)) return;
    showAside();
  },
  left(e) {
    if (!_getTarget(this, e, '#main', 1)) return;
    showRightMenu();
  },
});
//左导航
_mySlide({
  el: '.aside_wrap',
  left() {
    hideAside();
  },
});
// 右边选项
_mySlide({
  el: '.right_menu_mask',
  right() {
    hideRightMenu();
  },
});
// 歌词
_mySlide({
  el: '.music_lrc_wrap',
  right(e) {
    if (_getTarget(this, e, '.lrc_foot_wrap')) return;
    hideLrcBox();
  },
  down(e) {
    if (_getTarget(this, e, '.lrc_foot_wrap')) return;
    hideLrcBox();
  },
  left(e) {
    if (_getTarget(this, e, '.lrc_foot_wrap')) return;
    playNext();
  },
});
// 歌单
_mySlide({
  el: '.song_list_wrap',
  right() {
    musicBackBtn();
  },
});
// 歌单列表
_mySlide({
  el: '.list_items_wrap',
  right() {
    musicBackBtn();
  },
});
// 播放器底部控制
_mySlide({
  el: '.playing_song_info',
  right() {
    playPrev();
  },
  left() {
    playNext();
  },
});
// 壁纸
_mySlide({
  el: '.all_bg_wrap',
  right(e) {
    closeBgBox();
  },
});
_mySlide({
  el: '.todo_list',
  right() {
    if (getSelectText() !== '') return;
    closeTodoBox();
  },
});
// 聊天
_mySlide({
  el: '.chat_list_box',
  right() {
    if (getSelectText() !== '') return;
    closeChatRoom();
  },
});
// 播放列表
_mySlide({
  el: '.playing_list_mask',
  right() {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox.stop().slideUp(_speed, () => {
      $playingListWrap.stop().fadeOut(_speed);
    });
  },
});
// 搜索列表
_mySlide({
  el: '.search_music_wrap',
  right() {
    musicSearchInput.setValue('');
  },
});

const musicFootBoxContentScroll = new ContentScroll(
  $musicFootBox.find('.playing_song_info div')[0]
);
const lrcHeadContentScrollName = new ContentScroll(
  $lrcHead.find('.song_name div')[0]
);
const lrcHeadContentScrollArtist = new ContentScroll(
  $lrcHead.find('.artist_name i')[0]
);
function initMusicTitleScroll() {
  musicFootBoxContentScroll.init(`${musicobj.artist} - ${musicobj.title}`);
  lrcHeadContentScrollName.init(musicobj.title);
  lrcHeadContentScrollArtist.init(musicobj.artist);
}
function closeMusicTitleScroll() {
  musicFootBoxContentScroll.close();
  lrcHeadContentScrollName.close();
  lrcHeadContentScrollArtist.close();
}
function updateMusicShowInfo() {
  if (!$musicPlayerBox.is(':hidden')) {
    initMusicTitleScroll();
  }
  const id = musicobj.id;
  $myAudio.attr('src', musicobj.uurl);
  $playingSongLogo
    .css('background-image', `url(${loadSvg})`)
    .removeClass('load');
  imgjz(
    musicobj.ppic,
    () => {
      if (musicobj.id !== id) return;
      $playingSongLogo
        .css('background-image', `url(${musicobj.ppic})`)
        .addClass('load');
      $lrcBg
        .css('background-image', `url("${musicobj.ppic}")`)
        .removeClass('lrcbgss');
      $miniPlayer.css('background-image', `url("${musicobj.ppic}")`);
      $musicPlayerBg
        .css('background-image', `url("${musicobj.ppic}")`)
        .removeClass('lrcbgss');
    },
    () => {
      if (musicobj.id !== id) return;
      $playingSongLogo
        .css('background-image', `url(${imgMusic})`)
        .addClass('load');
      $lrcBg.css('background-image', `url(${imgMusic})`).removeClass('lrcbgss');
      $miniPlayer.css('background-image', `url(${imgMusic})`);
      $musicPlayerBg
        .css('background-image', `url(${imgMusic})`)
        .removeClass('lrcbgss');
    }
  );
}

$rightMenuMask.on('click', function (e) {
  if (_getTarget(this, e, '.right_menu_mask', 1)) {
    hideRightMenu();
  }
});
function showRightMenu() {
  $rightMenuMask.css('display', 'block');
  let num = _d.todoList.filter((item) => item.state == 0).length;
  $rightBox
    .scrollTop(0)
    .find('.show_todo span')
    .html(
      `待办事项${
        num == 0
          ? ''
          : `<em style="display: inline-block;background-color: #ffffffd4;width: 20px;line-height: 20px;text-align: center;border-radius: 4px;color: #f56c6c;margin-left: 10px;
">${num}</em>`
      }`
    );
  setZidx($rightMenuMask[0], 'rightmenu', hideRightMenu);
  _setTimeout(() => {
    $rightBox.addClass('open');
  }, 100);
}
function hideRightMenu() {
  $rightBox.removeClass('open');
  $rightMenuMask.stop().fadeOut(_speed);
  backWindow.remove('rightmenu');
}
$userLogoBtn.on('click', showRightMenu);

$userInfoWrap
  .on('click', '.edit_user_name', function (e) {
    inpMenu(
      e,
      {
        subText: '提交',
        items: {
          name: {
            placeholder: '昵称',
            value: _d.userInfo.username,
            verify(val) {
              if (val.trim().length < 1 || val.trim().length > 20) {
                return '请输入1-20位';
              }
            },
          },
        },
      },
      debounce(
        function ({ close, inp }) {
          let uname = inp.name;
          if (uname === _d.userInfo.username) return;
          _postAjax('/user/changeusername', {
            username: uname,
          })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                _msg.success(result.codeText);
                updateUserInfo();
                return;
              }
            })
            .catch((err) => {});
        },
        1000,
        true
      ),
      '修改昵称'
    );
  })
  .on(
    'click',
    '.dailybg',
    debounce(
      function () {
        _getAjax('/user/dailybg')
          .then((result) => {
            if (parseInt(result.code) === 0) {
              updateUserInfo();
              _msg.success(result.codeText);
              return;
            }
          })
          .catch((err) => {});
      },
      500,
      true
    )
  )
  .on('click', '.u_close_btn', hideUserInfo)
  .on('click', '.user_logo div', (e) => {
    let data = [
      {
        id: '1',
        text: '上传头像',
        beforeIcon: 'iconfont icon-shangchuan1',
      },
    ];
    if (_d.userInfo.logo) {
      data.push({
        id: '2',
        text: '查看',
        beforeIcon: 'iconfont icon-yanjing_xianshi_o',
      });
      data.push({
        id: '3',
        text: '删除',
        beforeIcon: 'iconfont icon-shanchu',
      });
    }
    selectMenu(
      e,
      data,
      ({ id, close }) => {
        if (id == '1') {
          upLogo((url) => {
            close();
            _postAjax('/user/updatalogo', { url }).then((res) => {
              if (res.code == '0') {
                updateUserInfo();
              }
            });
          });
        } else if (id == '2') {
          close();
          imgPreview([
            {
              u1: hdPath(
                `/api/logo/${_d.userInfo.account}/${_d.userInfo.logo}`
              ),
            },
          ]);
        } else if (id == '3') {
          _pop(
            {
              e,
              text: '确认删除头像？',
              confirm: { type: 'danger', text: '删除' },
            },
            (type) => {
              if (type == 'confirm') {
                _getAjax('/user/dellogo').then((res) => {
                  if (res.code == 0) {
                    close();
                    updateUserInfo();
                  }
                });
              }
            }
          );
        }
      },
      '头像选项'
    );
  });
function hideUserInfo() {
  backWindow.remove('userinfo');
  toHide($userInfoWrap[0], { to: 'bottom', scale: 'small' });
}
function handleUserinfo() {
  let { username, logo, account, dailybg } = _d.userInfo;
  let str = `<ul><li>昵称</li><li>${encodeHtml(
    username
  )}</li><li cursor class="edit_user_name">修改</li></ul>
    <ul><li>账号</li><li>${_d.userInfo.account}</li></ul>
    <ul><li>壁纸</li><li>每日自动更换壁纸</li><li style="color: var(--icon-color);" class="dailybg iconfont ${
      dailybg && dailybg === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'
    }" cursor></li></ul>`;
  logo = logo ? hdPath(`/api/logo/${account}/${logo}`) : getTextImg(username);
  $userInfoWrap.find('.user_list').html(str);
  $userInfoWrap.find('.user_logo div').css('background-image', `url(${logo})`);
}
function settingMenu(e, isMain) {
  let icon = 'icon-xianshiqi';
  if (dark == 'y') {
    icon = 'icon-icon_yejian-yueliang';
  } else if (dark == 'n') {
    icon = 'icon-taiyangtianqi';
  }
  let data = [
    {
      id: '1',
      text: '壁纸库',
      beforeIcon: 'iconfont icon-tupian',
    },
    {
      id: '2',
      text: '君子锁',
      beforeIcon: 'iconfont icon-suo',
    },
    {
      id: '3',
      text: '个性化',
      beforeIcon: 'iconfont icon-zhuti',
    },
    {
      id: '4',
      text: '黑暗模式',
      beforeIcon: `iconfont ${icon}`,
      param: { value: dark },
    },
  ];
  if (isMain && !isMobile()) {
    data = [
      ...data,
      {
        id: '5',
        text: '隐藏所有窗口',
        beforeIcon: 'iconfont icon-jianhao',
      },
      {
        id: '6',
        text: '关闭所有窗口',
        beforeIcon: 'iconfont icon-guanbi1',
      },
    ];
  }
  selectMenu(
    e,
    data,
    ({ e, resetMenu, close, id, param }) => {
      if (id == '1') {
        close();
        openbgku();
      } else if (id == '2') {
        inpMenu(
          e,
          {
            items: {
              text: {
                value: gentlemanLock,
                placeholder: '为空则取消',
                beforeText: '设置密码：',
              },
            },
          },
          debounce(
            function ({ e, inp, close }) {
              close();
              const text = inp.text;
              _setData('gentlemanLock', text);
              _delDataTem('gentlemanLock');
              gentlemanLock = text;
              if (text) {
                location.reload();
              } else {
                _msg.success();
              }
            },
            1000,
            true
          ),
          '防君子不防小人'
        );
      } else if (id == '3') {
        let dian = _getData('dian');
        let sound = _getData('sound');
        let data = [
          {
            id: '1',
            text: '背景模糊',
            beforeIcon: 'iconfont icon-mohu',
          },
          {
            id: '2',
            text: '背景黑白',
            beforeIcon: 'iconfont icon-heibai',
          },
          {
            id: '3',
            text: '更换字体',
            beforeIcon: 'iconfont icon-font-size',
          },
          {
            id: '4',
            text: '点击爱心',
            beforeIcon: 'iconfont icon-dianji',
            afterIcon:
              'iconfont ' +
              (dian === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'),
            param: { value: dian },
          },
          {
            id: '5',
            text: '提示音',
            beforeIcon: 'iconfont icon-tongzhi',
            afterIcon:
              'iconfont ' +
              (sound === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'),
            param: { value: sound },
          },
        ];
        selectMenu(
          e,
          data,
          ({ e, id, resetMenu, param }) => {
            if (id == '1') {
              _progressBar(
                e,
                curFilterBg / 100,
                throttle(function (per) {
                  curFilterBg = parseInt(per * 100);
                  if (curFilterBg <= 0) {
                    $pageBg.removeClass('mh');
                  } else {
                    $pageBg.addClass('mh');
                  }
                  $pageBg.css({
                    filter: `blur(${curFilterBg}px)`,
                  });
                  _setData('filterbg', curFilterBg);
                }, 500)
              );
            } else if (id == '2') {
              _progressBar(
                e,
                curPageColor,
                throttle(function (per) {
                  curPageColor = per;
                  document.documentElement.style.filter = `grayscale(${curPageColor})`;
                  _setData('pagecolor', curPageColor);
                }, 500)
              );
            } else if (id == '3') {
              _getAjax('/user/getfont')
                .then((res) => {
                  if (res.code == 0) {
                    res.data.sort((a, b) => mixedSort(a, b));
                    res.data.unshift('default');
                    let data = [];
                    res.data.forEach((item, idx) => {
                      let name = item.slice(0, -4);
                      data.push({
                        id: idx + 1,
                        text: item == 'default' ? '默认字体' : name,
                        beforeText: (idx + 1 + '').padStart(2, '0') + '. ',
                        param: { font: item },
                        active: curFontType == item ? true : false,
                      });
                    });
                    selectMenu(
                      e,
                      data,
                      ({ id, resetMenu, param }) => {
                        if (id) {
                          curFontType = param.font;
                          _setData('fonttype', curFontType);
                          data.forEach((item) => {
                            if (curFontType == item.param.font) {
                              item.active = true;
                            } else {
                              item.active = false;
                            }
                          });
                          resetMenu(data);
                          handleFontType();
                          const oIframe = [
                            ...document.querySelectorAll('iframe'),
                          ];
                          oIframe.forEach((item) => {
                            item.contentWindow.handleFontType &&
                              item.contentWindow.handleFontType();
                          });
                        }
                      },
                      '选择字体'
                    );
                  }
                })
                .catch((err) => {});
            } else if (id == '4') {
              let flag = param.value;
              if (flag === 'y') {
                data[id - 1].afterIcon = 'iconfont icon-kaiguan-guan';
                data[id - 1].param.value = 'n';
                _msg.success('关闭成功');
                _setData('dian', 'n');
              } else {
                data[id - 1].afterIcon = 'iconfont icon-kaiguan-kai1';
                data[id - 1].param.value = 'y';
                _msg.success('开启成功');
                _setData('dian', 'y');
              }
              resetMenu(data);
            } else if (id == '5') {
              let flag = param.value;
              if (flag === 'y') {
                data[id - 1].afterIcon = 'iconfont icon-kaiguan-guan';
                data[id - 1].param.value = 'n';
                _msg.success('关闭成功');
                _setData('sound', 'n');
              } else {
                data[id - 1].afterIcon = 'iconfont icon-kaiguan-kai1';
                data[id - 1].param.value = 'y';
                _msg.success('开启成功');
                _setData('sound', 'y');
              }
              resetMenu(data);
            }
          },
          '个性化设置'
        );
      } else if (id == '4') {
        let flag = param.value;
        if (flag === 'y') {
          dark = 'n';
          data[id - 1].beforeIcon = 'iconfont icon-taiyangtianqi';
          data[id - 1].param.value = dark;
          _setData('dark', dark);
          _msg.success('关闭成功');
        } else if (flag === 'n') {
          dark = 's';
          data[id - 1].beforeIcon = 'iconfont icon-xianshiqi';
          data[id - 1].param.value = dark;
          _setData('dark', dark);
          _msg.success('跟随系统');
        } else if (flag === 's') {
          dark = 'y';
          data[id - 1].beforeIcon = 'iconfont icon-icon_yejian-yueliang';
          data[id - 1].param.value = dark;
          _setData('dark', dark);
          _msg.success('开启成功');
        }
        darkMode(dark);
        resetMenu(data);
        const oIframe = [...document.querySelectorAll('iframe')];
        try {
          if (dark == 'y') {
            oIframe.forEach((item) => {
              item.contentWindow.document.documentElement.classList.add('dark');
              item.contentWindow.changeTheme &&
                item.contentWindow.changeTheme(dark);
            });
          } else if (dark == 'n') {
            oIframe.forEach((item) => {
              item.contentWindow.document.documentElement.classList.remove(
                'dark'
              );
              item.contentWindow.changeTheme &&
                item.contentWindow.changeTheme(dark);
            });
          } else if (dark == 's') {
            let state =
              window.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches;
            oIframe.forEach((item) => {
              if (state) {
                item.contentWindow.document.documentElement.classList.add(
                  'dark'
                );
              } else {
                item.contentWindow.document.documentElement.classList.remove(
                  'dark'
                );
              }
              item.contentWindow.changeTheme &&
                item.contentWindow.changeTheme(dark);
            });
          }
        } catch (error) {}
      } else if (id == '5') {
        close();
        hideAllwindow(1);
      } else if (id == '6') {
        close();
        closeAllwindow(1);
      }
    },
    '设置'
  );
}
function hdAdmin(e) {
  const data = [
    { id: '1', text: '用户管理', beforeIcon: 'iconfont icon-chengyuan' },
    { id: '2', text: '日志', beforeIcon: 'iconfont icon-rizhi' },
  ];
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        close(1);
        hideRightMenu();
        openIframe(`/root`, '用户管理');
      } else if (id == '2') {
        close(1);
        hideRightMenu();
        openIframe(`/log`, '日志');
      }
    },
    '管理员菜单'
  );
}
function hdTools(e) {
  let data = [
    { id: '1', text: '笔记本', beforeIcon: 'iconfont icon-mingcheng-jiluben' },
    { id: '2', text: '文件管理', beforeIcon: 'iconfont icon-24gl-folder' },
    { id: '3', text: '图床', beforeIcon: 'iconfont icon-tupian' },
    { id: '4', text: 'QRCode', beforeIcon: 'iconfont icon-erweima' },
    { id: '5', text: 'Web 记事本', beforeIcon: 'iconfont icon-jilu' },
  ];
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        close();
        openNote();
      } else if (id == '2') {
        close();
        hideRightMenu();
        openIframe(`/file`, '文件管理');
      } else if (id == '3') {
        close();
        hideRightMenu();
        openIframe(`/pic`, '图床');
      } else if (id == '4') {
        inpMenu(
          e,
          {
            subText: '生成',
            items: {
              text: {
                type: 'textarea',
                verify(val) {
                  if (val.trim() == '') {
                    return '请输入需要生成字符';
                  }
                },
              },
            },
          },
          debounce(
            function ({ e, inp, close }) {
              const text = inp.text;
              showQcode(e, text)
                .then((res) => {
                  close();
                })
                .catch((err) => {});
            },
            1000,
            true
          ),
          '生成二维码'
        );
      } else if (id == '5') {
        close();
        hideRightMenu();
        openIframe(`/notepad`, '记事本');
      }
    },
    '工具'
  );
}
function hdAccountManage(e) {
  let data = [
    {
      id: '1',
      text: '个人信息',
      beforeIcon: 'iconfont icon-zhanghao',
    },
    {
      id: '2',
      text: '批准免密登录',
      beforeIcon: 'iconfont icon-chengyuan',
    },
    {
      id: '3',
      text: '修改密码',
      beforeIcon: 'iconfont icon-suo',
    },
    {
      id: '4',
      text: '注销账号',
      beforeIcon: 'iconfont icon-zhuxiao',
    },
  ];
  if (_getData('account') === 'root') {
    data.push({
      id: '5',
      text: 'Admin',
      beforeIcon: 'iconfont icon-user_root',
    });
  }
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        showUserInfo();
        close(true);
      } else if (id == '3') {
        inpMenu(
          e,
          {
            subText: '提交',
            items: {
              pass: {
                beforeText: '原密码：',
                placeholder: '原密码',
                inputType: 'password',
              },
              npass: {
                beforeText: '新密码：',
                placeholder: '新密码',
                inputType: 'password',
              },
              rpass: {
                placeholder: '确认密码',
                beforeText: '确认密码：',
                inputType: 'password',
              },
            },
          },
          debounce(
            function ({ close, inp }) {
              let oldpassword = inp.pass,
                newpassword = inp.npass,
                newpassword1 = inp.rpass;
              if (newpassword !== newpassword1) {
                _msg.error('密码不一致');
                return;
              }
              _postAjax('/user/changepass', {
                oldpassword: md5(oldpassword),
                newpassword: md5(newpassword),
              })
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    _msg.success(result.codeText);
                    return;
                  }
                })
                .catch((_) => {});
            },
            500,
            true
          ),
          '修改密码'
        );
      } else if (id == '4') {
        _pop(
          {
            e,
            text: '确认注销账号？',
            confirm: { type: 'danger', text: '注销' },
          },
          (type) => {
            if (type == 'confirm') {
              _postAjax('/user/delaccount', {})
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    _delData();
                    _msg.success(result.codeText, (type) => {
                      if (type == 'close') {
                        myOpen('/login/');
                      }
                    });
                    return;
                  }
                })
                .catch((err) => {});
            }
          }
        );
      } else if (id == '2') {
        inpMenu(
          e,
          {
            items: {
              text: {
                beforeText: '登录码：',
                verify(val) {
                  val = val.trim();
                  if (val == '') {
                    return '请输入登录码';
                  } else if (val.length !== 6 || !isInteger(+val) || val < 0) {
                    return '请输入6位正整数';
                  }
                },
              },
            },
          },
          debounce(
            function ({ e, inp, close }) {
              if ($rightBox.isloding) {
                _msg.info('正在认证中');
                return;
              }
              const code = inp.text;
              $rightBox.isloding = true;
              let num = 0;
              let timer = setInterval(() => {
                _msg.botMsg(`认证中…${++num}`, 1);
              }, 1000);
              function closeLogin() {
                clearInterval(timer);
                timer = null;
                $rightBox.isloding = false;
                _msg.botMsg(`认证失败`, 1);
              }
              _postAjax('/user/allowcodelogin', { code }, { timeout: 15000 })
                .then((res) => {
                  closeLogin();
                  if (res.code == 0) {
                    close();
                    _msg.success(res.codeText);
                    _msg.botMsg(`认证成功`, 1);
                  }
                })
                .catch(() => {
                  closeLogin();
                });
            },
            1000,
            true
          ),
          '批准免密登录'
        );
      } else if (id == '5') {
        hdAdmin(e);
      }
    },
    '账号管理'
  );
}
function showUserInfo() {
  hideRightMenu();
  handleUserinfo();
  $userInfoWrap.stop().fadeIn(_speed);
  toCenter($userInfoWrap[0]);
  setZidx($userInfoWrap[0], 'userinfo', hideUserInfo);
}
//关于
$rightBox
  .on('click', '.tools', hdTools)
  .on('click', '.account_manage', hdAccountManage)
  .on('click', '.user_name', showUserInfo)
  .on('click', '.r_about', function () {
    hideRightMenu();
    openIframe('/note/?v=about', '关于');
  })
  .on('click', '.show_trash', function () {
    hideRightMenu();
    openIframe('/trash', '回收站');
  })
  .on('click', '.r_setting', settingMenu)
  .on('click', '.show_note', openNote)
  .on('click', '.show_share_list', function () {
    hideRightMenu();
    openIframe(`/sharelist/`, '分享列表');
  })
  .on('click', '.hd_bookmarks', function (e) {
    let data = [
      {
        id: '1',
        text: '导入书签',
        beforeIcon: 'iconfont icon-shangchuan_huaban',
      },
      {
        id: '2',
        text: '导出书签',
        beforeIcon: 'iconfont icon-xiazai',
      },
    ];
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          upStr()
            .then((res) => {
              if (!res) return;
              let data = hdImportBm(getbookmark(res));
              _postAjax(
                '/bmk/importbm',
                { arr: data },
                { timeout: 20000, load: true }
              )
                .then((res) => {
                  if (res.code == 0) {
                    close();
                    _msg.success(res.codeText);
                  }
                })
                .catch((err) => {});
            })
            .catch((err) => {
              _msg.error('导入文件格式错误');
            });
        } else if (id == '2') {
          _pop(
            {
              e,
              text: '确认导出？',
            },
            (type) => {
              if (type === 'confirm') {
                _getAjax('/bmk/exportbm', {}, { load: true, timeout: 0 })
                  .then((res) => {
                    downloadText(hdExportBm(res.data), 'bookmark.html');
                    close();
                  })
                  .catch((err) => {
                    _msg.error('导出书签失败');
                  });
              }
            }
          );
        }
      },
      '导入/导出书签'
    );
  })
  .on('click', '.show_music_player', showMusicPlayerBox)
  .on('click', '.show_todo', showTodoBox)
  .on('click', '.log_out', (e) => {
    _pop(
      {
        e,
        text: '退出当前，还是退出所有登录设备？',
        confirm: {
          text: '退出当前',
        },
        cancel: {
          text: '退出所有',
        },
      },
      (type) => {
        if (type == 'close') return;
        let all = 'y';
        type === 'confirm' ? (all = 'n') : null;
        _getAjax('/user/signout', { all })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              toLogin();
              return;
            }
          })
          .catch((err) => {});
      }
    );
  });
function openNote() {
  hideRightMenu();
  openIframe(`/notes/`, '笔记本');
}
function showMusicPlayerBox() {
  hideRightMenu();
  if (!$musicPlayerBox._mflag) {
    zidonghide(
      10,
      '.music_lrc_wrap',
      '.lrc_foot_wrap',
      debounce(
        function () {
          $lrcFootWrap.stop().slideDown(_speed, () => {
            $lrcFootWrap._flag = 'y';
            lrcScroll();
          });
        },
        500,
        true
      ),
      debounce(
        function () {
          $lrcFootWrap.stop().slideUp(_speed, () => {
            $lrcFootWrap._flag = 'n';
            lrcScroll();
          });
        },
        500,
        true
      ),
      '.lrc_menu_wrap'
    );
    $musicPlayerBox._mflag = true;
  }
  $miniPlayer.stop().fadeOut(_speed);
  $musicPlayerBox.stop().fadeIn(_speed, () => {
    renderMusicList();
  });
  if (!$musicPlayerBox._once) {
    $musicPlayerBox._once = true;
    toSetSize($musicPlayerBox[0], 600, 800);
    toCenter($musicPlayerBox[0]);
  }
  setZidx($musicPlayerBox[0], 'music', hideMusicPlayBox);
}
function showTodoBox() {
  hideRightMenu();
  setZidx($todoBox[0], 'todo', closeTodoBox);
  $todoBox.stop().fadeIn(_speed, () => {
    renderTodoList();
  });
  $todoBox.css('display', 'flex');
  if (!$todoBox._once) {
    $todoBox._once = true;
    toSetSize($todoBox[0], 800, 800);
    toCenter($todoBox[0]);
  }
}
function hdExportBm(arr) {
  let str = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
  <!-- This is an automatically generated file.
       It will be read and overwritten.
       DO NOT EDIT! -->
  <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
  <TITLE>Bookmarks</TITLE>
  <H1>Bookmarks</H1>
  <DL><p>
      <DT><H3 PERSONAL_TOOLBAR_FOLDER="true">收藏夹栏</H3>
      <DL><p>\n`;
  arr.forEach((item) => {
    str += `<DT><H3>${item.name}</H3>\n<DL><p>\n`;
    item.children.forEach((y) => {
      str += `<DT><A HREF="${y.link}">${y.name}</A>\n`;
    });
    str += `</DL><p>\n`;
  });
  str += `</DL><p>\n</DL><p>`;
  return str;
}
function hdImportBm(arr) {
  let res = [];
  function fn(arr, name = 'xxx') {
    let dirs = arr.filter((item) => item.folder),
      its = arr.filter((item) => !item.folder);
    if (its.length > 0) {
      res.push({
        name,
        list: its,
      });
    }
    dirs.forEach((item) => {
      fn(item.children, item.name);
    });
  }
  fn(arr, 'home');
  return res;
}
// 留言板
const chatSearchInput = wrapInput(
  $chatHeadBtns.find('.search_msg_inp input')[0],
  {
    change(val) {
      val = val.trim();
      if (val == '') {
        $chatHeadBtns.find('.search_msg_inp i').css('display', 'none');
      } else {
        $chatHeadBtns.find('.search_msg_inp i').css('display', 'block');
      }
    },
    focus(target) {
      $(target).parent().addClass('focus');
    },
    blur(target) {
      $(target).parent().removeClass('focus');
    },
  }
);
const hdChatSearchInput = debounce(function () {
  let val = chatSearchInput.getValue().trim();
  let pchatId = deepClone(chatobj);
  loadingImg($chatListBox.find('.chat_list')[0]);
  _getAjax('/chat/getmsg', { stu: 0, acc: pchatId.account, val })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        if ($chatRoomWrap.is(':hidden')) return;
        let str = renderMsgList(result.data);
        $chatListBox.find('.chat_list').html(str);
        $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
        chatimgLoad();
      }
    })
    .catch((err) => {});
}, 1000);
let chatobj = {
  account: 'chang',
};
$userListBox.userListNum = 1;
$userListBox.userList = [];
function getUserItem(account) {
  return $userListBox.userList.find((item) => item.account == account);
}
function switchUserList(top) {
  if ($chatRoomWrap.is(':hidden') || $userListBox.is(':hidden')) return;
  let pageTotal = Math.ceil($userListBox.userList.length / 50);
  $userListBox.userListNum < 1
    ? ($userListBox.userListNum = pageTotal)
    : $userListBox.userListNum > pageTotal
    ? ($userListBox.userListNum = 1)
    : null;

  $userListBox.userList.sort((a, b) => b.time - a.time);
  let str = '';
  $userListBox.userList
    .slice(($userListBox.userListNum - 1) * 50, $userListBox.userListNum * 50)
    .forEach((v) => {
      let { username, account, logo, online, des = '', islook } = v;
      let isme = false;
      if (_d.userInfo.account == account) {
        username = '文件传输助手';
        isme = true;
      }
      logo = logo
        ? hdPath(`/api/logo/${account}/${logo}`)
        : getTextImg(des || username);
      username = encodeHtml(username);
      des = encodeHtml(des);
      str += `<ul data-account="${account}" class="user_item">
              <i x=${islook} class="msg_alert"></i>
              <li cursor class="user_logo" style="${
                online === 'y' ? '' : 'filter: grayscale(1);'
              }background-image:url(${logo});"></li>
              <li cursor class="user_name">${des || username}</li>
              ${
                isme
                  ? ''
                  : `<li style="font-size:14px;line-height:40px;flex:none;color:${
                      online === 'y' ? 'green' : 'var(--color4)'
                    };">${online === 'y' ? '在线' : '离线'}</li>`
              }
              </ul>`;
    });
  if (pageTotal > 1) {
    str += `<div style="padding:20px 0;text-align:center;line-height: 26px;" 
                  class="user_list_paging jzxz">
                    <span class="prev_page iconfont icon-prev" cursor></span>
                    <span cursor class="input_num" style="margin:0 30px">${$userListBox.userListNum}/${pageTotal}</span>
                    <span class="next_page iconfont icon-page-next" cursor></span>
                    </div>`;
  }
  $userListBox.html(str);
  if (top) {
    $userListBox.scrollTop(0);
  }
  $chatHeadBtns.find('.c_msg_alert').stop().fadeOut(_speed);
}

function closeChatRoom() {
  toHide($chatRoomWrap[0], { to: 'bottom', scale: 'small' }, () => {
    backWindow.remove('chat');
    chatTitleScroll.close();
    $chatListBox.find('.chat_list').html('');
    chatSearchInput.setValue('');
    cImgLoad.unBind();
  });
}
$chatHeadBtns
  .on('click', '.c_close_btn', closeChatRoom)
  .on('click', '.clear_msg_btn', function (e) {
    let ac = chatobj.account;
    if (ac === 'chang' && _d.userInfo.account !== 'root') {
      _msg.error('没有权限操作');
      return;
    }
    _pop(
      {
        e,
        text: `确认清空当前聊天记录？`,
        confirm: { type: 'danger', text: '清空' },
      },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/chat/clearmsg', { ac })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on(
    'click',
    '.chat_home_btn',
    throttle(function () {
      if (_d.userInfo.account === 'root') {
        $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
      } else {
        $chatHeadBtns.find('.clear_msg_btn').stop().fadeOut(_speed);
      }
      chatobj.account = 'chang';
      setChatTitle('chang');
      chatSearchInput.setValue('');
      chatMsgInp.setValue(temChatMsg['chang'] || '');
      loadingImg($chatListBox.find('.chat_list')[0]);
      _getAjax('/chat/getmsg', { acc: 'chang', stu: 0 })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            if ($chatRoomWrap.is(':hidden')) return;
            let str = renderMsgList(result.data);
            $chatListBox.find('.chat_list').html(str);
            $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
            chatimgLoad();
          }
        })
        .catch((err) => {});
      $chatHeadBtns.find('.c_home_msg_alert').stop().fadeOut(_speed);
    }, 2000)
  )
  .on('input', '.search_msg_inp input', function () {
    hdChatSearchInput();
  })
  .on('click', '.search_msg_inp i', function () {
    chatSearchInput.setValue('');
    chatSearchInput.target.focus();
    hdChatSearchInput();
  })
  .on(
    'click',
    '.c_user_btn',
    debounce(
      function (e) {
        $userListBox.userListNum = 1;
        $userListBox.stop().slideDown(_speed, () => {
          renderUserList(true);
        });
      },
      500,
      true
    )
  );
function renderUserList(top) {
  let a = $userListBox.children();
  if (a.length === 0) {
    chengyuandefault();
  }
  _getAjax('/chat/getmember')
    .then((result) => {
      if (parseInt(result.code) === 0) {
        $userListBox.userList = result.data;
        switchUserList(top);
      }
    })
    .catch((err) => {});
}
function getChatItem(id) {
  return $chatRoomWrap.list.find((item) => item.id == id);
}
$chatRoomWrap.list = [];
// 渲染显示聊天内容
function renderMsgList(carr, isAdd) {
  if (carr.length === 0) return '';
  if (isAdd) {
    carr = carr.filter(
      (item) => !$chatRoomWrap.list.some((y) => y.id === item.id)
    );
    $chatRoomWrap.list = [...$chatRoomWrap.list, ...carr];
  } else {
    $chatRoomWrap.list = carr;
  }
  let str = '';
  carr.forEach((v) => {
    let {
      id,
      data,
      time,
      _from,
      _to,
      name,
      size,
      showTime,
      logo,
      type,
      des = '',
    } = v;
    let date = formatDate({
      template: '{0}-{1}-{2} {3}:{4}',
      timestamp: time,
    }).split(' ');
    let showname = false;
    if (_to === 'chang') {
      showname = true;
    }
    const text = data;
    logo = logo
      ? hdPath(`/api/logo/${_from}/${logo}`)
      : getTextImg(des || name);
    data = encodeHtml(data);
    name = encodeHtml(name);
    des = encodeHtml(des);
    size = encodeHtml(size);
    const uname = des || name;
    let isright = _from === _d.userInfo.account ? true : false;
    if (showTime === 'y') {
      str += `<div class="chat_time">${date[0]}</div>`;
    }
    str += `<ul class="chat_item" data-id="${id}">`;
    if (!isright) {
      str += `<li class="c_left_logo">`;
      str += `<div cursor class="c_logo" style="background-image: url(${logo});float: left;"></div>`;
      str += `</li>`;
    }
    str += `<li class="c_content_box">`;
    str += `<span class="c_user_name" style="text-align: ${
      !isright ? 'left' : 'right'
    };">${showname ? `${uname}` : ''} <span cursor>${date[1]}</span></span>`;
    if (type == 'image') {
      str += `<div cursor title="${data}" class="c_img_msg_box" style="float: ${
        !isright ? 'left' : 'right'
      };">
          <div class="c_img"><span>${size}</span></div>`;
      str += `</div>`;
    } else if (type == 'voice') {
      str += `<div cursor class="c_voice_msg_box ${
        isright ? 'bcolor' : ''
      }" style="float: ${!isright ? 'left' : 'right'};width: ${
        (parseFloat(size) / 30) * 100
      }%;text-align:${isright ? 'right' : 'left'}">`;
      if (isright) {
        str += `<span class="c_right_triangle bcolor"></span><span style="font-size:12px;">${size}</span><i class="iconfont icon-yuyin-cuxiantiao"></i>`;
      } else {
        str += `<span class="c_left_triangle"></span><i class="iconfont icon-yuyin1"></i><span style="font-size:12px;">${size}</span>`;
      }
      str += `</div>`;
    } else if (type == 'file') {
      str += `<div title="${data}" class="c_file_msg_box" style="float: ${
        !isright ? 'left' : 'right'
      };">
            <div cursor class="c_file_info">
              <span class="file_name">${data}</span>
              <span class="file_size">${size}</span>
            </div>
            <div class="file_type iconfont ${fileLogoType(data)}">
            </div>`;
      if (isright) {
        str += `<span class="c_right_triangle"></span>`;
      } else {
        str += `<span class="c_left_triangle"></span>`;
      }
      str += `</div>`;
    } else if (type == 'text') {
      str += `<p class="c_text_msg_box ${
        isright ? 'bcolor' : ''
      }" style="float: ${!isright ? 'left' : 'right'};">${hdTextMsg(text)}`;
      if (isright) {
        str += `<span class="c_right_triangle bcolor"></span>`;
      } else {
        str += `<span class="c_left_triangle"></span>`;
      }
      str += `</p>`;
    }
    str += `</li>`;
    if (isright) {
      str += `<li class="c_right_logo">`;
      str += `<div class="c_logo" style="background-image: url(${logo});float: right;"></div>`;
      str += `</li>`;
    }
    str += `</ul>`;
  });
  return str;
}
//处理聊天图片
const cImgLoad = new LazyLoad();
function chatimgLoad() {
  cImgLoad.bind($chatListBox[0].querySelectorAll('.c_img'), (item) => {
    let $v = $(item);
    let url = getFilePath(
      `/upload/${$v.parent().parent().parent().data('id')}`,
      1
    );
    imgjz(
      url,
      () => {
        $v.css({
          'background-image': `url(${url})`,
        }).addClass('load');
      },
      () => {
        $v.css({
          'background-image': `url(${imgGqImg})`,
        }).addClass('load');
      }
    );
  });
}

// 浏览器通知
function tongzhi(name, data, from, to, logo) {
  _msg.warning(`${name}: ${data}`, (type) => {
    if (type == 'click') {
      chatobj.account = to == 'chang' ? to : from;
      chatSearchInput.setValue('');
      showChatRoom();
    }
  });
  logo = logo ? hdPath(`/api/logo/${from}/${logo}`) : getTextImg(name);
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') {
    sendNotification(
      {
        title: name + '：',
        body: data,
        icon: logo,
      },
      () => {
        chatobj.account = to == 'chang' ? to : from;
        chatSearchInput.setValue('');
        showChatRoom();
      }
    );
  }
}

//打开聊天窗
const temChatMsg = _getDataTem('temChatMsg') || {};
function showChatRoom() {
  let obj = deepClone(chatobj);
  setZidx($chatRoomWrap[0], 'chat', closeChatRoom);
  if (obj.account === 'chang') {
    if (_d.userInfo.account === 'root') {
      $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
    } else {
      $chatHeadBtns.find('.clear_msg_btn').stop().fadeOut(_speed);
    }
  } else {
    $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
  }
  //隐藏主页消息提示
  $showChatRoomBtn.attr('class', 'show_chat_room_btn iconfont icon-liaotian');
  $chatRoomWrap.stop().fadeIn(_speed, () => {
    //获取消息
    chatSearchInput.setValue('');
    setChatTitle(obj.account);
    chatMsgInp.setValue(temChatMsg[obj.account] || '');
    loadingImg($chatListBox.find('.chat_list')[0]);
    _getAjax('/chat/getmsg', { acc: obj.account, stu: 0 })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          if ($chatRoomWrap.is(':hidden')) return;
          let str = renderMsgList(result.data);
          $chatListBox.find('.chat_list').html(str);
          $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
          chatimgLoad();
          //获取是否有未读私聊消息
          _getAjax('/chat/getnews', { a: 2 }, { parallel: 1 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                $chatHeadBtns.find('.c_msg_alert').stop().fadeOut(_speed);
              } else {
                $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
              }
            })
            .catch((err) => {});
          //获取是否有群消息未读
          _getAjax('/chat/getnews', { a: 1 }, { parallel: 1 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                $chatHeadBtns.find('.c_home_msg_alert').stop().fadeOut(_speed);
              } else {
                $chatHeadBtns.find('.c_home_msg_alert').stop().fadeIn(_speed);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  });
  if (!$chatRoomWrap._once) {
    $chatRoomWrap._once = true;
    toSetSize($chatRoomWrap[0], 600, 800);
    toCenter($chatRoomWrap[0]);
  }
}
$showChatRoomBtn.on('click', debounce(showChatRoom, 500, true));
const hdToBotBtn = debounce(function () {
  $chatRoomWrap.find('.scroll_to_bot_btn').fadeOut(_speed);
}, 5000);
function userMenu(e, from, name, des, logo, isUserList) {
  let obj = deepClone(chatobj);
  let data = [
    {
      id: '1',
      text: name,
      beforeIcon: 'iconfont icon-zhanghao',
    },
  ];
  if (logo) {
    data.push({
      id: '5',
      text: '头像',
      beforeIcon: 'iconfont icon-yanjing_xianshi_o',
    });
  }
  if (obj.account == 'chang' || isUserList) {
    data.push({
      id: '2',
      text: '发送消息',
      beforeIcon: 'iconfont icon-huaban',
    });
  }
  data = [
    ...data,
    {
      id: '3',
      text: '笔记本',
      beforeIcon: 'iconfont icon-mingcheng-jiluben',
    },
    {
      id: '4',
      text: '书签夹',
      beforeIcon: 'iconfont icon-shuqian',
    },
  ];
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '2') {
        close();
        openFriend(from);
      } else if (id == '3') {
        let url = `/notes/?acc=${from}`;
        openIframe(url, (des || name) + '的笔记本');
        close();
      } else if (id == '1') {
        let data = [
          {
            id: '1',
            text: des,
            beforeText: '备注：',
          },
          {
            id: '1',
            text: from,
            beforeText: '账号：',
            pointer: false,
          },
        ];
        selectMenu(
          e,
          data,
          ({ e, id }) => {
            if (id == '1') {
              inpMenu(
                e,
                {
                  subText: '提交',
                  items: {
                    text: {
                      placeholder: '备注',
                      value: des,
                      verify(val) {
                        if (val.trim().length > 20) {
                          return '请输入0-20位';
                        }
                      },
                    },
                  },
                },
                debounce(
                  function ({ close, inp }) {
                    const des = inp.text;
                    _postAjax('/chat/setdes', { acc: from, des })
                      .then((res) => {
                        if (res.code == 0) {
                          _msg.success(res.codeText);
                          close(true);
                          if (chatobj.account == 'chang') {
                            openFriend(chatobj.account, true);
                          } else if (chatobj.account == from) {
                            setChatTitle(chatobj.account);
                          }
                          if (isUserList) {
                            $userListBox.userListNum = 1;
                            renderUserList(true);
                          }
                        }
                      })
                      .catch((err) => {});
                  },
                  1000,
                  true
                ),
                '设置备注'
              );
            }
          },
          '用户信息'
        );
      } else if (id == '4') {
        close();
        openIframe(`/bmk/#${from}`, (des || name) + '的书签夹');
      } else if (id == '5') {
        imgPreview([{ u1: hdPath(`/api/logo/${from}/${logo}`) }]);
        close();
      }
    },
    des || name
  );
}
$chatListBox
  .on('click', '.c_logo', function (e) {
    //点击用户头像私聊
    const $this = $(this).parent().parent();
    const obj = getChatItem($this.data('id'));
    let from = obj._from,
      name = obj.name,
      des = obj.des,
      logo = obj.logo;
    //忽略自己点自己头像或在私聊
    if (from === _d.userInfo.account) {
      return;
    }
    userMenu(e, from, name, des, logo);
  })
  .on('click', '.c_file_msg_box', function (e) {
    //下载文件
    const $this = $(this).parent().parent();
    const obj = getChatItem($this.data('id'));
    let aa = obj.id,
      name = obj.data;
    //查看文件是否过期
    _getAjax('/chat/isexpired', { name: obj.isrc })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          if (/\.mp4$/i.test(name)) {
            openIframe(
              `/videoplay/#${encodeURIComponent(getFilePath(`/upload/${aa}`))}`,
              name
            );
          } else if (/(\.mp3|\.aac|\.wav|\.ogg)$/gi.test(name)) {
            openIframe(getFilePath(`/upload/${aa}`), name);
          } else if (isios()) {
            myOpen(getFilePath(`/upload/${aa}`));
          } else {
            myOpen(getFilePath(`/upload/${aa}`), 'blank');
          }
          return;
        }
        _msg.error('文件已过期');
      })
      .catch((err) => {});
  })
  .on('contextmenu', '.c_content_box', function (e) {
    //操作消息
    e.preventDefault();
    if (isMobile()) return;
    let $this = $(this);
    backmsg(e, getChatItem($this.parent().data('id')));
  })
  .on('click', '.c_user_name span', function (e) {
    let $this = $(this).parent().parent();
    backmsg(e, getChatItem($this.parent().data('id')));
  })
  .on('click', '.c_voice_msg_box', function (e) {
    //播放语音
    let a = $(this).parent().parent().attr('data-id');
    //检查语音是否过期
    openyuy(getFilePath(`/upload/${a}`), this);
  })
  .on('click', '.c_img', function (e) {
    //打开图片
    const id = $(this).parent().parent().parent().attr('data-id');
    const obj = getChatItem(id);
    // 检查图片是否过期
    _getAjax('/chat/isexpired', { name: obj.isrc })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          imgPreview([
            {
              u1: getFilePath(`/upload/${id}`),
              u2: getFilePath(`/upload/${id}`, 1),
            },
          ]);
          return;
        }
        _msg.error('图片已过期');
      })
      .catch((err) => {});
  })
  .on('scroll', function () {
    $chatRoomWrap.find('.scroll_to_bot_btn').fadeIn(_speed);
    hdToBotBtn();
  })
  .on(
    'scroll',
    debounce(function () {
      chatimgLoad();
      //向上滚动获取前面聊天内容
      let nomore = $chatListBox.find('.nomore');
      if (
        $chatListBox.find('.chat_list').outerHeight() <
          $chatListBox.outerHeight() ||
        nomore.length > 0
      )
        return;
      if (this.scrollTop <= 30) {
        let fristel = $chatListBox.find('.chat_item').eq(0);
        let flag = fristel.attr('data-id');
        let val = chatSearchInput.getValue().trim();
        _getAjax('/chat/getmsg', {
          flag,
          acc: chatobj.account,
          stu: 1,
          val,
        })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              if ($chatRoomWrap.is(':hidden')) return;
              let str = renderMsgList(result.data, 1);
              if (str === '') {
                str += `<div class="nomore" style="text-align: center;font-size: 14px;color: var(--text-hover-color);">没有更多了<div>`;
              }
              $chatListBox.find('.chat_list').prepend(str);
              $chatListBox.scrollTop(fristel.position().top - 50);
              chatimgLoad();
            }
          })
          .catch((err) => {});
      }
    }, 200)
  );
$chatRoomWrap.on('click', '.scroll_to_bot_btn', function () {
  $chatListBox.animate(
    {
      scrollTop: $chatListBox[0].scrollHeight,
    },
    _speed
  );
});
longPress($chatListBox[0], '.c_content_box', function (e) {
  let $this = $(this),
    ev = e.changedTouches[0];
  backmsg(ev, getChatItem($this.parent().data('id')));
});
//操作消息
function backmsg(e, cobj) {
  let obj = deepClone(chatobj);
  const { type, _from, id: tt, data: z, isrc: y } = cobj;
  let data = [];
  if (type == 'text') {
    data = [
      {
        id: '1',
        text: '复制',
        beforeIcon: 'iconfont icon-fuzhi',
      },
      {
        id: '2',
        text: '编辑',
        beforeIcon: 'iconfont icon-bianji',
      },
    ];
  } else {
    data = [
      {
        id: '3',
        text: '下载',
        beforeIcon: 'iconfont icon-xiazai1',
      },
    ];
  }
  if (_from === _d.userInfo.account) {
    data.push({
      id: '4',
      text: '撤回',
      beforeIcon: 'iconfont icon-chexiao',
    });
  }
  selectMenu(
    e,
    data,
    ({ close, id }) => {
      if (id == '4') {
        _postAjax('/chat/delmsg', { tt, to: obj.account })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              _msg.success(result.codeText);
              return;
            }
          })
          .catch((err) => {});
      } else if (id == '1') {
        copyText(z);
        close();
      } else if (id == '2') {
        chatMsgInp.setValue(z);
        chatMsgInp.target.focus();
        close();
      } else if (id == '3') {
        let flag = null;
        if (type == 'image') {
          flag = '图片';
        } else if (type == 'voice') {
          flag = '语音';
        } else if (type == 'file') {
          flag = '文件';
        }
        if (!flag) return;
        _getAjax('/chat/isexpired', { name: y })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              downloadFile(getFilePath(`/upload/${tt}`), z);
              return;
            }
            _msg.error(`${flag}已过期`);
          })
          .catch((err) => {});
      }
    },
    cobj.data
  );
}

// 播放语音
function openyuy(a, _this) {
  let pflag = $chatAudio.playflag,
    _flag = getPathFilename(a)[1];
  $chatAudio[0].pause();
  $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  if (pflag === _flag) {
    $chatAudio.playflag = '';
    return;
  }
  $chatAudio.playflag = _flag;
  $chatAudio[0].src = a;
  $chatAudio[0].play();
  $(_this)
    .children('i')
    .css('animation', 'fontcolor .5s infinite linear alternate');
}
$chatAudio
  .on('ended', function () {
    $chatAudio.playflag = '';
    $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  })
  .on('error', function () {
    _msg.error('语音已过期');
    $chatAudio.playflag = '';
    $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  });

function sendText() {
  let pchatId = deepClone(chatobj),
    pdata = chatMsgInp.getValue().trim();
  $chatFootBox
    .find('.c_sent_msg_btn')
    .attr('x', 1)
    .children('i')
    .attr('class', 'iconfont icon-jiahao');
  chatMsgInp.setValue('');
  if (pdata === '') return;
  let obj = {
    data: pdata,
    type: 'text',
  };
  sendmasg(obj, pchatId);
}
// 发送消息
function sendmasg(obj, pchatId) {
  _postAjax('/chat/takemsg', {
    _to: pchatId.account,
    data: obj.data,
    isrc: obj.isrc,
    size: obj.size,
    hash: obj.hash,
    type: obj.type,
  })
    .then((result) => {})
    .catch((err) => {});
}
const chatMsgInp = wrapInput(
  $chatFootBox.find('.c_text_msg .c_text_content')[0],
  {
    change(val) {
      $chatFootBox.find('.c_text_msg .fill_height').text(val);
      temChatMsg[chatobj.account] = val;
      _setDataTem('temChatMsg', temChatMsg);
      if (val.trim() === '') {
        $chatFootBox.find('.clean').removeClass('show');
        $chatFootBox
          .find('.c_sent_msg_btn')
          .attr('x', 1)
          .children('i')
          .attr('class', 'iconfont icon-jiahao');
      } else {
        $chatFootBox.find('.clean').addClass('show');
        $chatFootBox
          .find('.c_sent_msg_btn')
          .attr('x', 2)
          .children('i')
          .attr('class', 'iconfont icon-huaban');
      }
    },
    focus(target) {
      $(target).addClass('focus');
    },
    blur(target) {
      $(target).removeClass('focus');
    },
  }
);
// 发送文件
$chatFootBox
  .on('click', '.c_sent_msg_btn', async function () {
    if ($(this).attr('x') == 1) {
      let pchatId = deepClone(chatobj);
      const files = await getFiles({ multiple: true });
      if (files.length == 0) return;
      sendfile(files, pchatId);
    } else {
      sendText();
    }
  })
  .on('click', '.clean', function () {
    chatMsgInp.setValue('');
    chatMsgInp.target.focus();
  })
  .on('click', '.c_change_btn', function () {
    const $this = $(this);
    if ($this.attr('x') == 1) {
      $chatFootBox.find('.c_get_voice_btn').css('display', 'block');
      $chatFootBox.find('.c_text_msg').css('display', 'none');
      $this.attr('x', 2).children('i').attr('class', 'iconfont icon-w_jianpan');
      $chatFootBox
        .find('.c_sent_msg_btn')
        .attr('x', 1)
        .children('i')
        .attr('class', 'iconfont icon-jiahao');
    } else {
      $chatFootBox.find('.c_get_voice_btn').css('display', 'none');
      $chatFootBox.find('.c_text_msg').css('display', 'block');
      $this.attr('x', 1).children('i').attr('class', 'iconfont icon-yuyin');
    }
  })
  .on('keyup', '.c_text_content', function (e) {
    let key = e.key,
      ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && key === 'Enter') {
      sendText();
      e.preventDefault();
    }
  })
  .find('.c_text_content')[0]
  .addEventListener('paste', function (e) {
    let files = [];
    let data = e.clipboardData || window.clipboardData;
    [...data.items].forEach((item) => {
      let blob = item.getAsFile();
      if (blob) {
        files.push(blob);
      }
    });
    let pchatId = deepClone(chatobj);
    if (files.length == 0) return;
    e.preventDefault();
    sendfile(files, pchatId);
  });
// 拖拽发送文件
~(function () {
  let guestb = $chatRoomWrap[0];
  guestb.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  guestb.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  guestb.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files],
      pchatId = deepClone(chatobj);
    if (files.length == 0) return;
    sendfile(files, pchatId);
  });
})();
// 发送文件
async function sendfile(files, pchatId) {
  for (let i = 0; i < files.length; i++) {
    let { name, size } = files[i];
    let pro = new UpProgress(name);
    if (size == 0) {
      pro.fail('发送失败');
      _msg.error(`不能发送空文件`);
      continue;
    }
    try {
      let { chunks, count, suffix, HASH } = await fileSlice(
        files[i],
        (percent) => {
          pro.loading(percent);
        }
      );
      let breakpointarr = (await _postAjax('/chat/breakpoint', { HASH })).data, //断点续传
        isrepeat = await _postAjax('/chat/repeatfile', {
          HASH,
        }), //是否已经存在文件
        obj = {
          size: computeSize(size),
          data: name,
          type: isImgFile(name) ? 'image' : 'file',
        }; //生成消息对象

      function compale(index) {
        pro.update(index / count);
      }

      if (parseInt(isrepeat.code) === 0) {
        //文件已经存在操作
        pro.close('发送成功');
        const { id, url } = isrepeat.data;
        obj.isrc = url;
        obj.hash = id;
        sendmasg(obj, pchatId);
        continue;
      }

      let index = breakpointarr.length;
      compale(index);
      for (let j = 0; j < chunks.length; j++) {
        let { filename, file } = chunks[j];
        if (breakpointarr.includes(filename)) {
          continue;
        }
        await _upFile(
          {
            url: `/chat/up`,
            param: {
              name: filename,
              HASH,
            },
          },
          file
        );
        index++;
        compale(index);
      }
      let aa = await _postAjax(
        '/chat/mergefile',
        {
          HASH,
          count,
          name,
          _to: pchatId.account,
          size: obj.size,
          type: obj.type,
        },
        {
          timeout: 0,
        }
      ); //合并切片
      if (parseInt(aa.code) === 0) {
        pro.close('发送成功');
      } else {
        pro.close('处理文件中');
      }
    } catch (error) {
      pro.close('发送失败');
      _msg.error(`文件发送失败`);
    }
  }
}
// 语音发送
function uploadRec(blob, duration) {
  if (!blob) {
    _msg.error('发送失败');
    return;
  }
  if (duration < 2) {
    _msg.error('语音最短2s');
    return;
  }
  if (duration > 30) {
    _msg.error('语音最长30s');
    return;
  }
  const pchatId = deepClone(chatobj);
  const pro = new UpProgress(`语音`);
  fileSlice(blob, function (percent) {
    pro.update(percent);
  }).then((buf) => {
    const { HASH } = buf;
    _upFile(
      {
        url: `/chat/upp`,
        param: {
          HASH,
          name: `${HASH}.wav`,
          _to: pchatId.account,
          size: duration + 's',
        },
      },
      blob,
      (percent) => {
        pro.update(percent);
      }
    )
      .then((res) => {
        if (res.code == 0) {
          pro.close('发送成功');
          playSound(imgVoice);
        }
      })
      .catch((err) => {
        pro.fail('发送失败');
      });
  });
}
~(function () {
  let x = null,
    y = null;
  $chatFootBox
    .find('.c_get_voice_btn')
    .on('touchstart', function (e) {
      e.preventDefault();
      if (!isMobile()) return;
      $chatFootBox.find('.c_get_voice_btn').addClass('gren');
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
      record.start();
    })
    .on('touchend', function (e) {
      e.preventDefault();
      if (!isMobile()) return;
      $chatFootBox.find('.c_get_voice_btn').removeClass('gren');
      let xx = e.changedTouches[0].clientX,
        yy = e.changedTouches[0].clientY;
      if (Math.abs(x - xx) > 60 || Math.abs(y - yy) > 60) {
        record.stop();
        return;
      }
      const { blob, duration } = record.stop();
      uploadRec(blob, duration);
    })
    .on('mousedown', function () {
      if (isMobile()) return;
      $chatFootBox.find('.c_get_voice_btn').addClass('gren');
      record.start();
    });
  $document.on('mouseup', function (e) {
    if (isMobile()) return;
    $chatFootBox.find('.c_get_voice_btn').removeClass('gren');
    if (_getTarget(this, e, '.chat_foot_box .c_get_voice_btn')) {
      const { blob, duration } = record.stop();
      uploadRec(blob, duration);
    } else {
      record.stop();
    }
  });
})();
// 显示好友
$chatRoomWrap.on('click', function (e) {
  if (
    !_getTarget(this, e, '.user_list_box') &&
    !_getTarget(this, e, '.c_user_btn')
  ) {
    $userListBox.stop().slideUp(_speed, () => {
      $userListBox.html('');
    });
  }
});
const chatTitleScroll = new ContentScroll(
  $chatHeadBtns.find('.chat_title .text_box')[0]
);
function setChatTitle(acc) {
  chatTitleScroll.init('');
  if (acc == _d.userInfo.account) {
    chatTitleScroll.init('文件传输助手');
  } else if (acc == 'chang') {
    chatTitleScroll.init('聊天室');
  } else {
    _getAjax('/chat/getdes', { acc })
      .then((res) => {
        if (res.code == 0) {
          const { username, des } = res.data;
          chatTitleScroll.init(des || username);
        }
      })
      .catch((err) => {});
  }
}
function chengyuandefault() {
  let str = '';
  new Array(50).fill(null).forEach(() => {
    str += `<ul style="pointer-events: none;" class="user_item">
              <li class="user_logo"></li>
              <li class="user_name"></li>
              <li></li>
              </ul>`;
  });
  $userListBox.html(str);
}
function openFriend(a, b) {
  chatobj.account = a;
  setChatTitle(a);
  $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
  chatSearchInput.setValue('');
  chatMsgInp.setValue(temChatMsg[a] || '');
  if (!b) {
    $userListBox.css('display', 'none');
    $userListBox.html('');
  }
  loadingImg($chatListBox.find('.chat_list')[0]);
  _getAjax('/chat/getmsg', { acc: a, stu: 0 })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        if ($chatRoomWrap.is(':hidden')) return;
        let str = renderMsgList(result.data);
        $chatListBox.find('.chat_list').html(str);
        $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
        chatimgLoad();
      }
    })
    .catch((err) => {});
}
// 显示好友消息
$userListBox
  .on('click', '.user_item', function (e) {
    const $this = $(this);
    const uObj = getUserItem($this.data('account'));
    let name = uObj.username,
      from = uObj.account,
      des = uObj.des,
      logo = uObj.logo;
    if (!name || !from) return;
    if (_getTarget(this, e, '.user_logo')) {
      if (_d.userInfo.account == from) {
        openFriend(from);
        return;
      }
      userMenu(e, from, name, des, logo, 1);
    } else if (_getTarget(this, e, '.user_name')) {
      openFriend(from);
    }
  })
  .on('click', '.prev_page', function (e) {
    e.stopPropagation();
    $userListBox.userListNum--;
    switchUserList(true);
  })
  .on('click', '.input_num', function (e) {
    e.stopPropagation();
    inputPageNo(e, { value: $userListBox.userListNum }, (val) => {
      $userListBox.userListNum = val;
      switchUserList(true);
    });
  })
  .on('click', '.next_page', function (e) {
    e.stopPropagation();
    $userListBox.userListNum++;
    switchUserList(true);
  });
// 天气
// $.ajax({
//   type: 'get',
//   url: 'https://widget-v3.seniverse.com/api/weather/e14489a8-9a7e-477d-9c6c-b4b390175cca?unit=c&language=auto&location=WX4FBXXFKE4F&geolocation=true&detected=zh-cn',
//   dataType: 'json',
//   contentType: 'application/json;charset=UTF-8',
//   xhrFields: {
//     withCredentials: true,
//   },
//   success: (data) => {
//   },
//   error: (err) => {
//   },
// });
//桌面大小改变自适应
window.addEventListener(
  'resize',
  throttle(function () {
    let w = window.innerWidth;
    if (w === dmwidth || !_d.userInfo) return;
    const { bg, bgxs, bgObj } = _d.userInfo;
    if (dmwidth > w && w <= _d.screen) {
      //大屏变小屏幕
      //更改背景
      const bgUrl = getIn(bgObj, [bgxs, 'url']);
      if (bgUrl) {
        $pageBg.css('background-image', `url(${getFilePath(`/bg/${bgUrl}`)})`);
      } else {
        $pageBg.css('background-image', `url(${imgBgSvg})`);
      }
      if (!$miniLrcWrap.is(':hidden')) {
        $miniLrcWrap.css('display', 'none');
        $miniLrcWrap.isshow = true;
      } else {
        $miniLrcWrap.isshow = false;
      }
      if (!$miniPlayer.is(':hidden')) {
        $miniPlayer.css('display', 'none');
        $miniPlayer.isshow = true;
      } else {
        $miniPlayer.isshow = false;
      }
    } else if (!dmwidth <= w && w > _d.screen) {
      //小屏变大屏
      const bgUrl = getIn(bgObj, [bg, 'url']);
      if (bgUrl) {
        $pageBg.css('background-image', `url(${getFilePath(`/bg/${bgUrl}`)})`);
      } else {
        $pageBg.css('background-image', `url(${imgBgSvg})`);
      }
      if ($miniLrcWrap.isshow) {
        $miniLrcWrap.css('display', 'block');
      }
      if ($miniPlayer.isshow) {
        $miniPlayer.css('display', 'block');
      }
    }
    dmwidth = w;
    bgxuanran(true);
  }, 1000)
);
//同步数据
realtime.read((resData) => {
  let { type } = resData;
  //处理聊天指令
  if (type === 'chat') {
    let { flag, from, to, tt, msgData } = resData;
    let pid = deepClone(chatobj); //当前聊天框
    if (flag === 'addmsg') {
      //新消息处理
      if (from.account === _d.userInfo.account && from.account == to) {
      } else if (from.account !== _d.userInfo.account) {
        tongzhi(
          from.des || from.username,
          msgData.data,
          from.account,
          to,
          from.logo
        );
      }
      if ($chatRoomWrap.is(':hidden')) {
        //聊天框是隐藏
        if (from.account !== _d.userInfo.account) {
          $showChatRoomBtn.attr(
            'class',
            'show_chat_room_btn run iconfont icon-xiaoxi'
          );
        }
      } else {
        if (
          (pid.account === from.account && to !== 'chang') ||
          (pid.account === 'chang' && to === 'chang') ||
          (from.account === _d.userInfo.account && pid.account === to)
        ) {
          //新消息是当前聊天框
          let acc =
            to === 'chang'
              ? 'chang'
              : from.account === _d.userInfo.account && pid.account === to
              ? to
              : from.account;
          let flag = $chatListBox.find('.chat_item').last().attr('data-id');
          let val = $chatHeadBtns.find('.search_msg_inp input').val().trim();
          _getAjax('/chat/getmsg', {
            stu: 2,
            acc,
            flag,
            val,
          })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                if ($chatRoomWrap.is(':hidden')) return;
                let data = result.data;
                let str = renderMsgList(data, 1);
                const cH = $chatListBox[0].clientHeight;
                const toBottom =
                  $chatListBox[0].scrollHeight -
                    $chatListBox[0].scrollTop -
                    cH <
                  cH;
                //新增内容
                $chatListBox.find('.chat_list').append(str);
                if (toBottom) {
                  $chatListBox.stop().animate(
                    {
                      scrollTop: $chatListBox[0].scrollHeight,
                    },
                    1000
                  );
                }
                chatimgLoad();
              }
            })
            .catch((err) => {});
        } else {
          //新消息不是是当前聊天框
          if (from.account !== _d.userInfo.account) {
            if (pid.account === 'chang') {
              $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
            } else {
              if (to === 'chang') {
                $chatHeadBtns.find('.c_home_msg_alert').stop().fadeIn(_speed);
              } else {
                $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
              }
            }
          }
        }
      }
    } else if (flag === 'del') {
      //撤回消息
      if (from.account === _d.userInfo.account && from.account == to) {
      } else if (from.account !== _d.userInfo.account) {
        tongzhi(
          from.des || from.username,
          '撤回消息',
          from.account,
          to,
          from.logo
        );
      }
      if (!$chatRoomWrap.is(':hidden')) {
        if (
          (pid.account === from.account && to !== 'chang') ||
          (pid.account === 'chang' && to === 'chang') ||
          (from.account === _d.userInfo.account && pid.account === to)
        ) {
          const $chatItem = $chatListBox.find(`[data-id=${tt}]`);
          if ($chatItem.length > 0) {
            $chatItem.remove();
          }
        }
      }
    } else if (flag === 'clear') {
      //清空聊天框
      if (from.account === _d.userInfo.account && from.account == to) {
      } else if (from.account !== _d.userInfo.account) {
        tongzhi(
          from.des || from.username,
          '清空聊天记录',
          from.account,
          to,
          from.logo
        );
      }
      if (!$chatRoomWrap.is(':hidden')) {
        if (
          (pid.account === from.account && to !== 'chang') ||
          (pid.account === 'chang' && to === 'chang') ||
          (from.account === _d.userInfo.account && pid.account === to)
        ) {
          $chatListBox.find('.chat_list').html('');
        }
      }
    }
  } else if (type === 'updatedata') {
    let { flag } = resData;
    //数据同步更新
    if (flag === 'music') {
      renderMusicList();
    } else if (flag === 'bookmark') {
      renderAsideList();
      renderHomebook();
    } else if (flag === 'userinfo') {
      updateUserInfo();
    } else if (flag === 'playinglist') {
      _getAjax('/player/getplaying')
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _d.playingList = result.data;
            musicarr =
              randomplay === false
                ? myShuffle(deepClone(_d.playingList))
                : deepClone(_d.playingList);
            renderPlayingList();
            playingListHighlight();
            return;
          }
        }, true)
        .catch((err) => {});
    } else if (flag === 'musicinfo') {
      if (!$musicPlayerBox.is(':hidden')) {
        if ($myAudio[0].paused) {
          _getAjax('/player/getmusicinfo')
            .then((result) => {
              if (parseInt(result.code) === 0) {
                let _musicinfo = result.data;
                let { currentTime = 0, duration = 0, lastplay } = _musicinfo;
                if (!lastplay || (_d.remoteState && playtimer)) return;
                musicobj = musicobjInit(lastplay);
                updateMusicShowInfo();
                $myAudio[0].currentTime = currentTime;
                upprog();
                $lrcProgressBar
                  .find('.total_time')
                  .text(formartSongTime(duration));
              }
            })
            .catch((err) => {});
        }
      }
    } else if (flag === 'todolist') {
      renderTodoList();
    } else if (flag === 'bg') {
      bgxuanran();
    }
  } else if (type == 'play') {
    let { state, obj } = resData;
    _d.remoteState = false;
    $lrcHead.find('.remote_play').removeClass('red');
    if (state == 'y') {
      if (!_d.music) showMusicPlayerBox();
      if (randomplay === false) {
        musicarr = myShuffle(deepClone(_d.playingList));
      }
      musicPlay(obj);
    } else if (state == 'n') {
      initMusicLrc();
      audioPause();
    }
  } else if (type == 'vol') {
    let { value } = resData;
    curPlayVol = value;
    vobellm();
    _msg.info(`${parseInt(curPlayVol * 100)}%`);
  } else if (type == 'progress') {
    let { value } = resData;
    $myAudio[0].currentTime = musicobj.duration * value;
  } else if (type == 'playmode') {
    let { state } = resData;
    randomplay = state;
    switchPlayMode();
  }
});
~(function () {
  function getTagFont(type) {
    let font = 'iconfont ';
    if (type == 'notes') {
      font += `icon-mingcheng-jiluben`;
    } else if (type == 'note') {
      font += `icon-jilu`;
    } else if (type == 'history') {
      font += `icon-history`;
    } else if (type == 'bmk') {
      font += `icon-shuqian`;
    } else if (type == 'edit') {
      font += `icon-bianji`;
    } else if (type == 'log') {
      font += `icon-rizhi`;
    } else if (type == 'pic') {
      font += `icon-tupian`;
    } else if (type == 'trash') {
      font += `icon-huishouzhan`;
    } else if (type == 'root') {
      font += `icon-zhanghao`;
    } else if (type == 'sharebm') {
      font += `icon-fenxiang_2`;
    } else if (type == 'sharelist') {
      font += `icon-fenxiang_2`;
    } else if (type == 'sharemusic') {
      font += `icon-yinle1`;
    } else if (type == 'videoplay') {
      font += `icon-shipin1`;
    } else if (type == 'file' || type == 'sharefile') {
      font += `icon-24gl-folder`;
    } else if (type == 'notepad') {
      font += `icon-jilu`;
    }
    return font;
  }
  openIframe.hdTitle = {
    data: {},
    add(id, i) {
      this.data[id] = i;
    },
    remove(id) {
      if (this.data.hasOwnProperty(id)) {
        delete this.data[id];
      }
    },
    updateTitle(id, val) {
      if (this.data.hasOwnProperty(id)) {
        const ifram = this.data[id];
        ifram.name = val;
        ifram.updateTitle();
      }
    },
  };
  window.openIframe = openIframe;
  class CreateIframe {
    constructor(url, name) {
      this.url = url;
      this.name = name || url;
      this.id = nanoid();
      this.init();
    }
    init() {
      this.box = document.createElement('div');
      this.box.className = 'iframe_warp';
      let str = `
      <div class="i_head_btns">
          <div cursor class="i_close_btn iconfont icon-guanbi"></div>
          <div cursor class="i_to_max_btn iconfont icon-xuanzeweixuanze"></div>
          <div cursor class="i_hide_btn iconfont icon-jianhao"></div>
          <div class="i_title_text jzxz"><p class="scroll_text"></p></div>
          <div cursor title="刷新" class="i_refresh_btn iconfont icon-suijibofang"></div>
          <div cursor title="新标签打开" class="i_new_page_open_btn iconfont icon-link1"></div>
        </div>
        <div class="con">
        <div class="iframe_mask"></div>
        <div class="iframe_load"></div>
        <iframe src="${encodeHtml(
          this.url
        )}" scrolling="yes" frameborder="0"></iframe>
        </div>
        `;
      this.box.innerHTML = str;
      this.scrollText = this.box.querySelector('.scroll_text');
      this.iframe = this.box.querySelector('iframe');
      this.iframeMask = this.box.querySelector('.iframe_mask');
      this.iframeLoad = this.box.querySelector('.iframe_load');
      this.scrollT = new ContentScroll(this.scrollText);
      this.iframe.onerror = this.iframe.onload = () => {
        try {
          this.iframeLoad.style.opacity = 0;
          this.iframeWindow = this.iframe.contentWindow;
          this.iframeWindow.onmousedown = (e) => {
            this.hdDown();
          };
          this.iframeWindow.ontouchstart = (e) => {
            this.hdStart();
          };
          this.iframeWindow.iframeId = this.id;
        } catch (error) {}
      };
      $mainid.append(this.box);
      this.box.style.display = 'flex';
      this.hdZindex();
      toSetSize(this.box);
      toCenter(this.box);
      const _this = this;
      this.resizeClose = myResize({
        target: _this.box,
        down(target) {
          target.style.transition = '0s';
          _this.iframeMask.style.display = 'block';
        },
        up(target) {
          _this.iframeMask.style.display = 'none';
          target._os = {
            w: target.offsetWidth,
            h: target.offsetHeight,
          };
        },
      });
      this.dragClose = myDrag({
        trigger: _this.box.querySelector('.i_title_text'),
        target: _this.box,
        down({ target }) {
          target.style.transition = '0s';
          _this.iframeMask.style.display = 'block';
        },
        up({ target, x, y, pointerX }) {
          _this.iframeMask.style.display = 'none';
          const h = window.innerHeight;
          if (y <= 0) {
            _this.toMax();
          } else if (y >= h) {
            target._flag = false;
            toHide(target, { to: 'top', scale: 'small' }, () => {
              addHideBox(_this);
            });
          } else {
            target._op = {
              x,
              y,
            };
            _this.toRest(pointerX);
          }
        },
      });
      this.bandEvent();
      this.tagBox = addHideBox(this);
      this.updateTitle();
    }
    updateTitle() {
      this.scrollT.init(this.name);
      this.tagBox.querySelector('.title').innerText = this.name;
    }
    hdZindex() {
      setZidx(this.box, this.id, this.hdHide.bind(this));
    }
    toMax() {
      const { w, h } = getScreenSize();
      this.box.style.transition = '0.5s ease-in-out';
      this.box.style.top = 0 + 'px';
      this.box.style.left = 0 + 'px';
      this.box.style.width = w + 'px';
      this.box.style.height = h + 'px';
    }
    toRest(pointerX) {
      let { x = 0, y = 0 } = this.box._op;
      const { w = 0, h = 0 } = this.box._os;
      this.box.style.transition = '0.5s ease-in-out';
      if (pointerX) {
        // 如果是全屏
        if (isFullScreen(this.box)) {
          let percent = (pointerX - x) / this.box.offsetWidth;
          x = pointerX - w * percent;
          this.box._op.x = x;
        }
      }

      this.box.style.top = y + 'px';
      this.box.style.left = x + 'px';
      this.box.style.width = w + 'px';
      this.box.style.height = h + 'px';
    }
    bandEvent() {
      this.box.onclick = this.hdClick.bind(this);
      this.box.onmousedown = this.hdDown.bind(this);
      this.box.ontouchstart = this.hdStart.bind(this);
    }
    hdDown() {
      if (isMobile()) return;
      this.hdZindex();
    }
    hdStart() {
      if (!isMobile()) return;
      this.hdZindex();
    }
    close() {
      openIframe.hdTitle.remove(this.id);
      this.box.onclick = null;
      this.box.onmousedown = null;
      this.box.ontouchstart = null;
      this.tagBox.remove();
      this.scrollT.close();
      this.iframe.src = 'about:blank';
      this.iframe.onerror = this.iframe.onload = null;
      try {
        this.iframeWindow.onmousedown = null;
        this.iframeWindow.ontouchstart = null;
        this.iframeWindow.document.write('');
        this.iframeWindow.document.clear();
      } catch (error) {}
      this.dragClose();
      this.resizeClose();
      toHide(this.box, { to: 'bottom', scale: 'small' }, () => {
        backWindow.remove(this.id);
        this.iframe.remove();
        this.box.remove();
      });
    }
    hdClick(e) {
      if (_getTarget(this.box, e, '.i_close_btn')) {
        this.close();
      } else if (_getTarget(this.box, e, '.i_to_max_btn')) {
        if (isFullScreen(this.box)) {
          this.toRest();
        } else {
          this.toMax();
        }
      } else if (_getTarget(this.box, e, '.i_refresh_btn')) {
        this.iframeLoad.style.opacity = 1;
        try {
          this.iframeWindow.location.reload();
          return;
        } catch (error) {}
        this.iframe.src = this.url;
      } else if (_getTarget(this.box, e, '.i_new_page_open_btn')) {
        try {
          let url = this.iframeWindow.location.href;
          this.url = url;
        } catch (error) {}
        myOpen(this.url, '_blank');
      } else if (_getTarget(this.box, e, '.i_hide_btn')) {
        this.hdHide();
      }
    }
    hdHide() {
      toHide(
        this.box,
        { to: 'top', scale: 'small', useVisibility: true },
        () => {
          backWindow.remove(this.id);
          this.tagBox.classList.add('hide');
          this.scrollT.close();
        }
      );
    }
  }
  function openIframe(url, name) {
    // if (isMobile()) {
    //   myOpen(url, '_blank');
    //   return;
    // }
    const ifra = new CreateIframe(url, name);
    openIframe.hdTitle.add(ifra.id, ifra);
    return ifra;
  }
  function addHideBox(iframeBox) {
    let box = document.createElement('div');
    box.className = 'iframe_tag';
    box._iframeBox = iframeBox;
    box.setAttribute('title', iframeBox.url);
    box.setAttribute('cursor', '');

    const close = document.createElement('span');
    close.className = 'close_btn iconfont icon-guanbi';
    const title = document.createElement('span');
    title.className = 'title';
    title.innerText = iframeBox.name;
    const logo = document.createElement('span');
    const isOuterLink = iframeBox.url.startsWith('http');

    logo.className = `logo ${
      isOuterLink ? '' : getTagFont(iframeBox.url.split('/')[1])
    }`;
    if (isOuterLink) {
      logo.style.backgroundImage = `url(/api/getfavicon?u=${encodeURIComponent(
        iframeBox.url
      )})`;
    }
    box.appendChild(logo);
    box.appendChild(title);
    box.appendChild(close);
    $minimizeBox[0].appendChild(box);
    return box;
  }
  function switchIframeBox() {
    const _this = this.parentNode;
    let htarget = _this._iframeBox.box;
    const obj = backWindow.getValue().slice(-1)[0];
    if (
      htarget.style.visibility == 'hidden' ||
      (obj && obj.id != _this._iframeBox.id)
    ) {
      _this._iframeBox.hdZindex();
      htarget.style.visibility = 'visible';
      _this._iframeBox.scrollT.init(_this._iframeBox.name);
      _this._iframeBox.toRest();
      _this.classList.remove('hide');
      return;
    }
    _this._iframeBox.hdHide();
  }
  $minimizeBox
    .on('click', '.title', switchIframeBox)
    .on('click', '.logo', function (e) {
      let _this = this.parentNode;
      handleHideBox(e, _this);
    })
    .on('click', '.close_btn', function (e) {
      const _this = this.parentNode;
      _this._iframeBox.close();
    })
    .on('contextmenu', '.iframe_tag', function (e) {
      e.preventDefault();
      if (isMobile()) return;
      let _this = this;
      handleHideBox(e, _this);
    });
  longPress($minimizeBox[0], '.iframe_tag', function (e) {
    let _this = this,
      ev = e.changedTouches[0];
    handleHideBox(ev, _this);
  });
  function handleHideBox(e, _this) {
    let htarget = _this._iframeBox,
      url = htarget.url;
    let data = [
      {
        id: '1',
        text: '新标签打开',
        beforeIcon: 'iconfont icon-link1',
      },
      {
        id: '2',
        text: '隐藏所有窗口',
        beforeIcon: 'iconfont icon-jianhao',
      },
      {
        id: '3',
        text: '关闭所有窗口',
        beforeIcon: 'iconfont icon-guanbi1',
      },
    ];
    selectMenu(
      e,
      data,
      ({ close, id }) => {
        close();
        if (id == '1') {
          myOpen(url, '_blank');
        } else if (id == '2') {
          hideAllwindow();
        } else if (id == '3') {
          closeAllwindow();
        }
      },
      _this.innerText
    );
  }
})();
function closeAllwindow(all) {
  $minimizeBox[0].querySelectorAll('.iframe_tag').forEach((item) => {
    item._iframeBox.close();
  });
  if (all) {
    closeMusicPlayer();
    closeChatRoom();
    closeTodoBox();
  }
}
function hideAllwindow(all) {
  $minimizeBox[0].querySelectorAll('.iframe_tag').forEach((item) => {
    item._iframeBox.hdHide();
  });
  if (all) {
    hideMusicPlayBox();
    closeChatRoom();
    closeTodoBox();
    closeEditLrcBox();
    closeMvBox();
  }
}
const changePlayingAnimate = (function () {
  let timer = null;
  return function (e) {
    if (!e || !e.clientX) return;
    const $plb = $musicFootBox.find('.playing_list_btn');
    const x = e.clientX,
      y = e.clientY,
      { top, left } = _position($plb[0], true);
    const distance = Math.hypot(x - left, y - top);
    let duration = distance / 450;
    duration > 2 ? (duration = 2) : duration < 0.3 ? (duration = 0.3) : null;
    const oDiv = document.createElement('div');
    oDiv.className = 'iconfont icon-yinle1';
    oDiv.style.cssText = `
    color: var(--icon-color);
    font-size: 40px;
    position: fixed;
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
    z-index: 999;
    `;
    document.body.appendChild(oDiv);
    oDiv.clientHeight;
    oDiv.style.transition = `${duration}s ease-in-out`;
    oDiv.style.top = top + 'px';
    oDiv.style.left = left + 'px';
    _setTimeout(() => {
      oDiv.remove();
    }, duration * 1000);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      $plb.addClass('run');
      _setTimeout(() => {
        $plb.removeClass('run');
      }, 1000);
    }, duration * 1000);
  };
})();
