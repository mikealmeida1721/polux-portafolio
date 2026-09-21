/*! Polux Piezas — el visitante marca lo que le gusta DENTRO de cada demo.
    Guarda en localStorage 'poluxPiezas': [{d:'Brasa', p:'Repartidor animado'}].
    El hub lo lee en el modal "Armar mi pedido". */
(function(){
'use strict';
if(/(?:\?|&)embed=1/.test(location.search))return; /* no en miniaturas */
var DESIGN=(window.POLUX_CHAT&&window.POLUX_CHAT.design)||document.title.replace(/\s*—.*/,'')||'Diseño';
var KEY='poluxPiezas';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
function has(d,p){return load().some(function(x){return x.d===d&&x.p===p})}
function toggle(d,p){var v=load(),i=v.findIndex(function(x){return x.d===d&&x.p===p});
  if(i>=0)v.splice(i,1);else v.push({d:d,p:p});save(v);return i<0}
/* secciones candidatas: headers top-level + secciones (excluye paneles propios) */
var cands=[...document.querySelectorAll('body > header, body > div.hero, body > main section, body > section')]
  .filter(function(s){return !s.closest('#pw-panel,#polux-chat-root,#pz-fab,#pz-bar')});
if(!cands.length)cands=[...document.querySelectorAll('section')];
cands=cands.filter(function(s){return !s.hasAttribute('data-no-pieza')});
function nombre(s,i){
  if(s.dataset.pieza)return s.dataset.pieza;
  var h=s.querySelector('h1,h2,h3');
  if(h&&h.textContent.trim())return h.textContent.trim().replace(/\s+/g,' ').slice(0,55);
  return 'Sección '+(i+1);
}
/* estilos */
var css='#pz-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:20px;z-index:10003;'
+'background:rgba(18,18,28,.94);border:1px solid #A855F7;color:#fff;border-radius:999px;'
+'padding:12px 22px;font-size:.88rem;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45);'
+'backdrop-filter:blur(8px);white-space:nowrap}'
+'body.pz-mode #pz-fab{background:#A855F7;color:#0A0A0C}'
+'.pz-cand{position:relative;outline:2px dashed #A855F7 !important;outline-offset:-2px;cursor:pointer !important}'
+'.pz-cand .pz-tag{position:absolute;top:12px;right:12px;z-index:60;width:36px;height:36px;border-radius:50%;'
+'background:rgba(10,10,12,.75);border:1px solid #A855F7;color:#fff;display:flex;align-items:center;'
+'justify-content:center;font-size:1.15rem;font-weight:800;pointer-events:none}'
+'.pz-cand.pz-sel{outline-style:solid !important;box-shadow:inset 0 0 0 3px rgba(168,85,247,.35)}'
+'.pz-cand.pz-sel .pz-tag{background:#A855F7;color:#0A0A0C}'
+'#pz-hint{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:10003;background:#A855F7;'
+'color:#0A0A0C;font-weight:700;font-size:.82rem;border-radius:999px;padding:9px 20px;display:none;'
+'box-shadow:0 6px 20px rgba(0,0,0,.4);white-space:nowrap}'
+'body.pz-mode #pz-hint{display:block}'
+'#pz-bar{position:fixed;left:50%;transform:translate(-50%,160px);bottom:76px;z-index:10003;'
+'background:rgba(16,16,26,.95);border:1px solid #A855F7;border-radius:999px;padding:9px 9px 9px 20px;'
+'display:flex;gap:14px;align-items:center;transition:transform .3s;font-size:.88rem;color:#fff;'
+'box-shadow:0 10px 30px rgba(0,0,0,.5);white-space:nowrap}'
+'#pz-bar.show{transform:translate(-50%,0)}'
+'#pz-bar a{background:#A855F7;color:#0A0A0C;border-radius:999px;padding:9px 18px;font-weight:800;text-decoration:none}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var fab=document.createElement('button');fab.id='pz-fab';fab.textContent='✦ Seleccionar lo que te gusta';
var hint=document.createElement('div');hint.id='pz-hint';hint.textContent='Toca las secciones que te gusten · ✕ para salir';
var bar=document.createElement('div');bar.id='pz-bar';
document.body.appendChild(fab);document.body.appendChild(hint);document.body.appendChild(bar);
var inited=false;
function paintBar(){
  var mine=load().filter(function(x){return x.d===DESIGN});
  if(mine.length){bar.innerHTML='<span><b>'+mine.length+'</b> pieza'+(mine.length>1?'s':'')+' elegida'+(mine.length>1?'s':'')+'</span><a href="../?pedido=1">Ver mi pedido →</a>';bar.classList.add('show')}
  else bar.classList.remove('show');
}
function enter(){
  document.body.classList.add('pz-mode');fab.textContent='✕ Salir de selección';
  if(!inited){inited=true;
    cands.forEach(function(s,i){
      s.classList.add('pz-cand');
      var tag=document.createElement('span');tag.className='pz-tag';tag.textContent='+';s.appendChild(tag);
      s.dataset.pzNombre=nombre(s,i);
      if(has(DESIGN,s.dataset.pzNombre)){s.classList.add('pz-sel');tag.textContent='✓'}
    });
  }
}
function exit(){document.body.classList.remove('pz-mode');fab.textContent='✦ Seleccionar lo que te gusta'}
fab.addEventListener('click',function(){document.body.classList.contains('pz-mode')?exit():enter()});
document.addEventListener('click',function(e){
  if(!document.body.classList.contains('pz-mode'))return;
  var s=e.target.closest('.pz-cand');if(!s)return;
  e.preventDefault();e.stopPropagation();
  var on=toggle(DESIGN,s.dataset.pzNombre);
  s.classList.toggle('pz-sel',on);
  s.querySelector('.pz-tag').textContent=on?'✓':'+';
  paintBar();
},true);
paintBar();
window.PoluxPiezas={design:DESIGN,count:function(){return load().filter(function(x){return x.d===DESIGN}).length}};
})();
