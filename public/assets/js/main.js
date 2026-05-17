// ========================================
// LILY ST. DRAKE - ENHANCED JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // ========================================
  // CUSTOM CURSOR
  // ========================================
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor hover effect
  const hoverElements = document.querySelectorAll('a, button, .gallery-item, .video-item, .social-link');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // ========================================
  // LOADING SCREEN
  // ========================================
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  
  // Simulate loading
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger entrance animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('visible');
        });
      }, 500);
    }
    if (loaderProgress) {
      loaderProgress.style.width = progress + '%';
    }
  }, 200);

  // ========================================
  // NAVIGATION
  // ========================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ========================================
  // PARALLAX EFFECT
  // ========================================
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      hero.querySelectorAll('.hero-orb').forEach((orb, index) => {
        orb.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px)`;
      });
    });
  }

  // ========================================
  // GALLERY FILTER
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      galleryItems.forEach((item, index) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ========================================
  // LIGHTBOX
  // ========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.gallery-title').textContent;
      const category = item.querySelector('.gallery-category').textContent;
      const placeholder = item.querySelector('.gallery-placeholder').textContent;
      
      // For now, show placeholder number
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = category;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });

  // ========================================
  // BOOKING FORM
  // ========================================
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());
      
      // Show success
      const btn = bookingForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'SENT!';
      btn.style.background = 'var(--neon-mint)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        bookingForm.reset();
      }, 3000);
      
      console.log('Booking inquiry:', data);
    });
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========================================
  // VIDEO PLAYER (PLACEHOLDER)
  // ========================================
  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.video-title');
      alert(`Video player coming soon! This will play: ${title.textContent}`);
    });
  });

  // ========================================
  // SMOOTH SCROLL FOR NAV LINKS ON SAME PAGE
  // ========================================
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // ========================================
  // REVEAL ANIMATIONS ON SCROLL
  // ========================================
  const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about-content, .gallery-grid');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s, transform 0.8s';
    revealObserver.observe(el);
  });

  // ========================================
  // KEYBOARD ACCESSIBILITY
  // ========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    }
  });

  console.log('🎭 Lily St. Drake - Enhanced Website Loaded');
});
  // ========================================
  // WISHLIST FILTER
  // ========================================
  const wishlistCatBtns = document.querySelectorAll('.wishlist-cat-btn');
  const wishlistItems = document.querySelectorAll('.wishlist-item');

  wishlistCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wishlistCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.category;
      
      wishlistItems.forEach((item, index) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
