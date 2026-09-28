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

    var isNarrow = window.innerWidth < 700;
    var COLS = isNarrow ? 2 : 4;
    var ROWS = isNarrow ? 7 : 4;

    // Fixed-height stage so the section never resizes as fonts/text change.
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.height = (isNarrow ? 520 : 380) + 'px';

    var slotW = 100 / COLS; // percent of stage width
    var slotH = 100 / ROWS; // percent of stage height

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
      // Short thoughts can shout; long ones stay quieter so they wrap less and
      // don't crowd neighbours in the narrow columns.
      var size = phrase.length > 22 ? (0.8 + Math.random() * 0.25)
                                    : (0.95 + Math.random() * 0.45);
      cell.style.fontSize = size.toFixed(2) + 'em';
    }

    // Each cell lives in its own grid slot (no collisions) but sits at a
    // jittered point inside that slot, so the overall field looks scattered.
    function place(cell, slot) {
      var jx = (Math.random() - 0.5) * slotW * 0.30; // small horizontal wander
      var jy = (Math.random() - 0.5) * slotH * 0.45; // freer vertical wander
      // Map columns into an inset band so wide phrases never clip the edges.
      var padX = 5;
      var x = padX + (slot.c + 0.5) / COLS * (100 - 2 * padX) + jx;
      var y = (slot.r + 0.5) * slotH + jy;
      cell.style.left = x + '%';
      cell.style.top = y + '%';
      cell.style.transform = 'translate(-50%, -50%)';
    }

    function revealCycle(cell, slot) {
      var wipe = Math.random() < 0.45; // ~45% unfold left->right, rest fade in
      var target = (0.55 + Math.random() * 0.4).toFixed(2);

      // Reset to the hidden state with no transition so it snaps instantly.
      cell.style.transition = 'none';
      if (wipe) {
        cell.style.clipPath = 'inset(0 100% 0 0)'; // collapsed at the left edge
        cell.style.opacity = target;
      } else {
        cell.style.clipPath = 'inset(0 0 0 0)';
        cell.style.opacity = '0';
      }
      void cell.offsetWidth; // commit the reset before animating

      // Animate in: wipe cells unfold L->R, fade cells ease their opacity up.
      if (wipe) {
        cell.style.transition = 'clip-path 1.3s ease';
        cell.style.clipPath = 'inset(0 0 0 0)';
      } else {
        cell.style.transition = 'opacity 1.6s ease';
        cell.style.opacity = target;
      }

      var hold = 4500 + Math.random() * 4500;
      setTimeout(function() {
        // Fleet away: fade out, then reappear elsewhere with a new phrase.
        cell.style.transition = 'opacity 1.2s ease';
        cell.style.opacity = '0';
        setTimeout(function() {
          place(cell, slot);
          setText(cell);
          revealCycle(cell, slot);
        }, 1300);
      }, hold);
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
      cell.style.maxWidth = (slotW * 0.85) + '%'; // keep long phrases inside their slot
      cell.style.opacity = '0';
      cell.style.willChange = 'opacity, clip-path';
      place(cell, slot);
      setText(cell);
      container.appendChild(cell);

      var startDelay = Math.random() * 4000;
      setTimeout(function() { revealCycle(cell, slot); }, startDelay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
