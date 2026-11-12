/* Navegação entre telas, popups (overlays) e menu lateral fixo.
   As telas vêm de dados/telas.js (TELAS) e o mapa de telas de dados/mapa-telas.js (META, START, TMAP). */
const app=document.getElementById('app'), fx=document.getElementById('fx'), fxin=fx.firstElementChild,
      ov=document.getElementById('ov'), box=ov.firstElementChild;
let cur=null, overlay=null;
function clone(id){const h=TELAS[id]; if(!h) return null; const t=document.createElement('template'); t.innerHTML=h; return t.content;}
const vw=()=>document.documentElement.clientWidth; // largura útil, sem a barra de rolagem
function zoomFor(w){return Math.min(1.6, vw()/w);}
function layout(){
  if(!cur) return; const m=META[cur], z=zoomFor(m.w);
  app.style.zoom=z; app.style.width=m.w+'px';
  fx.style.zoom=z; fx.style.width=m.w+'px'; fx.style.left='0px'; alignFx();
  if(overlay){const o=META[overlay], oz=Math.min(z, (vw()*0.96)/o.w);
    box.style.zoom=oz; box.style.width=o.w+'px';
    const vh=window.innerHeight/oz; box.style.marginTop=Math.max(16,(vh-o.h)/2)+'px'; box.style.marginBottom='16px';}
}
/* A camada fixa (cabeçalho e menu) acompanha exatamente a borda esquerda da tela renderizada */
function alignFx(){ const z=parseFloat(fx.style.zoom)||1; const r=app.getBoundingClientRect(); fx.style.left=(r.left/z)+'px'; }
window.addEventListener('scroll',()=>{ if(window.scrollX) alignFx(); },{passive:true});
// qualquer mudança de largura útil (barra de rolagem que aparece/some, zoom, janela) realinha o cabeçalho
if(window.ResizeObserver) new ResizeObserver(()=>{ if(cur) layout(); }).observe(document.documentElement);
function show(id,push=true,opts={}){
  if(!META[id]) return; closeOverlay(true);
  const go=()=>{
    const f=clone(id); if(!f) return;
    app.innerHTML=''; fxin.innerHTML='';
    app.appendChild(f.querySelector('.scr')); const fxc=f.querySelector('.fx'); if(fxc) fxin.append(...fxc.childNodes);
    const sy=window.scrollY; cur=id; layout(); window.scrollTo(0,opts.keepScroll?sy:0);
    document.title=META[id].n+' · Estação do Agente';
    requestAnimationFrame(()=>app.classList.remove('fade'));
  };
  if(cur&&!opts.instant){app.classList.add('fade'); setTimeout(go,140);} else go();
  if(push) history.pushState({s:id},'', '#s'+id.replace(':','-'));
}
function openOverlay(id){
  if(!META[id]) return; const f=clone(id); if(!f) return;
  box.innerHTML=''; box.appendChild(f.querySelector('.scr'));
  overlay=id; const m=META[id];
  ov.style.background=m.ob||'rgba(0,0,0,.25)'; ov.classList.add('on'); ov.scrollTop=0;
  document.body.style.overflow='hidden'; layout();
}
function closeOverlay(silent){overlay=null; ov.classList.remove('on'); box.innerHTML=''; document.body.style.overflow=''; if(cur) layout();}
ov.addEventListener('click',e=>{ if(e.target===ov && overlay && META[overlay].oc) closeOverlay(); });
function run(acts,inOverlay){
  for(const a of acts){
    const t=a.t?(META[a.t]?a.t:TMAP[a.t]):null;
    if(a.k==='url'){ if(a.u) {const l=document.createElement('a');l.href=a.u;l.target='_blank';l.rel='noopener';document.body.appendChild(l);l.click();l.remove();}; return; }
    if(a.k==='close'){ closeOverlay(); return; }
    if(a.k==='back'){ if(overlay) closeOverlay(); else history.back(); return; }
    if(!t) continue;
    if(a.k==='overlay'){ openOverlay(t); return; }
    if(a.k==='swap'){ if(inOverlay) openOverlay(t); else show(t); return; }
    if(a.k==='navigate'){ show(t); return; }
  }
}

window.addEventListener('popstate',e=>{ const id=(e.state&&e.state.s)||location.hash.slice(2).replace('-',':')||START; show(id,false); });
window.addEventListener('resize',layout);
/* menus fixos mais altos que a tela: rolam junto até mostrar o fim, depois ficam presos */
function stickFix(){
  const z=parseFloat(fx.style.zoom)||1, vh=window.innerHeight/z, sy=window.scrollY/z;
  [...fxin.children].forEach(el=>{
    if(!el.dataset.h && el.offsetTop<120 && el.offsetHeight<200) el.style.zIndex=2;
    if(!el.dataset.h){el.dataset.h=el.offsetHeight; el.dataset.t=el.offsetTop; el.dataset.tf=el.style.transform||'';}
    const over=(+el.dataset.t)+(+el.dataset.h)-vh+16;
    const dy=over>0?-Math.min(sy,over):0;
    el.style.transform=(el.dataset.tf+' translateY('+dy+'px)').trim();
  });
}
window.addEventListener('scroll',stickFix,{passive:true});
