~async function () {
  let $mbg = $('.mbg'),
    $toplist = $('.toplist'),
    $searchinput = $('.toplist').find('input'),
    $menu = $('.menu'),
    $html = $(document.documentElement),
    urlparmes = queryURLParams(_myOpen());
  $showpage = $(".showpage");
  let $icon = $("link[rel*='icon']")
  document.addEventListener("visibilitychange", async function () {
    // 页面变为不可见时触发
    if (document.visibilityState == "hidden") {
      $icon.attr("href", "/img/icon.png");
    }
    // 页面变为可见时触发
    if (document.visibilityState == "visible") {
      $icon.attr("href", "/img/icon1.png");
    }
  });
  _setTimeout(() => {
    $toplist.addClass('open')
  }, 600)
  // 背景
  let url = `/img/bg.jpg`;
  imgjz(url, () => {
    $mbg.css({
      'background-image': `url('${url}')`,
      opacity: '1'
    });
  }, () => {
    $mbg.css({
      'background-image': `url('${url}')`,
      opacity: '1'
    });
  });
  // 渲染列表
  function renderlistdefault() {
    let str = '';
    new Array(50).fill(null).forEach(v => {
      str += `<ul style="pointer-events: none;height:20px;background-color: #ffffff5c;margin:6px" class="itemBox"></ul>`
    });
    $menu.html(str)
    $html.stop().animate({
      scrollTop: 0
    }, _speed)
  }
  function renderlist(y) {
    if (y) {
      renderlistdefault()
    }
    let pagenum = $menu.pagenum,
      a = $searchinput.val().trim();
    pagenum ? null : pagenum = 1;
    let showpage = _getData('nodeshowpage') || 20;
    _getAjax('/note/allsearchlist', { acc: urlparmes.HASH || '', a, page: pagenum, showpage }).then(result => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total,
          totalPage,
          data,
          pageNo } = result.data;
        $menu.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`
        } else {
          data.forEach(v => {
            let { name, id, con } = v;
            name = encodeHtml(name);
            str += `<ul class="itemBox" data-id="${id}" cursor x='${name}'>
                  <li class="logo iconfont icon-bijiben"></li>
                  <li title="${name}" class="noteitem">${name}</li>
                  <li title="Link" class="erweima iconfont icon-erweima"></li>
                  </ul>`
            if (con) {
              let [a, b, c] = con
              str += `<p>${encodeHtml(a)}<span style="color:red;">${encodeHtml(b)}</span>${encodeHtml(c)}</p>`
            }
          });
        }
        if (totalPage > 1) {
          str += `<div class="pagingbox">`;
          str += pagination({ pageNo, pageSize: showpage, total })
          str += `</div > `;
        }
        $menu.html(str)
        if (y) {
          $html.stop().animate({
            scrollTop: 0
          }, _speed)
        }
      }
    })
  }
  renderlist(true)
  $menu.on('click', '.noteitem', debounce(function () {
    let $this = $(this),
      a = $this.parent().attr('data-id'),
      name = $this.parent().attr('x'),
      val = $searchinput.val().trim();
    val = encodeURIComponent(val);
    _myOpen(`${sideURL}/page/note/?v=${a}${val ? "#" + val : ''}`, '_blank', name)
  }, 500)).on('click', '.erweima', debounce(function (e) {
    e.stopPropagation()
    let id = $(this).parent().attr('data-id')
    let url = `${sideURL}/page/note?v=${id}`
    makeCode(url)
  }, 500, true)).on('click', '.pagingbox', debounce(function (e) {
    let target = e.target,
      flag = target.getAttribute('data-flag');
    if (target.tagName === 'BUTTON') {
      if (flag === 'pre') {
        $menu.pagenum = $menu.pagenum || 1;
        $menu.pagenum--
        renderlist(true)
      } else if (flag === 'next') {
        $menu.pagenum = $menu.pagenum || 1;
        $menu.pagenum++
        renderlist(true)
      } else if (flag === 'go') {
        let val = document.querySelector('.pagingbox #paginationBox input').value.trim();
        val = parseInt(val)
        if (isNaN(val)) return;
        $menu.pagenum = val;
        renderlist(true)
      } else if (flag === 'gotop') {
        $html.stop().animate({
          scrollTop: 0
        }, _speed)
      } else {
        $menu.pagenum = +flag;
        renderlist(true)
      }
    }
  }, 500, true))
  // 搜索笔记
  $searchinput.on('input', debounce(function () {
    $menu.pagenum = 1;
    renderlist(true)
  }, 1000))
  ~function () {
    let p = 0, t = 0;
    window.addEventListener('scroll', throttle(function () {
      p = document.documentElement.scrollTop
      if (p <= 200) {
        t = p
        $toplist.addClass('open')
        return
      }
      if (p >= t) {
        $toplist.removeClass('open')
      } else {
        $toplist.addClass('open')
      }
      _setTimeout(() => {
        t = p
      })
    }, 500))
  }()
  $showpage.val(_getData('nodeshowpage') || 20)
  $showpage.on('change', function () {
    let val = $(this).val();
    _setData('nodeshowpage', val)
    if ($menu.pagenum == 1) {
      renderlist()
    } else {
      renderlist(true)
    }
  })
  // 二维码
  ~function () {
    let $codewrap = $('.codewrap'),
      $sharebox = $('.sharebox'),
      $getcode = $sharebox.find('.getcode'),
      $linkCheck = $sharebox.find('.linkCheck');
    var qrcode = new QRCode($getcode[0], {
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });

    function makeCode(url) {
      qrcode.makeCode(encodeURI(url));
      $linkCheck.val(url);
      $codewrap.stop().fadeIn(_speed);
    }
    $linkCheck.focus(function () {
      this.select();
    });
    $codewrap.click(function (e) {
      let $this = $(this);
      if (_getTarget(e, '.codewrap', 1)) {
        $this.stop().fadeOut(_speed)
      }
    })
    window.makeCode = makeCode
  }();
}()