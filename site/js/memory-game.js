/* 翻牌配對 */
(function () {
  'use strict';
  var O = window.OPERA;
  var root = document.getElementById('panel-memory');
  if (!root || !O.cards) return;

  var DIFFS = [
    { id: 'easy', name: '簡單（4 對）', pairs: 4 },
    { id: 'normal', name: '普通（6 對）', pairs: 6 },
    { id: 'hard', name: '困難（8 對）', pairs: 8 }
  ];

  var form = document.getElementById('memory-setup');
  var deckBox = document.getElementById('m-decks');
  var diffBox = document.getElementById('m-diffs');
  var bestLine = document.getElementById('m-best');
  var play = document.getElementById('memory-play');
  var board = document.getElementById('m-board');
  var stepsEl = document.getElementById('m-steps');
  var timeEl = document.getElementById('m-time');
  var note = document.getElementById('m-note');
  var result = document.getElementById('m-result');
  var againBtn = document.getElementById('m-again');
  var backBtn = document.getElementById('m-back');

  /* ---------- 選項（由資料產生） ---------- */
  function radio(box, name, value, label, checked) {
    var wrap = O.el('label', { class: 'choice' });
    var input = O.el('input', { type: 'radio', name: name, value: value });
    if (checked) input.checked = true;
    wrap.appendChild(input);
    wrap.appendChild(O.el('span', null, label));
    box.appendChild(wrap);
  }
  O.cards.decks.forEach(function (d, i) {
    radio(deckBox, 'deck', d.deckId, d.deckName, i === 0);
  });
  DIFFS.forEach(function (d, i) {
    radio(diffBox, 'diff', d.id, d.name, i === 0);
  });

  function selected(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }
  function findDeck(id) {
    return O.cards.decks.filter(function (d) {
      return d.deckId === id;
    })[0];
  }
  function findDiff(id) {
    return DIFFS.filter(function (d) {
      return d.id === id;
    })[0];
  }

  /* ---------- 最佳成績（localStorage，讀取時一律檢查格式） ---------- */
  function recordKey(deckKey, diffId) {
    return 'opera:best:' + deckKey + ':' + diffId;
  }
  function readBest(deckKey, diffId) {
    var raw = O.store.get(recordKey(deckKey, diffId));
    if (!raw) return null;
    try {
      var o = JSON.parse(raw);
      if (
        o &&
        typeof o.steps === 'number' &&
        typeof o.seconds === 'number' &&
        isFinite(o.steps) &&
        isFinite(o.seconds) &&
        o.steps >= 1 &&
        o.steps <= 9999 &&
        o.seconds >= 0 &&
        o.seconds <= 99999
      ) {
        return { steps: Math.floor(o.steps), seconds: Math.floor(o.seconds) };
      }
    } catch (e) {}
    return null;
  }
  function isBetter(a, b) {
    return a.steps < b.steps || (a.steps === b.steps && a.seconds < b.seconds);
  }
  function describe(r) {
    return r.steps + ' 步、' + r.seconds + ' 秒';
  }

  /* 設定畫面上，顯示目前選擇的最佳紀錄（若該牌組不足，實際會用混合牌組，這裡以原牌組為準預告） */
  function resolveSource(deckId, diffId) {
    var diff = findDiff(diffId);
    var deck = findDeck(deckId);
    if (deck.pairs.length >= diff.pairs) return { key: deck.deckId, pairs: deck.pairs, mixed: false, need: diff.pairs };
    var pool = [];
    O.cards.decks.forEach(function (d) {
      pool = pool.concat(d.pairs);
    });
    return { key: 'mixed', pairs: pool, mixed: true, need: diff.pairs };
  }
  function showBestInSetup() {
    var src = resolveSource(selected('deck'), selected('diff'));
    var text = '';
    if (!O.store.available) {
      text = '這個瀏覽器無法記錄成績。';
    } else {
      var b = readBest(src.key, selected('diff'));
      text = b ? '你的最佳紀錄：' + describe(b) + '（只存在這個瀏覽器）' : '還沒有紀錄，玩完一局就會記下來（只存在這個瀏覽器）。';
    }
    if (src.mixed) text = '這個牌組的對數不夠，這個難度會改用「混合牌組」。' + text;
    bestLine.textContent = text;
  }
  form.addEventListener('change', showBestInSetup);
  showBestInSetup();

  /* ---------- 遊戲狀態 ---------- */
  var st = null;
  var timer = null;

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function elapsed() {
    return st && st.startTime ? Math.max(1, Math.round((Date.now() - st.startTime) / 1000)) : 0;
  }
  function renderStats() {
    stepsEl.textContent = st.steps;
    timeEl.textContent = st.startTime ? elapsed() : 0;
  }

  function cardLabel(c, idx) {
    if (c.matched) return '第 ' + (idx + 1) + ' 張，已配對：' + c.text;
    if (c.flipped) return '第 ' + (idx + 1) + ' 張，翻開：' + c.text;
    return '第 ' + (idx + 1) + ' 張，還沒翻開';
  }
  function renderCard(i) {
    var c = st.cards[i];
    var b = c.node;
    b.className = 'mcard' + (c.flipped || c.matched ? ' flipped' : '') + (c.matched ? ' matched' : '');
    b.setAttribute('aria-label', cardLabel(c, i));
    b.setAttribute('aria-disabled', c.matched || c.flipped ? 'true' : 'false');
  }

  function start(deckId, diffId) {
    var src = resolveSource(deckId, diffId);
    var chosen = O.shuffle(src.pairs).slice(0, src.need);
    var cards = [];
    chosen.forEach(function (p) {
      cards.push({ pairId: p.id, text: p.a, flipped: false, matched: false });
      cards.push({ pairId: p.id, text: p.b, flipped: false, matched: false });
    });
    cards = O.shuffle(cards);

    stopTimer();
    st = {
      cards: cards,
      key: src.key,
      diffId: diffId,
      open: [],
      steps: 0,
      matched: 0,
      startTime: null,
      lock: false
    };

    board.textContent = '';
    cards.forEach(function (c, i) {
      var b = O.el('button', { type: 'button', class: 'mcard' });
      b.appendChild(O.el('span', { class: 'mback', 'aria-hidden': 'true' }, '戲'));
      b.appendChild(O.el('span', { class: 'mface' }, c.text));
      b.addEventListener('click', function () {
        flip(i);
      });
      c.node = b;
      board.appendChild(b);
      renderCard(i);
    });

    note.textContent = src.mixed ? '這個牌組的對數不夠，這一局改用混合牌組。' : '';
    result.hidden = true;
    result.textContent = '';
    form.hidden = true;
    play.hidden = false;
    renderStats();
    var first = board.querySelector('button');
    if (first) first.focus();
  }

  function flip(i) {
    var c = st.cards[i];
    if (st.lock || c.flipped || c.matched) return;
    if (!st.startTime) {
      st.startTime = Date.now();
      timer = setInterval(renderStats, 500);
    }
    c.flipped = true;
    renderCard(i);
    O.sound.play('flip');
    st.open.push(i);
    if (st.open.length === 2) {
      st.steps++;
      renderStats();
      var a = st.cards[st.open[0]];
      var b = st.cards[st.open[1]];
      if (a.pairId === b.pairId) {
        a.matched = b.matched = true;
        renderCard(st.open[0]);
        renderCard(st.open[1]);
        st.open = [];
        st.matched++;
        if (st.matched * 2 === st.cards.length) finish();
        else O.sound.play('match');
      } else {
        st.lock = true;
        var pair = st.open.slice();
        O.sound.play('miss');
        setTimeout(function () {
          pair.forEach(function (idx) {
            st.cards[idx].flipped = false;
            renderCard(idx);
          });
          st.open = [];
          st.lock = false;
        }, 900);
      }
    }
  }

  function finish() {
    stopTimer();
    var seconds = elapsed();
    renderStats();
    var mine = { steps: st.steps, seconds: seconds };
    result.textContent = '';
    result.appendChild(O.el('p', { class: 'result-title' }, '全部配對完成！'));
    result.appendChild(O.el('p', null, '這一局：' + describe(mine)));

    if (!O.store.available) {
      result.appendChild(O.el('p', { class: 'hint' }, '這個瀏覽器無法記錄成績，這一局不會被保存。'));
    } else {
      var old = readBest(st.key, st.diffId);
      if (!old || isBetter(mine, old)) {
        O.store.set(recordKey(st.key, st.diffId), JSON.stringify(mine));
        result.appendChild(O.el('p', { class: 'record-new' }, '新紀錄！'));
      } else {
        result.appendChild(O.el('p', null, '你的最佳紀錄：' + describe(old)));
      }
      result.appendChild(O.el('p', { class: 'hint' }, '紀錄只存在這個瀏覽器，換裝置就看不到。'));
    }
    result.hidden = false;
    O.sound.play('win');
    againBtn.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    start(selected('deck'), selected('diff'));
  });
  againBtn.addEventListener('click', function () {
    start(selected('deck'), selected('diff'));
  });
  backBtn.addEventListener('click', function () {
    stopTimer();
    play.hidden = true;
    form.hidden = false;
    showBestInSetup();
  });
})();
