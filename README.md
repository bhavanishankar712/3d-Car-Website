# 🏎️ LAMBORGHINI AVENTADOR SVJ // CINEMATIC 3D DIGITAL SHOWROOM (PURE HTML)

A realistic, cinematic interactive 3D automotive web experience based on the **Lamborghini Aventador SVJ**. 

Converted to run as **Pure Standalone HTML**:
- **Double-click [index.html](file:///e:/AI%20Sites%20Practice/3d%20Car%20Site/index.html)** in Windows File Explorer or any modern browser (Chrome, Edge, Firefox, Safari) to launch directly (via `file://`).
- **Zero Node.js or `server.js` required**.
- **Zero CORS restrictions**: The authentic 3D vehicle model is pre-bundled into `assets/models/car-model-data.js` and parsed directly in WebGL memory without network requests.
- Can also be deployed directly onto any static host (GitHub Pages, Vercel, Netlify).

---

## 🌟 Key Features & Exact 3D Animations

### 1. Authentic 3D Aventador SVJ Geometry & Realism
- Real 3D GLB mesh with 87 independent controllable component nodes: front bumper, luggage hood, dihedral scissor doors, greenhouse, ALA 2.0 carbon wing, wheels, calipers, suspension, V12 engine, and interior.
- Authentic PBR clearcoat pearlescent body paint with metallic flakes, clearcoat roughness, and real-time studio environment reflections.

### 2. 360° Inspection & Inertial Orbit Controls
- True 3D orbit rotation from any angle (front, rear, quarter, side, top) with horizontal and vertical drag inertia.
- Clamped vertical polar angles preventing clipping below the showroom floor.
- Turntable 360° auto-rotation mode.

### 3. Scroll-Driven 87-Component Mechanical Disassembly
- Powered by GSAP ScrollTrigger with scrubbed timeline interpolation.
- All structural and aerodynamic components explode outward along their physical 3D trajectories:
  - Hood lifts up and glides forward.
  - Dihedral scissor doors rotate upward and outward.
  - Front bumper and splitter slide forward.
  - Wheels and brake discs move outward along lateral axles.
  - Roof and greenhouse lift skyward.
  - 6.5L V12 engine and transmission disassemble along the drivetrain.
- Reversing the scroll restores every subsystem back into the monocoque with mechanical precision and suspension landing bounce.
- Real-time HUD showing 0% to 100% exploded progress and active orbital component telemetry.

### 4. Real-Time 3D Configurator Studio
- **Exterior Paint**: Grigio Titans (Reference Silver), Bianco Monocerus (Pearl White), Midnight Nero, Rosso Mars (Corse Red), Blu Cepheus, Grigio Lynx, Oro Elios, Verde Ithaca, and Arancio Argos.
- **Forged Wheels**: Style 01 (Forged Monoblock), Style 02 (Twin-Spoke Aero), Style 03 (Carbon Lightweight).
- **Wheel Finishes**: Satin Nero, Matte Titanium, Diamond Silver, Hyper Gold.
- **Brake Calipers**: Rosso Mars Red, Giallo Modena Yellow, Nero Gloss, Bianco Clean, Acid Green.
- **Cockpit Upholstery**: Nero Ade Alcantara, Tuscan Saddle Leather, Rosso Alala Sport.
- Live build code string and specification summary download.

### 5. Dynamic Headlights & Day/Night Showroom
- Authentic Three.js spot light sources shining onto the floor with soft penumbra and realistic decay.
- Volumetric forward-projecting light cones and signature Y-shaped DRL headlight lens flares.
- Day / Night mode toggle transitioning between bright architectural daylight studio and dark, moody nighttime showroom with neon accents.

### 6. Web Audio API V12 Sound Synthesizer
- Built-in multi-harmonic audio synthesizer generating a screaming 60° 6.5L V12 engine rev up to 8,500 RPM, relay switches, and tactile UI feedback with **zero external audio files**.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| `L` | Toggle Headlights & Volumetric Floor Beams |
| `N` | Toggle Day / Night Showroom Mode |
| `R` | Toggle 360° Turntable Auto-Rotation |
| `S` | Start / Rev 6.5L V12 Engine Sound |
| `Esc` | Reset Camera / Deselect |

---

## 📂 Project Structure

```
3d Car Site/
├── index.html                   # Master HTML entry point (Pure HTML - runs locally or on any server!)
├── README.md                    # Project documentation
├── css/
│   ├── style.css                # Glassmorphic showroom aesthetic, HUD, typography & preloader
│   └── responsive.css           # Responsive layouts for tablet and mobile
├── js/
│   ├── libs/                    # Three.js (r128), GLTFLoader, OrbitControls, GSAP, ScrollTrigger
│   ├── showroom.js              # High-gloss floor, turntable dais, studio softboxes, Day/Night
│   ├── car.js                   # 3D GLB loading (embedded Base64 + fetch fallback), PBR paint, wing
│   ├── lights.js                # Studio lighting rig, volumetric headlights, Day/Night
│   ├── camera.js                # Camera viewpoints, presets, interpolation, focus
│   ├── explosion.js             # 87-component physical 3D disassembly vectors & easing
│   ├── configurator.js          # Real-time paint, wheels, calipers, interior customizer
│   ├── interaction.js           # 360 drag inertia, sound synthesizer, keyboard shortcuts
│   └── main.js                  # Application coordinator, floor, particles, render loop
└── assets/
    └── models/
        ├── car-model-data.js    # Pre-bundled 3D model for zero-CORS pure HTML execution
        └── car.glb              # Original binary 3D model
```

---

## 🚀 How to Run

Simply double-click [index.html](file:///e:/AI%20Sites%20Practice/3d%20Car%20Site/index.html) in Windows File Explorer or open it in any browser. No commands or Node.js server required!
