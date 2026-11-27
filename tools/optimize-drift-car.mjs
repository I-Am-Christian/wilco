// Optional offline optimization. Uses the free glTF Transform CLI, never a paid API.
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
let [src,dst]=process.argv.slice(2);if(!src||!dst||!src.endsWith('.glb')||!dst.endsWith('.glb')||resolve(src)===resolve(dst)||!existsSync(src)||existsSync(dst)){console.error('Usage: node tools/optimize-drift-car.mjs input.glb new-output.glb (must not overwrite files)');process.exit(1)}
// Meshopt preserves named wheel nodes; avoid join/flatten/instance passes.
const npx=process.platform==='win32'?'npx.cmd':'npx';
const result=spawnSync(npx,['--yes','--package','@gltf-transform/cli@4.5.1','gltf-transform','meshopt',resolve(src),resolve(dst),'--level','medium'],{stdio:'inherit',shell:false});if(result.error){console.error(result.error);process.exit(1)}process.exitCode=result.status??1;
