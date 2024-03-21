import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import {
  _setData,
  _getData,
  throttle,
  debounce,
  _postAjax,
  _getAjax,
  encodeHtml,
  _myOpen,
  setPageScrollTop,
  myOpen,
  toLogin,
  scrollState,
  showQcode,
  getPreUrl,
  queryURLParams,
  isIframe,
  wrapInput,
  getScreenSize,
  longPress,
  isMobile,
  hdTitleHighlight,
} from '../../js/utils/utils';
import { _d, _speed } from '../../js/common/config';
import '../../js/common/common';
import pagination from '../../js/plugins/pagination';
import { selectMenu } from '../../js/plugins/rightMenu';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import realtime from '../../js/plugins/realtime';
const $headWrap = $('.head_wrap'),
  $contentWrap = $('.content_wrap'),
  $footer = $('.footer');
let runState = 'own';
const urlParams = queryURLParams(myOpen());
let { HASH } = urlParams;
if (!HASH) {
  HASH = 'n';
}
if (urlParams.acc) {
  runState = 'other';
  $headWrap.find('.h_add_item_btn').remove();
  $headWrap.find('.h_check_item_btn').remove();
  $headWrap.find('.h_show_lock').remove();
} else {
  if (!_getData('account')) {
    toLogin();
  }
  realtime.read((data) => {
    const { type, flag } = data;
    if (type === 'updatedata' && flag === 'note') {
      renderList();
    }
  });
}
const wInput = wrapInput($headWrap.find('.inp_box input')[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $headWrap.find('.inp_box i').css('display', 'none');
    } else {
      $headWrap.find('.inp_box i').css('display', 'block');
    }
    $contentWrap.pagenum = 1;
    _renderList(true);
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    $(target).parent().removeClass('focus');
  },
});
function pageLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<ul style="pointer-events: none;height:40px;margin-bottom:6px;background-color: var(--color9);" class="item_box"></ul>`;
  });
  $contentWrap.html(str);
  setPageScrollTop(0);
}
// 渲染列表
$contentWrap.pagenum = 1;
let curPageSize = _getData('nodeshowpage');
const _renderList = debounce(renderList, 1000);
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = wInput.getValue().trim();
  let showpage = curPageSize;
  const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
  if (runState == 'own') {
    _getAjax('/note/searchlist', { a, page: pagenum, showpage, showLock: HASH })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, pageNo, splitWord } = result.data;
          $contentWrap.pagenum = pageNo;
          if (data.length === 0) {
            str += defaultRes;
          } else {
            data.forEach((v) => {
              let { name, share, id, con } = v;
              let ename = encodeHtml(name);
              str += `<ul class="item_box" data-id="${id}" data-share="${share}" x='${ename}'>
                    <div cursor check="n" class="check_state"></div>
                    <li class="item_type iconfont icon-jilu"></li>
                    <li cursor class="item_title">${hdTitleHighlight(
                      splitWord,
                      name
                    )}</li>
                    <li cursor class="lock_state iconfont ${
                      share === 'n'
                        ? 'icon-24gl-unlock2 open'
                        : 'icon-24gl-unlock4'
                    }"></li>
                    <li cursor class="set_btn iconfont icon-icon"></li>
                    </ul>`;
              if (con && con.length > 0) {
                str += `<p>${hdHighlight(con)}</p>`;
              }
            });
          }
          $headWrap._checkState = false;
          $footer.stop().slideUp(_speed);
          hdPagination(str, totalPage, pageNo, showpage, total, y);
        }
      })
      .catch((err) => {});
  } else if (runState == 'other') {
    _getAjax('/note/allsearchlist', {
      acc: urlParams.acc || '',
      a,
      page: pagenum,
      showpage,
    })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, pageNo, splitWord } = result.data;
          $contentWrap.pagenum = pageNo;
          if (data.length === 0) {
            str += defaultRes;
          } else {
            data.forEach((v) => {
              let { name, id, con } = v;
              let ename = encodeHtml(name);
              str += `<ul class="item_box" data-id="${id}" x='${ename}'>
                  <li class="item_type iconfont icon-jilu"></li>
                  <li cursor class="item_title">${hdTitleHighlight(
                    splitWord,
                    name
                  )}</li>
                  </ul>`;
              if (con && con.length > 0) {
                str += `<p>${hdHighlight(con)}</p>`;
              }
            });
          }
          hdPagination(str, totalPage, pageNo, showpage, total, y);
        }
      })
      .catch((err) => {});
  }
}
function hdHighlight(con) {
  let s = '';
  con.forEach((item) => {
    const { type, value } = item;
    if (type == 'text') {
      s += encodeHtml(value);
    } else if (type == 'icon') {
      s += `<br/><span style="color:var(--btn-danger-color);">···</span><br/>`;
    } else if (type == 'word') {
      s += `<span style="color:var(--btn-danger-color);">${encodeHtml(
        value
      )}</span>`;
    }
  });
  return s;
}
const pgnt = pagination($contentWrap[0], {
  pageSize: curPageSize,
  change(val) {
    $contentWrap.pagenum = val;
    renderList(true);
    _msg.botMsg(`第 ${$contentWrap.pagenum} 页`);
  },
  sizeChange(val) {
    curPageSize = val;
    _setData('nodeshowpage', curPageSize);
    $contentWrap.pagenum = 1;
    renderList(true);
    _msg.botMsg(`第 ${$contentWrap.pagenum} 页`);
  },
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
});
renderList(true);
function hdPagination(str, totalPage, pageNo, showpage, total, y) {
  str += `<div class="pagingbox">`;
  str += pgnt.getHTML(
    {
      pageSize: showpage,
      pageNo,
      total,
    },
    getScreenSize().w <= _d.screen
  );
  str += `</div > `;
  $contentWrap.html(str).addClass('open');
  $headWrap.addClass('open');
  if (y) {
    setPageScrollTop(0);
  }
}
// 删除笔记
$contentWrap
  .on('click', '.set_btn', function (e) {
    if (runState !== 'own') return;
    const $this = $(this);
    let noteid = $this.parent().attr('data-id'),
      name = $this.parent().attr('x');
    let data = [
      { id: '1', text: '二维码', beforeIcon: 'iconfont icon-erweima' },
      { id: '2', text: '编辑笔记', beforeIcon: 'iconfont icon-bianji' },
      {
        id: '3',
        text: '删除',
        beforeIcon: 'iconfont icon-shanchu',
      },
    ];
    selectMenu(
      e,
      data,
      ({ close, e, id }) => {
        if (id == '1') {
          showQcode(
            e,
            `${getPreUrl()}/note/?v=${encodeURIComponent(noteid)}`,
            name
          );
        } else if (id == '2') {
          close();
          e.stopPropagation();
          _myOpen(`/edit/#${encodeURIComponent(noteid)}`, name);
        } else if (id == '3') {
          _pop(
            {
              e,
              text: `确认删除：${name}？`,
              confirm: { type: 'danger', text: '删除' },
            },
            (type) => {
              if (type == 'confirm') {
                _postAjax('/note/delnote', { arr: [noteid] })
                  .then((result) => {
                    if (parseInt(result.code) === 0) {
                      close();
                      _msg.success(result.codeText);
                      renderList();
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
  })
  .on('click', '.item_title', function (e) {
    e.stopPropagation();
    let a = $(this).parent().attr('data-id'),
      name = $(this).parent().attr('x'),
      val = wInput.getValue().trim();
    val = val.split(' ')[0];
    val = encodeURIComponent(val);
    _myOpen(
      `/note/?v=${encodeURIComponent(a)}${
        val ? '#' + encodeURIComponent(val) : ''
      }`,
      name
    );
  })
  .on('contextmenu', '.item_box', function (e) {
    if (runState !== 'own') return;
    e.preventDefault();
    if (isMobile()) return;
    if (!$footer.is(':hidden')) return;
    hdCheckItemBtn();
    checkedItem(this.querySelector('.check_state'));
  })
  .on(
    'click',
    '.lock_state',
    throttle(function () {
      if (runState !== 'own') return;
      let $this = $(this),
        id = $this.parent().attr('data-id'),
        noteflag = $this.parent().attr('data-share');
      noteflag = noteflag === 'n' ? 'y' : 'n';
      _postAjax('/note/locking', { arr: [id], noteflag })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _msg.success(result.codeText);
            renderList();
          }
        })
        .catch((err) => {});
    }, 2000)
  )
  .on('click', '.check_state', function (e) {
    checkedItem(this);
  });
if (isIframe()) {
  $headWrap.find('.h_go_home').remove();
}
longPress($contentWrap[0], '.item_box', function () {
  if (!$footer.is(':hidden')) return;
  hdCheckItemBtn();
  checkedItem(this.querySelector('.check_state'));
});
function checkedItem(el) {
  if (runState !== 'own') return;
  let $this = $(el),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $itemBox = $contentWrap.find('.item_box'),
    $checkArr = $itemBox.filter(
      (_, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $itemBox.length) {
    $footer.find('span').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $footer.find('span').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}
function hdCheckItemBtn() {
  if (runState !== 'own') return;
  let $itemBox = $contentWrap.find('.item_box');
  if ($headWrap._checkState) {
    $itemBox
      .find('.check_state')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._checkState = false;
    $footer.stop().slideUp(_speed);
  } else {
    $itemBox.find('.check_state').css('display', 'block');
    $headWrap._checkState = true;
    $footer.stop().slideDown(_speed);
  }
  $footer.find('span').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
}
// 添加笔记
$headWrap
  .on('click', '.h_show_lock', function (e) {
    if (runState !== 'own') return;
    HASH = HASH == 'y' ? 'n' : 'y';
    myOpen(`/notes/#${HASH}`);
    $contentWrap.pagenum = 1;
    renderList(true);
  })
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.h_add_item_btn', function (e) {
    if (runState !== 'own') return;
    e.stopPropagation();
    _myOpen('/edit/#new', '新笔记');
  })
  .on('click', '.h_check_item_btn', hdCheckItemBtn)
  .on('click', '.inp_box i', function () {
    wInput.setValue('');
    wInput.target.focus();
  });

$footer
  .on('click', '.f_delete', function (e) {
    if (runState !== 'own') return;
    let $itemBox = $contentWrap.find('.item_box'),
      $checkArr = $itemBox.filter(
        (_, item) => $(item).find('.check_state').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.attr('data-id'));
    });
    _pop(
      { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/note/delnote', { arr })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                renderList();
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.f_clock', function () {
    if (runState !== 'own') return;
    let $itemBox = $contentWrap.find('.item_box'),
      $checkArr = $itemBox.filter(
        (_, item) => $(item).find('.check_state').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.attr('data-id'));
    });
    _postAjax('/note/locking', {
      arr,
      noteflag: 'n',
    })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          _msg.success(result.codeText);
          renderList();
          return;
        }
      })
      .catch((err) => {});
  })
  .on('click', '.f_open', function () {
    if (runState !== 'own') return;
    let $itemBox = $contentWrap.find('.item_box'),
      $checkArr = $itemBox.filter(
        (_, item) => $(item).find('.check_state').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.attr('data-id'));
    });
    _postAjax('/note/locking', {
      arr,
      noteflag: 'y',
    })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          _msg.success(result.codeText);
          renderList();
          return;
        }
      })
      .catch((err) => {});
  })
  .on('click', '.f_close', function () {
    if (runState !== 'own') return;
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._checkState = false;
    $footer.stop().slideUp(_speed);
  })
  .on('click', 'span', function () {
    if (runState !== 'own') return;
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $footer.find('span').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .attr('check', che)
      .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
    _msg.botMsg(`选中：${che === 'y' ? $itemBox.length : 0}项`);
  });
scrollState(
  window,
  throttle(function ({ type }) {
    if (type == 'up') {
      $headWrap.removeClass('open');
    } else {
      $headWrap.addClass('open');
    }
  }, 1000)
);
