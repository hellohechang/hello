import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import '../../js/common/common';
import {
  LazyLoad,
  _getAjax,
  _getData,
  _myOpen,
  _postAjax,
  _setData,
  _upFile,
  computeSize,
  createShare,
  debounce,
  downloadFile,
  encodeHtml,
  fileLogoType,
  fileSlice,
  formatDate,
  getFilePath,
  getFiles,
  getPaging,
  getScreenSize,
  getSuffix,
  getWordCount,
  hdFilename,
  hdPath,
  imgPreview,
  imgjz,
  isFilename,
  isIframe,
  isImgFile,
  isMobile,
  isParentDir,
  isVideoFile,
  isios,
  longPress,
  mixedSort,
  myOpen,
  setPageScrollTop,
  splitWord,
  toLogin,
  wrapInput,
} from '../../js/utils/utils';
import pagination from '../../js/plugins/pagination';
import _msg from '../../js/plugins/message';
import { _d, _speed } from '../../js/common/config';
import curmb from './crumb/index';
import { openFile } from './edit';
import { inpMenu, selectMenu } from '../../js/plugins/rightMenu';
import { UpProgress } from '../../js/plugins/UpProgress';
import _pop from '../../js/plugins/popConfirm';
import { maskLoading } from '../../js/plugins/loadingBar';
import bus from '../../js/utils/bus';
import loadfailImg from '../../images/img/loadfail.png';
_d.isFilePage = true;
const $contentWrap = $('.content_wrap');
const $pagination = $('.pagination .container');
const $curmbBox = $('.crumb_box');
const $search = $('.search');
const $header = $('.header');
const $footer = $('.footer');
let pageSize = _getData('fileshowpage');
let fileUrl = _getData('fileUrl');
let fileShowGrid = _getData('fileShowGrid');
function changeListShowModel() {
  $header
    .find('.h_showmodel_btn')
    .attr(
      'class',
      `h_btn h_showmodel_btn iconfont ${
        fileShowGrid ? 'icon-liebiao1' : 'icon-liebiao'
      }`
    );
  $contentWrap
    .find('.container')
    .attr('class', `container ${fileShowGrid ? 'grid' : ''}`);
}
changeListShowModel();
let pageNo = 1;
let waitObj = { type: '', data: [] };
let isChecking;
(() => {
  const acc = _getData('account');
  if (acc) {
  } else {
    toLogin();
  }
})();
curmb.bind($curmbBox.find('.container')[0], (path) => {
  pageNo = 1;
  openDir(path, 1);
});
$contentWrap.list = [];
$contentWrap.originList = [];
let fileSort = _getData('fileSort');
const wInput = wrapInput($search.find('.inp_box input')[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $search.find('.inp_box i').css('display', 'none');
    } else {
      $search.find('.inp_box i').css('display', 'block');
    }
    pageNo = 1;
    renderList(1);
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    $(target).parent().removeClass('focus');
  },
});
$search.on('click', '.inp_box i', function () {
  wInput.setValue('');
  wInput.target.focus();
});
function openSearch() {
  $search.stop().slideDown(_speed);
}
function closeSearch() {
  if (wInput.getValue()) {
    wInput.setValue('');
  }
  $search.stop().slideUp(_speed);
}
async function renderList(top) {
  closeCheck();
  $contentWrap.list = await hdSort($contentWrap.originList);
  const paging = getPaging($contentWrap.list, pageNo, pageSize);
  const totalPage = paging.totalPage;
  pageNo = paging.pageNo;
  let str = '';
  if (paging.list.length > 0) {
    paging.list.forEach((item) => {
      const { type, name, size, time, id } = item;
      let logo = '';
      if (!isImgFile(name)) {
        if (type == 'file') {
          logo = fileLogoType(name);
        } else {
          logo = 'icon-24gl-folder';
        }
      }
      const [a, b] = getSuffix(name);
      let text = encodeHtml(name);
      if (type == 'file') {
        text = encodeHtml(a);
        if (b) {
          text += `<span class="suffix">.${b}</span>`;
        }
      }
      str += `<ul cursor title="${encodeHtml(
        name
      )}" class="file_item" data-id="${id}">
      <li class="check_state" check="n"></li>
      <li class="logo iconfont ${logo || 'is_img'}"></li>
      <li class="name"><span class="text">${text}</span></li>
      <li class="size">${size ? computeSize(size) : '--'}</li>
      <li class="date">${formatDate({
        template: '{0}-{1}-{2} {3}:{4}',
        timestamp: time,
      })}</li>
    </ul>`;
    });
    new Array(10).fill(null).forEach((item) => {
      str += `<i class='fill'></i>`;
    });
    $pagination.css('display', 'block');
    pgnt.render(
      {
        pageNo,
        pageTotal: totalPage,
        pageSize,
        total: $contentWrap.list.length,
      },
      getScreenSize().w <= _d.screen
    );
  } else {
    $pagination.css('display', 'none');
    str += `<p>${_d.emptyList}</p>`;
  }
  $contentWrap.find('.container').html(str);
  lazyImg.bind($contentWrap[0].querySelectorAll('.logo.is_img'), (item) => {
    const $item = $(item);
    const { path, name } = getFileItem($item.parent().data('id'));
    if (isImgFile(name)) {
      const url = getFilePath(`/file/${path}/${name}`, 1);
      imgjz(
        url,
        () => {
          $item.css('background-image', `url(${url})`);
        },
        () => {
          $item.css('background-image', `url(${loadfailImg})`);
        }
      );
    }
  });
  if (top) {
    setPageScrollTop(0);
  }
}
const lazyImg = new LazyLoad();
const pgnt = pagination($pagination[0], {
  change(val) {
    pageNo = val;
    renderList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
  },
  sizeChange(val) {
    pageSize = val;
    pageNo = 1;
    renderList(1);
    _msg.botMsg(`第 ${pageNo} 页`);
    _setData('fileshowpage', pageSize);
  },
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
});
async function hdSort(list) {
  list = [...list];
  const { type, isDes } = fileSort;
  const val = wInput.getValue().trim();
  if (val) {
    const word = await splitWord(val);
    list = list.filter((item) => {
      return getWordCount(word, item.name) > 0;
    });
  }
  list.sort((a, b) => {
    if (type == 'time' || type == 'type') {
      if (isDes || type == 'type') {
        return b.time - a.time;
      }
      return a.time - b.time;
    } else if (type == 'name') {
      if (isDes) {
        return mixedSort(b.name, a.name);
      }
      return mixedSort(a.name, b.name);
    } else if (type == 'size') {
      if (isDes) {
        return b.size - a.size;
      }
      return a.size - b.size;
    }
  });
  if (type == 'type') {
    const files = list.filter((item) => item.type == 'file');
    const dirs = list.filter((item) => item.type == 'dir');
    if (isDes) {
      list = [...files, ...dirs];
    } else {
      list = [...dirs, ...files];
    }
  }
  return list;
}
openDir(fileUrl, 1);
bus.on('refreshList', openDir);
async function openDir(path, top) {
  try {
    if (!path) {
      path = fileUrl;
    }
    fileUrl = path = hdPath('/' + path);
    _setData('fileUrl', fileUrl);
    curmb.setPath(path);
    const res = await _getAjax('/file/readdir', { path });
    if (res.code == 0) {
      $contentWrap.originList = res.data.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
      if (top && wInput.getValue()) {
        wInput.setValue('');
      } else {
        renderList(top);
      }
    }
  } catch (error) {}
}
function getFileItem(id) {
  return $contentWrap.list.find((item) => item.id == id);
}
async function readFileAndDir(obj) {
  const { type, name, path } = obj;
  const p = `${path}/${name}`;
  if (type == 'dir') {
    pageNo = 1;
    openDir(p, 1);
  } else if (type == 'file') {
    try {
      const res = await _getAjax('/file/getfile', { path: p }, { timeout: 0 });
      if (res.code == 0) {
        if (res.data.type == 'text') {
          openFile(res.data.data, p);
        } else if (res.data.type == 'other') {
          const fPath = getFilePath(`/file/${p}`);
          if (isImgFile(p)) {
            const list = $contentWrap.list.filter(
              (item) => item.type == 'file' && isImgFile(item.name)
            );
            const arr = list.map((item) => {
              const p = `${item.path}/${item.name}`;
              return {
                u1: getFilePath(`/file/${p}`),
                u2: getFilePath(`/file/${p}`, 1),
              };
            });
            if (arr.length == 0) return;
            imgPreview(
              arr,
              list.findIndex((item) => item.id == obj.id)
            );
          } else if (isVideoFile(p)) {
            _myOpen(`/videoplay/#${encodeURIComponent(fPath)}`, obj.name);
          } else if (/(\.mp3|\.aac|\.wav|\.ogg)$/gi.test(p)) {
            _myOpen(fPath, obj.name);
          } else if (isios()) {
            myOpen(fPath);
          } else {
            myOpen(fPath, 'blank');
          }
        }
      }
    } catch (error) {}
  }
}
$contentWrap
  .on('click', '.file_item', function () {
    readFileAndDir(getFileItem(this.dataset.id));
  })
  .on('click', '.check_state', function (e) {
    e.stopPropagation();
    hdCheckItem(this);
  })
  .on('contextmenu', '.file_item', function (e) {
    e.preventDefault();
    if (isMobile()) return;
    rightList(
      e,
      getFileItem(this.dataset.id),
      this.querySelector('.check_state')
    );
  });
longPress($contentWrap[0], '.file_item', function (e) {
  const ev = e.changedTouches[0];
  rightList(
    ev,
    getFileItem(this.dataset.id),
    this.querySelector('.check_state')
  );
});
function rightList(e, obj, el) {
  let data = [
    {
      id: 'share',
      text: '分享',
      beforeIcon: 'iconfont icon-fenxiang_2',
    },
  ];
  if (obj.type == 'file') {
    data.push({
      id: 'download',
      text: '下载',
      beforeIcon: 'iconfont icon-xiazai1',
    });
  }
  if ($footer.is(':hidden')) {
    data.push({
      id: 'check',
      text: '选中',
      beforeIcon: 'iconfont icon-duoxuan',
    });
  }
  data = [
    ...data,
    {
      id: 'rename',
      text: '重命名',
      beforeIcon: 'iconfont icon-bianji',
    },
    {
      id: 'copy',
      text: '复制',
      beforeIcon: 'iconfont icon-fuzhi',
    },
    {
      id: 'cut',
      text: '剪切',
      beforeIcon: 'iconfont icon-jiandao',
    },
  ];
  if (getSuffix(obj.name)[1].toLowerCase() == 'zip') {
    data.push({
      id: 'decompress',
      text: '解压',
      beforeIcon: 'iconfont icon-yasuobao1',
    });
  } else {
    data.push({
      id: 'compress',
      text: '压缩',
      beforeIcon: 'iconfont icon-yasuobao1',
    });
  }
  data.push({
    id: 'info',
    text: '属性',
    beforeIcon: 'iconfont icon-about',
  });
  data.push({
    id: 'del',
    text: '删除',
    beforeIcon: 'iconfont icon-shanchu',
  });
  selectMenu(
    e,
    data,
    ({ e, id, close }) => {
      // 编辑列表
      if (id == 'download') {
        close();
        downloadFile(getFilePath(`/file/${obj.path}/${obj.name}`), obj.name);
      } else if (id == 'share') {
        hdShare(e, obj);
      } else if (id == 'rename') {
        hdRename(e, obj, () => {
          close();
        });
      } else if (id == 'copy') {
        waitObj = {
          type: 'copy',
          data: [obj],
        };
        showPaste();
        close();
      } else if (id == 'del') {
        hdDel(e, [obj], () => {
          close();
        });
      } else if (id == 'cut') {
        waitObj = {
          type: 'cut',
          data: [obj],
        };
        showPaste();
        close();
      } else if (id == 'compress') {
        hdCompress(e, obj, () => {
          close();
        });
      } else if (id == 'decompress') {
        hdDeCompress(e, obj, () => {
          close();
        });
      } else if (id == 'info') {
        let data = [
          {
            text: obj.name,
            beforeText: 'name：',
          },
          {
            text: obj.type,
            beforeText: 'type：',
          },
          {
            text: obj.path,
            beforeText: 'path：',
          },
          {
            text: obj.size ? computeSize(obj.size) : '--',
            beforeText: 'size：',
          },
          {
            text: formatDate({
              template: '{0}-{1}-{2} {3}:{4}',
              timestamp: obj.time,
            }),
            beforeText: 'time：',
          },
        ];
        data.forEach((item, idx) => {
          (item.pointer = false), (item.id = idx + 1);
        });
        selectMenu(e, data, false, '属性信息');
      } else if (id == 'check') {
        close();
        if (!isChecking) {
          startCheck();
          hdCheckItem(el);
        }
      }
    },
    obj.name
  );
}
function hdShare(e, obj) {
  createShare(
    e,
    { name: obj.name, title: `分享${obj.type == 'file' ? '文件' : '文件夹'}` },
    ({ close, inp }) => {
      const { title, pass, valid } = inp;
      _postAjax('/file/share', { data: obj, title, pass, valid })
        .then((result) => {
          if (parseInt(result.code) === 0) {
            close(1);
            _myOpen(`/sharelist`, '分享列表');
          }
        })
        .catch((err) => {});
    }
  );
}
$contentWrap[0].addEventListener('paste', function (e) {
  let files = [];
  let data = e.clipboardData || window.clipboardData;
  [...data.items].forEach((item) => {
    let blob = item.getAsFile();
    if (blob) {
      files.push(blob);
    }
  });
  if (files.length === 0) return;
  e.preventDefault();
  hdUp(files);
});
~(function () {
  $contentWrap[0].addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  $contentWrap[0].addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  $contentWrap[0].addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files];
    if (files.length == 0) return;
    hdUp(files);
  });
})();
async function hdDeCompress(e, obj, cb) {
  _pop(
    {
      e,
      text: `确认解压文件：${obj.name}？`,
    },
    async (type) => {
      if (type == 'confirm') {
        try {
          const res = await _postAjax(
            '/file/unzip',
            { data: obj },
            { timeout: 0 }
          );
          if (res.code == 0) {
            _msg.success(res.codeText);
            openDir();
            cb && cb();
          }
        } catch (error) {}
      }
    }
  );
}
async function hdCompress(e, obj, cb) {
  _pop(
    {
      e,
      text: `确认压缩${obj.type == 'dir' ? '文件夹' : '文件'}：${obj.name}？`,
    },
    async (type) => {
      if (type == 'confirm') {
        try {
          const res = await _postAjax(
            '/file/zip',
            { data: obj },
            { timeout: 0 }
          );
          if (res.code == 0) {
            _msg.success(res.codeText);
            openDir();
            cb && cb();
          }
        } catch (error) {}
      }
    }
  );
}
function hdCheckItem(el) {
  const $el = $(el);
  if ($el.attr('check') == 'y') {
    $el.css('background-color', 'transparent').attr('check', 'n');
  } else {
    $el.css('background-color', _d.checkColor).attr('check', 'y');
  }
  renderFoot();
}
if (isIframe()) {
  $header.find('.h_go_home').remove();
}
async function hdUp(files) {
  maskLoading.start();
  let rep = true;
  let state = true;
  for (let i = 0; i < files.length; i++) {
    let { name, size, webkitRelativePath } = files[i];
    let path = fileUrl;
    if (webkitRelativePath) {
      path = `${path}/${webkitRelativePath}`;
    } else {
      path = `${path}/${name}`;
    }
    path = hdPath(path);
    let pro = new UpProgress(name);
    if (size == 0) {
      pro.fail();
      _msg.error(`不能上传空文件`);
      continue;
    }
    const res = await _postAjax('/file/repeatfile', { path });
    if (state) {
      if (res.code == 0) {
        state = false;
        const type = await _pop.p({
          top: true,
          text: '覆盖重名文件？',
          cancel: { text: '跳过' },
        });
        if (type == 'confirm') {
          rep = true;
        } else {
          rep = false;
        }
      }
    }
    if (!rep && res.code == 0) {
      pro.close('跳过重名文件');
      continue;
    }
    try {
      //文件切片
      let { chunks, count, suffix, HASH } = await fileSlice(
        files[i],
        (percent) => {
          pro.loading(percent);
        }
      );
      let breakpointarr = (await _postAjax('/file/breakpoint', { HASH })).data; //断点续传

      function compale(index) {
        pro.update(index / count);
      }
      let index = breakpointarr.length;
      compale(index);
      for (let j = 0; j < chunks.length; j++) {
        let { filename, file } = chunks[j];
        if (breakpointarr.includes(filename)) {
          continue;
        }
        await _upFile(
          {
            url: `/file/up`,
            param: { name: filename, HASH },
          },
          file
        );
        index++;
        compale(index);
      }

      let aa = await _postAjax(
        '/file/mergefile',
        {
          HASH,
          count,
          path,
        },
        {
          timeout: 0,
        }
      ); //合并切片
      if (parseInt(aa.code) === 0) {
        pro.close();
      } else {
        pro.fail();
      }
    } catch (error) {
      pro.fail();
    }
  }
  maskLoading.end();
  openDir();
}
$header
  .on('click', '.h_showmodel_btn', function () {
    fileShowGrid = !fileShowGrid;
    _setData('fileShowGrid', fileShowGrid);
    changeListShowModel();
  })
  .on('click', '.h_search_btn', function () {
    if ($search.is(':hidden')) {
      setPageScrollTop(0);
      openSearch();
    } else {
      closeSearch();
    }
  })
  .on('click', '.h_go_home', function () {
    myOpen('/');
  })
  .on('click', '.h_check_item_btn', function () {
    if ($footer.is(':hidden')) {
      startCheck();
    } else {
      closeCheck();
    }
  })
  .on('click', '.h_upload_btn', function (e) {
    let data = [
      { id: 1, text: '上传文件', beforeIcon: 'iconfont icon-24gl-fileText' },
      {
        id: 2,
        text: '上传文件夹',
        beforeIcon: 'iconfont icon-24gl-folder',
      },
    ];
    selectMenu(
      e,
      data,
      async ({ close, id }) => {
        if (id == 1) {
          const files = await getFiles({
            multiple: true,
          });
          if (files.length == 0) return;
          hdUp(files);
          close();
        } else if (id == 2) {
          const files = await getFiles({
            webkitdirectory: true,
          });
          if (files.length == 0) return;
          hdUp(files);
          close();
        }
      },
      '上传选项'
    );
  })
  .on('click', '.h_add_item_btn', function (e) {
    let data = [
      { id: 1, text: '新建文本', beforeIcon: 'iconfont icon-24gl-fileText' },
      {
        id: 2,
        text: '新建文件夹',
        beforeIcon: 'iconfont icon-24gl-folder',
      },
    ];
    selectMenu(
      e,
      data,
      async ({ e, id }) => {
        if (id == 1) {
          inpMenu(
            e,
            {
              subText: '提交',
              items: {
                name: {
                  placeholder: '文件名',
                  verify(val) {
                    if (val.trim() == '') {
                      return '请输入名称';
                    } else if (!isFilename(val.trim())) {
                      return '名称包含了不允许的特殊字符';
                    }
                  },
                },
              },
            },
            debounce(
              async function ({ close, inp }) {
                try {
                  let name = hdFilename(inp.name);
                  const res = await _postAjax('/file/addfile', {
                    path: fileUrl,
                    name,
                  });
                  if (res.code == 0) {
                    _msg.success(res.codeText);
                    openDir();
                    openFile('', fileUrl + '/' + name);
                    close(1);
                  }
                } catch (error) {}
              },
              500,
              true
            ),
            '新建文本'
          );
        } else if (id == 2) {
          inpMenu(
            e,
            {
              subText: '提交',
              items: {
                name: {
                  placeholder: '文件夹名',
                  verify(val) {
                    if (val.trim() == '') {
                      return '请输入名称';
                    } else if (!isFilename(val.trim())) {
                      return '名称包含了不允许的特殊字符';
                    }
                  },
                },
              },
            },
            debounce(
              async function ({ close, inp }) {
                try {
                  let name = inp.name;
                  const res = await _postAjax('/file/adddir', {
                    path: fileUrl,
                    name,
                  });
                  if (res.code == 0) {
                    _msg.success(res.codeText);
                    openDir();
                    close(1);
                  }
                } catch (error) {}
              },
              500,
              true
            ),
            '新建文件夹'
          );
        }
      },
      '新建选项'
    );
  })
  .on('click', '.h_sort_btn', function (e) {
    const { type, isDes } = fileSort;
    let data = [
      {
        id: '1',
        text: '名称排序',
        param: { value: 'name' },
      },
      {
        id: '2',
        text: '时间排序',
        param: { value: 'time' },
      },
      {
        id: '3',
        text: '大小排序',
        param: { value: 'size' },
      },
      {
        id: '4',
        text: '类别排序',
        param: { value: 'type' },
      },
      {
        id: '5',
        text: '升序',
        param: { value: false },
        beforeIcon: 'iconfont icon-jiantou_qiehuanxiangshang',
      },
      {
        id: '6',
        text: '降序',
        param: { value: true },
        beforeIcon: 'iconfont icon-jiantou_qiehuanxiangxia',
      },
    ];
    data.forEach((item) => {
      if (item.param.value === isDes || item.param.value === type) {
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
          if (id > 0 && id <= 4) {
            fileSort.type = param.value;
          } else {
            fileSort.isDes = param.value;
          }
          close();
          pageNo = 1;
          renderList(1);
          _setData('fileSort', fileSort);
        }
      },
      '选择列表排序方式'
    );
  })
  .on('click', '.paste_btn', function () {
    const { type, data } = waitObj;
    if (type == 'copy') {
      hdCopy(data);
    } else if (type == 'cut') {
      hdCut(data);
    }
  });
async function hdCopy(data, cb) {
  try {
    if (
      !data.every((item) => {
        const { path, name } = item;
        const f = hdPath(`${path}/${name}`);
        const t = hdPath(`${fileUrl}/${name}`);
        return !isParentDir(f, t);
      })
    ) {
      _msg.error('无效操作');
      return;
    }
    const res = await _postAjax(
      '/file/copy',
      { data, path: fileUrl },
      { timeout: 0 }
    );
    if (res.code == 0) {
      _msg.success(res.codeText);
      openDir();
      hidePaste();
      cb && cb();
    }
  } catch (error) {}
}
async function hdCut(data, cb) {
  try {
    if (
      !data.every((item) => {
        const { path, name } = item;
        const f = hdPath(`${path}/${name}`);
        const t = hdPath(`${fileUrl}/${name}`);
        return f !== t && !isParentDir(f, t);
      })
    ) {
      _msg.error('无效操作');
      return;
    }
    const res = await _postAjax('/file/move', { data, path: fileUrl });
    if (res.code == 0) {
      _msg.success(res.codeText);
      openDir();
      hidePaste();
      cb && cb();
    }
  } catch (error) {}
}
function getCheckItem() {
  const $cItem = $contentWrap.find('.file_item');
  return $cItem.filter(
    (_, item) => $(item).find('.check_state').attr('check') == 'y'
  );
}
function getCheckDatas() {
  let arr = [];
  getCheckItem().each((_, item) => {
    arr.push(getFileItem($(item).data('id')));
  });
  return arr;
}

function startCheck() {
  isChecking = true;
  const $cItem = $contentWrap.find('.check_state');
  $cItem
    .css({
      display: 'block',
      'background-color': 'transparent',
    })
    .attr('check', 'n');
  renderFoot();
  $footer.stop().slideDown(_speed);
}
function closeCheck() {
  isChecking = false;
  const $cItem = $contentWrap.find('.check_state');
  $cItem.css('display', 'none');
  $footer.stop().slideUp(_speed);
}
function renderFoot() {
  const items = $contentWrap.find('.file_item');
  const checkData = getCheckDatas();
  const len = checkData.length;
  let str = `<span cursor data-check="${
    items.length == len ? 'y' : 'n'
  }" class="iconfont ${
    items.length == len ? 'icon-xuanzeyixuanze' : 'icon-xuanzeweixuanze'
  }"></span>`;
  if (!$footer.is(':hidden')) {
    _msg.botMsg(`选中：${len}项`);
  }
  if (len > 0) {
    str += `
    <button cursor class="f_copy btn btn_primary">复制</button>
    <button cursor class="f_cut btn btn_primary">剪切</button>
    `;
    if (len == 1) {
      str += `<button cursor class="f_share btn btn_primary">分享</button>`;
      str += `<button cursor class="f_rename btn btn_primary">重命名</button>
      `;
      if (getSuffix(checkData[0].name)[1].toLowerCase() == 'zip') {
        str += `<button cursor class="f_decompress btn btn_primary">解压缩</button>`;
      } else {
        str += `<button cursor class="f_compress btn btn_primary">压缩</button>`;
      }
    }
    if (checkData.every((item) => item.type == 'file')) {
      str += `<button cursor class="f_download btn btn_primary">下载</button>`;
    }
    str += `<button cursor class="f_delete btn btn_danger">删除</button>`;
  }
  str += `<button cursor class="f_close btn btn_info">取消</button>`;
  $footer.find('.container').html(str);
}
$footer
  .on('click', 'span', function () {
    const $this = $(this);
    const $items = $contentWrap.find('.file_item');
    if ($this.data('check') == 'y') {
      $items
        .find('.check_state')
        .css({
          'background-color': 'transparent',
        })
        .attr('check', 'n');
      renderFoot();
    } else {
      $items
        .find('.check_state')
        .css({
          'background-color': _d.checkColor,
        })
        .attr('check', 'y');
      renderFoot();
    }
  })
  .on('click', '.f_download', function () {
    getCheckDatas().forEach((item) => {
      const { name, path, type } = item;
      if (type == 'file') {
        downloadFile(getFilePath(`/file/${path}/${name}`), name);
      }
    });
  })
  .on('click', '.f_copy', function () {
    waitObj = {
      type: 'copy',
      data: getCheckDatas(),
    };
    showPaste();
    closeCheck();
  })
  .on('click', '.f_cut', function () {
    waitObj = {
      type: 'cut',
      data: getCheckDatas(),
    };
    showPaste();
    closeCheck();
  })
  .on('click', '.f_rename', function (e) {
    const obj = getCheckDatas()[0];
    hdRename(e, obj);
  })
  .on('click', '.f_close', function (e) {
    closeCheck();
  })
  .on('click', '.f_delete', function (e) {
    hdDel(e, getCheckDatas());
  })
  .on('click', '.f_compress', function (e) {
    hdCompress(e, getCheckDatas()[0]);
  })
  .on('click', '.f_decompress', function (e) {
    hdDeCompress(e, getCheckDatas()[0]);
  })
  .on('click', '.f_share', function (e) {
    hdShare(e, getCheckDatas()[0]);
  });
function hdDel(e, arr, cb) {
  let text = '';
  if (arr.length == 1) {
    text = arr[0].name;
  }
  _pop(
    {
      e,
      text: `确认删除${text ? `：${text}` : '选中文件'}？`,
      confirm: { type: 'danger', text: '删除' },
    },
    async (type) => {
      if (type == 'confirm') {
        try {
          const res = await _postAjax('/file/delete', { data: arr });
          if (res.code == 0) {
            _msg.success(res.codeText);
            openDir();
            cb && cb();
          }
        } catch (error) {}
      }
    }
  );
}
function hdRename(e, obj, cb) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        name: {
          placeholder: `${obj.type == 'file' ? '文件名' : '文件夹名'}`,
          value: obj.name,
          verify(val) {
            if (val.trim() == '') {
              return '请输入名称';
            } else if (!isFilename(val.trim())) {
              return '名称包含了不允许的特殊字符';
            }
          },
        },
      },
    },
    debounce(
      async function ({ close, inp }) {
        try {
          let name = inp.name;
          const res = await _postAjax('/file/rename', { data: obj, name });
          if (res.code == 0) {
            openDir();
            close();
            cb && cb();
            _msg.success(res.codeText);
          }
        } catch (error) {}
      },
      500,
      true
    ),
    `重命名${obj.type == 'file' ? '文件' : '文件夹'}`
  );
}
function showPaste() {
  $header.find('.paste_btn').css('display', 'block');
}
function hidePaste() {
  $header.find('.paste_btn').css('display', 'none');
}
