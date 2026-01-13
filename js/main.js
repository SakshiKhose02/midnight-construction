// Modern MIDNIGHT Construction Site - Enhanced JavaScript
// Features: Lazy Loading, Page Loader, 3D Effects, Smooth Animations

(function() {
  'use strict';

  // ==================== PAGE LOADER ====================
  const pageLoader = {
    init() {
      window.addEventListener('load', () => this.hide());
      setTimeout(() => this.hide(), 10000);
    },
    hide() {
      const loader = document.querySelector('.page-loader');
      if (loader) {
        loader.classList.add('hide');
      }
    }
  };

  // ==================== LAZY LOADING ====================
  const lazyLoader = {
    imageObserver: null,

    init() {
      if ('IntersectionObserver' in window) {
        this.imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
            }
          });
        }, {
          rootMargin: '50px'
        });

        document.querySelectorAll('[data-lazy]').forEach(img => {
          this.imageObserver.observe(img);
        });
      } else {
        // Fallback for older browsers
        document.querySelectorAll('[data-lazy]').forEach(img => {
          this.loadImage(img);
        });
      }
    },

    loadImage(img) {
      const src = img.dataset.lazy;
      if (src) {
        img.src = src;
        img.classList.add('loaded');
        if (this.imageObserver) {
          this.imageObserver.unobserve(img);
        }
      }
    }
  };

  // ==================== SMOOTH NAVIGATION ====================
  const smoothNavigation = {
    init() {
      document.querySelectorAll('.header nav a').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, null, href);
            }
          }
        });
      });
    }
  };

  // ==================== ACTIVE NAV HIGHLIGHTING ====================
  const activeNav = {
    observer: null,

    init() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.setActiveNav(entry.target.id);
            }
          });
        }, {
          threshold: 0.3
        });

        document.querySelectorAll('[id]').forEach(section => {
          this.observer.observe(section);
        });
      }
    },

    setActiveNav(sectionId) {
      document.querySelectorAll('.header nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  // ==================== SCROLL ANIMATIONS ====================
  const scrollAnimations = {
    observer: null,

    init() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('[data-anim]').forEach(el => {
          this.observer.observe(el);
        });
      }
    }
  };

  // ==================== PARALLAX EFFECT ====================
  const parallax = {
    init() {
      const hero = document.querySelector('.home .hero');
      if (hero && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => this.update(hero), { passive: true });
      }
    },

    update(hero) {
      const scrolled = window.pageYOffset;
      const speed = 0.25;
      hero.style.backgroundPosition = `center ${scrolled * speed}px`;
    }
  };

  // ==================== PAGE LOAD ANIMATIONS ====================
  const pageLoadAnimations = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        document.querySelectorAll('[data-anim]').forEach((el, index) => {
          el.classList.add('will-animate');
          setTimeout(() => {
            el.classList.add('animate-in');
          }, index * 120);
        });
      }
    }
  };

  // ==================== BUTTON RIPPLE EFFECT ====================
  const rippleEffect = {
    init() {
      document.addEventListener('click', (e) => {
        const button = e.target.closest('button, input[type="submit"], .btn');
        if (button && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
          this.createRipple(e, button);
        }
      });
    },

    createRipple(e, button) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }
  };

  // ==================== IMAGE MODAL / LIGHTBOX ====================
  const imageModal = {
    modal: null,
    backdrop: null,
    closeBtn: null,

    init() {
      this.createModal();
      this.attachGalleryListeners();
      this.setupCloseButton();
    },

    createModal() {
      const modal = document.createElement('div');
      modal.className = 'image-modal';
      modal.innerHTML = `
        <div class="image-modal__backdrop">
          <div class="image-modal__content">
            <img class="image-modal__img" src="" alt="">
            <button class="image-modal__close" aria-label="Close">&times;</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      this.modal = modal;
      this.backdrop = modal.querySelector('.image-modal__backdrop');
      this.closeBtn = modal.querySelector('.image-modal__close');
    },

    attachGalleryListeners() {
      document.querySelectorAll('.project .box a, .about .image img').forEach(link => {
        if (link.tagName === 'A' || link.tagName === 'IMG') {
          link.addEventListener('click', (e) => {
            if (link.tagName === 'A') {
              e.preventDefault();
              const imageSrc = link.href;
              this.open(imageSrc);
            }
          });
        }
      });
    },

    setupCloseButton() {
      this.closeBtn.addEventListener('click', () => this.close());
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    },

    open(src) {
      const img = this.modal.querySelector('.image-modal__img');
      img.src = src;
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // ==================== HEADER SCROLL EFFECT ====================
  const headerScroll = {
    header: null,

    init() {
      this.header = document.querySelector('.header');
      if (this.header) {
        window.addEventListener('scroll', () => this.update(), { passive: true });
      }
    },

    update() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  };

  // ==================== ACCESSIBILITY: REDUCED MOTION ====================
  const accessibility = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: prefer)').matches) {
        document.documentElement.classList.add('reduced-motion');
      }
      window.matchMedia('(prefers-reduced-motion: prefer)').addEventListener('change', (e) => {
        if (e.matches) {
          document.documentElement.classList.add('reduced-motion');
        } else {
          document.documentElement.classList.remove('reduced-motion');
        }
      });
    }
  };

  // ==================== FORM HANDLING ====================
  const formHandler = {
    init() {
      document.querySelectorAll('.contact .form-container form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(form);
        });
      });
    },

    handleSubmit(form) {
      const inputs = form.querySelectorAll('input[type="email"], input[type="text"], textarea');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff6b35';
        } else {
          input.style.borderColor = '';
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('input[type="submit"]');
        const originalValue = submitBtn.value;
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.value = 'Message Sent!';
          setTimeout(() => {
            submitBtn.value = originalValue;
            submitBtn.disabled = false;
            form.reset();
          }, 2000);
        }, 1500);
      }
    }
  };

  // ==================== COUNTER ANIMATION ====================
  const counterAnimation = {
    init() {
      const counters = document.querySelectorAll('.home .counting .count');
      if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
      }
    },

    animateCounter(element) {
      const finalValue = parseInt(element.textContent);
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(finalValue * progress);
        element.textContent = currentValue + '+';

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  };

  // ==================== INITIALIZATION ====================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    pageLoader.init();
    lazyLoader.init();
    smoothNavigation.init();
    activeNav.init();
    scrollAnimations.init();
    parallax.init();
    pageLoadAnimations.init();
    rippleEffect.init();
    imageModal.init();
    headerScroll.init();
    accessibility.init();
    formHandler.init();
    counterAnimation.init();
  }

  init();
})();
