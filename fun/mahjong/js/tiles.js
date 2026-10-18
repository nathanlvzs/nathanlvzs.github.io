/* 牌面 SVG 渲染
   牌编号: 0-8 一万~九万, 9-17 一筒~九筒, 18-26 一条~九条, 27-33 东南西北中发白 */
(function (global) {
  'use strict';

  var NUM_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var SUIT_CN = ['万', '筒', '条'];
  var HONOR = ['东', '南', '西', '北', '中', '发', '白'];
  var FONT = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";

  function parse(id) {
    if (id < 27) return { suit: Math.floor(id / 9), num: (id % 9) + 1 };
    return { suit: 3, num: id - 26 };
  }

  function tileName(id) {
    var p = parse(id);
    if (p.suit === 3) return HONOR[p.num - 1];
    return p.num + SUIT_CN[p.suit];
  }

  function shortName(id) {
    var p = parse(id);
    if (p.suit === 3) return HONOR[p.num - 1];
    return p.num + ['m', 'p', 's'][p.suit];
  }

  /* 筒子点位布局 */
  var DOTS = {
    1: [[30, 42]],
    2: [[30, 26], [30, 58]],
    3: [[17, 22], [30, 42], [43, 62]],
    4: [[18, 26], [42, 26], [18, 58], [42, 58]],
    5: [[18, 26], [42, 26], [30, 42], [18, 58], [42, 58]],
    6: [[18, 22], [42, 22], [18, 42], [42, 42], [18, 62], [42, 62]],
    7: [[17, 20], [30, 31], [43, 42], [18, 60], [42, 60], [18, 74], [42, 74]],
    8: [[18, 20], [42, 20], [18, 38], [42, 38], [18, 56], [42, 56], [18, 74], [42, 74]],
    9: [[16, 24], [30, 24], [44, 24], [16, 44], [30, 44], [44, 44], [16, 64], [30, 64], [44, 64]]
  };

  /* 条子点位布局 */
  var STICKS = {
    2: [[30, 27], [30, 57]],
    3: [[30, 22], [20, 54], [40, 54]],
    4: [[20, 27], [40, 27], [20, 57], [40, 57]],
    5: [[20, 26], [40, 26], [30, 42], [20, 58], [40, 58]],
    6: [[20, 24], [40, 24], [20, 42], [40, 42], [20, 60], [40, 60]],
    7: [[30, 20], [20, 40], [40, 40], [20, 60], [40, 60], [20, 74], [40, 74]],
    8: [[20, 19], [40, 19], [20, 37], [40, 37], [20, 55], [40, 55], [20, 73], [40, 73]],
    9: [[16, 24], [30, 24], [44, 24], [16, 44], [30, 44], [44, 44], [16, 64], [30, 64], [44, 64]]
  };

  function dot(x, y, r, c1) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c1 + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.6).toFixed(1) + '" fill="#fdfcf7"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.28).toFixed(1) + '" fill="' + c1 + '"/>';
  }

  function stick(x, y) {
    return '<g>' +
      '<rect x="' + (x - 2.4) + '" y="' + (y - 6.5) + '" width="4.8" height="13" rx="2.4" fill="#1f8a4c"/>' +
      '<rect x="' + (x - 3.4) + '" y="' + (y - 8.5) + '" width="6.8" height="2.6" rx="1.3" fill="#14663a"/>' +
      '<rect x="' + (x - 3.4) + '" y="' + (y + 5.9) + '" width="6.8" height="2.6" rx="1.3" fill="#14663a"/>' +
      '</g>';
  }

  function bird() {
    return '<g transform="translate(30,42)">' +
      '<path d="M-3,10 q-11,4 -3,14 q6,-8 11,-6 z" fill="#1c7a49"/>' +
      '<ellipse cx="0" cy="3" rx="9" ry="12" fill="#2f9e5f"/>' +
      '<path d="M-4,13 l-2,11 M4,13 l2,11" stroke="#c0392b" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-11" r="6.4" fill="#2f9e5f"/>' +
      '<path d="M2,-16 l9,-4 -3,6 z" fill="#e8a33d"/>' +
      '<circle cx="-1.6" cy="-12" r="1.7" fill="#fff"/><circle cx="-1.6" cy="-12" r="0.9" fill="#222"/>' +
      '</g>';
  }

  function inner(id) {
    var p = parse(id);
    if (p.suit === 0) {
      return '<text x="30" y="35" text-anchor="middle" font-size="30" font-weight="700" fill="#22201c" font-family="' + FONT + '">' + NUM_CN[p.num - 1] + '</text>' +
        '<text x="30" y="73" text-anchor="middle" font-size="25" font-weight="700" fill="#c0392b" font-family="' + FONT + '">\u842c</text>';
    }
    if (p.suit === 1) {
      if (p.num === 1) {
        return '<circle cx="30" cy="42" r="16" fill="#c0392b"/>' +
          '<circle cx="30" cy="42" r="12.5" fill="#fdfcf7"/>' +
          '<circle cx="30" cy="42" r="7.5" fill="#1b5fa8"/>' +
          '<circle cx="30" cy="42" r="3.2" fill="#fdfcf7"/>';
      }
      var d = DOTS[p.num], out = '';
      for (var i = 0; i < d.length; i++) {
        var col = (p.num === 9 || (p.num >= 5 && i % 2 === 0)) ? '#c0392b' : '#1b5fa8';
        out += dot(d[i][0], d[i][1], 5.6, col);
      }
      return out;
    }
    if (p.suit === 2) {
      if (p.num === 1) return bird();
      var s = STICKS[p.num], o = '';
      for (var j = 0; j < s.length; j++) o += stick(s[j][0], s[j][1]);
      return o;
    }
    var ch = HONOR[p.num - 1];
    if (p.num === 7) {
      return '<rect x="14" y="14" width="32" height="56" rx="4" fill="none" stroke="#1b5fa8" stroke-width="3.4"/>' +
        '<rect x="21" y="21" width="18" height="42" rx="2" fill="none" stroke="#1b5fa8" stroke-width="1.6"/>';
    }
    var colors = ['#1b3a6b', '#1b3a6b', '#1b3a6b', '#1b3a6b', '#c0392b', '#1e8a4c'];
    return '<text x="30" y="55" text-anchor="middle" font-size="35" font-weight="700" fill="' + colors[p.num - 1] + '" font-family="' + FONT + '">' + ch + '</text>';
  }

  var cache = {};
  function tileSvg(id) {
    if (cache[id]) return cache[id];
    var svg = '<svg class="tile-face" viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="1" y="1" width="58" height="82" rx="8" fill="#fdfbf3"/>' +
      '<rect x="1" y="1" width="58" height="82" rx="8" fill="none" stroke="#c9c0a8" stroke-width="1.6"/>' +
      '<rect x="4" y="4" width="52" height="76" rx="6" fill="none" stroke="#e3dcc8" stroke-width="1"/>' +
      inner(id) + '</svg>';
    cache[id] = svg;
    return svg;
  }

  var backCache = null;
  function backSvg() {
    if (backCache) return backCache;
    backCache = '<svg class="tile-face" viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2f8f5b"/><stop offset="1" stop-color="#1c6b41"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="58" height="82" rx="8" fill="#fdfbf3"/>' +
      '<rect x="3" y="3" width="54" height="78" rx="7" fill="url(#bg)" stroke="#12512f" stroke-width="1.4"/>' +
      '<path d="M12,20 h36 M12,28 h36 M12,56 h36 M12,64 h36" stroke="#42a86c" stroke-width="1.6" opacity="0.7"/>' +
      '<circle cx="30" cy="42" r="9" fill="#fdfbf3" opacity="0.9"/>' +
      '<circle cx="30" cy="42" r="4" fill="#1c6b41"/>' +
      '</svg>';
    return backCache;
  }

  global.Tiles = {
    tileSvg: tileSvg,
    backSvg: backSvg,
    tileName: tileName,
    shortName: shortName,
    parse: parse
  };
})(typeof window !== 'undefined' ? window : global);
