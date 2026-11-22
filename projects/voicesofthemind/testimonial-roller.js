(function() {
  var quotes = [
    {text: "I enjoyed both from a musical and scientific point. It challenged my brain to think deeply about my inner dialogue and expressing myself through music was very useful.", source: "Workshop 1 participant"},
    {text: "The balance between the academic and creative aspects of the workshop provided value and was beneficial to both creative and scientific people.", source: "Workshop 1 participant"},
    {text: "It was interesting to see how many shared experiences we have in terms of how we think.", source: "Workshop 2 participant"},
    {text: "It stretched my mind to really think about how I think and it was fun to discuss it with others to see how it differs from theirs!", source: "Workshop 2 participant"},
    {text: "Learning about how others' minds work – it really reinforces how different and unique every individual is.", source: "Workshop 2 participant"},
    {text: "I've realised people don't have a little voice who gives them feedback.", source: "Workshop 2 participant"},
    {text: "Discussing how different people's brains worked – this is a part of psychology that interests me a lot.", source: "Workshop 2 participant"}
  ];

  function init() {
    var content = document.getElementById('testimonial-content');
    var textEl = document.getElementById('testimonial-text');
    var sourceEl = document.getElementById('testimonial-source');
    var prevBtn = document.getElementById('testimonial-prev');
    var nextBtn = document.getElementById('testimonial-next');
    var toggleBtn = document.getElementById('testimonial-toggle');
    if (!content || !textEl || !sourceEl || quotes.length === 0) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = reducedMotion;
    var current = 0;
    var timer = null;

    function show(i, announce) {
      current = (i + quotes.length) % quotes.length;
      content.setAttribute('aria-live', announce ? 'polite' : 'off');
      textEl.textContent = '“' + quotes[current].text + '”';
      sourceEl.textContent = '– ' + quotes[current].source + ' (' + (current + 1) + ' of ' + quotes.length + ')';
      content.style.opacity = '1';
    }

    function step(delta, announce) {
      if (reducedMotion) {
        show(current + delta, announce);
        return;
      }
      content.style.opacity = '0';
      setTimeout(function() { show(current + delta, announce); }, 250);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function start() {
      stop();
      if (!paused) timer = setInterval(function() { step(1, false); }, 6500);
    }

    function syncButton() {
      if (!toggleBtn) return;
      toggleBtn.textContent = paused ? 'Play' : 'Pause';
      toggleBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { step(-1, true); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { step(1, true); start(); });
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        paused = !paused;
        syncButton();
        if (paused) stop();
        else start();
      });
    }

    syncButton();
    show(0, false);
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
