/* 內容多的單元頁：頁籤、一次只展開一張卡片、全部展開／收合。
   頁籤：<div data-tabs> 裡放數個 <section class="tab-panel" data-tab-title="名稱">，一次只顯示一個。
   卡片：同一個頁籤（或 [data-accordion]）裡，打開一張就會收起其他張。
   沒有 JavaScript 時，所有內容都直接顯示。 */
(function () {
  'use strict';
  var O = window.OPERA;
  var uid = 0;

  function initTabs(root) {
    var panels = Array.prototype.filter.call(root.children, function (n) {
      return n.classList.contains('tab-panel');
    });
    if (panels.length < 2) return;

    var list = O.el('div', {
      class: 'tablist',
      role: 'tablist',
      'aria-label': root.getAttribute('data-tabs-label') || '內容分類'
    });
    var tabs = panels.map(function (panel) {
      var id = 'tab-' + ++uid;
      var tab = O.el(
        'button',
        { type: 'button', class: 'tab', role: 'tab', id: id, 'aria-controls': id + '-panel' },
        panel.getAttribute('data-tab-title')
      );
      panel.id = id + '-panel';
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', id);
      list.appendChild(tab);
      return tab;
    });
    root.insertBefore(list, panels[0]);
    root.classList.add('tabs-ready');

    function select(index, focus) {
      panels.forEach(function (panel, i) {
        panel.hidden = i !== index;
        tabs[i].setAttribute('aria-selected', i === index ? 'true' : 'false');
        tabs[i].tabIndex = i === index ? 0 : -1;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(i, false);
      });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
      });
    });
    select(0, false);
  }

  /* 全部展開／全部收合 */
  function initTools(scope) {
    var cards = scope.querySelectorAll('details.card');
    if (cards.length < 2) return;
    var bar = O.el('div', { class: 'cards-tools' });
    [['全部展開', true], ['全部收合', false]].forEach(function (item) {
      var btn = O.el('button', { type: 'button', class: 'tool-btn' }, item[0]);
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(cards, function (card) {
          card.open = item[1];
        });
      });
      bar.appendChild(btn);
    });
    scope.insertBefore(bar, scope.firstChild);
  }

  /* 一次只展開一張：只處理使用者點卡片標題，不影響「全部展開」 */
  document.addEventListener('click', function (e) {
    var summary = e.target.closest && e.target.closest('details.card > summary');
    if (!summary) return;
    var card = summary.parentNode;
    if (card.open) return;
    var scope = card.closest('.tab-panel, [data-accordion]');
    if (!scope) return;
    Array.prototype.forEach.call(scope.querySelectorAll('details.card[open]'), function (other) {
      if (other !== card) other.open = false;
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), initTabs);
  Array.prototype.forEach.call(document.querySelectorAll('.tab-panel, [data-accordion]'), initTools);
})();
