import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import {
  _setData,
  _getData,
  fileSlice,
  imgjz,
  _postAjax,
  _getAjax,
  _upFile,
  copyText,
  isImgFile,
  imgPreview,
  encodeHtml,
  toLogin,
  getScreenSize,
  longPress,
  isMobile,
  getFiles,
  isIframe,
  myOpen,
  getSuffix,
  getFilePath,
  getPreUrl,
  hdPath,
  LazyLoad,
} from '../../js/utils/utils';
import { _d, _speed } from '../../js/common/config';
import '../../js/common/common';
import pagination from '../../js/plugins/pagination';
import { selectMenu } from '../../js/plugins/rightMenu';
import { UpProgress } from '../../js/plugins/UpProgress';
import _msg from '../../js/plugins/message';
import _pop from '../../js/plugins/popConfirm';
import loadfailImg from '../../images/img/loadfail.png';
if (!_getData('account')) {
  toLogin();
}
const $contentWrap = $('.content_wrap'),
  $imgList = $contentWrap.find('.img_list'),
  $footer = $('.footer');
// 上传壁纸
async function hdUpFile(files) {
  const fData = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { name, size } = file;
    const pro = new UpProgress(name);
    if (!isImgFile(name)) {
      pro.fail();
      _msg.error(`图片格式错误`);
      continue;
    }
    if (size <= 0 || size >= 5 * 1024 * 1024) {
      pro.fail();
      _msg.error(`图片大小必须0~5M范围`);
      continue;
    }
    try {
      //文件切片
      let { HASH } = await fileSlice(file, (percent) => {
        pro.loading(percent);
      });
      const isrepeat = await _postAjax('/pic/repeatfile', {
        HASH,
      }); //是否已经存在文件

      if (parseInt(isrepeat.code) === 0) {
        pro.close('文件已存在');
        const { url } = isrepeat.data;
        fData.push({
          filename: getSuffix(name)[0],
          url: getPreUrl() + hdPath(`/api/picture/${url}`),
        });
        //文件已经存在操作
        continue;
      }
      const result = await _upFile(
        {
          url: `/pic/up`,
          param: {
            name,
            HASH,
          },
        },
        file,
        (percent) => {
          pro.update(percent);
        }
      );
      if (parseInt(result.code) === 0) {
        const { url } = result.data;
        fData.push({
          filename: getSuffix(name)[0],
          url: getPreUrl() + hdPath(`/api/picture/${url}`),
        });
        pro.close();
      } else {
        pro.fail();
      }
    } catch (error) {
      pro.fail();
    }
  }
  bgpage = 1;
  renderImgList(true);
  showLink(fData);
}
document.body.addEventListener('paste', function (e) {
  let files = [];
  let data = e.clipboardData || window.clipboardData;
  [...data.items].forEach((item) => {
    let blob = item.getAsFile();
    if (blob && isImgFile(blob.name)) {
      files.push(blob);
    }
  });
  if (files.length === 0) return;
  e.preventDefault();
  hdUpFile(files);
});
if (isIframe()) {
  $contentWrap.find('.go_home').remove();
}
$contentWrap
  .on('click', '.uoload_img_btn', async function (e) {
    e.stopPropagation();
    const files = await getFiles({
      multiple: true,
      accept: '.jpg,.jpeg,.png,.ico,.svg,.webp,.gif',
    });
    if (files.length == 0) return;
    hdUpFile(files);
  })
  .on('click', '.go_home', function () {
    myOpen('/');
  });
~(function () {
  document.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  document.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  document.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files];
    if (files.length == 0) return;
    hdUpFile(files);
  });
})();
// 获取壁纸
var bgpage = 1;
let curPageSize = _getData('bgshowpage');
renderImgList(true);
function imgListLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<div style="pointer-events: none;" class="img_item">
        <div class="img"></div>
            </div>`;
  });
  $imgList.html(str).scrollTop(0);
}
if (_getData('account') !== 'root') {
  $imgList.remove();
}
function getPicItem(id) {
  return $imgList.list.find((item) => item.id == id);
}
$imgList.list = [];
const defaultRes = `<p style='text-align: center;'>${_d.emptyList}</p>`;
function renderImgList(y) {
  if (_getData('account') !== 'root') return;
  if (y) {
    imgListLoading();
  }
  let str = '',
    showpage = curPageSize;
  _getAjax('/pic/getlist', { page: bgpage, showpage })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let { total, totalPage, data, pageNo } = result.data;
        bgpage = pageNo;
        $imgList.list = data;
        if (data.length == 0) {
          str += defaultRes;
        } else {
          data.forEach((v) => {
            const { id } = v;
            str += `<div class="img_item" data-id="${id}">
            <div check="n" class="check_level"></div>
            <i cursor class="menu_btn iconfont icon-shoucang"></i>
              <div class="img"></div>
                  </div>`;
          });
          str += `<div class="pagingbox">`;
          str += pgnt.getHTML(
            { pageNo, pageSize: showpage, total },
            getScreenSize().w <= _d.screen
          );
          str += `</div > `;
        }
        $imgList.html(str);
        $footer.stop().slideUp(_speed);
        if (y) {
          $imgList.scrollTop(0);
        }
        bglazyImg.bind($imgList[0].querySelectorAll('.img'), (item) => {
          let $img = $(item);
          const obj = getPicItem($img.parent().attr('data-id'));
          if (!obj) return;
          const url = getFilePath(`/pic/${obj.url}`, 1);
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
      isRoot = false;
    })
    .catch((err) => {});
}
const bglazyImg = new LazyLoad();
const pgnt = pagination($imgList[0], {
  pageSize: curPageSize,
  select: [20, 40, 60, 80, 100],
  change(val) {
    bgpage = val;
    renderImgList(true);
    _msg.botMsg(`第 ${bgpage} 页`);
  },
  sizeChange(val) {
    curPageSize = val;
    _setData('bgshowpage', curPageSize);
    bgpage = 1;
    renderImgList(true);
    _msg.botMsg(`第 ${bgpage} 页`);
  },
  top() {
    $imgList.stop().animate(
      {
        scrollTop: 0,
      },
      _speed
    );
  },
});
function bgitemmenu(e, pobj, el) {
  let data = [
    { id: '1', text: '复制链接', beforeIcon: 'iconfont icon-fuzhi' },
    { id: '2', text: '选中', beforeIcon: 'iconfont icon-duoxuan' },
    {
      id: '3',
      text: '删除',
      beforeIcon: 'iconfont icon-shanchu',
    },
  ];
  selectMenu(
    e,
    data,
    ({ e, close, id }) => {
      if (id == '1') {
        let data = [];
        let obj = {
          url: getPreUrl() + hdPath(`/api/picture/${pobj.url}`),
          filename: pobj.title,
        };
        typeTemplateArr.forEach((item, idx) => {
          let { type, template } = item;
          let text = template.replace(/\{\{(.*?)\}\}/g, function () {
            let key = arguments[1];
            return obj[key];
          });
          data.push({
            id: idx + 1,
            text: type,
            param: { text },
          });
        });
        selectMenu(
          e,
          data,
          ({ param, close, id }) => {
            if (id) {
              close();
              copyText(param.text);
            }
          },
          '选择复制链接类型'
        );
      } else if (id == '3') {
        _pop(
          {
            e,
            text: '确认删除？',
            confirm: { type: 'danger', text: '删除' },
          },
          (type) => {
            if (type == 'confirm') {
              _postAjax('/pic/delpic', [pobj.id])
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    _msg.success(result.codeText);
                    renderImgList();
                    return;
                  }
                })
                .catch((err) => {});
            }
          }
        );
      } else if (id == '2') {
        close();
        $imgList.find('.check_level').css('display', 'block');
        $footer.stop().slideDown(_speed).find('span').attr({
          class: 'iconfont icon-xuanzeweixuanze',
          check: 'n',
        });
        checkedImg(el);
      }
    },
    '操作图片'
  );
}
$imgList
  .on('click', '.img', function () {
    let $this = $(this);
    let idx = $this.index('.img');
    let arr = [];
    $imgList.find('.img').each((idx, item) => {
      let $item = $(item);
      const obj = getPicItem($item.parent().attr('data-id'));
      const u1 = `/api/picture/${obj.url}`;
      const u2 = getFilePath(`/pic/${obj.url}`, 1);
      arr.push({
        u2,
        u1,
      });
    });
    imgPreview(arr, idx);
  })
  .on('contextmenu', '.img', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    bgitemmenu(
      e,
      getPicItem($(this).parent().data('id')),
      this.parentNode.querySelector('.check_level')
    );
  })
  .on('click', '.menu_btn', function (e) {
    e.preventDefault();
    bgitemmenu(
      e,
      getPicItem($(this).parent().data('id')),
      this.parentNode.querySelector('.check_level')
    );
  })
  .on('click', '.check_level', function () {
    checkedImg(this);
  });
function checkedImg(el) {
  const $this = $(el);
  let check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $imgItem = $imgList.find('.img_item'),
    $checkArr = $imgItem.filter(
      (_, item) => $(item).find('.check_level').attr('check') === 'y'
    );
  _msg.botMsg(`选中：${$checkArr.length}项`);
  if ($checkArr.length === $imgItem.length) {
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
longPress($imgList[0], '.img', function (e) {
  let ev = e.changedTouches[0];
  bgitemmenu(
    ev,
    getPicItem($(this).parent().data('id')),
    this.parentNode.querySelector('.check_level')
  );
});
const typeTemplateArr = [
  {
    type: 'url',
    template: '{{url}}',
  },
  {
    type: 'markdown',
    template: '![{{filename}}]({{url}})',
  },
  {
    type: 'html',
    template: '<img src="{{url}}" alt="{{filename}}" title="{{filename}}" />',
  },
  {
    type: 'bbcode',
    template: '[img]{{url}}[/img]',
  },
  {
    type: 'markdown with link',
    template: '[![{{filename}}]({{url}})]({{url}})',
  },
];

let showLink = (function () {
  const $tabMask = $('.tab_mask'),
    $head = $tabMask.find('.head'),
    $content = $tabMask.find('.content');
  function render(data) {
    if (data.length === 0) return;
    let hstr = '';
    let cstr = '';
    typeTemplateArr.forEach((item, idx) => {
      let { type, template } = item;
      hstr += `<span data-idx="${idx}" cursor class="${
        idx == 0 ? 'active' : ''
      }">${type}</span>`;
      cstr += `<ul class="${idx == 0 ? 'active' : ''}">`;
      data.forEach((obj) => {
        let text = template.replace(/\{\{(.*?)\}\}/g, function () {
          let key = arguments[1];
          return obj[key];
        });
        text = encodeHtml(text);
        cstr += `<li data-text="${text}">${text}<i cursor class="iconfont icon-fuzhi"></i></li>`;
      });
      cstr += '</ul>';
    });
    $head.html(hstr);
    $content.html(cstr);
    $tabMask.stop().fadeIn(_speed);
  }
  $tabMask.on('click', function (e) {
    if (e.target == this) {
      $tabMask.stop().fadeOut(_speed);
    }
  });
  $content.on('click', 'i', function () {
    let text = $(this).parent().attr('data-text');
    copyText(text);
  });
  $head.on('click', 'span', function () {
    const $this = $(this),
      idx = $this.attr('data-idx'),
      $span = $head.find('span'),
      $ul = $content.find('ul');
    $span.removeClass('active');
    $this.addClass('active');
    $ul.removeClass('active');
    $ul.eq(idx).addClass('active');
  });
  return render;
})();
$footer
  .on('click', '.f_delete', function (e) {
    let $imgItem = $imgList.find('.img_item'),
      $checkArr = $imgItem.filter(
        (_, item) => $(item).find('.check_level').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.data('id'));
    });
    _pop(
      { e, text: `确认删除？`, confirm: { type: 'danger', text: '删除' } },
      (type) => {
        if (type == 'confirm') {
          _postAjax('/pic/delpic', arr)
            .then((result) => {
              if (parseInt(result.code) === 0) {
                _msg.success(result.codeText);
                renderImgList();
                return;
              }
            })
            .catch((err) => {});
        }
      }
    );
  })
  .on('click', '.f_close', function () {
    let $imgItem = $imgList.find('.img_item');
    $imgItem
      .find('.check_level')
      .css('display', 'none')
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
    let $imgItem = $imgList.find('.img_item');
    $imgItem
      .find('.check_level')
      .attr('check', che)
      .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
    _msg.botMsg(`选中：${che === 'y' ? $imgItem.length : 0}项`);
  });
