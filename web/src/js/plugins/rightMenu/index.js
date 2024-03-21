import { LevelObj } from '../../common/config';
import {
  ContentScroll,
  _getTarget,
  _position,
  encodeHtml,
  myDrag,
  toCenter,
  wrapInput,
} from '../../utils/utils';
import _pop from '../popConfirm';
import './index.less';
// 右键菜单
let arr = [];
function rightM(opt) {
  class RightM {
    constructor(opt) {
      let {
        e,
        html,
        trigger,
        renderAfter,
        closeBefore,
        title,
        stopClose,
        isMask,
      } = opt;
      this.title = title;
      this.trigger = trigger;
      this.stopClose = stopClose;
      this.isMask = isMask;
      this.html = html;
      this.renderAfter = renderAfter;
      this.closeBefore = closeBefore;
      this.e = e;
      this.init();
    }
    init() {
      this.box = document.createElement('div');
      this.box.className = 'right_mask';
      if (this.isMask) {
        this.box.style.transition = '0s';
        this.box.style.backgroundColor = 'var(--color10)';
      }
      this.box.style.zIndex = LevelObj.rightBox;

      this.rightBox = document.createElement('div');
      this.rightBox.className = 'right_box';
      this.head = document.createElement('div');
      this.head.className = 'head';
      if (!this.stopClose) {
        this.hClose = document.createElement('div');
        this.hClose.className = `iconfont icon-guanbi close`;
        this.hClose.setAttribute('cursor', '');
        this.head.appendChild(this.hClose);
      }
      this.fillBox = document.createElement('div');
      this.fillBox.className = 'fill_box';
      this.fillBox.innerHTML = '<div class="scroll_text jzxz"></div>';
      this.head.appendChild(this.fillBox);
      this.mtc = document.createElement('div');
      this.mtc.className = 'mtc';
      this.rightBox.appendChild(this.head);
      this.rightBox.appendChild(this.mtc);
      this.box.appendChild(this.rightBox);
      document.body.appendChild(this.box);
      this.contentScroll = new ContentScroll(
        this.fillBox.querySelector('.scroll_text')
      );
      this.contentScroll.init(this.title);
      this.dragClose = myDrag({
        trigger: this.fillBox,
        target: this.rightBox,
        down({ target }) {
          target.style.transition = '0s';
        },
        up({ target, x, y }) {
          target.style.transition = '0.5s ease-in-out';
          let h = window.innerHeight;
          if (y <= 0 || y >= h) {
            // toCenter(target);
            const { x, y } = target._op;
            target.style.top = y + 'px';
            target.style.left = x + 'px';
          } else {
            target._op = { x, y };
          }
        },
      });
      this.renderList(this.html);
      this.hdPosition(this.e);
      this.newHdClick = this.hdClick.bind(this);
      this.newHdKeyup = this.hdKeyup.bind(this);
      this.box.addEventListener('click', this.newHdClick);
      this.box.addEventListener('keyup', this.newHdKeyup);
      this.box.style.opacity = 1;
    }
    renderList(html) {
      this.mtc.innerHTML = html;
      this.inputs = this.mtc.querySelectorAll('input,textarea');
      this.initInpValue = this.getInpValue();
      this.renderAfter && this.renderAfter.call(this);
    }
    hdPosition(e) {
      let ww = window.innerWidth;
      if (!e) {
        toCenter(this.rightBox);
        return;
      }
      let h = window.innerHeight,
        mtw = this.rightBox.offsetWidth,
        mth = this.rightBox.offsetHeight,
        x = e.clientX,
        y = e.clientY;
      x < ww / 2 ? null : (x = x - mtw);
      y < h / 2 ? null : (y = y - mth);
      x < 0 ? (x = 0) : x + mtw > ww ? (x = ww - mtw) : null;
      y < 0 ? (y = 0) : y + mth > h ? (y = h - mth) : null;
      this.rightBox.style.top = y + 'px';
      this.rightBox.style.left = x + 'px';
      this.rightBox._op = { x, y };
    }
    getInpValue() {
      return [...this.inputs].map((item) => item.value.trim());
    }
    hdClick(e) {
      if (e.target === this.box) {
        if (this.stopClose) return;
        let curInpValue = this.getInpValue();
        if (
          curInpValue.every((item) => item == '') ||
          this.initInpValue.toString() == curInpValue.toString()
        ) {
          this.closeAll();
        } else {
          _pop({ e, text: '关闭输入框？' }, (type) => {
            if (type == 'confirm') {
              this.closeAll();
            }
          });
        }
        return;
      } else if (e.target == this.hClose) {
        if (this.stopClose) return;
        this.close();
        return;
      }
      let newClose = this.close.bind(this);
      this.trigger && this.trigger.call(this, { e, close: newClose });
    }
    hdKeyup(e) {
      const tag = e.target.tagName.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      if (
        (tag === 'input' && e.key === 'Enter') ||
        (tag === 'textarea' && ctrl && e.key === 'Enter')
      ) {
        e.preventDefault();
        this.box.querySelector('button').click();
      }
    }
    closeAll() {
      arr.forEach((item) => {
        item.close();
      });
    }
    close(all) {
      if (all) {
        this.closeAll();
        return;
      }
      this.closeBefore && this.closeBefore();
      arr = arr.filter((item) => item !== this);
      this.dragClose();
      this.contentScroll.close();
      this.box.removeEventListener('click', this.newHdClick);
      this.box.removeEventListener('keyup', this.newHdKeyup);
      this.box.remove();
    }
  }
  let r = new RightM(opt);
  arr.push(r);
  return r;
}
export function inpMenu(e, data, callback, title = '', stopClose, isMask) {
  let str = '';
  let wrapInputList = [];
  const { subText = '提交', items } = data;
  const list = Object.keys(items);
  list.forEach((item) => {
    let {
      type = 'input',
      placeholder = '',
      value = '',
      inputType = 'text',
      beforeText = '',
    } = items[item];
    value += '';
    if (type == 'input') {
      str += `
      <div class="inp_item">
      ${beforeText ? `<div class="title">${encodeHtml(beforeText)}</div>` : ''}
        <div class="inp_box">
        <input class='inp' data-flag="${item}" autocomplete="off" placeholder="${placeholder}" value="${encodeHtml(
        value
      )}" type="${inputType}">
          <i cursor class="clean_btn iconfont icon-guanbi ${
            value.trim() == '' ? '' : 'show'
          }"></i>
        </div>
        <p class='err'></p>
      </div>
      `;
    } else if (type == 'textarea') {
      str += `
      <div class='texta_item'>
      ${beforeText ? `<div class="title">${encodeHtml(beforeText)}</div>` : ''}
      <div class='texta_box'>
      <textarea title='Ctrl+Enter ${subText}' class='texta' data-flag="${item}" autocomplete="off" placeholder="${placeholder}">${encodeHtml(
        value
      )}</textarea>
      <i cursor class="clean_btn iconfont icon-15qingkong-1 ${
        value.trim() == '' ? '' : 'show'
      }"></i>
      </div>
      <p class='err'></p>
      </div>
      `;
    }
  });
  str += `<button cursor class="mtcbtn">${subText}</button>`;
  rightM({
    e,
    title,
    stopClose,
    isMask,
    html: str,
    closeBefore() {
      wrapInputList.forEach((item) => {
        item.unBind();
      });
    },
    renderAfter() {
      [...this.inputs].forEach((item) => {
        const key = item.dataset.flag;
        const verify = data.items[key].verify;
        const inpBox = item.parentNode;
        const inpItem = inpBox.parentNode;
        const cleanBtn = inpItem.querySelector('.clean_btn');
        const err = inpItem.querySelector('.err');
        let wInput = wrapInput(item, {
          change(val) {
            if (val.trim() == '') {
              cleanBtn.classList.remove('show');
            } else {
              cleanBtn.classList.add('show');
            }
          },
          focus() {
            inpBox.classList.add('focus');
          },
          blur() {
            inpBox.classList.remove('focus');
            let errText = '';
            if (verify) {
              errText = verify(wInput.getValue()) || '';
            }
            err.innerText = errText;
          },
        });
        wrapInputList.push(wInput);
      });
    },
    trigger({ e, close }) {
      const cleanBtn = _getTarget(this.mtc, e, '.clean_btn');
      const mtcBtn = _getTarget(this.mtc, e, '.mtcbtn');
      if (mtcBtn) {
        const inp = {};
        const arr = [];
        [...this.inputs].forEach((item) => {
          const err = item.parentNode.parentNode.querySelector('.err');
          const key = item.dataset.flag;
          inp[key] = item.value.trim();
          const verify = data.items[key].verify;
          let errText = '';
          if (verify) {
            errText = verify(inp[key]) || '';
          }
          err.innerText = errText;
          arr.push(err);
        });
        if (arr.every((item) => item.innerText == '')) {
          if (!e.isTrusted) {
            e = null;
          }
          callback && callback({ e, inp, close });
        }
      } else if (cleanBtn) {
        let inp = cleanBtn.parentNode.firstElementChild;
        inp.value = '';
        inp.focus();
        cleanBtn.classList.remove('show');
      }
    },
  });
}
function render(data) {
  let str = '';
  data.forEach((item) => {
    const {
      id,
      text = '',
      afterIcon = '',
      afterText = '',
      beforeText = '',
      beforeIcon = beforeText ? '' : 'icon iconfont icon-shoucang',
      active = false,
      pointer = true,
    } = item;
    str += `<div data-id='${encodeHtml(id)}' ${
      pointer ? 'cursor' : ''
    } class='item ${active ? 'active' : ''} ${pointer ? '' : 'stop'}'>
      ${beforeIcon ? `<i class="icon ${beforeIcon}"></i>` : ''}
      ${beforeText ? `<i class="title">${encodeHtml(beforeText)}</i>` : ''}
      <span class='text'>${encodeHtml(text)}</span>
      ${afterText ? `<i class="title">${encodeHtml(afterText)}</i>` : ''}
      ${afterIcon ? `<i class="icon ${afterIcon}"></i>` : ''}
    </div>`;
  });
  return str;
}
export function selectMenu(e, data, callback, title = '') {
  function resetMenu(da) {
    let html = render(da);
    r.renderList(html);
  }
  let html = render(data);
  let isOnce = false;
  const r = rightM({
    e,
    html,
    title,
    renderAfter() {
      if (isOnce) return;
      isOnce = true;
      const items = this.mtc.querySelectorAll('.item');
      const curIdx = data.findIndex((item) => item.active);
      if (curIdx < 0) return;
      const cur = items[curIdx];
      if (cur) {
        let t = _position(cur).top;
        this.mtc.scrollTop = t;
      }
    },
    trigger({ e, close }) {
      const item = _getTarget(this.mtc, e, '.item');
      if (item) {
        const id = item.dataset.id;
        const d = data.find((item) => item.id == id);
        callback && callback({ e, close, resetMenu, id, param: d.param || {} });
      }
    },
  });
}
export function rightMenu(e, html, callback, title = '') {
  let isOnce = false;
  rightM({
    e,
    title,
    html,
    renderAfter() {
      if (isOnce) return;
      isOnce = true;
      const items = this.mtc.querySelectorAll('.item');
      const cur = Array.prototype.find.call(items, (item) =>
        item.className.includes('active')
      );
      if (cur) {
        let t = _position(cur).top;
        this.mtc.scrollTop = t;
      }
    },
    trigger({ e, close }) {
      callback && callback({ e, close, box: this.mtc });
    },
  });
}
