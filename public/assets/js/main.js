(function() {
  'use strict';

  // Safari 100vh fix
  function setVH() {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH);

  // Loading screen — deterministic, always completes in ~3s
  var loader = document.querySelector('.loader');
  var bar = document.querySelector('.loader-progress');
  var p = 0;

  var interval = setInterval(function() {
    p += 8;
    if (p >= 100) {
      p = 100;
      clearInterval(interval);
      setTimeout(function() {
        if (loader) loader.classList.add('hidden');
      }, 500);
    }
    if (bar) bar.style.width = p + '%';
  }, 250);

  // Safety: force-complete after 6s regardless
  setTimeout(function() {
    if (loader && !loader.classList.contains('hidden')) {
      clearInterval(interval);
      if (bar) bar.style.width = '100%';
      setTimeout(function() { loader.classList.add('hidden'); }, 200);
    }
  }, 6000);
})();
