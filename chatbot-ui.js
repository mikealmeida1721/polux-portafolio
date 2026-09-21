/*!
 * Polux · UI compartida de chatbot (galería chatbots.html + hub index.html)
 * Inyecta el modal de chat, renderiza tarjetas y maneja:
 *   chat en vivo con respuestas programadas (DEMO honesto, nunca IA real),
 *   flujo "Quiero un chatbot así →" con niveles Básico / Personalizado,
 *   cotización por WhatsApp / SMS / Instagram / Facebook.
 * Requiere chatbots-motor.js (window.CHATBOT_THEMES, window.ChatbotBrain).
 * PROHIBIDO: API keys en página estática.
 */
(function(){
"use strict";
if(!window.CHATBOT_THEMES||!window.ChatbotBrain){
  if(window.console)console.warn('chatbot-ui: falta chatbots-motor.js');
  return;
}
/* ---------- utilidades ---------- */
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function applyVars(el,v){
 el.style.cssText='--cb-bg:'+v.bg+';--cb-head:'+v.head+';--cb-ac:'+v.ac+';--cb-ac2:'+v.ac2+';--cb-bot:'+v.bot+';--cb-bottx:'+v.bottx+
 ';--cb-botbd:'+v.botbd+';--cb-user:'+v.user+';--cb-usertx:'+v.usertx+';--cb-userbd:'+v.userbd+';--cb-br:'+v.br+
 ';--cb-tail:'+v.tail+';--cb-av:'+v.av+';--cb-inbg:'+v.inbg+';--cb-bord:'+v.bord+';--cb-glow:'+v.glow+';';
}
/* ---------- tarjeta: LA BURBUJA en grande (pieza de diseño única) ---------- */
function glyphSVG(g){
 return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+g+'</svg>';
}
function cardHTML(t){
 var v=t.vars;
 var inner=(t.kind==='demo')?'<i>✦</i>':glyphSVG(t.glyph);
 return '<span class="cb-art cbg-'+t.fam+'">'+
  '<span class="cb-bubble art '+t.tr+'" style="background:'+t.bg+';--gl:'+t.glowc+'">'+inner+'</span>'+
  '<span class="cb-demo-pill">DEMO</span>'+
  '<span class="cb-art-name">Polux</span></span>';
}
/* ---------- modal (se inyecta una sola vez) ---------- */
var cbm=document.getElementById('cbm');
if(!cbm){
 cbm=document.createElement('div');
 cbm.className='cbm';cbm.id='cbm';
 cbm.setAttribute('role','dialog');cbm.setAttribute('aria-modal','true');
 cbm.setAttribute('aria-hidden','true');cbm.setAttribute('aria-label','Chat de demostración');
 cbm.innerHTML=
  '<div class="cbm-box">'+
  '<button class="cbm-x" id="cbmX" aria-label="Cerrar">✕</button>'+
  '<div class="cb-live" id="cbLive">'+
   '<div class="cb-head" id="cbHead">'+
    '<div class="cb-av" id="cbAv">✦</div>'+
    '<div class="cb-tt"><b id="cbBotName">—</b><small id="cbBiz">—</small></div>'+
    '<span class="cb-demo">DEMO</span>'+
   '</div>'+
   '<div class="cb-note">Respuestas programadas — muestra de diseño, no IA real.</div>'+
   '<div class="cb-msgs" id="cbMsgs"></div>'+
   '<div class="cb-chips" id="cbChips"></div>'+
   '<form class="cb-form" id="cbForm" autocomplete="off">'+
    '<input id="cbInput" type="text" placeholder="Escribe aquí…" maxlength="200" aria-label="Escribe tu mensaje">'+
    '<button type="submit" aria-label="Enviar">➤</button>'+
   '</form>'+
  '</div>'+
  '<div class="cb-foot" id="cbFoot"></div>'+
  '</div>';
 document.body.appendChild(cbm);
}
var cbLive=document.getElementById('cbLive'),
    cbHead=document.getElementById('cbHead'), cbAv=document.getElementById('cbAv'),
    cbBotName=document.getElementById('cbBotName'), cbBiz=document.getElementById('cbBiz'),
    cbMsgs=document.getElementById('cbMsgs'), cbChips=document.getElementById('cbChips'),
    cbForm=document.getElementById('cbForm'), cbInput=document.getElementById('cbInput'),
    cbFoot=document.getElementById('cbFoot');
var THEMES=window.CHATBOT_THEMES;
var cur=null, mode='chat', busy=false, specStep=0, specAns=[];
var WA_NUM='16093316652', FB_MID='61575590535677';
function scrollMsgs(){requestAnimationFrame(function(){requestAnimationFrame(function(){cbMsgs.scrollTop=cbMsgs.scrollHeight})})}
function bubble(who,text){
 var d=document.createElement('div');d.className='cb-msg '+who;d.textContent=text;cbMsgs.appendChild(d);scrollMsgs();
}
function typing(){
 var d=document.createElement('div');d.className='cb-typing';d.innerHTML='<i></i><i></i><i></i>';cbMsgs.appendChild(d);scrollMsgs();return d;
}
function setChips(list){
 cbChips.innerHTML='';
 (list||[]).forEach(function(c){
  var b=document.createElement('button');b.type='button';b.className='cb-chip';b.textContent=c;
  b.addEventListener('click',function(){userSay(c)});
  cbChips.appendChild(b);
 });
}
/* Niveles del producto chatbot.
   FUTURO: el nivel "Con IA" (IA real detrás, ej. Gemini) se agrega como {id:'ia',...}
   con su propio flujo. PROHIBIDO: poner API keys en esta página estática. */
var LEVELS=[
 {id:'basico',nombre:'Básico',desc:'Responde con los datos de tu negocio: horarios, citas y preguntas frecuentes. Respuestas programadas, siempre disponible.'},
 {id:'personalizado',nombre:'Personalizado',desc:'Lo diseñamos a tu medida: cuéntanos qué necesitas en el chat y te armamos la cotización.'}
];
function footCTA(){
 cbFoot.innerHTML='<button class="cb-cta" id="cbCTA">Quiero un chatbot así →</button>';
 document.getElementById('cbCTA').addEventListener('click',footLevels);
}
function footLevels(){
 var h='<div class="cb-chlab">Elige tu nivel</div><div class="cb-lv">';
 LEVELS.forEach(function(l){
  h+='<button class="cb-lvb" data-lv="'+l.id+'"><b>'+esc(l.nombre)+'</b><span>'+esc(l.desc)+'</span></button>';
 });
 h+='<button class="cb-lvb off" disabled><b>Con IA</b><span>Próximamente</span></button></div>';
 cbFoot.innerHTML=h;
 cbFoot.querySelectorAll('.cb-lvb:not(.off)').forEach(function(b){
  b.addEventListener('click',function(){
   if(b.dataset.lv==='basico'){footChannels(buildQuote('basico'));}
   else{startSpec();}
  });
 });
}
function footHint(t){cbFoot.innerHTML='<p class="cb-hint">'+esc(t)+'</p>'}
function buildQuote(level){
 var t='Hola Polux, quiero una cotización de chatbot ✨';
 t+='\n• Diseño: '+cur.nombre;
 if(level==='basico'){
  t+='\n• Nivel: Básico (respuestas programadas)';
  t+='\n• Estilo: '+cur.nombre+' ('+cur.trLabel+')';
 }else{
  t+='\n• Nivel: Personalizado';
  t+='\n• Nombre: '+specAns[0];
  t+='\n• Negocio: '+specAns[1];
  t+='\n• Necesidades: '+specAns[2];
 }
 return t;
}
function copyText(t){
 if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t);
 return new Promise(function(res,rej){
  var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy')?res():rej(new Error('copy'))}catch(e){rej(e)}
  document.body.removeChild(ta);
 });
}
function sendChannel(ch,quote){
 if(ch==='wa'){window.open('https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(quote),'_blank');}
 else if(ch==='sms'){window.location.href='sms:+'+WA_NUM+'?&body='+encodeURIComponent(quote);}
 else{
  copyText(quote).then(function(){
   var ok=document.getElementById('cbCopyOk');if(ok)ok.classList.add('show');
   window.open(ch==='ig'?'https://ig.me/m/polux.ssee':'https://m.me/'+FB_MID,'_blank');
  }).catch(function(){alert('No pudimos copiarla: vuelve a intentarlo')});
 }
}
function footChannels(quote){
 cbFoot.innerHTML=
 '<div class="cb-chlab">¿Por dónde nos la envías?</div><div class="cb-ch">'+
 '<button class="cb-chb wa" data-ch="wa"><span class="ic">💬</span><span>WhatsApp<small>Se abre con tu cotización lista</small></span></button>'+
 '<button class="cb-chb" data-ch="sms"><span class="ic">✉️</span><span>SMS<small>Texto normal al mismo número</small></span></button>'+
 '<button class="cb-chb" data-ch="ig"><span class="ic">📸</span><span>Instagram<small>Chat de @polux.ssee</small></span></button>'+
 '<button class="cb-chb" data-ch="fb"><span class="ic"><span class="fb-f">f</span></span><span>Facebook<small>Messenger de Polux</small></span></button>'+
 '</div><p class="cb-copyok" id="cbCopyOk">Tu cotización quedó copiada — pégala en el chat ✨</p>';
 cbFoot.querySelectorAll('.cb-chb').forEach(function(b){
  b.addEventListener('click',function(){sendChannel(b.dataset.ch,quote)});
 });
}
/* flujo "Personalizado": el bot recoge nombre, negocio y necesidades */
function startSpec(){
 mode='spec';specStep=0;specAns=[];
 footHint('Responde las preguntas en el chat 👆');
 botSay('¡Buena elección! Para diseñarlo a tu medida, ¿cómo te llamas?');
 setChips([]);
}
function handleSpec(text){
 specAns[specStep]=text;
 var t=typing();
 setTimeout(function(){
  t.remove();busy=false;specStep++;
  if(specStep===1){bubble('bot','¡Gracias, '+text+'! ¿Cómo se llama tu negocio?');}
  else if(specStep===2){bubble('bot','Perfecto. Y ¿qué quieres que haga tu chatbot? Por ejemplo: agendar citas, responder preguntas, tomar pedidos…');}
  else{
   mode='chat';
   bubble('bot','¡Listo! Con esto te armamos tu cotización personalizada 👇');
   footChannels(buildQuote('personalizado'));
  }
  cbInput.focus();
 },650+Math.random()*450);
}
function botSay(text){
 var t=typing();
 setTimeout(function(){t.remove();bubble('bot',text)},600+Math.random()*400);
}
function userSay(text){
 text=(text||'').trim();if(!text||busy||!cur)return;busy=true;
 cbChips.innerHTML='';cbInput.value='';
 bubble('user',text);
 if(mode==='spec'){handleSpec(text);return}
 var t=typing();
 setTimeout(function(){
  t.remove();busy=false;
  bubble('bot',window.ChatbotBrain.replyFor(cur.data,text));
  setChips(window.ChatbotBrain.chipsFor(cur.data));
  cbInput.focus();
 },650+Math.random()*450);
}
function openTheme(id){
 var t=null;
 for(var i=0;i<THEMES.length;i++){if(THEMES[i].id===id){t=THEMES[i];break}}
 if(!t)return;
 cur=t;
 applyVars(cbLive,cur.vars);
 cbAv.className='cb-av art '+cur.tr;
 cbAv.style.background=cur.bg;
 cbAv.style.setProperty('--gl',cur.glowc);
 cbAv.innerHTML=(cur.kind==='demo')?'<i>✦</i>':glyphSVG(cur.glyph);
 cbHead.classList.toggle('ctr',cur.vars.layout==='center');
 cbBotName.textContent='Polux';
 cbBiz.textContent='Diseño '+cur.nombre+' · Recepcionista IA';
 cbInput.placeholder='Escríbele a Polux…';
 cbMsgs.className='cb-msgs cbg-'+cur.fam+(cur.mv?' mv':'');
 cbMsgs.innerHTML='';mode='chat';busy=false;specStep=0;specAns=[];
 footCTA();
 botSay(window.ChatbotBrain.replyFor(cur.data,'hola'));
 setChips(window.ChatbotBrain.chipsFor(cur.data));
 cbm.classList.add('open');cbm.setAttribute('aria-hidden','false');
 document.body.style.overflow='hidden';
 setTimeout(function(){cbInput.focus()},300);
}
function closeTheme(){
 cbm.classList.remove('open');cbm.setAttribute('aria-hidden','true');
 document.body.style.overflow='';cur=null;mode='chat';busy=false;
 cbMsgs.className='cb-msgs';cbAv.className='cb-av';cbAv.style.background='';cbAv.innerHTML='';
}
function isOpen(){return cbm.classList.contains('open')}
document.getElementById('cbmX').addEventListener('click',closeTheme);
cbm.addEventListener('click',function(e){if(e.target===cbm)closeTheme()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen())closeTheme()});
cbForm.addEventListener('submit',function(e){e.preventDefault();userSay(cbInput.value)});
/* API pública para la galería y el hub */
window.PoluxChatUI={openTheme:openTheme,closeTheme:closeTheme,isOpen:isOpen,cardHTML:cardHTML,esc:esc};
})();
