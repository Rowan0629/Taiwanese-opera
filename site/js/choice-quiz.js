/* 選擇題：每次從題庫隨機抽 10 題，答完顯示一句解說 */
(function () {
  'use strict';
  var O = window.OPERA;
  var root = document.getElementById('panel-choice');
  if (!root || !O.cards || !O.cards.choice) return;

  var PER_GAME = 10;

  var startBox = document.getElementById('c-start');
  var startBtn = document.getElementById('c-begin');
  var game = document.getElementById('c-game');
  var progress = document.getElementById('c-progress');
  var question = document.getElementById('c-question');
  var optionsBox = document.getElementById('c-options');
  var feedback = document.getElementById('c-feedback');
  var explain = document.getElementById('c-explain');
  var nextBtn = document.getElementById('c-next');
  var resultBox = document.getElementById('c-result');

  var quiz = null;

  function begin() {
    quiz = { items: O.shuffle(O.cards.choice).slice(0, PER_GAME), index: 0, score: 0, answered: false };
    resultBox.hidden = true;
    resultBox.textContent = '';
    startBox.hidden = true;
    game.hidden = false;
    show();
  }

  function show() {
    var item = quiz.items[quiz.index];
    quiz.answered = false;
    progress.textContent = '第 ' + (quiz.index + 1) + ' / ' + quiz.items.length + ' 題';
    question.textContent = item.q;
    optionsBox.textContent = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    explain.textContent = '';
    nextBtn.hidden = true;

    O.shuffle(item.options).forEach(function (opt) {
      var b = O.el('button', { type: 'button', class: 'option' }, opt);
      b.setAttribute('data-value', opt);
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
      if (buttons[i].getAttribute('data-value') === item.answer) {
        buttons[i].classList.add('correct');
        buttons[i].textContent = item.answer + '（正確答案）';
      }
    }
    if (!right) btn.classList.add('wrong');

    feedback.textContent = right ? '答對了！' : '答錯了。正確答案是「' + item.answer + '」。';
    feedback.className = 'feedback ' + (right ? 'good' : 'bad');
    explain.textContent = item.explain;
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
    var again = O.el('button', { type: 'button', class: 'btn' }, '再玩一次');
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
