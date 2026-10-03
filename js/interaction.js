/**
 * ============================================================================
 * AVENTADOR SVJ // INTERACTION, AUDIO SYNTHESIZER & ACCESSIBILITY
 * Handles horizontal 360-degree drag inertia, Web Audio API sound synthesis
 * (V12 engine roar, headlight relay, tactile clicks), and keyboard shortcuts.
 * ============================================================================
 */

class InteractionController {
  constructor(cameraController, lightingController, carController, configuratorController) {
    this.cameraCtrl = cameraController;
    this.lightsCtrl = lightingController;
    this.carCtrl = carController;
    this.configCtrl = configuratorController;

    this.audioCtx = null;
    this.soundEnabled = false;

    this.initAudio();
    this.initFloatingDeckControls();
    this.initKeyboardControls();
  }

  initAudio() {
    const audioBtn = document.getElementById("btn-sound-toggle");
    if (!audioBtn) return;

    audioBtn.addEventListener("click", () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      this.soundEnabled = !this.soundEnabled;
      audioBtn.classList.toggle("active", this.soundEnabled);
      const label = audioBtn.querySelector(".deck-label");
      if (label) label.textContent = this.soundEnabled ? "SOUND: ON" : "SOUND: OFF";

      if (this.soundEnabled) {
        this.playEngineRev();
      }
    });
  }

  playClickSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playRelaySound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playEngineRev() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;

      // Dual harmonic oscillators simulating a screaming high-revving 60° V12
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "triangle";

      // V12 Idle to Rev Pitch Envelope
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.6);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 1.8);

      osc2.frequency.setValueAtTime(150, now);
      osc2.frequency.exponentialRampToValueAtTime(640, now + 0.6);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 1.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  initFloatingDeckControls() {
    // 1. Headlights Toggle
    const lightsBtn = document.getElementById("btn-lights-toggle");
    if (lightsBtn) {
      lightsBtn.addEventListener("click", () => {
        const isOn = this.lightsCtrl.toggleHeadlights();
        if (this.carCtrl) this.carCtrl.setHeadlightsState(isOn);
        lightsBtn.classList.toggle("active", isOn);
        const label = lightsBtn.querySelector(".deck-label");
        if (label) label.textContent = isOn ? "LIGHTS: ON" : "LIGHTS: OFF";
        this.playRelaySound();
      });
    }

    // 2. Day / Night Toggle
    const dayNightBtn = document.getElementById("btn-daynight-toggle");
    if (dayNightBtn) {
      dayNightBtn.addEventListener("click", () => {
        const isNight = this.lightsCtrl.toggleDayNight();
        dayNightBtn.classList.toggle("active", !isNight);
        const label = dayNightBtn.querySelector(".deck-label");
        if (label) label.textContent = isNight ? "SHOWROOM: NIGHT" : "SHOWROOM: DAY";
        this.playClickSound();
      });
    }

    // 3. Auto-Rotate Toggle
    const rotateBtn = document.getElementById("btn-rotate-toggle");
    if (rotateBtn) {
      rotateBtn.addEventListener("click", () => {
        const rotating = this.cameraCtrl.toggleAutoRotate();
        rotateBtn.classList.toggle("active", rotating);
        const label = rotateBtn.querySelector(".deck-label");
        if (label) label.textContent = rotating ? "TURNTABLE: ON" : "TURNTABLE: OFF";
        this.playClickSound();
      });
    }

    // Global tactile feedback for buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest(".nav-link") || e.target.closest(".component-card-node")) {
        this.playClickSound();
      }
    });
  }

  initKeyboardControls() {
    window.addEventListener("keydown", (e) => {
      // Ignore if user is inside an input
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

      switch (e.key.toLowerCase()) {
        case "l": // Headlights
          const lightsBtn = document.getElementById("btn-lights-toggle");
          if (lightsBtn) lightsBtn.click();
          break;

        case "d": // Day/Night
          const dayNightBtn = document.getElementById("btn-daynight-toggle");
          if (dayNightBtn) dayNightBtn.click();
          break;

        case "r": // Auto-rotate
          const rotateBtn = document.getElementById("btn-rotate-toggle");
          if (rotateBtn) rotateBtn.click();
          break;

        case " ": // Spacebar: Reset camera
          e.preventDefault();
          this.cameraCtrl.moveToPreset("hero", 1.4);
          break;

        case "escape": // Close modal
          const modal = document.getElementById("component-modal");
          if (modal && modal.classList.contains("active")) {
            const closeBtn = document.getElementById("btn-modal-close");
            if (closeBtn) closeBtn.click();
          }
          break;

        case "1":
          this.scrollToSection("section-hero");
          break;
        case "2":
          this.scrollToSection("section-inspect");
          break;
        case "3":
          this.scrollToSection("section-exploded");
          break;
        case "4":
          this.scrollToSection("section-reassembly");
          break;
        case "5":
          this.scrollToSection("section-configurator");
          break;
      }
    });
  }

  scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}

window.InteractionController = InteractionController;
