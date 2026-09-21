/* ============================================================
   Personalizador Polux — un solo archivo para todos los modelos.
   Uso: <script src="../personalizar.js"></script> antes de </body>
   y marcas data-nombre / data-tagline / data-logo en el HTML.

   Parámetros URL que entiende:
     n     nombre del negocio        ej. ?n=Mi%20Spa
     s     eslogan / subtítulo       ej. ?s=Bienestar%20real
     c     color principal (hex)     ej. ?c=4f7a6a
     f     color de fondo (hex)      ej. ?f=f7f4ec
     logo  URL del logo (imagen)     ej. ?logo=https://...

   Ejemplo de enlace personalizado para un prospecto:
     modelo-spa/?n=Luna%20Spa&s=Tu%20oasis%20en%20la%20ciudad&c=5b8c7a
   ============================================================ */
(function(){
"use strict";
var root = document.documentElement;
var HEX = /^[0-9a-fA-F]{6}$/;

function getParams(){
  var q = {};
  try {
    new URLSearchParams(location.search).forEach(function(v,k){ q[k]=v; });
  } catch(e){}
  return q;
}
var q = getParams();
var EMBED = q.embed === '1'; // miniatura dentro del hub: sin botones ni badges

function setAccent(hex){
  if(HEX.test(hex)) root.style.setProperty('--acento','#'+hex);
}
function setFondo(hex){
  if(HEX.test(hex)) root.style.setProperty('--fondo','#'+hex);
}
function setTexto(hex){
  if(HEX.test(hex)) root.style.setProperty('--texto','#'+hex);
}
function setNombre(nombre){
  if(!nombre) return;
  document.querySelectorAll('[data-nombre]').forEach(function(el){
    el.textContent = nombre;
  });
  // variante con última palabra destacada (modelo artista)
  document.querySelectorAll('[data-nombre-stroke]').forEach(function(el){
    var w = nombre.trim().split(/\s+/);
    if(w.length>1){
      var last = w.pop();
      el.innerHTML = '';
      el.appendChild(document.createTextNode(w.join(' ')));
      el.appendChild(document.createElement('br'));
      var sp = document.createElement('span'); sp.className='stroke'; sp.textContent=last;
      el.appendChild(sp);
    } else { el.textContent = nombre; }
  });
}
function setTagline(s){
  if(!s) return;
  document.querySelectorAll('[data-tagline]').forEach(function(el){ el.textContent = s; });
}
function setLogo(url){
  if(!url) return;
  root.style.setProperty('--logo','url("'+url.replace(/"/g,'')+'")');
  document.querySelectorAll('[data-logo]').forEach(function(el){ el.textContent=''; });
}
function clearLogo(){
  root.style.setProperty('--logo','""');
  document.querySelectorAll('[data-logo]').forEach(function(el){
    if(!el.dataset.letra) el.dataset.letra = el.textContent || 'N';
    el.textContent = el.dataset.letra;
  });
}

function aplicarTodo(){
  setAccent(q.c); setFondo(q.f); setTexto(q.t);
  setNombre(q.n); setTagline(q.s); setLogo(q.logo);
  try{ window.dispatchEvent(new Event('polux-palette')); }catch(e){}
}
aplicarTodo();

if(EMBED){
  // ocultar badges y botones dentro de las miniaturas del hub
  ['.demo-badge','.volver'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){ el.style.display='none'; });
  });
} else {
/* ---------- Panel flotante "Personalizar" ---------- */
var btn = document.createElement('button');
btn.id = 'pz-fab';
btn.textContent = '🎨 Personalizar';
btn.setAttribute('aria-label','Personalizar demo');
btn.style.cssText = 'position:fixed;left:20px;bottom:20px;z-index:120;background:#111;color:#fff;border:1px solid #444;border-radius:999px;padding:10px 18px;font-size:.85rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25)';
document.body.appendChild(btn);

var panel = document.createElement('div');
panel.style.cssText = 'position:fixed;left:20px;bottom:76px;z-index:120;width:290px;background:#fffdf8;color:#2c3831;border:1px solid #ddd2ba;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.2);padding:18px;display:none;font-family:system-ui,sans-serif;font-size:.88rem';
panel.innerHTML =
  '<b style="font-size:.95rem">Personalizar demo</b>' +
  '<p style="color:#75807a;font-size:.78rem;margin:4px 0 12px">Vista previa en vivo. Copia el enlace y mándalo al prospecto.</p>' +
  '<label style="display:block;margin-bottom:8px">Nombre del negocio<br><input id="pz-n" style="width:100%;padding:8px;border:1px solid #ddd2ba;border-radius:8px;margin-top:4px"></label>' +
  '<label style="display:block;margin-bottom:8px">Eslogan<br><input id="pz-s" style="width:100%;padding:8px;border:1px solid #ddd2ba;border-radius:8px;margin-top:4px"></label>' +
  '<div style="display:flex;gap:10px;margin-bottom:8px">' +
    '<label>Color<br><input id="pz-c" type="color" value="#4f7a6a" style="width:100%;height:36px;border:1px solid #ddd2ba;border-radius:8px"></label>' +
    '<label>Fondo<br><input id="pz-f" type="color" value="#f7f4ec" style="width:100%;height:36px;border:1px solid #ddd2ba;border-radius:8px"></label>' +
  '</div>' +
  '<div style="margin-bottom:10px"><div style="font-size:.78rem;color:#75807a;margin-bottom:6px">Paletas listas — combinaciones que no se arruinan:</div><div id="pz-paletas" style="display:flex;gap:8px;flex-wrap:wrap"></div></div>' +
  '<label style="display:block;margin-bottom:4px">Logo (URL de imagen)<br><input id="pz-logo" placeholder="https://…" style="width:100%;padding:8px;border:1px solid #ddd2ba;border-radius:8px;margin-top:4px"></label>' +
  '<label style="display:block;margin-bottom:10px;font-size:.78rem;color:#75807a">o súbelo (solo se ve en esta vista)<br><input id="pz-file" type="file" accept="image/*" style="margin-top:4px"></label>' +
  '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<button id="pz-aplicar" style="flex:1;background:#4f7a6a;color:#fff;border:none;border-radius:8px;padding:9px;cursor:pointer;font-weight:700">Aplicar</button>' +
    '<button id="pz-copiar" style="flex:1;background:#111;color:#fff;border:none;border-radius:8px;padding:9px;cursor:pointer">Copiar enlace</button>' +
  '</div>' +
  '<button id="pz-reset" style="margin-top:8px;background:none;border:none;color:#75807a;cursor:pointer;font-size:.78rem;text-decoration:underline">Restablecer demo</button>' +
  '<p style="margin-top:10px;font-size:.78rem;color:#75807a;border-top:1px solid #eee5d3;padding-top:10px">¿No tienes logo? <a href="https://polux.online/" target="_blank" rel="noopener" style="color:#4f7a6a;font-weight:700">Te diseñamos uno con tu demo →</a></p>';

document.body.appendChild(panel);
btn.addEventListener('click', function(){
  panel.style.display = panel.style.display==='none' ? 'block' : 'none';
});

// Paletas curadas: combinaciones que no se arruinan (acento, fondo, texto)
var PALETAS = [
  {n:'Océano',    c:'0e7c8c', f:'f2f7f7', t:'14343c'},
  {n:'Terracota', c:'c1553b', f:'faf5ef', t:'3a2a20'},
  {n:'Bosque',    c:'3f6b4f', f:'f4f6f1', t:'22302a'},
  {n:'Medianoche',c:'a855f7', f:'121218', t:'eceaf2'},
  {n:'Dorado',    c:'a67c1a', f:'faf7ef', t:'3a2f1d'},
  {n:'Rosa',      c:'d63384', f:'fdf2f7', t:'4a2438'}
];
var palBox = document.getElementById('pz-paletas');
PALETAS.forEach(function(p){
  var b = document.createElement('button');
  b.title = p.n; b.setAttribute('aria-label','Paleta '+p.n);
  b.style.cssText = 'width:38px;height:38px;border-radius:50%;cursor:pointer;border:2px solid #ddd2ba;background:linear-gradient(135deg,#'+p.c+' 50%,#'+p.f+' 50%);padding:0';
  b.addEventListener('click', function(){
    document.getElementById('pz-c').value = '#'+p.c;
    document.getElementById('pz-f').value = '#'+p.f;
    q.c = p.c; q.f = p.f; q.t = p.t; aplicarTodo();
    try{ history.replaceState(null,'',construirURL(leer())); }catch(e){}
  });
  palBox.appendChild(b);
});
// Si elige el fondo a mano, el texto se ajusta solo para no romperse
function luminancia(hex){
  var h=hex.replace('#',''),r=parseInt(h.substr(0,2),16)/255,g=parseInt(h.substr(2,2),16)/255,b=parseInt(h.substr(4,2),16)/255;
  return 0.2126*r+0.7152*g+0.0722*b;
}
document.getElementById('pz-f').addEventListener('input', function(e){
  q.t = luminancia(e.target.value) < 0.45 ? 'eceaf2' : '1f2937';
  setTexto(q.t);
});

function leer(){
  return {
    n: document.getElementById('pz-n').value.trim(),
    s: document.getElementById('pz-s').value.trim(),
    c: document.getElementById('pz-c').value.replace('#',''),
    f: document.getElementById('pz-f').value.replace('#',''),
    t: q.t || '',
    logo: document.getElementById('pz-logo').value.trim()
  };
}
function construirURL(v){
  var p = new URLSearchParams();
  if(v.n) p.set('n', v.n);
  if(v.s) p.set('s', v.s);
  if(v.c) p.set('c', v.c);
  if(v.f) p.set('f', v.f);
  if(v.t && HEX.test(v.t)) p.set('t', v.t);
  if(v.logo) p.set('logo', v.logo);
  var base = (location.origin && location.origin !== 'null')
    ? location.origin + location.pathname
    : location.href.split('?')[0];
  return base + (p.toString() ? '?'+p.toString() : '');
}
document.getElementById('pz-aplicar').addEventListener('click', function(){
  var v = leer(); q = { n:v.n||undefined, s:v.s||undefined, c:v.c, f:v.f, t:v.t||undefined, logo:v.logo||undefined };
  aplicarTodo();
  try{ history.replaceState(null,'',construirURL(v)); }catch(e){}
});
document.getElementById('pz-copiar').addEventListener('click', function(){
  var url = construirURL(leer());
  function ok(){ document.getElementById('pz-copiar').textContent='¡Copiado!'; setTimeout(function(){document.getElementById('pz-copiar').textContent='Copiar enlace'},1600); }
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(ok, ok); }
  else { var t=document.createElement('textarea'); t.value=url; document.body.appendChild(t); t.select(); try{document.execCommand('copy')}catch(e){} document.body.removeChild(t); ok(); }
});
document.getElementById('pz-reset').addEventListener('click', function(){
  location.href = location.pathname;
});
document.getElementById('pz-file').addEventListener('change', function(e){
  var f = e.target.files && e.target.files[0]; if(!f) return;
  var r = new FileReader();
  r.onload = function(){ setLogo(r.result); };
  r.readAsDataURL(f);
});
// precargar el panel con los valores actuales (del modelo o de la URL)
try{
  var cs = getComputedStyle(root);
  var acc = cs.getPropertyValue('--acento').trim(), fon = cs.getPropertyValue('--fondo').trim();
  if(q.n) document.getElementById('pz-n').value = q.n;
  if(q.s) document.getElementById('pz-s').value = q.s;
  document.getElementById('pz-c').value = (q.c && HEX.test(q.c)) ? '#'+q.c : (HEX.test(acc.replace('#','')) ? acc : '#4f7a6a');
  document.getElementById('pz-f').value = (q.f && HEX.test(q.f)) ? '#'+q.f : (HEX.test(fon.replace('#','')) ? fon : '#f7f4ec');
  if(q.logo) document.getElementById('pz-logo').value = q.logo;
}catch(e){}
} // fin else (no EMBED)
})();
