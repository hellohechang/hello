import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import '../notes/index.less';
import {
  _setData,
  _getData,
  throttle,
  debounce,
  _postAjax,
  _getAjax,
  setPageScrollTop,
  myOpen,
  toLogin,
  scrollState,
  queryURLParams,
  isurl,
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
import { inpMenu, selectMenu } from '../../js/plugins/rightMenu';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import realtime from '../../js/plugins/realtime';
const $headWrap = $('.head_wrap'),
  $contentWrap = $('.content_wrap'),
  $footer = $('.footer');
let runState = 'own';
const urlParams = queryURLParams(myOpen());
let { HASH } = urlParams;
if (HASH) {
  runState = 'other';
  $footer.find('.f_move_to').text('添加到');
  $footer.find('.f_delete').remove();
} else {
  if (!_getData('account')) {
    toLogin();
  }
  realtime.read((data) => {
    const { type, flag } = data;
    if (type === 'updatedata' && flag === 'bookmark') {
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
let curPageSize = _getData('bmshowpage');
const _renderList = debounce(renderList, 1000);
$contentWrap.list = [];
function getItemObj(id) {
  return $contentWrap.list.find((item) => item.id == id);
}
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = wInput.getValue().trim();
  let showpage = curPageSize;
  const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
  if (runState == 'own') {
    _getAjax('/bmk/searchbm', { a, page: pagenum, showpage })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, splitWord, pageNo } = result.data;
          $contentWrap.list = data;
          $contentWrap.pagenum = pageNo;
          if (data.length === 0) {
            str += defaultRes;
          } else {
            data.forEach((v) => {
              let { id, link, des, name } = v;
              str += `<ul class="item_box" data-id="${id}">
                    <div cursor check="n" class="check_state"></div>
                    <li class="item_type iconfont icon-shuqian"></li>
                    <li cursor class="item_title">${hdTitleHighlight(
                      splitWord,
                      `${name} (${link})${des ? ` - ${des}` : ''}`
                    )}</li>
                    <li cursor class="set_btn iconfont icon-icon"></li>
                    </ul>`;
            });
          }
          hdPagination(str, totalPage, pageNo, showpage, total, y);
        }
      })
      .catch((err) => {});
  } else if (runState == 'other') {
    _getAjax('/bmk/searchbm', { a, page: pagenum, showpage, acc: HASH })
      .then((result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, splitWord, pageNo } = result.data;
          $contentWrap.list = data;
          $contentWrap.pagenum = pageNo;
          if (data.length === 0) {
            str += defaultRes;
          } else {
            data.forEach((v) => {
              let { id, link, des, name } = v;
              str += `<ul class="item_box" data-id="${id}">
                    <div cursor check="n" class="check_state"></div>
                    <li class="item_type iconfont icon-shuqian"></li>
                    <li cursor class="item_title">${hdTitleHighlight(
                      splitWord,
                      `${name} (${link})${des ? ` - ${des}` : ''}`
                    )}</li>
                    <li class="set_btn iconfont icon-icon"></li>
                    </ul>`;
            });
          }
          hdPagination(str, totalPage, pageNo, showpage, total, y);
        }
      })
      .catch((err) => {});
  }
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
    _setData('bmshowpage', curPageSize);
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
    { pageNo, pageSize: showpage, total },
    getScreenSize().w <= _d.screen
  );
  str += `</div > `;
  $headWrap._checkState = false;
  $footer.stop().slideUp(_speed);
  $contentWrap.html(str).addClass('open');
  $headWrap.addClass('open');
  if (y) {
    setPageScrollTop(0);
  }
}
function movebmk(e, arr) {
  _getAjax('/bmk/getbooklist').then((res) => {
    if (res.code == 0) {
      let data = [
        {
          id: 'home',
          text: '主页',
          beforeIcon: 'iconfont icon-shoucang',
          param: { name: '主页' },
        },
      ];
      res.data.sort((a, b) => a.num - b.num);
      res.data.forEach((item) => {
        data.push({
          id: item.id,
          text: item.name,
          beforeIcon: 'iconfont icon-shoucang',
          param: { name: item.name },
        });
      });
      selectMenu(
        e,
        data,
        ({ e, close, id, param }) => {
          if (id) {
            let toid = id,
              listname = param.name;
            _pop(
              {
                e,
                text: `确认${
                  runState === 'own' ? '移动' : '添加'
                }到 ${listname}？`,
              },
              (type) => {
                if (type == 'confirm') {
                  if (runState == 'own') {
                    _postAjax('/bmk/bmktolist', {
                      arr: arr.map((item) => item.id),
                      toid,
                    })
                      .then((result) => {
                        if (parseInt(result.code) === 0) {
                          close(true);
                          _msg.success(result.codeText);
                          renderList();
                        }
                      })
                      .catch((err) => {});
                  } else if (runState == 'other') {
                    _postAjax('/bmk/addbmk', {
                      arr: arr.map((item) => ({
                        name: item.name,
                        link: item.link,
                        des: item.des,
                      })),
                      id: toid,
                    })
                      .then((result) => {
                        if (parseInt(result.code) === 0) {
                          close(true);
                          _msg.success(result.codeText);
                          renderList();
                        }
                      })
                      .catch((err) => {});
                  }
                }
              }
            );
          }
        },
        `${runState === 'own' ? '移动' : '添加'}书签到分组`
      );
    }
  });
}
$contentWrap
  .on('click', '.set_btn', function (e) {
    const $this = $(this);
    let id = $this.parent().attr('data-id'),
      obj = getItemObj(id);
    let data = [];
    if (runState === 'own') {
      data.push({
        id: '1',
        text: '编辑书签',
        beforeIcon: 'iconfont icon-bianji',
      });
    }
    data.push({
      id: '2',
      text: runState === 'own' ? '移动到' : '添加到',
      beforeIcon: `iconfont ${
        runState == 'own' ? 'icon-moveto' : 'icon-icon-test'
      }`,
    });
    data.push({
      id: '3',
      text: '删除',
      beforeIcon: `iconfont icon-shanchu`,
    });
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          if (runState !== 'own') return;
          inpMenu(
            e,
            {
              subText: '提交',
              items: {
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
                  placeholder: '描述',
                  type: 'textarea',
                  value: obj.des,
                },
              },
            },
            debounce(
              function ({ close, inp }) {
                let an = inp.title,
                  al = inp.link,
                  des = inp.des;
                if (an === obj.name && al === obj.link && des === obj.des)
                  return;
                let requestObj = {
                  pid: obj.listid,
                  cid: obj.id,
                  des,
                  name: an,
                  link: al,
                };
                _postAjax('/bmk/editbmk', requestObj)
                  .then((result) => {
                    if (parseInt(result.code) === 0) {
                      close(true);
                      _msg.success(result.codeText);
                      renderList();
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
        } else if (id == '2') {
          movebmk(e, [obj]);
        } else if (id == '3') {
          if (runState !== 'own') return;
          _pop(
            {
              e,
              text: `确认删除：${obj.name}？`,
              confirm: { type: 'danger', text: '删除' },
            },
            (type) => {
              if (type == 'confirm') {
                _postAjax('/bmk/delbmk', { arr: [obj.id] })
                  .then((result) => {
                    if (parseInt(result.code) === 0) {
                      _msg.success(result.codeText);
                      close();
                      renderList();
                      return;
                    }
                  })
                  .catch((err) => {});
              }
            }
          );
        }
      },
      obj.name
    );
  })
  .on('click', '.item_title', function () {
    const $this = $(this);
    let id = $this.parent().attr('data-id'),
      obj = getItemObj(id);
    myOpen(obj.link, '_blank');
  })
  .on('contextmenu', '.item_box', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    if (!$footer.is(':hidden')) return;
    checkedItemBtn();
    checkItem(this.querySelector('.check_state'));
  })
  .on('click', '.check_state', function (e) {
    checkItem(this);
  });
longPress($contentWrap[0], '.item_box', function () {
  if (!$footer.is(':hidden')) return;
  checkedItemBtn();
  checkItem(this.querySelector('.check_state'));
});
function checkItem(el) {
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
function checkedItemBtn() {
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
$headWrap
  .on('click', '.h_check_item_btn', checkedItemBtn)
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.inp_box i', function () {
    wInput.setValue('');
    wInput.target.focus();
  });
function getSelectItem() {
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
  $contentWrap.list;
  arr = arr.map((item) => {
    return getItemObj(item);
  });
  return arr;
}
$footer
  .on('click', '.f_delete', function (e) {
    if (runState !== 'own') return;
    let arr = getSelectItem();
    _pop(
      { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/bmk/delbmk', { arr: arr.map((item) => item.id) })
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
  .on('click', '.f_move_to', function (e) {
    const arr = getSelectItem();
    movebmk(e, arr);
  })
  .on('click', '.f_close', function () {
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
