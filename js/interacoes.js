/* Cliques e gestos de arrastar: executam as interações do protótipo (navegar, abrir popup, trocar, fechar, links). */
let down=null, swiped=false;
document.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}; swiped=false;});
document.addEventListener('pointerup',e=>{
  if(!down) return; const dx=e.clientX-down.x, dy=e.clientY-down.y; down=null;
  if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)){
    const el=e.target.closest('.ia'); if(!el) return;
    let n=el; while(n){ if(n.dataset&&n.dataset.ia){const d=JSON.parse(n.dataset.ia).filter(a=>a.e==='d'); if(d.length){swiped=true; run(d,!!n.closest('#ov')); return;}} n=n.parentElement&&n.parentElement.closest('.ia'); }
  }
});
document.addEventListener('click',e=>{
  if(swiped){swiped=false; return;}
  if(e.target.closest('a[href]')) return;
  let el=e.target.closest('.ia');
  while(el){
    const all=JSON.parse(el.dataset.ia), c=all.filter(a=>a.e==='c');
    const acts=c.length?c:all;
    if(acts.length){ e.preventDefault(); run(acts, !!el.closest('#ov')); return; }
    el=el.parentElement&&el.parentElement.closest('.ia');
  }
});
