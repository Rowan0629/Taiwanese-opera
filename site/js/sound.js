/* 音效：由瀏覽器即時產生短短的「叮」聲，不使用音檔。預設關閉。 */
(function () {
  'use strict';
  var O = window.OPERA;
  var KEY = 'opera:sound';
  var on = O.store.get(KEY) === 'on';
  var ctx = null;

  function getCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
      } catch (e) {
        return null;
      }
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }

  function tone(c, freq, start, dur, type, vol) {
    var osc = c.createOscillator();
    var gain = c.createGain();
    var t0 = c.currentTime + start;
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /* 每個音效是一串 [頻率, 開始秒數, 長度秒數] */
  var SOUNDS = {
    flip: [[520, 0, 0.07]],
    match: [[660, 0, 0.1], [880, 0.1, 0.18]],
    miss: [[260, 0, 0.16]],
    right: [[660, 0, 0.1], [990, 0.1, 0.2]],
    wrong: [[300, 0, 0.12], [220, 0.12, 0.2]],
    win: [[660, 0, 0.12], [830, 0.12, 0.12], [990, 0.24, 0.12], [1320, 0.36, 0.3]]
  };

  O.sound = {
    isOn: function () {
      return on;
    },
    set: function (value) {
      on = !!value;
      O.store.set(KEY, on ? 'on' : 'off');
      document.dispatchEvent(new CustomEvent('opera:sound-changed', { detail: { on: on } }));
    },
    play: function (name) {
      if (!on || !SOUNDS[name]) return;
      var c = getCtx();
      if (!c) return;
      SOUNDS[name].forEach(function (n) {
        tone(c, n[0], n[1], n[2], 'sine', 0.15);
      });
    }
  };
})();
