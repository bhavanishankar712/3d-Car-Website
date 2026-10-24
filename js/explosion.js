/**
 * ============================================================================
 * AVENTADOR SVJ // CINEMATIC MECHANICAL EXPLOSION ENGINE
 * Coordinates high-precision 3D disassembly trajectories for all 87 vehicle
 * components upon scrolling, providing a pure, stunning visual explosion.
 * ============================================================================
 */

class ExplosionController {
  constructor(carController, cameraController) {
    this.car = carController;
    this.cameraCtrl = cameraController;

    this.progress = 0; // 0 = fully assembled, 1 = fully exploded
    this.partRules = [];

    this.initExplosionVectors();
  }

  initExplosionVectors() {
    // Coordinate system:
    // -X: Front, +X: Rear
    // +Y: Up, -Y: Down
    // +Z: Left, -Z: Right
    //
    // Each rule defines:
    // nodes: list of mesh/object names from the 87 GLB nodes
    // offset: { x, y, z, rx, ry, rz } target explosion delta
    // range: [startProgress, endProgress] normalized to [0, 1]

    this.partRules = [
      // ======================================================================
      // 1. FRONT AERO & LUGGAGE HOOD (Lifts and glides forward)
      // ======================================================================
      {
        nodes: ["Obj_Hood", "Obj_Badge_Hood"],
        offset: { x: -0.65, y: 1.85, z: 0, rx: 0.26, ry: 0, rz: 0 },
        range: [0.0, 0.86]
      },
      {
        nodes: ["Obj_Bumper_Front"],
        offset: { x: -2.35, y: -0.15, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.02, 0.88]
      },
      {
        nodes: ["Obj_HeadLight", "Obj_Headlight_Glass"],
        offset: { x: -1.75, y: 0.65, z: 0, rx: 0.1, ry: 0, rz: 0 },
        range: [0.02, 0.84]
      },
      {
        nodes: [
          "Obj_Upper_Fender",
          "Obj_Upper_Fender_Frame",
          "Obj_Upper_Fender_Inner",
          "Obj_Upper_Fender_Near_Glass"
        ],
        offset: { x: -0.55, y: 0.95, z: 0.85, rx: 0, ry: 0, rz: 0.18 },
        range: [0.03, 0.88]
      },

      // ======================================================================
      // 2. GREENHOUSE, ROOF & DIHEDRAL SCISSOR DOORS
      // ======================================================================
      {
        nodes: ["Obj_RoofFrame", "Obj_Interior_Headliner"],
        offset: { x: 0, y: 2.65, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.04, 0.92]
      },
      {
        nodes: ["Obj_WindScreen", "Obj_Wiper_LH", "Obj_Wiper_RH"],
        offset: { x: -0.35, y: 1.85, z: 0, rx: 0.15, ry: 0, rz: 0 },
        range: [0.04, 0.88]
      },
      {
        nodes: ["Obj_Rear_WindShield"],
        offset: { x: 0.65, y: 1.75, z: 0, rx: -0.18, ry: 0, rz: 0 },
        range: [0.04, 0.88]
      },
      {
        nodes: ["Obj_Side_Doors", "Obj_Doors_UpperFrame"],
        offset: { x: -0.22, y: 1.95, z: 1.65, rx: 0.05, ry: 0.32, rz: 0.52 },
        range: [0.05, 0.90]
      },
      {
        nodes: ["Obj_ORVM", "Obj_ORVM_Shield_Glass"],
        offset: { x: -0.45, y: 1.1, z: 1.85, rx: 0, ry: 0.15, rz: 0 },
        range: [0.04, 0.86]
      },

      // ======================================================================
      // 3. WHEELS & BRAKE SYSTEMS (Move outward along lateral axle vectors)
      // ======================================================================
      // Front Left Outer Wheel
      {
        nodes: ["Obj_WheelHub_FL", "Obj_Rim_T0A_FL", "Obj_Rim_T0B_FL", "Obj_Tyre_FL"],
        offset: { x: -0.12, y: 0, z: 2.55, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.94]
      },
      // Front Left Brake Disc & Caliper
      {
        nodes: ["Obj_DiscRotor_FL", "Obj_Caliper_FL"],
        offset: { x: -0.12, y: 0, z: 1.35, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },
      // Front Right Outer Wheel
      {
        nodes: ["Obj_WheelHub_FR", "Obj_Rim_T0A_FR", "Obj_Rim_T0B_FR", "Obj_Tyre_FR"],
        offset: { x: -0.12, y: 0, z: -2.55, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.94]
      },
      // Front Right Brake Disc & Caliper
      {
        nodes: ["Obj_DiscRotor_FR", "Obj_Caliper_FR"],
        offset: { x: -0.12, y: 0, z: -1.35, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },
      // Rear Left Outer Wheel (Super-wide)
      {
        nodes: ["Obj_WheelHub_RL", "Obj_Rim_T0A_RL", "Obj_Rim_T0B_RL", "Obj_Tyre_RL"],
        offset: { x: 0.18, y: 0, z: 2.75, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.94]
      },
      // Rear Left Brake Disc & Caliper
      {
        nodes: ["Obj_DiscRotor_RL", "Obj_Caliper_RL"],
        offset: { x: 0.18, y: 0, z: 1.45, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },
      // Rear Right Outer Wheel (Super-wide)
      {
        nodes: ["Obj_WheelHub_RR", "Obj_Rim_T0A_RR", "Obj_Rim_T0B_RR", "Obj_Tyre_RR"],
        offset: { x: 0.18, y: 0, z: -2.75, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.94]
      },
      // Rear Right Brake Disc & Caliper
      {
        nodes: ["Obj_DiscRotor_RR", "Obj_Caliper_RR"],
        offset: { x: 0.18, y: 0, z: -1.45, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },

      // ======================================================================
      // 4. REAR AERO, EXHAUST & ALA 2.0 WING
      // ======================================================================
      {
        nodes: ["Obj_SVJ_AeroWing"],
        offset: { x: 1.35, y: 2.35, z: 0, rx: -0.12, ry: 0, rz: 0 },
        range: [0.05, 0.92]
      },
      {
        nodes: ["Obj_Boot", "Obj_Boot_Lid", "Obj_Emblem_Rear"],
        offset: { x: 1.05, y: 1.55, z: 0, rx: -0.22, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },
      {
        nodes: ["Obj_Bumper_Rear"],
        offset: { x: 2.55, y: -0.12, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.92]
      },
      {
        nodes: [
          "Obj_Tail_Light",
          "Obj_Tail_Light_Glass",
          "Obj_Tail_Led_Glass",
          "Obj_Tail_Led_Plate"
        ],
        offset: { x: 2.15, y: 0.25, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.06, 0.90]
      },
      {
        nodes: ["Obj_Exhaust"],
        offset: { x: 1.95, y: -0.28, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.08, 0.94]
      },

      // ======================================================================
      // 5. 6.5L V12 POWERTRAIN & MECHANICAL SUBSYSTEMS
      // ======================================================================
      {
        nodes: ["Obj_Engine_Cover"],
        offset: { x: 0.55, y: 1.75, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.08, 0.94]
      },
      {
        nodes: ["Obj_Engine_Roll_Cage"],
        offset: { x: 0.5, y: 2.05, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.08, 0.95]
      },
      {
        nodes: [
          "Obj_Engine_Pipes",
          "Obj_Engine_Room_Wedge",
          "Obj_Engine_Seating",
          "Obj_Oil_Cap_Shroud"
        ],
        offset: { x: 0.45, y: 1.15, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.10, 0.96]
      },

      // ======================================================================
      // 6. COCKPIT INTERIOR ARCHITECTURE
      // ======================================================================
      {
        nodes: ["Obj_Seats", "Obj_SeatBelts", "Obj_SeatBelt_Metal", "Obj_Seat_Plastics"],
        offset: { x: -0.15, y: 1.35, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.10, 0.94]
      },
      {
        nodes: [
          "Obj_Steering_Leather",
          "Obj_Steering_Stitching",
          "Obj_SteeringCover",
          "Obj_SteeringWheel_Metals",
          "Obj_SteeringWheel_Plastics",
          "Obj_Interior_Steering_Btns",
          "Obj_Interior_Steering_Emblem"
        ],
        offset: { x: -0.25, y: 1.05, z: 0.38, rx: 0.15, ry: 0, rz: 0 },
        range: [0.10, 0.94]
      },
      {
        nodes: [
          "Obj_Dash_Plastic",
          "Obj_Interior_Dash_DoorPads",
          "Obj_Interior_Buttons",
          "Obj_Interior_Knobs",
          "Obj_Cluster_Backplate"
        ],
        offset: { x: -0.55, y: 0.95, z: 0, rx: 0.1, ry: 0, rz: 0 },
        range: [0.10, 0.94]
      },
      {
        nodes: [
          "Obj_Interior_FootMesh",
          "Obj_Interior_Metal",
          "Obj_Interior_Pillar",
          "Obj_Interior_Plastics",
          "Obj_Interior_Rear_View_Mirror",
          "Obj_Interior_RollCage",
          "Obj_Interior_SolidInner",
          "Obj_Interrior_Glass"
        ],
        offset: { x: 0, y: 0.75, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.12, 0.96]
      },

      // ======================================================================
      // 7. GROUND EFFECT SKIRTS & UNDERBODY TRAY
      // ======================================================================
      {
        nodes: ["Obj_Running_Board"],
        offset: { x: 0, y: -0.28, z: 0.95, rx: 0, ry: 0, rz: 0 },
        range: [0.08, 0.92]
      },
      {
        nodes: ["Obj_UnderBody"],
        offset: { x: 0, y: -1.05, z: 0, rx: 0, ry: 0, rz: 0 },
        range: [0.10, 0.98]
      }
    ];
  }

  setExplosionProgress(progress, time = 0) {
    this.progress = Math.max(0, Math.min(1, progress));

    if (!this.car || !this.car.isLoaded) return;

    const isSuspended = this.progress > 0.05;

    this.partRules.forEach((rule, ruleIdx) => {
      const [startP, endP] = rule.range;
      let t = 0;
      if (this.progress > startP) {
        t = Math.min(1, Math.max(0, (this.progress - startP) / (endP - startP)));
      }

      // Quintic Smootherstep: zero velocity and acceleration shock at both endpoints
      const easeT = this.smootherStep(t);

      // Rich, slow zero-G harmonic hovering animation across each suspended subsystem
      let floatY = 0;
      let floatX = 0;
      let floatZ = 0;
      let floatRx = 0;
      let floatRy = 0;
      let floatRz = 0;

      if (isSuspended && easeT > 0.01) {
        // Multi-frequency slow breathing wave (~0.5 - 0.8 Hz)
        const phase = time * 0.85 + ruleIdx * 0.45;
        const slowPhase = time * 0.42 + ruleIdx * 0.28;

        // Altitude hover oscillation (±6.5cm range)
        floatY = (Math.sin(phase) * 0.055 + Math.cos(slowPhase) * 0.028) * easeT;

        // Gentle spatial drift along X & Z (±3.8cm range)
        floatX = Math.sin(time * 0.58 + ruleIdx * 0.50) * 0.038 * easeT;
        floatZ = Math.cos(time * 0.62 + ruleIdx * 0.35) * 0.038 * easeT;

        // Hover micro-rotations (organic zero-G angular drift)
        floatRx = Math.sin(time * 0.48 + ruleIdx * 0.52) * 0.035 * easeT;
        floatRy = Math.cos(time * 0.42 + ruleIdx * 0.38) * 0.030 * easeT;
        floatRz = Math.sin(time * 0.55 + ruleIdx * 0.60) * 0.038 * easeT;
      }

      rule.nodes.forEach((nodeName) => {
        const node = this.car.meshRegistry[nodeName];
        const initial = this.car.originalTransforms.get(nodeName);

        if (node && initial) {
          node.position.x = initial.position.x + rule.offset.x * easeT + floatX;
          node.position.y = initial.position.y + rule.offset.y * easeT + floatY;
          node.position.z = initial.position.z + rule.offset.z * easeT + floatZ;

          let rx = initial.rotation.x + (rule.offset.rx ? rule.offset.rx * easeT : 0) + floatRx;
          let ry = initial.rotation.y + (rule.offset.ry ? rule.offset.ry * easeT : 0) + floatRy;
          let rz = initial.rotation.z + (rule.offset.rz ? rule.offset.rz * easeT : 0) + floatRz;

          // Special Slow Subsystem Animations while Suspended:
          // 1. Slow Hypnotic Wheel & Rim Rotation in Zero-G
          if (isSuspended && easeT > 0.1 && (nodeName.includes("Rim") || nodeName.includes("Tyre") || nodeName.includes("WheelHub"))) {
            const wheelSpin = time * 0.22 * easeT;
            rz += wheelSpin;
          }

          // 2. Slow Wing-Flap Hover for Dihedral Scissor Doors
          if (isSuspended && easeT > 0.1 && nodeName.includes("Door")) {
            const doorHover = Math.sin(time * 0.72) * 0.045 * easeT;
            ry += doorHover;
            rz += doorHover * 0.5;
          }

          // 3. Active SVJ Rear Wing Pitch Flutter
          if (isSuspended && easeT > 0.1 && nodeName.includes("SVJ_AeroWing")) {
            const wingFlutter = Math.sin(time * 0.9) * 0.03 * easeT;
            rz += wingFlutter;
          }

          node.rotation.x = rx;
          node.rotation.y = ry;
          node.rotation.z = rz;
        }
      });
    });
  }

  /**
   * Perlin Smootherstep (Quintic Curve: 6x^5 - 15x^4 + 10x^3)
   * Guaranteed C² continuity (1st and 2nd derivatives = 0 at t=0 and t=1)
   * Provides ultra-smooth, physical mechanical acceleration without overshoot or snapping.
   */
  smootherStep(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return x * x * x * (x * (x * 6 - 15) + 10);
  }
}

window.ExplosionController = ExplosionController;
