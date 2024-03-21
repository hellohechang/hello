import { LevelObj } from '../../common/config';
import { debounce, playSound } from '../../utils/utils';
import imgBlop from '../../../images/img/blop.mp3';
import imgMsg from '../../../images/img/msg.mp3';
let msgArr = [];
let zIndex = LevelObj.msg;
class Msg {
  constructor(opt, callback) {
    this.message = opt.message;
    this.type = opt.type || 'info';
    this.callback = callback;
    this.duration = opt.duration || 4500;
    this.timer = null;
    this.init();
  }
  init() {
    this.render();
    this.show();
    this.bind();
  }
  render() {
    this.el = document.createElement('div');
    let t = '';
    switch (this.type) {
      case 'info':
        t = `color: #0c5460;background-color: #d1ecf1;border-color: #bee5eb;`;
        break;
      case 'success':
        t = `background-color: #d1e7dd;color: #146c43;border-color: #c3e6cb;`;
        break;
      case 'danger':
        t = `color: #721c24;background-color: #f8d7da;border-color: #f5c6cb;`;
        break;
      case 'warning':
        t = `color: #856404;background-color: #fff3cd;border-color: #ffeeba;`;
      default:
        break;
    }
    this.el.style.cssText = `
        display: flex;
        align-items: center;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 400px;
        opacity: 0;
        box-sizing: border-box;
        border-radius: 5px;
        line-height: 1.5;
        font-size: 16px;
        border: solid 1px;
        word-break: break-all;
        z-index: ${zIndex};
        ${t}`;
    this.oText = document.createElement('span');
    this.oText.style.cssText = `
        flex: auto;
        padding: 10px 0 10px 10px;
    `;
    if (this.callback) {
      this.oText.setAttribute('cursor', '');
    }
    this.oText.innerText = this.message;
    this.oClose = document.createElement('i');
    this.oClose.className = 'iconfont icon-guanbi';
    this.oClose.style.cssText = `
        flex: none;
        font-size: 20px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: var(--icon-color);
    `;
    this.oClose.setAttribute('cursor', '');
    this.el.appendChild(this.oText);
    this.el.appendChild(this.oClose);
  }
  bind() {
    this._hdEnter = this.hdEnter.bind(this);
    this._hdLeave = this.hdLeave.bind(this);
    this._hdClick = this.hdClick.bind(this);
    this.el.addEventListener('mouseenter', this._hdEnter);
    this.el.addEventListener('mouseleave', this._hdLeave);
    this.el.addEventListener('click', this._hdClick);
  }
  unbind() {
    this.el.removeEventListener('mouseenter', this._hdEnter);
    this.el.removeEventListener('mouseleave', this._hdLeave);
    this.el.removeEventListener('click', this._hdClick);
  }
  hdClick(e) {
    if (e.target == this.oText) {
      this.callback && this.callback('click');
    }
    this.close();
  }
  hdEnter(e) {
    this.oClose.style.color = 'var(--text-hover-color)';
    this.el.isCheck = true;
    this.el.style.zIndex = zIndex + 1;
    this.el.style.opacity = 1;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  hdLeave(e) {
    this.oClose.style.color = 'var(--icon-color)';
    this.el.style.zIndex = zIndex;
    this.el.style.opacity = 0.9;
    this.el.isCheck = false;
    this.hide();
  }
  show() {
    let top = 0;
    msgArr.forEach((item) => {
      top += item.offsetHeight + 20;
    });
    document.body.appendChild(this.el);
    msgArr.push(this.el);
    this.el.style.top = top + 'px';
    this.el.clientHeight;
    this.el.style.transition = '0.5s ease-in-out';
    this.el.style.marginTop = '20px';
    this.el.style.opacity = 0.9;
    this.hide();
  }
  hide() {
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      this.close();
    }, this.duration);
  }
  close() {
    this.unbind();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    let idx = msgArr.findIndex((item) => item === this.el);
    msgArr.splice(idx, 1);
    let h = this.el.offsetHeight + 20;
    this.el.style.transition = '.5s ease-in-out';
    this.el.style.marginTop = `-${h}px`;
    this.el.style.opacity = 0;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      this.el.remove();
      this.callback && this.callback('close');
    }, 500);
    msgArr.forEach((item, i) => {
      if (item.isCheck || i < idx) return;
      let t = parseInt(item.style.top);
      item.style.transition = '0.5s ease-in-out';
      item.style.top = t - h + 'px';
    });
  }
}
// 底部提示
const botMsg = (function () {
  let timer = null;
  let box = document.createElement('div'),
    textbox = document.createElement('div');
  box.style.cssText = `
      width: 100%;
      position: fixed;
      top: 20px;
      padding: 0 20px;
      box-sizing: border-box;
      transform: translateY(-100%);
      font-size: 18px;
      opacity: 0;
      text-align: right;
      z-index: ${zIndex};
      pointer-events: none;`;
  textbox.style.cssText = `
      display: inline-block;
      line-height: 1.5;
      overflow: hidden;
      font-weight: bold;
      box-sizing: border-box;
      padding: 10px;
      border-radius: 10px;
      color: var(--color);
      box-shadow: 0 0 5px var(--color5);
      background-color: var(--bg-color-o3);`;
  box.appendChild(textbox);
  document.body.appendChild(box);
  function mstc(str, again) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (!again) {
      box.style.transition = '0s';
      box.style.transform = 'translateY(-100%)';
      box.style.opacity = '0';
      box.clientWidth;
    }

    textbox.innerText = str;
    box.style.transition = '0.5s ease-in-out';
    box.style.transform = 'none';
    box.style.opacity = '1';

    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      box.style.transition = '1s ease-in-out';
      box.style.transform = 'translateY(-100%)';
      box.style.opacity = '0';
    }, 5000);
  }
  return mstc;
})();
function success(message = '操作成功', callback) {
  new Msg({ message, type: 'success' }, callback);
}
function error(message = '操作失败', callback) {
  new Msg({ message, type: 'danger', duration: 6000 }, callback);
}
function warning(message, callback) {
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') {
    _playSound(imgMsg);
  }
  // 页面变为可见时触发
  if (document.visibilityState == 'visible') {
    _playSound(imgBlop);
  }
  new Msg({ message, type: 'warning', duration: 8000 }, callback);
}
function info(message, callback) {
  new Msg({ message }, callback);
}
function msg(opt, callback) {
  new Msg(opt, callback);
}
const _playSound = debounce(playSound, 1000, true);
let _msg = {
  success,
  error,
  warning,
  info,
  msg,
  botMsg,
};

export default _msg;
