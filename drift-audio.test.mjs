import assert from 'node:assert/strict';
import {engineMix} from './drift-audio.js';
const idle=engineMix({speed:0,gas:0,slip:0,exhaust:0}),rev=engineMix({speed:24,gas:1,slip:.5,exhaust:1,loose:true});
assert.ok(rev.level>idle.level*2);
assert.ok(rev.frequency>idle.frequency);
assert.ok(rev.tyres>.10);
assert.ok(rev.gravel>.08);
assert.equal(engineMix({speed:0,gas:0,slip:0}).gravel,0);
assert.equal(engineMix({speed:24,gas:1,slip:.5,loose:false}).gravel,0);
for(let speed of [0,4,12,25,50,100])for(let gas of [0,.5,1])for(let exhaust of [0,1,2,3]){let m=engineMix({speed,gas,slip:.5,exhaust,loose:true});assert.ok(Object.values(m).every(Number.isFinite));assert.ok(m.level<=.55&&m.frequency>=35&&m.frequency<=330)}
console.log('Engine mix tests passed');
