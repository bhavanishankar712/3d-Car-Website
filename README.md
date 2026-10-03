# ?? LAMBORGHINI AVENTADOR SVJ // CINEMATIC 3D DIGITAL SHOWROOM

A realistic, cinematic interactive 3D automotive web experience based on the **Lamborghini Aventador SVJ**. Built from the ground up using **Three.js**, **WebGL**, **GSAP**, and **GSAP ScrollTrigger**, featuring real-time physically based rendering (PBR), a 33-component mechanical exploded engineering dissection using the exact provided component assets, day/night showroom lighting, and an interactive 3D vehicle configurator.

---

## ?? Key Capabilities & Features

### 1. Exact Vehicle Realism (Aventador SVJ)
- **3D Vehicle Geometry**: Authentic 3D GLB mesh featuring independent controllable nodes for body panels, hood, dihedral scissor doors, greenhouse, front/rear aero fascias, wheels, suspension, engine, and interior.
- **SVJ Aerodynamics**: Custom 3D-synthesized **ALA 2.0 (Aerodinamica Lamborghini Attiva)** carbon fiber rear wing with twin swan-neck pylons, endplates, and vertical stabilization shark fin matching the reference design.
- **PBR Clearcoat Paint**: Three.js `MeshPhysicalMaterial` with clearcoat, clearcoatRoughness, metallic flakes, and ambient showroom reflections.

### 2. 360° True Inspection & Inertia
- **Smooth Orbit Control**: Horizontal drag on desktop and touch drag on mobile with subtle momentum and inertia.
- **Cinematic Constraints**: Clamped vertical polar angles to prevent unnatural clipping or venturing below the showroom floor.
- **Idle Auto-Rotation**: Automatically engages a gentle turntable spin after 3.5 seconds of user inactivity.

### 3. Realistic Dynamic Headlights System
- **Dual Spotlights**: Authentic Three.js spot light sources shining onto the floor with soft penumbra and realistic decay.
- **Volumetric Beams**: Dual forward additive-blended light cones projecting forward.
- **Ground Illumination Pools**: Projected light patches on the wet showroom tarmac.
- **Emissive Lenses**: Signature Y-shaped DRL headlights fade between high-intensity cyan-white and dark glass.

### 4. Day / Night Mode
- **Showroom Ambient Switch**: Smooth GSAP transitions between bright daylight studio environment and dark, moody nighttime showroom with neon accents and high-contrast specular reflections.

### 5. Scroll-Driven 33-Component Exploded View
- **Continuous Scroll Storytelling**: Powered by GSAP ScrollTrigger with scrubbed timeline interpolation.
- **Mechanical Easing**: Large structural components (chassis, engine, gearbox) exhibit believable physical inertia, while lightweight aerodynamic parts (hood, rear wing, mirrors) lift crisply.
- **All 33 Component Assets Integrated**: Every single supplied PNG asset from `images/` (01 to 33) is mapped to its exact anatomical position with a floating 3D/2D HUD marker, live telemetry, and SVG connector line.
- **Component Click-to-Inspect**: Clicking any component smoothly flies the camera to the part, dims non-selected components, and opens an engineering drawer with high-resolution visual previews, material science, and performance specifications.

### 6. Reverse Reassembly & Configurator Transition
- **Sequential Reassembly**: Reversing the scroll smoothly restores every subsystem back into the monocoque with mechanical precision.
- **Suspension Landing Bounce**: As the vehicle descends into the Configurator Studio, realistic suspension compression and subtle ground contact bounce ground the car onto the turntable.

### 7. Interactive 3D Configurator Studio
- **Exterior Paint**: Grigio Titans (Reference Match), Bianco Monocerus, Midnight Nero, Rosso Mars, Blu Cepheus, Grigio Lynx, Oro Elios, Verde Ithaca, and Arancio Argos.
- **Forged Wheels**: Style 01 (Forged Monoblock), Style 02 (Twin-Spoke Aero), and Style 03 (Carbon Lightweight).
- **Wheel Finishes**: Satin Nero Black, Matte Titanium, Diamond Gloss Silver, and Hyper Gold.
- **Brake Calipers**: Rosso Mars Red, Giallo Modena Yellow, Nero Gloss, Bianco Clean, and Acid Green.
- **Cockpit Upholstery**: Nero Ade Alcantara, Tuscan Saddle Tan Leather, and Rosso Alala Sport Red.
- **Bespoke Build Sheet**: Live build code generation and instant downloadable specification summary.

### 8. Web Audio API Sound Synthesizer
- Built-in sound engine producing a high-revving 60° V12 engine rev, headlight mechanical relay switches, and futuristic UI tactile clicks without external audio dependencies.

---

## ?? Project Structure

```
3d Car Site/
??? index.html                # Master HTML entry point
??? server.js                 # Local HTTP server with Range headers & MIME handling
??? package.json              # NPM metadata and scripts
??? README.md                 # Project documentation
??? css/
?   ??? style.css             # Glassmorphic showroom aesthetic, typography & preloader
?   ??? responsive.css        # Responsive layouts for tablet, mobile & accessibility
??? js/
?   ??? libs/
?   ?   ??? three.min.js      # Three.js 3D library (r128)
?   ?   ??? GLTFLoader.js     # GLTF/GLB loader plugin
?   ?   ??? OrbitControls.js  # Smooth orbit controls plugin
?   ?   ??? gsap.min.js       # GSAP animation platform (v3.12)
?   ?   ??? ScrollTrigger.min.js # GSAP ScrollTrigger plugin
?   ??? car.js                # GLB loading, PBR materials, SVJ wing, mesh registry
?   ??? lights.js             # Studio lighting rig, volumetric headlights, Day/Night
?   ??? camera.js             # Camera viewpoints, presets, interpolation, focus
?   ??? explosion.js          # Physical disassembly vectors, easing & reassembly
?   ??? labels.js             # 33-component data, 3D HUD pins, SVG lines, inspection drawer
?   ??? configurator.js       # Real-time paint, wheels, calipers, interior customizer
?   ??? interaction.js        # 360 drag inertia, sound synthesizer, keyboard shortcuts
?   ??? main.js               # Application coordinator, floor, particles, render loop
??? assets/
?   ??? models/
?   ?   ??? car.glb           # 3D Lamborghini model asset
?   ??? images/               # Component images (01 to 33 + reference)
??? images/                   # Provided component image assets (01 to 33)
```

---

## ?? Getting Started

### Method 1: Node.js (Recommended)
From the project root:
```bash
npm start
# or
node server.js
```
Open your browser and navigate to:
```
http://localhost:8080
```

### Method 2: Any Local Web Server
You can also use Python:
```bash
python -m http.server 8080
```
Or VS Code Live Server.

---

## ?? Controls & Shortcuts

| Action | Control |
|---|---|
| **Rotate Vehicle (360°)** | Click & Drag horizontally (Desktop) / Touch drag (Mobile) |
| **Zoom View** | Mouse Wheel / Pinch gesture |
| **Pan Camera** | Right-click & Drag |
| **Peel / Explode Vehicle** | Scroll Down |
| **Reassemble Vehicle** | Scroll Up |
| **Inspect Component** | Click any glowing HUD pin on the exploded car |
| **Toggle Headlights** | Press `L` or click floating deck button |
| **Toggle Day / Night** | Press `D` or click floating deck button |
| **Toggle Turntable** | Press `R` or click floating deck button |
| **Reset Camera Angle** | Press `Spacebar` |
| **Close Spec Drawer** | Press `Escape` or click Close button |
| **Jump to Section** | Keys `1` to `5` |
