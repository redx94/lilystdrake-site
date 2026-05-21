/**
 * LILY ST. DRAKE - SIGNATURE DISTORTION CURSOR
 * "Liquid Reality" Effect
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    radius: 150,
    strength: 0.15,
    blur: 0.03,
    color: '57, 255, 20', // RGB for neon green
  };

  let cursor, follower;
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  let isHovering = false;
  let distortionOverlay;
  let canvas, ctx;

  function init() {
    createCursor();
    createDistortionCanvas();
    addEventListeners();
    animate();
  }

  function createCursor() {
    // Main cursor
    cursor = document.createElement('div');
    cursor.className = 'signature-cursor';
    cursor.innerHTML = `
      <div class="cursor-ring cursor-ring-outer"></div>
      <div class="cursor-ring cursor-ring-inner"></div>
      <div class="cursor-core"></div>
    `;
    document.body.appendChild(cursor);

    // Follower (trailing element)
    follower = document.createElement('div');
    follower.className = 'signature-follower';
    document.body.appendChild(follower);
  }

  function createDistortionCanvas() {
    // Create canvas for the distortion effect
    distortionOverlay = document.createElement('div');
    distortionOverlay.className = 'distortion-overlay';
    distortionOverlay.innerHTML = `
      <canvas id="distortion-canvas"></canvas>
      <div class="distortion-mask"></div>
    `;
    document.body.appendChild(distortionOverlay);

    canvas = document.getElementById('distortion-canvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function addEventListeners() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);

    // Hover detection
    const hoverSelectors = 'a, button, .gallery-item, .video-item, .social-link, .wishlist-item, input, textarea, select';
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => isHovering = true);
      el.addEventListener('mouseleave', () => isHovering = false);
    });

    // Also track new elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(hoverSelectors)) {
        isHovering = true;
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(hoverSelectors)) {
        isHovering = false;
      }
    });
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth cursor following with delay
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;

    // Position cursor
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

    // Update cursor state
    if (isHovering) {
      cursor.classList.add('hovering');
    } else {
      cursor.classList.remove('hovering');
    }

    // Draw distortion effect
    drawDistortion();
  }

  function drawDistortion() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create radial gradient for distortion
    const gradient = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, CONFIG.radius
    );

    // Calculate intensity based on movement
    const movement = Math.sqrt(
      Math.pow(mouseX - cursorX, 2) + Math.pow(mouseY - cursorY, 2)
    );
    const intensity = Math.min(movement * 0.05, 1);

    // Inner - most distorted (liquid effect)
    gradient.addColorStop(0, `rgba(${CONFIG.color}, ${0.4 * intensity})`);
    gradient.addColorStop(0.3, `rgba(${CONFIG.color}, ${0.2 * intensity})`);
    gradient.addColorStop(0.6, `rgba(${CONFIG.color}, ${0.1 * intensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, CONFIG.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add chromatic aberration rings
    if (intensity > 0.3) {
      // Red shift
      ctx.beginPath();
      ctx.arc(cursorX + 5, cursorY + 5, CONFIG.radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 50, 50, ${0.1 * intensity})`;
      ctx.stroke();

      // Blue shift
      ctx.beginPath();
      ctx.arc(cursorX - 5, cursorY - 5, CONFIG.radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(50, 50, 255, ${0.1 * intensity})`;
      ctx.stroke();
    }
  }

  // Add CSS styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Signature Cursor */
      .signature-cursor {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
      }

      .cursor-ring {
        position: absolute;
        border: 2px solid #39ff14;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .cursor-ring-outer {
        width: 40px;
        height: 40px;
        top: -20px;
        left: -20px;
        animation: cursorPulse 2s ease-in-out infinite;
      }

      .cursor-ring-inner {
        width: 20px;
        height: 20px;
        top: -10px;
        left: -10px;
        border-color: #00ff88;
        animation: cursorPulse 2s ease-in-out infinite 0.3s;
      }

      .cursor-core {
        width: 4px;
        height: 4px;
        background: #39ff14;
        border-radius: 50%;
        position: absolute;
        top: -2px;
        left: -2px;
        box-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;
      }

      .signature-cursor.hovering .cursor-ring-outer {
        width: 60px;
        height: 60px;
        top: -30px;
        left: -30px;
        border-color: #ccff00;
        box-shadow: 0 0 20px rgba(204, 255, 0, 0.5);
      }

      .signature-cursor.hovering .cursor-ring-inner {
        width: 40px;
        height: 40px;
        top: -20px;
        left: -20px;
      }

      @keyframes cursorPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }

      /* Follower */
      .signature-follower {
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(204,255,0,0.8) 0%, rgba(57,255,20,0.4) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      }

      /* Distortion Overlay */
      .distortion-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
      }

      #distortion-canvas {
        width: 100%;
        height: 100%;
      }

      .distortion-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      /* Hide default cursor when signature cursor is active */
      body.signature-cursor-active {
        cursor: none;
      }

      body.signature-cursor-active * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('signature-cursor-active');
  }

  // Initialize
  addStyles();
  init();
})();