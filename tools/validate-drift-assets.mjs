// Free Khronos validator for locally hosted GLB assets. No uploads or API keys.
import {readFile,readdir} from 'node:fs/promises';
import validator from 'gltf-validator';
let failures=0;const paths=process.argv.slice(2);
for(const file of paths.length?paths:(await readdir('drift-assets')).filter(n=>n.endsWith('.json')).map(n=>'drift-assets/'+n)){
 try{let raw=await readFile(file),data=file.endsWith('.json')?Buffer.from(JSON.parse(raw.toString('utf8')).base64,'base64'):raw;
 if(data.length>10*1024*1024||data.length<20||data.readUInt32LE(0)!==0x46546c67||data.readUInt32LE(4)!==2||data.readUInt32LE(8)!==data.length)throw Error('Invalid or oversized GLB');
 let report=await validator.validateBytes(new Uint8Array(data),{uri:file,maxIssues:100});console.log(file+': '+report.issues.numErrors+' errors, '+report.issues.numWarnings+' warnings');
 for(let issue of report.issues.messages.filter(i=>i.severity===0))console.error(issue.code+': '+issue.message);if(report.issues.numErrors)failures++;
 }catch(e){console.error(file+': '+e.message);failures++}
}process.exitCode=failures?1:0;
