import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import {
  myOpen,
  _postAjax,
  _getAjax,
  formatDate,
  encodeHtml,
  pageErr,
  debounce,
  _getData,
  setPageScrollTop,
  isIframe,
  getScreenSize,
  isInteger,
} from '../../js/utils/utils';
import '../../js/common/common';
import { inpMenu, selectMenu } from '../../js/plugins/rightMenu';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import pagination from '../../js/plugins/pagination';
import { _d } from '../../js/common/config';
const $contentWrap = $('.content_wrap'),
  $paginationBox = $('.pagination_box'),
  $headBtns = $contentWrap.find('.head_btns'),
  $tableBox = $contentWrap.find('.table_box'),
  $list = $tableBox.find('tbody');
let dataObj = {};
if (_getData('account') === 'root') {
  renderList(1);
} else {
  myOpen('/');
}
let pageNo = 1;
let userList = [];
let uPageSize = 10;
function switchUserList(top) {
  userList.sort((a, b) => b.time - a.time);
  let str = '';
  const totalPage = Math.ceil(userList.length / uPageSize);
  pageNo < 1 ? (pageNo = 1) : pageNo > totalPage ? (pageNo = totalPage) : null;
  userList.slice((pageNo - 1) * uPageSize, pageNo * uPageSize).forEach((v) => {
    let { account, username, time, state, online } = v;
    username = encodeHtml(username);
    str += `<tr data-acc="${account}" data-state="${state}" data-name="${username}">
    <td>${formatDate({
      template: '{0}-{1}-{2} {3}:{4}',
      timestamp: time,
    })}</td>
    <td style="color:${online === 'y' ? 'green' : 'var(--color4)'};">${
      online === 'y' ? '在线' : '离线'
    }</td>
    <td>${username}</td>
    <td>${account}</td>
    <td style="${state == 0 ? '' : 'color:var(--btn-danger-color);'}">${
      state == 0 ? '启用' : '停用'
    }</td>
    <td>
      <button cursor class="user_state btn btn_primary">${
        state == 0 ? '停用' : '启用'
      }</button>
        <button cursor class="reset_pd btn btn_primary">重置密码</button>
        <button cursor class="del_account btn btn_danger">删除</button>
        </td>
        </tr>`;
  });
  pgnt.render(
    {
      pageNo,
      pageSize: uPageSize,
      total: userList.length,
    },
    getScreenSize().w <= _d.screen
  );
  $list.html(str);
  if (top) {
    setPageScrollTop(0);
  }
}
const pgnt = pagination($paginationBox[0], {
  select: [10, 20, 40, 60, 100],
  change(val) {
    pageNo = val;
    switchUserList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
  },
  sizeChange(val) {
    uPageSize = val;
    pageNo = 1;
    switchUserList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
  },
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
});
function renderList(top) {
  _getAjax('/root/userlist', {})
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let { registerstate, trash, uploadSaveDay, list } = (dataObj =
          result.data);
        userList = list;
        $headBtns
          .find('.register_state span')
          .attr(
            'class',
            `iconfont iconfont ${
              registerstate === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'
            }`
          );
        $headBtns
          .find('.trash_state span')
          .attr(
            'class',
            `iconfont iconfont ${
              trash === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'
            }`
          );
        $headBtns
          .find('.upload_save_day')
          .text(
            `${
              uploadSaveDay <= 0
                ? '聊天室文件保存时间: 无限制'
                : `聊天室文件保存时间: ${uploadSaveDay}天`
            }`
          );
        switchUserList(top);
        return;
      }
      pageErr();
    })
    .catch((err) => {});
}

$list
  .on('click', '.user_state', function (e) {
    let $this = $(this),
      x = $this.parent().parent().attr('data-acc'),
      state = $this.parent().parent().attr('data-state'),
      name = $this.parent().parent().attr('data-name'),
      flag = state == '0' ? '1' : '0';
    _pop(
      { e, text: `确认 ${state == 0 ? '停用' : '启用'} ${name}(${x})？` },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/root/deluser', { ac: x, flag })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                renderList();
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.del_account', function (e) {
    let $this = $(this),
      x = $this.parent().parent().attr('data-acc'),
      name = $this.parent().parent().attr('data-name');
    _pop(
      {
        e,
        text: `确认删除：${name}(${x})？`,
        confirm: { type: 'danger', text: '删除' },
      },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/root/delaccount', { ac: x })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                renderList();
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.reset_pd', function (e) {
    let $this = $(this),
      x = $this.parent().parent().attr('data-acc'),
      name = $this.parent().parent().attr('data-name');
    _pop(
      {
        e,
        text: `确认重置账号 ${name}(${x})的密码？`,
        confirm: { type: 'danger', text: '重置' },
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/resetpass', { a: x })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
              }
            })
            .catch((err) => {});
        }
      }
    );
  });
if (isIframe()) {
  $headBtns.find('.h_go_home').remove();
}
$headBtns
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.del_music_file', function (e) {
    _pop(
      {
        e,
        text: `清理歌曲文件？`,
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/delmusicfile', {}, { timeout: 0 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.del_bg_file', function (e) {
    _pop(
      {
        e,
        text: `清理壁纸文件？`,
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/delbgfile', {}, { timeout: 0 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.del_logo_file', function (e) {
    _pop(
      {
        e,
        text: `清理logo文件？`,
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/cleanlogo', {}, { timeout: 0 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.del_pic_file', function (e) {
    _pop(
      {
        e,
        text: `清理图床文件？`,
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/delpicfile', {}, { timeout: 0 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.clear_trash', function (e) {
    _pop(
      {
        e,
        text: `确认清空回收站？`,
      },
      (type) => {
        if (type == 'confirm') {
          _getAjax('/root/cleantrash', {}, { timeout: 0 })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.clear_thumb', function (e) {
    let data = [
      {
        id: 'all',
        text: '所有',
      },
      {
        id: 'pic',
        text: '图床',
      },
      {
        id: 'bg',
        text: '壁纸',
      },
      {
        id: 'music',
        text: '歌曲封面',
      },
      {
        id: 'upload',
        text: '聊天室',
      },
    ];
    selectMenu(
      e,
      data,
      ({ e, id, close }) => {
        const obj = data.find((item) => item.id == id);
        if (obj) {
          _pop(
            {
              e,
              text: `确认清空 ${obj.text} 缩略图？`,
            },
            (type) => {
              if (type == 'confirm') {
                _getAjax('/root/cleanthumb', { type: id }, { timeout: 0 })
                  .then((result) => {
                    if (parseInt(result.code) === 0) {
                      close();
                      _msg.success(result.codeText);
                      return;
                    }
                  })
                  .catch((err) => {});
              }
            }
          );
        }
      },
      '选择要清空的类型'
    );
  })
  .on('click', '.register_state', function () {
    _postAjax('/root/isregister')
      .then((res) => {
        if (res.code == 0) {
          $headBtns
            .find('.register_state span')
            .attr(
              'class',
              `iconfont iconfont ${
                res.data === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'
              }`
            );
          _msg.success(res.data === 'y' ? '开放注册成功' : '已关闭注册');
        }
      })
      .catch(() => {});
  })
  .on('click', '.trash_state', function () {
    _postAjax('/root/trash')
      .then((res) => {
        if (res.code == 0) {
          $headBtns
            .find('.trash_state span')
            .attr(
              'class',
              `iconfont iconfont ${
                res.data === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'
              }`
            );
          _msg.success(
            res.data === 'y' ? '开放文件回收站成功' : '已关闭文件回收站'
          );
        }
      })
      .catch(() => {});
  })
  .on('click', '.upload_save_day', function (e) {
    inpMenu(
      e,
      {
        subText: '提交',
        items: {
          text: {
            value: dataObj.uploadSaveDay,
            inputType: 'number',
            verify(val) {
              val = parseFloat(val);
              if (!isInteger(val) || val < 0) {
                return '请输入正整数';
              }
            },
          },
        },
      },
      debounce(
        function ({ close, inp }) {
          let day = parseInt(inp.text);
          _postAjax('/root/uploadsaveday', { day }).then((res) => {
            if (res.code == 0) {
              close();
              dataObj.uploadSaveDay = day;
              $headBtns
                .find('.upload_save_day')
                .text(
                  `${
                    dataObj.uploadSaveDay <= 0
                      ? '聊天室文件保存时间: 无限制'
                      : `聊天室文件保存时间: ${dataObj.uploadSaveDay}天`
                  }`
                );
              _msg.success(res.codeText);
            }
          });
        },
        1000,
        true
      ),
      '设置聊天室文件保存时间（天）'
    );
  })
  .on('click', '.set_token_key', function (e) {
    _pop({ e, text: `确认更新tokenKey？` }, (type) => {
      if (type == 'confirm') {
        _postAjax('/root/updatetoken').then((res) => {
          if (res.code == 0) {
            _msg.success(res.codeText);
          }
        });
      }
    });
  })
  .on('click', '.clean_database', function (e) {
    _pop({ e, text: `确认释放数据库空间？` }, (type) => {
      if (type == 'confirm') {
        _postAjax('/root/cleandatabase').then((res) => {
          if (res.code == 0) {
            _msg.success(res.codeText);
          }
        });
      }
    });
  });
