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
// Steering input is screen-relative: positive means right. Cars face local +Z,
// so a right turn is a negative world yaw. Velocity retains its own heading.
export function drive(s,c,b,input,dt,mu,assist){
 const damp=(a,b,k)=>a+(b-a)*(1-Math.exp(-k*dt)),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
 let sy=Math.sin(s.yaw),cy=Math.cos(s.yaw),u=s.vx*sy+s.vz*cy,v=s.vx*cy-s.vz*sy,vel=Math.hypot(s.vx,s.vz),g=9.81,L=c.wb;
 let grip=clamp(c.grip*mu*b.grip/100,.25,1.6),help=clamp(assist*b.assist/100,0,1.5),gas=clamp(input.gas,0,1),brake=clamp(input.brake,0,1),hand=!!input.hand;
 let steerTarget=-clamp(input.steer,-1,1)*Math.min(.60,Math.atan(L*grip*g*1.15/Math.max(5,vel*vel))+.075)*b.steer/100;
 s.steer=damp(s.steer,steerTarget,9);
 let reverseIntent=brake>.05&&gas<.05&&(u<-.05||vel<.55);s.reverseHold=reverseIntent?(s.reverseHold||0)+dt:0;let reverse=reverseIntent&&(u<-.05||s.reverseHold>.24);
 let power=(c.hp+65*b.engine)*745.7,capspeed=55+power/c.mass*.075;
 let acceleration=gas*Math.min(power/c.mass/Math.max(5,vel),grip*g*.58)*(hand?.55:1);
 if(vel>capspeed)acceleration*=.04;
 if(reverse)acceleration=u> -9?-2.9*brake:0;
 else if(brake)acceleration-=Math.min(vel/dt,grip*g*.93*b.brake/100)*brake*Math.sign(u||1);
 if(hand&&vel>1)acceleration-=Math.sign(u)*grip*1.5;
 acceleration-=Math.sign(u)*Math.min(Math.abs(u)/dt,.12+.00065*vel*vel+(mu<.6?.45:0));
 // Rear grip breaks progressively with the handbrake or power at substantial slip.
 let oldSlip=Math.atan2(v,Math.max(.5,Math.abs(u))),powerSlide=gas>.92&&vel>12&&Math.abs(input.steer)>.90&&Math.abs(s.steer)>.12;
 // Normal cornering does not initiate a sustained drift. Handbrake is the primary trigger.
 let slideTarget=hand&&vel>5?.87:powerSlide?.14:0;
 s.slide=damp(s.slide||0,slideTarget,slideTarget>(s.slide||0)?6:7.8+help*4);
 let ideal=u/L*Math.tan(s.steer),turnLimit=grip*g/Math.max(3,vel),yawTarget=clamp(ideal,-turnLimit*(.84+s.slide*1.55),turnLimit*(.84+s.slide*1.55));
 // Stability assistance opposes excess rotation, not deliberate steering.
 if(Math.abs(input.steer)<.05&&!hand)yawTarget=0;
 if(!hand&&Math.abs(oldSlip)>.14)yawTarget+=clamp(oldSlip*(1.2+help*2.0),-.75,.75);
 s.r=damp(s.r||0,clamp(yawTarget,-1.65,1.65),5+help*3);
 let nextYaw=s.yaw+s.r*dt;
 let speed=vel+acceleration*dt*Math.sign(u||1);
 if(reverse){speed=clamp(vel-acceleration*dt,0,9)}
 if(!reverse&&brake&&u>=0)speed=Math.max(0,speed);
 if(!reverse&&u<0&&gas>0)speed=Math.max(0,vel-acceleration*dt);
 speed=clamp(speed,0,capspeed*1.06);
 let backwards=reverse||(u<-.1&&!(gas>0&&speed<.2)),velYaw=vel>.08?Math.atan2(s.vx,s.vz):s.yaw+(backwards?Math.PI:0);if(reverse&&vel<.55)velYaw=nextYaw+Math.PI;
 let desired=nextYaw+(backwards?Math.PI:0),error=wrap(desired-velYaw);
 let gripRate=(8.5+grip*5.5)*(1-s.slide*.88)+help*2.5;
 if(vel<5||backwards)gripRate=10;
 let maxChange=grip*g/Math.max(2,vel)*(1.12-s.slide*.62);
 let headingStep=clamp(error*(1-Math.exp(-gripRate*dt)),-maxChange*dt,maxChange*dt);
 if(vel<2)headingStep=error*(1-Math.exp(-12*dt));
 velYaw+=headingStep;
 if(speed<.10&&!gas&&!reverse)speed=0;
 s.yaw=nextYaw;s.vx=Math.sin(velYaw)*speed;s.vz=Math.cos(velYaw)*speed;
 s.x+=s.vx*dt;s.z+=s.vz*dt;let ns=Math.sin(nextYaw),nc=Math.cos(nextYaw);
 s.speed=s.vx*ns+s.vz*nc;s.slip=Math.atan2(Math.abs(s.vx*nc-s.vz*ns),Math.max(.5,Math.abs(s.speed)));s.ax=damp(s.ax||0,acceleration,8);return s
}
export function driftRate(speed,angle,chain,onRoad){return onRoad&&speed>7&&angle>.14&&angle<1.20?Math.min(75,speed)*Math.sin(angle)*Math.min(4,1+chain/5)*7:0}
