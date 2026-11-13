/* 名詞解釋：頁面上寫 <button class="term" data-term="詞條代號">名詞</button>，
   點一下彈出小卡；再點一下、點旁邊、按 Esc 都會收起。 */
(function () {
  'use strict';
  var O = window.OPERA;
  var list = O.glossary || [];
  var pop = null;
  var current = null;

  function find(id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function close(returnFocus) {
    if (!pop) return;
    pop.remove();
    pop = null;
    if (current) {
      current.setAttribute('aria-expanded', 'false');
      current.removeAttribute('aria-describedby');
      if (returnFocus) current.focus();
    }
    current = null;
  }

  function open(btn) {
    var entry = find(btn.getAttribute('data-term'));
    pop = O.el('div', { class: 'term-pop', role: 'tooltip', id: 'term-pop' });
    pop.appendChild(O.el('strong', null, entry ? entry.term : btn.textContent));
    pop.appendChild(O.el('span', null, entry ? entry.meaning : '（這個名詞的解釋準備中）'));
    document.body.appendChild(pop);
    current = btn;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-describedby', 'term-pop');

    /* 放在按鈕下方，並確保不超出畫面左右 */
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth;
    var left = r.left + window.pageXOffset;
    var maxLeft = window.pageXOffset + document.documentElement.clientWidth - w - 8;
    left = Math.max(window.pageXOffset + 8, Math.min(left, maxLeft));
    pop.style.left = left + 'px';
    pop.style.top = r.bottom + window.pageYOffset + 6 + 'px';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.term') : null;
    if (btn) {
      var same = btn === current;
      close(false);
      if (!same) open(btn);
      return;
    }
    if (pop && !pop.contains(e.target)) close(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close(true);
  });
  window.addEventListener('resize', function () {
    close(false);
  });

  /* 沒有 aria-expanded 的按鈕先補上初始值 */
  var terms = document.querySelectorAll('.term');
  for (var i = 0; i < terms.length; i++) {
    terms[i].setAttribute('type', 'button');
    terms[i].setAttribute('aria-expanded', 'false');
  }
})();
