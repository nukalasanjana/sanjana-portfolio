/* ============================================================
   MAIN.JS — Shared scripts across all pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal ────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target); // fire once
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }

  // ── Active Nav Link ──────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ── Work Filter (work page only) ─────────────────────────
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const category = card.dataset.category || '';
          const show = filter === 'all' || category === filter;
          card.style.opacity    = show ? '1' : '0.25';
          card.style.pointerEvents = show ? 'auto' : 'none';
          card.style.transform  = show ? 'none' : 'scale(0.97)';
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
      });
    });
  }

  // ── Case Study In-Page Section Nav ──────────────────────
  const sectionNav = document.querySelector('.cs-section-nav');
  if (sectionNav) {
    const navLinks = Array.from(sectionNav.querySelectorAll('a'));
    const targets  = navLinks
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', isActive);
        if (isActive) a.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );
    targets.forEach(el => sectionObserver.observe(el));

    // Activate first link on load
    if (targets.length) setActive(targets[0].id);
  }

  // ── Resume Modal ─────────────────────────────────────────
  const resumeTrigger = document.querySelector('[data-resume-trigger]');
  if (resumeTrigger) {
    // Inject modal HTML once
    const modal = document.createElement('div');
    modal.id = 'resume-modal';
    modal.innerHTML = `
      <div class="resume-modal-backdrop"></div>
      <div class="resume-modal-panel">
        <div class="resume-modal-toolbar">
          <span class="resume-modal-title">Sanjana Nukala — Resume</span>
          <div class="resume-modal-actions">
            <a class="resume-open-link" target="_blank" rel="noopener">Open PDF</a>
            <button class="resume-modal-close" aria-label="Close resume">✕</button>
          </div>
        </div>
        <iframe class="resume-modal-frame" title="Sanjana Nukala Resume"></iframe>
      </div>
    `;
    document.body.appendChild(modal);

    // Resolve path to PDF relative to current page depth
    function getResumeSrc() {
      const depth = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean).length;
      return '../'.repeat(depth) + "resources/Sanjana Nukala's Resume 3.5.26.pdf";
    }

    const frame    = modal.querySelector('.resume-modal-frame');
    const openLink = modal.querySelector('.resume-open-link');
    const closeBtn = modal.querySelector('.resume-modal-close');
    const backdrop = modal.querySelector('.resume-modal-backdrop');

    function openModal() {
      const src = getResumeSrc();
      frame.src    = src;
      openLink.href = src;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      frame.src = '';
    }

    resumeTrigger.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  // ── Lightbox ─────────────────────────────────────────────
  const lightboxImgs = document.querySelectorAll('[data-lightbox]');
  if (lightboxImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `<button class="lightbox-close" aria-label="Close">✕</button><img src="" alt="" />`;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('img');

    const openLb  = (img) => {
      lbImg.src = img.src; lbImg.alt = img.alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLb = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    lightboxImgs.forEach(img => img.addEventListener('click', () => openLb(img)));
    overlay.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
    overlay.querySelector('.lightbox-close').addEventListener('click', closeLb);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeLb();
    });
  }

  // ── Smooth hover cursor shift (optional enhancement) ─────
  // Adds a subtle magnetic pull to .btn-dark elements
  document.querySelectorAll('.btn-dark, .nav-cta').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect  = el.getBoundingClientRect();
      const x     = e.clientX - rect.left - rect.width  / 2;
      const y     = e.clientY - rect.top  - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

});
