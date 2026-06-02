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

  // Mobile Navigation Toggle
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    var navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Lightbox Functionality
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var src = galleryItems[index].getAttribute('data-src');
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImage.src = galleryItems[currentIndex].getAttribute('data-src');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lightboxImage.src = galleryItems[currentIndex].getAttribute('data-src');
  }

  if (galleryItems.length > 0) {
    galleryItems.forEach(function(item, index) {
      item.addEventListener('click', function() {
        openLightbox(index);
      });
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrev);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }

  // Close lightbox on background click
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // Update nav link active state on scroll
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
})();
