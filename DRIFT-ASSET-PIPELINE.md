# Drift Dynasty – Asset pipeline and QA (V16)

## Settings
- Hybrid (default): existing customizable player body, imported sports-car models for rivals, imported props where loaded.
- Imported: imported sports cars for all vehicles. Existing tuning and ownership are unchanged; visual body-kit options may be represented only by proportions and paint tint on imported meshes. Choose Custom for the original full cosmetic system.
- Import Blender / Meshy car (GLB): select a self-contained .glb under 10 MB and 300,000 vertices. Use +Y up, +Z forward, four wheel nodes named wheel-front-left, wheel-front-right, wheel-back-left, wheel-back-right. Unnamed wheels do not animate. Normalize/fitting is automatic. The uploaded file stays in the browser session and is not uploaded to GitHub or a server.
- Ambient occlusion: optional SSAO + bloom on desktop; standard cinematic or direct fallback on unsupported hardware.
- Photo textures / HDR: attempts Poly Haven asphalt_track 1K PBR textures and Potsdamer Platz 1K environment (daylight only); existing procedural assets remain if network/CORS/metadata loading fails.
- Rapier: optional continuous world sweep collision; current drift model, oriented footprint collisions and saved progression remain unchanged. This is not a complete rigid-body vehicle simulation.

## Bundled models and credits
Each JSON contains the original GLB bytes in base64, hosted in this repository.
- sedan, hatchback: Kenney Car Kit, CC0, https://kenney.nl/assets/car-kit. Source mirror: https://github.com/Papyszoo/CC0-Public-Domain-Models/tree/main/packs/kenney-car-kit
- streetlight, sign: Quaternius Cyberpunk Game Kit, CC0, https://quaternius.com/packs/cyberpunkgamekit.html. Source mirror and license: https://github.com/trebeljahr/quaternius-showcase/blob/main/LICENSES.md
- Optional textures: Poly Haven asphalt_track and Potsdamer Platz, CC0, https://polyhaven.com/license
- Three.js r160 addons: GLTFLoader, MeshoptDecoder, KTX2Loader, DRACOLoader, RGBELoader, SSAOPass, UnrealBloomPass, OutputPass.
- Rapier compat 0.12.0.

## Creating higher-detail assets
Blender: model separate wheels, apply transforms, reduce polygon count, bake base color/roughness/normal textures, export GLB with embedded images. Meshy/fal: generate a licensed car asset, clean geometry and UVs in Blender, export the same format. Adobe: design decals and material images, then bake them into the GLB. Use CC0 or commercially redistributable sources; check individual asset licenses before publishing. fal/Adobe plugins require the account holder to connect them; the game does not depend on either.

## QA
GitHub Actions: Drift Dynasty QA runs existing algorithm tests and Playwright smoke tests on changes. Locally install pinned dependencies:
```sh
npm install --no-save --no-package-lock three@0.160.0 @playwright/test@1.51.1 @dimforge/rapier3d-compat@0.12.0
npx playwright install chromium
python3 -m http.server 8765
# in a second terminal
npx playwright test tests/drift-browser.spec.mjs --workers=1
```
No claim of successful live rendering until browser checks have completed. Manual multiplayer, model aesthetics, and performance checks remain required.
