import { _mySlide, encodeHtml, hdPath } from '../../../js/utils/utils';
import './index.less';
let pathArr = [];
let target = null;
let callback = null;
function renderCrumb() {
  let str = `<i cursor class="back iconfont icon-chexiao"></i>
  <span cursor class='home'>主页</span>`;
  pathArr.forEach((item, idx) => {
    str += `<span cursor data-idx="${idx + 1}">${encodeHtml(item)}</span>`;
  });
  target.innerHTML = str;
}
function bind(el, cb) {
  callback = cb;
  target = el;
  el.classList.add('crumb');
  el.addEventListener('click', hdClick);
}
function hdClick(e) {
  const target = e.target;
  const tag = target.tagName.toLowerCase();
  if (tag == 'i' || tag == 'span') {
    if (tag == 'i') {
      if (pathArr.length == 0) return;
      pathArr.pop();
    } else if (tag == 'span') {
      if (target.className == 'home') {
        pathArr = [];
      } else {
        const idx = +target.dataset.idx;
        pathArr = pathArr.slice(0, idx);
      }
    }
    callback && callback(getPath());
    renderCrumb();
  } else if (this == target) {
    editPath();
  }
}
function rightSlide() {
  if (pathArr.length == 0) return;
  pathArr.pop();
  callback && callback(getPath());
  renderCrumb();
}
_mySlide({
  el: '.content_wrap',
  right: rightSlide,
});
_mySlide({
  el: '.crumb_box',
  right: rightSlide,
});
const oInp = document.createElement('input');
oInp.addEventListener('blur', function () {
  if (getPath() != this.value.trim()) {
    setPath(this.value.trim());
    callback && callback(getPath());
    return;
  }
  renderCrumb();
});
oInp.addEventListener('keyup', function (e) {
  if (e.key == 'Enter') {
    this.blur();
  }
});
function editPath() {
  oInp.value = getPath();
  target.innerHTML = '';
  target.appendChild(oInp);
  oInp.focus();
}
function getPath() {
  return hdPath('/' + pathArr.join('/'));
}
function setPath(p) {
  pathArr = p.split('/').filter((item) => item);
  renderCrumb();
}
const curmb = {
  bind,
  getPath,
  setPath,
};
export default curmb;
