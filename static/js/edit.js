~function () {
    let $codeBox = $('.codeBox'),
        $showBox = $('.showBox'),
        $save = $('.save'),
        $textData = $('.textData'),
        $sloseShow = $('.sloseShow'),
        $title = $('.title'),
        $navwrap = $('.navwrap'),
        $titleinp = $title.find('input'),
        $fullScreenShow = $('.fullScreenShow'),
        urlObj = queryURLParams(_myOpen()),
        reg = /^hello_[0-9]+$/;
    let { HASH } = urlObj;
    // 对比记录
    let orginData = {
        name: '',
        data: ''
    };
    if (HASH) {
        if (reg.test(HASH)) {//本地模式
            $save.remove()
            $title.remove()
            let local = _getData('md') || [],
                obj = local.find(item => item.name == HASH);
            if (obj) {
                $codeBox.val(obj.data)
                rende()
            }
        } else {
            $textData.remove()
            // 绑定关闭页面事件
            window.addEventListener('beforeunload', function (e) {
                e.preventDefault();
                // 对比内容是否发生改变
                if ($codeBox.val() !== orginData.data || $titleinp.val().trim() !== orginData.name) {
                    e.returnValue = '';//发生改变则弹出提示框
                }
            });
            if (HASH === 'new') {//新增笔记
                let name = newDate("{0}-{1}-{2} {3}:{4}")
                $titleinp.val(name)
                orginData.name = name
            } else {//获取内容编辑笔记
                _getAjax('/note/geteditnote', { id: HASH }).then(result => {
                    if (parseInt(result.code) === 0) {
                        $titleinp.val(result.data.name)
                        $codeBox.val(result.data.data)
                        orginData = result.data;
                        rende()
                    }
                })
            }
        }
    } else {
        $save.remove()
        $title.remove()
        HASH = `hello_${Date.now()}`
        window.location.href = `/page/edit/#${HASH}`
        // _myOpen(, false, 'Edit')
    }
    // 渲染转换显示
    function rende() {
        let text = $codeBox.val(),
            show = marked.parse(text);
        if (HASH) {
            if (reg.test(HASH)) {//本地模式
                let local = _getData('md') || [],
                    idx = local.findIndex(item => item.name == HASH),
                    obj = {
                        name: HASH,
                        data: text
                    };
                if (idx < 0) {//没有则新增
                    local.push(obj)
                } else {//有则替换
                    local[idx] = obj
                }
                _setData('md', local)
            } else {
                handleSave()
            }
        }
        $showBox.html(show)
        // hljs.initHighlightingOnLoad();
        hljs.highlightAll()
        $('pre').append(`<div title="复制" cursor class="codeCopy iconfont icon-fuzhi"><div>`).prepend(`<div data-flag="y" cursor class="shrink iconfont icon-Down"><div>`)
    }
    // 处理保存按钮
    function handleSave() {
        let name = $titleinp.val().trim(),
            data = $codeBox.val();
        // 对比内容
        if (orginData.name === name && orginData.data === data) {
            $save.removeClass('active')
            return
        }
        $save.addClass('active')
    }
    $titleinp.on('input', handleSave)
    $showBox.on('click', '.codeCopy', debounce(function () {
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
            $this.parent().find('code').hide()
        } else {
            $this.attr({
                'data-flag': 'y',
                class: 'shrink iconfont icon-Down'
            })
            $this.parent().find('code').show()
        }
    }, 500, true)).on('click', 'img', function () {
        imgPreview($(this).attr('src'))
    })
    $codeBox.on('input', rende).on("keydown", function (e) {
        let key = e.key,
            ctrl = e.ctrlKey || e.metaKey;
        if (key === 'Tab') {
            var start = this.selectionStart,
                end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
            e.preventDefault();
        }
        if (ctrl && key === 's') {
            if (HASH) {
                if (!reg.test(HASH)) {
                    $save.click();
                    e.preventDefault();
                }
            }
        }
    }).on('scroll', function () {
        let $this = $(this),
            CT = $this.scrollTop(),
            CBH = $codeBox.outerHeight(),
            CH = $this[0].scrollHeight - CBH,
            SH = $showBox[0].scrollHeight - CBH;
        ST = CT / CH * SH
        $showBox.scrollTop(ST)
    })
    $sloseShow.click(function () {
        if (!$sloseShow._flag) {
            $sloseShow._flag = 'y'
        }
        if ($sloseShow._flag === 'y') {
            $sloseShow._flag = 'n'
            $sloseShow.attr('class', 'sloseShow iconfont icon-yanjing_yincang_o')
            $showBox.hide()
            $codeBox.addClass('open')
            $fullScreenShow.hide()
        } else {
            $sloseShow._flag = 'y'
            $sloseShow.attr('class', 'sloseShow iconfont icon-yanjing_xianshi_o')
            $showBox.show()
            $codeBox.removeClass('open')
            $fullScreenShow.show()
        }
        $codeBox.show()
    })
    $fullScreenShow.click(function () {
        $codeBox.toggle()
    })
    $save.click(throttle(saveNote, 1000))
    $textData.click(function () {
        $navwrap.fadeIn(_speed)
        let local = _getData('md') || [],
            str = "";
        local.reverse()
        if (local.length === 0) {
            str += `
            <li>
            <div>It feels lonely here...</div>
            </li>
            `
        } else {
            local.forEach(item => {
                let { name, data } = item;
                data = encodeHtml(data.slice(0, 500) + '...')
                str += `
                <li title="${data}" data-name="${name}">
                <span class="textname">${newDate("{0}-{1}-{2} {3}:{4}:{5}", name.split('_')[1])}</span>
                <span class="delete iconfont icon-guanbi"></span>
                </li>
                `
            })
        }
        $navwrap.find('.dirBox').html(str)
    })
    $navwrap.click(function (e) {
        if (_getTarget(e, '.navwrap', 1)) {
            $navwrap.fadeOut(_speed)
        }
    }).on('click', '.textname', function () {
        let name = $(this).parent().attr('data-name')
        _myOpen(`/page/edit/#${name}`, 1, name)
    }).on('click', '.delete', function () {
        let $this = $(this),
            name = $this.parent().attr('data-name'),
            local = _getData('md') || [];
        local = local.filter(item => item.name != name)
        _setData('md', local)
        $this.parent().remove()
    })
    function saveNote() {
        let vn = $titleinp.val().trim(),
            vt = $codeBox.val();
        if (vn === '') {
            _err('请输入标题')
            return
        };
        if (vn === orginData.name && vt === orginData.data) return
        _postAjax('/note/editnote', { id: HASH, vn, vt }).then(result => {
            if (parseInt(result.code) === 0) {
                orginData.data = vt
                orginData.name = vn
                $save.removeClass('active')
                if (result.data) {
                    HASH = result.data.id;
                    window.location.href = `/page/edit/#${HASH}`
                    // _myOpen(`/page/edit/#${HASH}`, false, vn)
                    _success(result.codeText)
                    return
                }
                _success(result.codeText)
            }
        })
    }
    // 禁止后退
    function pushHistory() {
        window.history.pushState(null, "", _myOpen());
    }
    pushHistory();
    window.addEventListener("popstate", function (e) {
        pushHistory();
        // to do something
    });
}()
