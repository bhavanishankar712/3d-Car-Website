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
    this.scene.add(this.carGroup);

    this.model = null;
    this.materials = {};
    this.meshRegistry = {};
    this.originalTransforms = new Map();
    this.wheels = {
      FL: {}, FR: {}, RL: {}, RR: {}
    };

    this.isLoaded = false;
  }

  load(modelPath, onProgress, onLoad, onError) {
    const loader = new THREE.GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
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
      },
      (xhr) => {
        if (xhr.lengthComputable && onProgress) {
          const percent = (xhr.loaded / xhr.total) * 100;
          onProgress(percent);
        }
      },
      (err) => {
        console.error("Error loading car model:", err);
        if (onError) onError(err);
      }
    );
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
            mat.color.setHex(0xd6dce5); // Pearlescent Grigio Titans Silver
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

  setHeadlightsState(isOn) {
    if (this.materials.headlights) {
      if (isOn) {
        this.materials.headlights.emissive.setHex(0xd8f2ff);
        this.materials.headlights.emissiveIntensity = 2.8;
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
}

window.CarController = CarController;
