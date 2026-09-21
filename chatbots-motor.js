/*!
 * Polux · Motor de diseños de chatbot v2
 * 20 familias × 5 variantes = 100 diseños VISUALMENTE distintos.
 * Cada tarjeta de la galería muestra la burbuja flotante en grande:
 * geometría + animación + fondo por familia + estilo de mensajes.
 * El bot se llama "Polux" en todos los diseños (insignia DEMO).
 * Cerebro programado honesto: "respuestas programadas", nunca IA real, nunca API keys.
 */
(function(){
'use strict';

/* ============ utilidades de color ============ */
function shade(hex,f){
 var n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 r=Math.max(0,Math.min(255,Math.round(r*f)));g=Math.max(0,Math.min(255,Math.round(g*f)));b=Math.max(0,Math.min(255,Math.round(b*f)));
 return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function mix(h1,h2,f){ /* f=0 → h1, f=1 → h2 */
 var a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);
 var r=Math.round(((a>>16)&255)*(1-f)+(((b>>16)&255)*f));
 var g=Math.round(((a>>8)&255)*(1-f)+(((b>>8)&255)*f));
 var bl=Math.round((a&255)*(1-f)+((b&255)*f));
 return '#'+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);
}

/* ============ 20 familias: color + sector demo + datos de respuesta ============ */
const FAMS=[
{id:'ateneo',dis:'Ateneo',ac:'#d9a441',nicho:'estudio bíblico',
 ayuda:'horarios de estudio, inscribirte en un grupo o hablar con un coordinador',chipCita:'Quiero inscribirme',
 horarioR:'En la demo atendemos de lunes a viernes de 9:00 a 18:00 🕘 — en tu negocio usaríamos tus horarios reales.',
 citaR:'¡Listo! En la demo los estudios son de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📖',
 precioR:'Los estudios grupales de la demo no tienen costo. En tu negocio, el bot respondería con tus precios reales. 😊',
 dirR:'Demo: Av. Principal 123 📍 — tu chatbot indicaría tu dirección real.',
 extraK:['estudio','curso','clase','grupo'],extraR:'Demo: tenemos estudios para nuevos creyentes, jóvenes y matrimonios. En tu negocio, el bot conocería tus programas. 📖'},
{id:'pulso',dis:'Pulso',ac:'#b366ff',nicho:'artista / eventos',
 ayuda:'fechas de eventos, colaboraciones o contrataciones',chipCita:'Quiero contratarlo',
 horarioR:'Demo: shows de jueves a domingo 🎤 — tu bot usaría tu agenda real.',
 citaR:'¡De una! En la demo hay fechas de jueves a domingo. ¿Qué fecha tienes en mente? 🎤',
 precioR:'En la demo no hay precios fijos: tu chatbot respondería con tus tarifas o armaría la propuesta. 🔥',
 dirR:'Demo: Estudio KAIRO, Calle del Arte 45 📍 — tu bot daría tu ubicación real.',
 extraK:['contratar','evento','show','concierto','fecha'],extraR:'Demo: para contrataciones pediríamos fecha, ciudad y tipo de evento. Tu bot lo haría con tus datos. 🎤'},
{id:'burbuja',dis:'Burbuja',ac:'#7cc7ff',nicho:'lavandería',
 ayuda:'horarios, servicio a domicilio o precios por prenda',chipCita:'Quiero el servicio',
 horarioR:'Demo: lunes a sábado de 8:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Listo! En la demo recibimos de lunes a sábado de 8:00 a 20:00. ¿Traes tu ropa o pasamos por ella? 🫧',
 precioR:'En la demo el lavado va por lista según la prenda. Tu chatbot respondería con tus precios. 😊',
 dirR:'Demo: Calle Limpia 12 📍 — tu bot indicaría tu dirección y zonas de recojo.',
 extraK:['domicilio','recoger','recogen','entrega'],extraR:'Demo: recogemos y devolvemos en 24-48 horas. Tu bot coordinaría tu logística real. 🫧'},
{id:'orbita',dis:'Órbita',ac:'#fbbf24',nicho:'sistemas / software',
 ayuda:'agendar tu diagnóstico, ver capacidades o hablar con un asesor',chipCita:'Agendar diagnóstico',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Perfecto! En la demo agendamos de lunes a viernes de 9:00 a 18:00. ¿Qué día te va bien? 🛰️',
 precioR:'En la demo cada sistema se cotiza según necesidad. Tu chatbot explicaría tus planes y precios. 📊',
 dirR:'Demo: Torre Órbita, Piso 8 📍 — tu bot daría tus datos de contacto reales.',
 extraK:['demo','prueba','probar'],extraR:'En la demo mostraríamos el panel en vivo. Tu bot podría enseñar tu producto real. 🛰️'},
{id:'brasa',dis:'Brasa',ac:'#ff9a3d',nicho:'restaurante',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Reservar mesa',
 horarioR:'Demo: martes a domingo de 12:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Buena elección! En la demo abrimos de martes a domingo de 12:00 a 23:00. ¿Para cuántas personas? 🔥',
 precioR:'En la demo la carta cambia a diario. Tu chatbot mostraría tu menú y precios reales. 😋',
 dirR:'Demo: Av. del Asador 77 📍 — tu bot indicaría tu dirección real.',
 extraK:['domicilio','delivery','llevar','pedido'],extraR:'Demo: a domicilio en 30-45 minutos. Tu bot tomaría pedidos con tu carta real. 🔥'},
{id:'armonia',dis:'Armonía',ac:'#f0a6b8',nicho:'spa',
 ayuda:'reservar tu ritual, ver tratamientos o hablar con una terapeuta',chipCita:'Reservar mi ritual',
 horarioR:'Demo: lunes a sábado de 10:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'Con gusto 🌸 En la demo atendemos de lunes a sábado de 10:00 a 19:00. ¿Masaje, facial o circuito?',
 precioR:'En la demo los rituales dependen de la duración. Tu chatbot daría tus precios y armaría planes. 🌸',
 dirR:'Demo: Calle Serena 8 📍 — tu bot indicaría tu dirección real.',
 extraK:['masaje','facial','ritual','tratamiento'],extraR:'Demo: masaje de piedras calientes, facial hidratante y ritual de 2 horas. Tu bot conocería tus servicios. 🌸'},
{id:'barberia',dis:'Navaja',ac:'#e08a3c',nicho:'barbería',
 ayuda:'apartar tu silla, ver servicios o precios',chipCita:'Apartar mi silla',
 horarioR:'Demo: lunes a sábado de 10:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡De una! 💈 En la demo atendemos de lunes a sábado de 10:00 a 20:00. ¿Corte, barba o combo?',
 precioR:'En la demo hay precio de lista por servicio. Tu chatbot respondería con tus precios. 💈',
 dirR:'Demo: Calle Filo 21 📍 — tu bot indicaría tu dirección real.',
 extraK:['barba','afeitado','arreglo'],extraR:'Demo: barba a navaja clásica con toalla caliente. Tu bot conocería tus servicios. 💈'},
{id:'cafeteria',dis:'Origen',ac:'#d08040',nicho:'cafetería',
 ayuda:'ver la carta, apartar mesa o pedir para llevar',chipCita:'Ver la carta',
 horarioR:'Demo: todos los días de 7:00 a 21:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Te esperamos! ☕ En la demo abrimos todos los días de 7:00 a 21:00. ¿Mesa o para llevar?',
 precioR:'En la demo la carta está en la página. Tu chatbot recomendaría con tu menú real. ☕',
 dirR:'Demo: Plaza Origen, local 3 📍 — tu bot indicaría tu dirección real.',
 extraK:['menu','carta','recomiendas','recomendacion'],extraR:'Demo: filtrado V60 del mes o flat white. Tu bot recomendaría con tu carta real. ☕'},
{id:'gym',dis:'Forja',ac:'#ff4444',nicho:'gimnasio',
 ayuda:'agendar tu clase gratis, ver planes o horarios de clases',chipCita:'Clase gratis',
 horarioR:'Demo: lunes a viernes de 5:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡A forjar! 🏋️ En la demo abrimos de lunes a viernes de 5:00 a 23:00. ¿Agendamos tu clase gratis?',
 precioR:'En la demo hay planes mensual, trimestral y anual. Tu chatbot explicaría tus membresías. 💪',
 dirR:'Demo: Av. del Hierro 99 📍 — tu bot indicaría tu dirección real.',
 extraK:['clase','entrenador','personal','plan'],extraR:'Demo: fuerza, HIIT y boxeo. Tu bot conocería tus clases y coaches. 🏋️'},
{id:'veterinaria',dis:'Manada',ac:'#4caf6d',nicho:'veterinaria',
 ayuda:'agendar cita, ver vacunas o servicio de estética',chipCita:'Agendar cita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Claro! 🐾 En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Consulta, vacuna o estética?',
 precioR:'En la demo las consultas tienen precio de lista. Tu chatbot daría tus precios reales. 🐶',
 dirR:'Demo: Calle Manada 30 📍 — tu bot indicaría tu dirección real.',
 extraK:['vacuna','desparasitar','emergencia','urgencia'],extraR:'Demo: trae su carnet para vacunas. Tu bot conocería tus servicios y protocolo de urgencias. 🐾'},
{id:'inmobiliaria',dis:'Plano',ac:'#c9a227',nicho:'inmobiliaria',
 ayuda:'buscar propiedades, agendar visita o vender tu inmueble',chipCita:'Agendar visita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Perfecto! 🏠 En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Comprar, rentar o vender?',
 precioR:'En la demo cada propiedad tiene su ficha. Tu chatbot filtraría con tu catálogo real. 🔑',
 dirR:'Demo: Av. Plano 500, oficina 12 📍 — tu bot daría tus datos reales.',
 extraK:['visita','verla','conocerla','tour'],extraR:'Demo: coordinamos día y hora para tu visita. Tu bot agendaría con tu disponibilidad real. 🏠'},
{id:'taller',dis:'Torque',ac:'#ffc400',nicho:'taller mecánico',
 ayuda:'agendar diagnóstico, cotizar reparación o ver servicios',chipCita:'Agendar diagnóstico',
 horarioR:'Demo: lunes a viernes de 8:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Tráelo! 🔧 En la demo recibimos de lunes a viernes de 8:00 a 18:00. ¿Qué le duele a tu nave?',
 precioR:'En la demo el diagnóstico es gratis. Tu chatbot explicaría tus servicios y tiempos. 🚗',
 dirR:'Demo: Calle Pistón 44 📍 — tu bot indicaría tu dirección real.',
 extraK:['frenos','aceite','afinacion','llantas','bateria'],extraR:'Demo: frenos y afinación el mismo día. Tu bot conocería tus servicios reales. 🔧'},
{id:'floreria',dis:'Pétalo',ac:'#d18a99',nicho:'florería',
 ayuda:'armar tu arreglo, cotizar un evento o pedir a domicilio',chipCita:'Armar mi arreglo',
 horarioR:'Demo: lunes a sábado de 9:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Con amor! 🌷 En la demo abrimos de lunes a sábado de 9:00 a 19:00. ¿Arreglo, ramo o evento?',
 precioR:'En la demo los ramos parten de lista. Tu chatbot cotizaría con tus precios reales. 💐',
 dirR:'Demo: Mercado de Flores, puesto 7 📍 — tu bot indicaría tu dirección real.',
 extraK:['boda','evento','xv','decoracion'],extraR:'Demo: propuesta con visita al lugar. Tu bot tomaría fechas y coordinaría. 🌷'},
{id:'panaderia',dis:'Fermento',ac:'#d9a441',nicho:'panadería',
 ayuda:'ver el pan del día, encargar un pastel o apartar tu pedido',chipCita:'Encargar un pastel',
 horarioR:'Demo: martes a domingo de 7:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Recién horneado! 🍞 En la demo abrimos de martes a domingo de 7:00 a 20:00. ¿Te aparto tu pan?',
 precioR:'En la demo hay precio en vitrina. Tu chatbot mostraría tu carta real. 🎂',
 dirR:'Demo: Calle Horno 15 📍 — tu bot indicaría tu dirección real.',
 extraK:['pastel','encargo','cumpleanos','boda'],extraR:'Demo: pasteles con 48 horas de anticipación. Tu bot tomaría encargos reales. 🍞'},
{id:'dental',dis:'Esmalte',ac:'#40c4c4',nicho:'clínica dental',
 ayuda:'horarios, agendar tu cita o pasarte con una persona del equipo',chipCita:'Quiero una cita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Claro que sí! En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📅',
 precioR:'En la demo agendamos valoración gratuita. Tu chatbot explicaría tus tratamientos. 😊',
 dirR:'Demo: Av. Principal 123 📍 — tu bot indicaría tu dirección real.',
 extraK:['ortodoncia','brackets','limpieza','blanqueamiento'],extraR:'Demo: limpieza, ortodoncia y blanqueamiento. Tu bot conocería tus tratamientos. 🦷'},
{id:'hotel',dis:'Vestíbulo',ac:'#d4af6a',nicho:'hotel',
 ayuda:'reservar habitación, ver suites o servicios del hotel',chipCita:'Reservar habitación',
 horarioR:'Demo: recepción 24 horas 🛎️ — tu bot usaría tu operación real.',
 citaR:'¡Será un placer! 🛎️ En la demo la recepción atiende 24 horas. ¿Para qué fechas buscas?',
 precioR:'En la demo las tarifas dependen de temporada. Tu chatbot daría disponibilidad real. ✨',
 dirR:'Demo: Gran Vía 1 📍 — tu bot indicaría tu dirección real.',
 extraK:['suite','habitacion','cuarto','disponibilidad'],extraR:'Demo: clásicas, junior y presidencial. Tu bot conocería tu inventario real. 🛎️'},
{id:'fotografo',dis:'Obscura',ac:'#ff3b3b',nicho:'fotografía',
 ayuda:'agendar sesión, ver portafolio o pedir cotización',chipCita:'Agendar sesión',
 horarioR:'Demo: sesiones con cita, lunes a sábado 📷 — tu bot usaría tu agenda real.',
 citaR:'¡Capturémoslo! 📷 En la demo las sesiones son de lunes a sábado. ¿Boda, retrato o producto?',
 precioR:'En la demo cada sesión se cotiza a medida. Tu chatbot pediría lo necesario para tu propuesta. 📸',
 dirR:'Demo: Estudio Obscura, Calle Luz 9 📍 — tu bot daría tus datos reales.',
 extraK:['boda','retrato','book'],extraR:'Demo: cobertura completa con álbum fine art. Tu bot conocería tus paquetes. 📷'},
{id:'tienda',dis:'Pasarela',ac:'#c8f02e',nicho:'tienda de ropa',
 ayuda:'ver la nueva colección, apartar tu talla o pedir en línea',chipCita:'Ver la colección',
 horarioR:'Demo: lunes a sábado de 10:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Te esperamos! 👗 En la demo abrimos de lunes a sábado de 10:00 a 20:00. ¿Buscas algo en especial?',
 precioR:'En la demo la colección está en tienda. Tu chatbot mostraría tu catálogo real. ✨',
 dirR:'Demo: Pasaje de Moda 22 📍 — tu bot indicaría tu dirección real.',
 extraK:['talla','apartar','envio','pedido'],extraR:'Demo: apartamos tu talla 48 horas. Tu bot gestionaría tu inventario real. 👗'},
{id:'pizzeria',dis:'Leña',ac:'#e05240',nicho:'pizzería',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Pedir a domicilio',
 horarioR:'Demo: martes a domingo de 13:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Al horno de leña! 🍕 En la demo abrimos de martes a domingo de 13:00 a 23:00. ¿Mesa o para llevar?',
 precioR:'En la demo la carta está en la página. Tu chatbot tomaría pedidos con tu menú real. 😋',
 dirR:'Demo: Calle Brasa 8 📍 — tu bot indicaría tu dirección real.',
 extraK:['domicilio','llevar','orden'],extraR:'Demo: a domicilio en 30 minutos. Tu bot tomaría tu pedido real. 🍕'},
{id:'belleza',dis:'Espejo',ac:'#d4af5a',nicho:'salón de belleza',
 ayuda:'agendar tu cita, ver servicios o precios',chipCita:'Agendar mi cita',
 horarioR:'Demo: lunes a sábado de 10:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡A brillar! 💅 En la demo atendemos de lunes a sábado de 10:00 a 19:00. ¿Corte, color o uñas?',
 precioR:'En la demo hay lista por servicio. Tu chatbot daría tus precios reales. ✨',
 dirR:'Demo: Av. Espejo 18 📍 — tu bot indicaría tu dirección real.',
 extraK:['unas','manicura','pedicura','maquillaje'],extraR:'Demo: acrílicas, soft gel y maquillaje. Tu bot conocería tus servicios. 💅'}
];

/* ============ ejes visuales: geometrías de la burbuja ============ */
const GEOS=[
 {id:'circulo', label:'Círculo',     cls:'geo-circle'},
 {id:'squircle',label:'Squircle',    cls:'geo-squircle'},
 {id:'hexagono',label:'Hexágono',    cls:'geo-hex'},
 {id:'diamante',label:'Diamante',    cls:'geo-diamond'},
 {id:'dialogo', label:'Diálogo',     cls:'geo-speech'},
 {id:'capsula', label:'Cápsula',      cls:'geo-pill'},
 {id:'gota',    label:'Gota',        cls:'geo-blob'},
 {id:'anillo',  label:'Anillo orbital',cls:'geo-ring'},
 {id:'arco',    label:'Arco',        cls:'geo-arch'},
 {id:'gema',    label:'Gema',        cls:'geo-gem'}
];
/* ============ animaciones (solo transform/opacidad: baratas en iPhone) ============ */
const ANIMS=[
 {id:'pulso',   label:'Pulso',    cls:'an-pulse'},
 {id:'flota',   label:'Flotante', cls:'an-float'},
 {id:'balanceo',label:'Balanceo', cls:'an-wobble'},
 {id:'onda',    label:'Onda',     cls:'an-ripple'},
 {id:'giro',    label:'Giro',     cls:'an-spinring'},
 {id:'respira', label:'Respira',  cls:'an-breathe'},
 {id:'rebote',  label:'Rebote',   cls:'an-bob'}
];
/* ============ formas de burbuja de mensaje ============ */
const MSGS=[
 {br:'18px', tail:'4px'},
 {br:'999px',tail:'999px'},
 {br:'6px',  tail:'2px'},
 {br:'22px', tail:'16px'},
 {br:'14px 22px 14px 22px', tail:'8px'}
];
const AVS=['50%','30%','10px','4px']; /* forma del avatar en el encabezado */

/* ============ construir 100 temas con combinaciones rotadas ============ */
/* familias cuyo fondo se mueve despacio SOLO en el chat abierto (una superficie) */
const MVFAMS=['burbuja','pulso','brasa','barberia','taller','panaderia','tienda','veterinaria','inmobiliaria','floreria'];
const THEMES=[];
FAMS.forEach(function(f,fi){
 for(var v=0;v<5;v++){
  var geo=GEOS[(fi*3+v*2)%GEOS.length];
  var anim=ANIMS[(fi*5+v*3)%ANIMS.length];
  var msg=MSGS[(fi+v)%MSGS.length];
  var ac=f.ac, ac2=shade(ac,0.55), bg=mix(ac,'#0b0b10',0.88);
  THEMES.push({
   id:f.id+'-'+(v+1), fam:f.id, famLabel:f.dis,
   geo:geo, anim:anim,
   variante:geo.label,
   nombre:f.dis+' · '+geo.label,
   bot:'Polux',
   mv:MVFAMS.indexOf(f.id)>=0,
   vars:{
    ac:ac, ac2:ac2, bg:bg,
    head:'linear-gradient(120deg,'+mix(ac,'#0b0b10',0.82)+','+mix(ac,'#0b0b10',0.93)+')',
    bot:'#1a1a24', bottx:'#f4f2fa', botbd:mix(ac,'#0b0b10',0.55),
    user:ac, usertx:'#0A0A0C', userbd:'transparent',
    br:msg.br, tail:msg.tail, av:AVS[(fi+v)%AVS.length],
    inbg:'#0d0d13', bord:mix(ac,'#0b0b10',0.62),
    glow:'0 6px 26px '+mix(ac,'#000000',0.45),
    layout:((fi+v)%3===0)?'center':'left'
   },
   data:f
  });
 }
});
window.CHATBOT_THEMES=THEMES;
window.CHATBOT_FAMS=FAMS.map(function(f){return {id:f.id,label:f.dis}});

/* ============ cerebro programado honesto ============ */
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function hit(n,ks){
 for(var i=0;i<ks.length;i++){
  if(new RegExp('(^|[^a-z])'+ks[i]+'([^a-z]|$)').test(n))return true;
 }
 return false;
}
var K={
 hola:['hola','buenas','buenos dias','buenas tardes','buenas noches','que tal','hey','saludos'],
 horario:['horario','hora','abren','cierran','abierto','atienden'],
 cita:['cita','agendar','reservar','turno','apartar','reserva'],
 precio:['precio','costo','cuanto','cuesta','tarifa','vale','cobran'],
 humano:['humano','persona','asesor','alguien','encargado','operador','doctor','doctora'],
 donde:['donde','ubicacion','direccion','llegar','encuentran','estan'],
 gracias:['gracias','genial','perfecto','excelente','buenisimo'],
 adios:['adios','chao','nos vemos','bye','hasta luego']
};
var Brain={
 replyFor:function(d,t){
  var n=norm(t);
  if(hit(n,K.hola))return '¡Hola! Soy Polux ✨ — demo de recepcionista IA para '+d.nicho+'. Puedo ayudarte con '+d.ayuda+'. ¿En qué te ayudo?';
  if(d.extraK&&hit(n,d.extraK))return d.extraR;
  if(hit(n,K.horario))return d.horarioR;
  if(hit(n,K.cita))return d.citaR;
  if(hit(n,K.precio))return d.precioR;
  if(hit(n,K.humano))return '¡Por supuesto! En tu negocio te pasaría con una persona de tu equipo. En esta demo, ¿me dices tu nombre?';
  if(hit(n,K.donde))return d.dirR;
  if(hit(n,K.gracias))return '¡Con gusto! Aquí estoy cuando me necesites 😊';
  if(hit(n,K.adios))return '¡Que tengas un lindo día! ✨';
  return 'Puedo ayudarte con '+d.ayuda+'. ¿Qué prefieres?';
 },
 chipsFor:function(d){return [d.chipCita,'¿Cuál es el horario?','Hablar con una persona']}
};
window.ChatbotBrain=Brain;
})();
