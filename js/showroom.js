/**
 * ============================================================================
 * AVENTADOR SVJ // CINEMATIC AUTOMOTIVE SHOWROOM ARCHITECTURE
 * Builds a high-end luxury digital automotive showroom pavilion:
 * - High-gloss polished epoxy showroom tile floor with realistic reflections
 * - Centerpiece motorized turntable dais with dual glowing LED guide rings
 * - Curved architectural showroom walls with vertical LED light columns
 * - Feature backdrop wall with illuminated Lamborghini Centro Stile plaque
 * - Overhead studio softbox lightboxes casting authentic reflections on car paint
 * - Recessed ceiling downlights & architectural cove light channels
 * - Dynamic Day / Night mode showroom lighting transitions
 * ============================================================================
 */

class ShowroomController {
  constructor(scene, renderer, pmremGenerator) {
    this.scene = scene;
    this.renderer = renderer;
    this.pmremGenerator = pmremGenerator;

    this.showroomGroup = new THREE.Group();
    this.showroomGroup.name = "AutomotiveShowroom";
    this.scene.add(this.showroomGroup);

    this.isNightMode = true;
    this.emissiveMaterials = [];
    this.downlightSpots = [];

    this.initShowroomFloor();
    this.initTurntableDais();
    this.initArchitecturalWalls();
    this.initFeatureBackdrop();
    this.initStudioSoftboxes();
    this.initCeilingGrid();
    this.initShowroomSpotlights();
    this.generateShowroomEnvMap();
  }

  /* ==========================================================================
     1. HIGH-GLOSS LUXURY SHOWROOM TILE FLOOR
     ========================================================================== */
  initShowroomFloor() {
    // Generate high-resolution luxury showroom floor tile texture
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // Dark luxury graphite showroom base
    ctx.fillStyle = "#090d14";
    ctx.fillRect(0, 0, 1024, 1024);

    const tileSize = 256; // 4x4 tiles per texture block
    const tilesCount = 1024 / tileSize;

    for (let x = 0; x < tilesCount; x++) {
      for (let y = 0; y < tilesCount; y++) {
        const px = x * tileSize;
        const py = y * tileSize;

        // Subtle tonal variation between luxury showroom tiles
        const toneVar = ((x * 7 + y * 13) % 9) * 0.008;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.012 + toneVar})`;
        ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);

        // Very fine luxury tile expansion joint seam (2px dark slate)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);

        // Micro terrazzo specular grain inside tile
        ctx.fillStyle = "rgba(0, 210, 255, 0.008)";
        ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
      }
    }

    const floorTex = new THREE.CanvasTexture(canvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(16, 16); // Seamlessly spans the 64m x 64m showroom hall
    floorTex.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 16);

    const floorGeo = new THREE.PlaneGeometry(68, 68, 32, 32);
    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTex,
      color: 0x0c111a,
      roughness: 0.12,    // Ultra-glossy wet showroom epoxy reflection
      metalness: 0.55,    // Reflects overhead softboxes and vehicle
      envMapIntensity: 1.45,
      depthWrite: true
    });

    const floorMesh = new THREE.Mesh(floorGeo, this.floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0.0;
    floorMesh.receiveShadow = true;
    this.showroomGroup.add(floorMesh);
  }

  /* ==========================================================================
     2. CENTERPIECE MOTORIZED TURNTABLE DAIS
     ========================================================================== */
  initTurntableDais() {
    this.turntableGroup = new THREE.Group();
    this.showroomGroup.add(this.turntableGroup);

    // 1. Flush circular turntable platform (Radius: 5.8m)
    const daisGeo = new THREE.CylinderGeometry(5.8, 5.85, 0.012, 96);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x0d121c,
      roughness: 0.20,
      metalness: 0.85,
      envMapIntensity: 1.4
    });
    const daisMesh = new THREE.Mesh(daisGeo, daisMat);
    daisMesh.position.y = 0.001;
    daisMesh.receiveShadow = true;
    this.turntableGroup.add(daisMesh);

    // 2. Beveled Outer Perimeter LED Guide Ring
    const outerRingGeo = new THREE.RingGeometry(5.72, 5.82, 96);
    this.turntableLedMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    this.emissiveMaterials.push({ mat: this.turntableLedMat, baseNight: 0.95, baseDay: 0.35 });

    const outerRing = new THREE.Mesh(outerRingGeo, this.turntableLedMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.0075;
    this.turntableGroup.add(outerRing);

    // 3. Inner Concentric Technical Guide Track (Radius: 3.8m)
    const innerRingGeo = new THREE.RingGeometry(3.78, 3.82, 96);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.emissiveMaterials.push({ mat: innerRingMat, baseNight: 0.35, baseDay: 0.15 });

    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.0075;
    this.turntableGroup.add(innerRing);

    // 4. Technical Alignment Markers (Cardinal directions at 0°, 90°, 180°, 270°)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const markerGeo = new THREE.PlaneGeometry(0.35, 0.04);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.rotation.x = -Math.PI / 2;
      marker.rotation.z = angle;
      marker.position.set(Math.cos(angle) * 5.65, 0.008, Math.sin(angle) * 5.65);
      this.turntableGroup.add(marker);
    }

    // 5. Multi-Layer Contact Shadow Under Car
    const shadowGeo = new THREE.PlaneGeometry(6.2, 3.2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    const sGrad = sCtx.createRadialGradient(256, 128, 40, 256, 128, 240);
    sGrad.addColorStop(0, "rgba(0, 0, 0, 0.98)");
    sGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.88)");
    sGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.4)");
    sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.009, 0);
    this.turntableGroup.add(contactShadow);
  }

  /* ==========================================================================
     3. CURVED SHOWROOM ARCHITECTURAL WALLS & PILLARS
     ========================================================================== */
  initArchitecturalWalls() {
    this.wallsGroup = new THREE.Group();
    this.showroomGroup.add(this.wallsGroup);

    // 1. Curved Showroom Hall Enclosure (Radius: 28m, Height: 14m)
    const wallGeo = new THREE.CylinderGeometry(28, 28, 14, 64, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.78,
      metalness: 0.28,
      side: THREE.BackSide
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = 7.0;
    this.wallsGroup.add(wallMesh);

    // 2. Baseboard Recessed LED Cove Lighting (Horizontal ring around perimeter)
    const baseCoveGeo = new THREE.CylinderGeometry(27.88, 27.88, 0.08, 64, 1, true);
    const baseCoveMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.55
    });
    this.emissiveMaterials.push({ mat: baseCoveMat, baseNight: 0.55, baseDay: 0.2 });
    const baseCoveMesh = new THREE.Mesh(baseCoveGeo, baseCoveMat);
    baseCoveMesh.position.y = 0.08;
    this.wallsGroup.add(baseCoveMesh);

    // 3. Header Recessed LED Cove Lighting (At ceiling junction, Y = 13.9m)
    const topCoveGeo = new THREE.CylinderGeometry(27.88, 27.88, 0.1, 64, 1, true);
    const topCoveMat = new THREE.MeshBasicMaterial({
      color: 0xc8e6ff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.45
    });
    this.emissiveMaterials.push({ mat: topCoveMat, baseNight: 0.45, baseDay: 0.3 });
    const topCoveMesh = new THREE.Mesh(topCoveGeo, topCoveMat);
    topCoveMesh.position.y = 13.85;
    this.wallsGroup.add(topCoveMesh);

    // 4. 8 Architectural Structural Columns with Vertical LED Slits
    const pillarCount = 8;
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i * 2 * Math.PI) / pillarCount;
      const rad = 27.2;
      const px = Math.cos(angle) * rad;
      const pz = Math.sin(angle) * rad;

      // Dark satin composite column
      const colGeo = new THREE.BoxGeometry(0.9, 13.8, 0.9);
      const colMat = new THREE.MeshStandardMaterial({
        color: 0x0e1420,
        roughness: 0.65,
        metalness: 0.4
      });
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(px, 6.9, pz);
      colMesh.lookAt(0, 6.9, 0);
      this.wallsGroup.add(colMesh);

      // Embedded Vertical LED Light Channel on front face
      const stripGeo = new THREE.PlaneGeometry(0.08, 12.0);
      const stripMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.82
      });
      this.emissiveMaterials.push({ mat: stripMat, baseNight: 0.82, baseDay: 0.4 });

      const stripMesh = new THREE.Mesh(stripGeo, stripMat);
      stripMesh.position.set(0, 0, 0.46);
      colMesh.add(stripMesh);
    }
  }

  /* ==========================================================================
     4. SHOWROOM FEATURE WALL & CENTRO STILE PLAQUE
     ========================================================================== */
  initFeatureBackdrop() {
    this.backdropGroup = new THREE.Group();
    // Position directly in the hero 3/4 camera background (+X, -Z)
    this.backdropGroup.position.set(16.5, 4.8, -16.5);
    this.backdropGroup.lookAt(0, 4.8, 0);
    this.showroomGroup.add(this.backdropGroup);

    // 1. Feature Wall Backing Panel
    const panelGeo = new THREE.PlaneGeometry(16, 6.8);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f18,
      roughness: 0.45,
      metalness: 0.72
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    this.backdropGroup.add(panelMesh);

    // 2. High-Resolution Centro Stile Illuminated Plaque Texture
    const bCanvas = document.createElement("canvas");
    bCanvas.width = 1024;
    bCanvas.height = 512;
    const bCtx = bCanvas.getContext("2d");

    // Dark luxury backing with bevel outline
    bCtx.fillStyle = "#0c111a";
    bCtx.fillRect(0, 0, 1024, 512);

    // Outer glowing cyan/gold border
    bCtx.strokeStyle = "rgba(0, 210, 255, 0.75)";
    bCtx.lineWidth = 4;
    bCtx.strokeRect(30, 30, 964, 452);

    // Lamborghini Shield Outline Graphic
    bCtx.strokeStyle = "rgba(0, 210, 255, 0.9)";
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.moveTo(512, 60);
    bCtx.lineTo(570, 95);
    bCtx.lineTo(570, 160);
    bCtx.lineTo(512, 215);
    bCtx.lineTo(454, 160);
    bCtx.lineTo(454, 95);
    bCtx.closePath();
    bCtx.stroke();
    bCtx.fillStyle = "rgba(0, 210, 255, 0.15)";
    bCtx.fill();

    // Bull silhouette center accent
    bCtx.fillStyle = "#00d2ff";
    bCtx.beginPath();
    bCtx.moveTo(512, 110);
    bCtx.lineTo(540, 140);
    bCtx.lineTo(520, 175);
    bCtx.lineTo(504, 175);
    bCtx.lineTo(484, 140);
    bCtx.closePath();
    bCtx.fill();

    // Typography
    bCtx.textAlign = "center";
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "bold 34px 'Courier New', monospace";
    bCtx.letterSpacing = "6px";
    bCtx.fillText("AUTOMOBILI LAMBORGHINI", 512, 280);

    bCtx.fillStyle = "#00d2ff";
    bCtx.font = "bold 20px 'Courier New', monospace";
    bCtx.letterSpacing = "5px";
    bCtx.fillText("SANT'AGATA BOLOGNESE // CENTRO STILE", 512, 335);

    bCtx.fillStyle = "rgba(255, 255, 255, 0.55)";
    bCtx.font = "14px 'Courier New', monospace";
    bCtx.letterSpacing = "4px";
    bCtx.fillText("AVENTADOR SVJ // AERODINAMICA LAMBORGHINI ATTIVA 2.0", 512, 385);

    const bTex = new THREE.CanvasTexture(bCanvas);
    const plaqueGeo = new THREE.PlaneGeometry(12, 5.1);
    this.plaqueMat = new THREE.MeshBasicMaterial({
      map: bTex,
      transparent: true,
      opacity: 0.95
    });
    this.emissiveMaterials.push({ mat: this.plaqueMat, baseNight: 0.95, baseDay: 0.65 });

    const plaqueMesh = new THREE.Mesh(plaqueGeo, this.plaqueMat);
    plaqueMesh.position.set(0, 0, 0.05);
    this.backdropGroup.add(plaqueMesh);
  }

  /* ==========================================================================
     5. OVERHEAD STUDIO SOFTBOX LIGHTBOXES (Recessed in ceiling at Y = 11.5m)
     ========================================================================== */
  initStudioSoftboxes() {
    this.softboxesGroup = new THREE.Group();
    this.showroomGroup.add(this.softboxesGroup);

    // 1. Central Overhead Studio Softbox (14m x 7m at Y = 11.5m, flush with ceiling)
    const mainBoxGeo = new THREE.PlaneGeometry(14, 7);
    this.mainSoftboxMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide
    });
    const mainSoftbox = new THREE.Mesh(mainBoxGeo, this.mainSoftboxMat);
    mainSoftbox.rotation.x = Math.PI / 2;
    mainSoftbox.position.set(0, 11.5, 0);
    this.softboxesGroup.add(mainSoftbox);

    const mainFrameGeo = new THREE.BoxGeometry(14.3, 0.2, 7.3);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.8 });
    const mainFrame = new THREE.Mesh(mainFrameGeo, frameMat);
    mainFrame.position.set(0, 11.6, 0);
    this.softboxesGroup.add(mainFrame);

    // 2. Left Key Studio Light Panel (10m x 4m at Y = 11.5m, flush with ceiling)
    const side1Geo = new THREE.PlaneGeometry(10, 4);
    this.sideSoftbox1Mat = new THREE.MeshBasicMaterial({
      color: 0xdcf0ff,
      side: THREE.FrontSide
    });
    const sideSoftbox1 = new THREE.Mesh(side1Geo, this.sideSoftbox1Mat);
    sideSoftbox1.rotation.x = Math.PI / 2;
    sideSoftbox1.position.set(-8.5, 11.5, 6.0);
    this.softboxesGroup.add(sideSoftbox1);

    const side1Frame = new THREE.Mesh(new THREE.BoxGeometry(10.3, 0.2, 4.3), frameMat);
    side1Frame.position.set(-8.5, 11.6, 6.0);
    this.softboxesGroup.add(side1Frame);

    // 3. Right Fill Studio Light Panel (10m x 4m at Y = 11.5m, flush with ceiling)
    const side2Geo = new THREE.PlaneGeometry(10, 4);
    this.sideSoftbox2Mat = new THREE.MeshBasicMaterial({
      color: 0xffedd8,
      side: THREE.FrontSide
    });
    const sideSoftbox2 = new THREE.Mesh(side2Geo, this.sideSoftbox2Mat);
    sideSoftbox2.rotation.x = Math.PI / 2;
    sideSoftbox2.position.set(8.5, 11.5, -6.0);
    this.softboxesGroup.add(sideSoftbox2);

    const side2Frame = new THREE.Mesh(new THREE.BoxGeometry(10.3, 0.2, 4.3), frameMat);
    side2Frame.position.set(8.5, 11.6, -6.0);
    this.softboxesGroup.add(side2Frame);
  }

  /* ==========================================================================
     6. ARCHITECTURAL CEILING GRID & TRUSSES
     ========================================================================== */
  initCeilingGrid() {
    this.ceilingGroup = new THREE.Group();
    this.showroomGroup.add(this.ceilingGroup);

    // Structural dark ceiling slab at Y = 14m (Radius: 28m)
    const ceilingGeo = new THREE.CircleGeometry(28, 64);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x06090e,
      roughness: 0.9,
      metalness: 0.15,
      side: THREE.FrontSide
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.y = 14.0;
    this.ceilingGroup.add(ceilingMesh);

    // Cross-truss ceiling beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x0b1018, roughness: 0.7 });
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const beamGeo = new THREE.BoxGeometry(0.3, 0.45, 48);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(i * 6.5, 13.7, 0);
      this.ceilingGroup.add(beam);
    }
  }

  /* ==========================================================================
     7. SHOWROOM ARCHITECTURAL DOWNLIGHTS
     ========================================================================== */
  initShowroomSpotlights() {
    // 4 Spotlights suspended from ceiling pointing down at the turntable corners
    const spotCoords = [
      { x: -5.5, z: 5.5, color: 0xc8e6ff },
      { x: 5.5, z: -5.5, color: 0xffe8d0 },
      { x: -5.5, z: -5.5, color: 0xd0ecff },
      { x: 5.5, z: 5.5, color: 0xd0ecff }
    ];

    spotCoords.forEach((coord, idx) => {
      const spot = new THREE.SpotLight(coord.color, 1.8);
      spot.position.set(coord.x, 10.5, coord.z);
      spot.target.position.set(coord.x * 0.45, 0, coord.z * 0.45);
      spot.angle = Math.PI / 5.5;
      spot.penumbra = 0.65;
      spot.decay = 1.6;
      spot.distance = 24;
      this.scene.add(spot.target);
      this.showroomGroup.add(spot);
      this.downlightSpots.push(spot);

      // Downlight glowing fixture lens on ceiling
      const lensGeo = new THREE.CircleGeometry(0.25, 16);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(coord.x, 10.49, coord.z);
      this.showroomGroup.add(lens);
    });
  }

  /* ==========================================================================
     8. PMREM SHOWROOM ENVIRONMENT MAP GENERATION
     ========================================================================== */
  generateShowroomEnvMap() {
    if (!this.pmremGenerator) return;

    // Build dedicated reflection dome mirroring this luxury showroom
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0c121c);

    // 1. Surrounding Room Dome
    const domeGeo = new THREE.SphereGeometry(26, 32, 16);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x121a28,
      side: THREE.BackSide
    });
    envScene.add(new THREE.Mesh(domeGeo, domeMat));

    // 2. Large Central Overhead Softbox
    const topBox = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 8.5),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    topBox.rotation.x = Math.PI / 2;
    topBox.position.set(0, 8.5, 0);
    envScene.add(topBox);

    // 3. Left Key Light Bank (Cool cyan)
    const leftBox = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 4.5),
      new THREE.MeshBasicMaterial({ color: 0xc8e6ff, side: THREE.DoubleSide })
    );
    leftBox.position.set(-8.5, 5.5, 6.5);
    leftBox.rotation.y = -Math.PI / 4;
    envScene.add(leftBox);

    // 4. Right Fill Light Bank (Warm amber)
    const rightBox = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 4.5),
      new THREE.MeshBasicMaterial({ color: 0xffd8b4, side: THREE.DoubleSide })
    );
    rightBox.position.set(8.5, 5.5, -6.5);
    rightBox.rotation.y = Math.PI / 4;
    envScene.add(rightBox);

    // 5. Floor Horizon Reflection Gradient
    const horizonRing = new THREE.Mesh(
      new THREE.RingGeometry(24, 26, 32),
      new THREE.MeshBasicMaterial({ color: 0x00d2ff, side: THREE.DoubleSide })
    );
    horizonRing.rotation.x = -Math.PI / 2;
    horizonRing.position.y = 0.05;
    envScene.add(horizonRing);

    const envMap = this.pmremGenerator.fromScene(envScene).texture;
    this.scene.environment = envMap;

    // Apply environment reflection to showroom floor as well
    if (this.floorMaterial) {
      this.floorMaterial.envMap = envMap;
      this.floorMaterial.needsUpdate = true;
    }
  }

  /* ==========================================================================
     9. DAY / NIGHT SHOWROOM TRANSITIONS
     ========================================================================== */
  setDayNight(isNight, duration = 0.8) {
    this.isNightMode = isNight;

    // 1. Softbox emissive brightness
    const mainBoxColor = isNight ? new THREE.Color(0xffffff) : new THREE.Color(0xffffff);
    const side1Color = isNight ? new THREE.Color(0xdcf0ff) : new THREE.Color(0xffffff);
    const side2Color = isNight ? new THREE.Color(0xffedd8) : new THREE.Color(0xffffff);

    gsap.to(this.mainSoftboxMat.color, {
      r: mainBoxColor.r,
      g: mainBoxColor.g,
      b: mainBoxColor.b,
      duration
    });
    gsap.to(this.sideSoftbox1Mat.color, {
      r: side1Color.r,
      g: side1Color.g,
      b: side1Color.b,
      duration
    });
    gsap.to(this.sideSoftbox2Mat.color, {
      r: side2Color.r,
      g: side2Color.g,
      b: side2Color.b,
      duration
    });

    // 2. Downlights intensity
    const downlightTarget = isNight ? 1.8 : 3.2;
    this.downlightSpots.forEach((spot) => {
      gsap.to(spot, { intensity: downlightTarget, duration, ease: "power2.out" });
    });

    // 3. Emissive LED channels & wall elements
    this.emissiveMaterials.forEach((item) => {
      const targetOpacity = isNight ? item.baseNight : item.baseDay;
      gsap.to(item.mat, { opacity: targetOpacity, duration, ease: "power2.out" });
    });

    // 4. Floor material roughness & tone
    const floorColor = isNight ? new THREE.Color(0x0c111a) : new THREE.Color(0x18202d);
    gsap.to(this.floorMaterial.color, {
      r: floorColor.r,
      g: floorColor.g,
      b: floorColor.b,
      duration
    });
  }
}

window.ShowroomController = ShowroomController;
