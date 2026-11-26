export const themes=[
["Neon Harbor","night","#17243e","#353b50","#4cd5f5","A mysterious invitation leads you to the dockside underground.","Cipher"],
["Sakura Ridge","dawn","#efd1cc","#716d74","#ff91bb","Learn restraint on the mountain roads before meeting the silent master.","Kitsune"],
["Desert Mirage","day","#e8bc91","#b79162","#ffd075","Cross the salt flats and claim your place among the desert racers.","Mirage"],
["Alpine Eclipse","snow","#b9d9ea","#9daeba","#92d4ff","Snow and ice reveal who really understands traction.","Frost"],
["Industrial Inferno","night","#403539","#5a4c43","#ff9453","The abandoned steelworks hides a ruthless challenger.","Forge"],
["Rain City","rain","#637a91","#485260","#a6e5ff","The city is soaked; precision becomes your greatest weapon.","Tempest"],
["Pacific Run","sunset","#f4b28b","#748d73","#ffd9a1","Follow the coastal circuit to the legendary seaside crew.","Reef"],
["Jungle Ruins","day","#a2b9a2","#526c45","#b5df76","Ancient roads wind through the jungle. Earn the crew's respect.","Viper"],
["Solar Circuit","day","#b4c9dc","#797f87","#e8e7c2","The professional league watches your every move.","Apex"],
["Midnight Zenith","night","#11152d","#36374d","#c69cff","The invitation was a test. Face the founder of the entire league.","Phantom"]
].map(([name,weather,sky,ground,accent,story,boss],i)=>({id:i,name,weather,sky,ground,accent,story,boss}));
const layouts=["Harbor hairpins","Twin sweepers","Switchback","Long arc","Technical loop","Figure of bends","High-speed esses","Reverse sweep","Precision ring","Championship circuit"];
export const maps=themes.flatMap(t=>layouts.map((name,i)=>({id:t.id*10+i,chapter:t.id,index:i,name:t.name+" · "+name,seed:701+t.id*1217+i*97,target:Math.round(900+t.id*280+i*100),length:45+t.id*2+i*2})));
const brands=["Aster","Kairo","Vanta","Rift","Nori","Obsidian","Volt","Sable","Zenith","Kestrel"],names=["S1","GT-RX","V6","Silhouette","RS","Type-D","Vortex","XR","Club","Rally"];
export const cars=Array.from({length:100},(_,i)=>{let b=Math.floor(i/10),n=i%10;return {id:i,name:brands[b]+" "+names[n],brand:brands[b],kind:(i+b)%6,hp:210+b*36+n*18,mass:1080+(i*73)%680,wb:2.35+(i%9)*.075,grip:.93+(i%7)*.035,price:i===0?0:750+b*510+n*165,color:["#b84f49","#d3c7ac","#547caa","#e4a553","#3f9d83","#9465ad","#354453","#c1c9cf","#b3678c","#75a0a0"][i%10],type:"standard",unlock:Math.floor(b/2)*10}});
for(let i=0;i<20;i++)cars.push({id:100+i,name:["Specter","Kitsune","Nebula","Wildfire","Ghostline"][i%5]+" "+["Signature","R","X","Evo"][Math.floor(i/5)],brand:"Legend Works",kind:i%6,hp:390+i*16,mass:1150+i*23,wb:2.55,grip:1.04+i*.005,price:0,color:["#a98eff","#75daca","#f3ba66","#e38c9d","#e4e8ee"][i%5],type:"stunt",unlock:2500+i*1500});
for(let i=0;i<10;i++)cars.push({id:120+i,name:themes[i].boss+" Champion Edition",brand:"Boss collection",kind:(i+2)%6,hp:480+i*45,mass:1350+i*24,wb:2.64,grip:1.08+i*.012,price:0,color:themes[i].accent,type:"boss",unlock:i});
export const difficulties=[{name:"Easy",assist:1.0,target:.70,rival:.65},{name:"Medium",assist:.65,target:1,rival:1},{name:"Hard",assist:.35,target:1.25,rival:1.22},{name:"Pro Drifter",assist:.12,target:1.55,rival:1.47}];
export const defaults={color:null,wheels:0,spoiler:0,kit:0,engine:0,exhaust:0,lights:0,glow:0,stripes:0,vin:"",steer:100,grip:100,brake:100,assist:100};
export function fresh(){return {version:1,cash:2500,owned:[0],selected:0,cleared:[],bosses:[],best:0,combo:0,records:{},builds:{},parts:0,earnings:0}}
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function seeded(n){return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296}}
export function unlocked(s,m){return m===0||s.cleared.includes(m-1)&&(m%10!==0||s.bosses.includes(Math.floor(m/10)-1))}
export function award(s,m,boss,won,score,combo,difficulty,practice=false){s.best=Math.max(s.best,Math.floor(score));s.combo=Math.max(s.combo,Math.floor(combo));let specials=cars.filter(c=>c.type==="stunt"&&Math.max(score,combo)>=c.unlock&&!s.owned.includes(c.id));for(let c of specials)s.owned.push(c.id);let pay=practice?0:Math.round((won?600+m*35+(boss?2400+Math.floor(m/10)*650:0):100+m*4)*(1+difficulty*.2));s.cash+=pay;s.earnings+=pay;if(!practice&&won){if(boss){let n=Math.floor(m/10);if(!s.bosses.includes(n)){s.bosses.push(n);s.owned.push(120+n);s.parts=Math.max(s.parts,n+1)}}else if(!s.cleared.includes(m))s.cleared.push(m)}let key=m+":"+Number(boss)+":"+difficulty;if(!practice)s.records[key]=Math.max(s.records[key]||0,Math.floor(score));return {pay,specials:specials.map(c=>c.name)}}
// Dynamic single-track handling with independent front/rear slip, friction limits, and low-speed blend.
export function drive(s,c,b,input,dt,mu,assist){
let sy=Math.sin(s.yaw),cy=Math.cos(s.yaw),u=s.vx*sy+s.vz*cy,v=s.vx*cy-s.vz*sy,vel=Math.abs(u),L=c.wb,lf=L*.49,lr=L*.51,m=c.mass,g=9.81;
let target=input.steer*.56*(b.steer/100)/(1+vel*.022),damp=(a,b,k)=>a+(b-a)*(1-Math.exp(-k*dt));s.steer=damp(s.steer,target,7.5);
let fz=m*g*.5,grip=c.grip*mu*b.grip/100,hand=input.hand,throttle=input.gas,brake=input.brake;let rear=grip*fz*(hand?.35:1),front=grip*fz;
let power=(c.hp+65*b.engine)*745.7,traction=hand?.72:.72,fx=Math.min(power/Math.max(6,vel),rear*traction)*throttle;
if(brake&&u<.4&&!throttle){fx=u> -8?-m*2.8:0}else if(brake)fx-=Math.sign(u)*Math.min(m*g*grip*.85*b.brake/100,vel*m/dt)*brake;
if(hand)fx-=Math.sign(u)*rear*.35;
let alphaF=s.steer-Math.atan2(v+lf*s.r,Math.max(2,vel)),alphaR=-Math.atan2(v-lr*s.r,Math.max(2,vel));
let fyF=clamp(fz*7*alphaF,-front,front),lim=Math.sqrt(Math.max(0,rear*rear-Math.min(rear,Math.abs(fx))**2)),fyR=clamp(fz*6.2*alphaR,-lim,lim);
let ax=(fx-fyF*Math.sin(s.steer))/m-Math.sign(u)*(.13+.0007*u*u),ay=(fyF*Math.cos(s.steer)+fyR)/m;
let yawRate=clamp(s.r+(lf*fyF*Math.cos(s.steer)-lr*fyR)/(m*(L*.48)**2)*dt,-2.3,2.3),low=clamp((8-vel)/5,0,1);if(u<0)low=1;
yawRate=yawRate*(1-low)+(u/L*Math.tan(s.steer))*low;
let slip=Math.atan2(v,Math.max(2,vel)),help=assist*b.assist/100;if(!hand&&Math.abs(slip)>.22){yawRate=damp(yawRate,slip*.9,help*3.4);ay-=v*help*.8}
if(!hand&&Math.abs(input.steer)<.06){yawRate=damp(yawRate,0,2+help*5);ay-=v*(.5+help*2)}s.yaw+=yawRate*dt;s.r=yawRate;let vx=s.vx+(ax*sy+ay*cy)*dt,vz=s.vz+(ax*cy-ay*sy)*dt,ns=Math.sin(s.yaw),nc=Math.cos(s.yaw),nu=vx*ns+vz*nc,nv=vx*nc-vz*ns;
if(low>0)nv=damp(nv,nu*lr/L*Math.tan(s.steer),low*12);if(!hand&&Math.abs(input.steer)<.06){s.r=damp(s.r,0,2+help*6);nv=damp(nv,0,1+help*4)}if(!throttle&&!brake&&Math.hypot(nu,nv)<.12)nu=nv=0;
s.vx=nu*ns+nv*nc;s.vz=nu*nc-nv*ns;s.x+=s.vx*dt;s.z+=s.vz*dt;s.speed=nu;s.slip=Math.atan2(Math.abs(nv),Math.max(.5,Math.abs(nu)));return s}
export function driftRate(speed,angle,chain,onRoad){return onRoad&&speed>7&&angle>.14&&angle<1.20?Math.min(75,speed)*Math.sin(angle)*Math.min(4,1+chain/5)*7:0}
