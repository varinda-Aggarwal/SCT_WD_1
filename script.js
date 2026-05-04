/* ============================================================
   FinTrack — SkillCraft Technology
   JavaScript — Interactive Navbar + Page Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     1. NAVBAR — Scroll Behavior
  ────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const progress  = document.getElementById('navProgress');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Toggle scrolled class
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Reading progress bar
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progress.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run once on load


  /* ──────────────────────────────────────
     2. NAVBAR — Active Link on Scroll
  ────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightActiveLink() {
    const scrollPos = window.scrollY + 90;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });


  /* ──────────────────────────────────────
     3. NAVBAR — Hover Ripple Effect on Links
  ────────────────────────────────────── */
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.letterSpacing = '0.3px';
    });
    link.addEventListener('mouseleave', function () {
      this.style.letterSpacing = '0.1px';
    });
  });


  /* ──────────────────────────────────────
     4. HAMBURGER MENU (Mobile)
  ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });


  /* ──────────────────────────────────────
     5. SMOOTH SCROLL for Anchor Links
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────
     6. INTERSECTION OBSERVER — Fade-in Cards
  ────────────────────────────────────── */
  const observerOpts = {
    root: null,
    threshold: 0.12,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, parseInt(delay));
        fadeObserver.unobserve(el);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.feature-card').forEach(card => {
    fadeObserver.observe(card);
  });


  /* ──────────────────────────────────────
     7. DASHBOARD PREVIEW — Sidebar Tabs
  ────────────────────────────────────── */
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', function () {
      sidebarItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });


  /* ──────────────────────────────────────
     8. CONTACT FORM — Submit Feedback
  ────────────────────────────────────── */
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      const inputs   = document.querySelectorAll('.form-group input, .form-group textarea');
      let   allFilled = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
          input.style.borderColor = 'rgba(224,112,112,0.5)';
          setTimeout(() => input.style.borderColor = '', 2000);
        }
      });

      if (allFilled) {
        const original = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
        this.style.background = 'var(--accent2)';
        this.disabled = true;
        setTimeout(() => {
          this.innerHTML = original;
          this.style.background = '';
          this.disabled = false;
          inputs.forEach(i => i.value = '');
        }, 3000);
      }
    });
  }


  /* ──────────────────────────────────────
     9. ANIMATED COUNTER on Hero Stats
  ────────────────────────────────────── */
  function animateCount(el, end, prefix, suffix, decimals = 0) {
    const duration = 1800;
    const start    = performance.now();
    const from     = 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = (from + (end - from) * eased).toFixed(decimals);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCount(statNums[0], 2.4, '₹', 'Cr+', 1);
        animateCount(statNums[1], 98,  '',  '%',   0);
        animateCount(statNums[2], 12,  '',  '+',   0);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  /* ──────────────────────────────────────
     10. MINI CHART BARS — Animate on Load
  ────────────────────────────────────── */
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, i) => {
    const targetH = bar.style.getPropertyValue('--h');
    bar.style.setProperty('--h', '0%');
    setTimeout(() => {
      bar.style.transition = 'height 0.6s cubic-bezier(.4,0,.2,1)';
      bar.style.setProperty('--h', targetH);
    }, 300 + i * 80);
  });

});