(()=>{
"use strict";
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const N=window.NODES,G=window.GRID,VER=new Set(window.HASH_VERIFIED||[]),PV=new Set(window.PRICE_VERIFIED||[]),CV=new Set(window.CLEAN_VERIFIED||[]),TV=new Set(window.TOP500||[]);
// ---------- decode land mask (odd-r pointy hex, degrees) ----------
const R=G.R,HW=Math.sqrt(3)*R,VH=1.5*R,COLS=G.cols,ROWS=G.rows;
const land=new Uint8Array(COLS*ROWS);{let v=G.first,i=0;for(const n of G.rle){if(v)land.fill(1,i,i+n);i+=n;v^=1}}
const cLon=i=>-180+HW*((i%COLS)+0.5*(((i/COLS)|0)&1)), cLat=i=>G.lat0-VH*((i/COLS)|0);
const NB=[[[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]],[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]]];
function nb(i,d){const c=i%COLS,r=(i/COLS)|0,[dc,dr]=NB[r&1][d];let nc=(c+dc+COLS)%COLS,nr=r+dr;return nr<0||nr>=ROWS?-1:nr*COLS+nc}
// edge d (E,SE,SW,W,NW,NE) lies between corners: E=(0,1)... corner k at angle 60k-30
const EDGE=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]];
const hash01=(i,s=0)=>{let h=(i*374761393+s*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,s=t=>t*t*(3-2*t),h=(a,b)=>hash01(a*7919+b*104729,3);
 const a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1),u=s(fx),v=s(fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const fbm=(x,y)=>vnoise(x,y)*.55+vnoise(x*2.1,y*2.1)*.3+vnoise(x*4.3,y*4.3)*.15;
// ---------- cells ----------
const cells=[];
for(let i=0;i<land.length;i++){if(!land[i])continue;const lon=cLon(i),lat=cLat(i);
 let coast=0;for(let d=0;d<6;d++){const j=nb(i,d);if(j<0||!land[j])coast|=1<<d}
 cells.push({i,lon,lat,coast,elev:fbm(lon/9+40,lat/9+40),moist:fbm(lon/14+7,lat/14+91),n:null,d:1e9})}
// water cells near coast (shallow)
const shallow=[];for(let i=0;i<land.length;i++){if(land[i])continue;for(let d=0;d<6;d++){const j=nb(i,d);if(j>=0&&land[j]){shallow.push({i,lon:cLon(i),lat:cLat(i)});break}}}
// ---------- Civ yield mapping ----------
N.forEach(n=>{
 const cheap=Math.max(0,(0.25-n.price)/0.24);
 n.eh=n.hash/100*(window.NETWORK_EH||941);
 n.production=Math.round(cheap*40+n.hash*1.6);
 n.btcDay=n.hash/100*450;               // 144 blocks × 3.125 BTC subsidy
 n.gold=Math.round(n.btcDay*0.6+n.hash*0.4+n.reg*0.05);
 n.science=Math.round(n.ai*0.8+n.dc.length*6);
 n.wonderCount=n.wonders.length;
 n.score=n.production+n.gold+n.science+n.wonderCount*15+n.clean*0.2+n.reg*0.2;
 n.verified=VER.has(n.id);
});
const rank=[...N].sort((a,b)=>b.score-a.score);rank.forEach((n,i)=>n.rank=i+1);
const infl=n=>3+Math.sqrt(n.score)*0.9;
cells.forEach(h=>{const cl=Math.cos(h.lat*Math.PI/180);for(const n of N){const d=Math.hypot((h.lon-n.lon)*cl,h.lat-n.lat);if(d<infl(n)&&d<h.d){h.d=d;h.n=n}}});
const LENS=[
 {k:'terrain',name:'Terrain'},
 {k:'production',name:'⚒ Production',col:[224,122,63],v:n=>n.production,max:110,txt:'Production = cheap industrial power + Bitcoin hashrate share.'},
 {k:'gold',name:'◉ Gold',col:[241,201,75],v:n=>n.gold,max:110,txt:'Gold = share of the 450 BTC/day block subsidy plus transaction fees.'},
 {k:'science',name:'⚗ Science',col:[79,163,224],v:n=>n.science,max:100,txt:'Science = sovereign AI supercomputers and hyperscale data centers.'},
 {k:'regulation',name:'⚖ Sovereignty',col:[155,111,214],v:n=>n.reg,max:100,txt:'Crypto & mining regulatory friendliness (0–100 editorial index).'},
 {k:'clean',name:'☘ Clean Energy',col:[92,196,107],v:n=>n.clean,max:100,txt:'Low-carbon share of electricity generation (%).'}];
let lens=0,sel=null,hover=null;
// ---------- camera ----------
const cam={x:20,y:22,z:4};
let VW=innerWidth,VHt=innerHeight;
function fit(){VW=innerWidth;VHt=innerHeight;const d=devicePixelRatio||1;cv.width=VW*d;cv.height=VHt*d;cv.style.width=VW+'px';cv.style.height=VHt+'px';cam.z=Math.max(cam.z,VW/360)}
const toS=(lon,lat)=>[(lon-cam.x)*cam.z+VW/2,(cam.y-lat)*cam.z+VHt/2];
const toW=(sx,sy)=>[(sx-VW/2)/cam.z+cam.x,cam.y-(sy-VHt/2)/cam.z];
const K=[];for(let k=0;k<6;k++){const a=Math.PI/180*(60*k-30);K.push([Math.cos(a),Math.sin(a)])}
// ---------- colours ----------
const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const rgb=(c,a=1)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
function terrainCol(h){const a=Math.abs(h.lat),e=h.elev,m=h.moist,j=hash01(h.i,1)*.06-.03;
 let c;
 if(a>70||(a>60&&e>.62))c=[226,232,236];
 else if(e>.72)c=mixc([120,108,92],[200,196,190],(e-.72)*3);
 else if(a<32&&a>12&&m<.42)c=mixc([196,170,112],[214,190,132],m);
 else if(a<14&&m>.5)c=[46,92,48];
 else{const bt=Math.min(1,Math.max(0,(a-38)/18));c=mixc(mixc([138,152,82],[70,112,58],m),mixc([52,86,62],[86,104,74],m),bt*bt*(3-2*bt))}
 const sh=(e-.5)*.5+j;c=sh>0?mixc(c,[255,248,230],sh*.5):mixc(c,[0,0,0],-sh*.8);return c}
cells.forEach(h=>h.tc=terrainCol(h));
// ---------- badges ----------
function badge(n){if(n.pools.length&&n.hash>5)return'⛏';if(n.ai>=50)return'⚗';if(n.wonderCount)return'★';if(n.hash>=2)return'⛏';return'●'}
// ---------- draw ----------
let t0=performance.now();
function draw(){
 const d=devicePixelRatio||1;ctx.setTransform(d,0,0,d,0,0);
 const g=ctx.createLinearGradient(0,0,0,VHt);g.addColorStop(0,'#0b1a2a');g.addColorStop(1,'#06101a');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VHt);
 const s=R*cam.z,L=LENS[lens],vis=(x,y)=>x>-s&&y>-s&&x<VW+s&&y<VHt+s;
 // shallow water
 ctx.fillStyle='rgba(45,109,151,.35)';ctx.beginPath();
 for(const w of shallow){const[x,y]=toS(w.lon,w.lat);if(!vis(x,y))continue;ctx.moveTo(x+s*K[0][0],y+s*K[0][1]);for(let k=1;k<6;k++)ctx.lineTo(x+s*K[k][0],y+s*K[k][1]);ctx.closePath()}
 ctx.fill();
 // land
 const ss=s*1.02;
 for(const h of cells){const[x,y]=toS(h.lon,h.lat);if(!vis(x,y))continue;
  let c=h.tc;
  if(L.v){if(h.n){const f=1-h.d/infl(h.n)*.7,t=Math.min(1,L.v(h.n)/L.max)*f;c=mixc(mixc(c,[20,22,28],.78),L.col,.12+.88*t)}else c=mixc(c,[20,22,28],.8)}
  ctx.beginPath();ctx.moveTo(x+ss*K[0][0],y+ss*K[0][1]);for(let k=1;k<6;k++)ctx.lineTo(x+ss*K[k][0],y+ss*K[k][1]);ctx.closePath();
  ctx.fillStyle=rgb(c);ctx.fill();
  if(s>7){ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.5;ctx.stroke()}}
 // coastline shimmer
 const ph=(performance.now()-t0)/1000;
 ctx.lineCap='round';
 for(const pass of [[5,'rgba(120,200,255,.10)'],[2.2,'rgba(170,225,255,.35)'],[0.9,'rgba(235,250,255,.75)']]){
  ctx.lineWidth=pass[0]*Math.min(1.6,Math.max(.6,cam.z/6));ctx.strokeStyle=pass[1];ctx.beginPath();
  for(const h of cells){if(!h.coast)continue;const[x,y]=toS(h.lon,h.lat);if(!vis(x,y))continue;
   for(let dd=0;dd<6;dd++)if(h.coast&(1<<dd)){const[a,b]=EDGE[dd];ctx.moveTo(x+s*K[a][0],y+s*K[a][1]);ctx.lineTo(x+s*K[b][0],y+s*K[b][1])}}
  ctx.stroke()}
 // shimmer sparkle
 ctx.fillStyle='rgba(255,255,255,.5)';
 for(const h of cells){if(!h.coast)continue;const v=Math.sin(ph*1.7+h.i*.37);if(v<.985)continue;const[x,y]=toS(h.lon,h.lat);if(vis(x,y)){ctx.beginPath();ctx.arc(x,y,1.4,0,7);ctx.fill()}}
 // territory borders for selected / hovered
 for(const t of [hover,sel]){if(!t)continue;ctx.strokeStyle=t===sel?'#f4d58d':'rgba(244,213,141,.5)';ctx.lineWidth=t===sel?2:1.2;ctx.beginPath();
  for(const h of cells){if(h.n!==t)continue;const[x,y]=toS(h.lon,h.lat);if(!vis(x,y))continue;
   for(let dd=0;dd<6;dd++){const j=nb(h.i,dd);const o=j>=0&&land[j]?cellMap.get(j):null;if(!o||o.n!==t){const[a,b]=EDGE[dd];ctx.moveTo(x+s*K[a][0],y+s*K[a][1]);ctx.lineTo(x+s*K[b][0],y+s*K[b][1])}}}
  ctx.stroke()}
 // nodes + label declutter
 const placed=[];const order=[...N].sort((a,b)=>(b===sel)-(a===sel)||b.score-a.score);
 const scale=Math.min(1.5,Math.max(.75,(cam.z/5)**.4));
 const marks=[];
 for(const n of order){const[x,y]=toS(n.lon,n.lat);if(!vis(x,y))continue;const r=(7+Math.min(9,Math.sqrt(n.score)*.6))*scale;marks.push([n,x,y,r])}
 for(const[n,x,y,r]of marks.slice().reverse()){
  ctx.save();ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=8;
  ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/180*(60*k-90);ctx.lineTo(x+r*1.15*Math.cos(a),y+r*1.15*Math.sin(a))}ctx.closePath();
  const gg=ctx.createLinearGradient(x,y-r,x,y+r);gg.addColorStop(0,n===sel?'#fff1c2':'#f1d48a');gg.addColorStop(1,n===sel?'#d8a640':'#8c6a26');ctx.fillStyle=gg;ctx.fill();ctx.restore();
  ctx.lineWidth=1.6;ctx.strokeStyle='#2a1f0b';ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,r*.68,0,7);ctx.fillStyle='#1b2230';ctx.fill();
  ctx.fillStyle='#f4d58d';ctx.font=`${Math.round(r*.9)}px "Segoe UI Symbol",serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(badge(n),x,y+1);
  if(n.wonderCount){ctx.fillStyle='#fff';ctx.font=`${Math.round(r*.55)}px serif`;ctx.fillText('★',x+r*.95,y-r*.85)}}
 ctx.font='600 12px Georgia';ctx.textBaseline='top';
 for(const[n,x,y,r]of marks){const minScore=cam.z<4.5?60:cam.z<7?35:cam.z<11?15:0;if(n!==sel&&n!==hover&&n.score<minScore)continue;
  const label=n.name,w=ctx.measureText(label).width+10,bx=x-w/2,by=y+r*1.2+2,box=[bx,by,bx+w,by+17];
  if(placed.some(p=>!(box[2]<p[0]||box[0]>p[2]||box[3]<p[1]||box[1]>p[3])))continue;placed.push(box);
  ctx.fillStyle='rgba(10,12,18,.82)';ctx.fillRect(bx,by,w,17);ctx.strokeStyle=n===sel?'#f4d58d':'rgba(201,162,74,.6)';ctx.lineWidth=1;ctx.strokeRect(bx+.5,by+.5,w-1,16);
  ctx.fillStyle=n===sel?'#fff1c2':'#efe3c2';ctx.textAlign='center';ctx.fillText(label,x,by+2.5)}
}
const cellMap=new Map(cells.map(h=>[h.i,h]));
// ---------- UI: lenses ----------
const lb=document.getElementById('lenses');
LENS.forEach((l,i)=>{const b=document.createElement('button');b.innerHTML=`<kbd>${i+1}</kbd>${l.name}`;b.onclick=()=>setLens(i);lb.appendChild(b)});
function setLens(i){lens=i;[...lb.children].forEach((b,j)=>b.classList.toggle('on',j==i));const L=LENS[i],el=document.getElementById('legend');
 el.innerHTML=L.col?`<div class="ramp" style="background:linear-gradient(90deg,#1a1d24,${rgb(L.col)})"></div><div class="rl"><span>Low</span><span>High</span></div>${L.txt}`:'Terrain · ⛏ mining hub · ⚗ AI compute · ★ wonder';req()}
// ---------- top bar yields ----------
const sum=f=>N.reduce((s,n)=>s+f(n),0);
document.getElementById('yields').innerHTML=`<b style="color:#e07a3f">⚒ ${sum(n=>n.production)}</b><b style="color:#f1c94b">◉ ${sum(n=>n.gold)}</b><b style="color:#4fa3e0">⚗ ${sum(n=>n.science)}</b><b style="color:#fff">★ ${sum(n=>n.wonderCount)}</b><b class="dim">Network ${window.NETWORK_EH} EH/s · ${window.DATA_ASOF}</b>`;
// ---------- panel ----------
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bar=(v,m,c)=>`<div class="bar"><i style="width:${Math.min(100,v/m*100)}%;background:${c}"></i></div>`;
function advice(n){const a=[];if(n.price<=0.05)a.push('Our power is among the cheapest on Earth — expand the mines.');if(n.hash>10)a.push('We command a dominant share of world hashrate. Guard it.');if(n.ai>50)a.push('Our scientists lead the AI race; route surplus megawatts to GPU clusters.');if(n.reg<30)a.push('Hostile laws drive miners underground. Reform could unlock gold.');if(n.clean>85)a.push('Our grid is nearly carbon-free — a diplomatic advantage.');if(n.price>0.15)a.push('Energy is too costly for mining; invest in Science.');return a.length?a.join(' '):'A balanced civilization. Seek cheaper energy to grow.'}
const tag=(ok,l)=>ok?`<span class="vt ok">${l}</span>`:'<span class="vt" title="Not covered by the cited release">ref</span>';
function panel(n){const p=document.getElementById('panel');if(!n){p.style.display='none';return}
 p.style.display='block';p.innerHTML=`<span id="x">✕</span><div class="crest">${badge(n)}</div><h2>${esc(n.name)}</h2><div class="sub">${esc(n.city)} · Rank #${n.rank} of ${N.length}</div>
 <div class="stat"><span>⚒ Production</span><span>${n.production}</span></div>${bar(n.production,110,'#e07a3f')}
 <div class="stat"><span>◉ Gold</span><span>${n.gold}</span></div>${bar(n.gold,110,'#f1c94b')}
 <div class="stat"><span>⚗ Science</span><span>${n.science}</span></div>${bar(n.science,100,'#4fa3e0')}
 <div class="stat"><span>★ Wonders</span><span>${n.wonderCount}</span></div>
 <h3>Mining & Energy · ${window.DATA_ASOF}</h3>
 <div class="stat"><span>Hashrate share ${tag(n.verified,'HRI Q4-26')}</span><span>${n.hash.toFixed(2)}%</span></div>
 <div class="stat"><span>Hashrate</span><span>${n.eh.toFixed(1)} EH/s</span></div>
 <div class="stat"><span>Implied BTC subsidy / day</span><span>${n.btcDay.toFixed(1)} BTC</span></div>
 <div class="stat"><span>Business power ${tag(PV.has(n.id),'GPP')}</span><span>$${n.price.toFixed(3)}/kWh</span></div>
 <div class="stat"><span>Low-carbon power ${tag(CV.has(n.id),'OWID')}</span><span>${n.clean}%</span></div>${bar(n.clean,100,'#5cc46b')}
 <div class="stat"><span>Regulatory friendliness</span><span>${n.reg}/100</span></div>${bar(n.reg,100,'#9b6fd6')}
 <div class="stat"><span>AI compute index</span><span>${n.ai}/100</span></div>
 ${n.pools.length?`<h3>Mining Pools HQ</h3>${n.pools.map(esc).join(' · ')}`:''}
 ${n.dc.length?`<h3>${TV.has(n.id)?'TOP500 Supercomputers (Nov 2025)':'AI Data Centers'}</h3>${n.dc.map(esc).join('<br>')}`:''}
 ${n.wonders.length?`<h3>World Wonders</h3>★ ${n.wonders.map(esc).join('<br>★ ')}`:''}
 <h3>Advisor</h3><div class="adv">“${advice(n)}”</div><div class="src">Sources: see Almanac</div>`;
 document.getElementById('x').onclick=()=>select(null)}
function select(n,fly){sel=n;panel(n);if(n&&fly){cam.x=n.lon;cam.y=n.lat;cam.z=Math.max(cam.z,9)}req()}
// ---------- search ----------
const si=document.getElementById('search'),sr=document.getElementById('sresults');let sIdx=0,sList=[];
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function sRender(){sr.innerHTML=sList.map((n,i)=>`<div class="sr${i===sIdx?' on':''}" data-i="${i}"><b>${esc(n.name)}</b><span>${esc(n.city)} · ${n.hash.toFixed(1)}%</span></div>`).join('');sr.style.display=sList.length?'block':'none'}
si.addEventListener('input',()=>{const q=norm(si.value.trim());sIdx=0;if(!q){sList=[];return sRender()}
 sList=N.map(n=>{const a=norm(n.name),c=norm(n.city),id=n.id.toLowerCase();const s=id===q?0:a.startsWith(q)?1:c.startsWith(q)?2:a.includes(q)?3:c.includes(q)?4:-1;return[s,n]}).filter(x=>x[0]>=0).sort((a,b)=>a[0]-b[0]||b[1].score-a[1].score).slice(0,8).map(x=>x[1]);sRender()});
si.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='ArrowDown'){sIdx=Math.min(sList.length-1,sIdx+1);sRender();e.preventDefault()}else if(e.key==='ArrowUp'){sIdx=Math.max(0,sIdx-1);sRender();e.preventDefault()}else if(e.key==='Enter'&&sList[sIdx]){pickS(sList[sIdx])}else if(e.key==='Escape'){si.value='';sList=[];sRender();si.blur()}});
sr.addEventListener('mousedown',e=>{const d=e.target.closest('.sr');if(d)pickS(sList[+d.dataset.i])});
function pickS(n){select(n,true);si.value='';sList=[];sRender();si.blur()}
// ---------- almanac ----------
const al=document.getElementById('almanac');
document.getElementById('almbtn').onclick=()=>{al.style.display='flex'};
al.addEventListener('click',e=>{if(e.target===al||e.target.id==='alx')al.style.display='none'});
document.getElementById('altable').innerHTML='<tr><th>Field</th><th>Source</th><th>Status</th></tr>'+window.SOURCES.map(s=>`<tr><td>${esc(s.f)}</td><td>${s.u?`<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.s)}</a>`:esc(s.s)}</td><td>${esc(s.st)}</td></tr>`).join('');
document.getElementById('alnodes').innerHTML='<tr><th>#</th><th>Civilization</th><th>Hash %</th><th>EH/s</th><th>$/kWh</th><th>Clean %</th><th>⚒</th><th>◉</th><th>⚗</th></tr>'+rank.map(n=>`<tr class="pick" data-id="${n.id}"><td>${n.rank}</td><td>${esc(n.name)}</td><td>${n.hash.toFixed(2)}${n.verified?'':'<sup>ref</sup>'}</td><td>${n.eh.toFixed(1)}</td><td>${n.price.toFixed(3)}${PV.has(n.id)?'':'<sup>ref</sup>'}</td><td>${n.clean}</td><td>${n.production}</td><td>${n.gold}</td><td>${n.science}</td></tr>`).join('');
document.getElementById('alnodes').addEventListener('click',e=>{const tr=e.target.closest('tr.pick');if(tr){al.style.display='none';select(N.find(n=>n.id===tr.dataset.id),true)}});
// ---------- input ----------
const tip=document.getElementById('tip');
function pick(sx,sy){let best=null,bd=20;for(const n of N){const[x,y]=toS(n.lon,n.lat),d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best=n}}if(best)return best;
 const[lon,lat]=toW(sx,sy);const r=Math.round((G.lat0-lat)/VH);if(r<0||r>=ROWS)return null;const c=Math.round((lon+180)/HW-0.5*(r&1));const h=cellMap.get(r*COLS+((c%COLS)+COLS)%COLS);return h?h.n:null}
let drag=null,moved=0;
cv.addEventListener('mousedown',e=>{drag=[e.clientX,e.clientY];moved=0});
addEventListener('mouseup',e=>{if(drag&&moved<4&&e.target===cv)select(pick(e.clientX,e.clientY));drag=null});
cv.addEventListener('mousemove',e=>{
 if(drag){const dx=e.clientX-drag[0],dy=e.clientY-drag[1];moved+=Math.abs(dx)+Math.abs(dy);cam.x=Math.max(-180,Math.min(180,cam.x-dx/cam.z));cam.y=Math.max(-58,Math.min(84,cam.y+dy/cam.z));drag=[e.clientX,e.clientY];tip.style.display='none';req();return}
 const n=pick(e.clientX,e.clientY);if(n!==hover){hover=n;req()}
 if(n){tip.style.display='block';tip.style.left=e.clientX+14+'px';tip.style.top=e.clientY+10+'px';tip.innerHTML=`<b>${esc(n.name)}</b> ⚒${n.production} ◉${n.gold} ⚗${n.science}`}else tip.style.display='none'});
cv.addEventListener('mouseleave',()=>{tip.style.display='none';if(hover){hover=null;req()}});
cv.addEventListener('wheel',e=>{e.preventDefault();const[wx,wy]=toW(e.clientX,e.clientY);cam.z=Math.max(VW/400,Math.min(80,cam.z*Math.exp(-e.deltaY*.0015)));const[nx,ny]=toW(e.clientX,e.clientY);cam.x+=wx-nx;cam.y+=wy-ny;req()},{passive:false});
addEventListener('keydown',e=>{if(e.target===si)return;if(e.key==='/'){si.focus();e.preventDefault();return}const k=+e.key;if(k>=1&&k<=LENS.length)setLens(k-1);if(e.key==='Escape'){al.style.display='none';select(null)}});
let raf=0;function req(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;draw()})}
setInterval(req,120); // coastline shimmer
addEventListener('resize',()=>{fit();req()});
fit();setLens(0);
})();
