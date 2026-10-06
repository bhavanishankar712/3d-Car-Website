/**
 * ============================================================================
 * LAMBORGHINI AVENTADOR SVJ // PURE HTML 3D SHOWROOM & CONFIGURATOR
 * 100% Pure HTML/CSS/JS - Runs standalone locally via file:// or any host
 * Coordinates 33-component mechanical exploded disassembly, 360° drag physics,
 * real-time paint configurator, volumetric headlights, and Web Audio V12 sound.
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. 33 PRECISION MECHANICAL COMPONENT DATASET & EXPLODED TRAJECTORIES
  // ==========================================================================
  const COMPONENTS_DATA = [
    {
      id: 1,
      file: '01_car_body.png',
      name: 'Carbon Monocoque Outer Shell',
      subsystem: 'CHASSIS // STR-01',
      category: 'body',
      // Coordinates in 780x310 canvas
      base: { left: 0, top: 0, w: 780, h: 310, zIndex: 10 },
      // Exploded 3D Vector
      exploded: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 },
      desc: 'Full single-piece carbon fiber monocoque engineered with aeronautical-grade RTM (Resin Transfer Molding) technology, delivering extraordinary torsional rigidity.',
      specs: { 'Material': 'Carbon-Fiber Composite', 'Torsional Rigidity': '35,000 Nm/deg', 'Dry Weight': '147.5 kg', 'Safety Rating': 'FIA GT Homologated' }
    },
    {
      id: 2,
      file: '02_front_section.png',
      name: 'Active Aero Front Fascia',
      subsystem: 'AERO // ALA-02',
      category: 'paintable',
      base: { left: 0, top: 40, w: 554, h: 305, zIndex: 30 },
      exploded: { x: -220, y: 70, z: 120, rx: 12, ry: -8, rz: -4, scale: 1.05 },
      desc: 'Front aerodynamic nose section featuring integrated ALA 2.0 active micro-flaps that electronically modulate airflow over front splitters in under 500ms.',
      specs: { 'Aero System': 'ALA 2.0 Active Flaps', 'Downforce Gain': '+29% vs S Model', 'Material': 'Autoclaved Prepreg Carbon', 'Actuation Time': '< 500 ms' }
    },
    {
      id: 3,
      file: '03_hood.png',
      name: 'Carbon Fiber Luggage Lid',
      subsystem: 'BODY // EXT-03',
      category: 'paintable',
      base: { left: 58, top: 22, w: 466, h: 305, zIndex: 28 },
      exploded: { x: -140, y: -190, z: 180, rx: 24, ry: -10, rz: 8, scale: 1.08 },
      desc: 'Front carbon luggage compartment hood featuring sculpted dual longitudinal air extraction channels designed to direct airflow across the windscreen.',
      specs: { 'Material': 'Ultra-Thin Carbon Fiber', 'Weight': '6.8 kg', 'Latching': 'Dual Aerospace Pins', 'Air Extraction': 'Twin High-Flow Vents' }
    },
    {
      id: 4,
      file: '04_roof_windshield.png',
      name: 'Greenhouse & Roof Frame',
      subsystem: 'SAFETY // STR-04',
      category: 'body',
      base: { left: 165, top: 2, w: 504, h: 305, zIndex: 32 },
      exploded: { x: 10, y: -260, z: 80, rx: -8, ry: 0, rz: 0, scale: 1.06 },
      desc: 'High-strength roof structural frame engineered with integrated roll-over cage architecture and lightweight acoustic laminated glazing.',
      specs: { 'Material': 'Hydroformed Al-Carbon', 'Impact Resistance': '5.5x Vehicle Weight', 'Acoustic Attenuation': '-3.8 dB Cabin Noise', 'Structure': 'Truss Monocoque Ring' }
    },
    {
      id: 5,
      file: '05_left_door.png',
      name: 'Left Dihedral Scissor Door',
      subsystem: 'COCKPIT // BD-05',
      category: 'paintable',
      base: { left: 210, top: 32, w: 482, h: 270, zIndex: 34 },
      exploded: { x: -50, y: -150, z: 210, rx: 14, ry: 20, rz: -38, scale: 1.1 },
      desc: 'Iconic Lamborghini vertical opening scissor door constructed with full carbon outer skin and high-pressure gas struts for effortless ingress.',
      specs: { 'Door Type': 'Dihedral Scissor', 'Actuator': 'Dual Nitrogen Struts', 'Skin': 'Carbon Fiber Prepreg', 'Opening Angle': '74 Degrees' }
    },
    {
      id: 6,
      file: '06_right_door.png',
      name: 'Right Dihedral Scissor Door',
      subsystem: 'COCKPIT // BD-06',
      category: 'paintable',
      base: { left: 245, top: 22, w: 531, h: 270, zIndex: 12 },
      exploded: { x: 70, y: -120, z: -160, rx: -12, ry: -15, rz: -26, scale: 0.94 },
      desc: 'Right passenger vertical scissor door engineered with ultra-light inner intrusion beam and flush aerodynamic pull-latches.',
      specs: { 'Door Type': 'Dihedral Scissor', 'Inner Core': 'Honeycomb Structural Core', 'Crash Protection': 'Side Intrusion Beam', 'Weight': '8.4 kg per Door' }
    },
    {
      id: 7,
      file: '07_left_headlight.png',
      name: 'Left Bi-LED Headlamp',
      subsystem: 'LIGHTING // LT-07',
      category: 'lighting',
      base: { left: 105, top: 78, w: 362, h: 270, zIndex: 36 },
      exploded: { x: -210, y: -40, z: 150, rx: 10, ry: -6, rz: 5, scale: 1.15 },
      desc: 'High-intensity adaptive Bi-LED headlamp cluster showcasing the signature Y-pattern Daytime Running Light (DRL) and active matrix cornering projector.',
      specs: { 'Technology': 'Adaptive Matrix Bi-LED', 'Luminous Flux': '4,200 Lumens', 'Color Temp': '6,000K Pure Daylight', 'Signature': 'Y-Design Light Guide' }
    },
    {
      id: 8,
      file: '08_right_headlight.png',
      name: 'Right Bi-LED Headlamp',
      subsystem: 'LIGHTING // LT-08',
      category: 'lighting',
      base: { left: 202, top: 62, w: 381, h: 270, zIndex: 20 },
      exploded: { x: -130, y: -60, z: -90, rx: 8, ry: 6, rz: -4, scale: 0.95 },
      desc: 'Right adaptive matrix LED illumination unit with polycarbonate hard-coated lens and dynamic high-beam cornering trajectory adjustment.',
      specs: { 'Technology': 'Adaptive Matrix Bi-LED', 'Luminous Flux': '4,200 Lumens', 'Lens Coating': 'Anti-Scratch Polycarb', 'Voltage': '12V Digital PWM' }
    },
    {
      id: 9,
      file: '09_rear_bumper.png',
      name: 'Rear Aero Bumper Assembly',
      subsystem: 'AERO // EXT-09',
      category: 'paintable',
      base: { left: 330, top: 40, w: 549, h: 270, zIndex: 22 },
      exploded: { x: 260, y: 30, z: -60, rx: -10, ry: 15, rz: 2, scale: 1.04 },
      desc: 'Sculpted rear aerodynamic bumper featuring high-mounted central exhaust cutouts and expansive open honeycomb mesh for rapid engine bay heat extraction.',
      specs: { 'Material': 'Carbon Composite', 'Thermal Resistance': 'Up to 380°C', 'Heat Extraction': '+32% Evacuation', 'Design': 'SVJ High-Exit Architecture' }
    },
    {
      id: 10,
      file: '10_front_left_fender.png',
      name: 'Front Left Sculpted Fender',
      subsystem: 'AERO // BD-10',
      category: 'paintable',
      base: { left: 78, top: 60, w: 450, h: 215, zIndex: 35 },
      exploded: { x: -160, y: -70, z: 180, rx: 12, ry: -14, rz: 6, scale: 1.08 },
      desc: 'Sculpted front left quarter panel with integrated wheel-well pressure relief gills to eliminate aerodynamic lift at extreme track velocities.',
      specs: { 'Function': 'High-Pressure Wheel Arch Relief', 'Weight': '2.9 kg', 'Finish': 'Exposed Carbon Accent', 'Aero Lift Delta': '-18 kg at 250 km/h' }
    },
    {
      id: 11,
      file: '11_front_right_fender.png',
      name: 'Front Right Sculpted Fender',
      subsystem: 'AERO // BD-11',
      category: 'paintable',
      base: { left: 195, top: 42, w: 417, h: 215, zIndex: 18 },
      exploded: { x: -80, y: -80, z: -110, rx: 8, ry: 12, rz: -6, scale: 0.95 },
      desc: 'Sculpted front right fender designed to harmonize airflow between front air dams and side cooling radiators.',
      specs: { 'Function': 'Airflow Guidance & Lift Mitigation', 'Weight': '2.9 kg', 'Material': 'Carbon Fiber', 'Structure': 'Direct Bolt Subframe Mount' }
    },
    {
      id: 12,
      file: '12_spoiler.png',
      name: 'ALA 2.0 Active Rear Wing',
      subsystem: 'AERO // ALA-12',
      category: 'carbon',
      base: { left: 345, top: 0, w: 512, h: 215, zIndex: 38 },
      exploded: { x: 230, y: -230, z: -30, rx: 18, ry: 10, rz: 6, scale: 1.15 },
      desc: 'Aerodinamica Lamborghini Attiva 2.0 rear wing with twin central hollow pylons and internal electro-actuated micro-valves for Aero-Vectoring.',
      specs: { 'Max Downforce': '490 kg at 300 km/h', 'Aero-Vectoring': 'Independent Left/Right', 'Structure': 'Forged Carbon Core', 'Weight': '4.2 kg Complete' }
    },
    {
      id: 13,
      file: '13_side_skirt.png',
      name: 'Ground-Effect Side Skirt',
      subsystem: 'AERO // EXT-13',
      category: 'paintable',
      base: { left: 245, top: 125, w: 422, h: 215, zIndex: 26 },
      exploded: { x: 30, y: 110, z: 140, rx: -15, ry: 8, rz: 2, scale: 1.05 },
      desc: 'Carbon fiber ground-effect longitudinal skirt with integrated vertical vortex fins directing clean turbulent-free air around the rear tires.',
      specs: { 'Material': 'Autoclaved Carbon', 'Function': 'Underfloor Seal & Vortex Control', 'Length': '2,150 mm', 'Ground Margin': 'Optimized Venturi Gap' }
    },
    {
      id: 14,
      file: '14_rear_diffuser.png',
      name: 'High-Downforce Rear Diffuser',
      subsystem: 'AERO // EXT-14',
      category: 'carbon',
      base: { left: 395, top: 110, w: 504, h: 215, zIndex: 24 },
      exploded: { x: 290, y: 95, z: -40, rx: -18, ry: 12, rz: 4, scale: 1.05 },
      desc: 'Aggressive multi-tunnel carbon rear diffuser utilizing Bernoulli effect to extract air beneath the flat undertray, gluing the rear axle to the tarmac.',
      specs: { 'Expansion Angle': '14.5 Degrees', 'Material': 'Thermal-Coated Carbon', 'Tunnels': '4 Venturi Channels', 'Downforce Share': '38% Total Rear Aero' }
    },
    {
      id: 15,
      file: '15_wheel_01.png',
      name: 'Front Left Leirion Forged Wheel',
      subsystem: 'CHASSIS // WH-15',
      category: 'wheel',
      base: { left: 165, top: 90, w: 342, h: 282, zIndex: 40 },
      exploded: { x: -160, y: 85, z: 240, rx: 6, ry: -14, rz: 0, scale: 1.12 },
      desc: 'Ultra-lightweight central-locking forged aluminum wheel designed with directional aerodynamic spokes for brake cooling extraction.',
      specs: { 'Dimension': '9J x 20 Inch', 'Nut Type': 'Center-Lock Aerospace Nut', 'Tire': '255/30 ZR20 Pirelli Corsa', 'Weight': '8.9 kg' }
    },
    {
      id: 16,
      file: '16_wheel_02.png',
      name: 'Front Right Leirion Forged Wheel',
      subsystem: 'CHASSIS // WH-16',
      category: 'wheel',
      base: { left: 140, top: 68, w: 322, h: 282, zIndex: 8 },
      exploded: { x: -110, y: 25, z: -200, rx: 4, ry: 10, rz: 0, scale: 0.9 },
      desc: 'Right front 20-inch monoblock forged alloy wheel precision-milled from aerospace 6061-T6 aluminum billet.',
      specs: { 'Dimension': '9J x 20 Inch', 'Material': 'Forged 6061-T6 Aluminum', 'Finish': 'Satin Nero Matt', 'Rigidity': 'High Lateral Camber Stiffness' }
    },
    {
      id: 17,
      file: '17_wheel_03.png',
      name: 'Rear Left Super-Wide Wheel',
      subsystem: 'CHASSIS // WH-17',
      category: 'wheel',
      base: { left: 470, top: 82, w: 310, h: 282, zIndex: 40 },
      exploded: { x: 190, y: 70, z: 250, rx: 8, ry: -12, rz: 0, scale: 1.12 },
      desc: 'Deep concave 21-inch rear wheel delivering immense mechanical grip to harness all 770 CV through all-wheel-drive Haldex coupling.',
      specs: { 'Dimension': '13J x 21 Inch', 'Tire Spec': '355/25 ZR21 Ultra-Wide', 'Offset': 'ET 66.7 mm', 'Mass': '11.4 kg' }
    },
    {
      id: 18,
      file: '18_wheel_04.png',
      name: 'Rear Right Super-Wide Wheel',
      subsystem: 'CHASSIS // WH-18',
      category: 'wheel',
      base: { left: 450, top: 60, w: 309, h: 282, zIndex: 8 },
      exploded: { x: 230, y: 15, z: -190, rx: 6, ry: 8, rz: 0, scale: 0.9 },
      desc: 'Right rear 21-inch ultra-wide wheel engineered to sustain lateral forces exceeding 1.5G on high-speed track sweeps.',
      specs: { 'Dimension': '13J x 21 Inch', 'Hub Lock Torque': '600 Nm', 'Lateral Load': '12,000 N Max', 'Finish': 'Satin Nero Matt' }
    },
    {
      id: 19,
      file: '19_brake_disc_caliper.png',
      name: 'Carbon Ceramic Brake System',
      subsystem: 'BRAKES // BR-19',
      category: 'caliper',
      base: { left: 215, top: 95, w: 286, h: 282, zIndex: 38 },
      exploded: { x: -85, y: 75, z: 150, rx: 0, ry: -12, rz: 0, scale: 1.05 },
      desc: 'Massive 400mm carbon ceramic ventilated rotor clamped by a 6-piston aluminum monobloc Brembo caliper in Rosso Mars racing red.',
      specs: { 'Rotor': '400 mm Front / 380 mm Rear', 'Caliper': '6-Piston Monobloc', 'Stopping 100-0': '30.0 meters', 'Fade Resistance': 'Zero Fade at 950°C' }
    },
    {
      id: 20,
      file: '20_suspension_01.png',
      name: 'Front Pushrod Suspension',
      subsystem: 'SUSPENSION // SP-20',
      category: 'mechanical',
      base: { left: 245, top: 88, w: 304, h: 282, zIndex: 25 },
      exploded: { x: -60, y: 40, z: 90, rx: -5, ry: 0, rz: 0, scale: 1.0 },
      desc: 'Formula 1 inspired horizontal pushrod magnetorheological shock absorber system with adjustable electronic damping response.',
      specs: { 'Architecture': 'Inboard Pushrod Double Wishbone', 'Damper': 'Magnetorheological Active', 'Sampling': '1,000 Hz Sampling Rate', 'Geometry': 'Zero Anti-Dive Angle' }
    },
    {
      id: 21,
      file: '21_suspension_02.png',
      name: 'Rear Pushrod & LDS Damper',
      subsystem: 'SUSPENSION // SP-21',
      category: 'mechanical',
      base: { left: 420, top: 78, w: 429, h: 282, zIndex: 25 },
      exploded: { x: 120, y: 35, z: 110, rx: 5, ry: 0, rz: 0, scale: 1.0 },
      desc: 'Rear pushrod active suspension integrated with Lamborghini Dynamic Steering (LDS) and Rear-Wheel Steering (LRS) actuators.',
      specs: { 'Rear Steering': '+/- 3.0° Active Steer', 'Damper': 'Horizontal Pushrod Unit', 'Springs': 'High-Tensile Titanium', 'Sway Bar': 'Tubular Anti-Roll Bar' }
    },
    {
      id: 22,
      file: '22_engine.png',
      name: '6.5L Naturally Aspirated V12',
      subsystem: 'POWERTRAIN // ENG-22',
      category: 'mechanical',
      base: { left: 340, top: 48, w: 405, h: 274, zIndex: 23 },
      exploded: { x: 110, y: -110, z: -20, rx: -15, ry: 10, rz: 4, scale: 1.1 },
      desc: 'The pinnacle of internal combustion: 6,498 cc 60° naturally aspirated V12 delivering 770 CV at an exhilarating 8,500 RPM screaming exhaust note.',
      specs: { 'Displacement': '6,498 cc (6.5 Liters)', 'Power': '770 CV (566 kW) @ 8,500 RPM', 'Torque': '720 Nm @ 6,750 RPM', '0-100 km/h': '2.8 seconds' }
    },
    {
      id: 23,
      file: '23_gearbox.png',
      name: '7-Speed ISR Transmission',
      subsystem: 'DRIVETRAIN // GB-23',
      category: 'mechanical',
      base: { left: 295, top: 72, w: 382, h: 274, zIndex: 21 },
      exploded: { x: 50, y: 30, z: -40, rx: 0, ry: 0, rz: 0, scale: 1.0 },
      desc: '7-Speed Independent Shifting Rods (ISR) automated manual transmission executing gear changes in an astonishing 50 milliseconds.',
      specs: { 'Shift Duration': '50 Milliseconds', 'Ratios': '7 Forward + 1 Reverse', 'Clutch': 'Dual-Plate High-Torque', 'Weight': 'Only 79 kg (50% lighter than DCT)' }
    },
    {
      id: 24,
      file: '24_exhaust.png',
      name: 'Tuned Inconel Central Exhaust',
      subsystem: 'EXHAUST // EX-24',
      category: 'mechanical',
      base: { left: 410, top: 58, w: 477, h: 274, zIndex: 22 },
      exploded: { x: 230, y: -45, z: -50, rx: 10, ry: 14, rz: 0, scale: 1.05 },
      desc: 'Lightweight Inconel sports exhaust system engineered with short runner geometry and high-exit twin ports for pure acoustics and reduced backpressure.',
      specs: { 'Material': 'Aerospace Inconel Alloy', 'Acoustic Tuning': 'Unfiltered V12 Harmonic', 'Weight Delta': '-7.5 kg vs Standard', 'Backpressure': '-42% Resistance' }
    },
    {
      id: 25,
      file: '25_chassis.png',
      name: 'One-Piece Carbon Monocoque',
      subsystem: 'STRUCTURE // CH-25',
      category: 'mechanical',
      base: { left: 160, top: 48, w: 528, h: 274, zIndex: 20 },
      exploded: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1.0 },
      desc: 'Complete passenger safety cell combining carbon monocoque with front and rear aluminum subframes for maximum crash absorption.',
      specs: { 'Structure': 'Braided Carbon + RTM Monocoque', 'Subframes': 'High-Strength Cast Aluminum', 'Total Weight': '198 kg with Subframes', 'Safety Cell': 'Full FIA Compliance' }
    },
    {
      id: 26,
      file: '26_interior_seat.png',
      name: 'Carbon Racing Bucket Seats',
      subsystem: 'INTERIOR // IN-26',
      category: 'interior',
      base: { left: 230, top: 40, w: 511, h: 274, zIndex: 24 },
      exploded: { x: -20, y: -35, z: 45, rx: 0, ry: 0, rz: 0, scale: 1.02 },
      desc: 'Contoured racing bucket seat featuring visible matte carbon shell, high-grip Nero Ade Alcantara upholstery, and SVJ cross-stitching.',
      specs: { 'Shell': 'Structural Carbon Fiber Shell', 'Upholstery': 'Nero Ade Alcantara', 'Harness': '4-Point Racing Harness Ready', 'Weight': '11.2 kg' }
    },
    {
      id: 27,
      file: '27_windshield.png',
      name: 'Acoustic Double Windscreen',
      subsystem: 'GLAZING // GL-27',
      category: 'body',
      base: { left: 160, top: 38, w: 430, h: 190, zIndex: 33 },
      exploded: { x: -45, y: -170, z: 90, rx: 15, ry: -4, rz: 2, scale: 1.05 },
      desc: 'Acoustically laminated ultra-thin windscreen with UV and infrared heat rejection film embedded between glass plies.',
      specs: { 'Thickness': '4.2 mm Lightweight Glass', 'Heat Rejection': '99% UV / 64% Solar Heat', 'Weight': '12.8 kg', 'Angle': 'Extreme Low-Drag Slope' }
    },
    {
      id: 28,
      file: '28_left_side_mirror.png',
      name: 'Aerodynamic Left Mirror',
      subsystem: 'AERO // MR-28',
      category: 'carbon',
      base: { left: 240, top: 58, w: 195, h: 190, zIndex: 36 },
      exploded: { x: -75, y: -65, z: 195, rx: 10, ry: 20, rz: -10, scale: 1.15 },
      desc: 'Sculpted twin-stalk carbon fiber side mirror designed in the wind tunnel to minimize wind resistance while feeding air to rear intakes.',
      specs: { 'Housing': 'Full Carbon Fiber', 'Adjustability': 'Electronic Heated & Folding', 'Blind Spot': 'Embedded Proximity Sensor', 'Drag Area': 'Minimal 0.038 m²' }
    },
    {
      id: 29,
      file: '29_right_side_mirror.png',
      name: 'Aerodynamic Right Mirror',
      subsystem: 'AERO // MR-29',
      category: 'carbon',
      base: { left: 320, top: 32, w: 174, h: 190, zIndex: 11 },
      exploded: { x: 20, y: -85, z: -140, rx: -10, ry: -15, rz: 10, scale: 0.95 },
      desc: 'Right carbon aerofoil mirror stalk channeling clean air streams directly into the rear lateral engine cooling radiators.',
      specs: { 'Housing': 'Full Carbon Fiber', 'Aerodynamics': 'Airflow Vortex Fin Guide', 'Weight': '0.75 kg', 'Finish': 'High-Gloss Carbon' }
    },
    {
      id: 30,
      file: '30_front_grille.png',
      name: 'Hexagonal Cooling Grille',
      subsystem: 'COOLING // GR-30',
      category: 'mechanical',
      base: { left: 55, top: 75, w: 406, h: 190, zIndex: 29 },
      exploded: { x: -270, y: 30, z: 60, rx: 10, ry: -6, rz: 0, scale: 1.0 },
      desc: 'Signature Lamborghini hexagonal open-matrix front grille delivering maximum cooling airflow to brake ducts and front heat exchangers.',
      specs: { 'Design': 'Hexagonal Honeycomb Geometry', 'Flow Area': '82% Open Surface Ratio', 'Material': 'High-Impact Resistant Poly', 'Protection': 'Stone Deflector Screen' }
    },
    {
      id: 31,
      file: '31_underbody_panel.png',
      name: 'Flat Carbon Underfloor Panel',
      subsystem: 'AERO // UF-31',
      category: 'mechanical',
      base: { left: 240, top: 120, w: 331, h: 190, zIndex: 19 },
      exploded: { x: 20, y: 135, z: 0, rx: -20, ry: 0, rz: 0, scale: 1.0 },
      desc: 'Flat underbody tray creating uninterrupted laminar flow from front splitter to rear diffuser, generating immense ground effect downforce.',
      specs: { 'Material': 'Ultra-Smooth Carbon Undertray', 'Aero Effect': 'Complete Ground Venturi Seal', 'Thermal Shields': 'Gold Foil Heat Insulation', 'Drag': 'Cd 0.32' }
    },
    {
      id: 32,
      file: '32_radiator.png',
      name: 'Side Aluminum Heat Exchanger',
      subsystem: 'COOLING // RD-32',
      category: 'mechanical',
      base: { left: 320, top: 68, w: 304, h: 190, zIndex: 21 },
      exploded: { x: 45, y: -10, z: 75, rx: 0, ry: 8, rz: 0, scale: 1.0 },
      desc: 'Dual high-efficiency side-mounted aluminum radiators engineered to dissipate enormous thermal loads from the 6.5L V12 under track conditions.',
      specs: { 'Material': 'TIG-Welded Aluminum Core', 'Heat Capacity': '140 kW Thermal Rejection', 'Coolant Flow': '220 Liters / Minute', 'Cooling Air': 'Fed by Side NACA Ducts' }
    },
    {
      id: 33,
      file: '33_rear_diffuser.png',
      name: 'Secondary Exhaust Shroud Diffuser',
      subsystem: 'AERO // EXT-33',
      category: 'carbon',
      base: { left: 380, top: 115, w: 441, h: 154, zIndex: 23 },
      exploded: { x: 265, y: 130, z: -25, rx: -15, ry: 10, rz: 0, scale: 1.02 },
      desc: 'Lower carbon aerodynamic exhaust shroud and thermal diffuser directing high-velocity exhaust gases into the underfloor wake.',
      specs: { 'Integration': 'Blown Diffuser Aerodynamics', 'Thermal Barrier': 'Ceramic Heat Barrier Coating', 'Aero Balance': 'Stabilizes Low-Pressure Wake', 'Material': 'Dry Carbon Fiber' }
    }
  ];

  // ==========================================================================
  // 2. COLOR PALETTES & CONFIGURATOR SPECIFICATIONS
  // ==========================================================================
  const COLOR_PALETTES = {
    'grigio': {
      name: 'Grigio Titans',
      hex: '#b8c2cc',
      filter: 'none',
      code: 'EXT-GRIGIO'
    },
    'rosso': {
      name: 'Rosso Mars',
      hex: '#d61827',
      // Photorealistic deep racing red on metallic silver
      filter: 'hue-rotate(332deg) saturate(3.4) contrast(1.15) brightness(0.92)',
      code: 'EXT-ROSSO'
    },
    'verde': {
      name: 'Verde Ithaca',
      hex: '#28e010',
      // Iconic SVJ Acid Lime Green
      filter: 'hue-rotate(85deg) saturate(3.8) contrast(1.1) brightness(1.05)',
      code: 'EXT-VERDE'
    },
    'giallo': {
      name: 'Giallo Modena',
      hex: '#ffd700',
      // High-octane Italian Yellow
      filter: 'hue-rotate(42deg) saturate(4.2) contrast(1.18) brightness(1.12)',
      code: 'EXT-GIALLO'
    },
    'blu': {
      name: 'Blu Cepheus',
      hex: '#00c3ff',
      // Electric Pearl Cyan
      filter: 'hue-rotate(185deg) saturate(2.6) contrast(1.08) brightness(1.06)',
      code: 'EXT-BLU'
    },
    'arancio': {
      name: 'Arancio Argos',
      hex: '#ff5500',
      // Pearl Lambo Orange
      filter: 'hue-rotate(16deg) saturate(3.2) contrast(1.12) brightness(0.98)',
      code: 'EXT-ARANCIO'
    },
    'bianco': {
      name: 'Bianco Monocerus',
      hex: '#f5f7fa',
      // Clean Pearl Ice White
      filter: 'saturate(0) brightness(1.35) contrast(1.08)',
      code: 'EXT-BIANCO'
    },
    'nero': {
      name: 'Nero Pegaso',
      hex: '#111317',
      // Deep Obsidian Carbon Black
      filter: 'saturate(0.2) brightness(0.38) contrast(1.35)',
      code: 'EXT-NERO'
    }
  };

  const WHEEL_FINISHES = {
    'satin-nero': { name: 'Satin Nero', filter: 'brightness(0.65) contrast(1.2)' },
    'titanium': { name: 'Matte Titanium', filter: 'brightness(0.9) contrast(1.05)' },
    'silver': { name: 'Diamond Silver', filter: 'brightness(1.25) contrast(1.15)' },
    'gold': { name: 'Hyper Gold', filter: 'sepia(0.85) hue-rotate(5deg) saturate(2.2) brightness(0.95)' }
  };

  const CALIPER_COLORS = {
    'rosso': { name: 'Rosso Mars Red', filter: 'hue-rotate(330deg) saturate(3.5)' },
    'giallo': { name: 'Giallo Modena Yellow', filter: 'hue-rotate(45deg) saturate(3.8) brightness(1.1)' },
    'verde': { name: 'Acid Green', filter: 'hue-rotate(90deg) saturate(3.5)' },
    'nero': { name: 'Gloss Nero', filter: 'brightness(0.4) saturate(0)' }
  };

  // ==========================================================================
  // 3. SHOWROOM APPLICATION CONTROLLER CLASS
  // ==========================================================================
  class PureShowroomApp {
    constructor() {
      // DOM Elements
      this.stageWorld = document.getElementById('stage-3d-world');
      this.assembly = document.getElementById('car-assembly-3d');
      this.scaler = document.querySelector('.car-assembly-scaler');
      this.masterBody = document.getElementById('part-master-body');
      this.componentsGroup = document.getElementById('exploded-components-group');
      this.pinsContainer = document.getElementById('part-pins-container');
      this.headlightLenses = document.querySelectorAll('.headlight-lens');
      this.headlightBeams = document.querySelectorAll('.headlight-floor-beam');
      this.preloader = document.getElementById('preloader');
      this.drawer = document.getElementById('component-drawer');
      this.toast = document.getElementById('toast-pill');

      // State Variables
      this.scrollProgress = 0;
      this.isNightMode = true;
      this.headlightsOn = true;
      this.autoRotate = false;
      this.activeComponent = null;

      // Current Config Spec
      this.currentSpec = {
        paint: 'grigio',
        wheelStyle: 'style-01',
        wheelFinish: 'satin-nero',
        caliper: 'rosso',
        cockpit: 'alcantara'
      };

      // 360° Drag & Inertia Physics
      this.rotY = -22; // Natural dynamic 3/4 perspective
      this.rotX = 6;
      this.targetRotY = -22;
      this.targetRotX = 6;
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.velocityX = 0;
      this.velocityY = 0;

      // Audio System
      this.audioCtx = null;
      this.soundEnabled = false;

      // Component DOM references
      this.partElements = [];
      this.pinElements = [];

      this.init();
    }

    init() {
      this.buildComponentsDOM();
      this.bindWindowEvents();
      this.bindDragEvents();
      this.bindScrollEvents();
      this.bindConfiguratorEvents();
      this.bindAudioEvents();
      this.bindKeyboardEvents();
      this.bindNavEvents();
      this.renderLoop();
      this.dismissPreloader();
    }

    // Dismiss Preloader with hardware telemetry countdown
    dismissPreloader() {
      const bar = document.getElementById('loader-bar-fill');
      const percentEl = document.getElementById('loader-percent');
      const statusEl = document.getElementById('loader-status-text');

      const steps = [
        { pct: 20, text: 'CALIBRATING V12 MONOCOQUE...' },
        { pct: 50, text: 'INITIALIZING 33-COMPONENT DISASSEMBLY ENGINE...' },
        { pct: 80, text: 'CONFIGURING ALA 2.0 AERODYNAMICS...' },
        { pct: 100, text: 'TELEMETRY SYSTEM ONLINE' }
      ];

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          const s = steps[stepIdx];
          if (bar) bar.style.width = `${s.pct}%`;
          if (percentEl) percentEl.textContent = `${s.pct}%`;
          if (statusEl) statusEl.textContent = s.text;
          stepIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            if (this.preloader) {
              this.preloader.classList.add('loaded');
            }
          }, 350);
        }
      }, 160);
    }

    // ========================================================================
    // DOM CONSTRUCTION FOR ALL 33 PRECISION MECHANICAL COMPONENTS
    // ========================================================================
    buildComponentsDOM() {
      if (!this.componentsGroup || !this.pinsContainer) return;

      this.componentsGroup.innerHTML = '';
      this.pinsContainer.innerHTML = '';

      COMPONENTS_DATA.forEach((comp) => {
        // Skip base master body from exploded layers (rendered separately)
        if (comp.id === 1) return;

        // 1. Part Element
        const partEl = document.createElement('div');
        partEl.className = `exploded-part part-${comp.id}`;
        partEl.dataset.id = comp.id;
        partEl.dataset.category = comp.category;

        // Base styles
        partEl.style.width = `${comp.base.w}px`;
        partEl.style.height = `${comp.base.h}px`;
        partEl.style.left = `${comp.base.left}px`;
        partEl.style.top = `${comp.base.top}px`;
        partEl.style.zIndex = comp.base.zIndex;
        partEl.style.opacity = '0'; // Hidden initially, fades in on scroll

        const img = document.createElement('img');
        img.src = `./images/${comp.file}`;
        img.alt = comp.name;
        img.draggable = false;
        partEl.appendChild(img);

        // Click to inspect
        partEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openInspectionDrawer(comp);
        });

        this.componentsGroup.appendChild(partEl);

        // 2. HUD Pin Marker
        const pinEl = document.createElement('div');
        pinEl.className = `part-hud-pin pin-${comp.id}`;
        pinEl.dataset.id = comp.id;
        pinEl.innerHTML = `
          <div class="pin-dot"></div>
          <div class="pin-tag"><span>[${String(comp.id).padStart(2, '0')}]</span>${comp.name}</div>
        `;

        pinEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openInspectionDrawer(comp);
        });

        this.pinsContainer.appendChild(pinEl);

        // Store references
        this.partElements.push({ data: comp, el: partEl });
        this.pinElements.push({ data: comp, el: pinEl });
      });
    }

    // ========================================================================
    // SCROLL INTERPOLATION & 33 MECHANICAL DISASSEMBLY TRAJECTORIES
    // ========================================================================
    bindScrollEvents() {
      const scrollTrack = document.getElementById('scroll-track');
      const counterEl = document.getElementById('exploded-counter-val');
      const meterFill = document.getElementById('exploded-meter-fill');
      const explodedHUD = document.querySelector('.exploded-telemetry-hud');
      const reassemblyCard = document.querySelector('.reassembly-card');
      const heroCard = document.querySelector('.hero-telemetry-card');
      const scrollHint = document.querySelector('.scroll-invite-hint');

      const onScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = (scrollTrack ? scrollTrack.offsetHeight : 3000) - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

        this.scrollProgress = progress;

        // 1. Update Master Body vs Exploded Components Fade
        if (this.masterBody) {
          // Master body visible at top, dissolves cleanly between 0.02 and 0.16
          const masterOpacity = Math.max(0, 1 - (progress * 7));
          this.masterBody.style.opacity = masterOpacity.toFixed(3);
          this.masterBody.style.pointerEvents = masterOpacity > 0.5 ? 'auto' : 'none';
        }

        // 2. Explode Each Component along its 3D Trajectory
        const explodeFactor = Math.min(1, Math.max(0, (progress - 0.04) / 0.65));
        const explodedPct = Math.round(explodeFactor * 100);

        if (counterEl) counterEl.textContent = `${explodedPct}% EXPLODED`;
        if (meterFill) meterFill.style.width = `${explodedPct}%`;

        // Telemetry HUD visibility
        if (explodedHUD) {
          if (progress > 0.08 && progress < 0.88) {
            explodedHUD.classList.add('active');
          } else {
            explodedHUD.classList.remove('active');
          }
        }

        // Hero card fade
        if (heroCard) {
          heroCard.style.opacity = Math.max(0, 1 - (progress * 5));
          heroCard.style.pointerEvents = progress > 0.15 ? 'none' : 'auto';
        }

        if (scrollHint) {
          scrollHint.style.opacity = Math.max(0, 1 - (progress * 5));
        }

        // Reassembly card visibility
        if (reassemblyCard) {
          if (progress > 0.82) {
            reassemblyCard.classList.add('active');
          } else {
            reassemblyCard.classList.remove('active');
          }
        }

        // Apply Trajectories to all 32 exploded parts
        this.partElements.forEach(({ data, el }) => {
          // Fade in parts smoothly as master dissolves
          const partOpacity = Math.min(1, progress * 8);
          el.style.opacity = partOpacity.toFixed(3);

          // Interpolate 3D coordinates
          const tx = data.exploded.x * explodeFactor;
          const ty = data.exploded.y * explodeFactor;
          const tz = data.exploded.z * explodeFactor;
          const rx = data.exploded.rx * explodeFactor;
          const ry = data.exploded.ry * explodeFactor;
          const rz = data.exploded.rz * explodeFactor;
          const sc = 1 + (data.exploded.scale - 1) * explodeFactor;

          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        });

        // Update Pin Markers Visibility & Positions
        this.pinElements.forEach(({ data, el }) => {
          if (explodeFactor > 0.35 && progress < 0.82) {
            el.classList.add('visible');
            // Position pin near part
            const tx = data.base.left + (data.base.w * 0.45) + (data.exploded.x * explodeFactor);
            const ty = data.base.top + (data.base.h * 0.4) + (data.exploded.y * explodeFactor);
            el.style.left = `${tx.toFixed(0)}px`;
            el.style.top = `${ty.toFixed(0)}px`;
          } else {
            el.classList.remove('visible');
          }
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // initial trigger
    }

    // ========================================================================
    // 360° DRAG & INERTIAL ROTATION PHYSICS
    // ========================================================================
    bindDragEvents() {
      if (!this.stageWorld) return;

      const onPointerDown = (e) => {
        // Only drag on stage, not on buttons or dock
        if (e.target.closest('#configurator-dock') || e.target.closest('#component-drawer') || e.target.closest('.hero-header-bar') || e.target.closest('.hero-telemetry-card')) {
          return;
        }

        this.isDragging = true;
        this.stageWorld.classList.add('grabbing');
        this.lastMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        this.lastMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.velocityX = 0;
        this.velocityY = 0;
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;

        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        const deltaX = currentX - this.lastMouseX;
        const deltaY = currentY - this.lastMouseY;

        this.velocityX = deltaX * 0.45;
        this.velocityY = deltaY * 0.25;

        this.targetRotY += this.velocityX;
        // Clamp vertical angle to realistic automotive presentation bounds (-16deg to 24deg)
        this.targetRotX = Math.max(-16, Math.min(24, this.targetRotX - this.velocityY));

        this.lastMouseX = currentX;
        this.lastMouseY = currentY;
      };

      const onPointerUp = () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.stageWorld.classList.remove('grabbing');
        }
      };

      this.stageWorld.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      // Touch events for mobile/tablet
      this.stageWorld.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    }

    // 60fps Animation Loop with Physics Smoothing
    renderLoop() {
      const tick = () => {
        // Auto-rotation when enabled
        if (this.autoRotate && !this.isDragging) {
          this.targetRotY += 0.32;
        }

        // Apply inertia decay when released
        if (!this.isDragging) {
          this.velocityX *= 0.92;
          this.velocityY *= 0.92;
          this.targetRotY += this.velocityX;
          this.targetRotX = Math.max(-16, Math.min(24, this.targetRotX - this.velocityY));
        }

        // Smooth Lerp towards target
        this.rotY += (this.targetRotY - this.rotY) * 0.12;
        this.rotX += (this.targetRotX - this.rotX) * 0.12;

        if (this.assembly) {
          this.assembly.style.transform = `rotateX(${this.rotX.toFixed(2)}deg) rotateY(${this.rotY.toFixed(2)}deg)`;
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }

    // Responsive scaling on resize
    bindWindowEvents() {
      const handleResize = () => {
        const w = window.innerWidth;
        if (!this.scaler) return;

        let scale = 1;
        if (w < 500) {
          scale = 0.52;
        } else if (w < 768) {
          scale = 0.68;
        } else if (w < 980) {
          scale = 0.84;
        } else {
          scale = 1.0;
        }

        this.scaler.style.transform = `scale(${scale})`;
      };

      window.addEventListener('resize', handleResize);
      handleResize();
    }

    // ========================================================================
    // 4. CONFIGURATOR CONTROLS & REAL-TIME AUTOMOTIVE PAINT ENGINE
    // ========================================================================
    bindConfiguratorEvents() {
      // 1. Tab Switching
      const tabBtns = document.querySelectorAll('.dock-tab-btn');
      const panes = document.querySelectorAll('.dock-pane');

      tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          tabBtns.forEach((b) => b.classList.remove('active'));
          panes.forEach((p) => p.classList.remove('active'));

          btn.classList.add('active');
          const targetPane = document.getElementById(`pane-${tab}`);
          if (targetPane) targetPane.classList.add('active');
          this.playClickSound();
        });
      });

      // 2. Body Paint Swatches
      const paintSwatches = document.querySelectorAll('#pane-paint .swatch-pill');
      const paintLabel = document.getElementById('label-body-color');

      paintSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          const colorKey = swatch.dataset.color;
          const palette = COLOR_PALETTES[colorKey];
          if (!palette) return;

          paintSwatches.forEach((s) => s.classList.remove('active'));
          swatch.classList.add('active');

          if (paintLabel) paintLabel.textContent = palette.name;
          this.currentSpec.paint = colorKey;

          this.applyPaintColor(palette);
          this.updateBuildCode();
          this.showToast(`Exterior Paint: ${palette.name}`);
          this.playClickSound();
        });
      });

      // 3. Wheel Styles
      const wheelCards = document.querySelectorAll('#pane-wheels .card-option-btn');
      wheelCards.forEach((card) => {
        card.addEventListener('click', () => {
          wheelCards.forEach((c) => c.classList.remove('active'));
          card.classList.add('active');
          this.currentSpec.wheelStyle = card.dataset.style;
          this.updateBuildCode();
          this.showToast(`Forged Wheels: ${card.textContent.trim()}`);
          this.playClickSound();
        });
      });

      // 4. Wheel Finish Swatches
      const finishSwatches = document.querySelectorAll('#pane-wheel-color .swatch-pill');
      const finishLabel = document.getElementById('label-wheel-color');

      finishSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          const finishKey = swatch.dataset.finish;
          const finish = WHEEL_FINISHES[finishKey];
          if (!finish) return;

          finishSwatches.forEach((s) => s.classList.remove('active'));
          swatch.classList.add('active');

          if (finishLabel) finishLabel.textContent = finish.name;
          this.currentSpec.wheelFinish = finishKey;

          this.applyWheelFinish(finish);
          this.updateBuildCode();
          this.showToast(`Wheel Finish: ${finish.name}`);
          this.playClickSound();
        });
      });

      // 5. Caliper Swatches
      const caliperSwatches = document.querySelectorAll('#pane-calipers .swatch-pill');
      const caliperLabel = document.getElementById('label-caliper-color');

      caliperSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          const calKey = swatch.dataset.caliper;
          const cal = CALIPER_COLORS[calKey];
          if (!cal) return;

          caliperSwatches.forEach((s) => s.classList.remove('active'));
          swatch.classList.add('active');

          if (caliperLabel) caliperLabel.textContent = cal.name;
          this.currentSpec.caliper = calKey;

          this.applyCaliperColor(cal);
          this.updateBuildCode();
          this.showToast(`Caliper Finish: ${cal.name}`);
          this.playClickSound();
        });
      });

      // 6. Cockpit Upholstery
      const cockpitSwatches = document.querySelectorAll('#pane-interior .swatch-pill');
      const cockpitLabel = document.getElementById('label-interior-color');

      cockpitSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          cockpitSwatches.forEach((s) => s.classList.remove('active'));
          swatch.classList.add('active');
          const name = swatch.dataset.name;
          if (cockpitLabel) cockpitLabel.textContent = name;
          this.currentSpec.cockpit = swatch.dataset.interior;
          this.updateBuildCode();
          this.showToast(`Cockpit Trim: ${name}`);
          this.playClickSound();
        });
      });

      // 7. Save Specification Button
      const saveBtn = document.getElementById('btn-save-build');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const code = document.getElementById('build-code-value');
          const str = code ? code.textContent : 'SVJ-CUSTOM';
          this.showToast(`Spec Saved: ${str}`);
          this.playClickSound();
        });
      }

      // 8. Quick Actions: Headlights Toggle
      const lightsBtn = document.getElementById('btn-lights-toggle');
      if (lightsBtn) {
        lightsBtn.addEventListener('click', () => {
          this.headlightsOn = !this.headlightsOn;
          lightsBtn.classList.toggle('active', this.headlightsOn);
          this.toggleHeadlights(this.headlightsOn);
          this.playRelaySound();
          this.showToast(this.headlightsOn ? 'Headlights: ON' : 'Headlights: OFF');
        });
      }

      // 9. Quick Actions: Day / Night Mode Toggle
      const dayNightBtn = document.getElementById('btn-daynight-toggle');
      if (dayNightBtn) {
        dayNightBtn.addEventListener('click', () => {
          this.isNightMode = !this.isNightMode;
          document.body.classList.toggle('day-mode', !this.isNightMode);
          dayNightBtn.classList.toggle('active', !this.isNightMode);
          const span = dayNightBtn.querySelector('span:last-child');
          if (span) span.textContent = this.isNightMode ? 'NIGHT' : 'DAY';
          this.showToast(this.isNightMode ? 'Showroom: Night' : 'Showroom: Day');
          this.playClickSound();
        });
      }

      // 10. Quick Actions: 360° Turntable Auto-Spin Toggle
      const rotateBtn = document.getElementById('btn-rotate-toggle');
      if (rotateBtn) {
        rotateBtn.addEventListener('click', () => {
          this.autoRotate = !this.autoRotate;
          rotateBtn.classList.toggle('active', this.autoRotate);
          this.showToast(this.autoRotate ? '360° Turntable: ON' : '360° Turntable: OFF');
          this.playClickSound();
        });
      }
    }

    // Apply color filter to body components
    applyPaintColor(palette) {
      // 1. Master body
      if (this.masterBody) {
        const img = this.masterBody.querySelector('img');
        if (img) img.style.filter = palette.filter;
      }

      // 2. Individual paintable components in exploded view
      this.partElements.forEach(({ data, el }) => {
        if (data.category === 'paintable') {
          const img = el.querySelector('img');
          if (img) img.style.filter = palette.filter;
        }
      });
    }

    // Apply wheel finish
    applyWheelFinish(finish) {
      this.partElements.forEach(({ data, el }) => {
        if (data.category === 'wheel') {
          const img = el.querySelector('img');
          if (img) img.style.filter = finish.filter;
        }
      });
    }

    // Apply caliper finish
    applyCaliperColor(cal) {
      this.partElements.forEach(({ data, el }) => {
        if (data.category === 'caliper') {
          const img = el.querySelector('img');
          if (img) img.style.filter = cal.filter;
        }
      });
    }

    // Toggle Headlights
    toggleHeadlights(on) {
      this.headlightLenses.forEach((lens) => {
        lens.classList.toggle('active', on);
      });
      this.headlightBeams.forEach((beam) => {
        beam.classList.toggle('active', on);
      });
    }

    // Update spec code string
    updateBuildCode() {
      const codeEl = document.getElementById('build-code-value');
      if (!codeEl) return;
      const p = COLOR_PALETTES[this.currentSpec.paint]?.code || 'EXT-GRIGIO';
      const w = this.currentSpec.wheelStyle.toUpperCase().replace('-', '');
      const f = this.currentSpec.wheelFinish.toUpperCase().replace('-', '');
      const c = this.currentSpec.caliper.toUpperCase();
      codeEl.textContent = `SVJ63 // ${p} / ${w}-${f} / CAL-${c}`;
    }

    // ========================================================================
    // 5. TECHNICAL INSPECTION DRAWER
    // ========================================================================
    openInspectionDrawer(comp) {
      this.activeComponent = comp;
      if (!this.drawer) return;

      // Dim non-selected components
      this.partElements.forEach(({ data, el }) => {
        if (data.id === comp.id) {
          el.classList.add('active-inspect');
          el.classList.remove('dimmed');
        } else {
          el.classList.add('dimmed');
          el.classList.remove('active-inspect');
        }
      });

      // Populate Drawer Details
      const subCode = document.getElementById('drawer-subsystem-code');
      const title = document.getElementById('drawer-title');
      const img = document.getElementById('drawer-img');
      const desc = document.getElementById('drawer-desc');
      const specsGrid = document.getElementById('drawer-specs-grid');

      if (subCode) subCode.textContent = comp.subsystem;
      if (title) title.textContent = comp.name;
      if (img) {
        img.src = `./images/${comp.file}`;
        img.alt = comp.name;
      }
      if (desc) desc.textContent = comp.desc;

      if (specsGrid) {
        specsGrid.innerHTML = '';
        Object.entries(comp.specs).forEach(([k, v]) => {
          const b = document.createElement('div');
          b.className = 'spec-box';
          b.innerHTML = `
            <div class="spec-box-name">${k.toUpperCase()}</div>
            <div class="spec-box-val">${v}</div>
          `;
          specsGrid.appendChild(b);
        });
      }

      this.drawer.classList.add('open');
      this.playClickSound();
    }

    closeInspectionDrawer() {
      if (!this.drawer) return;
      this.drawer.classList.remove('open');
      this.activeComponent = null;

      // Restore component highlights
      this.partElements.forEach(({ el }) => {
        el.classList.remove('dimmed');
        el.classList.remove('active-inspect');
      });
      this.playClickSound();
    }

    // ========================================================================
    // 6. SYNTHESIZED WEB AUDIO SOUND ENGINE
    // ========================================================================
    bindAudioEvents() {
      const soundBtn = document.getElementById('btn-sound-toggle');
      if (!soundBtn) return;

      soundBtn.addEventListener('click', () => {
        if (!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioCtx = new AudioContext();
        }

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        this.soundEnabled = !this.soundEnabled;
        soundBtn.classList.toggle('active', this.soundEnabled);
        const span = soundBtn.querySelector('span:last-child');
        if (span) span.textContent = this.soundEnabled ? 'STOP V12' : 'START V12';

        if (this.soundEnabled) {
          this.playEngineRev();
          this.showToast('V12 6.5L Naturally Aspirated Engine Ignited!');
        }
      });

      // Drawer close button
      const closeBtn = document.getElementById('btn-drawer-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeInspectionDrawer());
      }
    }

    // Screaming 60° V12 Rev Harmonics Synthesizer
    playEngineRev() {
      if (!this.soundEnabled || !this.audioCtx) return;
      try {
        const now = this.audioCtx.currentTime;

        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const osc3 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc3.type = 'sawtooth';

        // V12 Idle to 8,500 RPM rev
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(360, now + 0.55);
        osc1.frequency.exponentialRampToValueAtTime(110, now + 1.9);

        osc2.frequency.setValueAtTime(160, now);
        osc2.frequency.exponentialRampToValueAtTime(720, now + 0.55);
        osc2.frequency.exponentialRampToValueAtTime(220, now + 1.9);

        osc3.frequency.setValueAtTime(240, now);
        osc3.frequency.exponentialRampToValueAtTime(1080, now + 0.55);
        osc3.frequency.exponentialRampToValueAtTime(330, now + 1.9);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        osc1.stop(now + 1.9);
        osc2.stop(now + 1.9);
        osc3.stop(now + 1.9);
      } catch (e) {
        console.warn('Audio Error:', e);
      }
    }

    playClickSound() {
      if (!this.soundEnabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, this.audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.04);
      } catch (e) {}
    }

    playRelaySound() {
      if (!this.soundEnabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, this.audioCtx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.06);
      } catch (e) {}
    }

    // Toast pill notification
    showToast(message) {
      if (!this.toast) return;
      this.toast.textContent = message;
      this.toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast.classList.remove('show');
      }, 2400);
    }

    // Nav pills & smooth scrolling
    bindNavEvents() {
      const navBtns = document.querySelectorAll('.nav-pill-btn');
      navBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          navBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const track = document.getElementById('scroll-track');
          const max = track ? track.offsetHeight - window.innerHeight : 3000;

          let targetScroll = 0;
          if (target === 'hero') targetScroll = 0;
          if (target === 'exploded') targetScroll = max * 0.45;
          if (target === 'specs') targetScroll = max * 0.95;

          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          this.playClickSound();
        });
      });

      // Hero "Explode The Machine" CTA
      const explodeCta = document.getElementById('btn-hero-explode');
      if (explodeCta) {
        explodeCta.addEventListener('click', () => {
          const track = document.getElementById('scroll-track');
          const max = track ? track.offsetHeight - window.innerHeight : 3000;
          window.scrollTo({ top: max * 0.45, behavior: 'smooth' });
          this.playClickSound();
        });
      }

      // Scroll hint click
      const scrollHint = document.querySelector('.scroll-invite-hint');
      if (scrollHint) {
        scrollHint.addEventListener('click', () => {
          const track = document.getElementById('scroll-track');
          const max = track ? track.offsetHeight - window.innerHeight : 3000;
          window.scrollTo({ top: max * 0.45, behavior: 'smooth' });
          this.playClickSound();
        });
      }
    }

    // Keyboard Shortcuts
    bindKeyboardEvents() {
      window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'escape') {
          this.closeInspectionDrawer();
        } else if (key === 'l') {
          const btn = document.getElementById('btn-lights-toggle');
          if (btn) btn.click();
        } else if (key === 'n') {
          const btn = document.getElementById('btn-daynight-toggle');
          if (btn) btn.click();
        } else if (key === 'r') {
          const btn = document.getElementById('btn-rotate-toggle');
          if (btn) btn.click();
        } else if (key === 's') {
          const btn = document.getElementById('btn-sound-toggle');
          if (btn) btn.click();
        } else if (key === 'e') {
          const btn = document.getElementById('btn-hero-explode');
          if (btn) btn.click();
        }
      });
    }
  }

  // Initialize application on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PureShowroomApp());
  } else {
    new PureShowroomApp();
  }
})();
