import '../../css/common/reset.css';
import '../../font/iconfont.css';
import '../../css/common/common.css';
import './index.less';
import $ from 'jquery';
import '../../js/common/common';
import {
  _getAjax,
  _getData,
  _postAjax,
  computeSize,
  debounce,
  deepClone,
  encodeHtml,
  getPageScrollTop,
  getScreenSize,
  getWordCount,
  hdTitleHighlight,
  isIframe,
  loadingImg,
  myOpen,
  pageErr,
  setPageScrollTop,
  splitWord,
  toLogin,
  wrapInput,
} from '../../js/utils/utils';
import { selectMenu } from '../../js/plugins/rightMenu';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import pagination from '../../js/plugins/pagination/index';
import { _d } from '../../js/common/config';
let curName = null;
const $head = $('.header'),
  $main = $('.main'),
  $stat = $('.stat'),
  $foot = $('.footer');
$main.pageNo = 1;
$main.list = [];
let lPageSize = 20;
const wInput = wrapInput($head.find('.inp_box input')[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $head.find('.inp_box i').css('display', 'none');
    } else {
      $head.find('.inp_box i').css('display', 'block');
    }
    $main.pageNo = 1;
    _hdRender();
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    $(target).parent().removeClass('focus');
  },
});
(() => {
  const acc = _getData('account');
  if (acc) {
    if (acc !== 'root') {
      pageErr();
    }
  } else {
    toLogin();
  }
})();
if (isIframe()) {
  $head.find('.h_go_home').remove();
}
$head
  .on('click', '.del_btn', function (e) {
    if (curName) {
      dellog(e, curName);
    }
  })
  .on('click', '.clean_btn', function (e) {
    dellog(e, 'all');
  })
  .on('click', '.h_go_home', function (e) {
    myOpen('/');
  })
  .on('click', '.select_btn', function (e) {
    _getAjax('/root/loglist')
      .then((res) => {
        if (res.code == 0) {
          let data = [];
          res.data.forEach((item, idx) => {
            let { name, size } = item;
            data.push({
              id: idx + 1,
              text: `${name} - ${computeSize(size)}`,
              param: { name },
              beforeIcon: 'iconfont icon-rizhi',
            });
          });
          selectMenu(
            e,
            data,
            ({ close, id, param }) => {
              if (id) {
                const name = param.name;
                close();
                loadingImg($main[0]);
                _getAjax('/root/getlog', { name }, { timeout: 10000 })
                  .then((res) => {
                    if (res.code == 0) {
                      $main.list = res.data.map((item) => ({ data: item }));
                      $main.pageNo = 1;
                      curName = name;
                      hdRender();
                      $stat.pageNo = 1;
                      $stat.list = getStatData(res.data);
                      $stat.html('');
                      renderStat();
                      $head.find('.del_btn').css('display', 'block');
                    }
                  })
                  .catch((err) => {});
              }
            },
            '日志列表'
          );
        }
      })
      .catch((err) => {});
  })
  .on('click', '.inp_box i', function () {
    wInput.setValue('');
    wInput.target.focus();
  });
$stat.list = [];
$stat.pageNo = 1;
function getStatData(list) {
  const reg = /\[([^\[\]]+)\]\((\d+\.\d+\.\d+\.\d+)\)/,
    ipObj = {};
  list.forEach((item) => {
    const ip = item.match(reg);
    if (ip) {
      const key = ip[2],
        addr = ip[1];
      if (ipObj.hasOwnProperty(key)) {
        ipObj[key]['total']++;
      } else {
        ipObj[key] = {
          total: 1,
          addr: addr,
        };
      }
    }
  });
  const ipArr = [];
  Object.keys(ipObj).forEach((item) => {
    ipArr.push({
      ip: item,
      total: ipObj[item]['total'],
      addr: ipObj[item]['addr'],
    });
  });
  ipArr.sort((a, b) => b.total - a.total);
  return ipArr;
}
function renderStat() {
  let str = '';
  $stat.list
    .slice(($stat.pageNo - 1) * 50, $stat.pageNo * 50)
    .forEach((item) => {
      const { ip, total, addr } = item;
      str += `<p><span cursor class='ip'>${encodeHtml(ip)}</span>(${encodeHtml(
        addr
      )})<span>：${total}</span></p>`;
    });
  $stat.append(str);
}
$stat.on('click', '.ip', function () {
  wInput.setValue(this.innerText);
});
window.addEventListener(
  'scroll',
  debounce(function () {
    if (
      getPageScrollTop() + this.document.documentElement.clientHeight >
      this.document.documentElement.scrollHeight - 50
    ) {
      $stat.pageNo++;
      renderStat();
    }
  }, 500)
);
const pgnt = pagination($foot[0], {
  change(val) {
    $main.pageNo = val;
    hdRender();
    _msg.botMsg(`第 ${$main.pageNo} 页`);
  },
  sizeChange(val) {
    lPageSize = val;
    $main.pageNo = 1;
    hdRender();
    _msg.botMsg(`第 ${$main.pageNo} 页`);
  },
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
});
const _hdRender = debounce(hdRender, 1000);
const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;

async function hdRender() {
  const word = await splitWord(wInput.getValue());
  let str = '';
  let arr = deepClone($main.list);
  if (word) {
    arr = arr.map((item) => {
      item.num = getWordCount(word, item.data);
      return item;
    });
    arr.sort((a, b) => b.num - a.num);
    arr = arr.filter((item) => item.num > 0);
  }
  let pageTotal = Math.ceil(arr.length / lPageSize);
  $main.pageNo < 1
    ? ($main.pageNo = pageTotal)
    : $main.pageNo > pageTotal
    ? ($main.pageNo = 1)
    : null;
  if (arr.length == 0) {
    str += defaultRes;
  } else {
    arr
      .slice(($main.pageNo - 1) * lPageSize, $main.pageNo * lPageSize)
      .forEach((item) => {
        let data = item.data;
        str += `<p>${hdTitleHighlight(word, data)}</p>`;
      });
  }
  pgnt.render(
    {
      pageNo: $main.pageNo,
      pageTotal,
      pageSize: lPageSize,
      total: arr.length,
    },
    getScreenSize().w <= _d.screen
  );
  $main.html(str);
  setPageScrollTop(0);
}
function dellog(e, name) {
  _pop(
    {
      e,
      text: `确认${name == 'all' ? '清空日志文件' : `删除${name}`}？`,
      confirm: { type: 'danger', text: name == 'all' ? '清空' : '删除' },
    },
    (type) => {
      if (type == 'confirm') {
        _postAjax('/root/dellog', { name })
          .then((res) => {
            if (res.code == 0) {
              _msg.success('删除成功');
              $main.list = [];
              curName = null;
              $main.html('');
              $foot.html('');
              $stat.list = [];
              $stat.html('');
              $head.find('.del_btn').css('display', 'none');
            }
          })
          .catch((err) => {});
      }
    }
  );
}
