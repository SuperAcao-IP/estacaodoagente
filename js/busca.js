/* Busca: global (topo, procura em todas as telas e popups) e local (Biblioteca, Tutoriais, Políticas, filtra os cards). */
const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const clean=e=>e.innerHTML.replace(/<br>/g,' ').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const IDX=[]; const seen=new Set();
function label(id){
  let n=META[id].n.replace(/^Tablet\s*[-•]\s*(Campo \(Horizontal\)\s*-\s*)?/,'').replace(/^Home.*$/,'Home');
  return n;
}
Object.keys(TELAS).forEach(id=>{
  if(!META[id]) return;
  const tp=document.createElement('template'); tp.innerHTML=TELAS[id];
  const scr=tp.content.querySelector('.scr'); if(!scr) return;
  const parts=[...scr.querySelectorAll('.tx,.tf')].map(clean).filter(Boolean);
  const body=parts.join(' · '); const key=norm(body); if(seen.has(key)) return; seen.add(key);
  const isPop=META[id].w<1100;
  let title=label(id);
  {let best=null,bf=0; scr.querySelectorAll('.tx').forEach(e=>{const f=parseFloat(e.style.fontSize)||0; if(f>bf&&e.textContent.trim().length>2){bf=f;best=e;}}); if(!isPop&&best&&bf>=24){const s=clean(best).toLowerCase(); title=s.charAt(0).toUpperCase()+s.slice(1).replace(/\bsp\b/g,'SP');}}
  if(isPop||/Popup/.test(title)) title=parts.find(p=>p.length>3&&p.length<90&&!/^Fechar$/i.test(p))||title;
  IDX.push({id,title,isPop,body,nb:norm(body)});
});
const drop=document.createElement('div'); drop.id='sx-drop'; document.body.appendChild(drop);
let gq='', gsel=0, gres=[];
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function snippet(item,q){
  const nb=item.nb, i=nb.indexOf(q); if(i<0) return esc(item.body.slice(0,140));
  const a=Math.max(0,i-60), b=Math.min(item.body.length,i+q.length+80);
  const raw=item.body.slice(a,b);
  return (a?'…':'')+esc(raw.slice(0,i-a))+'<mark>'+esc(raw.slice(i-a,i-a+q.length))+'</mark>'+esc(raw.slice(i-a+q.length))+(b<item.body.length?'…':'');
}
function globalSearch(inp){
  const q=norm(inp.value); gq=inp.value;
  if(q.length<2){drop.classList.remove('on');return;}
  const words=q.split(' ');
  gres=IDX.filter(it=>words.every(w=>it.nb.includes(w))).map(it=>({it,s:(norm(it.title).includes(q)?0:1)+(it.isPop?0.5:0)})).sort((a,b)=>a.s-b.s).slice(0,30).map(x=>x.it);
  gsel=0;
  drop.innerHTML=gres.length?gres.map((it,i)=>`<div class="it${i?'':' sel'}" data-i="${i}"><div class="lb">${esc(it.title)}</div><div class="sn">${snippet(it,words[0])}</div></div>`).join(''):'<div class="no">Nenhum resultado para “'+esc(inp.value)+'”.</div>';
  const r=inp.closest('.n').getBoundingClientRect();
  drop.style.left=Math.max(8,Math.min(r.left,window.innerWidth-Math.max(r.width,420)-8))+'px'; drop.style.top=(r.bottom+8)+'px'; drop.style.width=Math.max(r.width,420)+'px';
  drop.classList.add('on');
}
function goResult(it){ drop.classList.remove('on'); gq=''; if(it.isPop){ openOverlay(it.id);} else show(it.id); }
drop.addEventListener('click',e=>{const el=e.target.closest('.it'); if(el) goResult(gres[+el.dataset.i]);});
document.addEventListener('pointerdown',e=>{ if(!e.target.closest('#sx-drop')&&!e.target.classList.contains('sx-in')) drop.classList.remove('on'); },true);

const LQ={};
const MARK=/^(Saiba Mais|Clique e assista)$/i;
function findCards(root){
  const marks=[...root.querySelectorAll('.tx')].filter(e=>MARK.test(e.textContent.trim())).map(e=>e.closest('.n'));
  if(marks.length<1) return null;
  const cards=marks.map(m=>{ let c=m; while(c.parentElement&&c.parentElement.closest('.n')&&marks.filter(x=>c.parentElement.contains(x)).length===1) c=c.parentElement; return c; });
  const uniq=[...new Set(cards)];
  return uniq;
}
function localSearch(inp,kind){
  const q=norm(inp.value); LQ[kind]=inp.value;
  const root=inp.closest('.scr')||document.getElementById('app');
  const cards=findCards(document.getElementById('app')); if(!cards) return;
  cards.forEach(c=>{ if(!c.dataset.ol){c.dataset.ol=c.style.left;c.dataset.ot=c.style.top;c.dataset.otr=c.style.transform;} });
  const slots=cards.map(c=>({l:c.dataset.ol,t:c.dataset.ot,tr:c.dataset.otr,p:c.parentElement})).sort((a,b)=>(parseFloat(a.t)||0)-(parseFloat(b.t)||0)||(parseFloat(a.l)||0)-(parseFloat(b.l)||0));
  const ordered=[...cards].sort((a,b)=>(parseFloat(a.dataset.ot)||0)-(parseFloat(b.dataset.ot)||0)||(parseFloat(a.dataset.ol)||0)-(parseFloat(b.dataset.ol)||0));
  const words=q?q.split(' '):[]; let k=0;
  ordered.forEach(c=>{
    const ok=words.every(w=>norm(c.textContent+' '+[...c.querySelectorAll('.tx')].map(e=>e.textContent).join(' ')).includes(w));
    if(ok){ const s=slots[k++]; if(s.p!==c.parentElement) s.p.appendChild(c); c.style.left=s.l;c.style.top=s.t;c.style.transform=s.tr; c.style.display=''; }
    else c.style.display='none';
  });
  document.querySelectorAll('.sx-empty').forEach(e=>e.remove());
  if(!k && ordered.length){ const s=slots[0]; const m=document.createElement('div'); m.className='sx-empty'; m.style.left=s.l||'0'; m.style.top=s.t||'0'; m.style.transform=s.tr; m.style.width='700px'; m.textContent='Nenhum resultado para “'+inp.value+'”. Tente outro termo ou selecione “Todos”.'; s.p.appendChild(m); }
}
function attachSearch(){
  document.querySelectorAll('#app .tx, #fx .tx, #ov .tx').forEach(tx=>{
    const txt=tx.textContent.trim(); if(!/^Buscar/.test(txt)) return;
    const node=tx.closest('.n'); if(node.dataset.sx) return; node.dataset.sx=1;
    // host = pill around the placeholder
    let host=node; for(let p=node.parentElement; p&&p.classList.contains('n'); p=p.parentElement){ if(p.offsetWidth>=node.offsetWidth+40){host=p;break;} }
    const kind=/Esta[cç][aã]o/.test(txt)?'global':norm(txt);
    const inp=document.createElement('input'); inp.className='sx-in'; inp.type='search'; inp.setAttribute('aria-label',txt);
    const fs=parseFloat(tx.style.fontSize)||14;
    inp.style.fontSize=fs+'px';
    // position input over host, starting where the placeholder starts
    let x=0,y=0,e=node; while(e&&e!==host){ x+=e.offsetLeft; y+=e.offsetTop; e=e.offsetParent; }
    inp.style.left=x+'px'; inp.style.top='0'; inp.style.height=host.offsetHeight+'px';
    inp.style.width=Math.max(60,host.offsetWidth-x-48)+'px';
    host.appendChild(inp);
    const sync=()=>node.classList.toggle('sx-hide',!!inp.value);
    if(kind==='global'){ inp.value=gq; inp.addEventListener('input',()=>{sync();globalSearch(inp);});
      inp.addEventListener('focus',()=>{ if(inp.value) globalSearch(inp); });
      inp.addEventListener('keydown',ev=>{ const its=drop.querySelectorAll('.it');
        if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault(); if(!its.length)return; its[gsel].classList.remove('sel'); gsel=(gsel+(ev.key==='ArrowDown'?1:its.length-1))%its.length; its[gsel].classList.add('sel'); its[gsel].scrollIntoView({block:'nearest'});}
        else if(ev.key==='Enter'&&gres[gsel]) goResult(gres[gsel]); else if(ev.key==='Escape') drop.classList.remove('on'); });
    } else { inp.value=LQ[kind]||''; inp.addEventListener('input',()=>{sync();localSearch(inp,kind);}); if(inp.value) localSearch(inp,kind); }
    host.addEventListener('click',ev=>{ if(ev.target!==inp){ev.stopPropagation(); inp.focus();} },true);
    sync();
  });
}
const _layout=layout; layout=function(){ _layout(); requestAnimationFrame(()=>{attachSearch(); stickFix();}); };
