import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import markdownItSub from 'markdown-it-sub'; // 下标
import markdownItSup from 'markdown-it-sup'; // 上标
import markdownItMark from 'markdown-it-mark'; // 高亮
import markdownItCheckbox from 'markdown-it-task-checkbox'; // 复选框
import imgLoadImg from '../../images/img/loadImg.png';
import { LazyLoad, _position } from './utils';
const md = new MarkdownIt({
  linkify: true,
  html: false,
  // highlight: function (str, lang) {
  //   const language = hljs.getLanguage(lang) ? lang : '';
  //   try {
  //     if (language) {
  //       return hljs.highlight(str, { language }).value;
  //     } else {
  //       return hljs.highlightAuto(str).value;
  //     }
  //   } catch (error) {
  //     return '';
  //   }
  // },
});
md.use(markdownItSub);
md.use(markdownItSup);
md.use(markdownItMark);
md.use(markdownItCheckbox, {
  disabled: true,
  divWrap: false,
  divClass: 'checkbox',
  idPrefix: 'cbx_',
  ulClass: 'task-list',
  liClass: 'task-list-item',
});
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('cursor', '');
  tokens[idx].attrSet('target', '_blank');
  return md.renderer.renderToken(tokens, idx, options, env, self);
};
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const srcItem = tokens[idx].attrs.find((item) => {
    return item[0] === 'src';
  });
  const src = srcItem[1];
  const alt = tokens[idx].content;
  return `<img cursor="" data-src="${src}" src="${imgLoadImg}" alt="${alt}" />`;
};
function render(el, str) {
  el.innerHTML = md.render(str);
  highlight(el);
}
const mdLazy = new LazyLoad();
function highlight(el) {
  mdLazy.bind(el.querySelectorAll('code'), (item) => {
    let c = item.className;
    if (/language-vue/gi.test(c)) {
      item.className = 'hljs language-javascript';
    }
    hljs.highlightElement(item);
  });
}
function unHighlight() {
  mdLazy.unBind();
}
const mdo = {
  render,
  highlight,
  unHighlight,
};
export default mdo;
