import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import $ from 'jquery';
import md5 from 'md5';
import './coloured.js';
import {
  myOpen,
  _setData,
  _getData,
  _postAjax,
  _getAjax,
  darkMode,
  wrapInput,
  _setTimeout,
} from '../../js/utils/utils';
import { _speed } from '../../js/common/config';
import validateImg from './validate';
import '../../js/common/common.js';
import _msg from '../../js/plugins/message';
const $box = $('.box'),
  $register = $box.find('.register'),
  $darkState = $box.find('.dark_state'),
  $loading = $('.loading'),
  $submit = $box.find('.submit'),
  $account = $box.find('.account input'),
  $accountErr = $box.find('.account p'),
  $password = $box.find('.password input'),
  $repassword = $box.find('.repassword input'),
  $passwordErr = $box.find('.repassword p'),
  $showPd = $box.find('.show_pd'),
  $nopd = $box.find('.nopd'),
  $ratify = $('#ratify'),
  $about = $box.find('.about');
$about.on('click', function () {
  myOpen('/note/?v=about');
});
if (_getData('account')) {
  myOpen('/');
}
const accInp = wrapInput($account[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $account.next().css('display', 'none');
    } else {
      $account.next().css('display', 'block');
    }
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    checkUserName();
    $(target).parent().removeClass('focus');
  },
});
const pdInp = wrapInput($password[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $password.next().css('display', 'none');
    } else {
      $password.next().css('display', 'block');
    }
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    $(target).parent().removeClass('focus');
  },
});
const rePdInp = wrapInput($repassword[0], {
  change(val) {
    val = val.trim();
    if (val == '') {
      $repassword.next().css('display', 'none');
    } else {
      $repassword.next().css('display', 'block');
    }
  },
  focus(target) {
    $(target).parent().addClass('focus');
  },
  blur(target) {
    checkPassword();
    $(target).parent().removeClass('focus');
  },
});
let code = '';
function hdNopdLogin() {
  if (code) {
    _postAjax('/user/codelogin', { code })
      .then((res) => {
        if (res.code == 0) {
          const { username, account } = res.data;
          _setData('username', username);
          _setData('uname', username);
          _setData('account', account);
          myOpen(_getData('originurl'));
          return;
        }
        return Promise.reject();
      })
      .catch((err) => {
        _setTimeout(hdNopdLogin, 1000);
      });
  }
}
$nopd.on('click', function () {
  code = Math.random().toFixed(6).slice(2);
  $ratify
    .css('display', 'flex')
    .find('.code_box')
    .stop()
    .fadeIn(_speed)
    .find('.code span')
    .text(code);
  hdNopdLogin();
});
$ratify.on('click', '.close', function () {
  $ratify.css('display', 'none').find('.code_box').css('display', 'none');
  code = '';
});
window.addEventListener('load', function () {
  $box.addClass('open');
});
accInp.setValue(_getData('username'));
_getAjax('/user/isregister')
  .then((res) => {
    if (res.code == 0) {
      if (res.data == 'y') {
        $register.css('display', 'block');
      }
    }
  })
  .catch(() => {});
let showpd = _getData('showpd');
function hdShowPd() {
  if (showpd == 'y') {
    $showPd.find('i').attr('class', 'iconfont icon-xuanzeyixuanze');
    $password.attr('type', 'text');
    $repassword.attr('type', 'text');
  } else {
    $showPd.find('i').attr('class', 'iconfont icon-xuanzeweixuanze');
    $password.attr('type', 'password');
    $repassword.attr('type', 'password');
  }
}
hdShowPd();
$showPd.on('click', function () {
  showpd = showpd == 'y' ? 'n' : 'y';
  _setData('showpd', showpd);
  hdShowPd();
});
let isLogin = true;
$register.on('click', () => {
  if (isLogin) {
    isLogin = false;
    $register.text('登录');
    $submit.text('注册');
    $repassword.parent().parent().css('display', 'block');
  } else {
    isLogin = true;
    $register.text('注册');
    $submit.text('登录');
    $repassword.parent().parent().css('display', 'none');
  }
});
let dark = _getData('dark');
$darkState.on('click', function () {
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
});
function changeTheme(flag) {
  dark = flag;
  if (dark == 'y') {
    $darkState.attr('class', 'dark_state iconfont icon-icon_yejian-yueliang');
  } else if (dark == 'n') {
    $darkState.attr('class', 'dark_state iconfont icon-taiyangtianqi');
  } else if (dark == 's') {
    $darkState.attr('class', 'dark_state iconfont icon-xianshiqi');
  }
  _setData('dark', dark);
  darkMode(dark);
}
window.changeTheme = changeTheme;
changeTheme(dark);
$box.on('keyup', function (e) {
  if (e.key === 'Enter') {
    $submit.click();
  }
});

$account.next().on('click', function () {
  accInp.setValue('');
  accInp.target.focus();
});
$repassword.next().on('click', function () {
  rePdInp.setValue('');
  rePdInp.target.focus();
});
$password.next().on('click', function () {
  pdInp.setValue('');
  pdInp.target.focus();
});
let _flag = true;
$submit.on('click', function () {
  let account = accInp.getValue().trim(),
    password = pdInp.getValue().trim();
  if (isLogin) {
    if (!checkUserName() || !_flag) return;
    _flag = false;
    validateImg(
      function () {
        _flag = true;
        let npd = {
          account: account,
          password: md5(password),
        };
        $loading.stop().fadeIn();
        _postAjax('/user/login', npd)
          .then((result) => {
            $loading.stop().fadeOut();
            if (parseInt(result.code) === 0) {
              _setData('username', npd.account);
              _setData('uname', npd.account);
              _setData('account', result.data);
              myOpen(_getData('originurl'));
            }
          })
          .catch((_) => {
            $loading.stop().fadeOut();
          });
      },
      function () {
        _msg.error('验证失败');
      }
    );
  } else {
    if (!checkUserName() || !checkPassword() || !_flag) return;
    _flag = false;
    validateImg(
      function () {
        _flag = true;
        let npd = {
          username: account,
          password: md5(password),
        };
        $loading.stop().fadeIn();
        _postAjax('/user/register', npd)
          .then((result) => {
            $loading.stop().fadeOut();
            if (parseInt(result.code) === 0) {
              _setData('username', npd.username);
              _setData('uname', npd.username);
              _setData('account', result.data);
              myOpen(_getData('originurl'));
            }
          })
          .catch((_) => {
            $loading.stop().fadeOut();
          });
      },
      function () {
        _msg.error('验证失败');
      }
    );
  }
});

function checkPassword() {
  let password = pdInp.getValue().trim(),
    repassword = rePdInp.getValue().trim();
  if (password !== repassword) {
    $passwordErr.text('密码不一致');
    return false;
  }
  $passwordErr.text('');
  return true;
}
function checkUserName() {
  let username = accInp.getValue().trim();
  if (username.length < 1 || username.length > 20) {
    $accountErr.text('请输入1-20位');
    return false;
  }
  $accountErr.text('');
  return true;
}
