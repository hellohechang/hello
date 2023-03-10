~function () {
  let $totop = $('.totop'),
    $icon = $("link[rel*='icon']"),
    $html = $(document.documentElement),
    urlparmes = queryURLParams(myOpen()),
    $body = $('body'),
    HASH = urlparmes.HASH;
  document.addEventListener("visibilitychange", function () {
    // 页面变为不可见时触发
    if (document.visibilityState == "hidden") {
      $icon.attr("href", "/img/icon.png");
    }
    // 页面变为可见时触发
    if (document.visibilityState == "visible") {
      $icon.attr("href", "/img/icon1.png");
    }
  });
  $totop.click(function () {
    $html.stop().animate({
      scrollTop: 0
    }, _speed)
  })
  let $fsbg = $(".fsbg"),
    $notebotlist = $(".notebotlist"),
    $hicodeid = $('#hicode'),
    $markdown = $('.markdown'),
    $notetitle = $('.notetitle'),
    $pageSearch = $('.pageSearch'),
    $pageSearchOn = $('.pageSearchOn'),
    $pageSearchNum = $('.pageSearchNum'),
    $editnote = $('.editnote'),
    $from = $('.from'),
    editlistmdobj = {
      fontsz: 20,
      fontwe: 0,
      theme: 2
    },
    highlightnum = 0,
    $highlight = null;
  $editnote.click(debounce(function () {
    _myOpen(`/page/edit/#${urlparmes.v}`, 'Edit')
  }, 500))
  function notexuanrandefault() {
    let str = '';
    new Array(20).fill(null).forEach((v, i) => {
      let w = Math.round(Math.random() * (90 - 20) + 20);
      str += `<p style="pointer-events: none;background-color:#83818173;height:25px;width:100%;margin:15px 0;"></p>
            ${w % 2 === 0 ? '<p style="background-color:#83818173;height:25px;width:100%;margin:15px 0;"></p>' : ''}
            <p style="background-color:#83818173;height:25px;width:${w}%;margin:15px 0;"></p>
      `;
    });
    $markdown.html(str);
  }
  notexuanrandefault()
  if (urlparmes.v) {
    _getAjax('/note/getnote', { v: urlparmes.v }).then(result => {
      if (parseInt(result.code) === 0) {
        let { name, data, account, username, own } = result.data;
        $from._uobj = {
          account,
          username,
          own
        }
        let logoUrl = `${mediaURL}/logo/${account}/${account}.png`
        $from.find('.logo').attr('title', username).css('background-image', `url(${logoUrl})`)
        data = `# ${name}\n` + data
        // let str = marked.parse(data);
        let str = window.markdownit().render(data);
        $markdown.html(str)
        $('pre').append(`<div title="复制" cursor class="codeCopy iconfont icon-fuzhi"><div>`).prepend(`<div data-flag="y" cursor class="shrink iconfont icon-Down"><div>`)
        // hljs.initHighlightingOnLoad();
        hljs.highlightAll()
        BlogDirectory()
        $notetitle.text(name)
        $notebotlist.addClass('open')
        $html.stop().animate({
          scrollTop: 0
        }, _speed)
        if (HASH) {
          HASH = decodeURIComponent(HASH)
          $markdown.highlight(HASH);
          $highlight = $markdown.find("span.highlight"),
            _length = $highlight.length;
          highlightnum = 0;
          if (_length > 0) {
            $pageSearchOn.click();
            $pageSearch.find('.hinp').val(HASH)
            $pageSearchNum.html(`${highlightnum + 1}/${_length}`)
            highlightPosition(highlightnum)
          }
        }
        return
      }
      $markdown.html(result.codeText)
      $notebotlist.remove()
      $from.remove()
    })
  } else {
    $markdown.html('输入地址错误')
    $notebotlist.remove()
  }
  $from.find('.logo').click(debounce(function (e) {
    let { account, username, own } = $from._uobj;
    let str = `<div cursor class="mtcitem" style="justify-content: center;">${username}</div>
    <div cursor class="mtcitem1">查看更多</div>`
    rightMenu.open(e, str, debounce(function (e) {
      if (_getTarget(e, '.mtcitem1')) {
        let url = `/page/allnote/#${account}`
        if (own === 'y') {
          url = `/page/notes/`
        }
        _myOpen(url, username)
        rightMenu.close()
      } else if (_getTarget(e, '.mtcitem')) {
        imgPreview(`${mediaURL}/logo/${account}/${account}.png`)
      }
    }, 1000, true))
  }, 500, true))
  $markdown.on('click', '.codeCopy', debounce(function () {
    let str = $(this).parent().find('code').text();
    copyText(str)
  }, 500, true)).on('click', '.shrink', debounce(function () {
    let $this = $(this)
    let flag = $this.attr('data-flag')
    if (flag === 'y') {
      $this.attr({
        'data-flag': 'n',
        class: 'shrink iconfont icon-page-next'
      })
      $this.parent().find('code').stop().hide()
    } else {
      $this.attr({
        'data-flag': 'y',
        class: 'shrink iconfont icon-Down'
      })
      $this.parent().find('code').stop().show()
    }
  }, 500, true))
  $pageSearch.click((e) => {
    let target = e.target,
      $highlight = $markdown.find("span.highlight"),
      _length = $highlight.length;
    if (target.tagName === 'DIV') {
      if ($(target).attr('flag') === 'x') {
        $pageSearch.css('display', 'none')
        $markdown.removeHighlight()
        highlightnum = 0;
        $pageSearch.find('.hinp').val('')
        $pageSearchNum.text('')
      } else {
        if (_length === 0) return;
        if ($(target).attr('flag') === 'next') {
          highlightnum++;
        } else if ($(target).attr('flag') === 'pre') {
          highlightnum--;
        }
        highlightnum >= _length ? highlightnum = 0 : (highlightnum < 0 ? highlightnum = _length - 1 : null);
        $pageSearchNum.text(`${highlightnum + 1}/${_length}`)
        highlightPosition(highlightnum)
      }
    }
  })
  $pageSearchOn.click(() => {
    $pageSearch.css('display', 'flex').find('.hinp').focus()
  })
  $pageSearch.find('.hinp').on('input', function () {
    let $this = $(this),
      val = $this.val().trim();
    $markdown.removeHighlight();
    $pageSearchNum.text(``)
    if (val === '') return;
    $markdown.highlight(val);
    $highlight = $markdown.find("span.highlight"),
      _length = $highlight.length;
    $pageSearch.css('display', 'flex')
    highlightnum = 0;
    if (_length > 0) {
      $pageSearchNum.text(`${highlightnum + 1}/${_length}`)
      highlightPosition(highlightnum)
    }
  }).on('mouseenter', function () {
    $(this).focus()
  }).on('keydown', function (e) {
    let key = e.key;
    if (key === "Enter") {
      let $highlight = $markdown.find("span.highlight"),
        _length = $highlight.length;
      if (_length === 0) return;
      highlightnum++;
      highlightnum >= _length ? highlightnum = 0 : (highlightnum < 0 ? highlightnum = _length - 1 : null);
      highlightPosition(highlightnum)
      $pageSearchNum.text(`${highlightnum + 1}/${_length}`)
      e.preventDefault()
    }
  })

  //高亮定位
  function highlightPosition(num) {
    let DH = $(window).height(),
      _top = _position($highlight.eq(num)[0], true).top + $html.scrollTop();
    $highlight.removeClass('active').eq(num).addClass('active')
    if (_top > $html.scrollTop() && _top < $html.scrollTop() + DH) {
    } else {
      $html.stop().animate({
        scrollTop: _top - 60
      }, _speed)
    }
  }
  if (_getData('editlistmdobj')) {
    editlistmdobj = _getData('editlistmdobj')
  }

  $markdown.css({
    "font-size": editlistmdobj.fontsz,
  });
  let fsbgnum = editlistmdobj.theme
  function changebg() {
    switch (fsbgnum) {
      case 1:
        {
          editlistmdobj.theme = fsbgnum
          _setData('editlistmdobj', editlistmdobj)
          $body.attr('class', "heibaibg");
          $markdown.attr('class', "markdown heibaibg");
          $hicodeid.attr("href", "/css/notecode1.css");
          fsbgnum++;
        }
        break;
      case 2:
        {
          editlistmdobj.theme = fsbgnum
          _setData('editlistmdobj', editlistmdobj)
          $body.attr('class', "baiheibg");
          $markdown.attr('class', "markdown baiheibg");
          $hicodeid.attr("href", "/css/notecode.css");
          fsbgnum++;
        }
        break;
      case 3:
        {
          editlistmdobj.theme = fsbgnum
          _setData('editlistmdobj', editlistmdobj)
          $body.attr('class', "moren");
          $markdown.attr('class', " markdown moren");
          $hicodeid.attr("href", "/css/notecode2.css");
          fsbgnum = 1;
        }
        break;
    }
  }
  changebg()
  $fsbg.click((e) => {
    e.stopPropagation()
    changebg()
  });
  $(".fszd").click((e) => {
    e.stopPropagation()
    let fsztnum = editlistmdobj.fontsz
    fsztnum += 2;
    fsztnum >= 30 ? fsztnum = 30 : null
    $markdown.css({
      "font-size": fsztnum,
    });
    editlistmdobj.fontsz = fsztnum
    _setData('editlistmdobj', editlistmdobj)
  });
  $(".fsjx").click((e) => {
    e.stopPropagation()
    let fsztnum = editlistmdobj.fontsz
    fsztnum -= 2;
    fsztnum <= 12 ? fsztnum = 12 : null
    $markdown.css({
      "font-size": fsztnum,
    });
    editlistmdobj.fontsz = fsztnum
    _setData('editlistmdobj', editlistmdobj)
  });
  let hdtotop = debounce(function (p) {
    if (p <= 100) {
      $totop.stop().slideUp(_speed)
    } else {
      $totop.stop().slideDown(_speed)
    }
  }, 200)
  window.addEventListener('scroll', function () {
    let p = document.documentElement.scrollTop;
    hdtotop(p)
    let H = window.innerHeight,
      CH = document.documentElement.scrollHeight - H;
    pagepro(p / CH)
  })

  $markdown.on('click', 'img', function () {
    imgPreview($(this).attr('src'))
  })

  let BlogDirectory = function () {
    let $mdBox = $('.markdownbox'),
      $navwrap = $('.navwrap'),
      $dirBox = $('.dirBox'),
      $showDir = $('.showDir'),
      $allH = $mdBox.find('h1,h2,h3,h4,h5,h6'),
      str = '';
    $allH.each((idx, item) => {
      let text = encodeHtml(item.innerText)
      item.id = 'hello_' + idx;
      str += `<li h="${item.tagName.slice(1)}" cursor title="${text}" data-id="hello_${idx}">${text}</li>`
    })
    $dirBox.html(str)

    let $allLi = $navwrap.find('li')

    $navwrap.on('click', 'li', function (e) {
      let $this = $(this)
      $allLi.removeClass('open')
      $this.addClass('open')
      let id = $this.attr('data-id'),
        el = $html.find(`#${id}`),
        _top = _position(el[0], true).top + $html.scrollTop();
      $html.stop().animate({
        scrollTop: _top - 60
      }, _speed)
    }).on('click', '.navClose', function () {
      $navwrap.removeClass('open');
    })
    _mySlide({
      el: '.navwrap',
      right() {
        $navwrap.removeClass('open');
      }
    })
    $showDir.on('click', () => {
      $navwrap.addClass('open');
      hdNavActive()
    })
    function hdNavActive() {
      if (!$navwrap.hasClass('open')) return
      $allLi.removeClass('open')
      let $smalltopH = $allH.filter((_, item) => _position(item, true).top >= 0).eq(0);
      $smalltopH.length > 0 ? null : $smalltopH = $allH.last()
      if ($smalltopH.length > 0) {
        let $cuLi = $allLi.filter((_, item) => $(item).attr('data-id') === $smalltopH[0].id).eq(0)
        if ($cuLi.length > 0) {
          $cuLi.addClass('open')
          $dirBox.stop().animate({
            scrollTop: $dirBox.scrollTop() + _position($cuLi[0], true).top - $navwrap.height() / 4
          }, _speed)
        }
      }
    }
    window.addEventListener('scroll', debounce(hdNavActive, 200))
  }
}()

~function () {
  let div = document.createElement('div')
  div.style.cssText = `
    width: 0;
    height: 4px;
    position: fixed;
    top: 0;
    left: 0;
    border-radio:20px;
    pointer-events: none;
    background-image: linear-gradient(to right, green, orange);
    z-index: 9999999999;
  `
  document.body.appendChild(div)
  window.pagepro = function (pes) {
    div.style.width = pes * 100 + '%'
  }
}()

