import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import {
  _postAjax,
  _getAjax,
  getPreUrl,
  toLogin,
  _getData,
  showQcode,
  isIframe,
  myOpen,
  getScreenSize,
  encodeHtml,
  formatDate,
  createShare,
  getValidState,
  copyText,
} from '../../js/utils/utils';
import '../../js/common/common';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import pagination from '../../js/plugins/pagination';
import { _d } from '../../js/common/config';
import realtime from '../../js/plugins/realtime';
if (!_getData('account')) {
  toLogin();
}
realtime.read((data) => {
  const { type, flag } = data;
  if (type === 'updatedata' && flag === 'sharelist') {
    renderList();
  }
});
const $contentWrap = $('.content_wrap'),
  $headBtns = $contentWrap.find('.head_btns'),
  $shareList = $contentWrap.find('.share_list');
let pageNo = 1;
let sList = [];
let sPageSize = 10;
function switchList(top) {
  let str = '';
  const totalPage = Math.ceil(sList.length / sPageSize);
  pageNo < 1 ? (pageNo = 1) : pageNo > totalPage ? (pageNo = totalPage) : null;
  sList.slice((pageNo - 1) * sPageSize, pageNo * sPageSize).forEach((item) => {
    let { id, type, title, pass, valid } = item,
      logo = 'icon-shoucang',
      url = getPreUrl();
    if (type == 'music') {
      logo = `icon-yinle1`;
      url += `/sharemusic/#${id}`;
    } else if (type == 'bookmk') {
      logo = `icon-shuqian`;
      url += `/sharebm/#${id}`;
    } else if (type == 'file') {
      logo = `icon-24gl-fileText`;
      url += `/sharefile/#${id}`;
    } else if (type == 'dir') {
      logo = `icon-24gl-folder`;
      url += `/sharefile/#${id}`;
    }
    let v = '永久';
    const state = getValidState(valid);
    if (state > 0) {
      v = formatDate({ template: '{0}-{1}-{2} {3}:{4}', timestamp: valid });
    } else if (state < 0) {
      v = '已过期';
    }
    str += `<li data-id="${id}" data-url="${encodeHtml(url)}">
            <div class="item_type_logo iconfont ${logo}"></div>
            <div title="点击复制分享链接" class="title">名称：<span>${encodeHtml(
              title
            )}</span> ； 提取码：<span>${
      encodeHtml(pass) || '无'
    }</span> ； 有效期：<span style="${
      state < 0 ? `color:red;` : ''
    }">${v}</span> ； </div>
            <div cursor class="copy_link iconfont icon-erweima"></div>
            <div cursor class="edit iconfont icon-bianji"></div>
            <div cursor class="delete iconfont icon-guanbi"></div>
          </li>
          `;
  });
  str += '<div class="pagination" style="padding: 20px 0">';
  str += pgnt.getHTML(
    {
      pageNo,
      pageSize: sPageSize,
      total: sList.length,
    },
    getScreenSize().w <= _d.screen
  );
  str += '</div>';
  $shareList.html(str);
  if (top) {
    $shareList.scrollTop(0);
  }
}
const pgnt = pagination($shareList[0], {
  select: [10, 20, 30, 50, 100],
  change(val) {
    pageNo = val;
    switchList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
  },
  sizeChange(val) {
    sPageSize = val;
    pageNo = 1;
    switchList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
  },
  top() {
    $shareList.stop().animate({
      scrollTop: 0,
    });
  },
});
function renderList(top) {
  _getAjax('/user/sharelist')
    .then((res) => {
      if (res.code == 0) {
        sList = res.data.reverse();
        if (sList.length === 0) {
          $shareList.html(`<p>${_d.emptyList}</p>`);
          return;
        }
        switchList(top);
      }
    })
    .catch((err) => {});
}
function getShareItem(id) {
  return sList.find((item) => item.id == id);
}
renderList(1);
$shareList
  .on('click', '.delete', function (e) {
    let id = $(this).parent().attr('data-id');
    const obj = getShareItem(id);
    _pop(
      {
        e,
        text: `确认删除：${obj.title}？`,
        confirm: { type: 'danger', text: '删除' },
      },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/user/deleteshare', { id })
            .then((res) => {
              if (res.code == 0) {
                _msg.success(res.codeText);
                renderList();
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.edit', function (e) {
    let id = $(this).parent().attr('data-id');
    const obj = getShareItem(id);
    createShare(
      e,
      {
        title: '编辑分享项',
        name: obj.title,
        valid: getValidState(obj.valid),
        pass: obj.pass,
      },
      ({ close, inp }) => {
        const { title, pass, valid } = inp;
        _postAjax('/user/editshare', { id: obj.id, title, pass, valid })
          .then((result) => {
            if (parseInt(result.code) === 0) {
              close(1);
              renderList();
            }
          })
          .catch((err) => {});
      }
    );
  })
  .on('click', '.copy_link', function (e) {
    const $this = $(this);
    let url = $this.parent().attr('data-url');
    let id = $this.parent().attr('data-id');
    const obj = getShareItem(id);
    showQcode(e, url, obj.title).catch((err) => {});
  })
  .on('click', '.title', function () {
    const $this = $(this);
    let url = $this.parent().attr('data-url');
    let id = $this.parent().attr('data-id');
    const obj = getShareItem(id);
    let str = `分享名称：${obj.title}\n分享链接：${url}\n访问密码：${
      obj.pass || '无'
    }`;
    copyText(str);
  });
if (isIframe()) {
  $headBtns.find('.h_go_home').remove();
}
$headBtns
  .on('click', '.clear_share_list_btn', function (e) {
    _pop(
      { e, text: `确认清空？`, confirm: { type: 'danger', text: '清空' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/user/deleteshare')
            .then((res) => {
              if (res.code == 0) {
                _msg.success(res.codeText);
                renderList();
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  });
