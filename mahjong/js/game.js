/* 广东麻将(推倒胡) · 速算训练 游戏主逻辑 */
(function () {
  'use strict';

  var T = window.Tiles, MJ = window.MJ;
  var $ = function (id) { return document.getElementById(id); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  var CFG_KEY = 'gdmj_cfg_v2', STAT_KEY = 'gdmj_stat_v2';

  var CFG = { limit: 5000, hint: 2, aiDelay: 280, showBest: false };
  try {
    var saved = JSON.parse(localStorage.getItem(CFG_KEY) || 'null');
    if (saved) for (var k in saved) CFG[k] = saved[k];
  } catch (e) { }
  function saveCfg() { try { localStorage.setItem(CFG_KEY, JSON.stringify(CFG)); } catch (e) { } }

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STAT_KEY) || 'null') || defStats(); } catch (e) { return defStats(); }
  }
  function defStats() {
    return { games: 0, wins: 0, turns: 0, decisions: 0, optimal: 0, timeSum: 0, bestMs: 0, bestFan: 0, winTurns: 0, timeouts: 0 };
  }
  function saveStats(s) { try { localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) { } }

  /* ---------------- 牌局状态 ---------------- */
  var G = null;
  var token = 0;
  var running = false;

  function deck() {
    var d = [];
    for (var i = 0; i < 34; i++) for (var k = 0; k < 4; k++) d.push(i);
    for (var j = d.length - 1; j > 0; j--) {
      var r = Math.floor(Math.random() * (j + 1));
      var tmp = d[j]; d[j] = d[r]; d[r] = tmp;
    }
    return d;
  }

  function newGame() {
    token++;
    if (G && G.pending) resolvePending({ type: 'abort' });
    var wall = deck();
    G = {
      wall: wall,
      hand: [], melds: [], discards: [],
      ai: [{ hand: [], discards: [] }, { hand: [], discards: [] }, { hand: [], discards: [] }],
      turn: 0, drawn: null, drawnIdx: -1, finished: false,
      decisions: [], pending: null, lastPhase: ''
    };
    for (var i = 0; i < 13; i++) {
      G.hand.push(wall.shift());
      G.ai[0].hand.push(wall.shift());
      G.ai[1].hand.push(wall.shift());
      G.ai[2].hand.push(wall.shift());
    }
    sortHand();
    hideFeedback();
    renderAll();
    setPhase('新的一局 · 开始');
    if (!running) runLoop(token);
    else runLoop(token);
  }

  function sortHand() { G.hand.sort(function (a, b) { return a - b; }); }

  function drawTile() { return G.wall.length ? G.wall.shift() : null; }
  function drawRinshan() { return G.wall.length ? G.wall.pop() : null; }

  function remaining() {
    var rem = new Array(34);
    for (var i = 0; i < 34; i++) rem[i] = 4;
    function dec(arr) { for (var k = 0; k < arr.length; k++) rem[arr[k]]--; }
    dec(G.hand);
    dec(G.discards);
    for (var m = 0; m < G.melds.length; m++) dec(G.melds[m].tiles);
    for (var s = 0; s < 3; s++) dec(G.ai[s].discards);
    return rem;
  }

  function meldN() { return G.melds.length; }
  function handCounts() { return MJ.countsOf(G.hand); }

  /* ---------------- 主循环 ---------------- */
  function runLoop(my) {
    running = true;
    (async function () {
      while (true) {
        if (my !== token || !G || G.finished) { running = false; return; }
        var ok = await playerTurn(my);
        if (!ok || my !== token) { running = false; return; }
        var order = [2, 0, 1]; // 下家(右) → 对家(上) → 上家(左)
        for (var i = 0; i < 3; i++) {
          var r = await aiTurn(order[i], my);
          if (!r || my !== token) { running = false; return; }
        }
      }
    })();
  }

  function checkLive(my) { return my === token && G && !G.finished; }

  /* ---------------- 玩家回合 ---------------- */
  async function playerTurn(my) {
    var t = drawTile();
    if (t === null) { endGame({ type: 'draw' }); return false; }
    G.turn++;
    G.hand.push(t); sortHand();
    G.drawn = t;
    G.drawnIdx = G.hand.lastIndexOf(t);
    renderAll();
    setPhase('第 ' + G.turn + ' 巡 · 你的回合');
    await sleep(120);

    var c = handCounts();
    var opts = { win: MJ.isWin(c, meldN()), ankan: ankanOptions(), kakan: kakanOptions() };
    var res = await waitAction('discard', opts);
    if (!checkLive(my)) return false;

    if (res.type === 'win') { endGame({ type: 'tsumo', tile: t, selfDraw: true }); return false; }

    if (res.type === 'ankan' || res.type === 'kakan') {
      applyKong(res.tile, res.type);
      var rt = drawRinshan();
      if (rt !== null) {
        G.hand.push(rt); sortHand(); G.drawn = rt; G.drawnIdx = G.hand.lastIndexOf(rt);
        renderAll();
        await sleep(150);
        var c2 = handCounts();
        if (MJ.isWin(c2, meldN())) {
          var r2 = await waitAction('discard', { win: true, ankan: ankanOptions(), kakan: kakanOptions(), rinshan: true });
          if (!checkLive(my)) return false;
          if (r2.type === 'win') { endGame({ type: 'tsumo', tile: rt, selfDraw: true, rinshan: true }); return false; }
          await doDiscard(r2, true, my);
        } else {
          var r3 = await waitAction('discard', { win: false, ankan: ankanOptions(), kakan: kakanOptions(), rinshan: true });
          if (!checkLive(my)) return false;
          await doDiscard(r3, true, my);
        }
      }
      return !G.finished;
    }

    await doDiscard(res, false, my);
    return !G.finished;
  }

  function ankanOptions() {
    var c = handCounts(), out = [];
    for (var i = 0; i < 34; i++) if (c[i] === 4) out.push(i);
    return out;
  }
  function kakanOptions() {
    var c = handCounts(), out = [];
    for (var m = 0; m < G.melds.length; m++) {
      var md = G.melds[m];
      if (md.type === 'pon' && c[md.tile] >= 1) out.push(md.tile);
    }
    return out;
  }

  function applyKong(tile, kind) {
    if (kind === 'ankan') {
      var removed = 0, nh = [];
      for (var i = 0; i < G.hand.length; i++) {
        if (G.hand[i] === tile && removed < 4) { removed++; continue; }
        nh.push(G.hand[i]);
      }
      G.hand = nh;
      G.melds.push({ type: 'ankan', tile: tile, tiles: [tile, tile, tile, tile] });
    } else {
      var rm = 0, nh2 = [];
      for (var j = 0; j < G.hand.length; j++) {
        if (G.hand[j] === tile && rm < 1) { rm++; continue; }
        nh2.push(G.hand[j]);
      }
      G.hand = nh2;
      for (var m = 0; m < G.melds.length; m++) {
        if (G.melds[m].type === 'pon' && G.melds[m].tile === tile) {
          G.melds[m].type = 'kakan'; G.melds[m].tiles = [tile, tile, tile, tile];
          break;
        }
      }
    }
    sortHand();
    renderAll();
  }

  /* 打牌并记录决策质量 */
  async function doDiscard(res, isKongFollow, my) {
    var tile = res.tile;
    if (tile === null || tile === undefined || G.hand.indexOf(tile) < 0) {
      tile = G.hand[G.hand.length - 1];
    }
    var analysis = MJ.analyzeDiscards(G.hand, meldN(), remaining());
    var chosen = null, best = analysis[0];
    for (var i = 0; i < analysis.length; i++) if (analysis[i].tile === tile) chosen = analysis[i];
    if (!chosen) chosen = { tile: tile, shanten: 99, total: 0, useful: [] };

    var idx = G.hand.indexOf(tile);
    G.hand.splice(idx, 1);
    G.discards.push(tile);
    G.drawn = null; G.drawnIdx = -1;
    renderAll();

    // 向听数相同、进张枚数差 <= TOL 枚视作等价最优(高向听时 1~2 枚差异无训练意义)
    var TOL = 2;
    var optimal = (chosen.shanten === best.shanten) && (best.total - chosen.total <= TOL);
    var rec = {
      turn: G.turn, tile: tile, elapsed: res.elapsed || 0, timeout: !!res.timeout,
      shanten: chosen.shanten, intake: chosen.total,
      best: best.tile, bestIntake: best.total, bestShanten: best.shanten,
      optimal: optimal
    };
    G.decisions.push(rec);
    showFeedback(rec, best);
    updateHud();
    await sleep(CFG.showBest ? 900 : 650);
  }

  /* ---------------- AI 回合 ---------------- */
  async function aiTurn(seat, my) {
    var ai = G.ai[seat];
    var t = drawTile();
    if (t === null) { endGame({ type: 'draw' }); return false; }
    ai.hand.push(t);
    renderSeat(seat);
    setPhase('第 ' + G.turn + ' 巡 · ' + seatName(seat) + '摸牌');
    await sleep(CFG.aiDelay * 0.5);
    if (!checkLive(my)) return false;

    if (MJ.isWin(MJ.countsOf(ai.hand), 0)) {
      renderSeat(seat);
      endGame({ type: 'aiWin', seat: seat });
      return false;
    }

    var d = aiChoose(ai.hand);
    ai.hand.splice(ai.hand.indexOf(d), 1);
    ai.discards.push(d);
    renderSeat(seat);
    renderRiver(seat);
    setPhase('第 ' + G.turn + ' 巡 · ' + seatName(seat) + '打出 ' + T.tileName(d));
    await sleep(CFG.aiDelay * 0.5);
    if (!checkLive(my)) return false;

    var opts = reactions(d);
    if (opts.win || opts.pon || opts.kan) {
      var r = await waitAction('react', opts, d, seat);
      if (!checkLive(my)) return false;
      if (r.type === 'win') {
        endGame({ type: 'ron', tile: d, from: seat });
        return false;
      }
      if (r.type === 'pon' || r.type === 'kan') {
        // 从该家牌河取回
        ai.discards.pop();
        applyCall(d, r.type, seat);
        renderAll();
        // 杠需补摸岭上牌(先补牌再打)
        if (r.type === 'kan') {
          var rt = drawRinshan();
          if (rt === null) { endGame({ type: 'draw' }); return false; }
          G.hand.push(rt); sortHand(); G.drawn = rt; G.drawnIdx = G.hand.lastIndexOf(rt);
        }
        renderAll();
        await sleep(120);
        var cw = handCounts();
        var follow = await waitAction('discard', { win: MJ.isWin(cw, meldN()), afterCall: true }, d, seat);
        if (!checkLive(my)) return false;
        if (follow.type === 'win') {
          endGame({ type: 'tsumo', tile: G.drawn, selfDraw: true, rinshan: true });
          return false;
        }
        await doDiscard(follow, true, my);
        return !G.finished;
      }
    }
    return true;
  }

  function applyCall(tile, kind, seat) {
    var rm = kind === 'pon' ? 2 : 3, nh = [], cnt = 0;
    for (var i = 0; i < G.hand.length; i++) {
      if (G.hand[i] === tile && cnt < rm) { cnt++; continue; }
      nh.push(G.hand[i]);
    }
    G.hand = nh;
    var tiles = kind === 'pon' ? [tile, tile, tile] : [tile, tile, tile, tile];
    G.melds.push({ type: kind === 'pon' ? 'pon' : 'minkan', tile: tile, tiles: tiles, from: seat });
    sortHand();
  }

  function reactions(tile) {
    var c = handCounts();
    var r = { win: false, pon: false, kan: false, tile: tile };
    var tmp = c.slice(); tmp[tile]++;
    if (MJ.isWin(tmp, meldN())) r.win = true;
    if (c[tile] >= 2) r.pon = true;
    if (c[tile] >= 3) r.kan = true;
    return r;
  }

  function aiChoose(hand) {
    var an = MJ.analyzeDiscards(hand, 0, remaining());
    var pick = Math.random() < 0.75 ? 0 : Math.floor(Math.random() * Math.min(3, an.length));
    return an[pick].tile;
  }

  function seatName(s) { return ['对家', '上家', '下家'][s]; }

  /* ---------------- 玩家决策等待 ---------------- */
  function waitAction(kind, opts, tile, seat) {
    return new Promise(function (resolve) {
      var start = performance.now();
      var p = {
        kind: kind, opts: opts, tile: tile, seat: seat, start: start, resolve: resolve,
        done: false, timer: null
      };
      G.pending = p;
      renderActionBar(opts, kind);
      if (kind === 'discard') markHandClickable(true);
      var limit = CFG.limit;
      p.timer = setInterval(function () {
        var el = performance.now() - start;
        updateTimer(el, limit);
        if (limit > 0 && el >= limit) {
          if (kind === 'discard') {
            var fallback = (G.drawn !== null && G.drawn !== undefined) ? G.drawn : G.hand[G.hand.length - 1];
            resolvePending({ type: 'discard', tile: fallback, elapsed: el, timeout: true });
          } else {
            resolvePending({ type: 'pass', elapsed: el, timeout: true });
          }
        }
      }, 40);
    });
  }

  function resolvePending(result) {
    if (!G || !G.pending) return;
    var p = G.pending;
    if (p.done) return;
    p.done = true;
    clearInterval(p.timer);
    if (result.elapsed === undefined) result.elapsed = performance.now() - p.start;
    G.pending = null;
    markHandClickable(false);
    renderActionBar(null, null);
    resetTimer();
    p.resolve(result);
  }

  /* ---------------- 结算 ---------------- */
  function endGame(info) {
    if (!G || G.finished) return;
    G.finished = true;
    resolvePending({ type: 'abort' });
    var stats = loadStats();
    var d = G.decisions;
    var timeSum = 0, opt = 0, to = 0;
    for (var i = 0; i < d.length; i++) { timeSum += d[i].elapsed; if (d[i].optimal) opt++; if (d[i].timeout) to++; }
    var avg = d.length ? timeSum / d.length : 0;
    var acc = d.length ? opt / d.length : 0;

    stats.games++;
    stats.decisions += d.length;
    stats.optimal += opt;
    stats.timeSum += timeSum;
    stats.timeouts += to;
    stats.turns += G.turn;
    if (!stats.bestMs || (avg && avg < stats.bestMs)) stats.bestMs = avg;

    var res = { info: info, decisions: d, avg: avg, acc: acc, timeout: to };
    if (info.type === 'tsumo' || info.type === 'ron') {
      var winTile = info.tile;
      // 自摸时胡牌张已在手牌中; 荣和时需补上
      var withTile = info.type === 'ron' ? G.hand.concat([winTile]) : G.hand.slice();
      var ev = MJ.evaluateFan(withTile, G.melds, winTile, {
        selfDraw: info.type === 'tsumo',
        lastTile: G.wall.length === 0,
        rinshan: !!info.rinshan
      });
      res.fan = ev;
      stats.wins++;
      stats.winTurns += G.turn;
      if (ev.total > stats.bestFan) stats.bestFan = ev.total;
    }
    saveStats(stats);
    showResult(res);
  }

  /* ---------------- 渲染 ---------------- */
  function tileEl(id, extra) {
    var d = document.createElement('div');
    d.className = 'tile' + (extra ? ' ' + extra : '');
    d.innerHTML = T.tileSvg(id);
    d.dataset.name = T.tileName(id);
    d.title = T.tileName(id);
    return d;
  }
  function backEl(extra) {
    var d = document.createElement('div');
    d.className = 'tile' + (extra ? ' ' + extra : '');
    d.innerHTML = T.backSvg();
    return d;
  }

  function renderAll() {
    renderHand();
    renderMelds();
    renderRiver('me');
    for (var s = 0; s < 3; s++) { renderSeat(s); renderRiver(s); }
    updateHud();
    renderInfo();
  }

  function renderHand() {
    var box = $('my-hand');
    box.innerHTML = '';
    for (var i = 0; i < G.hand.length; i++) {
      var el = tileEl(G.hand[i], 'my-tile');
      el.dataset.idx = i;
      if (i === G.drawnIdx) el.classList.add('drawn');
      box.appendChild(el);
    }
  }

  function renderMelds() {
    var box = $('my-melds');
    box.innerHTML = '';
    for (var m = 0; m < G.melds.length; m++) {
      var md = G.melds[m];
      var wrap = document.createElement('div');
      wrap.className = 'meld';
      var show = md.type === 'ankan' ? [md.tile, -1, md.tile, -1] : md.tiles.slice();
      if (md.type === 'ankan') show = [md.tile, -1, -1, md.tile];
      for (var k = 0; k < show.length; k++) {
        wrap.appendChild(show[k] < 0 ? backEl('small') : tileEl(show[k], 'small'));
      }
      box.appendChild(wrap);
    }
  }

  function renderSeat(s) {
    var el = $('seat-' + s + '-hand');
    if (!el) return;
    el.innerHTML = '';
    var n = G.ai[s].hand.length;
    for (var i = 0; i < n; i++) el.appendChild(backEl(s === 0 ? 'tiny' : 'tiny-v'));
    var cnt = $('seat-' + s + '-count');
    if (cnt) cnt.textContent = n + ' 张';
  }

  function renderRiver(who) {
    var el = who === 'me' ? $('my-river') : $('seat-' + who + '-river');
    if (!el) return;
    el.innerHTML = '';
    var arr = who === 'me' ? G.discards : G.ai[who].discards;
    for (var i = 0; i < arr.length; i++) {
      var t = tileEl(arr[i], 'tiny' + (i === arr.length - 1 ? ' last' : ''));
      el.appendChild(t);
    }
  }

  function updateHud() {
    $('hud-remain').textContent = G.wall.length;
    $('hud-turn').textContent = G.turn;
    var c = handCounts();
    var sh = MJ.shanten(c, meldN());
    $('hud-shanten').textContent = sh <= -1 ? '胡' : (sh === 0 ? '听牌' : sh + ' 向听');
    $('hud-shanten').className = sh <= 0 ? 'good' : '';
  }

  function renderInfo() {
    var box = $('info-bar');
    if (CFG.hint === 0) { box.innerHTML = '<span class="dim">提示已关闭（硬核模式）</span>'; return; }
    var c = handCounts(), rem = remaining(), mn = meldN();
    var sh = MJ.shanten(c, mn);
    var html = '';
    if (G.hand.length % 3 === 1 && sh === 0) {
      var w = MJ.waitingTiles(c, mn, rem);
      var tot = 0; w.forEach(function (x) { tot += x.count; });
      html += '<span class="tag good">听牌</span> 听 ' + w.map(function (x) { return T.tileName(x.tile) + '<sub>' + x.count + '</sub>'; }).join(' ') +
        ' · 共 <b>' + tot + '</b> 枚';
    } else if (G.hand.length % 3 === 1) {
      html += '<span class="tag">' + sh + ' 向听</span>';
      if (CFG.hint >= 2) {
        var u = MJ.usefulTiles(c, mn, rem);
        var t2 = 0; u.forEach(function (x) { t2 += x.count; });
        html += ' 有效进张 ' + u.slice(0, 8).map(function (x) { return T.tileName(x.tile) + '<sub>' + x.count + '</sub>'; }).join(' ') +
          ' · 共 <b>' + t2 + '</b> 枚';
      }
    } else {
      // 14 张: 待打牌, 显示建议
      if (CFG.hint >= 3 || CFG.showBest) {
        var an = MJ.analyzeDiscards(G.hand, mn, rem);
        var b = an[0];
        html += '<span class="tag warn">建议打</span> <b>' + T.tileName(b.tile) + '</b> · 打后进张 <b>' + b.total + '</b> 枚' +
          (b.shanten === 0 ? '（听牌）' : '（' + b.shanten + ' 向听）');
      } else {
        html += '<span class="dim">轮到你打牌' + (G.melds.length ? '（含 ' + G.melds.length + ' 副露）' : '') + ' · 快速判断打哪张</span>';
      }
    }
    box.innerHTML = html;
  }

  function showFeedback(rec, best) {
    var box = $('feedback');
    var cls = rec.optimal ? 'ok' : (rec.timeout ? 'timeout' : 'bad');
    var grade = rec.elapsed < 800 ? '神速' : rec.elapsed < 1500 ? '很快' : rec.elapsed < 2500 ? '一般' : '偏慢';
    var txt = '<span class="fb-item"><i>你打</i><b>' + T.tileName(rec.tile) + '</b>' +
      '<em>' + (rec.elapsed / 1000).toFixed(2) + 's · ' + (rec.timeout ? '超时' : grade) + '</em></span>';
    txt += '<span class="fb-item"><i>' + (rec.shanten <= 0 ? '打后听牌' : '打后 ' + rec.shanten + ' 向听') + '</i><b>进张 ' + rec.intake + ' 枚</b></span>';
    if (rec.optimal && best.total - rec.intake > 0) {
      txt += '<span class="fb-item warn"><i>接近最优</i><b>' + T.tileName(best.tile) + '</b>' +
        '<em>多 ' + (best.total - rec.intake) + ' 枚</em></span>';
    } else if (!rec.optimal) {
      var why;
      if (rec.bestShanten < rec.shanten) {
        why = (best.shanten <= 0 ? '可听牌' : '少 ' + (rec.shanten - best.shanten) + ' 向听');
      } else {
        why = '进张 +' + (best.total - rec.intake) + ' 枚';
      }
      txt += '<span class="fb-item bad"><i>更优解</i><b>' + T.tileName(best.tile) + '</b>' +
        '<em>' + why + '（' + best.total + ' 枚）</em></span>';
    } else {
      txt += '<span class="fb-item ok"><i>最优</i><b>✓</b></span>';
    }
    box.className = 'feedback ' + cls;
    box.innerHTML = txt;
  }
  function hideFeedback() { $('feedback').className = 'feedback'; $('feedback').innerHTML = '<span class="dim">打出后这里会显示你的决策速度与牌效对比</span>'; }

  function renderActionBar(opts, kind) {
    var box = $('action-bar');
    box.innerHTML = '';
    if (!opts) return;
    function btn(label, cls, fn) {
      var b = document.createElement('button');
      b.className = 'act-btn ' + cls;
      b.textContent = label;
      b.onclick = fn;
      box.appendChild(b);
    }
    if (opts.win) btn('胡', 'win', function () { resolvePending({ type: 'win' }); });
    if (opts.ankan && opts.ankan.length) {
      opts.ankan.forEach(function (t) {
        btn('暗杠 ' + T.tileName(t), 'kan', function () { resolvePending({ type: 'ankan', tile: t }); });
      });
    }
    if (opts.kakan && opts.kakan.length) {
      opts.kakan.forEach(function (t) {
        btn('加杠 ' + T.tileName(t), 'kan', function () { resolvePending({ type: 'kakan', tile: t }); });
      });
    }
    if (kind === 'react') {
      if (opts.pon) btn('碰', 'pon', function () { resolvePending({ type: 'pon', tile: opts.tile }); });
      if (opts.kan) btn('杠', 'kan', function () { resolvePending({ type: 'kan', tile: opts.tile }); });
      btn('过', 'pass', function () { resolvePending({ type: 'pass' }); });
    }
  }

  function markHandClickable(on) {
    var box = $('my-hand');
    box.classList.toggle('clickable', !!on);
  }

  function updateTimer(el, limit) {
    var box = $('timer');
    box.style.display = 'block';
    $('timer-text').textContent = (el / 1000).toFixed(2) + 's';
    var pct = limit > 0 ? Math.max(0, 1 - el / limit) : 1;
    $('timer-fill').style.width = (pct * 100) + '%';
    $('timer-fill').className = 'timer-fill' + (pct < 0.3 ? ' danger' : pct < 0.6 ? ' warn' : '');
  }
  function resetTimer() { $('timer').style.display = 'none'; }

  function setPhase(t) { $('phase').textContent = t; }

  /* ---------------- 弹窗 ---------------- */
  function openModal(id) { $(id).classList.add('show'); }
  function closeModals() {
    var ms = document.querySelectorAll('.modal');
    for (var i = 0; i < ms.length; i++) ms[i].classList.remove('show');
  }

  function showResult(res) {
    var box = $('result-body');
    var d = res.decisions;
    var win = res.info.type === 'tsumo' || res.info.type === 'ron';
    var title = win ? (res.info.type === 'tsumo' ? '自摸胡牌！' : '点炮胡牌！') :
      (res.info.type === 'aiWin' ? seatName(res.info.seat) + '胡牌，本局未和' : '流局');
    $('result-title').textContent = title;
    $('result-title').className = win ? 'win' : 'lose';

    var score = 0;
    score += res.avg <= 1000 ? 40 : res.avg <= 1800 ? 32 : res.avg <= 2800 ? 22 : res.avg <= 4000 ? 12 : 5;
    score += res.acc >= 0.9 ? 40 : res.acc >= 0.75 ? 32 : res.acc >= 0.6 ? 22 : res.acc >= 0.4 ? 12 : 5;
    score += win ? 20 : 0;
    var grade = score >= 90 ? 'S' : score >= 75 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';

    var html = '<div class="res-grid">' +
      '<div><span>巡数</span><b>' + G.turn + '</b></div>' +
      '<div><span>平均决策</span><b>' + (res.avg / 1000).toFixed(2) + 's</b></div>' +
      '<div><span>最优打法</span><b>' + (res.acc * 100).toFixed(0) + '%</b></div>' +
      '<div><span>超时</span><b>' + res.timeout + ' 次</b></div>' +
      '<div><span>评级</span><b class="grade-' + grade + '">' + grade + '</b></div>' +
      '</div>';

    if (res.fan) {
      html += '<div class="fan-line">番型：' + res.fan.fans.map(function (f) { return '<span class="fan">' + f.name + ' +' + f.fan + '</span>'; }).join('') +
        ' <b>共 ' + res.fan.total + ' 番</b></div>';
    } else {
      var sh = MJ.shanten(handCounts(), meldN());
      html += '<div class="dim small">结束时手牌：' + G.hand.map(function (t) { return T.tileName(t); }).join(' ') +
        '（' + (sh === 0 ? '听牌' : sh + ' 向听') + '）</div>';
    }

    html += '<table class="review"><thead><tr><th>巡</th><th>打出</th><th>耗时</th><th>打后进张</th><th>最优</th></tr></thead><tbody>';
    for (var i = 0; i < d.length; i++) {
      var r = d[i];
      html += '<tr class="' + (r.optimal ? '' : 'bad') + '"><td>' + r.turn + '</td><td>' + T.tileName(r.tile) + '</td>' +
        '<td>' + (r.elapsed / 1000).toFixed(2) + 's' + (r.timeout ? ' ⏰' : '') + '</td>' +
        '<td>' + r.intake + ' 枚' + (r.shanten <= 0 ? '（听）' : '（' + r.shanten + '向听）') + '</td>' +
        '<td>' + (r.optimal ? '✓' : T.tileName(r.best) + ' ' + r.bestIntake + '枚' + (r.bestShanten <= 0 ? '（听）' : '（' + r.bestShanten + '向听）')) + '</td></tr>';
    }
    html += '</tbody></table>';
    box.innerHTML = html;
    openModal('modal-result');
  }

  function showStats() {
    var s = loadStats();
    var avg = s.decisions ? s.timeSum / s.decisions : 0;
    var html = '<div class="res-grid">' +
      '<div><span>总局数</span><b>' + s.games + '</b></div>' +
      '<div><span>胡牌</span><b>' + s.wins + '</b></div>' +
      '<div><span>胡牌率</span><b>' + (s.games ? (s.wins / s.games * 100).toFixed(0) : 0) + '%</b></div>' +
      '<div><span>平均决策</span><b>' + (avg / 1000).toFixed(2) + 's</b></div>' +
      '<div><span>最优率</span><b>' + (s.decisions ? (s.optimal / s.decisions * 100).toFixed(0) : 0) + '%</b></div>' +
      '<div><span>平均巡数</span><b>' + (s.games ? (s.turns / s.games).toFixed(1) : 0) + '</b></div>' +
      '<div><span>超时次数</span><b>' + s.timeouts + '</b></div>' +
      '<div><span>最高番</span><b>' + s.bestFan + '</b></div>' +
      '</div>';
    $('stats-body').innerHTML = html;
    openModal('modal-stats');
  }

  /* 全屏后尝试锁定横屏(Android 支持; iOS 会静默失败) */
  function lockLandscape() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        var r = screen.orientation.lock('landscape');
        if (r && r.catch) r.catch(function () { });
      }
    } catch (e) { }
  }

  /* ---------------- 牌效快问快答 ---------------- */
  var DK = 'gdmj_drill_v2';
  function defDrill() { return { total: 0, ok: 0, timeSum: 0, bestCombo: 0 }; }
  function loadDrill() { try { return JSON.parse(localStorage.getItem(DK)) || defDrill(); } catch (e) { return defDrill(); } }
  function saveDrill(d) { try { localStorage.setItem(DK, JSON.stringify(d)); } catch (e) { } }

  var D = { hand: [], analysis: [], start: 0, timer: null, answered: true, n: 0, combo: 0, st: defDrill(), target: 0 };

  function setMode(m) {
    D.st = loadDrill();
    if (m === 'drill') {
      if (G && G.pending) resolvePending({ type: 'abort' });
      if (G) G.finished = true;
      token++;
      document.body.classList.add('mode-drill');
      $('btn-mode').textContent = '切换：整局对战';
      $('btn-new').style.display = 'none';
      resetTimer();
      drillQuestion();
    } else {
      clearInterval(D.timer);
      document.body.classList.remove('mode-drill');
      $('btn-mode').textContent = '切换：牌效快问';
      $('btn-new').style.display = '';
      newGame();
    }
  }

  function drillQuestion() {
    clearInterval(D.timer);
    var hand = null, an = null;
    for (var attempt = 0; attempt < 200; attempt++) {
      var full = deck();
      hand = full.slice(0, 14);
      if (MJ.isWin(MJ.countsOf(hand), 0)) continue;
      var rem = new Array(34);
      for (var i = 0; i < 34; i++) rem[i] = 4;
      hand.forEach(function (t) { rem[t]--; });
      an = MJ.analyzeDiscards(hand, 0, rem);
      if (an[0].shanten <= 2) break;
    }
    hand.sort(function (a, b) { return a - b; });
    D.hand = hand;
    D.analysis = an;
    D.answered = false;
    D.n++;
    D.target = an[0].shanten;

    var box = $('drill-hand');
    box.innerHTML = '';
    for (var k = 0; k < hand.length; k++) {
      var el = tileEl(hand[k], 'my-tile');
      el.dataset.idx = k;
      box.appendChild(el);
    }
    box.classList.add('clickable');
    $('drill-fb').className = 'drill-fb';
    $('drill-fb').innerHTML = '目标：打完后做到 <b>' + (D.target <= 0 ? '听牌' : D.target + ' 向听') + '</b> · 选进张最多的那张';
    $('drill-table').innerHTML = '';
    $('drill-n').textContent = D.n;
    $('drill-ask').textContent = '限时 ' + (CFG.limit ? (CFG.limit / 1000) + ' 秒' : '不限时') + ' · 打哪张？';

    D.start = performance.now();
    $('drill-time').textContent = '0.00s';
    D.timer = setInterval(function () {
      var el2 = performance.now() - D.start;
      $('drill-time').textContent = (el2 / 1000).toFixed(2) + 's';
      $('drill-timer').classList.toggle('danger', CFG.limit > 0 && el2 > CFG.limit * 0.7);
      if (CFG.limit > 0 && el2 >= CFG.limit) drillTimeout();
    }, 40);
  }

  function drillTimeout() {
    if (D.answered) return;
    D.answered = true;
    clearInterval(D.timer);
    finishDrill(null, CFG.limit, true);
  }

  function drillAnswer(idx) {
    if (D.answered) return;
    D.answered = true;
    clearInterval(D.timer);
    var elapsed = performance.now() - D.start;
    $('drill-hand').classList.remove('clickable');
    finishDrill(D.hand[idx], elapsed, false);
  }

  function finishDrill(tile, elapsed, isTimeout) {
    var TOL = 2;
    var best = D.analysis[0];
    var chosen = null;
    for (var i = 0; i < D.analysis.length; i++) if (D.analysis[i].tile === tile) chosen = D.analysis[i];
    var okv = !isTimeout && chosen && chosen.shanten === best.shanten && (best.total - chosen.total <= TOL);

    D.st.total++;
    D.st.timeSum += elapsed;
    if (okv) {
      D.st.ok++; D.combo++;
      if (D.combo > D.st.bestCombo) D.st.bestCombo = D.combo;
    } else {
      D.combo = 0;
    }
    saveDrill(D.st);

    $('drill-ok').textContent = D.st.ok;
    $('drill-total').textContent = D.st.total;
    $('drill-rate').textContent = (D.st.ok / D.st.total * 100).toFixed(0) + '%';
    $('drill-combo').textContent = D.combo;
    $('drill-avg').textContent = (D.st.timeSum / D.st.total / 1000).toFixed(2) + 's';

    var fb = $('drill-fb');
    if (isTimeout) {
      fb.className = 'drill-fb bad';
      fb.innerHTML = '⏰ 超时！最优解是 <b>' + T.tileName(best.tile) + '</b> · 打后 ' +
        (best.shanten <= 0 ? '听牌' : best.shanten + ' 向听') + '，进张 <b>' + best.total + '</b> 枚';
    } else if (okv && best.total - chosen.total === 0) {
      fb.className = 'drill-fb ok';
      fb.innerHTML = '✓ 最优！打 <b>' + T.tileName(tile) + '</b> · 打后 ' +
        (chosen.shanten <= 0 ? '听牌' : chosen.shanten + ' 向听') + '，进张 <b>' + chosen.total + '</b> 枚 · 用时 ' +
        (elapsed / 1000).toFixed(2) + 's' + (D.combo > 1 ? ' · <span class="combo">连击 ' + D.combo + '</span>' : '');
    } else if (okv) {
      fb.className = 'drill-fb warn';
      fb.innerHTML = '◐ 接近最优（少 ' + (best.total - chosen.total) + ' 枚）：最优是 <b>' + T.tileName(best.tile) +
        '</b>，进张 <b>' + best.total + '</b> 枚 · 用时 ' + (elapsed / 1000).toFixed(2) + 's';
    } else {
      fb.className = 'drill-fb bad';
      var why = chosen.shanten > best.shanten
        ? '你的打法多 ' + (chosen.shanten - best.shanten) + ' 向听'
        : '进张少 ' + (best.total - chosen.total) + ' 枚';
      fb.innerHTML = '✗ ' + why + '。最优是 <b>' + T.tileName(best.tile) + '</b> · 打后 ' +
        (best.shanten <= 0 ? '听牌' : best.shanten + ' 向听') + '，进张 <b>' + best.total + '</b> 枚（你打 ' +
        T.tileName(tile) + ' 进张 ' + chosen.total + ' 枚，用时 ' + (elapsed / 1000).toFixed(2) + 's）';
    }

    // 候选表
    var rows = '<table class="review"><thead><tr><th>打</th><th>打后</th><th>进张</th><th>主要进张</th></tr></thead><tbody>';
    var max = Math.min(D.analysis.length, 10);
    for (var r = 0; r < max; r++) {
      var a = D.analysis[r];
      var cls = [];
      if (a.tile === tile) cls.push('mine');
      if (r === 0) cls.push('best');
      rows += '<tr class="' + cls.join(' ') + '"><td>' + T.tileName(a.tile) + '</td>' +
        '<td>' + (a.shanten <= 0 ? '听牌' : a.shanten + ' 向听') + '</td>' +
        '<td><b>' + a.total + '</b> 枚</td>' +
        '<td class="dim">' + a.useful.slice(0, 6).map(function (u) { return T.tileName(u.tile) + '<sub>' + u.count + '</sub>'; }).join(' ') + '</td></tr>';
    }
    rows += '</tbody></table>';
    var wrap = $('drill-table');
    var old = wrap.parentNode.querySelector('.scroll-hint');
    if (old) old.parentNode.removeChild(old);
    wrap.innerHTML = rows;
    if (wrap.scrollHeight > wrap.clientHeight + 4) {
      var hint = document.createElement('div');
      hint.className = 'scroll-hint dim small';
      hint.textContent = '↕ 上下滑动可查看全部 ' + D.analysis.length + ' 种打法';
      wrap.parentNode.insertBefore(hint, wrap);
    }

    // 高亮手牌
    var els = $('drill-hand').children;
    for (var q = 0; q < els.length; q++) {
      var t2 = D.hand[q];
      els[q].classList.remove('mark-best', 'mark-mine');
      if (t2 === best.tile && !okv && !isTimeout) els[q].classList.add('mark-best');
      if (t2 === tile) els[q].classList.add('mark-mine');
    }
  }

  function showDrillStats() {
    var s = loadDrill();
    var html = '<div class="res-grid">' +
      '<div><span>总题数</span><b>' + s.total + '</b></div>' +
      '<div><span>答对</span><b>' + s.ok + '</b></div>' +
      '<div><span>命中率</span><b>' + (s.total ? (s.ok / s.total * 100).toFixed(0) : 0) + '%</b></div>' +
      '<div><span>平均用时</span><b>' + (s.total ? (s.timeSum / s.total / 1000).toFixed(2) : 0) + 's</b></div>' +
      '<div><span>最长连击</span><b>' + s.bestCombo + '</b></div>' +
      '</div>';
    $('drill-body').innerHTML = html;
    openModal('modal-drill');
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    $('my-hand').addEventListener('click', function (e) {
      var el = e.target.closest('.my-tile');
      if (!el) return;
      if (!G || !G.pending || G.pending.kind !== 'discard') return;
      var idx = +el.dataset.idx;
      resolvePending({ type: 'discard', tile: G.hand[idx] });
    });

    $('btn-new').onclick = function () { closeModals(); newGame(); };
    $('btn-mode').onclick = function () {
      setMode(document.body.classList.contains('mode-drill') ? 'game' : 'drill');
    };
    $('drill-hand').addEventListener('click', function (e) {
      var el = e.target.closest('.my-tile');
      if (!el || D.answered) return;
      drillAnswer(+el.dataset.idx);
    });
    $('btn-drill-next').onclick = function () { drillQuestion(); };
    $('btn-drill-quit').onclick = function () { setMode('game'); };
    $('btn-drill-stats').onclick = showDrillStats;
    $('btn-reset-drill').onclick = function () { saveDrill(defDrill()); D.st = defDrill(); D.n = 0; D.combo = 0; showDrillStats(); };
    $('btn-stats').onclick = showStats;
    $('btn-settings').onclick = function () { syncSettings(); openModal('modal-settings'); };
    $('btn-help').onclick = function () { openModal('modal-help'); };

    var closes = document.querySelectorAll('[data-close]');
    for (var i = 0; i < closes.length; i++) {
      closes[i].onclick = function () { closeModals(); };
    }
    var mods = document.querySelectorAll('.modal');
    for (var j = 0; j < mods.length; j++) {
      mods[j].addEventListener('click', function (e) { if (e.target === this) closeModals(); });
    }

    $('set-limit').onchange = function () { CFG.limit = +this.value; saveCfg(); };
    $('set-hint').onchange = function () { CFG.hint = +this.value; saveCfg(); renderInfo(); };
    $('set-best').onchange = function () { CFG.showBest = this.checked; saveCfg(); renderInfo(); };
    $('set-speed').onchange = function () { CFG.aiDelay = +this.value; saveCfg(); };
    $('btn-reset-stats').onclick = function () {
      saveStats(defStats()); showStats();
    };

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModals();
      if (document.body.classList.contains('mode-drill')) {
        if (e.key === ' ') { e.preventDefault(); if (D.answered) drillQuestion(); return; }
        var dn = parseInt(e.key, 10);
        if (dn >= 1 && dn <= 9 && !D.answered) {
          var dels = $('drill-hand').children;
          if (dels[dn - 1]) drillAnswer(dn - 1);
        }
        return;
      }
      if (e.key === 'n' || e.key === 'N') { closeModals(); newGame(); }
      if (!G || !G.pending) return;
      if (e.key === 'Enter') {
        var winBtn = document.querySelector('.act-btn.win');
        if (winBtn) winBtn.click();
      }
      if (e.key === ' ') {
        e.preventDefault();
        var passBtn = document.querySelector('.act-btn.pass');
        if (passBtn) passBtn.click();
      }
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && G.pending.kind === 'discard') {
        var tiles = document.querySelectorAll('.my-tile');
        if (tiles[n - 1]) tiles[n - 1].click();
      }
    });
  }

  function syncSettings() {
    $('set-limit').value = CFG.limit;
    $('set-hint').value = CFG.hint;
    $('set-best').checked = CFG.showBest;
    $('set-speed').value = CFG.aiDelay;
  }

  /* ---------------- 启动 ---------------- */
  window.addEventListener('DOMContentLoaded', function () {
    bind();
    try {
      if (sessionStorage.getItem('gdmj_rt') === '1') document.body.classList.add('rt-hidden');
    } catch (e) { }
    var rtc = $('rt-close');
    if (rtc) rtc.onclick = function () {
      document.body.classList.add('rt-hidden');
      try { sessionStorage.setItem('gdmj_rt', '1'); } catch (e) { }
    };
    var rtf = $('rt-fs');
    if (rtf) rtf.onclick = function () {
      var el = document.documentElement;
      try {
        var fs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (fs) {
          var r = fs.call(el);
          if (r && r.then) r.then(lockLandscape).catch(function () { lockLandscape(); });
        }
        lockLandscape();
      } catch (e) { }
    };
    hideFeedback();
    D.st = loadDrill();
    $('drill-ok').textContent = D.st.ok;
    $('drill-total').textContent = D.st.total;
    $('drill-rate').textContent = D.st.total ? (D.st.ok / D.st.total * 100).toFixed(0) + '%' : '-';
    $('drill-avg').textContent = D.st.total ? (D.st.timeSum / D.st.total / 1000).toFixed(2) + 's' : '-';
    newGame();
  });
})();
