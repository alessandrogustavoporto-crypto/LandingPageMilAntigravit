// ===== HEADER SCROLL BEHAVIOR =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ===== MOBILE HAMBURGER MENU =====
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', false);
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const animateEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animateEls.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
      });
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) {
        activeLink.style.color = '#0066CC';
        activeLink.style.fontWeight = '700';
      }
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString('pt-BR') + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEls = entry.target.querySelectorAll('.stat strong');
      statEls.forEach(el => {
        const text = el.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d.,]/g, '').trim();
        el.dataset.suffix = suffix;
        animateCounter(el, num);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== CLICK RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      width: 0; height: 0;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out forwards;
      pointer-events: none;
    `;
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { width: 300px; height: 300px; opacity: 0; }
  }
`;
document.head.appendChild(style);

// ===== PRODUCT CARD STAGGER ANIMATION =====
const productCards = document.querySelectorAll('.product-card');
const productObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      productObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

productCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';
  productObserver.observe(card);
});

// ===== STEP CARDS STAGGER =====
const steps = document.querySelectorAll('.step');
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, i * 120);
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

steps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateX(-20px)';
  step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  stepObserver.observe(step);
});

// ===== SHOW FLOAT BUTTON AFTER SCROLL =====
const floatBtn = document.getElementById('whatsapp-float-btn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    floatBtn.style.opacity = '1';
    floatBtn.style.transform = 'scale(1)';
  } else {
    floatBtn.style.opacity = '0';
    floatBtn.style.transform = 'scale(0.8)';
  }
}, { passive: true });

// Initial state
floatBtn.style.opacity = '0';
floatBtn.style.transform = 'scale(0.8)';
floatBtn.style.transition = 'all 0.3s ease';
