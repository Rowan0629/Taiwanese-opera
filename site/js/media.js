/* 圖片與影片的「預留圖」切換：
   - <figure class="media" data-image="檔名" data-alt="替代文字">：檔案存在就換成真圖，否則維持預留圖
   - <div class="video-slot" data-youtube="影片代號">：沒有代號顯示預留框；有代號則顯示「播放」按鈕，
     按了才載入 YouTube（一次只會有一支）
   - <section id="intro">：首頁片頭動畫，intro.mp4 存在才顯示 */
(function () {
  'use strict';
  var O = window.OPERA;

  /* ---------- 圖片 ---------- */
  function mountImage(fig, file, alt) {
    var ph = fig.querySelector('.ph');
    if (!file || !ph) return;
    var img = new Image();
    img.className = 'media-img';
    img.alt = alt || '';
    img.onload = function () {
      if (ph.parentNode) ph.parentNode.replaceChild(img, ph);
    };
    img.src = 'assets/images/' + file;
  }
  O.media = { mountImage: mountImage };

  var figs = document.querySelectorAll('figure.media[data-image]');
  for (var i = 0; i < figs.length; i++) {
    mountImage(figs[i], figs[i].getAttribute('data-image'), figs[i].getAttribute('data-alt'));
  }

  /* ---------- YouTube ---------- */
  var ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
  var slots = [];

  function resetSlot(slot) {
    var id = slot.getAttribute('data-youtube');
    var title = slot.getAttribute('data-title') || '影片';
    slot.textContent = '';
    var poster = slot.getAttribute('data-poster');
    var btn = O.el('button', { type: 'button', class: 'video-play' });
    if (poster) {
      /* 直式影片的封面：完整顯示在深色框中間；圖載入失敗就退回純色按鈕 */
      var img = O.el('img', { class: 'video-poster', src: poster, alt: '' });
      img.addEventListener('error', function () {
        btn.classList.remove('has-poster');
        if (img.parentNode) img.parentNode.removeChild(img);
      });
      btn.classList.add('has-poster');
      btn.appendChild(img);
    }
    btn.appendChild(O.el('span', { class: 'play-icon', 'aria-hidden': 'true' }, '▶'));
    btn.appendChild(O.el('span', { class: 'video-play-label' }, '播放：' + title));
    btn.addEventListener('click', function () {
      slots.forEach(function (s) {
        if (s !== slot && s.querySelector('iframe')) resetSlot(s);
      });
      load(slot, id, title);
    });
    slot.appendChild(btn);
  }

  function load(slot, id, title) {
    slot.textContent = '';
    var frame = O.el('iframe', {
      class: 'video-frame',
      src: 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1',
      title: title,
      loading: 'lazy',
      allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture',
      referrerpolicy: 'strict-origin-when-cross-origin',
      allowfullscreen: ''
    });
    slot.appendChild(frame);
    var p = O.el('p', { class: 'video-fallback' });
    p.appendChild(document.createTextNode('影片無法播放？ '));
    p.appendChild(O.el('a', {
      href: 'https://www.youtube.com/watch?v=' + id,
      target: '_blank',
      rel: 'noopener noreferrer'
    }, '到 YouTube 觀看'));
    slot.appendChild(p);
  }

  var vs = document.querySelectorAll('.video-slot');
  for (var j = 0; j < vs.length; j++) {
    var slot = vs[j];
    var vid = (slot.getAttribute('data-youtube') || '').trim();
    if (ID_PATTERN.test(vid)) {
      slot.setAttribute('data-youtube', vid);
      slots.push(slot);
      resetSlot(slot);
    }
    /* 沒有代號：保留 HTML 裡寫好的「影片準備中」預留框 */
  }

  /* ---------- 首頁片頭動畫 ---------- */
  var intro = document.getElementById('intro');
  if (intro) {
    var frame = document.getElementById('intro-frame');
    var controls = document.getElementById('intro-controls');
    var playBtn = document.getElementById('intro-play');
    var soundBtn = document.getElementById('intro-sound');
    var ph = frame.querySelector('.ph');

    var v = document.createElement('video');
    v.className = 'intro-video';
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.preload = 'metadata';
    v.poster = 'assets/video/intro-poster.jpg';
    v.setAttribute('aria-label', '歌仔戲片頭動畫');

    function renderButtons() {
      playBtn.textContent = v.paused ? '播放' : '暫停';
      soundBtn.textContent = v.muted ? '開聲音' : '關聲音';
      soundBtn.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
    }

    v.addEventListener('loadedmetadata', function () {
      if (ph && ph.parentNode) frame.replaceChild(v, ph);
      controls.hidden = false;
      renderButtons();
      /* 使用者設定了「減少動態效果」時，不自動播放，只顯示封面 */
      if (!O.reducedMotion()) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
    ['play', 'pause', 'ended', 'volumechange'].forEach(function (ev) {
      v.addEventListener(ev, renderButtons);
    });
    /* 載入失敗：維持預留框，不顯示控制按鈕 */
    v.addEventListener('error', function () {
      controls.hidden = true;
    });

    playBtn.addEventListener('click', function () {
      if (v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
    soundBtn.addEventListener('click', function () {
      v.muted = !v.muted;
    });

    v.src = 'assets/video/intro.mp4';
  }
})();
