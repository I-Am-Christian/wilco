import * as THREE from 'three';
const base='https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/';
// Optional high-end effects; only construct after a desktop user selects AO.
export class DriftPost{
 constructor(renderer,scene,camera){Object.assign(this,{renderer,scene,camera,enabled:false,wanted:false,status:'off',composer:null});this.dim=new THREE.Vector2()}
 async enable(){this.wanted=true;if(this.composer){this.enabled=true;this.status='ready';this.resize();return}if(this.pending)return this.pending;this.status='loading';this.pending=(async()=>{let [{EffectComposer},{SSAOPass},{UnrealBloomPass},{OutputPass}]=await Promise.all(['EffectComposer.js','SSAOPass.js','UnrealBloomPass.js','OutputPass.js'].map(p=>import(base+p)));let c=new EffectComposer(this.renderer);this.renderer.getDrawingBufferSize(this.dim);let w=Math.max(1,Math.min(1600,this.dim.x)),h=Math.max(1,Math.round(w*this.dim.y/Math.max(1,this.dim.x)));let ao=new SSAOPass(this.scene,this.camera,w,h,16);ao.kernelRadius=4;ao.minDistance=.003;ao.maxDistance=.12;c.addPass(ao);let bloom=new UnrealBloomPass(new THREE.Vector2(w,h),.32,.4,.85);c.addPass(bloom);c.addPass(new OutputPass());this.composer=c;this.enabled=this.wanted;this.status='ready';this.resize()})().catch(e=>{this.enabled=false;this.status='fallback';console.warn('Advanced effects unavailable',e)}).finally(()=>{this.pending=null});return this.pending}
 disable(){this.wanted=false;this.enabled=false}
 resize(){if(!this.composer)return;this.renderer.getDrawingBufferSize(this.dim);let w=Math.max(1,Math.min(1600,this.dim.x)),h=Math.max(1,Math.min(1200,Math.round(w*this.dim.y/Math.max(1,this.dim.x))));this.composer.setPixelRatio(1);this.composer.setSize(w,h)}
 render(){if(!this.enabled||!this.composer)return false;try{this.composer.render();return true}catch(e){this.enabled=false;this.status='fallback';this.renderer.setRenderTarget(null);console.warn('Advanced post-processing failed; fallback restored',e);return false}}
}
