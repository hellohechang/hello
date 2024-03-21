import $ from 'jquery';
import '../../css/common/reset.css';
import '../../css/common/common.css';
import '../../font/iconfont.css';
import './index.less';
import imgWave from '../../images/img/wave.gif';
import imgMusic from '../../images/img/music.jpg';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  imgjz,
  _getAjax,
  encodeHtml,
  _getTarget,
  imgPreview,
  copyText,
  pageErr,
  deepClone,
  myShuffle,
  _mySlide,
  downloadFile,
  ContentScroll,
  myDrag,
  toCenter,
  toHide,
  toSetSize,
  myResize,
  myToMax,
  myToRest,
  getMinIndex,
  percentToValue,
  _progressBar,
  inputPageNo,
  formartSongTime,
  formatNum,
  _position,
  getTextImg,
  formatDate,
  getSuffix,
  getFilePath,
  enterPassCode,
  _getDataTem,
  _setDataTem,
  hdPath,
  userLogoMenu,
  LazyLoad,
} from '../../js/utils/utils';
import { _d, _speed } from '../../js/common/config';
import '../../js/common/common';
import _msg from '../../js/plugins/message';
import { inpMenu, selectMenu } from '../../js/plugins/rightMenu';
const urlparmes = queryURLParams(myOpen()),
  HASH = urlparmes.HASH,
  $myAudio = $(new Audio()),
  $musicPlayerWrap = $('.music_player_wrap'),
  $userInfo = $musicPlayerWrap.find('.user_info'),
  $lrcBg = $musicPlayerWrap.find('.lrc_bg'),
  $lrcHead = $musicPlayerWrap.find('.lrc_head'),
  $lrcListWrap = $musicPlayerWrap.find('.lrc_list_wrap'),
  $lrcMenuWrap = $musicPlayerWrap.find('.lrc_menu_wrap'),
  $lrcFootWrap = $musicPlayerWrap.find('.lrc_foot_wrap'),
  $lrcProgressBar = $lrcFootWrap.find('.progress_bar'),
  $lrcFootBtnWrap = $lrcFootWrap.find('.foot_btn_wrap'),
  $playingListWrap = $musicPlayerWrap.find('.playing_list_mask'),
  $pMusicListBox = $playingListWrap.find('.p_music_list_wrap'),
  $musicMvWrap = $('.music_mv_wrap'),
  $myVideo = $musicMvWrap.find('.my_video');
$myAudio[0].preload = 'none';
const lrcHeadContentScrollName = new ContentScroll(
  $lrcHead.find('.song_name div')[0]
);
const lrcHeadContentScrollArtist = new ContentScroll(
  $lrcHead.find('.artist_name div')[0]
);
let playingList = null,
  musicArr = null,
  musicObj = null,
  curPlaySpeed = _getData('lastplaysd'),
  lrcstatu = _getData('lrcstatu'),
  userInfo = null,
  passCode = _getDataTem('passCode') || '';
let mClose = null;
let defaultTitle = '';
function getShareData() {
  _getAjax('/player/musicshare', { id: HASH, pass: passCode })
    .then((resObj) => {
      if (mClose) {
        mClose && mClose(1);
        mClose = null;
      }
      if (resObj.code == 0) {
        let { account, username, logo, title, valid } = resObj.data;
        defaultTitle = title;
        userInfo = { account, username };
        logo = logo
          ? hdPath(`/api/logo/${account}/${logo}`)
          : getTextImg(username);
        $userInfo.find('.from').text(username);
        $userInfo.find('.title').text(title);
        $userInfo.find('.valid').text(
          valid == 0
            ? '永久'
            : formatDate({
                template: '{0}-{1}-{2} {3}:{4}',
                timestamp: valid,
              })
        );
        $lrcHead.find('.user_logo').css('background-image', `url(${logo})`);
        playingList = resObj.data.data;
        musicArr = deepClone(playingList);
        musicObj = _getDataTem('musicObj') || initSongInfo(playingList[0]);
        toggleMvBtnState();
        renderSongInfo();
        $lrcProgressBar
          .find('.total_time')
          .text(formartSongTime(musicObj.duration));
      } else if (resObj.code == 3) {
        _msg.error('提取码错误');
        enterPassCode(({ close, val }) => {
          mClose = close;
          passCode = val;
          _setDataTem('passCode', passCode);
          getShareData();
        });
      }
    })
    .catch((err) => {
      pageErr();
    });
}
getShareData();
$lrcHead.on('click', '.user_logo', (e) => {
  let { account, username } = userInfo;
  userLogoMenu(e, account, username);
});
function toggleMvBtnState() {
  if (musicObj && musicObj.mv) {
    $lrcMenuWrap.find('.play_mv_btn').stop().show(_speed);
  } else {
    $lrcMenuWrap.find('.play_mv_btn').stop().hide(_speed);
  }
}
function initSongInfo(obj) {
  obj = deepClone(obj);
  obj.ppic =
    getFilePath(`sharemusic/${HASH}/${obj.id}/${obj.pic}`) +
    `&pass=${encodeURIComponent(passCode)}`;
  obj.uurl =
    getFilePath(`sharemusic/${HASH}/${obj.id}/${obj.url}`) +
    `&pass=${encodeURIComponent(passCode)}`;
  obj.mmv =
    getFilePath(`sharemusic/${HASH}/${obj.id}/${obj.mv}`) +
    `&pass=${encodeURIComponent(passCode)}`;
  return obj;
}

function renderSongInfo() {
  if (!musicObj) return;
  const id = musicObj.id;
  lrcHeadContentScrollName.init(musicObj.title);
  lrcHeadContentScrollArtist.init(musicObj.artist);
  $myAudio.attr('src', musicObj.uurl);
  imgjz(
    musicObj.ppic,
    () => {
      if (id !== musicObj.id) return;
      $lrcBg
        .css('background-image', `url("${musicObj.ppic}")`)
        .removeClass('lrcbgss');
    },
    () => {
      if (id !== musicObj.id) return;
      $lrcBg.css('background-image', `url(${imgMusic})`).removeClass('lrcbgss');
    }
  );
}
function lrcInit() {
  $myAudio._rod = [];
  $myAudio.curLrcIdx = 0;
  $lrcListWrap.find('.lrc_items').html('');
}
let randomplay = true;
$lrcFootBtnWrap
  .on('click', '.random_play_btn', function () {
    var a;
    switch (randomplay) {
      case true:
        {
          randomplay = false;
          $myAudio.attr('loop', null);
          $lrcFootBtnWrap
            .find('.random_play_btn')
            .attr('class', 'random_play_btn iconfont icon-suiji');
          a = '随机播放';
          musicArr = myShuffle(deepClone(playingList));
        }
        break;
      case false:
        {
          randomplay = 1;
          $myAudio.attr('loop', 'loop');
          $lrcFootBtnWrap
            .find('.random_play_btn')
            .attr('class', 'random_play_btn iconfont icon-ttpodicon');
          a = '单曲播放';
        }
        break;
      case 1:
        {
          randomplay = true;
          $myAudio.attr('loop', null);
          $lrcFootBtnWrap
            .find('.random_play_btn')
            .attr('class', 'random_play_btn iconfont icon-shunxubofang');
          a = '顺序播放';
          musicArr = deepClone(playingList);
        }
        break;
    }
    _msg.info(a);
  })
  .on('click', '.playing_list_btn', function (e) {
    defaultdqplaying();
    $playingListWrap.stop().fadeIn(100, () => {
      $pMusicListBox.stop().slideDown(_speed, () => {
        let idx = playingList.findIndex((v) => musicObj.id === v.id);
        if (idx >= 0) {
          playingPageNum = Math.ceil((idx + 1) / playingSize);
        } else {
          playingPageNum = 1;
        }
        dqplaying();
        playingListHighlight(true);
      });
    });
  })
  .on('click', '.prev_play_btn', function (e) {
    let index;
    if (musicArr.length == 0) {
      _msg.error('播放列表为空');
      audioPause();
      return;
    }
    index = musicArr.findIndex((x) => x.id === musicObj.id);
    index--;
    index < 0 ? (index = musicArr.length - 1) : null;
    musicPlay(musicArr[index]);
  })
  .on('click', '.next_play', function (e) {
    $lrcProgressBar.find('.pro2').width('0');
    let index;
    if (musicArr.length == 0) {
      _msg.error('播放列表为空');
      audioPause();
      return;
    }
    index = musicArr.findIndex((x) => x.id === musicObj.id);
    index++;
    index > musicArr.length - 1 ? (index = 0) : null;
    musicPlay(musicArr[index]);
  })
  .on('click', '.play_btn', function () {
    if ($myAudio[0].paused) {
      audioPlay();
    } else {
      audioPause();
    }
  });
function musicPlay(obj) {
  $myAudio[0].currentTime = 0; //时间进度归零
  musicObj = initSongInfo(obj); //初始化音乐数据
  _setDataTem('musicObj', musicObj);
  let a = `♪♪ ${musicObj.artist} - ${musicObj.title}`;
  $lrcProgressBar.find('.total_time').text(formartSongTime(musicObj.duration));
  _msg.info(a);
  playingListHighlight(false);
  $lrcBg.addClass('lrcbgss'); //背景透明
  renderSongInfo();
  lrcInit();
  toggleMvBtnState();
  audioPlay();
}
const musicMvContentScroll = new ContentScroll(
  $musicMvWrap.find('.m_top_space p')[0]
);
//MV播放函数
function musicMv(obj) {
  musicObj = initSongInfo(obj);
  _setDataTem('musicObj', musicObj);
  renderSongInfo();
  audioPause();
  $myVideo.attr('src', musicObj.mmv);
  videoPlay();
  $musicMvWrap.stop().fadeIn(_speed).css('display', 'flex');
  if (!$musicMvWrap.once) {
    $musicMvWrap.once = true;
    toSetSize($musicMvWrap[0], 600, 600);
    toCenter($musicMvWrap[0]);
  }
  musicMvContentScroll.init(`${musicObj.artist} - ${musicObj.title}`);
  playingListHighlight(false);
}
$myVideo[0].onerror = function (e) {
  _msg.error(`MV 加载失败`);
};
function videoPause() {
  $myVideo[0].pause();
}
function videoPlay() {
  audioPause();
  $myVideo[0].play();
}
// 暂停
function audioPause() {
  $myAudio[0].pause();
  document.title = 'Music sharing';
  $lrcProgressBar.find('.dolt').css('animation-play-state', 'paused');
  $lrcFootBtnWrap
    .find('.play_btn')
    .attr('class', 'play_btn iconfont icon-65zanting')
    .css('animation', 'none');
}
function audioPlay() {
  videoPause();
  if (!$musicMvWrap.is(':hidden')) {
    toHide($musicMvWrap[0], {
      to: dmwidth > _d.screen ? 'bottom' : 'right',
      scale: dmwidth > _d.screen ? 'small' : '',
    });
    musicMvContentScroll.close();
  }
  if (!musicObj) return;
  document.title = `\xa0\xa0\xa0♪正在播放：${musicObj.artist} - ${musicObj.title}`;
  $myAudio[0].play();
  if ($myAudio._rod.length === 0) {
    _musiclrc();
  }
  //保持播放速度
  $myAudio[0].playbackRate = curPlaySpeed[1];
}
//歌词处理
$myAudio._rod = [];
const _musiclrc = debounce(musiclrc, 2000);
function musiclrc() {
  if (!musicObj) return;
  const id = musicObj.id;
  _getAjax('/player/lrc', {
    id,
    flag: `${HASH}/${passCode}`,
  })
    .then((result) => {
      if (parseInt(result.code) === 0) {
        let rod = result.data;
        if (id !== musicObj.id) return;
        rod = rod.map((item, idx) => {
          item.idx = idx;
          return item;
        });
        $myAudio._rod = rod;
        let hasfy = !rod.every((item) => item.fy === '');
        if (hasfy) {
          $lrcMenuWrap.find('.lrc_translate_btn').stop().show(_speed);
        } else {
          $lrcMenuWrap.find('.lrc_translate_btn').stop().hide(_speed);
        }
        let str = '';
        rod.forEach((item) => {
          let { p, fy } = item;
          p = encodeHtml(p);
          fy = encodeHtml(fy);
          str += `<div>
          <p class="elrc">${p}</p>
          <p style="display: ${
            _getData('showfy') && hasfy ? 'block' : 'none'
          };" class="lrcfy">${fy}</p></div>`;
        });
        $lrcListWrap
          .find('.lrc_items')
          .css({
            'text-align': lrcstatu.statu,
            'font-size': percentToValue(14, 30, lrcstatu.size),
          })
          .html(str);
        setActionLrcIndex();
        lrcScroll(true);
      }
    })
    .catch((err) => {
      $myAudio._rod = [];
    });
}
// 设置最接近播放进度的歌词索引
function setActionLrcIndex() {
  const cTime = Math.round($myAudio[0].currentTime);
  $myAudio.curLrcIdx = getMinIndex(
    $myAudio._rod.map((item) => Math.abs(cTime - item.t))
  );
}
function lrcScroll(y) {
  const $lrc = $lrcListWrap.find('.lrc_items');
  if ($myAudio._rod.length === 0) return;
  let $lrcdiv = $lrc.children('div'),
    $activediv = $lrcdiv.eq($myAudio.curLrcIdx),
    wH = $lrcListWrap.outerHeight(),
    lrcmtop = parseFloat(
      window.getComputedStyle($lrc[0]).transform.slice(7).split(',').slice(-1)
    ),
    mtop = lrcmtop - _position($activediv[0]).top + wH * 0.4;
  $lrcdiv.removeClass('active');
  $activediv.addClass('active');
  if (y) {
    $lrc.css({
      transition: '0s',
      transform: `translateY(${mtop}px)`,
    });
  } else {
    $lrc.css({
      transition: 'transform .5s ease-in-out',
      transform: `translateY(${mtop}px)`,
    });
  }
}
$lrcListWrap.on('click', function () {
  if ($lrcFootWrap._flag !== 'y') return;
  if (this._isop) {
    $lrcListWrap.css('opacity', 1);
    $lrcBg.removeClass('open');
    this._isop = false;
  } else {
    $lrcListWrap.css('opacity', 0);
    $lrcBg.addClass('open');
    this._isop = true;
  }
});
// 音乐事件
let upprog = throttle(function () {
  $lrcProgressBar
    .find('.current_time')
    .text(formartSongTime($myAudio[0].currentTime));
  proTime($myAudio[0].currentTime / musicObj.duration, true);
}, 500);
let lrcCount = -1; //歌词计数
$myAudio
  .on('loadedmetadata', function () {
    //元数据加载完
  })
  .on('waiting', function () {
    //缺少数据加载效果
    if ($myAudio[0].paused) return;
    $lrcProgressBar
      .find('.dolt')
      .css('animation', 'bgcolor .3s infinite linear alternate');
    $lrcFootBtnWrap
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-65zanting')
      .css('animation', 'fontcolor .5s infinite linear alternate');
  })
  .on('playing', function () {
    //准备开始播放
    if ($myAudio[0].paused) return;
    $lrcProgressBar
      .find('.dolt')
      .css('animation', 'bgcolor 2s infinite linear alternate');
    $lrcFootBtnWrap
      .find('.play_btn')
      .attr('class', 'play_btn iconfont icon-zanting')
      .css('animation', 'none');
  })
  .on('error', function () {
    _msg.error('歌曲加载失败');
    audioPause();
  })
  .on('ended', function () {
    if (randomplay === 1) return;
    $lrcFootBtnWrap.find('.next_play').click();
  })
  .on('timeupdate', function () {
    let times = this.currentTime,
      timm = Math.round(times);
    upprog();
    if ($myAudio[0]._flag == timm) return;
    let rod = $myAudio._rod || [];
    rod
      .filter((item) => item.t == timm)
      .forEach((item, i) => {
        lrcCount++;
        $myAudio[0]._flag = timm;
        _setTimeout(() => {
          $myAudio.curLrcIdx = item.idx;
          lrcCount--;
          if (lrcCount > 0) {
            lrcScroll(true);
          } else {
            lrcScroll();
          }
        }, lrcCount * 100);
      });
  });
// 进度条处理
function proTime(percent, y) {
  percent <= 0 ? (percent = 0) : percent >= 1 ? (percent = 1) : null;
  let val =
    (pro1.offsetWidth - dolt.offsetWidth) * percent +
    dolt.offsetWidth / 2 +
    'px';
  let per = percent * 100 + '%';
  if (dolt.offsetWidth) {
    pro2.style.width = val;
  } else {
    pro2.style.width = per;
  }
  if (!y) {
    $myAudio[0].currentTime = percent * musicObj.duration;
  }
}
//进度条
var probox = $lrcProgressBar.find('.probox')[0],
  pro1 = $lrcProgressBar.find('.pro1')[0],
  pro2 = $lrcProgressBar.find('.pro2')[0],
  dolt = $lrcProgressBar.find('.dolt')[0];
probox.addEventListener('touchstart', function (e) {
  $lrcProgressBar.find('.dolt').addClass('open');
  $lrcProgressBar.find('.pro1').addClass('open');
  let percent;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let ev = e.targetTouches[0];
    let a = pro1.offsetLeft + $musicPlayerWrap[0].offsetLeft;
    percent =
      (ev.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(percent);
  }
  function mend(e) {
    setActionLrcIndex();
    lrcScroll();
    $lrcProgressBar.find('.dolt').removeClass('open');
    $lrcProgressBar.find('.pro1').removeClass('open');
    probox.removeEventListener('touchmove', mmove);
    probox.removeEventListener('touchend', mend);
  }
  probox.addEventListener('touchmove', mmove);
  probox.addEventListener('touchend', mend);
});
probox.addEventListener('mousedown', function (e) {
  let percent;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let a = pro1.offsetLeft + $musicPlayerWrap[0].offsetLeft;
    percent =
      (e.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(percent);
  }
  function mup() {
    setActionLrcIndex();
    lrcScroll();
    document.removeEventListener('mousemove', mmove);
    document.removeEventListener('mouseup', mup);
  }
  document.addEventListener('mousemove', mmove);
  document.addEventListener('mouseup', mup);
});
document.onkeydown = function (e) {
  let key = e.key,
    ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && key === 'ArrowLeft')
    $lrcFootBtnWrap.find('.prev_play_btn').click(); // 上一曲
  if (ctrl && key === 'ArrowRight') $lrcFootBtnWrap.find('.next_play').click(); // 下一曲
  //暂停/播放
  if (key === ' ') {
    if ($musicMvWrap.is(':hidden')) {
      $lrcFootBtnWrap.find('.play_btn').click();
    } else {
      if ($myVideo[0].paused) {
        videoPlay();
      } else {
        videoPause();
      }
    }
  }
};
//隐藏播放列表
$playingListWrap.on('click', function (e) {
  if (_getTarget(this, e, '.playing_list_mask', 1)) {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox.stop().slideUp(_speed, () => {
      $playingListWrap.stop().fadeOut(100);
    });
  }
});
function defaultdqplaying() {
  let str = ``;
  new Array(50).fill(null).forEach(() => {
    str += `<li style="pointer-events: none;margin: 2px 0;" class = "song_item"></li>`;
  });
  $pMusicListBox.find('.p_foot').html(str);
}

//处理播放列表
let playingPageNum = 1;
let playingSize = 100;
function dqplaying() {
  if ($pMusicListBox.is(':hidden')) return;
  let str = '';
  if (!playingList || playingList.length == 0) {
    $pMusicListBox.find('.left').text(`正在播放(0)`);
    $pMusicListBox
      .find('.p_foot')
      .html(
        `<p style="padding: 20px 0;text-align: center;pointer-events: none;">${_d.emptyList}</p>`
      );
    return;
  }
  $pMusicListBox.find('.left').text(`正在播放(${playingList.length})`);
  let totalPage = Math.ceil(playingList.length / playingSize);
  playingPageNum < 1
    ? (playingPageNum = totalPage)
    : playingPageNum > totalPage
    ? (playingPageNum = 1)
    : null;
  let arr = playingList.slice(
    (playingPageNum - 1) * playingSize,
    playingPageNum * playingSize
  );
  arr.forEach((v) => {
    let { title, artist, mv, id, pic } = v;
    title = encodeHtml(title);
    artist = encodeHtml(artist);
    str += `<li class="song_item" cursor data-id="${id}">
          <div class="logo_wrap">
          <div class="logo" data-src="${
            getFilePath(`sharemusic/${HASH}/${id}/${pic}`, 1) +
            `&pass=${encodeURIComponent(passCode)}`
          }"></div>
          <img class="play_gif" src="${imgWave}">
          </div>
          <div class="song_info_wrap">
          <span class = "song_name">${title}</span>
          <span class="artist_name"><i class="artist_name_text">${artist}</i></span>
          </div>
          ${
            mv === 'y'
              ? `<div class="play_mv iconfont icon-shipin2"></div>`
              : ''
          }
          <div cursor class="del iconfont icon-guanbi"></div>
        </li>`;
  });
  str += `<div style="padding:20px 0;text-align:center;" class="playing_list_paging jzxz">
      ${
        totalPage > 1
          ? `<span cursor class="prev_page iconfont icon-prev"></span>
      <span cursor class="input_num" style="margin:0 30px">${playingPageNum}/${totalPage}</span>
      <span cursor class="next_page iconfont icon-page-next"></span>`
          : ''
      }
    </div>`;
  $pMusicListBox.find('.p_foot').html(str);
  lazyImg.bind(
    $pMusicListBox.find('.p_foot')[0].querySelectorAll('.logo'),
    (item) => {
      const $img = $(item);
      const u = $img.attr('data-src');
      imgjz(
        u,
        () => {
          $img.css('background-image', `url(${u})`).addClass('load');
        },
        () => {
          $img.css('background-image', `url(${imgMusic})`).addClass('load');
        }
      );
    }
  );
}
const lazyImg = new LazyLoad();
$pMusicListBox.on('click', '.save_playing_list', function (e) {
  inpMenu(
    e,
    {
      subText: '提交',
      items: {
        name: {
          placeholder: '歌单名称',
          value: defaultTitle,
          verify(val) {
            if (val.trim() == '') {
              return '请输入名称';
            }
          },
        },
      },
    },
    debounce(
      function ({ close, inp }) {
        let va = inp.name;
        _getAjax('/player/savesharesongs', { id: HASH, name: va }).then(
          (res) => {
            if (res.code == 0) {
              _msg.success(res.codeText);
              close();
            }
          }
        );
      },
      1000,
      true
    ),
    '保存歌单'
  );
});
function getPlayingListItem(id) {
  return playingList.find((item) => item.id == id);
}
$pMusicListBox
  .find('.p_foot')
  .on('click', '.song_info_wrap', function () {
    let $this = $(this).parent();
    let obj = getPlayingListItem($this.attr('data-id'));
    if (musicObj.id == obj.id) {
      $lrcFootBtnWrap.find('.play_btn').click();
      return;
    }
    musicPlay(obj);
  })
  .on('click', '.play_mv', function (e) {
    e.stopPropagation();
    let $this = $(this).parent();
    let sobj = getPlayingListItem($this.attr('data-id'));
    musicMv(sobj);
  })
  .on('click', '.prev_page', function () {
    playingPageNum--;
    $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
    dqplaying();
    playingListHighlight();
  })
  .on('click', '.next_page', function () {
    playingPageNum++;
    $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
    dqplaying();
    playingListHighlight();
  })
  .on('click', '.input_num', function (e) {
    inputPageNo(e, { subText: 'Go', value: playingPageNum }, (val) => {
      playingPageNum = val;
      $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
      dqplaying();
      playingListHighlight();
    });
  })
  .on('click', '.del', function (e) {
    e.stopPropagation();
    let $this = $(this),
      id = $this.parent().attr('data-id');
    playingList = playingList.filter((v) => v.id !== id);
    musicArr = musicArr.filter((v) => v.id !== id);
    dqplaying();
    playingListHighlight();
  })
  .on('click', '.logo_wrap', function () {
    $(this).parent().find('.song_info_wrap').click();
  });
function playingListHighlight(a) {
  if ($pMusicListBox.is(':hidden') || !musicObj || !playingList) return;
  let $song_item = $pMusicListBox.find('.p_foot').find('.song_item');
  $song_item.removeClass('active').find('.play_gif').removeClass('show');
  let y = Array.prototype.findIndex.call(
    $song_item,
    (item) => item.dataset.id == musicObj.id
  );
  if (y < 0) return;
  let cur = $song_item.eq(y);
  if (a) {
    let sp =
      $pMusicListBox.find('.p_foot').scrollTop() + cur.position().top - 42;
    $pMusicListBox.find('.p_foot').scrollTop(sp);
  }
  cur.addClass('active').find('.play_gif').addClass('show');
}
myDrag({
  trigger: $musicMvWrap.find('.m_top_space')[0],
  target: $musicMvWrap[0],
  down({ target }) {
    target.style.transition = '0s';
  },
  up({ target, x, y }) {
    let h = window.innerHeight;
    if (y <= 0 || y >= h) {
      myToMax(target);
    } else {
      target._op = { x, y };
      myToRest(target);
    }
  },
});

function showSongInfo(e, sobj) {
  _getAjax('/player/getsonginfo', { id: sobj.id })
    .then((res) => {
      if (res.code == 0) {
        let {
          title,
          artist,
          duration,
          album,
          year,
          collect_count,
          play_count,
          creat_time,
        } = res.data;
        let data = [
          {
            text: title,
            beforeText: '歌曲：',
          },
          {
            text: artist,
            beforeText: '歌手：',
          },
          {
            text: album || '--',
            beforeText: '专辑：',
          },
          {
            text: year || '--',
            beforeText: '发布年份：',
          },
          {
            text: formartSongTime(duration),
            beforeText: '时长：',
          },
          {
            text: formatNum(play_count),
            beforeText: '播放量：',
          },
          {
            text: formatNum(collect_count),
            beforeText: '收藏量：',
          },
          {
            text: formatDate({
              template: `{0}-{1}-{2}`,
              timestamp: creat_time,
            }),
            beforeText: '添加时间：',
          },
        ];
        data.forEach((item, idx) => {
          (item.pointer = false), (item.id = idx + 1);
        });
        selectMenu(e, data, false, '歌曲信息');
      }
    })
    .catch((err) => {});
}

myResize({
  target: $musicMvWrap[0],
  down(target) {
    target.style.transition = '0s';
  },
  up(target) {
    target._os = {
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
  },
});
$lrcMenuWrap
  .on('click', '.play_mv_btn', function (e) {
    e.stopPropagation();
    if (!musicObj) return;
    $myVideo.attr('src', musicObj.mmv);
    $musicMvWrap.stop().fadeIn(_speed).css('display', 'flex');
    if (!$musicMvWrap.once) {
      $musicMvWrap.once = true;
      toSetSize($musicMvWrap[0], 600, 600);
      toCenter($musicMvWrap[0]);
    }
    musicMvContentScroll.init(`${musicObj.artist} - ${musicObj.title}`);
    videoPlay();
  })
  .on('click', '.lrc_translate_btn', (e) => {
    let showfy = _getData('showfy');
    if (showfy) {
      $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'none');
    } else {
      $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'block');
    }
    lrcScroll(true);
    showfy = !showfy;
    _setData('showfy', showfy);
  })
  .on('click', '.set_lrc_btn', function (e) {
    let data = [
      {
        id: '1',
        text: '字体大小',
        beforeIcon: 'iconfont icon-font-size',
      },
      {
        id: '2',
        text: '靠左',
        beforeIcon: 'iconfont icon-kaozuo1',
      },
      {
        id: '3',
        text: '居中',
        beforeIcon: 'iconfont icon-geci',
      },
      {
        id: '4',
        text: '靠右',
        beforeIcon: 'iconfont icon-kaoyou1',
      },
      {
        id: '6',
        text: '封面',
        beforeIcon: 'iconfont icon-tupian',
      },
      {
        id: '7',
        text: '复制歌曲名',
        beforeIcon: 'iconfont icon-fuzhi',
      },
      {
        id: '8',
        text: '歌曲信息',
        beforeIcon: 'iconfont icon-about',
      },
      {
        id: '10',
        text: '下载',
        beforeIcon: 'iconfont icon-xiazai1',
      },
    ];
    selectMenu(
      e,
      data,
      ({ e, close, id }) => {
        if (id == '1') {
          close();
          let { size } = lrcstatu;
          _progressBar(e, size, (percent) => {
            $lrcListWrap.find('.lrc_items').css({
              'font-size': percentToValue(14, 30, percent) + 'px',
            });
            lrcstatu.size = percent;
            _setData('lrcstatu', lrcstatu);
            lrcScroll(true);
          });
        } else if (id == '2') {
          close();
          lrcstatu.statu = 'left';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'left',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '3') {
          close();
          lrcstatu.statu = 'center';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'center',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '4') {
          close();
          lrcstatu.statu = 'right';
          $lrcListWrap.find('.lrc_items').css({
            'text-align': 'right',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (id == '6') {
          close();
          let u1 = musicObj.ppic;
          imgPreview([
            {
              u1,
              u2: u1 + '?t=1',
            },
          ]);
        } else if (id == '7') {
          close();
          copyText(musicObj.artist + ' - ' + musicObj.title);
        } else if (id == '8') {
          showSongInfo(e, musicObj);
        } else if (id == '10') {
          close();
          let fname = `${musicObj.artist}-${musicObj.title}`;
          downloadFile(musicObj.uurl, `${fname}.${getSuffix(musicObj.url)[1]}`);
        }
      },
      musicObj.artist + ' - ' + musicObj.title
    );
  })
  .on('click', '.play_speed_btn', function (e) {
    let data = [];
    [2, 1.75, 1.5, 1.25, 1, 0.75, 0.25].forEach((item, idx) => {
      data.push({
        id: idx + 1,
        text: 'x' + item,
        param: {
          b: item,
          a: 'x' + item,
        },
        active: curPlaySpeed[1] == item ? true : false,
      });
    });
    selectMenu(
      e,
      data,
      ({ id, resetMenu, param }) => {
        if (id) {
          let { a, b } = param;
          $lrcMenuWrap.find('.play_speed_btn').text(a);
          $myAudio[0].playbackRate = b;
          curPlaySpeed = [a, b];
          data.forEach((item) => {
            if (item.param.b == curPlaySpeed[1]) {
              item.active = true;
            } else {
              item.active = false;
            }
          });
          resetMenu(data);
          _setData('lastplaysd', curPlaySpeed);
          _msg.info(b + 'X');
        }
      },
      '歌曲播放速度'
    );
  })
  .find('.play_speed_btn')
  .text(curPlaySpeed[0]);
setInterval(() => {
  let title = document.title;
  if (title !== '音乐分享') {
    let first = title.charAt(0),
      other = title.substring(1);
    document.title = other + first;
  }
}, 1000);
//桌面大小改变自适应
let dmwidth = window.innerWidth;
window.addEventListener(
  'resize',
  throttle(function () {
    dmwidth = window.innerWidth;
  }, 1000)
);
$musicMvWrap.on('click', '.m_close', function (e) {
  videoPause();
  toHide($musicMvWrap[0], {
    to: dmwidth > _d.screen ? 'bottom' : 'right',
    scale: dmwidth > _d.screen ? 'small' : '',
  });
  musicMvContentScroll.close();
});
// 播放列表
_mySlide({
  el: '.playing_list_mask',
  right() {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox.stop().slideUp(_speed, () => {
      $playingListWrap.stop().fadeOut(_speed);
    });
  },
});
_mySlide({
  el: '.video_box',
  right(e) {
    if (_getTarget(this, e, '.video_box', 1)) {
      $musicMvWrap.find('.m_close').click();
    }
  },
});
// 歌词
_mySlide({
  el: '.lrc_box',
  right(e) {
    if (_getTarget(this, e, '.lrc_foot_wrap')) return;
    $lrcFootBtnWrap.find('.prev_play_btn').click();
  },
  left(e) {
    if (_getTarget(this, e, '.lrc_foot_wrap')) return;
    $lrcFootBtnWrap.find('.next_play').click();
  },
});
// 自动触发定时函数
function zidonghide(timemax, el, ell, fn, fn2, fel) {
  let time = timemax,
    timer = null;
  function fun() {
    time--;
    if (time <= 0) {
      fn2();
      return;
    }
    timer = _setTimeout(fun, 1000);
  }
  $(el)
    .on('mouseup touchstart mousemove', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      time = timemax;
      if (!_getTarget(this, e, fel)) {
        fn();
      }
      if (_getTarget(this, e, ell) && dmwidth > _d.screen) return;
      fun();
    })
    .on('mouseleave', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      fn2();
    });
}
zidonghide(
  10,
  '.lrc_box',
  '.lrc_foot_wrap',
  debounce(
    function () {
      $lrcFootWrap.stop().slideDown(_speed, () => {
        $lrcFootWrap._flag = 'y';
        lrcScroll();
      });
    },
    500,
    true
  ),
  debounce(
    function () {
      $lrcFootWrap.stop().slideUp(_speed, () => {
        $lrcFootWrap._flag = 'n';
        lrcScroll();
      });
    },
    500,
    true
  ),
  '.lrc_menu_wrap'
);
