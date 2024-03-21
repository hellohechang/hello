import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import {
  queryURLParams,
  myOpen,
  imgjz,
  _getAjax,
  encodeHtml,
  pageErr,
  setPageScrollTop,
  inputPageNo,
  getTextImg,
  formatDate,
  enterPassCode,
  _getDataTem,
  _setDataTem,
  hdPath,
  debounce,
  userLogoMenu,
  LazyLoad,
} from '../../js/utils/utils';
import imgMrLogo from '../../images/img/mrlogo.png';
import '../../js/common/common';
import _msg from '../../js/plugins/message';
import { inpMenu } from '../../js/plugins/rightMenu';
let urlparmes = queryURLParams(myOpen()),
  HASH = urlparmes.HASH;
if (!HASH) {
  pageErr();
}
let pageNo = 1;
let bmList = [];
let passCode = _getDataTem('passCode') || '';
function switchList() {
  let pageTotal = Math.ceil(bmList.length / 48);
  pageNo < 1 ? (pageNo = pageTotal) : pageNo > pageTotal ? (pageNo = 1) : null;
  let str = '';
  bmList.slice((pageNo - 1) * 48, pageNo * 48).forEach((item) => {
    let { name, link, des } = item;
    des = des ? encodeHtml(des) : '';
    name = encodeHtml(name);
    link = encodeHtml(link);
    str += `<li title="${name}\n${link}\n${des}" data-name="${name}" data-des="${des}" cursor class="bm_item jzxz" data-link="${link}">
        <div class="logo"></div>
        <div class="bm_title">${name}</div>
        <p>${des || '描述'}</p>
        </li>`;
  });
  if (pageTotal > 1) {
    str += `<div style="padding:20px 0;text-align:center;float: left;line-height: 26px;
            width: 100%;" class="bm_list_paging jzxz">
            <span class="prev_page iconfont icon-prev" cursor></span>
            <span cursor class="input_num" style="margin:0 30px">${pageNo}/${pageTotal}</span>
            <span class="next_page iconfont icon-page-next" cursor></span>
            </div>`;
  }
  $box.html(str).addClass('open');
  bmLoadImg.bind($box[0].querySelectorAll('.bm_item'), (item) => {
    let $item = $(item),
      link = $item.attr('data-link'),
      url = `/api/getfavicon?u=${encodeURIComponent(link)}`;
    let $img = $item.find('.logo');
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
        $img
          .css({
            'background-image': `url(${imgMrLogo})`,
          })
          .addClass('load');
      }
    );
  });
  setPageScrollTop(0);
}
const bmLoadImg = new LazyLoad();
const $box = $('.box');
const $head = $('.head');
let mClose = null;
let defaultTitle = '';
function getShareData() {
  _getAjax('/bmk/share', { id: HASH, pass: passCode })
    .then((res) => {
      if (mClose) {
        mClose && mClose(1);
        mClose = null;
      }
      if (res.code == 0) {
        let { username, logo, account, data, title, valid } = res.data;
        $head._uObj = { username, account };
        defaultTitle = title;
        logo = logo
          ? hdPath(`/api/logo/${account}/${logo}`)
          : getTextImg(username);
        $head.find('.logo').css('background-image', `url(${logo})`);
        $head.find('.from').text(username);
        $head.find('.title').text(title);
        $head.find('.valid').text(
          valid == 0
            ? '永久'
            : formatDate({
                template: '{0}-{1}-{2} {3}:{4}',
                timestamp: valid,
              })
        );
        bmList = data;
        switchList();
      } else if (res.code == 3) {
        _msg.error('提取码错误');
        enterPassCode(({ close, val }) => {
          mClose = close;
          passCode = val;
          _setDataTem('passCode', passCode);
          getShareData();
        });
      }
    })
    .catch((err) => {
      pageErr();
    });
}
getShareData();
$head
  .on('click', '.logo', function (e) {
    const { account, username } = $head._uObj;
    userLogoMenu(e, account, username);
  })
  .on('click', '.save_to_list', function (e) {
    inpMenu(
      e,
      {
        subText: '提交',
        items: {
          name: {
            value: defaultTitle,
            placeholder: '书签分组名称',
            verify(val) {
              if (val.trim() == '') {
                return '请输入名称';
              }
            },
          },
        },
      },
      debounce(
        function ({ close, inp }) {
          let va = inp.name;
          _getAjax('/bmk/saveshare', { id: HASH, name: va, pass: passCode })
            .then((res) => {
              if (res.code == 0) {
                _msg.success(res.codeText);
                close();
              }
            })
            .catch((err) => {});
        },
        1000,
        true
      ),
      '保存书签到分组'
    );
  });
$box
  .on('click', '.bm_item', function () {
    let $this = $(this),
      link = $this.attr('data-link');
    myOpen(link, '_blank');
  })
  .on('click', '.prev_page', function () {
    pageNo--;
    switchList();
  })
  .on('click', '.next_page', function () {
    pageNo++;
    switchList();
  })
  .on('click', '.input_num', function (e) {
    inputPageNo(e, { value: pageNo, subText: 'Go' }, (val) => {
      pageNo = val;
      switchList();
    });
  });
