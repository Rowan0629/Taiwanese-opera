/* 共用的小工具：小記憶區（localStorage）、單元清單、動態偏好。
   所有檔案都掛在同一個 window.OPERA 底下，不使用模組，雙擊 index.html 也能運作。 */
(function () {
  'use strict';
  var O = (window.OPERA = window.OPERA || {});

  /* localStorage 可能被禁用（無痕模式等），每次讀寫都包 try/catch */
  var canStore = false;
  try {
    var probe = '__opera_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    canStore = true;
  } catch (e) {
    canStore = false;
  }

  O.store = {
    available: canStore,
    get: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  O.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /* 單元清單：順序就是「上一頁、下一頁」的順序 */
  O.units = [
    { id: 'history', name: '起源與歷史', nav: '歷史', href: 'history.html' },
    { id: 'performance', name: '演出形式', nav: '演出形式', href: 'performance.html' },
    { id: 'roles', name: '角色行當', nav: '行當', href: 'roles.html' },
    { id: 'xianxi', name: '扮仙儀式', nav: '扮仙', href: 'xianxi.html' },
    { id: 'music', name: '經典四大曲調', nav: '曲調', href: 'music.html' },
    { id: 'costume', name: '服裝道具', nav: '服裝道具', href: 'costume.html' },
    { id: 'backstage', name: '後台秘辛', nav: '後台秘辛', href: 'backstage.html' },
    { id: 'games', name: '小遊戲', nav: '小遊戲', href: 'games.html' }
  ];

  /* 建立元素的小幫手：文字一律用 textContent，不當 HTML 解析 */
  O.el = function (tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  };

  O.shuffle = function (list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };
})();
