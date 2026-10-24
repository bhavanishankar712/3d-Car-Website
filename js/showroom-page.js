/**
 * ============================================================================
 * LAMBORGHINI SHOWROOM // FULL-LENGTH PAGE & SHOWROOM CONTROLLER
 * Manages sticky navbar scroll states, active section spying across 3D Hero,
 * Exploded View, Fleet Showroom, and Flagship Dealerships.
 * Controls fleet category filters, 3D model switches, and VIP inquiries.
 * ============================================================================
 */

(function () {
  'use strict';

  class ShowroomPageController {
    constructor() {
      this.initNavbar();
      this.initCanvasScrollDamping();
      this.initFleetShowroom();
      this.initBookingForm();
    }

    // 1. Top Navbar Scroll & Active Section Spy
    initNavbar() {
      const nav = document.getElementById('main-showroom-nav');
      const navLinks = document.querySelectorAll('.nav-link-item');

      window.addEventListener('scroll', () => {
        if (!nav) return;
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        // Active Section Spy across all 4 Showroom Sections
        const sections = ['section-hero', 'section-exploded', 'section-fleet', 'section-booking'];
        const scrollPos = window.scrollY + 160;

        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = document.getElementById(sections[i]);
          if (sec && sec.offsetTop <= scrollPos) {
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${sections[i]}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
            break;
          }
        }
      }, { passive: true });

      // Smooth Anchor Click Navigation
      navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const targetEl = document.querySelector(href);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });

              const sectionId = href.replace('#', '');
              if (window.app && typeof window.app.setSection === 'function') {
                window.app.setSection(sectionId);
              }
            }
          }
        });
      });

      // Top Action Button
      const actionBtn = document.getElementById('nav-btn-explore');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          const href = actionBtn.getAttribute('href');
          if (href && href.startsWith('#')) {
            const targetEl = document.querySelector(href);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      }
    }

    // 2. Canvas Scroll Damping (Permits full interaction with landing page cards)
    initCanvasScrollDamping() {
      const canvasContainer = document.getElementById('webgl-canvas-container');
      const track = document.getElementById('three-experience-track');

      window.addEventListener('scroll', () => {
        const trackHeight = track ? track.offsetHeight : 1800;
        const currentY = window.scrollY;

        if (canvasContainer) {
          if (currentY > trackHeight * 0.95) {
            // Past 3D track: allow effortless click & selection on fleet cards and form inputs
            canvasContainer.style.pointerEvents = 'none';
            canvasContainer.style.opacity = '0.24';
            canvasContainer.style.transition = 'opacity 0.6s ease';
          } else {
            // Within 3D hero & exploded sections: restore 100% canvas visibility & 360 orbit controls
            canvasContainer.style.pointerEvents = 'auto';
            canvasContainer.style.opacity = '1';
          }
        }
      }, { passive: true });
    }

    // 3. Supercar Fleet Showroom Interactions & Category Filters
    initFleetShowroom() {
      const filterBtns = document.querySelectorAll('.fleet-filter-btn');
      const cards = document.querySelectorAll('.fleet-vehicle-card');

      // Category Filter Buttons
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.dataset.filter;
          cards.forEach((card) => {
            const cat = card.dataset.category;
            if (filter === 'all' || cat === filter) {
              card.style.display = 'flex';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // "LOAD IN 3D" / "INSPECT IN 3D" Buttons
      const exploreBtns = document.querySelectorAll('.btn-fleet-explore');
      exploreBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const modelKey = btn.dataset.model || 'svj';
          if (window.app && typeof window.app.switchFleetSupercar === 'function') {
            window.app.switchFleetSupercar(modelKey);
          }

          // Smoothly scroll up to the 3D Hero Showroom
          const heroSec = document.getElementById('section-hero');
          if (heroSec) {
            heroSec.scrollIntoView({ behavior: 'smooth' });
          }

          // Show Toast Notification
          const card = btn.closest('.fleet-vehicle-card');
          const carName = card ? card.querySelector('.fleet-car-name').textContent : 'Supercar';
          this.showToast(`✨ Loaded ${carName} into 3D Showroom`);
        });
      });

      // "BOOK TEST DRIVE" Buttons on Fleet Cards
      const bookBtns = document.querySelectorAll('.btn-fleet-book');
      bookBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const modelName = btn.dataset.bookModel;
          const selectEl = document.getElementById('book-model');
          if (selectEl && modelName) {
            for (let i = 0; i < selectEl.options.length; i++) {
              if (selectEl.options[i].value.includes(modelName) || selectEl.options[i].text.includes(modelName)) {
                selectEl.selectedIndex = i;
                break;
              }
            }
          }
        });
      });
    }

    // 4. Flagship Showrooms & VIP Concierge Inquiry Form
    initBookingForm() {
      // Flagship Dealership Quick-Select Items
      const dealerItems = document.querySelectorAll('.dealer-item');
      const dealerSelect = document.getElementById('book-dealer');

      dealerItems.forEach((item) => {
        item.addEventListener('click', () => {
          dealerItems.forEach((d) => d.classList.remove('active'));
          item.classList.add('active');

          const dealerName = item.dataset.dealer;
          if (dealerSelect && dealerName) {
            for (let i = 0; i < dealerSelect.options.length; i++) {
              if (dealerSelect.options[i].value.includes(dealerName) || dealerSelect.options[i].text.includes(dealerName)) {
                dealerSelect.selectedIndex = i;
                break;
              }
            }
          }
        });
      });

      // VIP Form Submission & Confirmation Modal
      const form = document.getElementById('vip-booking-form');
      const modal = document.getElementById('vip-modal-backdrop');
      const closeModalBtn = document.getElementById('btn-close-vip-modal');

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          const model = document.getElementById('book-model').value;
          const dealer = document.getElementById('book-dealer').value;
          const name = document.getElementById('book-name').value;

          // Populate Confirmation Modal
          const modalName = document.getElementById('modal-client-name');
          const modalModel = document.getElementById('modal-vehicle-model');
          const modalDealer = document.getElementById('modal-dealer-salon');
          const modalDossier = document.getElementById('modal-dossier-code');

          if (modalName) modalName.textContent = name || 'Valued Client';
          if (modalModel) modalModel.textContent = model;
          if (modalDealer) modalDealer.textContent = dealer;
          if (modalDossier) modalDossier.textContent = `LB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          // Open Modal
          if (modal) modal.classList.add('open');

          // Trigger Lighting & V12 Celebration on 3D Car
          if (window.app && typeof window.app.triggerVIPCelebration === 'function') {
            window.app.triggerVIPCelebration(model, name);
          }

          form.reset();
        });
      }

      if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
          modal.classList.remove('open');
        });

        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('open');
          }
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
          }
        });
      }
    }

    // Helper: Show Feedback Toast Notification
    showToast(message) {
      const toast = document.getElementById('toast-notification');
      if (toast) {
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2800);
      }
    }
  }

  // Auto-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ShowroomPageController());
  } else {
    new ShowroomPageController();
  }
})();
