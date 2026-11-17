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
        { id: 'jing', a: '淨', b: '又稱「花面」，臉上畫著花臉的角色' },
        { id: 'kudan', a: '苦旦', b: '常演命運坎坷、受苦的女性，也叫青衣' },
        { id: 'laosheng', a: '老生', b: '年長的男性角色' },
        { id: 'caidan', a: '彩旦', b: '滑稽的女性角色' },
        { id: 'longtao', a: '龍套', b: '跑龍套的配角，例如士兵、隨從' }
      ]
    },
    {
      deckId: 'instruments',
      deckName: '樂器配名稱',
      pairs: [
        { id: 'kezixian', a: '殼仔弦', b: '用椰子殼當共鳴箱的拉弦樂器' },
        { id: 'yueqin', a: '月琴', b: '圓形共鳴箱、用手指或撥片彈奏的樂器' },
        { id: 'dongxiao', a: '洞簫', b: '豎著吹的竹管樂器，聲音柔和' },
        { id: 'di', a: '笛子', b: '橫著吹的竹管樂器' },
        { id: 'sanxian', a: '三弦', b: '有三條弦的彈撥樂器' },
        { id: 'daluo', a: '大鑼', b: '武場的打擊樂器，聲音響亮' },
        { id: 'bangzi', a: '梆子', b: '木製的打擊樂器，敲出清脆的節拍' },
        { id: 'bo', a: '鈸', b: '兩片圓形銅片，互相拍擊發出聲響' }
      ]
    },
    {
      deckId: 'xianxi',
      deckName: '扮仙儀式配說明',
      pairs: [
        { id: 'banxian', a: '扮仙', b: '正戲開演前，先演給神明的祝賀短戲' },
        { id: 'zuibaxian', a: '醉八仙', b: '八位仙人上場的扮仙戲，最常見' },
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
    { id: 'q7', image: '', imageAlt: '', answer: '彩旦' },
    { id: 'q8', image: '', imageAlt: '', answer: '龍套' }
  ]
};
