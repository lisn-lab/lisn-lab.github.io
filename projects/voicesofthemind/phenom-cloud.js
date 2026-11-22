(function() {
  // =============================================
  // EDIT HERE: phenomenological phrases (curly quotes added at render time)
  // =============================================
  var phrases = [
    "a mini me in my head",
    "talk it through with the mini me",
    "in my subconscious",
    "my brain is blank",
    "actively want to picture or hear",
    "an active experience",
    "something I choose to do myself",
    "actively plan",
    "fully engaged in a task",
    "static with sentences and ideas",
    "thrown in around the noise",
    "I talk to the fourth wall in my head",
    "I don't really think before I speak",
    "imagine things pretty vividly",
    "loud and messy",
    "everything's everywhere",
    "background music",
    "a monologue or a conversation",
    "going on inside my head",
    "I rarely ever have a quiet thought",
    "very loud and clear",
    "my inner monologue",
    "visualise scenes",
    "being able to picture faces",
    "letters and numbers as colours",
    "two levels to it",
    "noticing my surroundings",
    "picture things very vividly",
    "it gets more blurry",
    "visualising a film",
    "playing out in my head",
    "I think in paths",
    "meandering paths of random things",
    "the task at hand",
    "constantly thinking",
    "predicting conversations",
    "I worry about the upcoming events",
    "imagining what people would say",
    "in their voice",
    "subconscious phrases like I'm tired",
    "vent an inner monologue",
    "my brain is busier",
    "a dream or a dilemma",
    "synapses, function",
    "pretend to hear, to speak",
    "repeating everything someone says",
    "random noises like verbal ticks",
    "spontaneous thinking, fast",
    "like bubblegum",
    "a radio dialogue",
    "break down thoughts in my head"
  ];

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function init() {
    var container = document.getElementById('phenom-cloud');
    if (!container) { setTimeout(init, 200); return; }

    var listEl = document.getElementById('phenom-list');
    if (listEl && listEl.children.length === 0) {
      phrases.forEach(function(p) {
        var li = document.createElement('li');
        li.textContent = '“' + p + '”';
        listEl.appendChild(li);
      });
    }

    var toggleBtn = document.getElementById('phenom-toggle');
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = reducedMotion;

    var isNarrow = window.innerWidth < 700;
    var COLS = isNarrow ? 2 : 4;
    var ROWS = isNarrow ? 7 : 4;

    // Fixed-height stage so the section never resizes as fonts/text change.
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.height = (isNarrow ? 520 : 380) + 'px';

    var slotW = 100 / COLS;
    var slotH = 100 / ROWS;

    var pool = shuffle(phrases.slice());
    var poolIdx = 0;
    function nextPhrase() {
      var p = pool[poolIdx % pool.length];
      poolIdx++;
      return p;
    }

    function setText(cell) {
      var phrase = nextPhrase();
      cell.textContent = '“' + phrase + '”';
      var size = phrase.length > 22 ? (0.82 + Math.random() * 0.22)
                                    : (0.95 + Math.random() * 0.40);
      cell.style.fontSize = size.toFixed(2) + 'em';
    }

    function place(cell, slot) {
      var jx = (Math.random() - 0.5) * slotW * 0.30;
      var jy = (Math.random() - 0.5) * slotH * 0.45;
      var padX = 5;
      var x = padX + (slot.c + 0.5) / COLS * (100 - 2 * padX) + jx;
      var y = (slot.r + 0.5) * slotH + jy;
      cell.style.left = x + '%';
      cell.style.top = y + '%';
      cell.style.transform = 'translate(-50%, -50%)';
    }

    var timers = [];
    var items = [];

    function clearTimers() {
      timers.forEach(function(id) { clearTimeout(id); });
      timers = [];
    }

    function revealCycle(cell, slot) {
      if (paused) return;
      var wipe = Math.random() < 0.45;
      var target = (0.72 + Math.random() * 0.25).toFixed(2);

      cell.style.transition = 'none';
      if (wipe) {
        cell.style.clipPath = 'inset(0 100% 0 0)';
        cell.style.opacity = target;
      } else {
        cell.style.clipPath = 'inset(0 0 0 0)';
        cell.style.opacity = '0';
      }
      void cell.offsetWidth;

      if (wipe) {
        cell.style.transition = 'clip-path 1.3s ease';
        cell.style.clipPath = 'inset(0 0 0 0)';
      } else {
        cell.style.transition = 'opacity 1.6s ease';
        cell.style.opacity = target;
      }

      var hold = 4500 + Math.random() * 4500;
      timers.push(setTimeout(function() {
        if (paused) return;
        cell.style.transition = 'opacity 1.2s ease';
        cell.style.opacity = '0';
        timers.push(setTimeout(function() {
          if (paused) return;
          place(cell, slot);
          setText(cell);
          revealCycle(cell, slot);
        }, 1300));
      }, hold));
    }

    function showStatic() {
      clearTimers();
      items.forEach(function(it) {
        it.cell.style.transition = 'none';
        it.cell.style.clipPath = 'inset(0 0 0 0)';
        it.cell.style.opacity = '0.9';
      });
    }

    function startMotion() {
      clearTimers();
      items.forEach(function(it) {
        var startDelay = Math.random() * 2500;
        timers.push(setTimeout(function() { revealCycle(it.cell, it.slot); }, startDelay));
      });
    }

    function syncButton() {
      if (!toggleBtn) return;
      toggleBtn.textContent = paused ? 'Play animation' : 'Pause animation';
      toggleBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }

    var slots = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) { slots.push({ c: c, r: r }); }
    }

    slots.forEach(function(slot) {
      var cell = document.createElement('div');
      cell.style.position = 'absolute';
      cell.style.textAlign = 'center';
      cell.style.fontStyle = 'italic';
      cell.style.color = 'inherit';
      cell.style.lineHeight = '1.25';
      cell.style.maxWidth = (slotW * 0.85) + '%';
      cell.style.opacity = paused ? '0.9' : '0';
      cell.style.willChange = 'opacity, clip-path';
      place(cell, slot);
      setText(cell);
      container.appendChild(cell);
      items.push({ cell: cell, slot: slot });
    });

    syncButton();
    if (paused) {
      showStatic();
    } else {
      startMotion();
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        paused = !paused;
        syncButton();
        if (paused) showStatic();
        else startMotion();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
