/**
 * ============================================================================
 * AVENTADOR SVJ // APPLICATION BOOTSTRAP & MULTI-SECTION ORCHESTRATOR
 * Coordinates WebGL rendering, PMREM studio lighting, 87-component mechanical
 * explosion, and real-time 3D car animations across EVERY section of the site.
 * ============================================================================
 */

class Application {
  constructor() {
    this.canvasContainer = document.getElementById("webgl-canvas-container");
    this.canvas = document.getElementById("webgl-canvas");

    this.scene = null;
    this.renderer = null;
    this.pmremGenerator = null;
    this.cameraCtrl = null;
    this.lightsCtrl = null;
    this.carCtrl = null;
    this.explosionCtrl = null;
    this.configCtrl = null;
    this.interactionCtrl = null;

    this.clock = new THREE.Clock();

    this.scrollProgress = 0;
    this.targetExplosionProgress = 0;
    this.currentExplosionProgress = 0;
    this.isAutoplay = false;
    this.autoplayDirection = 1;
    this.isUserDraggingSlider = false;

    // Camera preset reference points - dialed in for large, muscular supercar hero presence
    this.heroCamPos = new THREE.Vector3(-4.8, 1.42, 3.3);
    this.heroTarget = new THREE.Vector3(0, 0.65, 0);
    this.explodedCamPos = new THREE.Vector3(-4.5, 1.95, 3.4); // Close-up 360° zoom inspection
    this.explodedTarget = new THREE.Vector3(0, 0.95, 0);

    this.targetCamPos = this.heroCamPos.clone();
    this.targetCamTarget = this.heroTarget.clone();

    // Mouse parallax tracking for dynamic 3D depth in hero section
    this.mouseNormX = 0;
    this.mouseNormY = 0;

    // 360° Zoom Orbit Parameters for Exploded Car
    this.isExplodedZoom360Active = true;
    this.orbit360Angle = -1.2;
    this.orbit360Speed = 0.35; // rad/s (~18s per full 360° rotation)
    this.explodedZoomRadius = 5.4; // Close-up zoom inspection distance
    this.explodedWideRadius = 10.5; // Wide assembled distance

    // Multi-section 3D car animation parameters
    this.currentSection = "section-hero";
    this.targetDoorProgress = 0;
    this.currentDoorProgress = 0;
    this.targetWingAngle = -0.06;
    this.currentWingAngle = -0.06;
    this.targetSquat = 0;
    this.currentSquat = 0;
    this.engineRevIntensity = 0;
    this.aeroStreamlinesActive = false;
    this.aeroFlowSpeedMultiplier = 1.0;
    this.autoplayHoldTimer = 0;
    this.explosionTween = null;

    // 1. Continuous Car Auto-Rotation & 360 Spin
    this.isCarAutoRotating = true;
    this.carAutoRotateSpeed = 0.42; // rad/sec (~15s per full turntable rotation)
    this.carRotationY = 0;
    this.isCarDragging = false;
    this.dragStartX = 0;
    this.dragStartRotY = 0;
    this.dragVelocityY = 0;

    // 2. Scroll-Driven Falling Physics
    this.currentFallY = 0;
    this.targetFallY = 0;
    this.currentFallPitch = 0;
    this.targetFallPitch = 0;
    this.fallVelocity = 0;
    this.lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    this.normalizedScrollProgress = 0;
    this.section2Factor = 0;
    this.hasAnimatedOverviewCounters = false;

    // 3. Automatic Car Color Transition & Curated Lamborghini Palette
    this.isAutoColorActive = false;
    this.autoColorPausedUntil = 0;
    this.currentColorIndex = 0;
    this.currentColorName = "Grigio Titans";
    this.lamboPalette = [
      { name: "Grigio Titans", hex: 0xd6dce5, r: 0.839, g: 0.863, b: 0.898, caliper: 0xc40018, roughness: 0.20, metalness: 0.82 },
      { name: "Giallo Auge", hex: 0xffcc00, r: 1.000, g: 0.800, b: 0.000, caliper: 0x151618, roughness: 0.18, metalness: 0.85 },
      { name: "Arancio Argos", hex: 0xff4e00, r: 1.000, g: 0.306, b: 0.000, caliper: 0x151618, roughness: 0.18, metalness: 0.86 },
      { name: "Verde Mantis", hex: 0x2ee31a, r: 0.180, g: 0.890, b: 0.102, caliper: 0x0a0b0e, roughness: 0.16, metalness: 0.84 },
      { name: "Blu Cepheus", hex: 0x00a2ff, r: 0.000, g: 0.635, b: 1.000, caliper: 0xff4e00, roughness: 0.15, metalness: 0.88 },
      { name: "Rosso Mars", hex: 0xde0924, r: 0.871, g: 0.035, b: 0.141, caliper: 0xffcc00, roughness: 0.18, metalness: 0.85 },
      { name: "Viola Pasifae", hex: 0x8321a6, r: 0.514, g: 0.129, b: 0.651, caliper: 0xd4af37, roughness: 0.18, metalness: 0.82 },
      { name: "Nero Nemesis", hex: 0x111317, r: 0.067, g: 0.075, b: 0.090, caliper: 0xde0924, roughness: 0.32, metalness: 0.70 },
      { name: "Oro Elios", hex: 0xd4af37, r: 0.831, g: 0.686, b: 0.216, caliper: 0x111317, roughness: 0.22, metalness: 0.88 }
    ];

    this.initScene();
    this.initRenderer();
    this.initControllers();
    this.initSectionConfigs();
    this.initExplosionCoreLight();
    this.initAeroStreamlines();
    this.initExhaustFlames();
    this.initScrollTrigger();
    this.bindWindowEvents();
    this.loadAssets();
    this.animate();
  }

  initExplosionCoreLight() {
    this.explosionCoreLight = new THREE.PointLight(0x00d2ff, 0, 7.5);
    this.explosionCoreLight.position.set(0, 0.85, 0);
    this.scene.add(this.explosionCoreLight);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a12);
    this.scene.fog = new THREE.FogExp2(0x070a12, 0.016);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
  }

  initControllers() {
    this.showroomCtrl = new ShowroomController(this.scene, this.renderer, this.pmremGenerator);
    this.cameraCtrl = new CameraController(this.renderer.domElement);
    this.lightsCtrl = new LightingController(this.scene, this.showroomCtrl);
    this.carCtrl = new CarController(this.scene);
    this.explosionCtrl = new ExplosionController(this.carCtrl, this.cameraCtrl);
    this.configCtrl = new ConfiguratorController(this.carCtrl, this.cameraCtrl);
    this.interactionCtrl = new InteractionController(
      this.cameraCtrl,
      this.lightsCtrl,
      this.carCtrl,
      this.configCtrl
    );
    this.initExplosionHUDControls();
  }

  initSectionConfigs() {
    this.sectionConfigs = {
      "section-hero": {
        camPos: new THREE.Vector3(-4.8, 1.42, 3.3),
        camTarget: new THREE.Vector3(0, 0.65, 0),
        autoRotate: true,
        aeroStreamlines: false,
        doorOpen: 0,
        wingAngle: -0.06,
        squat: 0
      },
      "section-exploded": {
        camPos: new THREE.Vector3(-4.5, 1.95, 3.4),
        camTarget: new THREE.Vector3(0, 0.95, 0),
        autoRotate: false,
        aeroStreamlines: false,
        doorOpen: 0,
        wingAngle: -0.06,
        squat: 0
      },
      "section-fleet": {
        camPos: new THREE.Vector3(-5.2, 1.5, 3.6),
        camTarget: new THREE.Vector3(0, 0.65, 0),
        autoRotate: true,
        aeroStreamlines: false,
        doorOpen: 0,
        wingAngle: -0.06,
        squat: 0
      },
      "section-booking": {
        camPos: new THREE.Vector3(-5.2, 1.5, 3.6),
        camTarget: new THREE.Vector3(0, 0.65, 0),
        autoRotate: true,
        aeroStreamlines: false,
        doorOpen: 0,
        wingAngle: -0.06,
        squat: 0
      }
    };
  }

  // 3D Aerodynamic Wind Tunnel Streamlines Particle System
  initAeroStreamlines() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const progress = Math.random();
      const x = -3.5 + progress * 8.0;

      let y = 0.45;
      if (x < -1.5) {
        y = 0.35 + Math.random() * 0.35;
      } else if (x < 0.2) {
        y = 0.65 + ((x + 1.5) / 1.7) * 0.65 + Math.random() * 0.15;
      } else if (x < 1.6) {
        y = 1.25 - ((x - 0.2) / 1.4) * 0.3 + Math.random() * 0.12;
      } else {
        y = 0.95 + ((x - 1.6) / 2.0) * 0.25 + Math.random() * 0.25;
      }

      const z = (Math.random() - 0.5) * 1.85;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      speeds[i] = 7.5 + Math.random() * 4.5;
      alphas[i] = 0.3 + Math.random() * 0.7;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.aeroStreamlinePoints = new THREE.Points(geometry, material);
    this.aeroStreamlinePoints.name = "AeroStreamlines";
    this.scene.add(this.aeroStreamlinePoints);

    this.aeroStreamlineData = { positions, speeds, alphas, material };
  }

  updateAeroStreamlines(delta) {
    if (!this.aeroStreamlineData) return;

    const { positions, speeds, material } = this.aeroStreamlineData;
    const targetOpacity = this.aeroStreamlinesActive ? 0.85 : 0;
    material.opacity += (targetOpacity - material.opacity) * Math.min(1, delta * 4.0);

    if (material.opacity > 0.01) {
      const count = positions.length / 3;
      const speedMultiplier = this.aeroFlowSpeedMultiplier || 1.0;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += speeds[i] * speedMultiplier * delta;

        if (positions[i * 3] > 4.5) {
          positions[i * 3] = -3.5 - Math.random() * 0.8;
          positions[i * 3 + 1] = 0.35 + Math.random() * 0.3;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.85;
        } else {
          const x = positions[i * 3];
          if (x < -1.5) {
            positions[i * 3 + 1] = 0.4 + Math.sin(x) * 0.08;
          } else if (x < 0.2) {
            positions[i * 3 + 1] = 0.65 + ((x + 1.5) / 1.7) * 0.62;
          } else if (x < 1.6) {
            positions[i * 3 + 1] = 1.25 - ((x - 0.2) / 1.4) * 0.28;
          } else {
            positions[i * 3 + 1] = 0.95 + ((x - 1.6) / 2.0) * 0.22;
          }
        }
      }

      this.aeroStreamlinePoints.geometry.attributes.position.needsUpdate = true;
    }
  }

  // Inconel Dual Exhaust Flame Particles & Heat Glow
  initExhaustFlames() {
    this.exhaustGroup = new THREE.Group();
    this.exhaustGroup.name = "ExhaustFlameGroup";

    this.exhaustLight = new THREE.PointLight(0xff5500, 0, 3.5);
    this.exhaustLight.position.set(2.18, 0.68, 0);
    this.exhaustGroup.add(this.exhaustLight);

    const particleCount = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const isLeft = i % 2 === 0;
      positions[i * 3] = 2.05;
      positions[i * 3 + 1] = 0.68;
      positions[i * 3 + 2] = isLeft ? -0.16 : 0.16;

      if (Math.random() > 0.45) {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.35;
        colors[i * 3 + 2] = 0.0;
      }
      lifetimes[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.exhaustParticles = new THREE.Points(geometry, material);
    this.exhaustGroup.add(this.exhaustParticles);
    this.scene.add(this.exhaustGroup);

    this.exhaustData = { positions, colors, lifetimes, material };
  }

  updateExhaustFlames(delta) {
    if (!this.exhaustData || !this.exhaustLight) return;

    const rev = this.engineRevIntensity || 0;
    const isPowertrain = this.currentSection === "section-powertrain";
    const active = isPowertrain && rev > 0.05;

    if (active) {
      this.exhaustLight.intensity = (rev * 3.8) + (Math.random() * rev * 2.2);
      this.exhaustLight.color.setHex(rev > 0.65 ? 0x00d2ff : 0xff5500);
      this.exhaustData.material.opacity = Math.min(1.0, rev * 1.4);
    } else {
      this.exhaustLight.intensity = 0;
      this.exhaustData.material.opacity = 0;
    }

    if (this.exhaustData.material.opacity > 0.01) {
      const { positions, lifetimes } = this.exhaustData;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        lifetimes[i] -= delta * (4.0 + rev * 8.0);
        if (lifetimes[i] <= 0) {
          lifetimes[i] = 1.0;
          const isLeft = i % 2 === 0;
          positions[i * 3] = 2.05 + Math.random() * 0.05;
          positions[i * 3 + 1] = 0.68 + (Math.random() - 0.5) * 0.04;
          positions[i * 3 + 2] = (isLeft ? -0.16 : 0.16) + (Math.random() - 0.5) * 0.04;
        } else {
          positions[i * 3] += (0.6 + rev * 1.8) * delta;
          positions[i * 3 + 1] += (Math.random() - 0.48) * 0.04;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.04;
        }
      }

      this.exhaustParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  setSection(sectionId) {
    if (this.currentSection === sectionId) return;
    this.currentSection = sectionId;
    const cfg = this.sectionConfigs[sectionId] || this.sectionConfigs["section-hero"];

    this.targetCamPos.copy(cfg.camPos);
    this.targetCamTarget.copy(cfg.camTarget);

    if (this.cameraCtrl) {
      this.cameraCtrl.setAutoRotate(!!cfg.autoRotate);
    }

    this.targetWingAngle = cfg.wingAngle !== undefined ? cfg.wingAngle : -0.06;
    this.targetSquat = cfg.squat !== undefined ? cfg.squat : 0;
    this.targetDoorProgress = cfg.doorOpen !== undefined ? cfg.doorOpen : 0;
    this.aeroStreamlinesActive = !!cfg.aeroStreamlines;

    if (sectionId !== "section-powertrain") {
      this.engineRevIntensity = 0;
    }

    const doorBtn = document.getElementById("btn-toggle-door");
    const doorText = document.getElementById("door-btn-text");
    if (doorBtn && doorText) {
      const isOpen = this.targetDoorProgress > 0.5;
      doorBtn.classList.toggle("door-open", isOpen);
      doorText.textContent = isOpen ? "CLOSE DIHEDRAL SCISSOR DOOR" : "OPEN DIHEDRAL SCISSOR DOOR (74°)";
    }
  }

  updateActiveSectionOnScroll() {
    const scrollY = window.scrollY;
    const viewportMiddle = scrollY + window.innerHeight * 0.45;

    // Track scroll velocity for gravity falling physics
    const scrollDelta = scrollY - this.lastScrollY;
    this.lastScrollY = scrollY;

    if (scrollDelta > 0) {
      // User is scrolling DOWN -> inject dynamic downward gravity / falling impulse
      this.fallVelocity = Math.min(1.4, this.fallVelocity + scrollDelta * 0.0038);
    }

    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const maxScroll = Math.max(1, docHeight - window.innerHeight);
    this.normalizedScrollProgress = Math.min(1.0, Math.max(0, scrollY / maxScroll));

    // Subtle dynamic suspension compression on active downward scroll: max -0.05m
    const dynamicDrop = -Math.min(0.08, this.fallVelocity * 0.05);

    this.targetFallY = dynamicDrop;
    this.targetFallPitch = -Math.min(0.04, this.fallVelocity * 0.03);

    const track = document.getElementById("three-experience-track");
    const trackTop = track ? track.offsetTop : 0;
    const trackHeight = track ? track.offsetHeight : (window.innerHeight * 3);
    const fleetSec = document.getElementById("section-fleet");
    const bookingSec = document.getElementById("section-booking");

    let active = "section-hero";
    if (bookingSec && scrollY >= bookingSec.offsetTop - 300) {
      active = "section-booking";
      this.targetExplosionProgress = 0;
    } else if (fleetSec && scrollY >= fleetSec.offsetTop - 300) {
      active = "section-fleet";
      this.targetExplosionProgress = 0;
    } else if (scrollY > trackTop + trackHeight * 0.58) {
      active = "section-exploded";
    } else if (scrollY > trackTop + trackHeight * 0.12) {
      active = "section-overview";
    }

    if (active !== this.currentSection) {
      this.setSection(active);
    }
  }

  switchFleetSupercar(modelKey) {
    if (this.carCtrl) {
      const spec = this.carCtrl.setFleetModel(modelKey);
      const specNameEl = document.getElementById("fleet-active-spec-name");
      if (specNameEl && spec) {
        specNameEl.textContent = `${spec.name.toUpperCase()}`;
      }
      this.isAutoColorActive = false;
      const btn = document.getElementById("btn-autocolor-toggle");
      if (btn) btn.classList.remove("active");
      this.targetExplosionProgress = 0;
      this.cameraCtrl.moveToPreset("hero", 1.2);
    }
  }

  setAeroMode(mode) {
    if (mode === "high-downforce") {
      this.targetWingAngle = -0.24;
      this.targetSquat = -0.045;
      this.aeroFlowSpeedMultiplier = 1.6;
    } else if (mode === "low-drag") {
      this.targetWingAngle = 0.06;
      this.targetSquat = 0.005;
      this.aeroFlowSpeedMultiplier = 2.4;
    } else if (mode === "aero-vectoring") {
      this.targetWingAngle = -0.16;
      this.targetSquat = -0.025;
      this.aeroFlowSpeedMultiplier = 1.8;
    }
    const statusEl = document.getElementById("ala-3d-status-display");
    if (statusEl) {
      if (mode === "high-downforce") statusEl.textContent = "HIGH DOWNFORCE // WING PITCH -14° // MAXIMUM TARMAC TRACTION";
      else if (mode === "low-drag") statusEl.textContent = "LOW DRAG // WING STALLED // 350+ KM/H SLIPSTREAM";
      else statusEl.textContent = "AERO VECTORING // DIFFERENTIAL DOWNFORCE // ZERO UNDERSTEER";
    }
  }

  setEngineRev(normalizedRPM) {
    this.engineRevIntensity = Math.min(1.0, Math.max(0, normalizedRPM));
    const hapticEl = document.getElementById("v12-3d-haptic-status");
    if (hapticEl) {
      if (this.engineRevIntensity > 0.75) {
        hapticEl.textContent = `REDLINE WOT (8,500 RPM) // INCONEL FLAME BURST // CHASSIS VIBRATION MAX`;
      } else if (this.engineRevIntensity > 0.2) {
        hapticEl.textContent = `V12 THROTTLE OPEN // HARMONIC RESONANCE // EXHAUST PLUME ACTIVE`;
      } else {
        hapticEl.textContent = `60° V12 IDLE HARMONIC // EXHAUST IDLE (280°C)`;
      }
    }
  }

  toggleScissorDoor() {
    this.targetDoorProgress = this.targetDoorProgress > 0.5 ? 0 : 1.0;
    const btn = document.getElementById("btn-toggle-door");
    const text = document.getElementById("door-btn-text");
    if (btn) btn.classList.toggle("door-open", this.targetDoorProgress > 0.5);
    if (text) text.textContent = this.targetDoorProgress > 0.5 ? "CLOSE DIHEDRAL SCISSOR DOOR" : "OPEN DIHEDRAL SCISSOR DOOR (74°)";
  }

  setCockpitTheme(themeKey) {
    if (this.carCtrl) {
      this.carCtrl.setCockpitAccent(themeKey);
    }
  }

  triggerVIPCelebration(model, name) {
    if (this.carCtrl) {
      this.carCtrl.triggerStrobeSequence();
      this.setEngineRev(1.0);
      setTimeout(() => this.setEngineRev(0), 1800);
      this.cameraCtrl.moveToPreset("hero", 2.2);
    }
  }

  initExplosionHUDControls() {
    const slider = document.getElementById("exploded-scrub-slider");
    const btn0 = document.getElementById("btn-explode-0");
    const btn50 = document.getElementById("btn-explode-50");
    const btn100 = document.getElementById("btn-explode-100");
    const btnAuto = document.getElementById("btn-explode-auto");
    const autoIcon = document.getElementById("auto-icon");
    const autoText = document.getElementById("auto-text");

    const updatePillActive = (activeBtn) => {
      [btn0, btn50, btn100].forEach((b) => {
        if (b) b.classList.remove("active");
      });
      if (activeBtn) activeBtn.classList.add("active");
    };

    if (slider) {
      slider.addEventListener("input", (e) => {
        this.isAutoplay = false;
        if (btnAuto) btnAuto.classList.remove("playing");
        if (autoIcon) autoIcon.textContent = "▶";
        if (autoText) autoText.textContent = "AUTOPLAY";
        this.isUserDraggingSlider = true;
        this.targetExplosionProgress = parseFloat(e.target.value) / 100;
        this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, this.targetExplosionProgress);
        this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, this.targetExplosionProgress);
      });
      slider.addEventListener("change", () => {
        this.isUserDraggingSlider = false;
      });
    }

    const animateToPreset = (targetProgress, activeBtn) => {
      this.isAutoplay = false;
      if (btnAuto) btnAuto.classList.remove("playing");
      if (autoIcon) autoIcon.textContent = "▶";
      if (autoText) autoText.textContent = "AUTOPLAY";
      updatePillActive(activeBtn);

      if (this.explosionTween) this.explosionTween.kill();
      this.explosionTween = gsap.to(this, {
        targetExplosionProgress: targetProgress,
        duration: 3.2,
        ease: "power2.inOut",
        onUpdate: () => {
          this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, this.targetExplosionProgress);
          this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, this.targetExplosionProgress);
        }
      });
    };

    if (btn0) {
      btn0.addEventListener("click", () => animateToPreset(0, btn0));
    }

    if (btn50) {
      btn50.addEventListener("click", () => animateToPreset(0.5, btn50));
    }

      if (btn100) {
      btn100.addEventListener("click", () => animateToPreset(1.0, btn100));
    }

    const btnZoom360 = document.getElementById("btn-explode-zoom360");
    const zoomText = document.getElementById("zoom-text");
    if (btnZoom360) {
      btnZoom360.addEventListener("click", () => {
        if (this.explodedZoomRadius > 6.0) {
          this.explodedZoomRadius = 4.85;
          if (zoomText) zoomText.textContent = "360° ZOOM (4.8M)";
          btnZoom360.classList.add("active");
        } else if (this.explodedZoomRadius > 4.2) {
          this.explodedZoomRadius = 3.65;
          if (zoomText) zoomText.textContent = "MACRO 360° (3.6M)";
          btnZoom360.classList.add("active");
        } else {
          this.explodedZoomRadius = 7.2;
          if (zoomText) zoomText.textContent = "WIDE 360° (7.2M)";
          btnZoom360.classList.remove("active");
        }
      });
    }

    if (btnAuto) {
      btnAuto.addEventListener("click", () => {
        this.isAutoplay = !this.isAutoplay;
        btnAuto.classList.toggle("playing", this.isAutoplay);
        if (autoIcon) autoIcon.textContent = this.isAutoplay ? "❚❚" : "▶";
        if (autoText) autoText.textContent = this.isAutoplay ? "PAUSE" : "AUTOPLAY";
      });
    }
  }

  loadAssets() {
    const bar = document.getElementById("loader-bar-fill");
    const percentEl = document.getElementById("loader-percent");
    const statusEl = document.getElementById("loader-status-text");

    const statusSteps = [
      "CALIBRATING V12 MONOCOQUE",
      "INITIALIZING ALA 2.0 AERODYNAMICS",
      "CONFIGURING CARBON CERAMIC BRAKES",
      "COMPILING PBR CLEARCOAT SHADERS",
      "ESTABLISHING TELEMETRY CONNECTION"
    ];

    this.carCtrl.load(
      "./assets/models/car.glb",
      (percent) => {
        const rounded = Math.round(percent);
        if (bar) bar.style.width = `${rounded}%`;
        if (percentEl) percentEl.textContent = `${rounded}%`;

        const stepIdx = Math.min(Math.floor((rounded / 100) * statusSteps.length), statusSteps.length - 1);
        if (statusEl) statusEl.textContent = statusSteps[stepIdx];
      },
      () => {
        if (bar) bar.style.width = "100%";
        if (percentEl) percentEl.textContent = "100%";
        if (statusEl) statusEl.textContent = "SYSTEM READY // AVENTADOR SVJ ENGAGED";

        if (this.scene.environment && this.carCtrl.model) {
          this.carCtrl.model.traverse((child) => {
            if (child.isMesh && child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((m) => {
                m.envMap = this.scene.environment;
                m.envMapIntensity = 1.35;
                m.needsUpdate = true;
              });
            }
          });
        }

        if (this.carCtrl && this.carCtrl.carGroup && this.exhaustGroup) {
          this.carCtrl.carGroup.add(this.exhaustGroup);
        }

        // Trigger cinematic hero entrance sequence and reveal
        this.playHeroEntranceSequence();
      },
      (err) => {
        console.error("Asset loading error:", err);
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.classList.add("loaded");
          preloader.style.display = "none";
        }
      }
    );
  }

  playHeroEntranceSequence() {
    // 1. Dismiss preloader cleanly with snappy fade
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("loaded");
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          preloader.style.display = "none";
        }
      });
    }

    // 2. Initial state: Dim headlights, subtle initial spin drift
    this.carCtrl.setHeadlightsState(true, 0);
    this.lightsCtrl.setHeadlights(false, 0);
    this.dragVelocityY = 0.025;

    // 3. Cinematic Camera Fly-In Swoop from wide angle to hero close-up
    this.cameraCtrl.playHeroEntrance(() => {
      this.isCarAutoRotating = true;
    });

    // 4. Sequential Lamborghini Headlight Ignition Sequence (snappy & punchy)
    gsap.delayedCall(0.15, () => {
      this.carCtrl.setHeadlightsState(true, 1.8);
      if (this.interactionCtrl) this.interactionCtrl.playRelaySound();
    });
    gsap.delayedCall(0.3, () => {
      this.carCtrl.setHeadlightsState(true, 0.4);
    });
    gsap.delayedCall(0.45, () => {
      this.carCtrl.setHeadlightsState(true, 4.2);
      this.lightsCtrl.setHeadlights(true, 1.35);
      if (this.carCtrl.materials.headlights) {
        gsap.to(this.carCtrl.materials.headlights, {
          emissiveIntensity: 2.8,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });

    // 5. Slide up the bottom configurator dock smoothly
    const configDock = document.getElementById("hero-configurator-dock");
    if (configDock) {
      gsap.fromTo(configDock,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, delay: 0.25, ease: "power2.out" }
      );
    }
  }

  animateHeroTelemetryCounters() {
    // Keep function for any telemetry counters in other sections
  }

  animateOverviewCounters() {
    const counters = document.querySelectorAll(".overview-counter");
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute("data-target")) || 0;
      const isDecimal = el.getAttribute("data-decimal") === "1";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
        }
      });
    });
  }

  initScrollTrigger() {
    window.addEventListener("scroll", () => {
      this.updateActiveSectionOnScroll();
    }, { passive: true });

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP / ScrollTrigger not loaded");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: "#three-experience-track",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;
        this.onScrollUpdate(self.progress);
      }
    });
  }

  onScrollUpdate(progress) {
    const configDock = document.getElementById("hero-configurator-dock");
    const scrollHint = document.querySelector(".scroll-hint");
    const overviewPanel = document.querySelector(".overview-left-panel");
    const hudDisplay = document.querySelector(".exploded-hud-display");

    // 1. Hero Configurator Dock Visibility in Hero Section
    const heroOpacity = progress <= 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.10);
    if (configDock) {
      configDock.style.opacity = heroOpacity;
      configDock.style.pointerEvents = heroOpacity > 0.1 ? "auto" : "none";
      configDock.style.transform = `translateY(${(1 - heroOpacity) * 35}px)`;
    }
    if (scrollHint) {
      scrollHint.style.opacity = heroOpacity;
    }

    // 2. Section 2 (Overview Showcase) Factor: 0 = Hero/Exploded, 1 = Section 2 in full view
    let s2Factor = 0;
    if (progress > 0.08 && progress < 0.28) {
      s2Factor = (progress - 0.08) / 0.20;
    } else if (progress >= 0.28 && progress <= 0.55) {
      s2Factor = 1.0;
    } else if (progress > 0.55 && progress < 0.68) {
      s2Factor = 1.0 - (progress - 0.55) / 0.13;
    } else {
      s2Factor = 0.0;
    }
    this.section2Factor = Math.max(0, Math.min(1, s2Factor));

    // Update Overview Left Panel visibility & animation
    if (overviewPanel) {
      if (this.section2Factor > 0.05) {
        overviewPanel.classList.add("visible");
        overviewPanel.style.opacity = this.section2Factor;
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          overviewPanel.style.transform = `translateY(${(1 - this.section2Factor) * 30}px)`;
        } else {
          overviewPanel.style.transform = `translateY(-50%) translateX(${(this.section2Factor - 1) * 40}px)`;
        }
        overviewPanel.style.pointerEvents = this.section2Factor > 0.4 ? "auto" : "none";
        if (!this.hasAnimatedOverviewCounters && this.section2Factor > 0.4) {
          this.hasAnimatedOverviewCounters = true;
          this.animateOverviewCounters();
        }
      } else {
        overviewPanel.classList.remove("visible");
        overviewPanel.style.opacity = 0;
        overviewPanel.style.pointerEvents = "none";
      }
    }

    // 3. Section 3 (Exploded View) HUD Display & Explosion Progress
    if (hudDisplay) {
      if (progress > 0.58 && progress < 0.98) {
        hudDisplay.classList.add("visible");
      } else {
        hudDisplay.classList.remove("visible");
      }
    }

    if (this.isAutoplay) {
      this.isAutoplay = false;
      const btnAuto = document.getElementById("btn-explode-auto");
      const autoIcon = document.getElementById("auto-icon");
      const autoText = document.getElementById("auto-text");
      if (btnAuto) btnAuto.classList.remove("playing");
      if (autoIcon) autoIcon.textContent = "▶";
      if (autoText) autoText.textContent = "AUTOPLAY";
    }

    if (progress <= 0.58) {
      this.targetExplosionProgress = 0;
    } else if (progress > 0.58 && progress < 0.94) {
      this.targetExplosionProgress = Math.min(1.0, Math.max(0, (progress - 0.58) / 0.36));
    } else {
      this.targetExplosionProgress = 1.0;
    }
  }

  bindWindowEvents() {
    window.addEventListener("resize", () => this.onResize());

    // Track pointer position for dynamic 3D hero parallax tilt
    window.addEventListener("pointermove", (e) => {
      this.mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    // Section 2 Overview Action CTAs
    const btnOverviewExplode = document.getElementById("overview-btn-explode");
    if (btnOverviewExplode) {
      btnOverviewExplode.addEventListener("click", () => {
        const secExploded = document.getElementById("section-exploded");
        if (secExploded) {
          secExploded.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Hero Action CTAs
    const btnExplode = document.getElementById("hero-btn-explode-trigger");
    if (btnExplode) {
      btnExplode.addEventListener("click", () => {
        const secExploded = document.getElementById("section-exploded");
        if (secExploded) {
          secExploded.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    const btnCustomize = document.getElementById("hero-btn-customize-dock");
    if (btnCustomize) {
      btnCustomize.addEventListener("click", () => {
        const dock = document.getElementById("hero-configurator-dock");
        if (dock) {
          dock.classList.remove("collapsed");
          const collapseIcon = document.getElementById("dock-collapse-icon");
          if (collapseIcon) collapseIcon.textContent = "▾";
          dock.classList.add("dock-highlight");
          setTimeout(() => dock.classList.remove("dock-highlight"), 1700);
          if (this.interactionCtrl) this.interactionCtrl.playClickSound();
        }
      });
    }

    const btnDockCollapse = document.getElementById("btn-dock-toggle-collapse");
    if (btnDockCollapse) {
      btnDockCollapse.addEventListener("click", () => {
        const dock = document.getElementById("hero-configurator-dock");
        if (dock) {
          const isCollapsed = dock.classList.toggle("collapsed");
          const collapseIcon = document.getElementById("dock-collapse-icon");
          if (collapseIcon) collapseIcon.textContent = isCollapsed ? "▴" : "▾";
          if (this.interactionCtrl) this.interactionCtrl.playClickSound();
        }
      });
    }

    this.canvas.addEventListener("mousedown", () => {
      this.canvasContainer.classList.add("grabbing");
    });
    window.addEventListener("mouseup", () => {
      this.canvasContainer.classList.remove("grabbing");
    });

    this.canvas.addEventListener("touchstart", () => {
      this.canvasContainer.classList.add("grabbing");
    }, { passive: true });
    window.addEventListener("touchend", () => {
      this.canvasContainer.classList.remove("grabbing");
    });
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.renderer) {
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    if (this.cameraCtrl) {
      this.cameraCtrl.onResize();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.08);
    const elapsed = this.clock.getElapsedTime();

    // Slow cinematic Autoplay loop (~12s per full explosion & reassembly cycle with suspense hold)
    if (this.isAutoplay) {
      if (this.autoplayHoldTimer > 0) {
        this.autoplayHoldTimer -= delta;
      } else {
        // Slow majestic progression rate: 0.088 per second
        this.targetExplosionProgress += this.autoplayDirection * delta * 0.088;
        if (this.targetExplosionProgress >= 1.0) {
          this.targetExplosionProgress = 1.0;
          this.autoplayDirection = -1;
          this.autoplayHoldTimer = 2.6; // Hold at full 100% explosion for 2.6s to observe slow zero-G floating parts
        } else if (this.targetExplosionProgress <= 0.0) {
          this.targetExplosionProgress = 0.0;
          this.autoplayDirection = 1;
          this.autoplayHoldTimer = 1.5; // Hold at assembled
        }
      }
      this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, this.targetExplosionProgress);
      this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, this.targetExplosionProgress);
    }

    // Smooth mechanical damping: silky physical acceleration and deceleration
    const damp = 1.0 - Math.exp(-6.8 * delta);
    const diff = this.targetExplosionProgress - this.currentExplosionProgress;

    if (Math.abs(diff) > 0.0001) {
      this.currentExplosionProgress += diff * damp;
    } else {
      this.currentExplosionProgress = this.targetExplosionProgress;
    }

    // Apply continuous position updates to all 87 nodes with slow zero-G harmonic hovering
    if (this.explosionCtrl) {
      this.explosionCtrl.setExplosionProgress(this.currentExplosionProgress, elapsed);
    }

    // Slow electromagnetic energy core light & headlight breathing pulse while exploded
    if (this.explosionCoreLight) {
      const exp = this.currentExplosionProgress;
      if (exp > 0.04) {
        this.explosionCoreLight.intensity = (exp * 2.8) + Math.sin(elapsed * 1.5) * 0.9 * exp;
      } else {
        this.explosionCoreLight.intensity = 0;
      }
    }
    if (this.carCtrl && this.carCtrl.materials.headlights && this.currentExplosionProgress > 0.05) {
      this.carCtrl.materials.headlights.emissiveIntensity = 2.4 + Math.sin(elapsed * 1.4) * 1.2;
    }

    // Update Telemetry HUD metrics
    const pct = Math.min(100, Math.max(0, Math.round(this.currentExplosionProgress * 100)));
    const counterEl = document.getElementById("exploded-counter-val");
    const meterFill = document.getElementById("exploded-meter-fill");
    const sliderEl = document.getElementById("exploded-scrub-slider");

    if (counterEl) {
      if (pct === 0) counterEl.textContent = `0% EXPLODED // ASSEMBLED`;
      else if (pct === 100) counterEl.textContent = `100% EXPLODED // FULL DISASSEMBLY (SLOW FLOATING)`;
      else counterEl.textContent = `${pct}% EXPLODED`;
    }
    if (meterFill) meterFill.style.width = `${pct}%`;
    if (sliderEl && !this.isUserDraggingSlider) sliderEl.value = pct;

    // 1. Scissor door smooth interpolation
    const doorDiff = this.targetDoorProgress - this.currentDoorProgress;
    if (Math.abs(doorDiff) > 0.001) {
      this.currentDoorProgress += doorDiff * (1.0 - Math.exp(-6.0 * delta));
      if (this.carCtrl) this.carCtrl.setScissorDoorProgress(this.currentDoorProgress);
    }

    // 2. Aerodynamic wing and squat smooth interpolation
    if (this.carCtrl) {
      this.currentWingAngle += (this.targetWingAngle - this.currentWingAngle) * damp;
      this.carCtrl.setSVJAeroWingAngle(this.currentWingAngle);

      this.currentSquat += (this.targetSquat - this.currentSquat) * damp;
      this.carCtrl.setSuspensionSquat(this.currentSquat);
    }

    // 3. Car Auto-Rotation & Scroll-Driven Falling Physics
    if (this.isCarAutoRotating && !this.isCarDragging) {
      this.carRotationY += this.carAutoRotateSpeed * delta;
    } else if (this.isCarDragging) {
      this.carRotationY += this.dragVelocityY;
      this.dragVelocityY *= Math.exp(-6.0 * delta);
    }

    // Dynamic fall decay & smooth spring damping
    this.fallVelocity *= Math.exp(-4.2 * delta);
    const fallDamp = 1.0 - Math.exp(-7.5 * delta);
    this.currentFallY += (this.targetFallY - this.currentFallY) * fallDamp;
    this.currentFallPitch += (this.targetFallPitch - this.currentFallPitch) * fallDamp;

    // Apply continuous transforms to car root group
    if (this.carCtrl && this.carCtrl.carGroup) {
      this.carCtrl.carGroup.rotation.y = this.carRotationY;
      this.carCtrl.carGroup.rotation.x = this.currentFallPitch;

      // In Section 2, shift the car group smoothly to the right side
      const f = this.section2Factor || 0;
      const carShiftX = THREE.MathUtils.lerp(0, 0.70, f);
      this.carCtrl.carGroup.position.x = carShiftX;

      let sectionMicroAnim = 0;
      if (this.currentSection === "section-hero" || this.currentSection === "section-overview") {
        // Active pushrod magneto-rheological suspension micro-travel & subtle pitch rumble
        sectionMicroAnim = Math.sin(elapsed * 1.6) * 0.009;
        this.carCtrl.carGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.0025;
      }
      this.carCtrl.carGroup.position.y = this.currentFallY + sectionMicroAnim;
    }

    // Lower showroom floor & turntable dais in unison so the car never clips through ground
    if (this.showroomCtrl && this.showroomCtrl.showroomGroup) {
      this.showroomCtrl.showroomGroup.position.y = this.currentFallY;
    }
    if (this.showroomCtrl && this.showroomCtrl.turntableGroup) {
      const f = this.section2Factor || 0;
      this.showroomCtrl.turntableGroup.position.x = THREE.MathUtils.lerp(0, 0.70, f);
    }

    // Automatic Car Color Transition across Lamborghini palette
    this.updateAutoCarColor(this.normalizedScrollProgress, elapsed);

    // 4. Update aerodynamic streamlines and exhaust systems
    this.updateAeroStreamlines(delta);
    this.updateExhaustFlames(delta);

    // 5. ZOOM IN 360° VIEW WHEN CAR IS EXPLODED
    const exp = this.currentExplosionProgress;
    if (exp > 0.02 && this.isExplodedZoom360Active) {
      if (!this.cameraCtrl.isUserInteracting) {
        // Continuous 360° orbital glide around the exploded components
        this.orbit360Angle += delta * this.orbit360Speed;

        // Smoothly zoom in as explosion expands:
        // Lerp from wide view (10.5m) down to close-up zoom view (5.4m)
        const currentZoomRadius = THREE.MathUtils.lerp(this.explodedWideRadius, this.explodedZoomRadius, exp);

        // Undulating cinematic camera elevation to inspect floating parts from all angles
        const camY = THREE.MathUtils.lerp(2.3, 1.68 + Math.sin(this.orbit360Angle * 2.2) * 0.42, exp);

        this.targetCamPos.set(
          Math.cos(this.orbit360Angle) * currentZoomRadius,
          camY,
          Math.sin(this.orbit360Angle) * currentZoomRadius
        );

        // Keep camera focused right on the mechanical core of the exploded vehicle
        const targetLookY = THREE.MathUtils.lerp(0.72, 0.95 + this.currentFallY * 0.45, exp);
        this.targetCamTarget.set(0, targetLookY, 0);
      }
    } else if (exp <= 0.02) {
      if (!this.cameraCtrl.isUserInteracting) {
        // Section 1 (Hero) camera framing
        const heroCamX = this.heroCamPos.x;
        const heroCamY = this.heroCamPos.y;
        const heroCamZ = this.heroCamPos.z;

        // Section 2 (Overview) camera framing: camera and target shift left,
        // placing the 3D car prominently on the RIGHT SIDE of the viewport
        const s2CamX = -4.85;
        const s2CamY = 1.35;
        const s2CamZ = 3.90;

        const s2TargetX = -2.00;
        const s2TargetY = 0.48;
        const s2TargetZ = -0.20;

        const f = this.section2Factor || 0;
        const curTargetX = THREE.MathUtils.lerp(this.heroTarget.x, s2TargetX, f);
        const curTargetY = THREE.MathUtils.lerp(this.heroTarget.y, s2TargetY, f);
        const curTargetZ = THREE.MathUtils.lerp(this.heroTarget.z, s2TargetZ, f);

        const curCamX = THREE.MathUtils.lerp(heroCamX, s2CamX, f);
        const curCamY = THREE.MathUtils.lerp(heroCamY, s2CamY, f);
        const curCamZ = THREE.MathUtils.lerp(heroCamZ, s2CamZ, f);

        // Subtle mouse parallax tilt for 3D depth
        const parallaxX = (this.mouseNormX || 0) * 0.35;
        const parallaxY = (this.mouseNormY || 0) * 0.16;
        this.targetCamPos.set(
          curCamX + parallaxX,
          curCamY - parallaxY,
          curCamZ + parallaxX * 0.5
        );
        this.targetCamTarget.set(curTargetX, curTargetY, curTargetZ);
      }
    }

    // Subtle headlight emissive breathing in hero idle
    if (this.carCtrl && this.carCtrl.materials.headlights && this.currentSection === "section-hero") {
      this.carCtrl.materials.headlights.emissiveIntensity = 2.8 + Math.sin(elapsed * 2.2) * 0.25;
    }

    // 6. Smoothly blend camera position & target across all sections
    if (this.cameraCtrl) {
      if (!this.cameraCtrl.isUserInteracting) {
        this.cameraCtrl.camera.position.lerp(this.targetCamPos, damp * 0.82);

        // Tilt camera target down with the falling car to keep it dramatically framed
        const camTargetWithFall = this.targetCamTarget.clone();
        camTargetWithFall.y += this.currentFallY * 0.45;
        this.cameraCtrl.controls.target.lerp(camTargetWithFall, damp * 0.82);
      }
      this.cameraCtrl.update();
    }

    if (this.renderer && this.scene && this.cameraCtrl && this.cameraCtrl.camera) {
      this.renderer.render(this.scene, this.cameraCtrl.camera);
    }
  }

  // Automatic Smooth Lamborghini Paint Color Cycle
  updateAutoCarColor(scrollNorm, elapsed) {
    if (!this.isAutoColorActive || !this.carCtrl || !this.carCtrl.materials.body) return;
    if (Date.now() < this.autoColorPausedUntil) return;

    const paletteLen = this.lamboPalette.length;
    // Scroll progress maps 2.5 full loops across palette + continuous ambient drift
    const cyclePhase = ((scrollNorm * 2.5) + (elapsed * 0.048)) % 1.0;
    const scaled = cyclePhase * paletteLen;
    const idx1 = Math.floor(scaled) % paletteLen;
    const idx2 = (idx1 + 1) % paletteLen;
    const fraction = scaled - Math.floor(scaled);

    // Smooth sinusoidal blending
    const t = 0.5 - 0.5 * Math.cos(fraction * Math.PI);

    const c1 = this.lamboPalette[idx1];
    const c2 = this.lamboPalette[idx2];

    const r = c1.r + (c2.r - c1.r) * t;
    const g = c1.g + (c2.g - c1.g) * t;
    const b = c1.b + (c2.b - c1.b) * t;
    const roughness = c1.roughness + (c2.roughness - c1.roughness) * t;
    const metalness = c1.metalness + (c2.metalness - c1.metalness) * t;

    this.carCtrl.setBodyColorRGB(r, g, b, roughness, metalness);

    // Sync caliper color and UI badge with dominant color
    const activeEntry = fraction < 0.5 ? c1 : c2;
    if (this.currentColorName !== activeEntry.name) {
      this.currentColorName = activeEntry.name;
      this.currentColorIndex = fraction < 0.5 ? idx1 : idx2;
      if (this.carCtrl.materials.caliper) {
        this.carCtrl.setCaliperColorHex(activeEntry.caliper);
      }
      this.syncColorUIToAutoColor(activeEntry);
    }
  }

  syncColorUIToAutoColor(entry) {
    const label = document.getElementById("label-body-color");
    if (label) {
      label.textContent = `${entry.name.toUpperCase()} (AUTO-CYCLE)`;
    }
    const container = document.getElementById("swatches-body-color");
    if (container) {
      const swatches = container.querySelectorAll(".swatch-btn");
      swatches.forEach((swatch) => {
        if (swatch.title && swatch.title.toLowerCase().includes(entry.name.toLowerCase().split(" ")[0])) {
          swatch.classList.add("active");
        } else {
          swatch.classList.remove("active");
        }
      });
    }
  }

  toggleCarAutoRotate() {
    this.isCarAutoRotating = !this.isCarAutoRotating;
    const btn = document.getElementById("btn-rotate-toggle");
    if (btn) btn.classList.toggle("active", this.isCarAutoRotating);
    return this.isCarAutoRotating;
  }

  toggleAutoColor() {
    this.isAutoColorActive = !this.isAutoColorActive;
    const btn = document.getElementById("btn-autocolor-toggle");
    if (btn) btn.classList.toggle("active", this.isAutoColorActive);
    return this.isAutoColorActive;
  }

  pauseAutoColor(durationMs = 7000) {
    this.autoColorPausedUntil = Date.now() + durationMs;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new Application();
});
