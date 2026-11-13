/* 看圖猜行當：選擇題 */
(function () {
  'use strict';
  var O = window.OPERA;
  var root = document.getElementById('panel-quiz');
  if (!root || !O.cards) return;

  var startBox = document.getElementById('q-start');
  var startBtn = document.getElementById('q-begin');
  var game = document.getElementById('q-game');
  var progress = document.getElementById('q-progress');
  var figure = document.getElementById('q-figure');
  var optionsBox = document.getElementById('q-options');
  var feedback = document.getElementById('q-feedback');
  var nextBtn = document.getElementById('q-next');
  var resultBox = document.getElementById('q-result');

  var quiz = null;

  function newFigure(item) {
    figure.textContent = '';
    var ph = O.el('div', { class: 'ph', role: 'img', 'aria-label': '圖片準備中' });
    ph.appendChild(O.el('span', null, '圖片準備中'));
    figure.appendChild(ph);
    if (item.image) O.media.mountImage(figure, item.image, item.imageAlt);
  }

  /* 選項：正確答案 + 其他題的答案當干擾項（最多 3 個），再洗牌 */
  function buildOptions(item) {
    var others = [];
    O.cards.quiz.forEach(function (q) {
      if (q.answer !== item.answer && others.indexOf(q.answer) === -1) others.push(q.answer);
    });
    return O.shuffle([item.answer].concat(O.shuffle(others).slice(0, 3)));
  }

  function begin() {
    quiz = { items: O.shuffle(O.cards.quiz), index: 0, score: 0, answered: false };
    resultBox.hidden = true;
    resultBox.textContent = '';
    startBox.hidden = true;
    game.hidden = false;
    show();
  }

  function show() {
    var item = quiz.items[quiz.index];
    quiz.answered = false;
    progress.textContent = '第 ' + (quiz.index + 1) + ' / ' + quiz.items.length + ' 題：這是哪一個行當？';
    newFigure(item);
    optionsBox.textContent = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    nextBtn.hidden = true;

    buildOptions(item).forEach(function (opt) {
      var b = O.el('button', { type: 'button', class: 'option' }, opt);
      b.addEventListener('click', function () {
        choose(b, opt, item);
      });
      optionsBox.appendChild(b);
    });
    var first = optionsBox.querySelector('button');
    if (first) first.focus();
  }

  function choose(btn, opt, item) {
    if (quiz.answered) return;
    quiz.answered = true;
    var right = opt === item.answer;
    if (right) quiz.score++;

    var buttons = optionsBox.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (buttons[i].textContent === item.answer) {
        buttons[i].classList.add('correct');
        buttons[i].textContent = item.answer + '（正確答案）';
      }
    }
    if (!right) btn.classList.add('wrong');

    feedback.textContent = right ? '答對了！' : '答錯了。正確答案是「' + item.answer + '」。';
    feedback.className = 'feedback ' + (right ? 'good' : 'bad');
    O.sound.play(right ? 'right' : 'wrong');

    var last = quiz.index === quiz.items.length - 1;
    nextBtn.textContent = last ? '看結果' : '下一題';
    nextBtn.hidden = false;
    nextBtn.focus();
  }

  function finish() {
    game.hidden = true;
    resultBox.textContent = '';
    resultBox.appendChild(O.el('p', { class: 'result-title' }, '測驗完成！'));
    resultBox.appendChild(O.el('p', null, '你答對了 ' + quiz.score + ' / ' + quiz.items.length + ' 題。'));
    var again = O.el('button', { type: 'button', class: 'btn' }, '重玩');
    again.addEventListener('click', begin);
    resultBox.appendChild(again);
    resultBox.hidden = false;
    O.sound.play('win');
    again.focus();
  }

  nextBtn.addEventListener('click', function () {
    if (quiz.index === quiz.items.length - 1) {
      finish();
    } else {
      quiz.index++;
      show();
    }
  });
  startBtn.addEventListener('click', begin);
})();
