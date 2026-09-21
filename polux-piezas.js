/*! Polux Piezas — el visitante marca lo que le gusta DENTRO de cada demo.
    Guarda en localStorage 'poluxPiezas': [{d:'Brasa', p:'Repartidor animado'}].
    La lista se revisa en el hub, en el modal "Armar mi pedido" (../?pedido=1). */
(function(){
'use strict';
if(/(?:\?|&)embed=1/.test(location.search))return; /* no en miniaturas */
var DESIGN=(window.POLUX_CHAT&&window.POLUX_CHAT.design)||document.title.replace(/\s*—.*/,'')||'Diseño';
var KEY='poluxPiezas';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
function mine(){return load().filter(function(x){return x.d===DESIGN})}
function toggle(p){var v=load(),i=v.findIndex(function(x){return x.d===DESIGN&&x.p===p});
  if(i>=0)v.splice(i,1);else v.push({d:DESIGN,p:p});save(v);return i<0}
/* secciones candidatas */
var cands=[...document.querySelectorAll('body > header, body > div.hero, body > main section, body > section')]
  .filter(function(s){return !s.closest('#pw-panel,#polux-chat-root,#pz-selfab,#pz-toast,#pz-bar')});
if(!cands.length)cands=[...document.querySelectorAll('section')];
cands=cands.filter(function(s){return !s.hasAttribute('data-no-pieza')});
function nombre(s,i){
  if(s.dataset.pieza)return s.dataset.pieza;
  var h=s.querySelector('h1,h2,h3');
  if(h&&h.textContent.trim())return h.textContent.trim().replace(/\s+/g,' ').slice(0,55);
  return 'Sección '+(i+1);
}
/* ---------- estilos ---------- */
var css=
'#pz-selfab{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(18px + env(safe-area-inset-bottom));z-index:10003;'
+'width:54px;height:54px;border-radius:50%;background:rgba(18,18,28,.94);border:1px solid #A855F7;color:#fff;'
+'font-size:1.35rem;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45);backdrop-filter:blur(8px);'
+'display:flex;align-items:center;justify-content:center}'
+'body.pz-mode #pz-selfab{background:#A855F7;color:#0A0A0C}'
+'#pz-selfab .pz-n{position:absolute;top:-7px;right:-7px;min-width:23px;height:23px;border-radius:999px;'
+'background:#A855F7;color:#0A0A0C;font-size:.72rem;font-weight:800;display:none;align-items:center;'
+'justify-content:center;padding:0 6px;border:2px solid #0A0A0C}'
+'#pz-selfab.tiene .pz-n{display:flex}'
+'body.pz-mode #pz-selfab .pz-n{display:none}'
+'.pz-cand{position:relative}'
+'body.pz-mode .pz-cand{outline:2px dashed #A855F7 !important;outline-offset:-2px;cursor:pointer !important}'
+'.pz-cand .pz-tag{display:none;position:absolute;top:12px;right:12px;z-index:60;width:36px;height:36px;border-radius:50%;'
+'background:rgba(10,10,12,.78);border:1px solid #A855F7;color:#fff;align-items:center;'
+'justify-content:center;font-size:1.15rem;font-weight:800;pointer-events:none}'
+'body.pz-mode .pz-cand .pz-tag{display:flex}'
+'body.pz-mode .pz-cand.pz-sel{outline-style:solid !important}'
+'.pz-cand.pz-sel .pz-tag{background:#A855F7;color:#0A0A0C}'
+'#pz-hint{position:fixed;top:calc(10px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);'
+'z-index:10003;background:#A855F7;color:#0A0A0C;font-weight:700;font-size:.78rem;border-radius:999px;'
+'padding:8px 16px;display:none;box-shadow:0 6px 20px rgba(0,0,0,.4);white-space:nowrap;max-width:94vw}'
+'body.pz-mode #pz-hint{display:block}'
+'#pz-toast{position:fixed;left:50%;transform:translate(-50%,14px);bottom:calc(86px + env(safe-area-inset-bottom));'
+'z-index:10004;background:rgba(16,16,26,.96);border:1px solid #A855F7;color:#fff;border-radius:999px;'
+'padding:10px 20px;font-size:.85rem;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;'
+'white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis}'
+'#pz-toast.show{opacity:1;transform:translate(-50%,0)}'
+'#pz-bar{position:fixed;left:50%;transform:translate(-50%,140px);bottom:calc(86px + env(safe-area-inset-bottom));'
+'z-index:10004;background:rgba(16,16,26,.96);border:1px solid #A855F7;border-radius:999px;'
+'padding:9px 9px 9px 20px;display:flex;gap:14px;align-items:center;transition:transform .3s;'
+'font-size:.88rem;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.5);white-space:nowrap}'
+'#pz-bar.show{transform:translate(-50%,0)}'
+'#pz-bar a{background:#A855F7;color:#0A0A0C;border-radius:999px;padding:9px 18px;font-weight:800;text-decoration:none}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
/* ---------- elementos ---------- */
var fab=document.createElement('button');fab.id='pz-selfab';
fab.setAttribute('aria-label','Seleccionar lo que te gusta de este diseño');
fab.innerHTML='<span class="pz-ic">✦</span><span class="pz-n">0</span>';
var hint=document.createElement('div');hint.id='pz-hint';hint.textContent='Toca lo que te guste · ✕ para salir';
var toast=document.createElement('div');toast.id='pz-toast';
var bar=document.createElement('div');bar.id='pz-bar';
document.body.appendChild(fab);document.body.appendChild(hint);
document.body.appendChild(toast);document.body.appendChild(bar);
/* ---------- lógica ---------- */
var inited=false, toastT=null, barT=null;
function say(m){toast.textContent=m;toast.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(function(){toast.classList.remove('show')},1900)}
function paintBadge(){var c=mine().length;
  fab.querySelector('.pz-n').textContent=c;fab.classList.toggle('tiene',c>0)}
function showBar(){var c=mine().length;if(!c)return;
  bar.innerHTML='<span><b>'+c+'</b> en tu lista</span><a href="../?pedido=1">Revisar →</a>';
  bar.classList.add('show');
  clearTimeout(barT);barT=setTimeout(function(){bar.classList.remove('show')},4500)}
function enter(){
  document.body.classList.add('pz-mode');
  fab.querySelector('.pz-ic').textContent='✕';
  if(!inited){inited=true;
    cands.forEach(function(s,i){
      s.classList.add('pz-cand');
      var tag=document.createElement('span');tag.className='pz-tag';tag.textContent='+';s.appendChild(tag);
      s.dataset.pzNombre=nombre(s,i);
      var ya=mine().some(function(x){return x.p===s.dataset.pzNombre});
      if(ya){s.classList.add('pz-sel');tag.textContent='✓'}
    });
  }
}
function exit(){
  document.body.classList.remove('pz-mode');
  fab.querySelector('.pz-ic').textContent='✦';
  paintBadge();showBar();
}
fab.addEventListener('click',function(){
  document.body.classList.contains('pz-mode')?exit():enter();
});
document.addEventListener('click',function(e){
  if(!document.body.classList.contains('pz-mode'))return;
  var s=e.target.closest('.pz-cand');if(!s)return;
  e.preventDefault();e.stopPropagation();
  var on=toggle(s.dataset.pzNombre);
  s.classList.toggle('pz-sel',on);
  s.querySelector('.pz-tag').textContent=on?'✓':'+';
  paintBadge();
  say(on?'✓ «'+s.dataset.pzNombre+'» guardado':'«'+s.dataset.pzNombre+'» quitado');
},true);
paintBadge();
window.PoluxPiezas={design:DESIGN,count:function(){return mine().length}};
})();
