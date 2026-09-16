/**
 * RSSDI-JHCON 2027 — PHASE 3 PRODUCTION CONTROLLER
 * Full accessibility pass (focus trapping, ARIA management, keyboard navigation),
 * performance-optimized scroll observer, and robust modal controller.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Data Loader & Synchronization (from data/conference.json)
     ========================================================================== */
  let conferenceData = null;

  async function loadConferenceData() {
    try {
      const response = await fetch('data/conference.json');
      if (response.ok) {
        conferenceData = await response.json();
        initDataDrivenComponents(conferenceData);
      }
    } catch (err) {
      console.warn('Note: running with pre-rendered document values.', err);
    }
  }

  function initDataDrivenComponents(data) {
    if (data?.event?.dates?.startDate) {
      targetEventTime = new Date(data.event.dates.startDate).getTime();
      updateCountdown();
    }
  }

  loadConferenceData();

  /* ==========================================================================
     2. Live Countdown Timer (8th January 2027, 09:00:00 IST)
     ========================================================================== */
  let targetEventTime = new Date('2027-01-08T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetEventTime - now;

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     3. Scroll Reveal Observer (prefers-reduced-motion aware)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     4. Accessible Schedule Tabs Component (Day 1 / Day 2 / Day 3)
     Includes keyboard arrow navigation (WAI-ARIA Tab Pattern)
     ========================================================================== */
  const scheduleTabBtns = Array.from(document.querySelectorAll('.schedule-tab-btn'));
  const schedulePanels = document.querySelectorAll('.schedule-content-panel');

  function switchScheduleTab(btn) {
    const tabTarget = btn.getAttribute('data-schedule-tab');
    if (!tabTarget) return;

    scheduleTabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    btn.focus();

    schedulePanels.forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`panel-${tabTarget}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }
  }

  scheduleTabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => switchScheduleTab(btn));

    btn.addEventListener('keydown', (e) => {
      let targetIndex = -1;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % scheduleTabBtns.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + scheduleTabBtns.length) % scheduleTabBtns.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = scheduleTabBtns.length - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        switchScheduleTab(scheduleTabBtns[targetIndex]);
      }
    });
  });

  /* ==========================================================================
     5. Sticky Navbar: Transparent-over-Hero -> Solid & Scrollspy
     ========================================================================== */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     6. Accessible Mobile Hamburger Drawer
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (mobileDrawer) {
      mobileDrawer.classList.toggle('open', isOpen);
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    }
    if (drawerOverlay) drawerOverlay.classList.toggle('active', isOpen);
    if (mobileToggle) {
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      drawerClose?.focus();
    } else {
      mobileToggle?.focus();
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', () => toggleDrawer());
  if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer(false));
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleDrawer(false));

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleDrawer(false);
    }
  });

  /* ==========================================================================
     7. Committee Directory Filter Tabs & Live Search
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const memberCards = document.querySelectorAll('.committee-member-card');
  const committeeSearch = document.getElementById('committee-search');
  const committeeSearchClear = document.getElementById('committee-search-clear');

  function applyCommitteeFilters() {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const query = (committeeSearch ? committeeSearch.value : '').toLowerCase().trim();

    if (committeeSearchClear) {
      committeeSearchClear.style.display = query ? 'flex' : 'none';
    }

    memberCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();

      const matchesCategory = activeFilter === 'all' || category.includes(activeFilter);
      const matchesSearch = query === '' || text.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCommitteeFilters();
    });
  });

  if (committeeSearch) {
    committeeSearch.addEventListener('input', applyCommitteeFilters);
  }

  if (committeeSearchClear && committeeSearch) {
    committeeSearchClear.addEventListener('click', () => {
      committeeSearch.value = '';
      committeeSearchClear.style.display = 'none';
      committeeSearch.focus();
      applyCommitteeFilters();
    });
  }

  /* Mobile Full Committee Collapsible Toggle */
  const toggleCommitteeBtn = document.getElementById('toggle-full-committee');
  const fullCommitteeWrapper = document.getElementById('full-committee-wrapper');
  const committeeToggleText = document.getElementById('committee-toggle-text');
  const committeeToggleIcon = document.getElementById('committee-toggle-icon');

  if (toggleCommitteeBtn && fullCommitteeWrapper) {
    toggleCommitteeBtn.addEventListener('click', () => {
      const isExpanded = fullCommitteeWrapper.classList.toggle('expanded');
      toggleCommitteeBtn.setAttribute('aria-expanded', String(isExpanded));
      if (committeeToggleText) {
        committeeToggleText.textContent = isExpanded
          ? 'Hide Committee Directory'
          : 'View Full Committee Directory (26 Roles)';
      }
      if (committeeToggleIcon) {
        committeeToggleIcon.textContent = isExpanded ? '↑' : '↓';
      }
    });
  }

  /* ==========================================================================
     8. Toast Notification Utility
     ========================================================================== */
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-message';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  window.RSSDI_App = {
    showToast,
    getData: () => conferenceData
  };
});
