/**
 * ============================================================================
 * AVENTADOR SVJ // CINEMATIC CAMERA & ORBIT CONTROLLER
 * Manages 360-degree inspection, inertia, idle auto-rotation, cinematic presets,
 * and component focus animations using GSAP.
 * ============================================================================
 */

class CameraController {
  constructor(canvas) {
    this.canvas = canvas;
    this.aspect = window.innerWidth / window.innerHeight;

    // Cinematic 36° Field of View for supercar proportions and dramatic framing
    this.camera = new THREE.PerspectiveCamera(36, this.aspect, 0.1, 100);

    // Initial Hero 3/4 View Position: frames the Aventador SVJ with elegant breathing room
    this.initialPosition = new THREE.Vector3(-5.3, 1.45, 3.6);
    this.initialTarget = new THREE.Vector3(0, 0.50, 0);

    this.camera.position.copy(this.initialPosition);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(this.initialTarget);

    // Clamps to ensure camera stays within automotive angles
    this.controls.minDistance = 3.2;
    this.controls.maxDistance = 15.0;
    this.controls.minPolarAngle = Math.PI * 0.12; // Overhead limit
    this.controls.maxPolarAngle = Math.PI * 0.492; // Prevent going below ground

    // Disable camera zoom & pan so mouse wheel scrolling directly drives the car explosion!
    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    // Auto-rotation parameters
    this.autoRotateEnabled = true;
    this.isUserInteracting = false;
    this.idleTimer = null;
    this.idleDelay = 3500; // 3.5 seconds idle before resuming auto-rotation

    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.55;

    this.bindEvents();
  }

  bindEvents() {
    this.controls.addEventListener("start", () => {
      this.isUserInteracting = true;
      this.controls.autoRotate = false;
      if (this.idleTimer) clearTimeout(this.idleTimer);
    });

    this.controls.addEventListener("end", () => {
      this.isUserInteracting = false;
      this.resetIdleTimer();
    });
  }

  resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (!this.isUserInteracting && this.autoRotateEnabled) {
        this.controls.autoRotate = true;
      }
    }, this.idleDelay);
  }

  setAutoRotate(enabled) {
    this.autoRotateEnabled = enabled;
    this.controls.autoRotate = enabled && !this.isUserInteracting;
    if (!enabled && this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
  }

  toggleAutoRotate() {
    this.setAutoRotate(!this.autoRotateEnabled);
    return this.autoRotateEnabled;
  }

  moveToPreset(presetName, duration = 1.6) {
    const presets = {
      hero: { pos: new THREE.Vector3(-5.3, 1.45, 3.6), target: new THREE.Vector3(0, 0.50, 0) },
      side: { pos: new THREE.Vector3(0, 1.30, 6.4), target: new THREE.Vector3(0, 0.50, 0) },
      rear: { pos: new THREE.Vector3(5.3, 1.48, 3.5), target: new THREE.Vector3(0, 0.50, 0) },
      front: { pos: new THREE.Vector3(-5.7, 1.18, 0.0), target: new THREE.Vector3(0, 0.50, 0) },
      exploded: { pos: new THREE.Vector3(-4.8, 1.95, 3.6), target: new THREE.Vector3(0, 0.80, 0) },
      configurator: { pos: new THREE.Vector3(-5.0, 1.38, 3.4), target: new THREE.Vector3(0, 0.50, 0) }
    };

    const targetConfig = presets[presetName] || presets.hero;
    this.animateTo(targetConfig.pos, targetConfig.target, duration);
  }

  focusOnPoint(targetPoint, distance = 2.4, duration = 1.2) {
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    if (dir.lengthSq() < 0.001) dir.set(-1, 0.35, 0.8).normalize();
    const destPos = targetPoint.clone().add(dir.multiplyScalar(distance));
    destPos.y = Math.max(0.55, destPos.y);
    this.animateTo(destPos, targetPoint, duration);
  }

  playHeroEntrance(onComplete = null) {
    this.controls.autoRotate = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);

    // Initial dramatic wide, elevated perspective
    this.camera.position.set(-9.4, 3.6, 6.4);
    this.controls.target.set(0, 0.45, 0);
    this.controls.update();

    const heroPos = new THREE.Vector3(-5.3, 1.45, 3.6);
    const heroTarget = new THREE.Vector3(0, 0.50, 0);

    gsap.to(this.camera.position, {
      x: heroPos.x,
      y: heroPos.y,
      z: heroPos.z,
      duration: 1.4,
      ease: "power2.out"
    });

    gsap.to(this.controls.target, {
      x: heroTarget.x,
      y: heroTarget.y,
      z: heroTarget.z,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        this.controls.update();
      },
      onComplete: () => {
        if (onComplete) onComplete();
        this.resetIdleTimer();
      }
    });
  }

  animateTo(destPos, destTarget, duration = 1.4, onComplete = null) {
    this.controls.autoRotate = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);

    gsap.to(this.camera.position, {
      x: destPos.x,
      y: destPos.y,
      z: destPos.z,
      duration: duration,
      ease: "power3.inOut"
    });

    gsap.to(this.controls.target, {
      x: destTarget.x,
      y: destTarget.y,
      z: destTarget.z,
      duration: duration,
      ease: "power3.inOut",
      onUpdate: () => {
        this.controls.update();
      },
      onComplete: () => {
        if (onComplete) onComplete();
        this.resetIdleTimer();
      }
    });
  }

  update() {
    this.controls.update();
  }

  onResize() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }
}

window.CameraController = CameraController;
