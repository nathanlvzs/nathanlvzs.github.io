/* 麻将核心算法: 胡牌判定 / 向听数 / 有效进张 / 牌效最优打法 / 番型
   约定: 牌编号 0-8万 9-17筒 18-26条 27-33字 */
(function (global) {
  'use strict';

  var N = 34;

  function countsOf(tiles) {
    var c = new Array(N);
    for (var i = 0; i < N; i++) c[i] = 0;
    for (var k = 0; k < tiles.length; k++) c[tiles[k]]++;
    return c;
  }

  /* 递归判断剩余牌能否拆成 need 个面子(刻子或顺子) */
  function canFormSets(c, need, tripletsOnly) {
    if (need === 0) {
      for (var i = 0; i < N; i++) if (c[i] !== 0) return false;
      return true;
    }
    var j = 0;
    while (j < N && c[j] === 0) j++;
    if (j >= N) return false;
    if (c[j] >= 3) {
      c[j] -= 3;
      if (canFormSets(c, need - 1, tripletsOnly)) { c[j] += 3; return true; }
      c[j] += 3;
    }
    if (!tripletsOnly && j < 27 && (j % 9) <= 6 && c[j + 1] > 0 && c[j + 2] > 0) {
      c[j]--; c[j + 1]--; c[j + 2]--;
      if (canFormSets(c, need - 1, tripletsOnly)) { c[j]++; c[j + 1]++; c[j + 2]++; return true; }
      c[j]++; c[j + 1]++; c[j + 2]++;
    }
    return false;
  }

  function isStandardWin(c, meldN) {
    var need = 4 - (meldN || 0);
    var copy = c.slice();
    for (var i = 0; i < N; i++) {
      if (copy[i] >= 2) {
        copy[i] -= 2;
        if (canFormSets(copy, need, false)) { copy[i] += 2; return true; }
        copy[i] += 2;
      }
    }
    return false;
  }

  function isSevenPairs(c, meldN) {
    if (meldN) return false;
    var pairs = 0;
    for (var i = 0; i < N; i++) {
      if (c[i] === 0) continue;
      if (c[i] === 2) pairs += 1;
      else if (c[i] === 4) pairs += 2;
      else return false;
    }
    return pairs === 7;
  }

  function isWin(c, meldN) {
    return isStandardWin(c, meldN || 0) || isSevenPairs(c, meldN || 0);
  }

  /* 标准型向听数: 8 - 2*面子 - 搭子 - 雀头 (块数上限 5) */
  function shantenStd(c0, meldN) {
    var c = c0.slice();
    var best = 8;
    function dfs(i, m, p, pair) {
      while (i < N && c[i] === 0) i++;
      if (i >= N) {
        var mm = m, pp = p, pr = pair;
        if (mm + pp + pr > 5) pp = Math.max(0, 5 - mm - pr);
        if (mm + pp + pr > 5) { pr = 0; pp = Math.max(0, 5 - mm); }
        var sh = 8 - 2 * mm - pp - pr;
        if (pr === 0 && mm + pp === 5) sh += 1;
        if (sh < best) best = sh;
        return;
      }
      var room = (m + p + pair) < 5;
      if (room) {
        if (c[i] >= 3) { c[i] -= 3; dfs(i, m + 1, p, pair); c[i] += 3; }
        if (i < 27 && (i % 9) <= 6 && c[i + 1] > 0 && c[i + 2] > 0) {
          c[i]--; c[i + 1]--; c[i + 2]--;
          dfs(i, m + 1, p, pair);
          c[i]++; c[i + 1]++; c[i + 2]++;
        }
        if (c[i] >= 2) {
          c[i] -= 2;
          if (!pair) dfs(i, m, p, 1);
          dfs(i, m, p + 1, pair);
          c[i] += 2;
        }
        if (i < 27 && (i % 9) <= 7 && c[i + 1] > 0) { c[i]--; c[i + 1]--; dfs(i, m, p + 1, pair); c[i]++; c[i + 1]++; }
        if (i < 27 && (i % 9) <= 6 && c[i + 2] > 0) { c[i]--; c[i + 2]--; dfs(i, m, p + 1, pair); c[i]++; c[i + 2]++; }
      }
      var n = c[i];
      c[i] = 0;
      dfs(i + 1, m, p, pair);
      c[i] = n;
    }
    dfs(0, meldN || 0, 0, 0);
    return best;
  }

  function shanten7(c) {
    var pairs = 0, kinds = 0;
    for (var i = 0; i < N; i++) {
      if (c[i] > 0) kinds++;
      if (c[i] >= 2) pairs += Math.floor(c[i] / 2);
    }
    var sh = 6 - pairs;
    if (kinds < 7) sh += 7 - kinds;
    return sh;
  }

  function shanten(c, meldN) {
    var s = shantenStd(c, meldN || 0);
    if (!meldN) {
      var s7 = shanten7(c);
      if (s7 < s) s = s7;
    }
    return s;
  }

  /* 摸到哪些牌可以降低向听数. remaining: 各牌未见张数 */
  function usefulTiles(c, meldN, remaining) {
    var cur = shanten(c, meldN || 0);
    var res = [];
    for (var t = 0; t < N; t++) {
      if (c[t] >= 4) continue;
      var rem = remaining ? remaining[t] : (4 - c[t]);
      if (rem <= 0) continue;
      // 只考虑与手牌有关联的牌(提速且不影响正确性)
      var related = c[t] >= 1;
      if (!related && t < 27) {
        var r = t % 9;
        if ((r >= 1 && c[t - 1] > 0) || (r <= 7 && c[t + 1] > 0) ||
          (r >= 2 && c[t - 2] > 0) || (r <= 6 && c[t + 2] > 0)) related = true;
      }
      if (!related) continue;
      c[t]++;
      var s = shanten(c, meldN || 0);
      c[t]--;
      if (s < cur) res.push({ tile: t, count: rem });
    }
    res.sort(function (a, b) { return b.count - a.count || a.tile - b.tile; });
    return res;
  }

  /* 当前 13 张(听牌状态)时, 能胡的牌 */
  function waitingTiles(c, meldN, remaining) {
    var waits = [];
    for (var t = 0; t < N; t++) {
      if (c[t] >= 4) continue;
      c[t]++;
      if (isWin(c, meldN || 0)) {
        var rem = remaining ? remaining[t] : (4 - c[t] + 1);
        waits.push({ tile: t, count: rem });
      }
      c[t]--;
    }
    return waits;
  }

  /* 枚举所有可打的牌, 按 (向听数, 进张枚数) 排序, 返回最优打法 */
  function analyzeDiscards(tiles, meldN, remaining) {
    var seen = {}, out = [];
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      if (seen[t]) continue;
      seen[t] = 1;
      var rest = tiles.slice();
      rest.splice(i, 1);
      var c = countsOf(rest);
      var sh = shanten(c, meldN || 0);
      var useful = sh > 0 ? usefulTiles(c, meldN || 0, remaining) : waitingTiles(c, meldN || 0, remaining);
      var total = 0;
      for (var k = 0; k < useful.length; k++) total += useful[k].count;
      out.push({ tile: t, shanten: sh, useful: useful, total: total });
    }
    out.sort(function (a, b) {
      return a.shanten - b.shanten || b.total - a.total || a.tile - b.tile;
    });
    return out;
  }

  /* 番型评估 (广东推倒胡 简化番种表) */
  function evaluateFan(handTiles, melds, winTile, ctx) {
    ctx = ctx || {};
    var all = handTiles.slice();
    var meldTiles = [];
    for (var i = 0; i < melds.length; i++) meldTiles = meldTiles.concat(melds[i].tiles);
    all = all.concat(meldTiles);
    var c = countsOf(all);
    var meldN = melds.length;
    var fans = [];
    var total = 0;
    function add(name, n) { fans.push({ name: name, fan: n }); total += n; }

    var seven = isSevenPairs(countsOf(handTiles), meldN);
    if (seven) {
      var long = false;
      for (var t = 0; t < N; t++) if (c[t] === 4) long = true;
      if (long) add('豪华七小对', 4); else add('七小对', 2);
    }

    // 碰碰胡
    var allTriplet = seven ? false : (function () {
      for (var m = 0; m < melds.length; m++) {
        var mt = melds[m].tiles;
        if (!(mt[0] === mt[1] && mt[1] === mt[2])) return false;
      }
      var cc = countsOf(handTiles);
      return canFormSets(cc, 4 - meldN, true) || (function () {
        for (var x = 0; x < N; x++) if (cc[x] >= 2) { cc[x] -= 2; if (canFormSets(cc, 4 - meldN, true)) { cc[x] += 2; return true; } cc[x] += 2; }
        return false;
      })();
    })();
    if (allTriplet) add('碰碰胡', 2);

    // 花色
    var suits = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (var y = 0; y < N; y++) if (c[y] > 0) suits[y < 27 ? Math.floor(y / 9) : 3] += c[y];
    var numSuit = 0, honor = suits[3];
    for (var s = 0; s < 3; s++) if (suits[s] > 0) numSuit++;
    if (numSuit === 0 && honor > 0) add('字一色', 8);
    else if (numSuit === 1 && honor === 0) add('清一色', 6);
    else if (numSuit === 1 && honor > 0) add('混一色', 2);
    if (honor === 0 && numSuit > 0) add('无字', 1);

    // 三元 / 四喜
    function tripletCount(start, end) {
      var n = 0;
      for (var i = start; i <= end; i++) if (c[i] >= 3) n++;
      return n;
    }
    function pairCount(start, end) {
      var n = 0;
      for (var i = start; i <= end; i++) if (c[i] === 2) n++;
      return n;
    }
    var dragons = tripletCount(31, 33);
    var winds = tripletCount(27, 30);
    var pairD = pairCount(31, 33);
    var pairW = pairCount(27, 30);
    if (dragons === 3) add('大三元', 8);
    else if (dragons === 2 && pairD === 1) add('小三元', 4);
    if (winds === 4) add('大四喜', 13);
    else if (winds === 3 && pairW === 1) add('小四喜', 6);

    if (meldN === 0) add('门前清', 1);
    if (ctx.selfDraw) add('自摸', 1);
    if (ctx.lastTile) add('海底捞月', 2);
    if (ctx.rinshan) add('杠上开花', 2);
    if (ctx.kongRob) add('抢杠胡', 2);

    if (total === 0) add('鸡胡', 0);
    return { fans: fans, total: total };
  }

  global.MJ = {
    countsOf: countsOf,
    isWin: isWin,
    shanten: shanten,
    shantenStd: shantenStd,
    shanten7: shanten7,
    usefulTiles: usefulTiles,
    waitingTiles: waitingTiles,
    analyzeDiscards: analyzeDiscards,
    evaluateFan: evaluateFan
  };
})(typeof window !== 'undefined' ? window : global);
