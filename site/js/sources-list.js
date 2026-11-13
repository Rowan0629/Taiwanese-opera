/* 依 data/sources.js 產生出處清單：
   單元頁：<section data-sources="來源代號 來源代號">  → 「本頁參考資料」
   參考資料頁：<div id="all-sources">                  → 依單元分組的完整清單 */
(function () {
  'use strict';
  var O = window.OPERA;
  var all = O.sources || [];

  function byId(id) {
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function renderItem(s) {
    var li = O.el('li');
    li.appendChild(O.el('span', { class: 'tag' }, s.type === 'image' ? '圖片' : '文字'));
    li.appendChild(document.createTextNode(' ' + s.author + '〈' + s.title + '〉。'));
    if (s.url) {
      li.appendChild(document.createTextNode(' '));
      li.appendChild(O.el('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.url));
    }
    var meta = [];
    if (s.accessDate) meta.push('查閱日期 ' + s.accessDate);
    if (s.license) meta.push('授權：' + s.license);
    if (meta.length) li.appendChild(O.el('span', { class: 'meta' }, '（' + meta.join('；') + '）'));
    if (s.note) li.appendChild(O.el('span', { class: 'note' }, s.note));
    return li;
  }

  /* 單元頁底部 */
  var section = document.querySelector('[data-sources]');
  if (section) {
    var ids = section.getAttribute('data-sources').split(/\s+/).filter(Boolean);
    section.appendChild(O.el('h2', null, '本頁參考資料'));
    var ul = O.el('ul', { class: 'source-list' });
    ids.forEach(function (id) {
      var s = byId(id);
      if (s) ul.appendChild(renderItem(s));
    });
    section.appendChild(ul);
  }

  /* 參考資料頁 */
  var box = document.getElementById('all-sources');
  if (box) {
    O.units.forEach(function (u) {
      var items = all.filter(function (s) {
        return s.units.indexOf(u.id) !== -1;
      });
      if (!items.length) return;
      var h = O.el('h3', null, u.name);
      var ul2 = O.el('ul', { class: 'source-list' });
      items.forEach(function (s) {
        ul2.appendChild(renderItem(s));
      });
      box.appendChild(h);
      box.appendChild(ul2);
    });
  }
})();
