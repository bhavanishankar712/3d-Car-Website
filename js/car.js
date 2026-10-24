/**
 * ============================================================================
 * AVENTADOR SVJ // CAR MODEL & MATERIAL CONTROLLER
 * Loads GLB model, applies high-end PBR materials, adds SVJ aerodynamic wing,
 * and maintains mesh registries for explosion and configurator.
 * ============================================================================
 */

class CarController {
  constructor(scene) {
    this.scene = scene;
    this.carGroup = new THREE.Group();
    this.carGroup.name = "CarRoot";
    // Scale carGroup to elegant, beautifully proportioned supercar showroom scale
    this.carGroup.scale.set(0.86, 0.86, 0.86);
    this.scene.add(this.carGroup);

    this.model = null;
    this.materials = {};
    this.bodyMaterials = new Set();
    this.meshRegistry = {};
    this.originalTransforms = new Map();
    this.wheels = {
      FL: {}, FR: {}, RL: {}, RR: {}
    };

    this.isLoaded = false;
  }

  load(modelPath, onProgress, onLoad, onError) {
    const loader = new THREE.GLTFLoader();

    const onModelLoaded = (gltf) => {
      this.model = gltf.scene;
      this.model.name = "AventadorModel";

      // 1. Remove raw shadow plane from model hierarchy before calculating bounds
      const shadow = this.model.getObjectByName("Obj_Shadow_Plane");
      if (shadow && shadow.parent) {
        shadow.parent.remove(shadow);
      }

      // 2. Scale car to authentic real-world supercar dimensions (length ~5.4m)
      this.model.scale.set(0.2, 0.2, 0.2);
      this.model.position.set(0, 0, 0);
      this.model.updateMatrixWorld(true);

      // 3. Compute accurate bounding box of pure car geometry
      const box = new THREE.Box3().setFromObject(this.model);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // 4. Center horizontally at (0, y, 0) and ground bottom of tires cleanly at Y = 0
      this.model.position.set(-center.x, -box.min.y, -center.z);
      this.model.updateMatrixWorld(true);

      // 5. Add model to car root group
      this.carGroup.add(this.model);

      // 6. Setup materials, registries, and SVJ Aerodynamic Wing
      this.processMaterialsAndMeshes();
      this.createSVJAeroWing();

      // 7. Cache initial transforms for mechanical explosion & reassembly
      this.cacheInitialTransforms();

      this.isLoaded = true;
      if (onLoad) onLoad(this);
    };

    // Priority 1: High-Speed Direct Binary Fetch (instant on HTTP/HTTPS ~60ms)
    const doFetchLoad = () => {
      loader.load(
        modelPath,
        (gltf) => onModelLoaded(gltf),
        (xhr) => {
          if (xhr.lengthComputable && onProgress) {
            const percent = (xhr.loaded / xhr.total) * 100;
            onProgress(percent);
          }
        },
        (err) => {
          console.warn("Direct binary fetch failed, attempting Base64 fallback:", err);
          if (window.CAR_MODEL_BASE64) {
            doBase64Parse();
          } else if (onError) {
            onError(err);
          }
        }
      );
    };

    // Priority 2: In-memory Base64 decoder for pure file:// standalone execution
    const doBase64Parse = () => {
      if (!window.CAR_MODEL_BASE64) {
        if (onError) onError(new Error("No model data available"));
        return;
      }
      try {
        if (onProgress) onProgress(45);
        const binary_string = window.atob(window.CAR_MODEL_BASE64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        if (onProgress) onProgress(85);
        loader.parse(
          bytes.buffer,
          '',
          (gltf) => {
            if (onProgress) onProgress(100);
            onModelLoaded(gltf);
          },
          (err) => {
            console.error("Base64 GLTF parse error:", err);
            if (onError) onError(err);
          }
        );
      } catch (e) {
        console.error("Error decoding Base64 model:", e);
        if (onError) onError(e);
      }
    };

    // When running under HTTP/HTTPS local or production server, use lightning fast binary fetch
    if (window.location.protocol === 'file:' && window.CAR_MODEL_BASE64) {
      doBase64Parse();
    } else {
      doFetchLoad();
    }
  }

  processMaterialsAndMeshes() {
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Traverse mesh materials and enhance with PBR parameters
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (!mat) return;
          const matName = mat.name;

          if (matName === "Mt_Body") {
            // Exterior Paint: Clearcoat car paint matching reference image
            this.materials.body = mat;
            this.bodyMaterials.add(mat);
            if (window.app && window.app.configCtrl && window.app.configCtrl.currentConfig && window.app.configCtrl.currentConfig.bodyColor) {
              mat.color.setHex(window.app.configCtrl.currentConfig.bodyColor.hex);
            } else {
              mat.color.setHex(0xd6dce5); // Pearlescent Grigio Titans Silver
            }
            mat.metalness = 0.82;
            mat.roughness = 0.2;
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.04;
            mat.needsUpdate = true;
          } else if (matName === "Mt_MirrorCover") {
            // Side Mirror Caps: Carbon Black matching reference photo
            mat.color.setHex(0x15171b);
            mat.roughness = 0.3;
            mat.metalness = 0.7;
            mat.needsUpdate = true;
          } else if (matName === "Mt_Light_Emissive") {
            // Headlights: Signature Y-pattern high-intensity glow
            this.materials.headlights = mat;
            mat.color.setHex(0xffffff);
            mat.emissive.setHex(0xd8f2ff);
            mat.emissiveIntensity = 2.8;
            mat.needsUpdate = true;
          } else if (matName === "Mt_AlloyWheels") {
            // Wheels / Rims: Satin Black
            this.materials.wheels = mat;
            mat.color.setHex(0x151618);
            mat.metalness = 0.85;
            mat.roughness = 0.35;
            mat.needsUpdate = true;
          } else if (matName === "Mt_BrakeCaliper") {
            // Calipers: Rosso Mars Racing Red
            this.materials.caliper = mat;
            mat.color.setHex(0xc40018);
            mat.metalness = 0.75;
            mat.roughness = 0.25;
            mat.needsUpdate = true;
          } else if (matName === "Mt_Interior_Black") {
            // Interior: Nero Ade Alcantara
            this.materials.interior = mat;
            mat.color.setHex(0x181a1f);
            mat.roughness = 0.85;
            mat.needsUpdate = true;
          } else if (matName.includes("WindScreens") || matName.includes("Glass")) {
            // Tinted Glass
            mat.transparent = true;
            mat.opacity = 0.75;
            mat.roughness = 0.04;
            mat.metalness = 0.1;
            mat.needsUpdate = true;
          }
        });
      }

      // Catalog nodes by exact name for explosion & configurator
      if (child.name) {
        this.meshRegistry[child.name] = child;
      }
    });

    // Configure wheels: default show Rim Type A, hide Rim Type B
    ["FL", "FR", "RL", "RR"].forEach((corner) => {
      const rimA = this.meshRegistry[`Obj_Rim_T0A_${corner}`];
      const rimB = this.meshRegistry[`Obj_Rim_T0B_${corner}`];
      if (rimA) rimA.visible = true;
      if (rimB) rimB.visible = false;
    });
  }

  createSVJAeroWing() {
    // Carbon fiber material for the aerodynamic wing
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.32,
      metalness: 0.65
    });

    const wingGroup = new THREE.Group();
    wingGroup.name = "Obj_SVJ_AeroWing";

    // 1. Carbon Fiber Main Airfoil Blade (Width: 1.72m, Depth: 0.32m)
    const bladeGeo = new THREE.BoxGeometry(0.32, 0.035, 1.72);
    const bladeMesh = new THREE.Mesh(bladeGeo, carbonMat);
    bladeMesh.position.set(0, 0.28, 0);
    bladeMesh.rotation.z = -0.06; // slight aerodynamic angle of attack
    bladeMesh.castShadow = true;
    wingGroup.add(bladeMesh);

    // 2. Vertical Endplates
    const endplateGeo = new THREE.BoxGeometry(0.38, 0.22, 0.02);
    const endplateL = new THREE.Mesh(endplateGeo, carbonMat);
    endplateL.position.set(0, 0.28, 0.86);
    endplateL.castShadow = true;
    wingGroup.add(endplateL);

    const endplateR = new THREE.Mesh(endplateGeo, carbonMat);
    endplateR.position.set(0, 0.28, -0.86);
    endplateR.castShadow = true;
    wingGroup.add(endplateR);

    // 3. Swan-neck Aerodynamic Support Struts
    const strutGeo = new THREE.BoxGeometry(0.12, 0.32, 0.035);
    const strutL = new THREE.Mesh(strutGeo, carbonMat);
    strutL.position.set(-0.06, 0.14, 0.42);
    strutL.rotation.z = 0.28;
    strutL.castShadow = true;
    wingGroup.add(strutL);

    const strutR = new THREE.Mesh(strutGeo, carbonMat);
    strutR.position.set(-0.06, 0.14, -0.42);
    strutR.rotation.z = 0.28;
    strutR.castShadow = true;
    wingGroup.add(strutR);

    // 4. Central Shark Fin (Signature SVJ Aero Element)
    const finGeo = new THREE.BoxGeometry(0.48, 0.26, 0.02);
    const finMesh = new THREE.Mesh(finGeo, carbonMat);
    finMesh.position.set(-0.16, 0.2, 0);
    finMesh.castShadow = true;
    wingGroup.add(finMesh);

    // Position wing on the rear deck of the Aventador (+X = 1.78m, Y = 1.12m)
    wingGroup.position.set(1.78, 1.12, 0);
    this.carGroup.add(wingGroup);
    this.meshRegistry["Obj_SVJ_AeroWing"] = wingGroup;
  }

  cacheInitialTransforms() {
    this.carGroup.traverse((node) => {
      if (node.name) {
        this.originalTransforms.set(node.name, {
          position: node.position.clone(),
          rotation: node.rotation.clone(),
          scale: node.scale.clone()
        });
      }
    });
  }

  setHeadlightsState(isOn, intensity = null) {
    if (this.materials.headlights) {
      if (isOn) {
        this.materials.headlights.emissive.setHex(0xd8f2ff);
        this.materials.headlights.emissiveIntensity = intensity !== null ? intensity : 2.8;
      } else {
        this.materials.headlights.emissive.setHex(0x11161d);
        this.materials.headlights.emissiveIntensity = 0.05;
      }
    }
  }

  setWheelStyle(styleIndex) {
    ["FL", "FR", "RL", "RR"].forEach((corner) => {
      const rimA = this.meshRegistry[`Obj_Rim_T0A_${corner}`];
      const rimB = this.meshRegistry[`Obj_Rim_T0B_${corner}`];

      if (styleIndex === 0) {
        if (rimA) rimA.visible = true;
        if (rimB) rimB.visible = false;
        if (this.materials.wheels) {
          this.materials.wheels.roughness = 0.35;
          this.materials.wheels.metalness = 0.85;
        }
      } else if (styleIndex === 1) {
        if (rimA) rimA.visible = false;
        if (rimB) rimB.visible = true;
        if (this.materials.wheels) {
          this.materials.wheels.roughness = 0.25;
          this.materials.wheels.metalness = 0.9;
        }
      } else if (styleIndex === 2) {
        if (rimA) rimA.visible = true;
        if (rimB) rimB.visible = false;
        if (this.materials.wheels) {
          this.materials.wheels.roughness = 0.45;
          this.materials.wheels.metalness = 0.65;
        }
      }
    });
  }

  // 1. Wheel Rolling Rotation for Fleet Track Mode
  rotateWheels(delta, speed = 8.5) {
    const angle = delta * speed;
    const wheelNames = [
      "Obj_Rim_T0A_FL", "Obj_Rim_T0B_FL", "Obj_Tyre_FL",
      "Obj_Rim_T0A_FR", "Obj_Rim_T0B_FR", "Obj_Tyre_FR",
      "Obj_Rim_T0A_RL", "Obj_Rim_T0B_RL", "Obj_Tyre_RL",
      "Obj_Rim_T0A_RR", "Obj_Rim_T0B_RR", "Obj_Tyre_RR"
    ];
    wheelNames.forEach((name) => {
      const mesh = this.meshRegistry[name];
      if (mesh) {
        mesh.rotation.z += angle;
      }
    });
  }

  // 2. Dihedral Scissor Door Animation (74° Upward Pivot)
  setScissorDoorProgress(t) {
    this.scissorDoorProgress = t; // 0 (closed) to 1 (full open)
    const doorNodes = ["Obj_Side_Doors", "Obj_Doors_UpperFrame"];
    doorNodes.forEach((name) => {
      const node = this.meshRegistry[name];
      const orig = this.originalTransforms.get(name);
      if (node && orig) {
        node.position.x = orig.position.x - 0.22 * t;
        node.position.y = orig.position.y + 0.88 * t;
        node.position.z = orig.position.z + 0.42 * t;
        node.rotation.x = orig.rotation.x + 0.08 * t;
        node.rotation.y = orig.rotation.y + 0.18 * t;
        node.rotation.z = orig.rotation.z + 0.74 * t;
      }
    });
  }

  // 3. SVJ Aerodynamic Wing Angle of Attack
  setSVJAeroWingAngle(angleRad) {
    const wing = this.meshRegistry["Obj_SVJ_AeroWing"];
    if (wing) {
      wing.rotation.z = angleRad;
    }
  }

  // 4. Aerodynamic Suspension Squat
  setSuspensionSquat(yOffset) {
    if (this.model) {
      if (this.baseModelY === undefined) {
        this.baseModelY = this.model.position.y;
      }
      this.model.position.y = this.baseModelY + yOffset;
    }
  }

  // 5. Physical Engine V12 Chassis Harmonic Vibration
  setEngineVibration(intensity, elapsed, baseY = 0, basePitch = 0) {
    if (this.carGroup && this.isLoaded) {
      if (intensity > 0.001) {
        const freq = 42.0;
        const vibY = Math.sin(elapsed * freq) * 0.012 * intensity;
        const vibPitch = Math.sin(elapsed * freq * 1.3) * 0.006 * intensity;
        const vibRoll = Math.cos(elapsed * freq * 0.85) * 0.005 * intensity;
        this.carGroup.position.y = baseY + vibY;
        this.carGroup.rotation.x = basePitch + vibPitch;
        this.carGroup.rotation.z = vibRoll;
      } else {
        this.carGroup.position.y = baseY;
        this.carGroup.rotation.x = basePitch;
        this.carGroup.rotation.z = 0;
      }
    }
  }

  // Set exterior body paint color directly (RGB 0.0-1.0)
  setBodyColorRGB(r, g, b, roughness = null, metalness = null) {
    if (this.materials.body) {
      this.materials.body.color.setRGB(r, g, b);
      if (roughness !== null) this.materials.body.roughness = roughness;
      if (metalness !== null) this.materials.body.metalness = metalness;
      this.materials.body.needsUpdate = true;
    }
    if (this.bodyMaterials) {
      this.bodyMaterials.forEach((m) => {
        m.color.setRGB(r, g, b);
        if (roughness !== null) m.roughness = roughness;
        if (metalness !== null) m.metalness = metalness;
        m.needsUpdate = true;
      });
    }
  }

  // Set exterior body paint color via Hex
  setBodyColorHex(hex) {
    if (this.materials.body) {
      this.materials.body.color.setHex(hex);
      this.materials.body.needsUpdate = true;
    }
    if (this.bodyMaterials) {
      this.bodyMaterials.forEach((m) => {
        m.color.setHex(hex);
        m.needsUpdate = true;
      });
    }
  }

  // Set brake caliper color via Hex
  setCaliperColorHex(hex) {
    if (this.materials.caliper) {
      this.materials.caliper.color.setHex(hex);
    }
  }

  // 6. Fleet Supercar Livery Morphing
  setFleetModel(modelKey) {
    const fleetSpecs = {
      svj: {
        name: "Aventador SVJ 63",
        color: 0xd6dce5,
        roughness: 0.20,
        metalness: 0.82,
        clearcoat: 1.0,
        caliper: 0xc40018,
        wheelStyle: 0
      },
      revuelto: {
        name: "Revuelto V12 HPEV",
        color: 0xff5500,
        roughness: 0.16,
        metalness: 0.88,
        clearcoat: 1.0,
        caliper: 0xffcc00,
        wheelStyle: 1
      },
      sto: {
        name: "Huracán STO Track Edition",
        color: 0x0088ff,
        roughness: 0.14,
        metalness: 0.85,
        clearcoat: 1.0,
        caliper: 0xff3b00,
        wheelStyle: 1
      },
      urus: {
        name: "Urus Performante",
        color: 0xffc400,
        roughness: 0.22,
        metalness: 0.80,
        clearcoat: 1.0,
        caliper: 0x151618,
        wheelStyle: 0
      },
      sian: {
        name: "Sián FKP 37 Hypercar",
        color: 0x485848,
        roughness: 0.35,
        metalness: 0.75,
        clearcoat: 0.8,
        caliper: 0xd4af37,
        wheelStyle: 2
      }
    };

    const spec = fleetSpecs[modelKey] || fleetSpecs.svj;
    if (this.materials.body && typeof gsap !== "undefined") {
      gsap.to(this.materials.body.color, {
        r: ((spec.color >> 16) & 255) / 255,
        g: ((spec.color >> 8) & 255) / 255,
        b: (spec.color & 255) / 255,
        duration: 0.75,
        ease: "power2.out"
      });
      this.materials.body.roughness = spec.roughness;
      this.materials.body.metalness = spec.metalness;
      this.materials.body.clearcoat = spec.clearcoat;
      this.materials.body.needsUpdate = true;
    }

    if (this.materials.caliper) {
      this.materials.caliper.color.setHex(spec.caliper);
      this.materials.caliper.needsUpdate = true;
    }

    this.setWheelStyle(spec.wheelStyle);
    this.triggerStrobeSequence();

    return spec;
  }

  // 7. Signature High-Beam Strobe Flash
  triggerStrobeSequence() {
    if (this.materials.headlights && typeof gsap !== "undefined") {
      const origIntensity = 2.8;
      gsap.timeline()
        .to(this.materials.headlights, { emissiveIntensity: 5.5, duration: 0.08 })
        .to(this.materials.headlights, { emissiveIntensity: 0.8, duration: 0.08 })
        .to(this.materials.headlights, { emissiveIntensity: 5.5, duration: 0.08 })
        .to(this.materials.headlights, { emissiveIntensity: origIntensity, duration: 0.2 });
    }
  }

  // 8. Cockpit Ad Personam Accent Lighting
  setCockpitAccent(themeKey) {
    const themes = {
      giallo: 0xffcc00,
      rosso: 0xff2a44,
      cyan: 0x00d2ff,
      verde: 0x00ff88
    };
    const color = themes[themeKey] || 0xffcc00;
    if (this.materials.interior) {
      this.materials.interior.emissive = new THREE.Color(color);
      this.materials.interior.emissiveIntensity = 0.35;
      this.materials.interior.needsUpdate = true;
    }
  }
}

window.CarController = CarController;
