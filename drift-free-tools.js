const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function adaptiveScale(scale,fps,target=60){scale=clamp(Number(scale)||1,.6,1);if(!Number.isFinite(fps)||fps<=0)return scale;let next=fps<target*.85?scale-.1:fps>=target*.99?scale+.05:scale;return Math.round(clamp(next,.6,1)*100)/100}
export function gamepadControls(pad){let axis=clamp(Number(pad?.axes?.[0])||0,-1,1),v=i=>clamp(Number(pad?.buttons?.[i]?.value)||0,0,1),pressed=i=>!!pad?.buttons?.[i]?.pressed||v(i)>.5;return {gas:v(7),brake:v(6),steer:Math.abs(axis)<.14?0:Math.sign(axis)*(Math.abs(axis)-.14)/.86,hand:pressed(0),camera:pressed(3),recover:pressed(2)}}
export function mergeControls(a,b){return {gas:Math.max(a.gas,b.gas),brake:Math.max(a.brake,b.brake),steer:Math.abs(a.steer)>.01?a.steer:b.steer,hand:a.hand||b.hand}}
export class FreeDiagnostics{
 constructor(){this.stats=null;this.wanted=false;this.pending=null;this.status='off'}
 async show(wanted){this.wanted=wanted;if(!wanted){this.stats?.dom.remove();this.status='off';return}if(this.stats){document.body.append(this.stats.dom);this.status='ready';return}if(this.pending)return this.pending;this.status='loading';this.pending=import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/stats.module.js').then(({default:Stats})=>{this.stats=new Stats();this.stats.dom.style.top='auto';this.stats.dom.style.bottom='4px';this.stats.dom.style.left='4px';if(this.wanted){document.body.append(this.stats.dom);this.status='ready'}else this.status='off'}).catch(()=>{this.status='unavailable'}).finally(()=>this.pending=null);return this.pending}
 update(){if(this.wanted)this.stats?.update()}
}
