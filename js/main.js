/**
 * ============================================================================
 * AVENTADOR SVJ // APPLICATION BOOTSTRAP & MAIN ORCHESTRATOR
 * Initializes WebGL renderer, studio environment, PMREM studio lighting,
 * GSAP ScrollTrigger timeline scrubbing, and animation render loop.
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

    this.particles = null;
    this.clock = new THREE.Clock();

    this.scrollProgress = 0;
    this.targetExplosionProgress = 0;
    this.currentExplosionProgress = 0;
    this.isAutoplay = false;
    this.autoplayDirection = 1;
    this.isUserDraggingSlider = false;

    // Camera preset reference points
    this.heroCamPos = new THREE.Vector3(-7.6, 2.3, 5.2);
    this.heroTarget = new THREE.Vector3(0, 0.72, 0);
    this.explodedCamPos = new THREE.Vector3(-8.8, 5.2, 7.2);
    this.explodedTarget = new THREE.Vector3(0, 1.1, 0);

    this.targetCamPos = this.heroCamPos.clone();
    this.targetCamTarget = this.heroTarget.clone();

    this.initScene();
    this.initRenderer();
    this.initControllers();
    this.initScrollTrigger();
    this.bindWindowEvents();
    this.loadAssets();
    this.animate();
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

    if (btn0) {
      btn0.addEventListener("click", () => {
        this.isAutoplay = false;
        if (btnAuto) btnAuto.classList.remove("playing");
        if (autoIcon) autoIcon.textContent = "▶";
        if (autoText) autoText.textContent = "AUTOPLAY";
        this.targetExplosionProgress = 0;
        this.targetCamPos.copy(this.heroCamPos);
        this.targetCamTarget.copy(this.heroTarget);
        updatePillActive(btn0);
      });
    }

    if (btn50) {
      btn50.addEventListener("click", () => {
        this.isAutoplay = false;
        if (btnAuto) btnAuto.classList.remove("playing");
        if (autoIcon) autoIcon.textContent = "▶";
        if (autoText) autoText.textContent = "AUTOPLAY";
        this.targetExplosionProgress = 0.5;
        this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, 0.5);
        this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, 0.5);
        updatePillActive(btn50);
      });
    }

    if (btn100) {
      btn100.addEventListener("click", () => {
        this.isAutoplay = false;
        if (btnAuto) btnAuto.classList.remove("playing");
        if (autoIcon) autoIcon.textContent = "▶";
        if (autoText) autoText.textContent = "AUTOPLAY";
        this.targetExplosionProgress = 1.0;
        this.targetCamPos.copy(this.explodedCamPos);
        this.targetCamTarget.copy(this.explodedTarget);
        updatePillActive(btn100);
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

        // Assign studio environment reflection map to all car materials
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

        // Promptly dismiss preloader completely
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.classList.add("loaded");
          preloader.style.opacity = "0";
          preloader.style.pointerEvents = "none";
          setTimeout(() => {
            preloader.style.display = "none";
          }, 300);
        }

        // Frame the full car in the hero view with plenty of room
        this.cameraCtrl.moveToPreset("hero", 1.8);

        // Turn headlights ON
        this.lightsCtrl.setHeadlights(true, 1.2);
        this.carCtrl.setHeadlightsState(true);
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

  initScrollTrigger() {
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
    // Fade out hero elements as user begins scrolling down
    const configDock = document.getElementById("hero-configurator-dock");
    const heroHeader = document.querySelector(".hero-header-minimal");
    const scrollHint = document.querySelector(".scroll-hint");
    const hudDisplay = document.querySelector(".exploded-hud-display");

    // Fade out hero dock immediately as soon as mouse wheel scrolls down
    const heroOpacity = Math.max(0, 1 - progress / 0.04);
    if (configDock) {
      configDock.style.opacity = heroOpacity;
      configDock.style.pointerEvents = heroOpacity > 0.05 ? "auto" : "none";
      configDock.style.transform = `translateX(-50%) translateY(${(1 - heroOpacity) * 35}px)`;
    }
    if (heroHeader) {
      heroHeader.style.opacity = heroOpacity;
    }
    if (scrollHint) {
      scrollHint.style.opacity = heroOpacity;
    }

    // Exploded HUD Telemetry visibility
    if (hudDisplay) {
      if (progress > 0.015 && progress < 0.96) {
        hudDisplay.classList.add("visible");
      } else {
        hudDisplay.classList.remove("visible");
      }
    }

    // Stop autoplay when user scrolls so user has manual control
    if (this.isAutoplay) {
      this.isAutoplay = false;
      const btnAuto = document.getElementById("btn-explode-auto");
      const autoIcon = document.getElementById("auto-icon");
      const autoText = document.getElementById("auto-text");
      if (btnAuto) btnAuto.classList.remove("playing");
      if (autoIcon) autoIcon.textContent = "▶";
      if (autoText) autoText.textContent = "AUTOPLAY";
    }

    if (progress <= 0.005) {
      // Stage 1: Assembled in Hero View (with Configure Dock active at bottom)
      this.targetExplosionProgress = 0;
      this.targetCamPos.copy(this.heroCamPos);
      this.targetCamTarget.copy(this.heroTarget);
      if (this.carCtrl.carGroup) {
        this.carCtrl.carGroup.position.set(0, 0, 0);
      }

    } else if (progress > 0.005 && progress < 0.65) {
      // Stage 2: Direct Exploded Mechanical Disassembly while scrolling!
      const t = Math.min(1, Math.max(0, (progress - 0.005) / (0.65 - 0.005)));
      this.targetExplosionProgress = t;
      this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, t);
      this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, t);
      if (this.carCtrl.carGroup) {
        this.carCtrl.carGroup.position.set(0, 0, 0);
      }

    } else if (progress >= 0.65 && progress < 0.75) {
      // Stage 2b: Hold 100% full exploded view in suspended animation
      this.targetExplosionProgress = 1.0;
      this.targetCamPos.copy(this.explodedCamPos);
      this.targetCamTarget.copy(this.explodedTarget);
      if (this.carCtrl.carGroup) {
        this.carCtrl.carGroup.position.set(0, 0, 0);
      }

    } else {
      // Stage 3: Smooth reassembly on further scroll
      const reT = Math.max(0, 1 - (progress - 0.75) / (1.0 - 0.75));
      this.targetExplosionProgress = reT;
      this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, reT);
      this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, reT);
      if (this.carCtrl.carGroup) {
        this.carCtrl.carGroup.position.set(0, 0, 0);
      }
    }
  }

  bindWindowEvents() {
    window.addEventListener("resize", () => this.onResize());

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

    // Cinematic Autoplay loop
    if (this.isAutoplay) {
      this.targetExplosionProgress += this.autoplayDirection * delta * 0.32;
      if (this.targetExplosionProgress >= 1.0) {
        this.targetExplosionProgress = 1.0;
        this.autoplayDirection = -1;
      } else if (this.targetExplosionProgress <= 0.0) {
        this.targetExplosionProgress = 0.0;
        this.autoplayDirection = 1;
      }
      this.targetCamPos.lerpVectors(this.heroCamPos, this.explodedCamPos, this.targetExplosionProgress);
      this.targetCamTarget.lerpVectors(this.heroTarget, this.explodedTarget, this.targetExplosionProgress);
    }

    // High-precision exponential damping: frame-rate independent fluid mechanical motion
    const damp = 1.0 - Math.exp(-12.0 * delta);
    const diff = this.targetExplosionProgress - this.currentExplosionProgress;

    if (Math.abs(diff) > 0.0001) {
      this.currentExplosionProgress += diff * damp;
    } else {
      this.currentExplosionProgress = this.targetExplosionProgress;
    }

    // Apply continuous position updates to all 87 nodes with harmonic micro-float
    if (this.explosionCtrl) {
      this.explosionCtrl.setExplosionProgress(this.currentExplosionProgress, elapsed);
    }

    // Update Telemetry HUD metrics
    const pct = Math.min(100, Math.max(0, Math.round(this.currentExplosionProgress * 100)));
    const counterEl = document.getElementById("exploded-counter-val");
    const meterFill = document.getElementById("exploded-meter-fill");
    const sliderEl = document.getElementById("exploded-scrub-slider");

    if (counterEl) {
      if (pct === 0) counterEl.textContent = `0% EXPLODED // ASSEMBLED`;
      else if (pct === 100) counterEl.textContent = `100% EXPLODED // FULL DISASSEMBLY`;
      else counterEl.textContent = `${pct}% EXPLODED`;
    }
    if (meterFill) meterFill.style.width = `${pct}%`;
    if (sliderEl && !this.isUserDraggingSlider) sliderEl.value = pct;

    // Smoothly blend camera position & target during exploded mode if user is not manually orbiting
    if (this.cameraCtrl) {
      if (!this.cameraCtrl.isUserInteracting && (this.currentExplosionProgress > 0.005 || this.targetExplosionProgress > 0.005)) {
        this.cameraCtrl.camera.position.lerp(this.targetCamPos, damp * 0.82);
        this.cameraCtrl.controls.target.lerp(this.targetCamTarget, damp * 0.82);
      }
      this.cameraCtrl.update();
    }

    if (this.renderer && this.scene && this.cameraCtrl && this.cameraCtrl.camera) {
      this.renderer.render(this.scene, this.cameraCtrl.camera);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new Application();
});
