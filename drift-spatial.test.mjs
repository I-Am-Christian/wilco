import assert from 'node:assert/strict';
import {overlap,vehicleBox,placementClear,solveWorld} from './drift-spatial.js';
const a={x:0,z:0,w:2,d:5,a:0},b={...a,x:1.8,z:2,a:.4};
assert.ok(overlap(a,b));assert.equal(overlap(a,{...a,x:5}),null);
assert.equal(placementClear(a,[b],.4),false);assert.equal(placementClear(a,[{...a,x:8}],.4),true);
let p={x:0,z:0,yaw:0,vx:0,vz:12,r:0,speed:12},wall={x:0,z:2,w:12,d:.3,a:0};
let impact=solveWorld(p,[wall],2,5);assert.ok(impact>0);assert.equal(overlap(vehicleBox(p,2,5),wall),null);
assert.ok(overlap(vehicleBox({x:0,z:0,yaw:0},2.5,5.8),{x:0,z:2.8,w:1,d:.3,a:0}));
console.log('Spatial tests passed');
