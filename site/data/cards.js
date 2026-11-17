/* 翻牌牌組與小測驗題目。
   牌組每一對：id（配對代號）、a（A 面：名稱）、b（B 面：說明）
   測驗題目：image（圖片檔名，放在 assets/images/；階段一留空 → 顯示灰色預留圖）、
             imageAlt（圖片的替代文字）、answer（正確答案，必須是某個行當名稱） */
window.OPERA = window.OPERA || {};
window.OPERA.cards = {
  decks: [
    {
      deckId: 'roles',
      deckName: '行當配名稱',
      pairs: [
        { id: 'sheng', a: '生', b: '男性角色，分文生、武生、老生、囝仔生' },
        { id: 'dan', a: '旦', b: '女性角色，有年輕的，也有年長的' },
        { id: 'chou', a: '丑', b: '逗趣的角色，說話和動作都很詼諧' },
        { id: 'jing', a: '淨', b: '又稱「花臉或花面」，臉上畫著花臉的角色' },
        { id: 'kudan', a: '苦旦', b: '常演命運坎坷、受苦的女性，又稱青衣' },
        { id: 'laosheng', a: '老生', b: '年長的男性角色' },
        { id: 'sanba', a: '三八', b: '滑稽的女性角色' },
        { id: 'longtao', a: '龍套', b: '通常扮演士兵、隨從這類配角，人數多，讓舞台更熱鬧' }
      ]
    },
    {
      deckId: 'xianxi',
      deckName: '扮仙儀式配說明',
      pairs: [
        { id: 'banxian', a: '扮仙', b: '正戲開演前，先演給神明的祝賀短戲' },
        { id: 'zuibaxian', a: '醉八仙', b: '八位仙人上場的扮仙戲' },
        { id: 'sanxianhui', a: '三仙會', b: '三位仙人上場祝賀的扮仙戲' },
        { id: 'tianguan', a: '天官賜福', b: '天官降臨、賜福給大家的扮仙戲' },
        { id: 'tiandu', a: '田都元帥', b: '戲曲行業的守護神，演出前常先祭拜' }
      ]
    }
  ],
  quiz: [
    { id: 'q1', image: '', imageAlt: '', answer: '生' },
    { id: 'q2', image: '', imageAlt: '', answer: '旦' },
    { id: 'q3', image: '', imageAlt: '', answer: '丑' },
    { id: 'q4', image: '', imageAlt: '', answer: '淨' },
    { id: 'q5', image: '', imageAlt: '', answer: '苦旦' },
    { id: 'q6', image: '', imageAlt: '', answer: '老生' },
    { id: 'q7', image: '', imageAlt: '', answer: '三八' },
    { id: 'q8', image: '', imageAlt: '', answer: '龍套' }
  ]
};
