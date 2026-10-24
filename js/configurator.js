/**
 * ============================================================================
 * AVENTADOR SVJ // 3D VEHICLE CONFIGURATOR STUDIO
 * Real-time material and mesh customization engine:
 * Exterior paint, wheel styles, wheel finishes, brake calipers, and interior.
 * ============================================================================
 */

class ConfiguratorController {
  constructor(carController, cameraController) {
    this.car = carController;
    this.cameraCtrl = cameraController;

    this.currentConfig = {
      bodyColor: { name: "Grigio Titans", hex: 0xd6dce5, code: "EXT-GRIGIO" },
      wheelStyle: { name: "Style 01 (Forged Monoblock)", index: 0, code: "WHL-S01" },
      wheelColor: { name: "Satin Nero", hex: 0x111111, code: "WCLR-NERO" },
      caliperColor: { name: "Rosso Mars", hex: 0xc40018, code: "CAL-ROSSO" },
      interiorColor: { name: "Nero Ade Alcantara", hex: 0x181a1f, code: "INT-NERO" }
    };

    this.initTabs();
    this.initBodyColors();
    this.initWheelStyles();
    this.initWheelColors();
    this.initCaliperColors();
    this.initInteriorColors();
    this.initActionButtons();
    this.updateBuildCode();
  }

  initTabs() {
    const tabBtns = document.querySelectorAll(".config-tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const activePane = document.getElementById(`pane-${target}`);
        if (activePane) activePane.classList.add("active");

        // Subtle camera vantage adjustment depending on active tab
        if (target === "wheels" || target === "calipers") {
          this.cameraCtrl.focusOnPoint(new THREE.Vector3(-1.6, 0.4, 1.2), 2.2, 1.2);
        } else if (target === "interior") {
          this.cameraCtrl.focusOnPoint(new THREE.Vector3(-0.2, 1.0, 0.8), 2.4, 1.2);
        } else {
          this.cameraCtrl.moveToPreset("hero", 1.2);
        }
      });
    });
  }

  initBodyColors() {
    const colors = [
      { name: "Grigio Titans (Reference Silver)", hex: 0xd6dce5, code: "EXT-GRIGIO" },
      { name: "Bianco Monocerus (Pearl White)", hex: 0xf5f7fa, code: "EXT-BIANCO" },
      { name: "Midnight Nero (Deep Black)", hex: 0x0a0b0e, code: "EXT-NERO" },
      { name: "Rosso Mars (Corse Red)", hex: 0xc40018, code: "EXT-ROSSO" },
      { name: "Blu Cepheus (Electric Sky)", hex: 0x0088ff, code: "EXT-BLU" },
      { name: "Grigio Lynx (Gunmetal Grey)", hex: 0x3b4048, code: "EXT-LYNX" },
      { name: "Oro Elios (Metallic Gold)", hex: 0xc89d3c, code: "EXT-ORO" },
      { name: "Verde Ithaca (Signal Green)", hex: 0x2fe31a, code: "EXT-VERDE" },
      { name: "Arancio Argos (Pearl Orange)", hex: 0xff4e00, code: "EXT-ARANCIO" }
    ];

    const container = document.getElementById("swatches-body-color");
    const nameLabel = document.getElementById("label-body-color");

    if (!container) return;

    colors.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = `swatch-btn ${idx === 0 ? "active" : ""}`;
      btn.style.backgroundColor = `#${c.hex.toString(16).padStart(6, "0")}`;
      btn.title = c.name;

      btn.addEventListener("click", () => {
        container.querySelectorAll(".swatch-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (nameLabel) nameLabel.textContent = c.name;
        this.applyBodyColor(c);
      });

      container.appendChild(btn);
    });
  }

  applyBodyColor(colorObj) {
    this.currentConfig.bodyColor = colorObj;
    if (window.app) {
      window.app.isAutoColorActive = false;
      const btn = document.getElementById("btn-autocolor-toggle");
      if (btn) btn.classList.remove("active");
    }

    const targetColor = new THREE.Color(colorObj.hex);

    if (this.car) {
      // 1. Direct model traversal for all body meshes
      if (this.car.model) {
        this.car.model.traverse((child) => {
          if (child.isMesh) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (mat && (mat.name === "Mt_Body" || mat === this.car.materials.body)) {
                gsap.to(mat.color, {
                  r: targetColor.r,
                  g: targetColor.g,
                  b: targetColor.b,
                  duration: 0.45,
                  ease: "power2.out"
                });
                mat.needsUpdate = true;
              }
            });
          }
        });
      }

      // 2. Primary body material
      if (this.car.materials && this.car.materials.body) {
        gsap.to(this.car.materials.body.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.45,
          ease: "power2.out"
        });
        this.car.materials.body.needsUpdate = true;
      }

      // 3. Body materials set
      if (this.car.bodyMaterials) {
        this.car.bodyMaterials.forEach((mat) => {
          gsap.to(mat.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.45,
            ease: "power2.out"
          });
          mat.needsUpdate = true;
        });
      }
    }

    this.showToast(`Paint Applied: ${colorObj.name}`);
    this.updateBuildCode();
  }

  initWheelStyles() {
    const styles = [
      { name: "Style 01 (Forged Monoblock)", index: 0, code: "WHL-S01" },
      { name: "Style 02 (Twin-Spoke Aero)", index: 1, code: "WHL-S02" },
      { name: "Style 03 (Carbon Lightweight)", index: 2, code: "WHL-S03" }
    ];

    const container = document.getElementById("options-wheel-style");
    if (!container) return;

    styles.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.className = `option-card-btn ${idx === 0 ? "active" : ""}`;
      btn.innerHTML = `
        <svg class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="10" stroke="#00d2ff"/>
          <circle cx="12" cy="12" r="4" stroke="#fff"/>
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#00d2ff"/>
        </svg>
        <span class="option-title">${s.name}</span>
      `;

      btn.addEventListener("click", () => {
        container.querySelectorAll(".option-card-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.applyWheelStyle(s);
      });

      container.appendChild(btn);
    });
  }

  applyWheelStyle(styleObj) {
    this.currentConfig.wheelStyle = styleObj;
    if (this.car) {
      this.car.setWheelStyle(styleObj.index);
    }
    this.showToast(`Wheel Selected: ${styleObj.name}`);
    this.updateBuildCode();
  }

  initWheelColors() {
    const finishes = [
      { name: "Satin Nero (Black)", hex: 0x111111, code: "WCLR-NERO" },
      { name: "Matte Titanium Grey", hex: 0x4b5259, code: "WCLR-TITAN" },
      { name: "Diamond Gloss Silver", hex: 0xd6d9dd, code: "WCLR-SILVER" },
      { name: "Hyper Champagne Gold", hex: 0xbfa15f, code: "WCLR-GOLD" }
    ];

    const container = document.getElementById("swatches-wheel-color");
    const nameLabel = document.getElementById("label-wheel-color");
    if (!container) return;

    finishes.forEach((f, idx) => {
      const btn = document.createElement("button");
      btn.className = `swatch-btn ${idx === 0 ? "active" : ""}`;
      btn.style.backgroundColor = `#${f.hex.toString(16).padStart(6, "0")}`;
      btn.title = f.name;

      btn.addEventListener("click", () => {
        container.querySelectorAll(".swatch-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (nameLabel) nameLabel.textContent = f.name;
        this.applyWheelColor(f);
      });

      container.appendChild(btn);
    });
  }

  applyWheelColor(finishObj) {
    this.currentConfig.wheelColor = finishObj;
    if (this.car && this.car.materials.wheels) {
      const targetColor = new THREE.Color(finishObj.hex);
      gsap.to(this.car.materials.wheels.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    this.showToast(`Wheel Finish: ${finishObj.name}`);
    this.updateBuildCode();
  }

  initCaliperColors() {
    const calipers = [
      { name: "Rosso Mars (Racing Red)", hex: 0xc40018, code: "CAL-ROSSO" },
      { name: "Giallo Modena (Yellow)", hex: 0xf5ba13, code: "CAL-GIALLO" },
      { name: "Nero Gloss (Black)", hex: 0x121212, code: "CAL-NERO" },
      { name: "Bianco Clean (White)", hex: 0xf0f2f5, code: "CAL-BIANCO" },
      { name: "Acid Green (Verde)", hex: 0x38e52e, code: "CAL-ACID" }
    ];

    const container = document.getElementById("swatches-caliper-color");
    const nameLabel = document.getElementById("label-caliper-color");
    if (!container) return;

    calipers.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = `swatch-btn ${idx === 0 ? "active" : ""}`;
      btn.style.backgroundColor = `#${c.hex.toString(16).padStart(6, "0")}`;
      btn.title = c.name;

      btn.addEventListener("click", () => {
        container.querySelectorAll(".swatch-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (nameLabel) nameLabel.textContent = c.name;
        this.applyCaliperColor(c);
      });

      container.appendChild(btn);
    });
  }

  applyCaliperColor(caliperObj) {
    this.currentConfig.caliperColor = caliperObj;
    if (this.car && this.car.materials.caliper) {
      const targetColor = new THREE.Color(caliperObj.hex);
      gsap.to(this.car.materials.caliper.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    this.showToast(`Brake Calipers: ${caliperObj.name}`);
    this.updateBuildCode();
  }

  initInteriorColors() {
    const interiors = [
      { name: "Nero Ade Alcantara", hex: 0x181a1f, code: "INT-NERO" },
      { name: "Tuscan Saddle Tan Leather", hex: 0x8b5a2b, code: "INT-TAN" },
      { name: "Rosso Alala Sport Red", hex: 0x7a0c16, code: "INT-ROSSO" }
    ];

    const container = document.getElementById("swatches-interior-color");
    const nameLabel = document.getElementById("label-interior-color");
    if (!container) return;

    interiors.forEach((int, idx) => {
      const btn = document.createElement("button");
      btn.className = `swatch-btn ${idx === 0 ? "active" : ""}`;
      btn.style.backgroundColor = `#${int.hex.toString(16).padStart(6, "0")}`;
      btn.title = int.name;

      btn.addEventListener("click", () => {
        container.querySelectorAll(".swatch-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (nameLabel) nameLabel.textContent = int.name;
        this.applyInteriorColor(int);
      });

      container.appendChild(btn);
    });
  }

  applyInteriorColor(interiorObj) {
    this.currentConfig.interiorColor = interiorObj;
    if (this.car && this.car.materials.interior) {
      const targetColor = new THREE.Color(interiorObj.hex);
      gsap.to(this.car.materials.interior.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    this.showToast(`Interior Trim: ${interiorObj.name}`);
    this.updateBuildCode();
  }

  initActionButtons() {
    const saveBtn = document.getElementById("btn-save-build");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        this.downloadBuildSummary();
      });
    }
  }

  downloadBuildSummary() {
    const buildSummary = `
===================================================
LAMBORGHINI AVENTADOR SVJ // BESPOKE SPECIFICATION
===================================================
Build Identification: ${this.getBuildCodeString()}
Date: ${new Date().toLocaleDateString()}

SPECIFICATIONS:
---------------------------------------------------
Powertrain: 6.5L Naturally Aspirated 60° V12
Power: 770 CV (566 kW) @ 8,500 RPM
Torque: 720 Nm @ 6,750 RPM
Transmission: 7-Speed Independent Shifting Rods (ISR)
Aerodynamics: ALA 2.0 (Aerodinamica Lamborghini Attiva)

CUSTOM CONFIGURATION:
---------------------------------------------------
Exterior Paint: ${this.currentConfig.bodyColor.name}
Wheel Specification: ${this.currentConfig.wheelStyle.name}
Wheel Finish: ${this.currentConfig.wheelColor.name}
Brake Calipers: ${this.currentConfig.caliperColor.name}
Cockpit Upholstery: ${this.currentConfig.interiorColor.name}
Aero Wing: SVJ Carbon High-Downforce Airfoil

===================================================
AUTOMOBILI LAMBORGHINI S.P.A. // AD PERSONAM
===================================================
    `.trim();

    const blob = new Blob([buildSummary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aventador_SVJ_${this.currentConfig.bodyColor.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast("Bespoke Build Sheet Downloaded");
  }

  getBuildCodeString() {
    const c = this.currentConfig;
    return `SVJ63 // ${c.bodyColor.code} / ${c.wheelStyle.code} / ${c.wheelColor.code} / ${c.caliperColor.code} / ${c.interiorColor.code}`;
  }

  updateBuildCode() {
    const el = document.getElementById("build-code-value");
    if (el) {
      el.textContent = this.getBuildCodeString();
    }
  }

  showToast(message) {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("active");

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("active");
    }, 2800);
  }
}

window.ConfiguratorController = ConfiguratorController;
