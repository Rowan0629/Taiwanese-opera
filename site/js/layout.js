/* 每頁共用的導覽列與頁尾。目前所在的頁面由 <body data-page="..."> 決定。 */
(function () {
  'use strict';
  var O = window.OPERA;
  var page = document.body.getAttribute('data-page') || '';

  /* ---------- 導覽列 ---------- */
  var skip = O.el('a', { class: 'skip-link', href: '#main' }, '跳到主要內容');

  var header = O.el('header', { class: 'site-header' });
  var wrap = O.el('div', { class: 'wrap header-inner' });
  var brand = O.el('a', { class: 'brand', href: 'index.html' }, '歌仔戲小百科');
  if (page === 'home') brand.setAttribute('aria-current', 'page');

  var menuBtn = O.el('button', {
    type: 'button',
    class: 'menu-btn',
    'aria-expanded': 'false',
    'aria-controls': 'site-nav'
  }, '選單');

  var nav = O.el('nav', { id: 'site-nav', class: 'site-nav', 'aria-label': '主要導覽' });
  var ul = O.el('ul');
  O.units.concat([{ id: 'sources', name: '參考資料', nav: '參考資料', href: 'sources.html' }]).forEach(function (u) {
    var li = O.el('li');
    var a = O.el('a', { href: u.href }, u.nav);
    if (u.id === page) a.setAttribute('aria-current', 'page');
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);

  var soundBtn = O.el('button', { type: 'button', class: 'sound-btn', id: 'sound-toggle' });
  function renderSound() {
    var on = O.sound.isOn();
    soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundBtn.textContent = on ? '音效：開' : '音效：關';
  }
  soundBtn.addEventListener('click', function () {
    O.sound.set(!O.sound.isOn());
    O.sound.play('right'); // 打開時給一聲確認；關閉時 play 不會發聲
  });
  document.addEventListener('opera:sound-changed', renderSound);
  renderSound();

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!nav.classList.contains('open'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  wrap.appendChild(brand);
  wrap.appendChild(soundBtn);
  wrap.appendChild(menuBtn);
  wrap.appendChild(nav);
  header.appendChild(wrap);
  document.body.insertBefore(header, document.body.firstChild);
  document.body.insertBefore(skip, document.body.firstChild);

  /* ---------- 頁尾 ---------- */
  var footer = O.el('footer', { class: 'site-footer' });
  var inner = O.el('div', { class: 'wrap' });
  inner.appendChild(O.el('p', null, '歌仔戲小百科——帶沒接觸過歌仔戲的人，認識這門臺灣土生土長的戲曲。'));
  var p2 = O.el('p');
  p2.appendChild(document.createTextNode('本站為課堂期末作業。文字與圖片的來源請見'));
  p2.appendChild(O.el('a', { href: 'sources.html' }, '參考資料'));
  p2.appendChild(document.createTextNode('。'));
  inner.appendChild(p2);
  footer.appendChild(inner);
  document.body.appendChild(footer);
})();
