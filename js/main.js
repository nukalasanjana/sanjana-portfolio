/* ============================================================
   MAIN.JS — Shared scripts across all pages
   ============================================================ */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === 'true') return;

    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html';
    const isWork = path === '/work/' || path.startsWith('/work/') || path === '/work';
    const isPlayground = path === '/playground/' || path.startsWith('/playground/') || path === '/playground';

    const iconOpen = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    const iconClose = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

    this.innerHTML = `
      <header class="site-header">
        <nav class="nav">
          <a href="/" class="nav-logo" aria-label="Home">
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M19 5H6C2 5 2 20 11 20C21 20 23 37 13 40H4"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M25 4V40 M25 4L40 40 M40 4V40"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sanjana Nukala
          </a>
          <div class="nav-links">
            <a href="/"${isHome ? ' class="active"' : ''}>Home</a>
            <a href="/work/"${isWork ? ' class="active"' : ''}>Work</a>
            <a href="/playground/"${isPlayground ? ' class="active"' : ''}>Playground</a>
          </div>
          <button class="nav-cta" data-resume-trigger>Resume</button>
          <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">${iconOpen}</button>
        </nav>

        <div class="nav-mobile-menu" aria-hidden="true">
          <a href="/"${isHome ? ' class="active"' : ''}>Home</a>
          <a href="/work/"${isWork ? ' class="active"' : ''}>Work</a>
          <a href="/playground/"${isPlayground ? ' class="active"' : ''}>Playground</a>
          <button data-resume-trigger-mobile>Resume</button>
        </div>
      </header>
    `;

    this.menuOpen = false;
    this.header = this.querySelector('.nav');
    this.mobileMenu = this.querySelector('.nav-mobile-menu');
    this.hamburger = this.querySelector('.nav-hamburger');

    this.updateHeaderHeight = () => {
      const height = Math.ceil(this.header.getBoundingClientRect().height);
      this.style.setProperty('--site-header-height', `${height}px`);
    };

    this.toggleMenu = (open) => {
      this.menuOpen = open;
      this.mobileMenu.classList.toggle('open', this.menuOpen);
      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
      this.hamburger.setAttribute('aria-label', this.menuOpen ? 'Close menu' : 'Open menu');
      this.hamburger.setAttribute('aria-expanded', String(this.menuOpen));
      this.hamburger.innerHTML = this.menuOpen ? iconClose : iconOpen;
      this.mobileMenu.setAttribute('aria-hidden', String(!this.menuOpen));
    };

    this.onDocumentClick = (event) => {
      if (this.menuOpen && !this.contains(event.target)) {
        this.toggleMenu(false);
      }
    };

    this.onKeydown = (event) => {
      if (event.key === 'Escape' && this.menuOpen) {
        this.toggleMenu(false);
      }
    };

    this.hamburger.addEventListener('click', () => this.toggleMenu(!this.menuOpen));
    this.mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.toggleMenu(false));
    });
    const mobileResumeTrigger = this.querySelector('[data-resume-trigger-mobile]');
    if (mobileResumeTrigger) {
      mobileResumeTrigger.addEventListener('click', () => this.toggleMenu(false));
    }

    this.updateHeaderHeight();
    window.addEventListener('resize', this.updateHeaderHeight, { passive: true });
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeydown);
    this.dataset.rendered = 'true';
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateHeaderHeight);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeydown);
  }
}

if (!customElements.get('site-header')) {
  customElements.define('site-header', SiteHeader);
}

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
          const show = filter === 'all' || (card.dataset.category || '').split(' ').includes(filter);
          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => { card.style.opacity = '1'; });
          } else {
            card.style.opacity = '0';
            card.addEventListener('transitionend', function hide() {
              if (card.style.opacity === '0') card.style.display = 'none';
              card.removeEventListener('transitionend', hide);
            });
          }
          card.style.transition = 'opacity 0.2s ease';
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
  const resumeTriggers = document.querySelectorAll('[data-resume-trigger]');
  if (resumeTriggers.length) {
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

    function getResumeSrc() {
      const depth = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean).length;
      return encodeURI('../'.repeat(depth) + 'resources/Resumes/Sanjana_Nukala_Product_Resume _7:29:26.pdf');
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

    resumeTriggers.forEach(t => t.addEventListener('click', openModal));

    // Also bind mobile resume button injected by hamburger menu
    const mobileResumeTrigger = document.querySelector('[data-resume-trigger-mobile]');
    if (mobileResumeTrigger) mobileResumeTrigger.addEventListener('click', openModal);

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
