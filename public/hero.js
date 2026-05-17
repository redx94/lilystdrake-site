/**
 * LILY ST. DRAKE - CINEMATIC HERO
 * Pure CSS/JS Immersive Experience (No Three.js needed)
 */

(function() {
  'use strict';

  const CONFIG = {
    particleCount: 150,
    colors: ['#39ff14', '#00ff41', '#00ff88', '#ccff00', '#7fff00']
  };

  let canvas, ctx;
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let time = 0;

  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    createParticles();
    addEventListeners();
    animate();
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
  }

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.forEach((p, i) => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Mouse influence
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.x -= dx * 0.002;
        p.y -= dy * 0.002;
      }
      
      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      // Pulse effect
      const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(time * 2 + p.pulse));
      
      // Draw glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, p.color + Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw core
      ctx.fillStyle = p.color;
      ctx.globalAlpha = pulseOpacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    
    // Draw connections
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
    
    // Random glitch effect
    if (Math.random() < 0.005) {
      const glitchX = Math.random() * canvas.width;
      const glitchY = Math.random() * canvas.height;
      const glitchWidth = Math.random() * 200 + 50;
      const glitchHeight = Math.random() * 20 + 5;
      
      ctx.fillStyle = '#39ff14';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);
      ctx.globalAlpha = 1;
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();