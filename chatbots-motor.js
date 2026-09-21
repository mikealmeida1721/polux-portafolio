/*!
 * Polux · Motor paramétrico de diseños de chatbot
 * 20 familias (una por identidad de negocio del catálogo) × 5 variantes = 100 temas.
 * Cada tema = variables CSS (diseño visual) + datos demo del negocio ficticio
 * para que el cerebro programado responda con coherencia.
 * Todo es DEMOSTRACIÓN con respuestas programadas — nunca IA real, nunca API keys.
 */
(function(){
'use strict';

/* ============ 20 familias: negocio ficticio + datos demo por identidad ============ */
const FAMS=[
{id:'ateneo',dis:'Ateneo',ac:'#d9a441',tx:'#0A0A0C',bot:'Mateo',biz:'Verbo Vivo · Estudio Bíblico',nicho:'estudio bíblico',av:'📖',rol:'el coordinador de',
 horarioR:'Nuestro horario es de lunes a viernes de 9:00 a 18:00 🕘',
 citaR:'¡Claro que sí! Los estudios son de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📖',
 precioR:'Los estudios grupales no tienen costo; los cursos avanzados dependen del programa. Te anoto en la lista y te avisamos. ¿Te anoto? 😊',
 dirR:'Estamos en Av. Principal 123, a dos cuadras del parque central 📍 ¿Te anoto en un estudio?',
 ayuda:'horarios de estudio, inscribirte en un grupo o hablar con un coordinador',chipCita:'Quiero inscribirme',
 extraK:['estudio','curso','clase','grupo'],extraR:'Tenemos estudios para nuevos creyentes, jóvenes y matrimonios, entre semana y fin de semana. ¿Cuál te interesa? 📖'},
{id:'pulso',dis:'Pulso',ac:'#b366ff',tx:'#0A0A0C',bot:'Kairo',biz:'KAIRO · Artista urbano',nicho:'artista',av:'🎤',rol:'el manager de',
 horarioR:'Kairo se presenta de jueves a domingo 🎤',
 citaR:'¡De una! Kairo tiene fechas de jueves a domingo. ¿Qué fecha tienes en mente? 🎤',
 precioR:'Los precios dependen del evento: show privado, colaboración o publicidad. Cuéntame qué tienes en mente y te armamos la propuesta. 🔥',
 dirR:'Estudio KAIRO, Calle del Arte 45 📍 ¿Agendamos una llamada?',
 ayuda:'fechas de eventos, colaboraciones o contrataciones',chipCita:'Quiero contratarlo',
 extraK:['contratar','evento','show','concierto','fecha'],extraR:'Para contrataciones necesitamos: fecha, ciudad y tipo de evento. Escríbelo aquí y el equipo te responde hoy mismo. 🎤'},
{id:'burbuja',dis:'Burbuja',ac:'#7cc7ff',tx:'#0A0A0C',bot:'Lía',biz:'Burbuja Express · Lavandería',nicho:'lavandería',av:'🫧',rol:'la recepcionista de',
 horarioR:'Nuestro horario es de lunes a sábado de 8:00 a 20:00 🕘',
 citaR:'¡Listo! Recibimos de lunes a sábado de 8:00 a 20:00. ¿Traes tu ropa o pasamos por ella? 🫧',
 precioR:'El lavado va por precio de lista según la prenda; el planchado y el domicilio se cotizan por kilo. ¿Te armo tu pedido? 😊',
 dirR:'Estamos en Calle Limpia 12, frente al mercado 📍 ¿Te agendo una recogida?',
 ayuda:'horarios, servicio a domicilio o precios por prenda',chipCita:'Quiero el servicio',
 extraK:['domicilio','recoger','recogen','entrega'],extraR:'¡Sí! Pasamos por tu ropa y la devolvemos limpia en 24-48 horas. Solo dime tu dirección y el día. 🫧'},
{id:'orbita',dis:'Órbita',ac:'#fbbf24',tx:'#0A0A0C',bot:'Nico',biz:'Órbita Lab · Sistemas',nicho:'sistemas',av:'🛰️',rol:'el asesor de',
 horarioR:'Nuestro horario es de lunes a viernes de 9:00 a 18:00 🕘',
 citaR:'¡Perfecto! Agendemos una llamada de diagnóstico, de lunes a viernes de 9:00 a 18:00. ¿Qué día te va bien? 🛰️',
 precioR:'Cada sistema se cotiza según lo que necesites: agenda, inventario, clientes o facturación. Agenda tu diagnóstico gratuito y te damos precio exacto. 📊',
 dirR:'Torre Órbita, Piso 8, Av. Tecnológica 200 📍 ¿Agendamos tu diagnóstico?',
 ayuda:'agendar tu diagnóstico, ver capacidades o hablar con un asesor',chipCita:'Agendar diagnóstico',
 extraK:['demo','prueba','probar'],extraR:'Puedes ver el panel de datos en vivo en nuestra demo. ¿Agendamos 20 minutos para mostrártelo con tus propios datos? 🛰️'},
{id:'brasa',dis:'Brasa',ac:'#ff9a3d',tx:'#0A0A0C',bot:'Bruno',biz:'Casa Brasa · Restaurante',nicho:'restaurante',av:'🔥',rol:'el anfitrión de',
 horarioR:'Nuestro horario es de martes a domingo de 12:00 a 23:00 🕘',
 citaR:'¡Buena elección! Abrimos de martes a domingo de 12:00 a 23:00. ¿Para cuántas personas reservamos? 🔥',
 precioR:'La carta está en nuestra página; el menú del día cambia a diario. ¿Te lo comparto o prefieres reservar? 😋',
 dirR:'Estamos en Av. del Asador 77, zona centro 📍 ¿Te reservo mesa?',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Reservar mesa',
 extraK:['domicilio','delivery','llevar','pedido'],extraR:'¡A domicilio llegamos en 30-45 minutos! Parrillada, hamburguesas o el menú del día. ¿Qué te provoca? 🔥'},
{id:'armonia',dis:'Armonía',ac:'#f0a6b8',tx:'#0A0A0C',bot:'Alma',biz:'Armonía Spa',nicho:'spa',av:'🌸',rol:'tu anfitriona en',
 horarioR:'Nuestro horario es de lunes a sábado de 10:00 a 19:00 🕘',
 citaR:'Con gusto 🌸 Atendemos de lunes a sábado de 10:00 a 19:00. ¿Qué ritual te provoca hoy: masaje, facial o circuito?',
 precioR:'Los rituales dependen de la duración y el tratamiento. Te puedo agendar una valoración gratuita para armarte tu plan. ¿Te agendo? 🌸',
 dirR:'Estamos en Calle Serena 8, jardín interior 📍 ¿Te reservo tu ritual?',
 ayuda:'reservar tu ritual, ver tratamientos o hablar con una terapeuta',chipCita:'Reservar mi ritual',
 extraK:['masaje','facial','ritual','tratamiento'],extraR:'Nuestros favoritos: masaje de piedras calientes (60 min), facial hidratante y el ritual completo de 2 horas. ¿Cuál te llama? 🌸'},
{id:'barberia',dis:'Navaja',ac:'#b87333',tx:'#ffffff',bot:'Rigo',biz:'Navaja Barbería',nicho:'barbería',av:'💈',rol:'el encargado de',
 horarioR:'Nuestro horario es de lunes a sábado de 10:00 a 20:00 🕘',
 citaR:'¡De una! 💈 Atendemos de lunes a sábado de 10:00 a 20:00. ¿Corte, barba o el combo completo?',
 precioR:'Corte, barba y combo tienen precio de lista en la página. El combo corte + barba es el favorito. ¿Te aparto tu silla? 💈',
 dirR:'Estamos en Calle Filo 21, esquina con el parque 📍 ¿Te aparto tu silla?',
 ayuda:'apartar tu silla, ver servicios o precios',chipCita:'Apartar mi silla',
 extraK:['barba','afeitado','arreglo'],extraR:'La barba la dejamos a navaja clásica con toalla caliente. ¿La sumamos a tu corte? 💈'},
{id:'cafeteria',dis:'Origen',ac:'#c96f3b',tx:'#ffffff',bot:'Emilia',biz:'Origen Café',nicho:'cafetería',av:'☕',rol:'la barista de',
 horarioR:'Nuestro horario es de lunes a domingo de 7:00 a 21:00 🕘',
 citaR:'¡Te esperamos! ☕ Abrimos todos los días de 7:00 a 21:00. ¿Te aparto mesa o es para llevar?',
 precioR:'La carta está en la página: espressos, filtrados de origen y repostería. El filtrado del mes es de Huila, Colombia. ☕',
 dirR:'Estamos en Plaza Origen, local 3 📍 ¿Te aparto mesa?',
 ayuda:'ver la carta, apartar mesa o pedir para llevar',chipCita:'Ver la carta',
 extraK:['menu','carta','recomiendas','recomendacion'],extraR:'Te recomiendo el filtrado V60 del mes o un flat white con nuestro pan de banano. ¿Qué se te antoja? ☕'},
{id:'gym',dis:'Forja',ac:'#ff2d2d',tx:'#ffffff',bot:'Rocco',biz:'Forja Olímpica · Gym',nicho:'gym',av:'🏋️',rol:'tu coach en',
 horarioR:'Nuestro horario es de lunes a viernes de 5:00 a 23:00 y sábados de 7:00 a 13:00 🕘',
 citaR:'¡A forjar! 🏋️ Abrimos de lunes a viernes de 5:00 a 23:00. ¿Quieres tu clase de prueba gratis?',
 precioR:'Las membresías dependen del plan: mensual, trimestral o anual. La clase de prueba es gratis, ¿la agendamos? 💪',
 dirR:'Estamos en Av. del Hierro 99, nave 4 📍 ¿Te agendo tu clase gratis?',
 ayuda:'agendar tu clase gratis, ver planes o horarios de clases',chipCita:'Clase gratis',
 extraK:['clase','entrenador','personal','plan'],extraR:'Tenemos clases de fuerza, HIIT y boxeo, además de entrenador personal. ¿Qué te mueve? 🏋️'},
{id:'veterinaria',dis:'Manada',ac:'#2d5a3d',tx:'#ffffff',bot:'Paula',biz:'Manada Vet',nicho:'veterinaria',av:'🐾',rol:'la recepcionista de',
 horarioR:'Nuestro horario es de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00 🕘',
 citaR:'¡Claro! 🐾 Atendemos de lunes a viernes de 9:00 a 18:00. ¿Es consulta, vacuna o estética para tu peludo?',
 precioR:'Las consultas tienen precio de lista; vacunas y estética dependen del tamaño de tu mascota. ¿Qué necesita tu peludo? 🐶',
 dirR:'Estamos en Calle Manada 30, junto al parque canino 📍 ¿Te agendo?',
 ayuda:'agendar cita, ver vacunas o servicio de estética',chipCita:'Agendar cita',
 extraK:['vacuna','desparasitar','emergencia','urgencia'],extraR:'Para vacunas trae su carnet. Si es urgencia, llámanos directo y lo atendemos de inmediato. 🐾'},
{id:'inmobiliaria',dis:'Plano',ac:'#c9a227',tx:'#0A0A0C',bot:'Martín',biz:'Plano Inmobiliaria',nicho:'inmobiliaria',av:'🏠',rol:'el asesor de',
 horarioR:'Nuestro horario es de lunes a viernes de 9:00 a 18:00 🕘',
 citaR:'¡Perfecto! 🏠 Atendemos de lunes a viernes de 9:00 a 18:00. ¿Buscas comprar, rentar o vender?',
 precioR:'Cada propiedad tiene su ficha con precio en el catálogo. Dime tu presupuesto y zona, y te filtro las mejores. 🔑',
 dirR:'Estamos en Av. Plano 500, oficina 12 📍 ¿Agendamos tu visita?',
 ayuda:'buscar propiedades, agendar visita o vender tu inmueble',chipCita:'Agendar visita',
 extraK:['visita','verla','conocerla','tour'],extraR:'Agendemos tu visita: dime qué propiedad te gustó y coordinamos día y hora. 🏠'},
{id:'taller',dis:'Torque',ac:'#ffc400',tx:'#0A0A0C',bot:'Beto',biz:'Torque Taller',nicho:'taller',av:'🔧',rol:'el jefe de',
 horarioR:'Nuestro horario es de lunes a viernes de 8:00 a 18:00 y sábados de 8:00 a 13:00 🕘',
 citaR:'¡Tráelo! 🔧 Recibimos de lunes a viernes de 8:00 a 18:00. ¿Qué le duele a tu nave?',
 precioR:'El diagnóstico es gratis; la reparación se cotiza según refacciones y mano de obra. ¿Lo traes mañana? 🚗',
 dirR:'Estamos en Calle Pistón 44, zona industrial 📍 ¿Te aparto un espacio?',
 ayuda:'agendar diagnóstico, cotizar reparación o ver servicios',chipCita:'Agendar diagnóstico',
 extraK:['frenos','aceite','afinacion','llantas','bateria'],extraR:'Frenos, afinación y cambio de aceite los hacemos el mismo día. ¿Te aparto un espacio? 🔧'},
{id:'floreria',dis:'Pétalo',ac:'#b26e7c',tx:'#ffffff',bot:'Flora',biz:'Pétalo Florería',nicho:'florería',av:'🌷',rol:'la diseñadora de',
 horarioR:'Nuestro horario es de lunes a sábado de 9:00 a 19:00 🕘',
 citaR:'¡Con amor! 🌷 Abrimos de lunes a sábado de 9:00 a 19:00. ¿Es arreglo, ramo o decoración de evento?',
 precioR:'Los ramos parten de precio de lista; bodas y eventos se cotizan a medida. ¿Para qué ocasión es? 💐',
 dirR:'Estamos en el Mercado de Flores, puesto 7 📍 ¿Te armo tu arreglo?',
 ayuda:'armar tu arreglo, cotizar un evento o pedir a domicilio',chipCita:'Armar mi arreglo',
 extraK:['boda','evento','xv','decoracion'],extraR:'Para bodas y eventos armamos propuesta con visita al lugar. Cuéntame la fecha y te agendo. 🌷'},
{id:'panaderia',dis:'Fermento',ac:'#d9a441',tx:'#0A0A0C',bot:'Pancho',biz:'Fermento Pan Artesanal',nicho:'panadería',av:'🍞',rol:'el panadero de',
 horarioR:'Nuestro horario es de martes a domingo de 7:00 a 20:00 🕘',
 citaR:'¡Recién horneado! 🍞 Abrimos de martes a domingo de 7:00 a 20:00. ¿Te aparto tu pan de masa madre?',
 precioR:'El pan del día y la repostería tienen precio en vitrina. Los pasteles por encargo se cotizan según tamaño. 🎂',
 dirR:'Estamos en Calle Horno 15, horno de leña 📍 ¿Te aparto tu pedido?',
 ayuda:'ver el pan del día, encargar un pastel o apartar tu pedido',chipCita:'Encargar un pastel',
 extraK:['pastel','encargo','cumpleanos','boda'],extraR:'Los pasteles por encargo necesitan 48 horas. Dime para cuántas personas y lo diseñamos. 🍞'},
{id:'dental',dis:'Esmalte',ac:'#40c4c4',tx:'#0A0A0C',bot:'Sofía',biz:'Clínica Dental Sonrisa',nicho:'dental',av:'🦷',rol:'la recepcionista virtual de',
 horarioR:'Nuestro horario es de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00 🕘',
 citaR:'¡Claro que sí! Atendemos de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📅',
 precioR:'Los precios dependen del tratamiento que necesites. Te puedo agendar una valoración gratuita y ahí te dan tu presupuesto exacto. ¿Te agendo? 😊',
 dirR:'Estamos en Av. Principal 123, a dos cuadras del parque central 📍 ¿Te agendo tu visita?',
 ayuda:'horarios, agendar tu cita o pasarte con una persona del equipo',chipCita:'Quiero una cita',
 extraK:['ortodoncia','brackets','limpieza','blanqueamiento'],extraR:'Hacemos limpieza, ortodoncia y blanqueamiento. ¿Te agendo una valoración gratuita? 🦷'},
{id:'hotel',dis:'Vestíbulo',ac:'#d4af6a',tx:'#0A0A0C',bot:'Lucía',biz:'Vestíbulo Hotel',nicho:'hotel',av:'🛎️',rol:'la concierge de',
 horarioR:'Nuestra recepción atiende 24 horas, todos los días 🛎️',
 citaR:'¡Será un placer! 🛎️ Nuestra recepción atiende 24 horas. ¿Para qué fechas buscas habitación?',
 precioR:'Las tarifas dependen de la temporada y el tipo de habitación. Dime tus fechas y te doy disponibilidad. ✨',
 dirR:'Estamos en Gran Vía 1, centro histórico 📍 ¿Te reservo?',
 ayuda:'reservar habitación, ver suites o servicios del hotel',chipCita:'Reservar habitación',
 extraK:['suite','habitacion','cuarto','disponibilidad'],extraR:'Tenemos habitaciones clásicas, suites junior y la suite presidencial con terraza. ¿Para cuántas personas? 🛎️'},
{id:'fotografo',dis:'Obscura',ac:'#ff1a1a',tx:'#ffffff',bot:'Iris',biz:'Obscura · Fotografía',nicho:'fotógrafo',av:'📷',rol:'la fotógrafa de',
 horarioR:'Las sesiones son con cita, de lunes a sábado 📷',
 citaR:'¡Capturémoslo! 📷 Las sesiones son con cita de lunes a sábado. ¿Boda, retrato o producto?',
 precioR:'Cada sesión se cotiza según horas, locación y entrega. Cuéntame tu idea y te armo propuesta. 📸',
 dirR:'Estudio Obscura, Calle Luz 9 📍 ¿Agendamos tu sesión?',
 ayuda:'agendar sesión, ver portafolio o pedir cotización',chipCita:'Agendar sesión',
 extraK:['boda','retrato','book'],extraR:'En bodas cubrimos desde la preparación hasta la fiesta, con álbum fine art. ¿Ya tienes fecha? 📷'},
{id:'tienda',dis:'Pasarela',ac:'#d6ff3f',tx:'#0A0A0C',bot:'Vera',biz:'Pasarela Boutique',nicho:'tienda',av:'👗',rol:'la asesora de',
 horarioR:'Nuestro horario es de lunes a sábado de 10:00 a 20:00 🕘',
 citaR:'¡Te esperamos! 👗 Abrimos de lunes a sábado de 10:00 a 20:00. ¿Buscas algo en especial o vienes a curiosear?',
 precioR:'La nueva colección ya está en tienda y en la página. ¿Te aparto tu talla? ✨',
 dirR:'Estamos en Pasaje de Moda 22, local 5 📍 ¿Te aparto tu talla?',
 ayuda:'ver la nueva colección, apartar tu talla o pedir en línea',chipCita:'Ver la colección',
 extraK:['talla','apartar','envio','pedido'],extraR:'Apartamos tu talla por 48 horas y enviamos a todo el país. ¿Qué modelo te gustó? 👗'},
{id:'pizzeria',dis:'Leña',ac:'#d63c2f',tx:'#ffffff',bot:'Enzo',biz:'Leña Pizzería',nicho:'pizzería',av:'🍕',rol:'el pizzero de',
 horarioR:'Nuestro horario es de martes a domingo de 13:00 a 23:00 🕘',
 citaR:'¡Al horno de leña! 🍕 Abrimos de martes a domingo de 13:00 a 23:00. ¿Mesa o para llevar?',
 precioR:'La carta está en la página; la de la casa con burrata es la favorita. ¿Te antojo una? 😋',
 dirR:'Estamos en Calle Brasa 8, horno a la vista 📍 ¿Te reservo mesa?',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Pedir a domicilio',
 extraK:['domicilio','llevar','orden'],extraR:'A domicilio en 30 minutos, calientita del horno. Dime tu pizza y tu dirección. 🍕'},
{id:'belleza',dis:'Espejo',ac:'#c9a227',tx:'#0A0A0C',bot:'Mía',biz:'Espejo · Belleza',nicho:'belleza',av:'💅',rol:'la estilista de',
 horarioR:'Nuestro horario es de lunes a sábado de 10:00 a 19:00 🕘',
 citaR:'¡A brillar! 💅 Atendemos de lunes a sábado de 10:00 a 19:00. ¿Corte, color, maquillaje o uñas?',
 precioR:'Los servicios tienen precio de lista según largo y técnica. El balayage es el más pedido. ¿Te agendo? ✨',
 dirR:'Estamos en Av. Espejo 18, segundo piso 📍 ¿Te agendo?',
 ayuda:'agendar tu cita, ver servicios o precios',chipCita:'Agendar mi cita',
 extraK:['unas','manicura','pedicura','maquillaje'],extraR:'Uñas acrílicas, soft gel y manicura rusa; maquillaje social y de novia. ¿Qué te hacemos? 💅'}
];

/* ============ 5 variantes visuales por familia (todo vía CSS variables) ============ */
function themeVars(v,ac,tx){
 const A=ac,T=tx;
 return [
  {label:'Clásico',bg:'#101016',head:'linear-gradient(120deg,'+A+'26,transparent)',
   bot:'#1e1e28',bottx:'#f4f2fa',botbd:'#262633',
   user:A,usertx:T,userbd:'transparent',
   br:'16px',tail:'4px',av:'50%',avMode:'emoji',inbg:'#0d0d13',bord:'#262633',glow:'none',layout:'left'},
  {label:'Píldora',bg:'#0c0c12',head:'linear-gradient(120deg,'+A+'59,'+A+'14)',
   bot:'#191924',bottx:'#f4f2fa',botbd:'#2a2a38',
   user:A,usertx:T,userbd:'transparent',
   br:'999px',tail:'999px',av:'16px',avMode:'emoji',inbg:'#101018',bord:'#2a2a38',glow:'none',layout:'center'},
  {label:'Minimal',bg:'#0A0A0C',head:'transparent',
   bot:'transparent',bottx:'#f4f2fa',botbd:'#2e2e3a',
   user:'transparent',usertx:'#f4f2fa',userbd:A,
   br:'6px',tail:'6px',av:'50%',avMode:'initial',inbg:'transparent',bord:'#2e2e3a',glow:'none',layout:'left'},
  {label:'Burbuja',bg:'#12121b',head:A+'1f',
   bot:'#232330',bottx:'#f4f2fa',botbd:'#2c2c3a',
   user:A,usertx:T,userbd:'transparent',
   br:'24px',tail:'6px',av:'50%',avMode:'emoji',inbg:'#0e0e15',bord:'#2c2c3a',glow:'none',layout:'center'},
  {label:'Neón',bg:'#060609',head:'transparent',
   bot:'#0c0c13',bottx:'#f4f2fa',botbd:A+'66',
   user:'transparent',usertx:A,userbd:A,
   br:'14px',tail:'14px',av:'50%',avMode:'emoji',inbg:'#0a0a10',bord:A+'44',glow:'0 0 18px '+A+'55',layout:'left'}
 ][v];
}

/* ============ Construir el catálogo de 100 temas ============ */
const THEMES=[];
FAMS.forEach(f=>{
 for(let v=0;v<5;v++){
  const vv=themeVars(v,f.ac,f.tx);
  THEMES.push({
   id:f.id+'-'+(v+1), fam:f.id, famLabel:f.dis, variante:vv.label,
   nombre:f.dis+' · '+vv.label,
   bot:f.bot, biz:f.biz, nicho:f.nicho, av:f.av,
   vars:Object.assign({ac:f.ac},vv),
   data:f
  });
 }
});
window.CHATBOT_THEMES=THEMES;
window.CHATBOT_FAMS=FAMS.map(f=>({id:f.id,label:f.dis}));

/* ============ Cerebro programado (respuestas con los datos del negocio ficticio) ============
   Sin backend, sin IA real: reglas por palabras clave con bordes de palabra,
   para no disparar falsos positivos (ej. "hora" dentro de "ahora"). */
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function hit(n,ks){
 for(let i=0;i<ks.length;i++){
  if(new RegExp('(^|[^a-z])'+ks[i]+'([^a-z]|$)').test(n))return true;
 }
 return false;
}
const K={
 hola:['hola','buenas','buenos dias','buenas tardes','buenas noches','que tal','hey','saludos'],
 horario:['horario','hora','abren','cierran','abierto','atienden'],
 cita:['cita','agendar','reservar','turno','apartar','reserva'],
 precio:['precio','costo','cuanto','cuesta','tarifa','vale','cobran'],
 humano:['humano','persona','asesor','alguien','encargado','operador','doctor','doctora'],
 donde:['donde','ubicacion','direccion','llegar','encuentran','estan'],
 gracias:['gracias','genial','perfecto','excelente','buenisimo'],
 adios:['adios','chao','nos vemos','bye','hasta luego']
};
const Brain={
 replyFor(d,t){
  const n=norm(t);
  if(hit(n,K.hola))return '¡Hola! Soy '+d.bot+' ✨, '+d.rol+' '+d.biz+'. Puedo ayudarte con '+d.ayuda+'. ¿En qué te ayudo?';
  if(d.extraK&&hit(n,d.extraK))return d.extraR;
  if(hit(n,K.horario))return d.horarioR;
  if(hit(n,K.cita))return d.citaR;
  if(hit(n,K.precio))return d.precioR;
  if(hit(n,K.humano))return '¡Por supuesto! Te paso con una persona de nuestro equipo en un momento. Mientras tanto, ¿me dices tu nombre?';
  if(hit(n,K.donde))return d.dirR;
  if(hit(n,K.gracias))return '¡Con gusto! Aquí estoy cuando me necesites 😊';
  if(hit(n,K.adios))return '¡Que tengas un lindo día! ✨';
  return 'Puedo ayudarte con '+d.ayuda+'. ¿Qué prefieres?';
 },
 chipsFor(d){return [d.chipCita,'¿Cuál es el horario?','Hablar con una persona']}
};
window.ChatbotBrain=Brain;
})();
