(function() {
  'use strict';

  const IS_MOBILE = window.innerWidth < 768;

  const CONFIG = {
    particleCount: IS_MOBILE ? 40 : 150,
    colors: ['#39ff14', '#00ff41', '#00ff88', '#ccff00', '#7fff00']
  };

  let canvas, ctx;
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let time = 0;

  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (IS_MOBILE) {
      canvas.style.background = 'radial-gradient(circle at center, rgba(57, 255, 20, 0.05) 0%, rgba(5, 5, 5, 1) 70%)';
    }

    ctx = canvas.getContext('2d');

    resizeCanvas();
    createParticles();
    addEventListeners();
    if (!IS_MOBILE) animate();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function addEventListeners() {
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }, { passive: true });
  }

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.x -= dx * 0.002;
        p.y -= dy * 0.002;
      }

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(time * 2 + p.pulse));

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, p.color + Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.globalAlpha = pulseOpacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = (1 - dist / 150) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    if (Math.random() < 0.005) {
      ctx.fillStyle = '#39ff14';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 200 + 50, Math.random() * 20 + 5);
      ctx.globalAlpha = 1;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
