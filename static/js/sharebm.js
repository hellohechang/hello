~async function () {
  let urlparmes = queryURLParams(_myOpen()),
    HASH = urlparmes.HASH,
    $btn=$('button'),
    $box = $('.box');
  _getAjax('/nav/share', { id: HASH }).then(res => {
    if (res.code == 0) {
      let str = ''
      res.data.forEach(item => {
        let { name, link, logo } = item;
        name = encodeHtml(name);
        str += `<div cursor data-link="${link}" data-name="${name}"
              data-src="${logo}" title="${name}(${link})" class="item">
              <div class="img"></div>
              <div class="text">${name}</div>
            </div>`
      })
      $box.html(str)
      $('.item').each((index, item) => {
        let $item = $(item),
          url = $item.attr('data-src'),
          link = $item.attr('data-link');
        if (!url.includes('favicon.ico')) {
          url = mediaURL + url
        }
        imgjz(url, () => {
          $item.find('.img').css({
            'background-image': `url(${url})`,
            opacity: '1'
          });
        }, () => {
          $item.find('.img').css({
            'background-image': `url('https://api.iowen.cn/favicon/${getHost(link)}.png')`,
            opacity: '1'
          });
        });
      });
    } else {
      _setTimeout(() => {
        _myOpen('/', false, 'Home')
      }, 5000)
    }
  })
  $btn.click(debounce(function(){
    _getAjax('/nav/saveshare',{id:HASH}).then(res=>{
      if(res.code==0){
        _success()
      }
    })
  },5000,true))
  $box.on('click', '.item', debounce(function () {
    let $this = $(this),
      link = $this.attr('data-link'),
      name = $this.attr('data-name');
    _myOpen(link, "_blank", name);
  }, 500))
  // 二维码
  ~function () {
    let qrcode = new QRCode($('.code')[0], {
      width: 80,
      height: 80,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });
    function makeCode(url) {
      qrcode.makeCode(encodeURI(url));
    }
    makeCode(_myOpen())
  }();
}()