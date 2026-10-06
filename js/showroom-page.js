/**
 * ============================================================================
 * LAMBORGHINI SHOWROOM // FULL-LENGTH LANDING PAGE CONTROLLER
 * Orchestrates engineering anatomy filters, fleet showcase, ALA 2.0 aerodynamics,
 * V12 tachometer rev simulator with Web Audio, cockpit hotspots, and VIP concierge.
 * ============================================================================
 */

(function () {
  'use strict';

  // 33 Engineering Components Dataset (from images/)
  const ANATOMY_DATA = [
    { id: 1, file: '01_car_body.png', category: 'chassis', name: 'Carbon Monocoque Outer Shell', subsystem: 'CHASSIS // STR-01', desc: 'Full single-piece carbon fiber monocoque engineered with aeronautical-grade RTM technology.', spec: '147.5 kg // 35,000 Nm/deg' },
    { id: 2, file: '02_front_section.png', category: 'aero', name: 'Active Aero Front Fascia', subsystem: 'AERO // ALA-02', desc: 'Front aerodynamic nose section with integrated ALA 2.0 active micro-flaps modulating airflow in < 500ms.', spec: '+29% Downforce vs S' },
    { id: 3, file: '03_hood.png', category: 'aero', name: 'Carbon Fiber Luggage Lid', subsystem: 'BODY // EXT-03', desc: 'Sculpted dual longitudinal air extraction channels directing airflow across the windscreen.', spec: '6.8 kg Ultra-Thin Carbon' },
    { id: 4, file: '04_roof_windshield.png', category: 'cockpit', name: 'Greenhouse & Roof Frame', subsystem: 'SAFETY // STR-04', desc: 'High-strength structural roof frame with integrated roll-over cage and acoustic laminated glazing.', spec: '5.5x Vehicle Weight Roof Crush' },
    { id: 5, file: '05_left_door.png', category: 'cockpit', name: 'Left Dihedral Scissor Door', subsystem: 'COCKPIT // BD-05', desc: 'Iconic vertical opening scissor door constructed with full carbon outer skin and nitrogen gas struts.', spec: '74° Opening Angle // 8.4 kg' },
    { id: 6, file: '06_right_door.png', category: 'cockpit', name: 'Right Dihedral Scissor Door', subsystem: 'COCKPIT // BD-06', desc: 'Passenger scissor door with ultra-light inner honeycomb side intrusion beam.', spec: 'Honeycomb Structural Core' },
    { id: 7, file: '07_left_headlight.png', category: 'chassis', name: 'Left Bi-LED Headlamp', subsystem: 'LIGHTING // LT-07', desc: 'Adaptive Bi-LED headlamp showcasing signature Y-pattern Daytime Running Light (DRL).', spec: '4,200 Lumens // 6,000K' },
    { id: 8, file: '08_right_headlight.png', category: 'chassis', name: 'Right Bi-LED Headlamp', subsystem: 'LIGHTING // LT-08', desc: 'Right adaptive matrix LED illumination unit with dynamic high-beam cornering adjustment.', spec: 'Matrix Cornering Projector' },
    { id: 9, file: '09_rear_bumper.png', category: 'aero', name: 'Rear Aero Bumper Assembly', subsystem: 'AERO // EXT-09', desc: 'High-mounted central exhaust cutouts and open honeycomb mesh for rapid thermal extraction.', spec: '+32% Heat Evacuation' },
    { id: 10, file: '10_front_left_fender.png', category: 'aero', name: 'Front Left Sculpted Fender', subsystem: 'AERO // BD-10', desc: 'Quarter panel with integrated wheel-well pressure relief gills to eliminate aerodynamic lift.', spec: '-18 kg Lift at 250 km/h' },
    { id: 11, file: '11_front_right_fender.png', category: 'aero', name: 'Front Right Sculpted Fender', subsystem: 'AERO // BD-11', desc: 'Sculpted fender harmonizing airflow between front air dams and side cooling radiators.', spec: 'Direct Subframe Mount' },
    { id: 12, file: '12_spoiler.png', category: 'aero', name: 'ALA 2.0 Active Rear Wing', subsystem: 'AERO // ALA-12', desc: 'Aerodinamica Lamborghini Attiva 2.0 wing with twin hollow pylons and electro-actuated micro-valves.', spec: '490 kg Downforce @ 300 km/h' },
    { id: 13, file: '13_side_skirt.png', category: 'aero', name: 'Ground-Effect Side Skirt', subsystem: 'AERO // EXT-13', desc: 'Carbon fiber longitudinal skirt with vertical vortex fins sealing the underfloor.', spec: '2,150 mm Autoclaved Carbon' },
    { id: 14, file: '14_rear_diffuser.png', category: 'aero', name: 'High-Downforce Rear Diffuser', subsystem: 'AERO // EXT-14', desc: 'Aggressive multi-tunnel carbon rear diffuser utilizing Bernoulli effect to glue rear axle.', spec: '14.5° Venturi Angle' },
    { id: 15, file: '15_wheel_01.png', category: 'chassis', name: 'Front Left Leirion Wheel', subsystem: 'CHASSIS // WH-15', desc: 'Central-locking forged aluminum wheel designed with directional aerodynamic cooling spokes.', spec: '9J x 20\" // 8.9 kg' },
    { id: 16, file: '16_wheel_02.png', category: 'chassis', name: 'Front Right Leirion Wheel', subsystem: 'CHASSIS // WH-16', desc: 'Precision-milled from aerospace 6061-T6 aluminum billet for extreme lateral camber stiffness.', spec: '6061-T6 Forged Billet' },
    { id: 17, file: '17_wheel_03.png', category: 'chassis', name: 'Rear Left Super-Wide Wheel', subsystem: 'CHASSIS // WH-17', desc: 'Deep concave 21-inch rear wheel delivering immense mechanical grip for 770 CV.', spec: '13J x 21\" // 355/25 ZR21' },
    { id: 18, file: '18_wheel_04.png', category: 'chassis', name: 'Rear Right Super-Wide Wheel', subsystem: 'CHASSIS // WH-18', desc: 'Engineered to sustain lateral forces exceeding 1.5G on high-speed track sweeps.', spec: '12,000 N Max Load' },
    { id: 19, file: '19_brake_disc_caliper.png', category: 'chassis', name: 'Carbon Ceramic Brakes', subsystem: 'BRAKES // BR-19', desc: 'Massive 400mm carbon ceramic ventilated rotor with 6-piston aluminum monobloc caliper.', spec: '100-0 km/h in 30.0m' },
    { id: 20, file: '20_suspension_01.png', category: 'chassis', name: 'Front Pushrod Suspension', subsystem: 'SUSPENSION // SP-20', desc: 'Formula 1 inspired horizontal pushrod magnetorheological shock absorber system.', spec: '1,000 Hz Dynamic Damping' },
    { id: 21, file: '21_suspension_02.png', category: 'chassis', name: 'Rear Pushrod & LDS Damper', subsystem: 'SUSPENSION // SP-21', desc: 'Integrated with Lamborghini Dynamic Steering (LDS) and Rear-Wheel Steering (LRS).', spec: '+/- 3.0° Active Rear Steer' },
    { id: 22, file: '22_engine.png', category: 'powertrain', name: '6.5L Naturally Aspirated V12', subsystem: 'POWERTRAIN // ENG-22', desc: 'Pinnacle of internal combustion: 6,498 cc 60° V12 delivering 770 CV at an exhilarating 8,500 RPM.', spec: '770 CV // 720 Nm Torque' },
    { id: 23, file: '23_gearbox.png', category: 'powertrain', name: '7-Speed ISR Transmission', subsystem: 'DRIVETRAIN // GB-23', desc: 'Independent Shifting Rods automated manual transmission executing gear changes in 50ms.', spec: '50 ms Shift Duration' },
    { id: 24, file: '24_exhaust.png', category: 'powertrain', name: 'Tuned Inconel Central Exhaust', subsystem: 'EXHAUST // EX-24', desc: 'Lightweight Inconel sports exhaust with short runner geometry and high-exit twin ports.', spec: '-7.5 kg // -42% Backpressure' },
    { id: 25, file: '25_chassis.png', category: 'chassis', name: 'One-Piece Carbon Monocoque', subsystem: 'STRUCTURE // CH-25', desc: 'Passenger safety cell combining carbon monocoque with front and rear aluminum subframes.', spec: '198 kg Total Cell Weight' },
    { id: 26, file: '26_interior_seat.png', category: 'cockpit', name: 'Carbon Racing Bucket Seats', subsystem: 'INTERIOR // IN-26', desc: 'Contoured racing bucket seat featuring visible matte carbon shell and Nero Ade Alcantara.', spec: '11.2 kg // 4-Point Ready' },
    { id: 27, file: '27_windshield.png', category: 'cockpit', name: 'Acoustic Double Windscreen', subsystem: 'GLAZING // GL-27', desc: 'Acoustically laminated ultra-thin windscreen with UV and infrared heat rejection film.', spec: '99% UV / 64% Heat Rejection' },
    { id: 28, file: '28_left_side_mirror.png', category: 'aero', name: 'Aerodynamic Left Mirror', subsystem: 'AERO // MR-28', desc: 'Twin-stalk carbon fiber side mirror channeling clean air streams directly to rear intakes.', spec: 'Minimal 0.038 m² Drag Area' },
    { id: 29, file: '29_right_side_mirror.png', category: 'aero', name: 'Aerodynamic Right Mirror', subsystem: 'AERO // MR-29', desc: 'Right carbon aerofoil mirror stalk feeding air to lateral engine cooling radiators.', spec: 'Vortex Fin Airflow Guide' },
    { id: 30, file: '30_front_grille.png', category: 'aero', name: 'Hexagonal Cooling Grille', subsystem: 'COOLING // GR-30', desc: 'Hexagonal open-matrix front grille delivering maximum cooling airflow to heat exchangers.', spec: '82% Open Surface Ratio' },
    { id: 31, file: '31_underbody_panel.png', category: 'aero', name: 'Flat Carbon Underfloor Panel', subsystem: 'AERO // UF-31', desc: 'Flat underbody tray creating uninterrupted laminar flow from front splitter to rear diffuser.', spec: 'Ground Effect Venturi Seal' },
    { id: 32, file: '32_radiator.png', category: 'powertrain', name: 'Side Aluminum Heat Exchanger', subsystem: 'COOLING // RD-32', desc: 'Dual high-efficiency side-mounted aluminum radiators dissipating enormous thermal loads.', spec: '140 kW Thermal Rejection' },
    { id: 33, file: '33_rear_diffuser.png', category: 'aero', name: 'Secondary Diffuser Strake Tray', subsystem: 'AERO // EXT-33', desc: 'Lower aerodynamic exhaust shroud and thermal diffuser directing high-velocity exhaust gases.', spec: 'Blown Diffuser Integration' }
  ];

  class ShowroomPageController {
    constructor() {
      this.initNavbar();
      this.initAnatomyGrid();
      this.initALAInteractive();
      this.initTachometer();
      this.initBookingForm();
      this.initCanvasScrollDamping();
    }

    // Navbar Scroll & Links with Active Spy
    initNavbar() {
      const nav = document.getElementById('main-showroom-nav');
      const navLinks = document.querySelectorAll('.nav-link-item');

      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        // Active Section Spy
        const sections = [
          'section-hero',
          'section-exploded',
          'section-anatomy',
          'section-fleet',
          'section-aero',
          'section-powertrain',
          'section-cockpit',
          'section-booking'
        ];

        const scrollPos = window.scrollY + 120;
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
            }
          }
        });
      });
    }

    // 3D Canvas Damping on Lower Landing Page Scroll
    initCanvasScrollDamping() {
      const canvasContainer = document.getElementById('webgl-canvas-container');
      const track = document.getElementById('three-experience-track');

      window.addEventListener('scroll', () => {
        const trackHeight = track ? track.offsetHeight : 2400;
        const currentY = window.scrollY;

        if (canvasContainer) {
          if (currentY > trackHeight * 0.9) {
            // Past 3D experience: fade canvas and disable mouse capture so users interact with landing page
            canvasContainer.style.pointerEvents = 'none';
            canvasContainer.style.opacity = '0.18';
            canvasContainer.style.transition = 'opacity 0.6s ease';
          } else {
            // Within 3D hero & exploded section: restore full interactivity
            canvasContainer.style.pointerEvents = 'auto';
            canvasContainer.style.opacity = '1';
          }
        }
      }, { passive: true });
    }

    // 1. Engineering Anatomy Grid
    initAnatomyGrid() {
      const grid = document.getElementById('anatomy-grid');
      const filterBtns = document.querySelectorAll('.anatomy-filter-btn');
      if (!grid) return;

      const renderItems = (cat) => {
        grid.innerHTML = '';
        const items = cat === 'all' ? ANATOMY_DATA : ANATOMY_DATA.filter(d => d.category === cat);

        items.forEach(comp => {
          const card = document.createElement('div');
          card.className = 'anatomy-card';
          card.innerHTML = `
            <div class="anatomy-card-preview">
              <img src="./images/${comp.file}" alt="${comp.name}" loading="lazy">
            </div>
            <div class="anatomy-subsystem-pill">${comp.subsystem}</div>
            <h4 class="anatomy-card-title">${comp.name}</h4>
            <p class="anatomy-card-desc">${comp.desc}</p>
            <div class="anatomy-specs-row">
              <span>BENCHMARK</span>
              <span>${comp.spec}</span>
            </div>
          `;

          // Clicking card scrolls to 3D view or opens preview
          card.addEventListener('click', () => {
            const toast = document.getElementById('toast-notification');
            if (toast) {
              toast.textContent = `Inspecting: ${comp.name}`;
              toast.classList.add('visible');
              setTimeout(() => toast.classList.remove('visible'), 2400);
            }
          });

          grid.appendChild(card);
        });
      };

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderItems(btn.dataset.category);
        });
      });

      renderItems('all');
    }

    // 2. ALA 2.0 Aerodynamics Interactive Modes
    initALAInteractive() {
      const modeCards = document.querySelectorAll('.aero-mode-card');
      const downforceBar = document.getElementById('ala-downforce-bar');
      const downforceVal = document.getElementById('ala-downforce-val');
      const dragBar = document.getElementById('ala-drag-bar');
      const dragVal = document.getElementById('ala-drag-val');
      const flapStatus = document.getElementById('ala-flap-status');

      const modeStats = {
        'high-downforce': { downforce: '490 KG', downforcePct: '98%', drag: 'HIGH', dragPct: '85%', flaps: 'CLOSED (MAX FORCE)' },
        'low-drag': { downforce: '180 KG', downforcePct: '36%', drag: 'MINIMAL', dragPct: '20%', flaps: 'OPEN (STALLING WING)' },
        'aero-vectoring': { downforce: '340 KG', downforcePct: '72%', drag: 'DYNAMIC', dragPct: '55%', flaps: 'SPLIT LEFT / RIGHT' }
      };

      modeCards.forEach(card => {
        card.addEventListener('click', () => {
          modeCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const mode = card.dataset.mode;
          const stats = modeStats[mode];

          if (downforceBar) downforceBar.style.width = stats.downforcePct;
          if (downforceVal) downforceVal.textContent = stats.downforce;
          if (dragBar) dragBar.style.width = stats.dragPct;
          if (dragVal) dragVal.textContent = stats.drag;
          if (flapStatus) flapStatus.textContent = stats.flaps;
        });
      });
    }

    // 3. V12 Interactive Tachometer Gauge & Rev Audio
    initTachometer() {
      const revBtn = document.getElementById('btn-tach-rev');
      const rpmNum = document.getElementById('tach-rpm-display');
      const needle = document.getElementById('tach-needle');
      const gearBadge = document.getElementById('tach-gear');

      let revving = false;
      let currentRPM = 1000;
      let targetRPM = 1000;
      let audioCtx = null;

      const playV12Audio = (rpm) => {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';

          const pitch = 70 + (rpm / 8500) * 450;
          osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.12);
        } catch (e) {}
      };

      const startRev = () => {
        revving = true;
        targetRPM = 8500;
        if (gearBadge) gearBadge.textContent = '1ST GEAR // WOT';
      };

      const stopRev = () => {
        revving = false;
        targetRPM = 1000;
        if (gearBadge) gearBadge.textContent = 'NEUTRAL // IDLE';
      };

      if (revBtn) {
        revBtn.addEventListener('mousedown', startRev);
        window.addEventListener('mouseup', stopRev);
        revBtn.addEventListener('touchstart', startRev, { passive: true });
        window.addEventListener('touchend', stopRev);
      }

      // Keyboard Shortcut 'S' to rev
      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's' && !e.repeat && document.activeElement.tagName !== 'INPUT') {
          startRev();
        }
      });
      window.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() === 's' && document.activeElement.tagName !== 'INPUT') {
          stopRev();
        }
      });

      // 60fps needle animation
      const animateTach = () => {
        const delta = (targetRPM - currentRPM) * (revving ? 0.08 : 0.04);
        currentRPM += delta;

        if (rpmNum) rpmNum.textContent = Math.round(currentRPM).toLocaleString();

        // 0 to 8500 RPM mapped from -120deg to +120deg
        const deg = -120 + ((currentRPM / 8500) * 240);
        if (needle) needle.setAttribute('transform', `rotate(${deg} 140 140)`);

        if (revving && Math.random() > 0.4) {
          playV12Audio(currentRPM);
        }

        requestAnimationFrame(animateTach);
      };

      requestAnimationFrame(animateTach);
    }

    // 4. VIP Concierge Booking Form
    initBookingForm() {
      const form = document.getElementById('vip-booking-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const model = document.getElementById('book-model').value;
        const dealer = document.getElementById('book-dealer').value;
        const name = document.getElementById('book-name').value;

        alert(`✨ VIP CONCIERGE CONFIRMATION ✨\n\nSignore ${name},\nYour private consultation for the ${model} at Lamborghini ${dealer} has been reserved.\n\nOur Centro Stile Concierge will contact you within 2 business hours.`);
        form.reset();
      });
    }
  }

  // Auto-boot on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ShowroomPageController());
  } else {
    new ShowroomPageController();
  }
})();
