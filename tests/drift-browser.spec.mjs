import {test,expect} from '@playwright/test';
import path from 'node:path';
test.setTimeout(90000);
test.use({launchOptions:{args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}});
test.beforeEach(async({page})=>{
 // Serve exact pinned Three.js modules from npm, eliminating CDN dependence in tests.
 await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**',async route=>{
  const suffix=new URL(route.request().url()).pathname.split('three@0.160.0/')[1];
  const file=path.resolve('node_modules/three',suffix);
  if(!file.startsWith(path.resolve('node_modules/three')+path.sep))return route.abort();
  try{await route.fulfill({path:file,headers:{'Access-Control-Allow-Origin':'*','Content-Type':suffix.endsWith('.js')?'application/javascript':'application/octet-stream'}})}catch{await route.abort()}
 });
 await page.route('https://api.polyhaven.com/**',r=>r.abort());
 await page.route('https://dl.polyhaven.org/**',r=>r.abort());
 await page.route('https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.12.0/rapier.es.js',r=>r.fulfill({path:path.resolve('node_modules/@dimforge/rapier3d-compat/rapier.es.js'),headers:{'Access-Control-Allow-Origin':'*','Content-Type':'application/javascript'}}));
 await page.addInitScript(()=>localStorage.setItem('wilco-drift-dynasty-v1',JSON.stringify({version:1,cash:2500,owned:[0],selected:0,cleared:[],bosses:[],best:0,combo:0,records:{},builds:{},parts:0,earnings:0,pbrEnabled:false,assetMode:'imported',audio:false})));
});
test('desktop career starts, drives, switches camera and pauses',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/drift-dynasty.html');
 await expect(page.locator('#start')).toBeEnabled({timeout:30000});
 await page.getByRole('button',{name:'Settings',exact:true}).click();
 await page.getByLabel('Graphics',{exact:true}).selectOption('mobile');
 await page.getByRole('button',{name:'Career',exact:true}).click();
 await page.locator('#start').click();
 await expect(page.locator('#hud')).toBeVisible({timeout:30000});
 await page.keyboard.down('w');await page.waitForTimeout(1300);await page.keyboard.up('w');
 await expect.poll(async()=>Number(await page.locator('#speed').textContent()),{timeout:5000}).toBeGreaterThan(0);
 for(let i=0;i<3;i++)await page.keyboard.press('v');
 await expect(page.locator('#cam')).toContainText('Cockpit');
 await page.keyboard.press('Escape');
 await expect(page.locator('#menu')).toBeVisible();
 expect(errors).toEqual([]);
});
test('sandbox can select last circuit and test a locked car',async({page})=>{
 await page.goto('http://127.0.0.1:8765/drift-dynasty.html');
 await page.getByRole('button',{name:'Sandbox',exact:true}).click();
 await page.getByLabel('All circuits',{exact:true}).selectOption('99');
 await page.getByLabel('Test vehicle',{exact:true}).selectOption('129');
 await page.getByLabel('Rivals',{exact:true}).selectOption('0');
 await page.locator('#start').click();
 await expect(page.locator('#hud')).toBeVisible({timeout:30000});
 await expect(page.locator('#eventName')).toContainText('Midnight Zenith');
 await page.locator('#finishPractice').click();
 await expect(page.locator('#result')).toBeVisible();
});

test('mobile sandbox controls and imported car selection remain accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:8765/drift-dynasty.html');
 await page.getByRole('button',{name:'Sandbox',exact:true}).click();
 await page.getByLabel('Rivals',{exact:true}).selectOption('0');
 await page.locator('#start').click();
 await expect(page.locator('#hud')).toBeVisible({timeout:30000});
 await expect(page.locator('#touch')).toBeVisible();
 await page.locator('#finishPractice').click();
 await expect(page.locator('#result')).toBeVisible();
});
