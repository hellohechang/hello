import './index.less';
import { creatSelect, inputPageNo } from '../../utils/utils';
/*
 *pageNo:当前页
 *pageSize:每页展示多少条
 *total:一共多少条
 *continuous:连续页码条数
 */
class Pagination {
  constructor(el, opt) {
    this.el = el;
    this.change = opt.change;
    this.top = opt.top;
    this.sizeChange = opt.sizeChange;
    this.select = opt.select || [20, 40, 60, 80, 100, 200];
    this.pageNo = 1;
    this.pageSize = opt.pageSize || this.select[0];
    this.totalPage = 0;
    this.total = 0;
    this.continuous = 5;
    this.init();
  }
  init() {
    this.bindEvent();
  }
  bindEvent() {
    this._hdClick = this.hdClick.bind(this);
    this.el.addEventListener('click', this._hdClick);
  }
  unBind() {
    this.el.removeEventListener('click', this._hdClick);
  }
  hdChange() {
    this.pageNo < 1
      ? (this.pageNo = this.totalPage)
      : this.pageNo > this.totalPage
      ? (this.pageNo = 1)
      : null;
    this.change && this.change(this.pageNo);
  }
  hdClick(e) {
    const target = e.target,
      flag = target.getAttribute('data-flag');
    if (target.tagName.toLowerCase() === 'button') {
      if (flag === 'prev') {
        this.pageNo--;
        this.hdChange(target);
      } else if (flag === 'next') {
        this.pageNo++;
        this.hdChange();
      } else if (flag === 'go') {
        let val = this.el.querySelector('.paginationBox input').value.trim();
        val = parseInt(val);
        if (isNaN(val)) return;
        this.pageNo = Math.abs(val);
        this.hdChange();
      } else if (flag === 'top') {
        this.top && this.top();
      } else if (flag === 'getvalue') {
        inputPageNo(e, { value: this.pageNo }, (val) => {
          this.pageNo = val;
          this.hdChange();
        });
      } else if (flag === 'select') {
        creatSelect(
          e,
          { active: this.pageSize, data: this.select },
          ({ value, close }) => {
            this.sizeChange && this.sizeChange(value);
            close();
          }
        );
      } else {
        this.pageNo = +flag;
        this.hdChange();
      }
    }
  }
  render(opt, isSmall) {
    this.el.innerHTML = this.getHTML(opt, isSmall);
  }
  getHTML(opt, isSmall) {
    this.pageNo = opt.pageNo;
    this.pageSize = opt.pageSize || this.pageSize;
    this.total = opt.total || this.total;
    this.continuous = opt.continuous || this.continuous;
    this.pageNo = +this.pageNo;
    this.pageSize = +this.pageSize;
    this.total = +this.total;
    this.continuous = +this.continuous;
    this.totalPage = Math.ceil(this.total / this.pageSize);
    this.pageNo <= 0
      ? (this.pageNo = this.totalPage)
      : this.pageNo >= this.totalPage
      ? (this.pageNo = this.totalPage)
      : null;
    if (opt.total == 0) {
      return '';
    }
    if (isSmall) {
      let str = `<div class="paginationBox">
    <button cursor data-flag="prev" class="iconfont icon-prev"></button>
    <button cursor data-flag="getvalue">${this.pageNo} / ${
        this.totalPage
      }</button>
    <button cursor data-flag="next" class="iconfont icon-page-next"></button>
    ${
      this.select.length > 0
        ? `<button cursor data-flag="select">${this.pageSize}/页</button>`
        : ''
    }
    <span>共 ${this.total} 条</span>
    ${
      this.top
        ? '<button cursor data-flag="top" class="iconfont icon-up"></button>'
        : ''
    }
    </div>`;
      return str;
    }
    let startPage = this.pageNo - parseInt(this.continuous / 2),
      endPage = this.pageNo + parseInt(this.continuous / 2);
    if (this.totalPage > this.continuous) {
      startPage < 1 ? ((startPage = 1), (endPage = this.continuous)) : null;
      endPage > this.totalPage
        ? ((endPage = this.totalPage),
          (startPage = this.totalPage - this.continuous + 1))
        : null;
    } else {
      startPage = 1;
      endPage = this.totalPage;
    }
    let str = `<div class="paginationBox">`;
    str += `${
      this.pageNo > 1
        ? '<button cursor data-flag="prev" class="iconfont icon-prev"></button>'
        : ''
    }`;
    if (this.totalPage > this.continuous) {
      str += `${startPage > 1 ? '<button cursor data-flag="1">1</button>' : ''}
        ${startPage == 3 ? '<button cursor data-flag="2">2</button>' : ''}
        ${
          startPage > 3
            ? `<button cursor data-flag="${startPage - 1}">...</button>`
            : ''
        }`;
    }
    for (let i = startPage; i <= endPage; i++) {
      str += `<button cursor data-flag="${i}" class="${
        i == this.pageNo ? 'active' : ''
      }">${i}</button>`;
    }
    if (this.totalPage > this.continuous) {
      str += `${
        endPage < this.totalPage - 2
          ? `<button cursor data-flag="${endPage + 1}">...</button>`
          : ''
      }
        ${
          endPage == this.totalPage - 2
            ? `<button cursor data-flag="${this.totalPage - 1}">${
                this.totalPage - 1
              }</button>`
            : ''
        }
        ${
          endPage < this.totalPage
            ? `<button cursor data-flag="${this.totalPage}">${this.totalPage}</button>`
            : ''
        }`;
    }
    str += `${
      this.pageNo < this.totalPage
        ? '<button cursor data-flag="next" class="iconfont icon-page-next"></button>'
        : ''
    }`;
    if (this.select.length > 0) {
      // str += `<select>`;
      // this.select.forEach((item) => {
      //   str += `<option value="${item}" ${
      //     item == this.pageSize ? 'selected' : ''
      //   }>${item}/页</option>`;
      // });
      // str += `</select>`;
      str += `<button cursor data-flag="select">${this.pageSize}/页</button>`;
    }
    str += `<span>共 ${this.total} 条,</span>
  <input autocomplete="off" value="${this.pageNo}" type="number">
  <button cursor data-flag="go" class="iconfont icon-huaban"></button>
  ${
    this.top
      ? '<button cursor data-flag="top" class="iconfont icon-up"></button>'
      : ''
  }`;
    str += `</div>`;
    return str;
  }
}
function pagination(el, opt) {
  return new Pagination(el, opt);
}
export default pagination;
