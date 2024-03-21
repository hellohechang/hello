import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import '../notes/index.less';
import './index.less';
import {
  _setData,
  _getData,
  debounce,
  _postAjax,
  _getAjax,
  setPageScrollTop,
  toLogin,
  scrollState,
  throttle,
  queryURLParams,
  myOpen,
  isIframe,
  wrapInput,
  getScreenSize,
  isurl,
  _myOpen,
  longPress,
  isMobile,
  hdTitleHighlight,
} from '../../js/utils/utils';
import { _d, _speed } from '../../js/common/config';
import '../../js/common/common';
import pagination from '../../js/plugins/pagination';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import { selectMenu } from '../../js/plugins/rightMenu';
import realtime from '../../js/plugins/realtime';
if (!_getData('account')) {
  toLogin();
}
realtime.read((data) => {
  const { type, flag } = data;
  if (type === 'updatedata' && flag === 'trash') {
    renderList();
  }
});
const $headWrap = $('.head_wrap'),
  $contentWrap = $('.content_wrap'),
  $footer = $('.footer');
let { HASH } = queryURLParams(myOpen());
if (!HASH) {
  HASH = 'note';
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
// 渲染列表
function pageLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<ul style="pointer-events: none;height:40px;margin-bottom:6px;background-color: var(--color9);" class="item_box"></ul>`;
  });
  $contentWrap.html(str);
  setPageScrollTop(0);
}
let curPageSize = _getData('trashshowpage');
$contentWrap.pagenum = 1;
$contentWrap.list = [];
function getListItem(id) {
  return $contentWrap.list.find((item) => item.id === id);
}
const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
const _renderList = debounce(renderList, 1000);
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = wInput.getValue().trim(),
    slogo = 'icon-shoucang';
  myOpen(`/trash/#${encodeURIComponent(HASH)}`);
  pagenum ? null : (pagenum = 1);
  let btnText = '书签列表';
  if (HASH === 'note') {
    slogo = 'icon-jilu';
    btnText = '笔记';
  } else if (HASH === 'history') {
    slogo = 'icon-history';
    btnText = '历史记录';
  } else if (HASH === 'bookmk') {
    slogo = 'icon-shuqian';
    btnText = '书签';
  }
  $headWrap.find('.select_btn').text(btnText);
  let showpage = curPageSize;
  _getAjax('/user/gettrash', { a, page: pagenum, showpage, type: HASH })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo, splitWord } = result.data;
        $contentWrap.list = data;
        $contentWrap.pagenum = pageNo;
        if (data.length === 0) {
          str += defaultRes;
        } else {
          data.forEach((v) => {
            let { name, id, link, data, des } = v;
            des = des ? des : '';
            name ? null : (name = data);
            link ? (name = `${name} (${link})${des ? ` - ${des}` : ''}`) : null;
            str += `<ul class="item_box" data-id="${id}" data-type="${HASH}">
                  <div cursor check="n" class="check_state"></div>
                  <li class="item_type iconfont ${slogo}"></li>
                  <li ${
                    HASH !== 'booklist' ? 'cursor' : ''
                  } class="item_title">${hdTitleHighlight(splitWord, name)}</li>
                  <li cursor class="set_btn iconfont icon-icon"></li>
                </ul>`;
          });
        }
        str += `<div class="pagingbox">`;
        str += pgnt.getHTML(
          {
            pageNo,
            pageSize: showpage,
            total,
          },
          getScreenSize().w <= _d.screen
        );
        str += `</div > `;
        $contentWrap.html(str).addClass('open');
        $headWrap.addClass('open');
        $headWrap._checkState = false;
        $footer.stop().slideUp(_speed);
        if (y) {
          setPageScrollTop(0);
        }
      }
    })
    .catch((err) => {});
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
    _setData('trashshowpage', curPageSize);
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
if (isIframe()) {
  $headWrap.find('.h_go_home').remove();
}
$headWrap
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.h_check_item_btn', hdCheckItemBtn)
  .on('click', '.select_btn', function (e) {
    let data = [
      { text: '笔记', param: { value: 'note' } },
      { text: '书签列表', param: { value: 'booklist' } },
      { text: '书签', param: { value: 'bookmk' } },
      { text: '历史记录', param: { value: 'history' } },
    ];
    data.forEach((item, idx) => {
      item.id = idx + 1;
      if (item.param.value == HASH) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    selectMenu(
      e,
      data,
      ({ close, id, param }) => {
        if (id) {
          close();
          HASH = param.value;
          $contentWrap.pagenum = 1;
          renderList(true);
        }
      },
      '选择列表类型'
    );
  })
  .on('click', '.inp_box i', function () {
    wInput.setValue('');
    wInput.target.focus();
  });
function hdRecover(e, arr, t, cb) {
  _pop({ e, text: `确认恢复？` }, (type) => {
    if (type == 'confirm') {
      _postAjax('/user/recovertrash', {
        arr,
        type: t,
      })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            _msg.success(result.codeText);
            renderList();
            cb && cb();
            return;
          }
        })
        .catch((err) => {});
    }
  });
}
function hdDel(e, arr, t, cb) {
  _pop(
    { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/user/deletetrash', {
          arr,
          type: t,
        })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              _msg.success(result.codeText);
              renderList();
              cb && cb();
              return;
            }
          })
          .catch((err) => {});
      }
    }
  );
}
function getSearchEngine() {
  return (
    _d.searchEngineData[_getData('searchengine')] || _d.searchEngineData[0]
  );
}
$contentWrap
  .on('click', '.set_btn', function (e) {
    const $this = $(this);
    const id = $this.parent().attr('data-id');
    const obj = getListItem(id);
    const t = $this.parent().attr('data-type');
    let data = [];
    if (t == 'note') {
      data.push({
        id: '1',
        text: '编辑笔记',
        beforeIcon: 'iconfont icon-bianji',
      });
    }
    data = [
      ...data,
      { id: '2', text: '恢复', beforeIcon: 'iconfont icon-chexiao' },
      {
        id: '3',
        text: '删除',
        beforeIcon: 'iconfont icon-shanchu',
      },
    ];
    selectMenu(
      e,
      data,
      ({ e, close, id: flag }) => {
        if (flag == '2') {
          hdRecover(e, [id], t, () => {
            close();
          });
        } else if (flag == '3') {
          hdDel(e, [id], t, () => {
            close();
          });
        } else if (flag == '1') {
          close();
          e.stopPropagation();
          _myOpen(`/edit/#${encodeURIComponent(id)}`, obj.name);
        }
      },
      obj.name || obj.data
    );
  })
  .on('contextmenu', '.item_box', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    if (!$footer.is(':hidden')) return;
    hdCheckItemBtn();
    checkedItem(this.querySelector('.check_state'));
  })
  .on('click', '.item_title', function (e) {
    const $this = $(this);
    const type = $this.parent().attr('data-type');
    const obj = getListItem($this.parent().attr('data-id'));
    if (type === 'bookmk') {
      myOpen(obj.link, '_blank');
    } else if (type === 'history') {
      if (isurl(obj.data)) {
        myOpen(obj.data, '_blank');
      } else {
        let url = getSearchEngine().searchlink.replace(/\{\{\}\}/, obj.data);
        myOpen(url, '_blank');
      }
    } else if (type === 'note') {
      e.stopPropagation();
      _myOpen(`/note/?v=${encodeURIComponent(obj.id)}`, obj.name);
    }
  })
  .on('click', '.check_state', function (e) {
    checkedItem(this);
  });
longPress($contentWrap[0], '.item_box', function () {
  if (!$footer.is(':hidden')) return;
  hdCheckItemBtn();
  checkedItem(this.querySelector('.check_state'));
});
function checkedItem(el) {
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
  if ($checkArr.length > 0) {
    $footer.stop().slideDown(_speed);
  } else {
    $footer.stop().slideUp(_speed);
  }
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
  let $itemBox = $contentWrap.find('.item_box');
  if ($headWrap._checkState) {
    $itemBox.find('.check_state').css('display', 'none');
    $headWrap._checkState = false;
    $footer.stop().slideUp(_speed);
  } else {
    $itemBox
      .find('.check_state')
      .css('display', 'block')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._checkState = true;
    $footer.stop().slideDown(_speed);
  }
  $footer.find('span').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
}
$footer
  .on('click', '.f_delete', function (e) {
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
    let t = $itemBox.attr('data-type');
    hdDel(e, arr, t);
  })
  .on('click', '.f_recover', function (e) {
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
    let t = $itemBox.attr('data-type');
    hdRecover(e, arr, t);
  })
  .on('click', '.f_close', function () {
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $footer.stop().slideUp(_speed);
  })
  .on('click', 'span', function () {
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
