/**
 * ============================================================================
 * AVENTADOR SVJ // 33-COMPONENT TECHNICAL HUD & INSPECTION SYSTEM
 * Defines exact technical specifications for all 33 component assets from images/,
 * renders dynamic 3D-to-2D screen badges, SVG connector lines, and inspection drawer.
 * ============================================================================
 */

class LabelsController {
  constructor(scene, cameraController, carController) {
    this.scene = scene;
    this.cameraCtrl = cameraController;
    this.car = carController;

    this.container = document.getElementById("component-cards-overlay");
    this.svgLayer = document.getElementById("svg-connector-layer");
    this.modal = document.getElementById("component-modal");

    this.activeComponent = null;
    this.components = this.getComponentsData();
    this.domNodes = [];

    this.initDOMNodes();
    this.initModalEvents();
  }

  getComponentsData() {
    return [
      {
        id: 1,
        file: "01_car_body.png",
        name: "Carbon Monocoque Outer Body",
        subsystem: "CHASSIS // STR-01",
        anchor: new THREE.Vector3(0, 0.85, 0),
        desc: "Full single-piece carbon fiber monocoque engineered with aeronautical-grade RTM (Resin Transfer Molding) technology, delivering extraordinary torsional rigidity.",
        specs: { "Material": "Carbon-Fiber Composite", "Torsional Rigidity": "35,000 Nm/deg", "Dry Weight": "147.5 kg", "Safety Rating": "FIA GT Homologated" }
      },
      {
        id: 2,
        file: "02_front_section.png",
        name: "Active Aero Front Fascia",
        subsystem: "AERO // ALA-02",
        anchor: new THREE.Vector3(-2.6, 0.35, 0),
        desc: "Front aerodynamic nose section featuring integrated ALA 2.0 active micro-flaps that electronically modulate airflow over front splitters in under 500ms.",
        specs: { "Aero System": "ALA 2.0 Active Flaps", "Downforce Gain": "+29% vs S Model", "Material": "Autoclaved Prepreg Carbon", "Actuation Time": "< 500 ms" }
      },
      {
        id: 3,
        file: "03_hood.png",
        name: "Carbon Fiber Luggage Lid",
        subsystem: "BODY // EXT-03",
        anchor: new THREE.Vector3(-1.6, 1.15, 0),
        desc: "Front carbon luggage compartment hood featuring sculpted dual longitudinal air extraction channels designed to direct airflow across the windscreen.",
        specs: { "Material": "Ultra-Thin Carbon Fiber", "Weight": "6.8 kg", "Latching Mechanism": "Dual Aerospace Pins", "Air Extraction": "Twin High-Flow Vents" }
      },
      {
        id: 4,
        file: "04_roof_windshield.png",
        name: "Greenhouse & Roof Frame",
        subsystem: "SAFETY // STR-04",
        anchor: new THREE.Vector3(0, 1.55, 0),
        desc: "High-strength roof structural frame engineered with integrated roll-over cage architecture and lightweight acoustic laminated glazing.",
        specs: { "Material": "Hydroformed Aluminum & Carbon", "Impact Resistance": "5.5x Vehicle Weight", "Acoustic Attenuation": "-3.8 dB Cabin Noise", "Structure": "Truss Monocoque Ring" }
      },
      {
        id: 5,
        file: "05_left_door.png",
        name: "Left Dihedral Scissor Door",
        subsystem: "COCKPIT // BD-05",
        anchor: new THREE.Vector3(-0.3, 1.15, 1.2),
        desc: "Iconic Lamborghini vertical opening scissor door constructed with full carbon outer skin and high-pressure gas struts for effortless ingress.",
        specs: { "Door Type": "Dihedral Scissor", "Actuator": "Dual Nitrogen Struts", "Skin": "Carbon Fiber Prepreg", "Opening Angle": "74 Degrees" }
      },
      {
        id: 6,
        file: "06_right_door.png",
        name: "Right Dihedral Scissor Door",
        subsystem: "COCKPIT // BD-06",
        anchor: new THREE.Vector3(-0.3, 1.15, -1.2),
        desc: "Right passenger vertical scissor door engineered with ultra-light inner intrusion beam and flush aerodynamic pull-latches.",
        specs: { "Door Type": "Dihedral Scissor", "Inner Core": "Honeycomb Structural Core", "Crash Protection": "Side Intrusion Beam", "Weight": "8.4 kg per Door" }
      },
      {
        id: 7,
        file: "07_left_headlight.png",
        name: "Left Bi-LED Headlamp",
        subsystem: "LIGHTING // LT-07",
        anchor: new THREE.Vector3(-2.2, 0.65, 0.75),
        desc: "High-intensity adaptive Bi-LED headlamp cluster showcasing the signature Y-pattern Daytime Running Light (DRL) and active matrix cornering projector.",
        specs: { "Technology": "Adaptive Matrix Bi-LED", "Luminous Flux": "4,200 Lumens", "Color Temperature": "6,000K Pure Daylight", "Signature": "Y-Design Light Guide" }
      },
      {
        id: 8,
        file: "08_right_headlight.png",
        name: "Right Bi-LED Headlamp",
        subsystem: "LIGHTING // LT-08",
        anchor: new THREE.Vector3(-2.2, 0.65, -0.75),
        desc: "Right adaptive matrix LED illumination unit with polycarbonate hard-coated lens and dynamic high-beam cornering trajectory adjustment.",
        specs: { "Technology": "Adaptive Matrix Bi-LED", "Luminous Flux": "4,200 Lumens", "Lens Coating": "Anti-Scratch Polycarbonate", "Voltage": "12V Digital PWM" }
      },
      {
        id: 9,
        file: "09_rear_bumper.png",
        name: "Rear Aero Bumper Assembly",
        subsystem: "AERO // EXT-09",
        anchor: new THREE.Vector3(2.4, 0.55, 0),
        desc: "Sculpted rear aerodynamic bumper featuring high-mounted central exhaust cutouts and expansive open honeycomb mesh for rapid engine bay heat extraction.",
        specs: { "Material": "Carbon Composite", "Thermal Resistance": "Up to 380°C", "Heat Extraction": "+32% Thermal Evacuation", "Design": "SVJ High-Exit Architecture" }
      },
      {
        id: 10,
        file: "10_front_left_fender.png",
        name: "Front Left Sculpted Fender",
        subsystem: "AERO // BD-10",
        anchor: new THREE.Vector3(-1.6, 0.8, 1.05),
        desc: "Sculpted front left quarter panel with integrated wheel-well pressure relief gills to eliminate aerodynamic lift at extreme track velocities.",
        specs: { "Function": "High-Pressure Wheel Arch Relief", "Weight": "2.9 kg", "Finish": "Exposed Carbon Accent", "Aero Lift Delta": "-18 kg at 250 km/h" }
      },
      {
        id: 11,
        file: "11_front_right_fender.png",
        name: "Front Right Sculpted Fender",
        subsystem: "AERO // BD-11",
        anchor: new THREE.Vector3(-1.6, 0.8, -1.05),
        desc: "Sculpted front right fender designed to harmonize airflow between front air dams and side cooling radiators.",
        specs: { "Function": "Airflow Guidance & Lift Mitigation", "Weight": "2.9 kg", "Material": "Carbon Fiber", "Structure": "Direct Bolt Subframe Mount" }
      },
      {
        id: 12,
        file: "12_spoiler.png",
        name: "ALA 2.0 Active Rear Wing",
        subsystem: "AERO // ALA-12",
        anchor: new THREE.Vector3(1.85, 1.45, 0),
        desc: "Aerodinamica Lamborghini Attiva 2.0 rear wing with twin central hollow pylons and internal electro-actuated micro-valves for Aero-Vectoring.",
        specs: { "Max Downforce": "490 kg at 300 km/h", "Aero-Vectoring": "Independent Left/Right Channeling", "Structure": "Forged Carbon Core", "Weight": "4.2 kg Complete" }
      },
      {
        id: 13,
        file: "13_side_skirt.png",
        name: "Ground-Effect Side Skirt",
        subsystem: "AERO // EXT-13",
        anchor: new THREE.Vector3(0, 0.15, 1.15),
        desc: "Carbon fiber ground-effect longitudinal skirt with integrated vertical vortex fins directing clean turbulent-free air around the rear tires.",
        specs: { "Material": "Autoclaved Carbon", "Function": "Underfloor Seal & Vortex Control", "Length": "2,150 mm", "Ground Clearance Delta": "Optimized Venturi Margin" }
      },
      {
        id: 14,
        file: "14_rear_diffuser.png",
        name: "High-Downforce Rear Diffuser",
        subsystem: "AERO // EXT-14",
        anchor: new THREE.Vector3(2.5, 0.22, 0),
        desc: "Aggressive multi-tunnel carbon rear diffuser utilizing Bernoulli effect to extract air beneath the flat undertray, gluing the rear axle to the tarmac.",
        specs: { "Expansion Angle": "14.5 Degrees", "Material": "Thermal-Coated Carbon Fiber", "Tunnels": "4 Precision Venturi Channels", "Downforce Share": "38% Total Rear Downforce" }
      },
      {
        id: 15,
        file: "15_wheel_01.png",
        name: "Front Left Leirion Forged Wheel",
        subsystem: "CHASSIS // WH-15",
        anchor: new THREE.Vector3(-1.55, 0.39, 1.15),
        desc: "Ultra-lightweight central-locking forged aluminum wheel designed with directional aerodynamic spokes for brake cooling extraction.",
        specs: { "Dimension": "9J x 20 Inch", "Nut Type": "Center-Lock Aerospace Nut", "Tire Spec": "255/30 ZR20 Pirelli P Zero Corsa", "Weight": "8.9 kg" }
      },
      {
        id: 16,
        file: "16_wheel_02.png",
        name: "Front Right Leirion Forged Wheel",
        subsystem: "CHASSIS // WH-16",
        anchor: new THREE.Vector3(-1.55, 0.39, -1.15),
        desc: "Right front 20-inch monoblock forged alloy wheel precision-milled from aerospace 6061-T6 aluminum billet.",
        specs: { "Dimension": "9J x 20 Inch", "Material": "Forged 6061-T6 Aluminum", "Finish": "Satin Nero Matt", "Rigidity": "High Lateral Camber Stiffness" }
      },
      {
        id: 17,
        file: "17_wheel_03.png",
        name: "Rear Left Super-Wide Wheel",
        subsystem: "CHASSIS // WH-17",
        anchor: new THREE.Vector3(1.53, 0.39, 1.25),
        desc: "Deep concave 21-inch rear wheel delivering immense mechanical grip to harness all 770 CV through all-wheel-drive Haldex coupling.",
        specs: { "Dimension": "13J x 21 Inch", "Tire Spec": "355/25 ZR21 Ultra-Wide", "Offset": "ET 66.7 mm", "Mass": "11.4 kg" }
      },
      {
        id: 18,
        file: "18_wheel_04.png",
        name: "Rear Right Super-Wide Wheel",
        subsystem: "CHASSIS // WH-18",
        anchor: new THREE.Vector3(1.53, 0.39, -1.25),
        desc: "Right rear 21-inch ultra-wide wheel engineered to sustain lateral forces exceeding 1.5G on high-speed track sweeps.",
        specs: { "Dimension": "13J x 21 Inch", "Hub Lock Torque": "600 Nm", "Lateral Load Rating": "12,000 N", "Finish": "Satin Nero Matt" }
      },
      {
        id: 19,
        file: "19_brake_disc_caliper.png",
        name: "Carbon Ceramic Brake System",
        subsystem: "BRAKES // BR-19",
        anchor: new THREE.Vector3(-1.55, 0.39, 0.95),
        desc: "Massive 400mm carbon ceramic ventilated rotor clamped by a 6-piston aluminum monobloc Brembo caliper in Rosso Mars racing red.",
        specs: { "Rotor Diameter": "400 mm Front / 380 mm Rear", "Caliper": "6-Piston Monobloc", "Stopping 100-0 km/h": "30.0 meters", "Fade Resistance": "Zero Fade at 950°C" }
      },
      {
        id: 20,
        file: "20_suspension_01.png",
        name: "Front Pushrod Suspension",
        subsystem: "SUSPENSION // SP-20",
        anchor: new THREE.Vector3(-1.2, 0.55, 0.65),
        desc: "Formula 1 inspired horizontal pushrod magnetorheological shock absorber system with adjustable electronic damping response.",
        specs: { "Architecture": "Inboard Pushrod Double Wishbone", "Damper Type": "Magnetorheological Active", "Response Frequency": "1,000 Hz Sampling Rate", "Geometry": "Zero Anti-Dive Angle" }
      },
      {
        id: 21,
        file: "21_suspension_02.png",
        name: "Rear Pushrod & LDS Damper",
        subsystem: "SUSPENSION // SP-21",
        anchor: new THREE.Vector3(1.2, 0.55, 0.65),
        desc: "Rear pushrod active suspension integrated with Lamborghini Dynamic Steering (LDS) and Rear-Wheel Steering (LRS) actuators.",
        specs: { "Rear Steering": "Up to +/- 3.0° Active Steer", "Damper": "Horizontal Pushrod Unit", "Springs": "High-Tensile Titanium Springs", "Sway Bar": "Tubular Anti-Roll Bar" }
      },
      {
        id: 22,
        file: "22_engine.png",
        name: "6.5L Naturally Aspirated V12",
        subsystem: "POWERTRAIN // ENG-22",
        anchor: new THREE.Vector3(0.6, 0.95, 0),
        desc: "The pinnacle of internal combustion: 6,498 cc 60° naturally aspirated V12 delivering 770 CV at an exhilarating 8,500 RPM screaming exhaust note.",
        specs: { "Displacement": "6,498 cc (6.5 Liters)", "Power Output": "770 CV (566 kW) @ 8,500 RPM", "Torque": "720 Nm @ 6,750 RPM", "0-100 km/h": "2.8 seconds" }
      },
      {
        id: 23,
        file: "23_gearbox.png",
        name: "7-Speed ISR Transmission",
        subsystem: "DRIVETRAIN // GB-23",
        anchor: new THREE.Vector3(-0.15, 0.45, 0),
        desc: "7-Speed Independent Shifting Rods (ISR) automated manual transmission executing gear changes in an astonishing 50 milliseconds.",
        specs: { "Shift Duration": "50 Milliseconds", "Ratios": "7 Forward + 1 Reverse", "Clutch": "Dual-Plate High-Torque Clutch", "Weight": "Only 79 kg (50% lighter than DCT)" }
      },
      {
        id: 24,
        file: "24_exhaust.png",
        name: "Tuned Inconel Central Exhaust",
        subsystem: "EXHAUST // EX-24",
        anchor: new THREE.Vector3(2.1, 0.62, 0),
        desc: "Lightweight Inconel sports exhaust system engineered with short runner geometry and high-exit twin ports for pure acoustics and reduced backpressure.",
        specs: { "Material": "Aerospace Inconel Alloy", "Acoustic Tuning": "Unfiltered V12 Harmonic Frequency", "Weight Reduction": "-7.5 kg vs Standard", "Backpressure Delta": "-42%" }
      },
      {
        id: 25,
        file: "25_chassis.png",
        name: "One-Piece Carbon Monocoque",
        subsystem: "STRUCTURE // CH-25",
        anchor: new THREE.Vector3(0, 0.5, 0),
        desc: "Complete passenger safety cell combining carbon monocoque with front and rear aluminum subframes for maximum crash absorption.",
        specs: { "Structure": "Braided Carbon + RTM Monocoque", "Subframes": "High-Strength Cast Aluminum", "Total Weight": "198 kg with Subframes", "Safety Cell": "Full FIA Compliance" }
      },
      {
        id: 26,
        file: "26_interior_seat.png",
        name: "Carbon Racing Bucket Seat",
        subsystem: "INTERIOR // IN-26",
        anchor: new THREE.Vector3(-0.15, 0.75, 0.35),
        desc: "Contoured racing bucket seat featuring visible matte carbon shell, high-grip Nero Ade Alcantara upholstery, and SVJ cross-stitching.",
        specs: { "Shell": "Structural Carbon Fiber Shell", "Upholstery": "Nero Ade Alcantara", "Harness": "4-Point Racing Harness Ready", "Weight": "11.2 kg" }
      },
      {
        id: 27,
        file: "27_windshield.png",
        name: "Acoustic Double Windscreen",
        subsystem: "GLAZING // GL-27",
        anchor: new THREE.Vector3(-0.75, 1.25, 0),
        desc: "Acoustically laminated ultra-thin windscreen with UV and infrared heat rejection film embedded between glass plies.",
        specs: { "Thickness": "4.2 mm Lightweight Glass", "Heat Rejection": "99% UV / 64% Solar Heat", "Weight": "12.8 kg", "Angle of Rake": "Extreme Low-Drag Slope" }
      },
      {
        id: 28,
        file: "28_left_side_mirror.png",
        name: "Aerodynamic Left Mirror",
        subsystem: "AERO // MR-28",
        anchor: new THREE.Vector3(-0.65, 0.95, 1.05),
        desc: "Sculpted twin-stalk carbon fiber side mirror designed in the wind tunnel to minimize wind resistance while feeding air to rear intakes.",
        specs: { "Housing": "Full Carbon Fiber", "Adjustability": "Electronic Heated & Folding", "Blind Spot": "Embedded Proximity Sensor", "Drag Area": "Minimal 0.038 m²" }
      },
      {
        id: 29,
        file: "29_right_side_mirror.png",
        name: "Aerodynamic Right Mirror",
        subsystem: "AERO // MR-29",
        anchor: new THREE.Vector3(-0.65, 0.95, -1.05),
        desc: "Right carbon aerofoil mirror stalk channeling clean air streams directly into the rear lateral engine cooling radiators.",
        specs: { "Housing": "Full Carbon Fiber", "Aerodynamics": "Airflow Vortex Fin Guide", "Weight": "0.75 kg", "Finish": "High-Gloss Carbon" }
      },
      {
        id: 30,
        file: "30_front_grille.png",
        name: "Hexagonal Cooling Grille",
        subsystem: "COOLING // GR-30",
        anchor: new THREE.Vector3(-2.4, 0.25, 0),
        desc: "Signature Lamborghini hexagonal open-matrix front grille delivering maximum cooling airflow to brake ducts and front heat exchangers.",
        specs: { "Design": "Hexagonal Honeycomb Geometry", "Flow Area": "82% Open Surface Ratio", "Material": "High-Impact Resistant Poly", "Protection": "Stone Deflector Screen" }
      },
      {
        id: 31,
        file: "31_underbody_panel.png",
        name: "Flat Carbon Underfloor Panel",
        subsystem: "AERO // UF-31",
        anchor: new THREE.Vector3(0, -0.15, 0),
        desc: "Flat underbody tray creating uninterrupted laminar flow from front splitter to rear diffuser, generating immense ground effect downforce.",
        specs: { "Material": "Ultra-Smooth Carbon Undertray", "Aero Effect": "Complete Ground Venturi Seal", "Thermal Shields": "Gold Foil Heat Insulation", "Drag Coefficient": "Cd 0.32" }
      },
      {
        id: 32,
        file: "32_radiator.png",
        name: "Side Aluminum Heat Exchanger",
        subsystem: "COOLING // RD-32",
        anchor: new THREE.Vector3(0.85, 0.6, 0.95),
        desc: "Dual high-efficiency side-mounted aluminum radiators engineered to dissipate enormous thermal loads from the 6.5L V12 under track conditions.",
        specs: { "Material": "TIG-Welded Aluminum Core", "Heat Capacity": "140 kW Thermal Rejection", "Coolant Flow": "220 Liters / Minute", "Cooling Air": "Fed by Side NACA Ducts" }
      },
      {
        id: 33,
        file: "33_rear_diffuser.png",
        name: "Secondary Exhaust Shroud Diffuser",
        subsystem: "AERO // EXT-33",
        anchor: new THREE.Vector3(2.35, 0.35, 0),
        desc: "Lower carbon aerodynamic exhaust shroud and thermal diffuser directing high-velocity exhaust gases into the underfloor wake.",
        specs: { "Integration": "Blown Diffuser Aerodynamics", "Thermal Barrier": "Ceramic Heat Barrier Coating", "Aero Balance": "Stabilizes Low-Pressure Wake", "Material": "Dry Carbon Fiber" }
      }
    ];
  }

  initDOMNodes() {
    this.components.forEach((comp) => {
      const node = document.createElement("div");
      node.className = "component-card-node";
      node.dataset.id = comp.id;

      node.innerHTML = `
        <div class="node-pin"></div>
        <div class="component-badge">
          <span class="comp-badge-index">${comp.subsystem}</span>
          <span class="comp-badge-name">${comp.name}</span>
        </div>
      `;

      node.addEventListener("click", () => {
        this.openComponentModal(comp);
      });

      this.container.appendChild(node);
      this.domNodes.push({ element: node, data: comp });
    });
  }

  initModalEvents() {
    const closeBtn = document.getElementById("btn-modal-close");
    const resetBtn = document.getElementById("btn-reset-view");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeComponentModal());
    if (resetBtn) resetBtn.addEventListener("click", () => this.closeComponentModal());
  }

  openComponentModal(comp) {
    this.activeComponent = comp;

    const subCode = document.getElementById("modal-subsystem-code");
    const title = document.getElementById("modal-title");
    const previewImg = document.getElementById("modal-img");
    const desc = document.getElementById("modal-desc");
    const specsGrid = document.getElementById("modal-specs-grid");

    if (subCode) subCode.textContent = comp.subsystem;
    if (title) title.textContent = comp.name;
    if (previewImg) previewImg.src = `./images/${comp.file}`;
    if (desc) desc.textContent = comp.desc;

    if (specsGrid) {
      specsGrid.innerHTML = "";
      Object.entries(comp.specs).forEach(([key, val]) => {
        const item = document.createElement("div");
        item.className = "spec-item";
        item.innerHTML = `
          <div class="spec-label">${key}</div>
          <div class="spec-val">${val}</div>
        `;
        specsGrid.appendChild(item);
      });
    }

    this.modal.classList.add("active");

    // Camera zooms smoothly in on this component
    this.cameraCtrl.focusOnPoint(comp.anchor, 2.2, 1.4);
  }

  closeComponentModal() {
    this.activeComponent = null;
    this.modal.classList.remove("active");
    this.cameraCtrl.moveToPreset("exploded", 1.4);
  }

  update(explosionProgress) {
    if (!this.cameraCtrl || !this.cameraCtrl.camera) return;

    const camera = this.cameraCtrl.camera;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Component labels are visible only during exploded view range (0.28 to 0.85)
    const isVisible = explosionProgress >= 0.28 && explosionProgress <= 0.85;

    let svgPaths = "";

    this.domNodes.forEach(({ element, data }) => {
      if (!isVisible || (this.activeComponent && this.activeComponent.id !== data.id)) {
        element.classList.remove("visible");
        return;
      }

      const worldPos = data.anchor.clone();
      const screenPos = worldPos.clone().project(camera);

      // Check if point is in front of camera
      if (screenPos.z > 1.0) {
        element.classList.remove("visible");
        return;
      }

      const x = (screenPos.x * 0.5 + 0.5) * width;
      const y = (-(screenPos.y * 0.5) + 0.5) * height;

      if (x < 30 || x > width - 30 || y < 50 || y > height - 50) {
        element.classList.remove("visible");
        return;
      }

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.classList.add("visible");

      const originWorld = new THREE.Vector3(0, 0.65, 0);
      const originScreen = originWorld.project(camera);
      const ox = (originScreen.x * 0.5 + 0.5) * width;
      const oy = (-(originScreen.y * 0.5) + 0.5) * height;

      svgPaths += `<line x1="${ox}" y1="${oy}" x2="${x}" y2="${y}" stroke="rgba(0, 210, 255, 0.2)" stroke-width="1" stroke-dasharray="3 3" />`;
    });

    if (this.svgLayer) {
      this.svgLayer.innerHTML = isVisible ? svgPaths : "";
    }
  }
}

window.LabelsController = LabelsController;
