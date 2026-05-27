document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 500);
    }
    if (loaderProgress) {
      loaderProgress.style.width = progress + '%';
    }
  }, 200);
});
