import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import '../notes/index.less';
import {
  myOpen,
  _setData,
  _getData,
  debounce,
  isurl,
  _postAjax,
  _getAjax,
  encodeHtml,
  toLogin,
  scrollState,
  throttle,
  isIframe,
  wrapInput,
  getScreenSize,
  isMobile,
  longPress,
  hdTitleHighlight,
} from '../../js/utils/utils';
import { _d, _speed } from '../../js/common/config';
import '../../js/common/common';
import _pop from '../../js/plugins/popConfirm';
import pagination from '../../js/plugins/pagination';
import _msg from '../../js/plugins/message';
import { inpMenu } from '../../js/plugins/rightMenu';
import realtime from '../../js/plugins/realtime';

const $headWrap = $('.head_wrap'),
  $html = $(document.documentElement),
  $contentWrap = $('.content_wrap'),
  $footer = $('.footer');
if (!_getData('account')) {
  toLogin();
}
realtime.read((data) => {
  const { type, flag } = data;
  if (type === 'updatedata' && flag === 'history') {
    renderList();
  }
});
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
  $html.scrollTop(0);
}
let curPageSize = _getData('historyshowpage');
$contentWrap.pagenum = 1;
const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
const _renderList = debounce(renderList, 1000);
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = wInput.getValue().trim();
  let showpage = curPageSize;
  _getAjax('/search/history', { a, page: pagenum, showpage })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo, splitWord } = result.data;
        $contentWrap.pagenum = pageNo;
        if (data.length === 0) {
          str += defaultRes;
        } else {
          data.forEach((v) => {
            let { id, data } = v;
            let edata = encodeHtml(data);
            str += `<ul class="item_box" data-id="${id}" x='${edata}'>
                          <div cursor check="n" class="check_state"></div>
                        <li class="item_type iconfont icon-history"></li>
                        <li cursor class="item_title">${hdTitleHighlight(
                          splitWord,
                          data
                        )}</li>
                        <li cursor class="del_item iconfont icon-shanchu"></li>
                        </ul>`;
          });
        }
        str += `<div class="pagingbox">`;
        str += pgnt.getHTML(
          { pageNo, pageSize: showpage, total },
          getScreenSize().w <= _d.screen
        );
        str += `</div > `;
        $contentWrap.html(str).addClass('open');
        $headWrap.addClass('open');
        $headWrap._flag = false;
        $footer.stop().slideUp(_speed);
        if (y) {
          $html.scrollTop(0);
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
    _setData('historyshowpage', curPageSize);
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
function getSearchEngine() {
  return (
    _d.searchEngineData[_getData('searchengine')] || _d.searchEngineData[0]
  );
}
// 删除历史
$contentWrap
  .on('click', '.del_item', function (e) {
    let $this = $(this);
    let a = $this.parent().attr('data-id');
    _pop(
      { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/search/del', { arr: [a] })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                renderList();
                return;
              }
              _msg.success(result.codeText);
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.item_title', function () {
    let a = $(this).parent().attr('x');
    if (isurl(a)) {
      myOpen(a, '_blank');
    } else {
      let url = getSearchEngine().searchlink.replace(/\{\{\}\}/, a);
      myOpen(url, '_blank');
    }
  })
  .on('contextmenu', '.item_box', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    if (!$footer.is(':hidden')) return;
    hdCheckItemBtn();
    checkedItem(this.querySelector('.check_state'));
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
if (isIframe()) {
  $headWrap.find('.h_go_home').remove();
}
function hdCheckItemBtn() {
  let $itemBox = $contentWrap.find('.item_box');
  if ($headWrap._flag) {
    $itemBox.find('.check_state').css('display', 'none');
    $headWrap._flag = false;
    $footer.stop().slideUp(_speed);
  } else {
    $itemBox
      .find('.check_state')
      .css('display', 'block')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._flag = true;
    $footer.stop().slideDown(_speed);
  }
  $footer.find('span').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
}
$headWrap
  .on('click', '.h_check_item_btn', hdCheckItemBtn)
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.h_add_item_btn', function (e) {
    inpMenu(
      e,
      {
        subText: '提交',
        items: {
          text: {
            type: 'textarea',
            verify(val) {
              if (val.trim() == '') {
                return '请输入需要添加的内容';
              }
            },
          },
        },
      },
      debounce(
        function ({ close, inp }) {
          const a = inp.text;
          _postAjax('/search/add', { a })
            .then((res) => {
              if (res.code == 0) {
                $contentWrap.pagenum = 1;
                renderList(true);
                close();
                _msg.success(res.codeText);
              }
            })
            .catch((err) => {});
        },
        1000,
        true
      ),
      '添加搜索历史'
    );
  })
  .on('click', '.inp_box i', function () {
    wInput.setValue('');
    wInput.target.focus();
  });

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
    _pop(
      { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/search/del', { arr })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                renderList();
                _msg.success(result.codeText);
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.f_close', function () {
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._flag = false;
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
