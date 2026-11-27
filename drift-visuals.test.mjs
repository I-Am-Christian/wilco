import assert from 'node:assert/strict';
import {visualProfile,renderSize,lightProfile} from './drift-visual-settings.js';
assert.equal(visualProfile('mobile',true).bloom,false);
assert.equal(visualProfile('cinematic',false).bloom,true);
assert.equal(visualProfile('4k',true).bloom,false);
assert.equal(visualProfile('unknown',false).bloom,false);
let scenarios=0;
for(const q of ['mobile','high','cinematic','4k'])for(const mobile of [true,false])for(const [w,h] of [[1920,1080],[3840,2160],[390,844],[7680,4320]]){const p=visualProfile(q,mobile),r=renderSize(w,h,p);assert.ok(r.width*r.height<=p.pixels);assert.ok(r.width>=1&&r.height>=1);assert.ok(r.bloomWidth*r.bloomHeight<=p.bloomPixels);scenarios++}
assert.ok(lightProfile('night').headlight>lightProfile('day').headlight);
assert.ok(lightProfile('sunset').headlight>0);
assert.ok(lightProfile('rain').bloom>0);
console.log('Visual settings: '+scenarios+' device/resolution scenarios passed.');
