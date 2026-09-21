/*!
 * Polux Chat — asistente funcional del portafolio (español, sin backend).
 * Config: window.POLUX_CHAT = {ac:'#A855F7', icon:'spark', context:'hub'|'demo', design:'Ateneo', designId:'ateneo'}
 *         window.POLUX_WA = '16093316652'  (número de WhatsApp Business)
 * En ?embed=1 no se muestra el widget, pero sí se ocultan los chats demo viejos.
 *
 * Cerebro v2: las intenciones explícitas se evalúan ANTES de recomendar;
 * recomendar solo dispara con palabras de negocio reales (nunca con "diseño");
 * si el negocio no se reconoce, pregunta el ambiente en vez de inventar.
 */
(function(){
'use strict';
var cfg = window.POLUX_CHAT || {};
var AC = cfg.ac || '#A855F7';
var ICON = cfg.icon || 'spark';
var CTX = cfg.context || 'hub';
var DESIGN = cfg.design || '';
var WA = window.POLUX_WA || '16093316652';
var EMBED = /(?:\?|&)embed=1/.test(location.search);

/* ---- CSS base (siempre: limpia chats demo viejos) ---- */
var css = document.createElement('style');
css.textContent =
 '#chatBtn,#chatFab,#chatPanel{display:none!important}'+
 '#pw-btn{position:fixed;bottom:22px;right:22px;z-index:10001;width:60px;height:60px;border-radius:50%;'+
   'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;'+
   'background:linear-gradient(135deg,'+AC+','+AC+' 60%,rgba(0,0,0,.35));'+
   'box-shadow:0 8px 28px rgba(0,0,0,.45),0 0 0 3px '+AC+'33;transition:transform .18s}'+
 '#pw-btn:hover{transform:scale(1.1)}'+
 '#pw-btn svg{width:30px;height:30px;color:#fff;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}'+
 '#pw-btn::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid '+AC+';opacity:.6;animation:pw-pulse 2.4s infinite}'+
 '@keyframes pw-pulse{0%{transform:scale(.9);opacity:.7}70%{transform:scale(1.15);opacity:0}100%{opacity:0}}'+
 '#pw-panel{position:fixed;bottom:96px;right:22px;z-index:10002;width:min(350px,calc(100vw - 44px));height:min(520px,70vh);'+
   'background:#14141c;border:1px solid '+AC+'55;border-radius:18px;overflow:hidden;display:none;flex-direction:column;'+
   'box-shadow:0 20px 60px rgba(0,0,0,.55);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'+
 '#pw-panel.open{display:flex}'+
 '#pw-head{background:linear-gradient(120deg,'+AC+'22,'+AC+'0d);border-bottom:1px solid '+AC+'33;padding:14px 16px;display:flex;gap:12px;align-items:center}'+
 '#pw-head .pw-ic{width:38px;height:38px;border-radius:12px;background:'+AC+';display:flex;align-items:center;justify-content:center;flex:none}'+
 '#pw-head .pw-ic svg{width:22px;height:22px;color:#0b0b10}'+
 '#pw-head b{color:#f4f2fa;font-size:.95rem;display:block}'+
 '#pw-head small{color:#a7a3b8;font-size:.75rem}'+
 '#pw-head .pw-x{margin-left:auto;background:none;border:none;color:#a7a3b8;font-size:1.2rem;cursor:pointer}'+
 '#pw-msgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px}'+
 '.pw-m{max-width:85%;padding:10px 14px;border-radius:14px;font-size:.9rem;line-height:1.5;animation:pw-in .25s}'+
 '@keyframes pw-in{from{opacity:0;transform:translateY(8px)}}'+
 '.pw-bot{background:#1e1e28;color:#f4f2fa;border-bottom-left-radius:4px;align-self:flex-start;border:1px solid #2a2a38}'+
 '.pw-user{background:'+AC+';color:#0b0b10;font-weight:600;border-bottom-right-radius:4px;align-self:flex-end}'+
 '.pw-m a{color:'+AC+';font-weight:700}'+
 '.pw-typing{align-self:flex-start;background:#1e1e28;border:1px solid #2a2a38;border-radius:14px;padding:12px 16px;color:#a7a3b8}'+
 '.pw-typing i{display:inline-block;width:7px;height:7px;border-radius:50%;background:'+AC+';margin:0 2px;animation:pw-b 1s infinite}'+
 '.pw-typing i:nth-child(2){animation-delay:.15s}.pw-typing i:nth-child(3){animation-delay:.3s}'+
 '@keyframes pw-b{0%,100%{opacity:.3}50%{opacity:1}}'+
 '#pw-chips{display:flex;gap:8px;padding:0 14px 10px;flex-wrap:wrap}'+
 '#pw-chips button{background:#1e1e28;border:1px solid '+AC+'66;color:#f4f2fa;border-radius:999px;padding:7px 14px;font-size:.78rem;cursor:pointer}'+
 '#pw-chips button:hover{background:'+AC+'33}'+
 '#pw-bar{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #2a2a38}'+
 '#pw-in{flex:1;background:#0d0d13;border:1px solid #2a2a38;border-radius:999px;color:#f4f2fa;padding:11px 16px;font-size:.9rem;outline:none}'+
 '#pw-in:focus{border-color:'+AC+'}'+
 '#pw-send{background:'+AC+';border:none;border-radius:50%;width:42px;height:42px;color:#0b0b10;font-size:1.1rem;cursor:pointer;flex:none}'+
 '@media(prefers-reduced-motion:reduce){#pw-btn::after{animation:none}.pw-m{animation:none}}';
document.head.appendChild(css);
if(EMBED) return; // en miniaturas no hay widget

/* ---- Iconos SVG por diseño (diseño real, no solo color) ---- */
var P = {
 spark:'<path fill="currentColor" d="M12 2l2.3 6.9L21 11l-6.7 2.1L12 20l-2.3-6.9L3 11l6.7-2.1z"/>',
 book:'<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6.5c2.5-2 5.5-2 8-1v13c-2.5-1-5.5-1-8 1-2.5-2-5.5-2-8-1z"/><path d="M12 6.5v13"/>',
 bolt:'<path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5z"/>',
 bubbles:'<circle cx="9" cy="11" r="5.5"/><circle cx="17.5" cy="6.5" r="3"/><circle cx="17" cy="17.5" r="2.2"/>',
 orbit:'<circle cx="12" cy="12" r="3.5"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-18 12 12)"/>',
 flame:'<path d="M12 2.5c3.2 4.2 6.5 7.4 6.5 11.5a6.5 6.5 0 01-13 0C5.5 10 9 6.8 12 2.5z"/><path d="M12 21.5a3.8 3.8 0 003.8-3.8c0-2.3-2-3.8-3.8-6-1.8 2.2-3.8 3.7-3.8 6A3.8 3.8 0 0012 21.5z"/>',
 lotus:'<path d="M12 20.5c-4.2-1-7.2-4.2-7.2-8.2 3 0 5.2 1 7.2 3 2-2 4.2-3 7.2-3 0 4-3 7.2-7.2 8.2z"/><path d="M12 3.5c1.6 2.2 1.6 5.4 0 8.5-1.6-3.1-1.6-6.3 0-8.5z"/>'
};
function svg(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||P.spark)+'</svg>'}

/* ---- Datos ---- */
var DISENOS=[
 {id:'ateneo',nombre:'Ateneo'},{id:'pulso',nombre:'Pulso'},{id:'burbuja',nombre:'Burbuja'},
 {id:'orbita',nombre:'Órbita'},{id:'brasa',nombre:'Brasa'},{id:'armonia',nombre:'Armonía'}
];
/* negocio -> diseño. Sin palabras genéricas ("diseño", "marca", "foto") que disparaban falsos positivos. */
var NEGOCIOS=[
 {w:'spa|masaje|estetica|belleza|barberia|peluqueria|salon de belleza|unas|yoga|terapia|terapeuta|estilista|maquillaje|depilacion|bienestar|relax|estetica canina',id:'armonia',porque:'su ambiente de calma, sus reservas en línea y su sección de rituales'},
 {w:'restaurante|comida|tacos|pizza|cafeteria|cafe|panaderia|carniceria|polleria|pizzeria|hamburgues|asadero|parrilla|mariscos|ceviche|empanada|sandwich|fondita|cocina economica|food truck|taqueria|antojitos|reposteria|pasteleria|dulceria|heladeria|jugos|licuados',id:'brasa',porque:'su carta visual que abre el apetito y su repartidor animado para domicilio'},
 {w:'lavanderia|lavado|tintoreria|limpieza|planchado|autolavado|car wash|veterinaria|mascota|guarderia|jugueteria|papeleria|merceria',id:'burbuja',porque:'su estilo fresco y directo, perfecto para servicios de barrio'},
 {w:'iglesia|biblia|academia|curso|escuela|educacion|coaching|consultor|abogado|contad|inmobiliaria|clinica|dental|doctor|salud|universidad|libreria|pastor|ministerio|notaria',id:'ateneo',porque:'su forma de organizar mucho contenido para que el visitante explore'},
 {w:'artista|musica|tatuaje|influencer|gimnasio|gym|fitness|crossfit|ropa|boutique|moda|streetwear|discoteca|antro|eventos|fotografo|estudio creativo|disenador grafico',id:'pulso',porque:'su presencia visual fuerte, hecha para imponer'},
 {w:'tecnologia|software|datos|finanzas|seguro|consultoria|agencia|marketing|startup|ingenieria|logistica|transporte|taller|mecanica|ferreteria|construccion|arquitecto|bienes raices|celulares|reparacion',id:'orbita',porque:'su panel de datos en vivo con estética profesional'}
];
var VIBES=[
 {w:'tradicional|clasico|calid|acogedor|familiar|barrio|rustico|casero',id:'brasa',porque:'ese calor de lo tradicional, con fuego y cercanía'},
 {w:'modern|llamativ|urban|joven|atrevid|impact|vanguard',id:'pulso',porque:'una presencia que impone y no pasa desapercibida'},
 {w:'elegante|minimalista|profesional|serio|sobrio|premium|lujo|fino',id:'orbita',porque:'una estética limpia y profesional'},
 {w:'fresc|divertid|amigable|colorid|alegre|jugueton|cercan',id:'burbuja',porque:'un estilo fresco y cercano'},
 {w:'relaj|natural|bienestar|zen|tranquil|armonia|calma',id:'armonia',porque:'un ambiente de calma total'},
 {w:'educativ|contenido|informativ|intelectual|seriedad',id:'ateneo',porque:'orden para presentar mucho contenido'}
];
function waLink(txt){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(txt)}

/* ---- UI ---- */
var btn=document.createElement('button');
btn.id='pw-btn';btn.setAttribute('aria-label','Abrir chat de Polux');btn.innerHTML=svg(ICON);
var panel=document.createElement('div');panel.id='pw-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Chat de Polux');
panel.innerHTML=
 '<div id="pw-head"><span class="pw-ic">'+svg(ICON)+'</span>'+
 '<span><b>Polux · Asistente</b><small>'+(CTX==='demo'&&DESIGN?('Diseño '+DESIGN):'Catálogo · precios · pedidos')+'</small></span>'+
 '<button class="pw-x" aria-label="Cerrar chat">✕</button></div>'+
 '<div id="pw-msgs"></div><div id="pw-chips"></div>'+
 '<div id="pw-bar"><input id="pw-in" placeholder="Escríbeme…" autocomplete="off" aria-label="Escribir mensaje">'+
 '<button id="pw-send" aria-label="Enviar">➤</button></div>';
document.body.appendChild(btn);document.body.appendChild(panel);
var msgs=panel.querySelector('#pw-msgs'),chips=panel.querySelector('#pw-chips'),
    input=panel.querySelector('#pw-in'),send=panel.querySelector('#pw-send');
var opened=false;
function toggle(force){opened=(typeof force==='boolean')?force:!opened;panel.classList.toggle('open',opened);if(opened)input.focus()}
btn.addEventListener('click',()=>toggle());
panel.querySelector('.pw-x').addEventListener('click',()=>toggle(false));

function addMsg(who,html){
  var d=document.createElement('div');d.className='pw-m '+(who==='user'?'pw-user':'pw-bot');d.innerHTML=html;
  msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;
}
function setChips(list){
  chips.innerHTML='';
  list.forEach(function(c){
    var b=document.createElement('button');b.textContent=c.label;
    b.addEventListener('click',()=>{userSay(c.q||c.label)});
    chips.appendChild(b);
  });
}
var CHIPS_HUB=[
 {label:'Ver diseños',q:'muéstrame los diseños'},{label:'Precios',q:'¿qué precios tienen?'},
 {label:'Armar mi pedido',q:'quiero armar mi pedido'},{label:'WhatsApp',q:'quiero hablar por whatsapp'}
];
var CHIPS_DEMO=[
 {label:'Precios',q:'¿qué precios tienen?'},{label:'Ver catálogo',q:'muéstrame los diseños'},
 {label:'WhatsApp',q:'quiero hablar por whatsapp'}
];
function vibeChips(){return[
 {label:'🔥 Tradicional',q:'tradicional y cálida'},{label:'⚡ Moderna',q:'moderna y llamativa'},
 {label:'💎 Elegante',q:'elegante y minimalista'},{label:'🎈 Fresca',q:'fresca y divertida'}
]}
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s}
function wb(re){return new RegExp('(^|[^a-z])('+re+')([^a-z]|$)')}

/* ---- Cerebro v2 ---- */
var state={vibeBiz:null,chips:null};
function nombreDiseno(id){var d=DISENOS.find(function(x){return x.id===id});return d?d.nombre:id}
function recomendar(t){
  for(var i=0;i<NEGOCIOS.length;i++){
    var m=t.match(wb(NEGOCIOS[i].w));
    if(m)return{id:NEGOCIOS[i].id,porque:NEGOCIOS[i].porque,key:m[2]};
  }
  return null;
}
function recMsg(r,lead){
  var nm=nombreDiseno(r.id);
  if(CTX==='hub'&&window.PoluxWheel){try{window.PoluxWheel.goTo(r.id)}catch(e){}}
  return lead+' el diseño <b>'+nm+'</b> encaja muy bien por '+r.porque+'.'+
    (CTX==='hub'?' Lo puse al frente para que lo mires 👆':' <a href="../">Míralo en el catálogo →</a>');
}
function extractBiz(raw){
  var m=(raw||'').match(/tengo (un|una|mi) ([a-záéíóúñ ]{3,40})/i)||(raw||'').match(/mi negocio es ([a-záéíóúñ ]{3,40})/i)||
        (raw||'').match(/me dedico (?:a |a la |al )?([a-záéíóúñ ]{3,40})/i)||(raw||'').match(/soy ([a-záéíóúñ ]{3,30})/i);
  var b=m?(m[2]||m[1]):null;
  if(b)b=b.replace(/( y | que | para | con | sobre | porque ).*$/i,'').trim();
  if(b&&/pregunta|duda|curiosidad|informaci|prisa/i.test(b))return null;
  return b||null;
}
function brain(text){
  var t=norm(text);
  if(/^(hola|buenas|hey|hello|que tal|saludos|buenos dias|buenas tardes|buenas noches)\b/.test(t))
    return '¡Hola! Soy el asistente de Polux. Te ayudo a explorar diseños, ver precios o armar tu pedido. ¿Qué negocio tienes?';
  /* 1. VER DISEÑOS explícito — antes de recomendar, para no confundir "muéstrame los diseños" */
  if(/disen|modelo|catalogo/.test(t)&&/muestr|ensen|ver |mira|lista|opcion|conocer|todos|enseñame/.test(t)){
    var lista=DISENOS.map(function(d){return d.nombre}).join(', ');
    return CTX==='hub'
      ? 'Míralos girar: tenemos <b>6 diseños vivos</b> — '+lista+'. Toca uno para entrar, o dime qué negocio tienes y te digo cuál le va mejor.'
      : 'Estás viendo <b>'+DESIGN+'</b>. En el <a href="../">catálogo</a> están los 6: '+lista+'.';
  }
  /* 2. responde a la pregunta de ambiente */
  if(state.vibeBiz){
    for(var i=0;i<VIBES.length;i++){
      if(wb(VIBES[i].w).test(t)){
        var biz=state.vibeBiz;state.vibeBiz=null;
        return recMsg({id:VIBES[i].id,porque:VIBES[i].porque},'Para tu <b>'+biz+'</b> con ese ambiente,');
      }
    }
    state.chips=vibeChips();
    return 'Dime el ambiente con una palabra: ¿<b>tradicional</b>, <b>moderna</b>, <b>elegante</b> o <b>fresca</b>?';
  }
  /* 3. negocio: recomendar directo, o preguntar ambiente si no lo reconozco */
  var biz=extractBiz(text), rec=recomendar(t);
  if(rec)return recMsg(rec,'Para tu <b>'+(biz||rec.key)+'</b>,');
  if(biz){
    state.vibeBiz=biz;state.chips=vibeChips();
    return '¡<b>'+cap(biz)+'</b>! Para recomendarte bien: ¿qué ambiente quieres que transmita tu página?';
  }
  /* 4. intenciones clásicas */
  if(/precio|cuanto|cuesta|costo|plan|planes|tarifa/.test(t))
    return '<b>Precios claros:</b><br>· Starter $349/mes <i>(30 días gratis)</i><br>· Pro $499/mes <i>(15 días gratis)</i><br>· Elite $799/mes <i>(7 días gratis)</i><br>· Página web $299 pago único<br>· Logo $99 pago único<br>Sin tarjeta en la prueba y sin contratos.';
  if(/prueba|gratis|trial|test/.test(t))
    return 'Puedes probar sin tarjeta y sin compromiso: Starter 30 días, Pro 15 días, Elite 7 días.';
  if(/que es polux|quienes son|que hacen|socio tecnologico|a que se dedican/.test(t))
    return 'Somos tu <b>socio tecnológico</b>: instalamos y operamos la IA dentro de tu negocio — reservas, reseñas, mensajes, contenido — con un humano cuidándola. Nada queda abandonado a su suerte.';
  if(/como funciona|como empiezo|contratar|empezar|quiero una|me interesa/.test(t))
    return CTX==='hub'
      ? 'Fácil: 1) explora los diseños en la rueda, 2) marca tus favoritos con ♡, 3) toca <b>Armar mi pedido</b> y lo enviamos a nuestro WhatsApp. ¿Te armo el pedido?'
      : 'Fácil: elige tu diseño favorito en el <a href="../">catálogo</a>, márcalo con ♡ y arma tu pedido. O escríbenos directo por <a href="'+waLink('Hola Polux, vengo del portafolio y quiero información.')+'" target="_blank" rel="noopener">WhatsApp</a>.';
  if(/web\b|pagina|sitio/.test(t))
    return 'La <b>página web a medida cuesta $299</b> pago único: tomamos el diseño que elijas del catálogo y la construimos con tu logo, tus colores y tu contenido.';
  if(/paquete|descuento|todo junto|bundle|juntos|combo/.test(t))
    return 'Arma tu paquete en el catálogo: eliges diseño, plan y servicios, y ves tu total al instante — pago único y mensual separados. Y el logo te sale en <b>$75</b> en vez de $99 cuando va con tu página. '+(CTX==='hub'&&window.PoluxOrder?'<button class="pc-chip" data-act="pedido">Armar mi pedido</button>':'<a href="../">Ir al catálogo →</a>');
  if(/logo/.test(t))
    return 'Diseñamos tu <b>logo por $99</b> pago único… pero si lo pides <b>con tu página te sale en $75</b>. Y si ya tienes uno, lo integramos gratis.';
  if(/pedido|armar|comprar|orden/.test(t)){
    if(CTX==='hub'&&window.PoluxOrder){setTimeout(function(){window.PoluxOrder.open()},700);return '¡De una! Te abro el formulario del pedido…'}
    return 'Puedes armar tu pedido en el <a href="../">catálogo</a> o escribirnos por <a href="'+waLink('Hola Polux, quiero armar mi pedido.')+'" target="_blank" rel="noopener">WhatsApp</a>.';
  }
  if(/humano|hablar|contacto|whatsapp|telefono|asesor|persona/.test(t))
    return 'Claro — escríbenos por <a href="'+waLink('Hola Polux, vengo del portafolio y quiero hablar con alguien.')+'" target="_blank" rel="noopener"><b>WhatsApp aquí</b></a> y te atiende una persona del equipo.';
  if(/seleccion|favorito|elegid|me gusta/.test(t))
    return CTX==='hub'
      ? 'Marca tus diseños con ♡ y luego toca <b>Armar mi pedido</b> en la bandeja de abajo. ¿La abro por ti?'
      : 'En el <a href="../">catálogo</a> puedes marcar tus favoritos con ♡ y armar tu pedido ahí.';
  if(/gracias/.test(t)) return '¡Un placer! Aquí estoy si necesitas algo más. ✨';
  if(/adios|chao|hasta luego|nos vemos|bye/.test(t)) return '¡Nos vemos! Cuando quieras armar tu pedido, aquí estoy. 👋';
  /* 5. palabra suelta corta que no casó con nada: probablemente un negocio */
  if(/^[a-z ]{3,25}$/.test(t)&&t.split(' ').length<=2&&!/^(si|no|ok|vale|dale|hola|disenos)$/.test(t)){
    state.vibeBiz=t.trim();state.chips=vibeChips();
    return '¡<b>'+cap(t.trim())+'</b>! Para recomendarte el diseño ideal: ¿qué ambiente buscas?';
  }
  return 'Te puedo ayudar con <b>precios</b>, <b>diseños</b> o <b>armar tu pedido</b>. ¿Qué te interesa? También puedes hablar con una persona por <a href="'+waLink('Hola Polux, tengo una pregunta.')+'" target="_blank" rel="noopener">WhatsApp</a>.';
}
var busy=false;
function userSay(text){
  text=(text||'').trim();if(!text||busy)return;
  busy=true;chips.innerHTML='';
  addMsg('user',text.replace(/</g,'&lt;'));
  var tp=document.createElement('div');tp.className='pw-typing';tp.innerHTML='<i></i><i></i><i></i>';
  msgs.appendChild(tp);msgs.scrollTop=msgs.scrollHeight;
  setTimeout(function(){
    tp.remove();
    addMsg('bot',brain(text));
    setChips(state.chips||(CTX==='hub'?CHIPS_HUB:CHIPS_DEMO));
    state.chips=null;
    busy=false;input.focus();
  },650+Math.random()*450);
}
send.addEventListener('click',()=>userSay(input.value));
input.addEventListener('keydown',e=>{if(e.key==='Enter')userSay(input.value)});

/* ---- Arranque ---- */
setTimeout(function(){
  addMsg('bot', CTX==='demo'&&DESIGN
    ? '¡Hola! Estás viendo el diseño <b>'+DESIGN+'</b>. Pregúntame por precios, otros diseños o cómo pedir la tuya.'
    : '¡Hola! Soy el asistente de Polux. Te ayudo a explorar el catálogo, ver precios o armar tu pedido. ¿Qué negocio tienes?');
  setChips(CTX==='hub'?CHIPS_HUB:CHIPS_DEMO);
},400);
})();
