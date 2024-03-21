import $ from 'jquery';
import '../../font/iconfont.css';
import '../../css/common/animate.css';
import '../../css/common/common.css';
import './index.less';
import './md.css';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  _mySlide,
  _getAjax,
  copyText,
  encodeHtml,
  _position,
  _myOpen,
  imgPreview,
  getPageScrollTop,
  pageErr,
  darkMode,
  getDateDiff,
  formatNum,
  showQcode,
  isIframe,
  _progressBar,
  percentToValue,
  getTextImg,
  wrapInput,
  hdPath,
  userLogoMenu,
  noteReadInfo,
  formatDate,
  imgjz,
  LazyLoad,
} from '../../js/utils/utils';
import { _speed } from '../../js/common/config';
import '../../js/common/common';
import _msg from '../../js/plugins/message';
import HighlightWord from './highlightWord';
import mdo from '../../js/utils/md';
import realtime from '../../js/plugins/realtime';
import gqImg from '../../images/img/gqimg.png';
const $html = $(document.documentElement);
let urlparmes = queryURLParams(myOpen()),
  HASH = urlparmes.HASH;

const $setBtnsWrap = $('.set_btns_wrap'),
  $contentWrap = $('.content_wrap'),
  $themeCss = $('.theme_css'),
  $noteInfo = $contentWrap.find('.note_info'),
  $noteBox = $contentWrap.find('.note_box'),
  $pageSearchWrap = $('.page_search_wrap'),
  $authorInfo = $contentWrap.find('.author_info'),
  $fillBox = $contentWrap.find('.fill_box'),
  $navigationWrap = $('.navigation_wrap');
let themeObj = _getData('themeObj'),
  dark = _getData('dark'),
  noteBigWidth = _getData('notebigwidth'),
  highlightnum = 0,
  $highlightWords = [],
  titleName = '';
if (noteBigWidth == 'y') {
  $contentWrap.addClass('big');
}
function showSearchBox() {
  $pageSearchWrap.css('display', 'flex');
  mdo.unHighlight();
}
$setBtnsWrap
  .on('click', '.edit_note_btn', function (e) {
    e.stopPropagation();
    _myOpen(`/edit/#${encodeURIComponent(urlparmes.v)}`, titleName);
  })
  .on('click', '.to_top_btn', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  })
  .on('click', '.show_search_wrap', showSearchBox)
  .on('click', '.change_theme_btn', function () {
    if (dark == 'y') {
      dark = 'n';
      _msg.success('关闭黑暗模式');
    } else if (dark == 'n') {
      dark = 's';
      _msg.success('跟随系统');
    } else if (dark == 's') {
      dark = 'y';
      _msg.success('开启黑暗模式');
    }
    changeTheme(dark);
  })
  .on('click', '.note_box_width', function () {
    if (noteBigWidth == 'n') {
      noteBigWidth = 'y';
      $contentWrap.addClass('big');
      _setData('notebigwidth', noteBigWidth);
    } else {
      noteBigWidth = 'n';
      $contentWrap.removeClass('big');
      _setData('notebigwidth', noteBigWidth);
    }
  })
  .on('click', '.font_size_btn', (e) => {
    let fsztnum = themeObj.fontsz;
    _progressBar(e, fsztnum, (percent) => {
      $contentWrap.css({
        'font-size': percentToValue(12, 30, percent),
      });
      themeObj.fontsz = percent;
      _setData('themeObj', themeObj);
    });
  })
  .on('click', '.show_navigation_btn', (e) => {
    e.stopPropagation();
    $navigationWrap.css('transition', '.5s ease-in-out').addClass('open');
    hdNavigationPosition();
  })
  .on('click', '.show_erweima_btn', (e) => {
    showQcode(e, myOpen()).catch((err) => {});
  })
  .on('click', '.set_btn', (e) => {
    $setBtnsWrap.find('.set_top').stop().slideToggle();
  });
const highlightWord = new HighlightWord($noteBox[0]);
if (urlparmes.v) {
  _getAjax('/note/getnote', { v: urlparmes.v })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let {
          name,
          data,
          account,
          username,
          time,
          utime,
          logo,
          visit_count = 0,
        } = result.data;
        const readInfo = noteReadInfo(data);
        titleName = name;
        _setTimeout(() => {
          if (isIframe()) {
            top.openIframe.hdTitle.updateTitle(window.iframeId, titleName);
          }
        }, 1000);
        $authorInfo._uobj = {
          account,
          username,
        };
        if (_getData('account') && account === _getData('account')) {
          realtime.read((data) => {
            const { type, flag, id } = data;
            if (
              type === 'updatedata' &&
              flag === 'note' &&
              urlparmes.v === id
            ) {
              window.location.reload();
            }
          });
        }
        let logoUrl = logo
          ? hdPath(`/api/logo/${account}/${logo}`)
          : getTextImg(username);
        $authorInfo
          .find('.logo')
          .attr('title', username)
          .css('background-image', `url(${logoUrl})`);
        mdo.render($noteBox[0], data);
        $noteInfo.find('h1').text(name);
        $noteInfo.find('div').html(`<span>创建：${formatDate({
          template: '{0}-{1}-{2}',
          timestamp: time,
        })}</span>
        <span class="iconfont icon-fenge"></span><span title='${formatDate({
          template: '{0}-{1}-{2}',
          timestamp: utime || time,
        })}'>更新：${getDateDiff(utime || time)}</span>
        <span class="iconfont icon-fenge"></span><span>阅读量：${formatNum(
          visit_count
        )}</span><span class="iconfont icon-fenge"></span><span>字数：${
          readInfo.word
        }</span><span class="iconfont icon-fenge"></span><span>阅读：约${
          readInfo.time
        }分钟</span>`);
        let $pre = $noteBox.find('pre');
        $pre.each((_, item) => {
          let $item = $(item);
          $item.append(
            `<div cursor class="codeCopy iconfont icon-fuzhi"><div>`
          );
          let $code = $item.find('code');
          if ($code.height() > 400) {
            $code.addClass('hide');
            $item.append(
              '<div data-flag="y" cursor class="shrink iconfont icon-Down"><div>'
            );
          }
        });
        BlogDirectory();
        document.title = name;
        $setBtnsWrap.addClass('open');
        $contentWrap.addClass('open');
        if (HASH) {
          HASH = decodeURIComponent(HASH);
          searchInp.setValue(HASH);
        }
        if (
          searchInp.getValue().trim() == '' ||
          $pageSearchWrap.is(':hidden')
        ) {
          mdo.highlight($noteBox[0]);
        }
        imgLazy.bind($noteBox[0].querySelectorAll('img'), (item) => {
          const url = item.getAttribute('data-src');
          imgjz(
            url,
            () => {
              item.src = url;
            },
            () => {
              item.src = gqImg;
            }
          );
        });
        return;
      }
    })
    .catch((err) => {
      pageErr();
    });
} else {
  pageErr();
}
const imgLazy = new LazyLoad();
$authorInfo.on('click', '.logo', function (e) {
  let { account, username } = $authorInfo._uobj;
  userLogoMenu(e, account, username);
});
$noteBox
  .on('click', '.codeCopy', function () {
    let str = $(this).parent().find('code').text();
    copyText(str);
  })
  .on('click', '.shrink', function () {
    let $this = $(this);
    let flag = $this.attr('data-flag');
    if (flag === 'y') {
      $this.attr({
        'data-flag': 'n',
        class: 'shrink iconfont icon-up',
      });
      $this.parent().find('code').removeClass('hide');
    } else {
      $this.attr({
        'data-flag': 'y',
        class: 'shrink iconfont icon-Down',
      });
      $this.parent().find('code').addClass('hide');
    }
  })
  .on('click', 'img', function () {
    const imgs = $noteBox.find('img');
    let idx = 0;
    const arr = [];
    imgs.each((i, item) => {
      if (item == this) {
        idx = i;
      }
      arr.push({
        u1: item.getAttribute('data-src'),
      });
    });
    imgPreview(arr, idx);
  });
const searchInp = wrapInput($pageSearchWrap.find('.inp_box .search_inp')[0], {
  focus() {
    $pageSearchWrap.find('.inp_box').addClass('focus');
  },
  blur() {
    $pageSearchWrap.find('.inp_box').removeClass('focus');
  },
  change(val) {
    val = val.trim();
    if (val) {
      $pageSearchWrap.find('.inp_box .clear').css('display', 'block');
    } else {
      $pageSearchWrap.find('.inp_box .clear').css('display', 'none');
    }
    hdSearchWord(val);
  },
});
const hdSearchWord = debounce(function (val) {
  $pageSearchWrap.find('.res_total_num').text(``);
  highlightWord.highlight(val);
  $highlightWords = $noteBox.find('span.highlight_word');
  let _length = $highlightWords.length;
  highlightnum = 0;
  if (_length > 0) {
    showSearchBox();
    $pageSearchWrap
      .find('.res_total_num')
      .text(`${highlightnum + 1}/${_length}`);
    highlightPosition(highlightnum);
  }
}, 500);
$pageSearchWrap
  .on('click', (e) => {
    const target = e.target;
    if (target.tagName === 'DIV') {
      if ($(target).attr('flag') === 'x') {
        $pageSearchWrap.css('display', 'none');
        mdo.highlight($noteBox[0]);
        highlightWord.init();
        highlightnum = 0;
        searchInp.setValue('');
        $pageSearchWrap.find('.res_total_num').text('');
      } else {
        if ($(target).attr('flag') === 'next') {
          nextPrevSearch(1);
        } else if ($(target).attr('flag') === 'pre') {
          nextPrevSearch();
        }
      }
    }
  })
  .on('click', '.inp_box .clear', function () {
    searchInp.setValue('');
    searchInp.target.focus();
  })
  .on('mouseenter', '.search_inp', function () {
    this.focus();
  })
  .on('keydown', '.search_inp', function (e) {
    let key = e.key;
    if (key === 'Enter') {
      nextPrevSearch(1);
      e.preventDefault();
    }
  });
function nextPrevSearch(isNext) {
  let _length = $highlightWords.length;
  if (_length === 0) return;
  if (isNext) {
    highlightnum++;
  } else {
    highlightnum--;
  }
  highlightnum >= _length
    ? (highlightnum = 0)
    : highlightnum < 0
    ? (highlightnum = _length - 1)
    : null;
  $pageSearchWrap.find('.res_total_num').text(`${highlightnum + 1}/${_length}`);
  highlightPosition(highlightnum);
}
//高亮定位
function highlightPosition(num) {
  let pageTop = getPageScrollTop();
  let DH = window.innerHeight,
    _top = _position($highlightWords.eq(num)[0], true).top + pageTop;
  $highlightWords.removeClass('active').eq(num).addClass('active');
  if (_top > pageTop && _top < pageTop + DH) {
  } else {
    window.scrollTo({
      top: _top - 60,
      behavior: 'smooth',
    });
  }
}
$contentWrap.css({
  'font-size': percentToValue(12, 30, themeObj.fontsz),
});

function changeTheme(flag) {
  dark = flag;
  if (dark == 'y') {
    $setBtnsWrap
      .find('.change_theme_btn')
      .attr('class', 'change_theme_btn iconfont icon-icon_yejian-yueliang');
    $themeCss.attr('href', '/css/notethem/notecode1.css');
  } else if (dark == 'n') {
    $setBtnsWrap
      .find('.change_theme_btn')
      .attr('class', 'change_theme_btn iconfont icon-taiyangtianqi');
    $themeCss.attr('href', '/css/notethem/notecode.css');
  } else if (dark == 's') {
    let state =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    $setBtnsWrap
      .find('.change_theme_btn')
      .attr('class', 'change_theme_btn iconfont icon-xianshiqi');
    if (state) {
      $themeCss.attr('href', '/css/notethem/notecode1.css');
    } else {
      $themeCss.attr('href', '/css/notethem/notecode.css');
    }
  }
  _setData('dark', dark);
  darkMode(dark);
}
window.changeTheme = changeTheme;
changeTheme(dark);
window.addEventListener('scroll', function () {
  let p = getPageScrollTop();
  if (p >= 60) {
    $authorInfo.addClass('active');
    $fillBox.css('display', 'block');
  } else {
    $authorInfo.removeClass('active');
    $fillBox.css('display', 'none');
  }
});
window.addEventListener(
  'scroll',
  throttle(function () {
    let p = getPageScrollTop();
    if (p <= 100) {
      $setBtnsWrap.find('.to_top_btn').stop().slideUp(_speed);
    } else {
      $setBtnsWrap.find('.to_top_btn').stop().slideDown(_speed);
    }
    let H = window.innerHeight,
      CH = document.documentElement.scrollHeight - H;
    pagepro(p / CH);
  }, 500)
);

function toTree(box) {
  // 祖先
  const root = { node: 'root', children: [] };
  let cur = root;
  // 遍历所有子孙
  box.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((item, idx) => {
    // 生成子孙对象
    const obj = { node: item, children: [] };
    // 找父亲
    while (cur !== root && obj.node.tagName[1] <= cur.node.tagName[1]) {
      cur = cur.parent;
    }
    // 儿子认父亲
    obj.parent = cur;
    // 父亲认儿子
    obj.parent.children.push(obj);
    cur = obj;
  });
  return root.children;
}
function BlogDirectory() {
  let $allH = $noteBox.find('h1,h2,h3,h4,h5,h6'),
    str = '';

  let treeData = toTree($noteBox[0]);
  if (treeData.length < 2) {
    $setBtnsWrap.find('.show_navigation_btn').remove();
    return;
  }
  let num = 1;
  (function next(data, level) {
    data.forEach((item) => {
      let text = encodeHtml(item.node.innerText);
      let flag = `hello_${num++}`;
      item.node.id = flag;
      str += `<li title="${text}" cursor h="${level}" data-id="${flag}">${text}</li>`;
      if (item.children.length > 0) {
        str += `<ul>`;
        next(item.children, level + 1);
        str += '</ul>';
      }
    });
  })(treeData, 1);
  $navigationWrap.find('.list_box').html(str);

  let $allLi = $navigationWrap.find('li');
  document.addEventListener('click', function (e) {
    if (!_getTarget(this, e, '.navigation_wrap')) {
      $navigationWrap.css('transition', '.5s ease-in-out').removeClass('open');
    }
  });
  $navigationWrap.on('click', 'li', function (e) {
    let $this = $(this);
    $allLi.removeClass('open');
    $this.addClass('open');
    let id = $this.attr('data-id'),
      el = $html.find(`#${id}`),
      _top = _position(el[0], true).top + getPageScrollTop();
    // setPageScrollTop(_top - 60);
    window.scrollTo({
      top: _top - 60,
      behavior: 'smooth',
    });
    $this.next('ul').stop().slideToggle(_speed);
  });
  _mySlide({
    el: '.navigation_wrap',
    right() {
      $navigationWrap.css('transition', '.5s ease-in-out').removeClass('open');
    },
  });
  function hdNavigationPosition() {
    if (!$navigationWrap.hasClass('open')) return;
    $allLi.removeClass('open');
    let $smalltopH = $allH
      .filter((_, item) => _position(item, true).top >= 0)
      .eq(0);
    $smalltopH.length > 0 ? null : ($smalltopH = $allH.last());
    if ($smalltopH.length > 0) {
      let $cuLi = $navigationWrap
        .find('.list_box')
        .find(`[data-id=${$smalltopH[0].id}]`);
      if ($cuLi.length > 0) {
        $cuLi.addClass('open');
        let c = $cuLi;
        while (c[0] != $navigationWrap.find('.list_box')[0]) {
          c = c.parent();
          c.slideDown(_speed);
        }
        _setTimeout(() => {
          $navigationWrap
            .find('.list_box')
            .stop()
            .animate(
              {
                scrollTop:
                  $navigationWrap.find('.list_box').scrollTop() +
                  _position($cuLi[0], true).top -
                  $navigationWrap.height() / 4,
              },
              _speed
            );
        }, _speed);
      }
    }
  }
  window.hdNavigationPosition = hdNavigationPosition;
  window.addEventListener('scroll', debounce(hdNavigationPosition, 100));
}

~(function () {
  let div = document.createElement('div');
  div.style.cssText = `
    width: 0;
    height: 3px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radio:20px;
    pointer-events: none;
    transition: 1s ease-in-out;
    background-image: linear-gradient(to right, green, orange);
    z-index: 9999999999;
  `;
  document.body.appendChild(div);
  window.pagepro = function (percent) {
    div.style.width = percent * 100 + '%';
  };
})();
