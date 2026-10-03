/**
 * ============================================================================
 * AVENTADOR SVJ // STUDIO LIGHTING RIG & DYNAMIC HEADLIGHT SYSTEM
 * Manages key, fill, rim studio lights, realistic headlights with volumetric
 * beams and ground illumination, and Day/Night mode transitions.
 * ============================================================================
 */

class LightingController {
  constructor(scene, showroomCtrl = null) {
    this.scene = scene;
    this.showroomCtrl = showroomCtrl;
    this.lightsGroup = new THREE.Group();
    this.lightsGroup.name = "LightingRig";
    this.scene.add(this.lightsGroup);

    this.headlightsOn = true;
    this.isNightMode = true; // Dark cinematic showroom by default

    this.initStudioLights();
    this.initHeadlightsSystem();
    this.applyMode(this.isNightMode, 0);
  }

  initStudioLights() {
    // 1. Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x0e131d, 0.45);
    this.lightsGroup.add(this.ambientLight);

    // 2. Main Key Directional Light (Casts soft contact shadows)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.keyLight.position.set(10, 16, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 40;
    this.keyLight.shadow.bias = -0.00015;
    const d = 7.0;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.lightsGroup.add(this.keyLight);

    // 3. Fill Light (Cool automotive cyan tint)
    this.fillLight = new THREE.DirectionalLight(0x70aaff, 0.85);
    this.fillLight.position.set(-12, 10, -10);
    this.lightsGroup.add(this.fillLight);

    // 4. Overhead Softbox Bank Light
    this.overheadLight = new THREE.DirectionalLight(0xffffff, 1.1);
    this.overheadLight.position.set(0, 18, 0);
    this.lightsGroup.add(this.overheadLight);

    // 5. Rear Rim Light (Sculpts the SVJ rear wing and rear haunches)
    this.rimLight = new THREE.DirectionalLight(0x00d2ff, 1.4);
    this.rimLight.position.set(14, 5, -8);
    this.lightsGroup.add(this.rimLight);

    // 6. Floor Underglow Point Light
    this.underglowLight = new THREE.PointLight(0x00d2ff, 0.8, 14);
    this.underglowLight.position.set(0, 0.15, 0);
    this.lightsGroup.add(this.underglowLight);
  }

  initHeadlightsSystem() {
    this.headlightsGroup = new THREE.Group();
    this.headlightsGroup.name = "HeadlightsGroup";
    this.lightsGroup.add(this.headlightsGroup);

    // Targets pointing forward (-X)
    const leftTarget = new THREE.Object3D();
    leftTarget.position.set(-14, 0, 0.85);
    this.headlightsGroup.add(leftTarget);

    const rightTarget = new THREE.Object3D();
    rightTarget.position.set(-14, 0, -0.85);
    this.headlightsGroup.add(rightTarget);

    // Left Spotlight
    this.leftSpot = new THREE.SpotLight(0xdcf0ff, 4.5);
    this.leftSpot.position.set(-2.3, 0.62, 0.75);
    this.leftSpot.target = leftTarget;
    this.leftSpot.angle = Math.PI / 6.5;
    this.leftSpot.penumbra = 0.55;
    this.leftSpot.decay = 1.3;
    this.leftSpot.distance = 28;
    this.leftSpot.castShadow = true;
    this.headlightsGroup.add(this.leftSpot);

    // Right Spotlight
    this.rightSpot = new THREE.SpotLight(0xdcf0ff, 4.5);
    this.rightSpot.position.set(-2.3, 0.62, -0.75);
    this.rightSpot.target = rightTarget;
    this.rightSpot.angle = Math.PI / 6.5;
    this.rightSpot.penumbra = 0.55;
    this.rightSpot.decay = 1.3;
    this.rightSpot.distance = 28;
    this.rightSpot.castShadow = true;
    this.headlightsGroup.add(this.rightSpot);

    // Volumetric Beam Cones (projecting forward and down towards the floor)
    this.beamCones = [];
    const beamGeo = new THREE.ConeGeometry(0.75, 6.5, 32, 1, true);
    beamGeo.translate(0, -3.25, 0); // Tip at (0, 0, 0)
    beamGeo.rotateX(-Math.PI / 2);  // Orient cone along +Z forward vector for lookAt

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xa0e0ff,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const leftBeam = new THREE.Mesh(beamGeo, beamMat.clone());
    leftBeam.position.set(-2.3, 0.62, 0.75);
    leftBeam.lookAt(leftTarget.position);
    this.headlightsGroup.add(leftBeam);
    this.beamCones.push(leftBeam);

    const rightBeam = new THREE.Mesh(beamGeo, beamMat.clone());
    rightBeam.position.set(-2.3, 0.62, -0.75);
    rightBeam.lookAt(rightTarget.position);
    this.headlightsGroup.add(rightBeam);
    this.beamCones.push(rightBeam);

    // Ground Illumination Light Pools
    const poolGeo = new THREE.CircleGeometry(1.8, 32);
    poolGeo.rotateX(-Math.PI / 2);
    const poolMat = new THREE.MeshBasicMaterial({
      color: 0x77ccff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.leftPool = new THREE.Mesh(poolGeo, poolMat.clone());
    this.leftPool.position.set(-6.5, 0.015, 0.85);
    this.leftPool.scale.set(1.4, 1.0, 2.2);
    this.headlightsGroup.add(this.leftPool);

    this.rightPool = new THREE.Mesh(poolGeo, poolMat.clone());
    this.rightPool.position.set(-6.5, 0.015, -0.85);
    this.rightPool.scale.set(1.4, 1.0, 2.2);
    this.headlightsGroup.add(this.rightPool);
  }

  setHeadlights(on, duration = 0.5) {
    this.headlightsOn = on;

    const targetIntensity = on ? 4.5 : 0.0;
    const targetBeamOpacity = on ? 0.07 : 0.0;
    const targetPoolOpacity = on ? 0.35 : 0.0;

    gsap.to(this.leftSpot, { intensity: targetIntensity, duration: duration, ease: "power2.out" });
    gsap.to(this.rightSpot, { intensity: targetIntensity, duration: duration, ease: "power2.out" });

    this.beamCones.forEach((cone) => {
      gsap.to(cone.material, { opacity: targetBeamOpacity, duration: duration, ease: "power2.out" });
    });

    gsap.to(this.leftPool.material, { opacity: targetPoolOpacity, duration: duration, ease: "power2.out" });
    gsap.to(this.rightPool.material, { opacity: targetPoolOpacity, duration: duration, ease: "power2.out" });
  }

  toggleHeadlights() {
    this.setHeadlights(!this.headlightsOn);
    return this.headlightsOn;
  }

  setDayNight(isNight, duration = 1.0) {
    this.isNightMode = isNight;
    this.applyMode(isNight, duration);
    return this.isNightMode;
  }

  toggleDayNight() {
    return this.setDayNight(!this.isNightMode);
  }

  applyMode(isNight, duration = 0.8) {
    if (this.showroomCtrl) {
      this.showroomCtrl.setDayNight(isNight, duration);
    }

    if (isNight) {
      gsap.to(this.ambientLight, { intensity: 0.45, duration });
      gsap.to(this.keyLight, { intensity: 1.8, duration });
      gsap.to(this.fillLight, { intensity: 0.85, duration });
      gsap.to(this.overheadLight, { intensity: 1.1, duration });
      gsap.to(this.rimLight, { intensity: 1.4, duration });
      gsap.to(this.underglowLight, { intensity: 0.8, duration });

      if (this.scene.fog) {
        gsap.to(this.scene.fog.color, { r: 0.024, g: 0.032, b: 0.045, duration });
      }
    } else {
      gsap.to(this.ambientLight, { intensity: 1.4, duration });
      gsap.to(this.keyLight, { intensity: 2.8, duration });
      gsap.to(this.fillLight, { intensity: 1.4, duration });
      gsap.to(this.overheadLight, { intensity: 1.8, duration });
      gsap.to(this.rimLight, { intensity: 0.9, duration });
      gsap.to(this.underglowLight, { intensity: 0.2, duration });

      if (this.scene.fog) {
        gsap.to(this.scene.fog.color, { r: 0.12, g: 0.15, b: 0.2, duration });
      }
    }
  }
}

window.LightingController = LightingController;
