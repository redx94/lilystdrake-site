document.addEventListener('DOMContentLoaded', () => {
  // Safari 100vh fix
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);

  // Loading screen
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    if (loaderProgress) loaderProgress.style.width = progress + '%';
  }, 200);
});
