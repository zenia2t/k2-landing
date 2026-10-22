import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const host=document.getElementById('zm3d'); if(host){
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio*1.5,3));host.appendChild(R.domElement);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(26,1,.1,100);
const G=new THREE.Group();S.add(G);
const fill=new THREE.MeshBasicMaterial({color:0x161616,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
const lineM=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.9});
const LS=[];const hullM=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.BackSide,transparent:true,opacity:0});
const faint=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.35});
function part(geo,pos,rot,scl,ang=12,mat=lineM){const g=new THREE.Group();const m=new THREE.Mesh(geo,fill);g.add(m);const pr=geo.parameters||{};if(mat!==faint&&!(geo instanceof THREE.TubeGeometry)&&!(pr.thetaLength<Math.PI-1e-3)&&!(pr.phiLength<Math.PI*2-1e-3)&&!pr.openEnded&&!(pr.arc<Math.PI*2-1e-3)){geo.computeBoundingSphere();const k=1+.012/Math.max(geo.boundingSphere.radius,.05);const h=new THREE.Mesh(geo,hullM);h.scale.setScalar(k);h.position.copy(geo.boundingSphere.center).multiplyScalar(1-k);g.add(h)}{const ls=new THREE.LineSegments(new THREE.EdgesGeometry(geo,ang),mat);ls.geometry.setDrawRange(0,0);LS.push(ls);g.add(ls)}if(pos)g.position.set(...pos);if(rot)g.rotation.set(...rot);if(scl)g.scale.set(...scl);G.add(g);return g}
// cabeza
part(new RoundedBoxGeometry(1.6,1.42,1.36,14,.42),[0,.62,0],null,null,8);
// visera / costura frontal
const vis=new THREE.Shape();vis.absarc(0,0,.5,0,Math.PI*2);
// diadema de los cascos (media rosca)
part(new THREE.TorusGeometry(.92,.055,10,60,Math.PI),[0,.62,0],[0,0,0],null,25);
// orejeras
const cup=new THREE.CylinderGeometry(.34,.34,.2,40,1);
part(cup,[.9,.55,0],[0,0,Math.PI/2],null,25);part(cup,[-.9,.55,0],[0,0,Math.PI/2],null,25);
part(new THREE.CylinderGeometry(.24,.24,.06,40),[1.02,.55,0],[0,0,Math.PI/2],null,25);part(new THREE.CylinderGeometry(.24,.24,.06,40),[-1.02,.55,0],[0,0,Math.PI/2],null,25);
// micro: brazo curvo + cápsula
const path=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.0,.42,.1),new THREE.Vector3(-.95,.18,.55),new THREE.Vector3(-.6,.05,.85),new THREE.Vector3(-.28,.04,.92)]);
part(new THREE.TubeGeometry(path,40,.028,8),null,null,null,30,faint);
part(new THREE.CapsuleGeometry(.07,.16,12,48),[-.24,.04,.93],[0,0,Math.PI/2],null,25);
// LED coral
const lg=new THREE.CylinderGeometry(.09,.09,.028,40);const led=new THREE.Mesh(lg,new THREE.MeshBasicMaterial({color:0xff4f4a,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));led.rotation.z=Math.PI/2;led.position.set(1.09,.55,0);led.add(new THREE.LineSegments(new THREE.EdgesGeometry(lg,25),lineM));G.add(led);
const ring=new THREE.Mesh(new THREE.TorusGeometry(.11,.004,8,64),new THREE.MeshBasicMaterial({color:0xffffff}));ring.rotation.y=Math.PI/2;ring.position.set(1.087,.55,0);G.add(ring);
const gc=document.createElement('canvas');gc.width=gc.height=128;{const x=gc.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.35)');g.addColorStop(.6,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}
const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(gc),color:0xff4f4a,blending:THREE.AdditiveBlending,depthTest:false,transparent:true,opacity:.35,depthWrite:false}));glow.scale.set(.36,.36,1);glow.position.set(1.12,.55,0);G.add(glow);
// cuello y sudadera
part(new THREE.CylinderGeometry(.34,.4,.25,40),[0,-.18,0],null,null,25,faint);
part(new THREE.CapsuleGeometry(.82,1.05,12,48),[0,-1.45,0],null,[1.15,1,.72],10);
part(new THREE.TorusGeometry(.5,.12,12,48),[0,-.32,.05],[Math.PI/2.3,0,0],null,25);
// capucha (casquete detrás)
//part(new THREE.SphereGeometry(.72,48,32,0,Math.PI*2,0,Math.PI/2.2),[0,-.2,-.42],[-.6,0,0],[1.1,1,.8],12,faint);
// cordones
//[-.18,.18].forEach(x=>part(new THREE.CylinderGeometry(.018,.018,.55,8),[x,-.62,.6],[.12,0,0],null,30,faint));
// brazos y manos
[-1,1].forEach(s=>{part(new THREE.CapsuleGeometry(.24,.95,12,48),[s*1.0,-1.55,.12],[.35,0,s*.22],null,12);
  part(new THREE.SphereGeometry(.24,48,32),[s*.8,-2.15,.62],null,[1,.8,1.2],14);
  [0,1,2,3].forEach(k=>part(new THREE.CapsuleGeometry(.045,.16,12,48),[s*(.68+k*.075),-2.05,.86],[1.2,0,0],null,30,faint));});
// pasos de cámara: [posición, objetivo]
const P=[[[0,.75,4.8],[0,.42,0]],[[-1.1,.25,2.2],[-.35,.1,.8]],[[-.9,.75,3.0],[.25,.35,0]],[[3.4,.95,2.9],[.1,.45,.3]],[[1.5,.45,4.6],[0,-.05,0]]];
let i=0,cp=new THREE.Vector3(...P[4][0]),ct=new THREE.Vector3(...P[4][1]);C.position.copy(cp);
window.__konvo3d=n=>{i=n};
function size(){const w=host.clientWidth,h=host.clientHeight;R.setSize(w,h);C.aspect=w/h;C.updateProjectionMatrix()}addEventListener('resize',size);size();
let t0=-1;new IntersectionObserver(e=>{if(e[0].isIntersecting&&t0<0)t0=performance.now()},{threshold:.15}).observe(host);led.visible=ring.visible=glow.visible=false;
const clk=new THREE.Clock();(function loop(){requestAnimationFrame(loop);const t=clk.getElapsedTime();
  {cp.lerp(new THREE.Vector3(...P[i][0]),.045);ct.lerp(new THREE.Vector3(...P[i][1]),.045);const want=i===0?-G.rotation.y:.45*Math.sin(t*.3);loop.a=loop.a||0;let d=want-loop.a;d=Math.atan2(Math.sin(d),Math.cos(d));loop.a+=d*.045;const ang=G.rotation.y+loop.a,Y=new THREE.Vector3(0,1,0);C.position.copy(cp).applyAxisAngle(Y,ang);C.lookAt(ct.clone().applyAxisAngle(Y,ang))}
  const dt=Math.min(.05,t-(loop.l||t));loop.l=t;G.rotation.y+=dt*.07;if(G.rotation.y>Math.PI*2){G.rotation.y-=Math.PI*2};{const ax=new THREE.Vector3(1,0,0).applyQuaternion(G.quaternion),wp=glow.getWorldPosition(new THREE.Vector3()),f=Math.max(0,ax.dot(C.position.clone().sub(wp).normalize()));glow.material.opacity=(.35+Math.sin(t*2.2)*.1)*Math.min(1,f*2.5)}led.material.color.setRGB(1,.3+Math.sin(t*2.2)*.04,.28+Math.sin(t*2.2)*.04,THREE.SRGBColorSpace);if(t0>=0){const b=Math.min(1,(performance.now()-t0)/2600),N=LS.length;LS.forEach((l,k)=>{const d=Math.max(0,Math.min(1,b*1.6-k/N*.6));const n=l.geometry.attributes.position.count;l.geometry.setDrawRange(0,Math.floor(n*(1-Math.pow(1-d,3))/2)*2)});hullM.opacity=.9*Math.max(0,(b-.55)/.45);led.visible=ring.visible=glow.visible=b>.85}R.render(S,C)})();
}
