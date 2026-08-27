document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     Footer year
     ============================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     Header: solid background after scrolling past hero
     ============================================ */
  const header = document.getElementById('siteHeader');
  const hero = document.querySelector('.hero');

  const updateHeader = () => {
    const threshold = hero ? hero.offsetHeight * 0.7 : 80;
    header.classList.toggle('is-scrolled', window.scrollY > threshold);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ============================================
     Mobile menu
     ============================================ */
  const burger = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  };

  burger.addEventListener('click', toggleMenu);

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============================================
     Smooth scroll with header-offset (native smooth
     scroll + scroll-margin-top already handles anchors;
     this covers the button that isn't an in-page anchor id issue)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ============================================
     Menu category tabs — no reload
     ============================================ */
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        const match = panel.dataset.panel === category;
        panel.classList.toggle('is-active', match);
        panel.hidden = !match;
      });
    });
  });

  /* ============================================
     Scroll reveal animations
     ============================================ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = Math.min(i * 60, 240);
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ============================================
     Booking form
     ============================================ */
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const bookingSuccessText = document.getElementById('bookingSuccessText');
  const bookingAgainBtn = document.getElementById('bookingAgainBtn');

  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const name = document.getElementById('name').value.trim();
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const guests = document.getElementById('guests').value;

      const formattedDate = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
          })
        : '';

      bookingSuccessText.textContent =
        `${name}, ждём вас ${formattedDate} в ${time} — столик на ${guests.toLowerCase()}.`;

      bookingForm.hidden = true;
      bookingSuccess.hidden = false;
      bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (bookingAgainBtn) {
    bookingAgainBtn.addEventListener('click', () => {
      bookingForm.reset();
      bookingSuccess.hidden = true;
      bookingForm.hidden = false;
    });
  }

  /* ============================================
     Image fallback — graceful placeholder if an
     Unsplash image fails to load
     ============================================ */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function handler() {
      this.removeEventListener('error', handler);
      this.style.background = 'linear-gradient(135deg, #EFE3CD, #DCCBAC)';
      this.style.objectFit = 'cover';
      this.style.minHeight = '100%';
      this.alt = this.alt || 'LUNA Café';
    }, { once: true });
  });

});
