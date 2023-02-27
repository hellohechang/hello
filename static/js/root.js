~function () {
  let $userbox = $(".userbox"),
    $clearupload = $(".clearupload"),
    $clearchat = $(".clearchat"),
    $delmusicfile = $(".delmusicfile");

  render()
  function render() {
    _getAjax("/root/userlist", {}).then((result) => {
      if (parseInt(result.code) === 0) {
        result.data.sort((a, b) => b.time - a.time)
        let str = "";
        result.data.forEach(v => {
          let { account, username, time, email, state, online } = v;
          str += `<li data-acc="${account}" data-state="${state}">
              <span style="color:#992f2f;">[${newDate('{0}-{1}-{2} {3}:{4}', time)}]</span>
              <span style="color:${online === 'y' ? 'green' : '#aaa'};">${online === 'y' ? '在线' : '离线'}</span>
              <span style="color:#4494d5;">${encodeHtml(username)}(${account})${email ? `(${email})` : ''}</span>
              <button cursor class="deluser" style="${state == 0 ? '' : 'color:red;'}">${state == 0 ? '激活' : '关闭'}</button>
              <button cursor class="resetpd">重置密码</button>
              <button cursor class="tologin">登录</button>
              <button cursor class="delaccount">销毁</button>
            </li>`;
        })
        $userbox.html(str);
        return
      }
      _setTimeout(() => {
        _myOpen('/', false, 'Home')
      }, 2000)
    });
  }
  $userbox.on("click", ".deluser", function () {
    let $this = $(this),
      x = $this.parent().attr("data-acc"),
      state = $this.parent().attr("data-state"),
      flag = state == '0' ? '1' : '0'
    alert(`确认 ${state == 0 ? '关闭' : '激活'} ${x}？`, {
      confirm: true,
      handled: msg => {
        if (msg === "confirm") {
          _postAjax("/root/deluser", { ac: x, flag }).then((result) => {
            if (parseInt(result.code) === 0) {
              render()
            }
          });
          return
        }
      }
    })
  }).on("click", ".delaccount", function () {
    let $this = $(this),
      x = $this.parent().attr("data-acc");

    alert(`确认销毁：${x}？`, {
      confirm: true,
      handled: msg => {
        if (msg === "confirm") {
          _postAjax("/root/delaccount", { ac: x }).then((result) => {
            if (parseInt(result.code) === 0) {
              render()
            }
          });
          return
        }
      }
    })
  }).on('click', '.resetpd', function () {
    let x = $(this).parent().attr("data-acc");
    alert(`确认重置账号(${x})的密码？`, {
      confirm: true,
      handled: msg => {
        if (msg === "confirm") {
          _getAjax("/root/resetpass", { a: x }).then((result) => {
            if (parseInt(result.code) === 0) {
              _success(result.codeText);
            }
          });
        }
      }
    })
  }).on('click', '.tologin', function () {
    let x = $(this).parent().attr("data-acc");
    alert(`确认登录账号：${x}？`, {
      confirm: true,
      handled: msg => {
        if (msg === "confirm") {
          _postAjax("/root/loginother", { a: x }).then((result) => {
            if (parseInt(result.code) === 0) {
              _myOpen('/', false, 'Home')
            }
          });
        }
      }
    })
  })
  $clearupload.click(function () {
    alert("确认清空upload目录？", {
      confirm: true,
      handled: msg => {
        if (msg === "confirm") {
          _getAjax("/root/clearup", {}).then((result) => {
            if (parseInt(result.code) === 0) {
              _success(result.codeText)
            }
          });
          return
        }
      }
    })
  });
  $delmusicfile.click(function () {
    alert(`确认删除多余歌曲文件？`, {
      confirm: true,
      handled: m => {
        if (m !== 'confirm') return;
        _getAjax("/root/delmusicfile").then((result) => {
          if (parseInt(result.code) === 0) {
            _success(result.data)
            return
          }
        });
      }
    });
  });
  $clearchat.click(function () {
    alert(`确认清除已删除的聊天记录？`, {
      confirm: true,
      handled: m => {
        if (m !== 'confirm') return;
        _getAjax("/root/clearchatdata").then((result) => {
          if (parseInt(result.code) === 0) {
            _success(result.codeText)
            return
          }
        });
      }
    });
  });
}()