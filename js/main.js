/* =========================================================
   Roamingoo — main.js
   Sticky nav · mobile drawer · smooth scroll · reveal-on-scroll ·
   hero slider · wonders carousel · scroll-to-top · year
   ========================================================= */

(function () {
  'use strict';

  /* ---------- STICKY NAV ---------- */
  function initStickyNav() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    let ticking = false;
    const update = () => {
      if (window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- MOBILE DRAWER ---------- */
  function initMobileNav() {
    const ham = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('drawerClose');
    if (!ham || !drawer) return;

    const close = () => {
      ham.classList.remove('open');
      drawer.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const toggle = () => {
      const isOpen = ham.classList.toggle('open');
      drawer.classList.toggle('open', isOpen);
      ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    ham.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 959) close();
    });
  }

  /* ---------- SMOOTH SCROLL ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 30;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in-view'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ---------- HERO SLIDER ---------- */
  function initHero() {
    const wrap = document.getElementById('heroSlides');
    const pagination = document.getElementById('heroPagination');
    if (!wrap || !pagination) return;
    const slides = Array.from(wrap.children);
    const dots = Array.from(pagination.children);
    let idx = 0;
    let timer = null;
    const DELAY = 5500;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    }
    function next() { go(idx + 1); }
    function start() { timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    dots.forEach((d, k) => {
      d.addEventListener('click', () => { go(k); restart(); });
    });
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);

    start();
  }

  /* ---------- WONDERS CAROUSEL ---------- */
  function initWonders() {
    const next = document.getElementById('wondersNext');
    const grid = document.getElementById('wondersGrid');
    if (!next || !grid) return;
    next.addEventListener('click', () => {
      const first = grid.firstElementChild;
      if (!first) return;
      first.style.transition = 'opacity .4s ease, transform .4s ease';
      first.style.opacity = '0';
      first.style.transform = 'translateX(-30px)';
      setTimeout(() => {
        first.style.transition = '';
        first.style.opacity = '';
        first.style.transform = '';
        grid.appendChild(first);
      }, 400);
    });
  }

  /* ---------- SCROLL TO TOP ---------- */
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    let ticking = false;
    const update = () => {
      if (window.scrollY > 600) btn.classList.add('show');
      else btn.classList.remove('show');
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- FOOTER YEAR ---------- */
  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- ACTIVE NAV LINK BY SECTION ---------- */
  function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---------- CONTACT FORM ---------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.classList.remove('error');
      status.textContent = '';

      // simple client-side check
      const required = form.querySelectorAll('[required]');
      for (const el of required) {
        if (!el.value || (el.type === 'checkbox' && !el.checked)) {
          status.classList.add('error');
          status.textContent = 'Please fill in all required fields.';
          el.focus();
          return;
        }
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      // Simulated send. Replace with real fetch() to your endpoint.
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        form.reset();
        status.textContent = 'Thanks — we got it. We\'ll reply within 24 hours.';
      }, 900);
    });
  }

  /* ---------- DESTINATION HERO ---------- */
  function initDestHero() {
    const wrap = document.getElementById('destHeroSlides');
    const pagination = document.getElementById('destPagination');
    if (!wrap || !pagination) return;
    const slides = Array.from(wrap.children);
    const dots = Array.from(pagination.children);
    let idx = 0;
    let timer = null;
    const DELAY = 5500;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    }
    function next() { go(idx + 1); }
    function start() { timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); restart(); }));
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);

    start();
  }

  /* ---------- WATCH VIDEO STUB ---------- */
  function initWatchVideo() {
    const btn = document.getElementById('watchVideo');
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Placeholder — wire up your video modal / lightbox here.
      alert('Trailer coming soon — drop your video URL into initWatchVideo() to enable.');
    });
  }

  /* ---------- ENQUIRE FORM (tour page) ---------- */
  function initEnquireForm() {
    const form = document.getElementById('enquireForm');
    const status = document.getElementById('enquireStatus');
    if (!form || !status) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.classList.remove('error');
      status.textContent = '';
      const required = form.querySelectorAll('[required]');
      for (const el of required) {
        if (!el.value) {
          status.classList.add('error');
          status.textContent = 'Please fill in both fields.';
          el.focus();
          return;
        }
      }
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        form.reset();
        status.textContent = 'Got it — we\'ll reply within 24 hours.';
      }, 900);
    });
  }

  /* ---------- BOOKING PAGE ---------- */
  function initBooking() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    // Payment tab switching
    const tabs = form.querySelectorAll('.pay-tab');
    const panels = form.querySelectorAll('.pay-panel');
    tabs.forEach(t => t.addEventListener('click', () => {
      const key = t.dataset.pay;
      tabs.forEach(x => x.classList.toggle('active', x === t));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
    }));

    // Card number formatting + brand detection
    const cardInput = document.getElementById('cardNumber');
    const cardBrand = document.getElementById('cardBrand');
    if (cardInput) {
      cardInput.addEventListener('input', () => {
        let v = cardInput.value.replace(/\D/g, '').slice(0, 16);
        cardInput.value = v.replace(/(.{4})/g, '$1 ').trim();
        if (cardBrand) {
          let brand = 'CARD';
          let cls = '';
          if (/^4/.test(v)) { brand = 'VISA'; cls = 'visa'; }
          else if (/^(5[1-5]|2[2-7])/.test(v)) { brand = 'MASTERCARD'; cls = 'mastercard'; }
          else if (/^3[47]/.test(v)) { brand = 'AMEX'; cls = 'amex'; }
          else if (/^(60|65|81|82)/.test(v)) { brand = 'RUPAY'; cls = 'rupay'; }
          cardBrand.textContent = brand;
          cardBrand.className = 'card-brand ' + cls;
        }
      });
    }

    // Expiry MM / YY
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', () => {
        let v = expiryInput.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
        expiryInput.value = v;
      });
    }

    // Order summary live totals
    const BASE = 18900, FEE = 1200, DISCOUNT = 2000, TAX_RATE = 0.05;
    const travellersSel = form.querySelector('[name="travellers"]');
    const osCount = document.getElementById('osCount');
    const osSubtotal = document.getElementById('osSubtotal');
    const osTax = document.getElementById('osTax');
    const osTotal = document.getElementById('osTotal');
    const fmt = (n) => '₹' + n.toLocaleString('en-IN');

    function recalc() {
      let n = parseInt(travellersSel.value, 10);
      if (isNaN(n)) n = 5; // "5+" case
      const subtotal = BASE * n;
      const tax = Math.round((subtotal + FEE) * TAX_RATE);
      const total = subtotal + FEE + tax - DISCOUNT;
      if (osCount) osCount.textContent = '× ' + travellersSel.value;
      if (osSubtotal) osSubtotal.textContent = fmt(subtotal);
      if (osTax) osTax.textContent = fmt(tax);
      if (osTotal) osTotal.textContent = fmt(total);
    }
    if (travellersSel) {
      travellersSel.addEventListener('change', recalc);
      recalc();
    }

    // Submit → simulate payment → success modal
    const modal = document.getElementById('successModal');
    const refEl = document.getElementById('bmRef');
    const closeBtn = document.getElementById('bmClose');
    const backdrop = document.getElementById('bmBackdrop');

    function openModal() {
      if (!modal) return;
      const ref = 'RG-2026-' + String(Math.floor(100000 + Math.random() * 900000));
      if (refEl) refEl.textContent = ref;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      form.reset();
      recalc();
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Only validate visible required fields (active payment panel)
      const activePanel = form.querySelector('.pay-panel.active');
      const detailFields = form.querySelectorAll('.booking-card:first-child [required]');
      let firstBad = null;
      detailFields.forEach(el => { if (!el.value && !firstBad) firstBad = el; });
      if (activePanel) {
        activePanel.querySelectorAll('[required]').forEach(el => {
          if (!el.value && !firstBad) firstBad = el;
        });
      }
      if (firstBad) {
        firstBad.focus();
        firstBad.style.borderColor = '#ff8a8a';
        setTimeout(() => firstBad.style.borderColor = '', 1500);
        return;
      }

      const payBtn = form.querySelector('.os-pay');
      const originalHTML = payBtn.innerHTML;
      payBtn.disabled = true;
      payBtn.innerHTML = 'Processing…';
      setTimeout(() => {
        payBtn.disabled = false;
        payBtn.innerHTML = originalHTML;
        openModal();
      }, 1400);
    });
  }

  /* ---------- NAV SEARCH ---------- */
  function initSearch() {
    const wrap = document.querySelector('.nav-search');
    if (!wrap) return;
    const input = wrap.querySelector('input');
    const icon = wrap.querySelector('svg');
    if (!input) return;

    const INDEX = [
      // Journeys (current phase destinations)
      { title: 'Spiti Valley', desc: 'High altitude roads and mountain silence', href: 'backpacking.html', keywords: 'spiti valley himachal backpacking high altitude mountain solo group', group: 'Journeys' },
      { title: 'Manali', desc: 'Mountain cafés and shared stories', href: 'destination.html', keywords: 'manali himachal backpacking mountain cafe solo old kasol parvati', group: 'Journeys' },
      { title: 'Goa', desc: 'Coastal days and easy conversations', href: 'destination-goa.html', keywords: 'goa beach beaches arabian sea sunset palolem anjuna baga coastal social', group: 'Journeys' },
      { title: 'Varanasi', desc: 'Stories, rituals and old city mornings', href: 'destination-banaras.html', keywords: 'varanasi banaras kashi ghats ganga aarti culture spiritual heritage', group: 'Journeys' },
      { title: 'Mussoorie', desc: 'Disconnect to reconnect', href: 'destination-uttarakhand.html', keywords: 'mussoorie uttarakhand digital detox retreat slow himalaya hills reset', group: 'Journeys' },
      { title: 'Kasol', desc: 'Riverside trails and backpacking days', href: 'destination.html', keywords: 'kasol parvati himachal river backpacking hippie israeli cafe trek', group: 'Journeys' },
      { title: 'Rishikesh', desc: 'River energy and weekend adventure', href: 'destination-uttarakhand.html', keywords: 'rishikesh uttarakhand ganga rafting weekend adventure yoga river beatles ashram', group: 'Journeys' },

      // Site
      { title: 'All Journeys', desc: 'Browse every Roamingoo journey', href: 'index.html#journeys', keywords: 'journeys destinations explore all places india travel' },
      { title: 'How We Travel', desc: 'Solo-friendly, small group, responsible', href: 'index.html#why', keywords: 'why how we travel small group solo responsible philosophy' },
      { title: 'Our Story', desc: 'Why Roamingoo exists', href: 'index.html#story', keywords: 'story about who we are mission philosophy' },
      { title: 'Plan With Us', desc: 'Reserve your seat', href: 'booking.html', keywords: 'plan book booking pay payment reserve checkout confirm' },
      { title: 'Contact', desc: 'Get in touch with us', href: 'contact.html', keywords: 'contact email phone reach help support whatsapp' },

      // Legacy / extended destinations (kept reachable from search)
      { title: 'Uttarakhand', desc: 'Sacred peaks, Char Dham, Ganga', href: 'destination-uttarakhand.html', keywords: 'uttarakhand devbhumi kedarnath badrinath gangotri yamunotri valley of flowers auli har ki dun trek char dham nanda devi' },
      { title: 'West Bengal', desc: 'Tea gardens and tigers', href: 'destination-west-bengal.html', keywords: 'west bengal kolkata darjeeling sundarbans tea tigers' },
      { title: 'Sikkim', desc: 'Monasteries and Kangchenjunga', href: 'destination-sikkim.html', keywords: 'sikkim gangtok kangchenjunga tsomgo lake monastery' }
    ];

    const list = document.createElement('div');
    list.className = 'search-results';
    list.setAttribute('role', 'listbox');
    wrap.appendChild(list);

    let current = [];
    let active = -1;

    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    function score(q, item) {
      q = q.toLowerCase();
      const title = item.title.toLowerCase();
      const hay = (item.title + ' ' + item.keywords + ' ' + item.desc).toLowerCase();
      if (title === q) return 5;
      if (title.startsWith(q)) return 4;
      if (title.includes(q)) return 3;
      if ((' ' + hay).includes(' ' + q)) return 2;
      if (hay.includes(q)) return 1;
      return 0;
    }

    function updateActive() {
      list.querySelectorAll('.sr-item').forEach((el, i) => el.classList.toggle('active', i === active));
    }

    function renderPicker() {
      // Seed the dropdown with the 7 journeys when the user focuses the
      // empty search bar — turns the input into a lightweight destination picker.
      const journeys = INDEX.filter((it) => it.group === 'Journeys');
      current = journeys.slice(0, 7);
      list.classList.add('open', 'picker-mode');
      list.innerHTML =
        '<div class="sr-section-label">Choose a journey</div>' +
        current.map((item, i) =>
          '<a class="sr-item" href="' + item.href + '" data-i="' + i + '">' +
          '<span class="sr-title">' + esc(item.title) + '</span>' +
          '<span class="sr-desc">' + esc(item.desc) + '</span>' +
          '</a>'
        ).join('');
      active = 0;
      updateActive();
    }

    function render(q) {
      if (!q) {
        renderPicker();
        return;
      }
      list.classList.remove('picker-mode');
      current = INDEX
        .map((item) => ({ item, s: score(q, item) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 7)
        .map((x) => x.item);

      list.classList.add('open');
      if (!current.length) {
        list.innerHTML = '<div class="sr-empty">No matches for "' + esc(q) + '"</div>';
        active = -1;
        return;
      }
      list.innerHTML = current.map((item, i) =>
        '<a class="sr-item" href="' + item.href + '" data-i="' + i + '">' +
        '<span class="sr-title">' + esc(item.title) + '</span>' +
        '<span class="sr-desc">' + esc(item.desc) + '</span>' +
        '</a>'
      ).join('');
      active = 0;
      updateActive();
    }

    input.addEventListener('input', () => render(input.value.trim()));
    input.addEventListener('focus', () => render(input.value.trim()));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (current.length) { active = (active + 1) % current.length; updateActive(); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (current.length) { active = (active - 1 + current.length) % current.length; updateActive(); }
      } else if (e.key === 'Enter') {
        if (current.length && active >= 0) {
          e.preventDefault();
          window.location.href = current[active].href;
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        render('');
        input.blur();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) list.classList.remove('open');
    });

    if (icon) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', () => {
        if (current.length && active >= 0) {
          window.location.href = current[active].href;
        } else {
          input.focus();
        }
      });
    }
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initStickyNav();
    initMobileNav();
    initSmoothScroll();
    initReveal();
    initHero();
    initWonders();
    initScrollTop();
    initYear();
    initActiveSection();
    initContactForm();
    initDestHero();
    initWatchVideo();
    initEnquireForm();
    initBooking();
    initSearch();
  });
})();
