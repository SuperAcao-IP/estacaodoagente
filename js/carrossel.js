/* Carrossel da Jornada (Home): os cards acompanham o dedo ou o mouse e, ao soltar,
   encaixam na etapa vizinha. Cada posição continua sendo uma tela do Figma (Home • Stage 1 a 6);
   a faixa que desliza é marcada com data-cx (sua posição horizontal naquela tela). */
(function(){
  const offsetOf=id=>{ const m=(TELAS[id]||'').match(/data-cx="(-?[\d.]+)"/); return m?parseFloat(m[1]):null; };
  let drag=null; window.carMoved=false;
  document.addEventListener('pointerdown',e=>{
    const el=e.target.closest('#app [data-cx]'); if(!el||e.button>0) return;
    const acts=JSON.parse(el.dataset.ia||'[]').filter(a=>a.e==='d'&&a.t);
    drag={el,x0:e.clientX,y0:e.clientY,dx:0,acts,base:parseFloat(el.dataset.cx),
          z:parseFloat(app.style.zoom)||1,t0:performance.now(),on:false,id:e.pointerId};
    window.carMoved=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id) return;
    const dx=e.clientX-drag.x0, dy=e.clientY-drag.y0;
    if(!drag.on){ if(Math.abs(dx)<8) return; if(Math.abs(dy)>Math.abs(dx)){drag=null;return;}
      drag.on=true; window.carMoved=true; drag.el.style.transition='none';
      try{drag.el.setPointerCapture(e.pointerId);}catch(_){} }
    drag.dx=dx/drag.z;
    // resistência nas pontas (sem etapa para aquele lado)
    const tgt=pick(drag.dx<0?-1:1); drag.el.style.transform=`translateX(${tgt?drag.dx:drag.dx*0.25}px)`;
    e.preventDefault();
  },{passive:false});
  function pick(dir,d=drag){ // dir -1 = avançar (cards vão para a esquerda), +1 = voltar
    let best=null;
    for(const a of d.acts){ const t=META[a.t]?a.t:TMAP[a.t]; const o=offsetOf(t); if(o===null) continue;
      if(dir<0? o<d.base : o>d.base){ if(!best||Math.abs(o-d.base)<Math.abs(best.o-d.base)) best={t,o}; } }
    return best;
  }
  function end(e){
    if(!drag||(e&&e.pointerId!==drag.id)) return;
    const d=drag; drag=null; if(!d.on) return;
    const v=d.dx/Math.max(1,performance.now()-d.t0);
    const go=(Math.abs(d.dx)>120||Math.abs(v)>0.4)?pick(d.dx<0?-1:1,d):null;
    d.el.style.transition='transform .28s cubic-bezier(.2,.7,.2,1)';
    if(go){ d.el.style.transform=`translateX(${go.o-d.base}px)`;
      setTimeout(()=>{ show(go.t,true,{instant:true,keepScroll:true}); },270);
    } else d.el.style.transform='translateX(0)';
    setTimeout(()=>{window.carMoved=false;},0);
  }
  document.addEventListener('pointerup',end); document.addEventListener('pointercancel',end);
  // depois de arrastar, o clique que o navegador dispara ao soltar não abre a etapa
  document.addEventListener('click',e=>{ if(window.carMoved){e.stopPropagation();e.preventDefault();} },true);
})();
