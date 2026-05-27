document.addEventListener('DOMContentLoaded', () => {
  // Safari viewport fix
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);

  // Loading screen
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  if (!loader) return;
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) {
      p = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    if (loaderProgress) loaderProgress.style.width = p + '%';
  }, 200);
});
