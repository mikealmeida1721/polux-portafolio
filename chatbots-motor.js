/*!
 * Polux · Motor de diseños de chatbot v3 — DIRECCIÓN DE ARTE
 * 100 diseños: 20 burbujas originales de las demos (círculo + ✦ + acento de cada demo)
 * + 80 diseños nuevos (21–100), cada uno una pieza única:
 *   glifo SVG outline ÚNICO (80 iconos distintos, ✦ prohibido en los nuevos)
 *   + historia de color propia + tratamiento propio + nombre evocador en español.
 * El bot se llama "Polux" en todos (insignia DEMO).
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
function mix(h1,h2,f){
 var a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);
 var r=Math.round(((a>>16)&255)*(1-f)+(((b>>16)&255)*f));
 var g=Math.round(((a>>8)&255)*(1-f)+(((b>>8)&255)*f));
 var bl=Math.round((a&255)*(1-f)+((b&255)*f));
 return '#'+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);
}
function h2h(h,s,l){ /* hsl -> hex */
 h=((h%360)+360)%360;s/=100;l/=100;
 var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2,r=0,g=0,b=0;
 if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}
 else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}
 r=Math.round((r+m)*255);g=Math.round((g+m)*255);b=Math.round((b+m)*255);
 return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

/* ============ 20 familias: color + tono base + sector demo + datos de respuesta ============ */
const FAMS=[
{id:'ateneo',dis:'Ateneo',ac:'#d9a441',hue:40,nicho:'estudio bíblico',
 ayuda:'horarios de estudio, inscribirte en un grupo o hablar con un coordinador',chipCita:'Quiero inscribirme',
 horarioR:'En la demo atendemos de lunes a viernes de 9:00 a 18:00 🕘 — en tu negocio usaríamos tus horarios reales.',
 citaR:'¡Listo! En la demo los estudios son de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📖',
 precioR:'Los estudios grupales de la demo no tienen costo. En tu negocio, el bot respondería con tus precios reales. 😊',
 dirR:'Demo: Av. Principal 123 📍 — tu chatbot indicaría tu dirección real.',
 extraK:['estudio','curso','clase','grupo'],extraR:'Demo: tenemos estudios para nuevos creyentes, jóvenes y matrimonios. En tu negocio, el bot conocería tus programas. 📖'},
{id:'pulso',dis:'Pulso',ac:'#b366ff',hue:268,nicho:'artista / eventos',
 ayuda:'fechas de eventos, colaboraciones o contrataciones',chipCita:'Quiero contratarlo',
 horarioR:'Demo: shows de jueves a domingo 🎤 — tu bot usaría tu agenda real.',
 citaR:'¡De una! En la demo hay fechas de jueves a domingo. ¿Qué fecha tienes en mente? 🎤',
 precioR:'En la demo no hay precios fijos: tu chatbot respondería con tus tarifas o armaría la propuesta. 🔥',
 dirR:'Demo: Estudio KAIRO, Calle del Arte 45 📍 — tu bot daría tu ubicación real.',
 extraK:['contratar','evento','show','concierto','fecha'],extraR:'Demo: para contrataciones pediríamos fecha, ciudad y tipo de evento. Tu bot lo haría con tus datos. 🎤'},
{id:'burbuja',dis:'Burbuja',ac:'#7cc7ff',hue:206,nicho:'lavandería',
 ayuda:'horarios, servicio a domicilio o precios por prenda',chipCita:'Quiero el servicio',
 horarioR:'Demo: lunes a sábado de 8:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Listo! En la demo recibimos de lunes a sábado de 8:00 a 20:00. ¿Traes tu ropa o pasamos por ella? 🫧',
 precioR:'En la demo el lavado va por lista según la prenda. Tu chatbot respondería con tus precios. 😊',
 dirR:'Demo: Calle Limpia 12 📍 — tu bot indicaría tu dirección y zonas de recojo.',
 extraK:['domicilio','recoger','recogen','entrega'],extraR:'Demo: recogemos y devolvemos en 24-48 horas. Tu bot coordinaría tu logística real. 🫧'},
{id:'orbita',dis:'Órbita',ac:'#fbbf24',hue:43,nicho:'sistemas / software',
 ayuda:'agendar tu diagnóstico, ver capacidades o hablar con un asesor',chipCita:'Agendar diagnóstico',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Perfecto! En la demo agendamos de lunes a viernes de 9:00 a 18:00. ¿Qué día te va bien? 🛰️',
 precioR:'En la demo cada sistema se cotiza según necesidad. Tu chatbot explicaría tus planes y precios. 📊',
 dirR:'Demo: Torre Órbita, Piso 8 📍 — tu bot daría tus datos de contacto reales.',
 extraK:['demo','prueba','probar'],extraR:'En la demo mostraríamos el panel en vivo. Tu bot podría enseñar tu producto real. 🛰️'},
{id:'brasa',dis:'Brasa',ac:'#ff9a3d',hue:27,nicho:'restaurante',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Reservar mesa',
 horarioR:'Demo: martes a domingo de 12:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Buena elección! En la demo abrimos de martes a domingo de 12:00 a 23:00. ¿Para cuántas personas? 🔥',
 precioR:'En la demo la carta cambia a diario. Tu chatbot mostraría tu menú y precios reales. 😋',
 dirR:'Demo: Av. del Asador 77 📍 — tu bot indicaría tu dirección real.',
 extraK:['domicilio','delivery','llevar','pedido'],extraR:'Demo: a domicilio en 30-45 minutos. Tu bot tomaría pedidos con tu carta real. 🔥'},
{id:'armonia',dis:'Armonía',ac:'#f0a6b8',hue:344,nicho:'spa',
 ayuda:'reservar tu ritual, ver tratamientos o hablar con una terapeuta',chipCita:'Reservar mi ritual',
 horarioR:'Demo: lunes a sábado de 10:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'Con gusto 🌸 En la demo atendemos de lunes a sábado de 10:00 a 19:00. ¿Masaje, facial o circuito?',
 precioR:'En la demo los rituales dependen de la duración. Tu chatbot daría tus precios y armaría planes. 🌸',
 dirR:'Demo: Calle Serena 8 📍 — tu bot indicaría tu dirección real.',
 extraK:['masaje','facial','ritual','tratamiento'],extraR:'Demo: masaje de piedras calientes, facial hidratante y ritual de 2 horas. Tu bot conocería tus servicios. 🌸'},
{id:'barberia',dis:'Navaja',ac:'#e08a3c',hue:29,nicho:'barbería',
 ayuda:'apartar tu silla, ver servicios o precios',chipCita:'Apartar mi silla',
 horarioR:'Demo: lunes a sábado de 10:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡De una! 💈 En la demo atendemos de lunes a sábado de 10:00 a 20:00. ¿Corte, barba o combo?',
 precioR:'En la demo hay precio de lista por servicio. Tu chatbot respondería con tus precios. 💈',
 dirR:'Demo: Calle Filo 21 📍 — tu bot indicaría tu dirección real.',
 extraK:['barba','afeitado','arreglo'],extraR:'Demo: barba a navaja clásica con toalla caliente. Tu bot conocería tus servicios. 💈'},
{id:'cafeteria',dis:'Origen',ac:'#d08040',hue:26,nicho:'cafetería',
 ayuda:'ver la carta, apartar mesa o pedir para llevar',chipCita:'Ver la carta',
 horarioR:'Demo: todos los días de 7:00 a 21:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Te esperamos! ☕ En la demo abrimos todos los días de 7:00 a 21:00. ¿Mesa o para llevar?',
 precioR:'En la demo la carta está en la página. Tu chatbot recomendaría con tu menú real. ☕',
 dirR:'Demo: Plaza Origen, local 3 📍 — tu bot indicaría tu dirección real.',
 extraK:['menu','carta','recomiendas','recomendacion'],extraR:'Demo: filtrado V60 del mes o flat white. Tu bot recomendaría con tu carta real. ☕'},
{id:'gym',dis:'Forja',ac:'#ff4444',hue:0,nicho:'gimnasio',
 ayuda:'agendar tu clase gratis, ver planes o horarios de clases',chipCita:'Clase gratis',
 horarioR:'Demo: lunes a viernes de 5:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡A forjar! 🏋️ En la demo abrimos de lunes a viernes de 5:00 a 23:00. ¿Agendamos tu clase gratis?',
 precioR:'En la demo hay planes mensual, trimestral y anual. Tu chatbot explicaría tus membresías. 💪',
 dirR:'Demo: Av. del Hierro 99 📍 — tu bot indicaría tu dirección real.',
 extraK:['clase','entrenador','personal','plan'],extraR:'Demo: fuerza, HIIT y boxeo. Tu bot conocería tus clases y coaches. 🏋️'},
{id:'veterinaria',dis:'Manada',ac:'#4caf6d',hue:138,nicho:'veterinaria',
 ayuda:'agendar cita, ver vacunas o servicio de estética',chipCita:'Agendar cita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Claro! 🐾 En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Consulta, vacuna o estética?',
 precioR:'En la demo las consultas tienen precio de lista. Tu chatbot daría tus precios reales. 🐶',
 dirR:'Demo: Calle Manada 30 📍 — tu bot indicaría tu dirección real.',
 extraK:['vacuna','desparasitar','emergencia','urgencia'],extraR:'Demo: trae su carnet para vacunas. Tu bot conocería tus servicios y protocolo de urgencias. 🐾'},
{id:'inmobiliaria',dis:'Plano',ac:'#c9a227',hue:47,nicho:'inmobiliaria',
 ayuda:'buscar propiedades, agendar visita o vender tu inmueble',chipCita:'Agendar visita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Perfecto! 🏠 En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Comprar, rentar o vender?',
 precioR:'En la demo cada propiedad tiene su ficha. Tu chatbot filtraría con tu catálogo real. 🔑',
 dirR:'Demo: Av. Plano 500, oficina 12 📍 — tu bot daría tus datos reales.',
 extraK:['visita','verla','conocerla','tour'],extraR:'Demo: coordinamos día y hora para tu visita. Tu bot agendaría con tu disponibilidad real. 🏠'},
{id:'taller',dis:'Torque',ac:'#ffc400',hue:47,nicho:'taller mecánico',
 ayuda:'agendar diagnóstico, cotizar reparación o ver servicios',chipCita:'Agendar diagnóstico',
 horarioR:'Demo: lunes a viernes de 8:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Tráelo! 🔧 En la demo recibimos de lunes a viernes de 8:00 a 18:00. ¿Qué le duele a tu nave?',
 precioR:'En la demo el diagnóstico es gratis. Tu chatbot explicaría tus servicios y tiempos. 🚗',
 dirR:'Demo: Calle Pistón 44 📍 — tu bot indicaría tu dirección real.',
 extraK:['frenos','aceite','afinacion','llantas','bateria'],extraR:'Demo: frenos y afinación el mismo día. Tu bot conocería tus servicios reales. 🔧'},
{id:'floreria',dis:'Pétalo',ac:'#d18a99',hue:348,nicho:'florería',
 ayuda:'armar tu arreglo, cotizar un evento o pedir a domicilio',chipCita:'Armar mi arreglo',
 horarioR:'Demo: lunes a sábado de 9:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Con amor! 🌷 En la demo abrimos de lunes a sábado de 9:00 a 19:00. ¿Arreglo, ramo o evento?',
 precioR:'En la demo los ramos parten de lista. Tu chatbot cotizaría con tus precios reales. 💐',
 dirR:'Demo: Mercado de Flores, puesto 7 📍 — tu bot indicaría tu dirección real.',
 extraK:['boda','evento','xv','decoracion'],extraR:'Demo: propuesta con visita al lugar. Tu bot tomaría fechas y coordinaría. 🌷'},
{id:'panaderia',dis:'Fermento',ac:'#d9a441',hue:40,nicho:'panadería',
 ayuda:'ver el pan del día, encargar un pastel o apartar tu pedido',chipCita:'Encargar un pastel',
 horarioR:'Demo: martes a domingo de 7:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Recién horneado! 🍞 En la demo abrimos de martes a domingo de 7:00 a 20:00. ¿Te aparto tu pan?',
 precioR:'En la demo hay precio en vitrina. Tu chatbot mostraría tu carta real. 🎂',
 dirR:'Demo: Calle Horno 15 📍 — tu bot indicaría tu dirección real.',
 extraK:['pastel','encargo','cumpleanos','boda'],extraR:'Demo: pasteles con 48 horas de anticipación. Tu bot tomaría encargos reales. 🍞'},
{id:'dental',dis:'Esmalte',ac:'#40c4c4',hue:180,nicho:'clínica dental',
 ayuda:'horarios, agendar tu cita o pasarte con una persona del equipo',chipCita:'Quiero una cita',
 horarioR:'Demo: lunes a viernes de 9:00 a 18:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Claro que sí! En la demo atendemos de lunes a viernes de 9:00 a 18:00. ¿Qué día te viene bien? 📅',
 precioR:'En la demo agendamos valoración gratuita. Tu chatbot explicaría tus tratamientos. 😊',
 dirR:'Demo: Av. Principal 123 📍 — tu bot indicaría tu dirección real.',
 extraK:['ortodoncia','brackets','limpieza','blanqueamiento'],extraR:'Demo: limpieza, ortodoncia y blanqueamiento. Tu bot conocería tus tratamientos. 🦷'},
{id:'hotel',dis:'Vestíbulo',ac:'#d4af6a',hue:37,nicho:'hotel',
 ayuda:'reservar habitación, ver suites o servicios del hotel',chipCita:'Reservar habitación',
 horarioR:'Demo: recepción 24 horas 🛎️ — tu bot usaría tu operación real.',
 citaR:'¡Será un placer! 🛎️ En la demo la recepción atiende 24 horas. ¿Para qué fechas buscas?',
 precioR:'En la demo las tarifas dependen de temporada. Tu chatbot daría disponibilidad real. ✨',
 dirR:'Demo: Gran Vía 1 📍 — tu bot indicaría tu dirección real.',
 extraK:['suite','habitacion','cuarto','disponibilidad'],extraR:'Demo: clásicas, junior y presidencial. Tu bot conocería tu inventario real. 🛎️'},
{id:'fotografo',dis:'Obscura',ac:'#ff3b3b',hue:0,nicho:'fotografía',
 ayuda:'agendar sesión, ver portafolio o pedir cotización',chipCita:'Agendar sesión',
 horarioR:'Demo: sesiones con cita, lunes a sábado 📷 — tu bot usaría tu agenda real.',
 citaR:'¡Capturémoslo! 📷 En la demo las sesiones son de lunes a sábado. ¿Boda, retrato o producto?',
 precioR:'En la demo cada sesión se cotiza a medida. Tu chatbot pediría lo necesario para tu propuesta. 📸',
 dirR:'Demo: Estudio Obscura, Calle Luz 9 📍 — tu bot daría tus datos reales.',
 extraK:['boda','retrato','book'],extraR:'Demo: cobertura completa con álbum fine art. Tu bot conocería tus paquetes. 📷'},
{id:'tienda',dis:'Pasarela',ac:'#c8f02e',hue:73,nicho:'tienda de ropa',
 ayuda:'ver la nueva colección, apartar tu talla o pedir en línea',chipCita:'Ver la colección',
 horarioR:'Demo: lunes a sábado de 10:00 a 20:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Te esperamos! 👗 En la demo abrimos de lunes a sábado de 10:00 a 20:00. ¿Buscas algo en especial?',
 precioR:'En la demo la colección está en tienda. Tu chatbot mostraría tu catálogo real. ✨',
 dirR:'Demo: Pasaje de Moda 22 📍 — tu bot indicaría tu dirección real.',
 extraK:['talla','apartar','envio','pedido'],extraR:'Demo: apartamos tu talla 48 horas. Tu bot gestionaría tu inventario real. 👗'},
{id:'pizzeria',dis:'Leña',ac:'#e05240',hue:6,nicho:'pizzería',
 ayuda:'reservar mesa, pedir a domicilio o ver la carta',chipCita:'Pedir a domicilio',
 horarioR:'Demo: martes a domingo de 13:00 a 23:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡Al horno de leña! 🍕 En la demo abrimos de martes a domingo de 13:00 a 23:00. ¿Mesa o para llevar?',
 precioR:'En la demo la carta está en la página. Tu chatbot tomaría pedidos con tu menú real. 😋',
 dirR:'Demo: Calle Brasa 8 📍 — tu bot indicaría tu dirección real.',
 extraK:['domicilio','llevar','orden'],extraR:'Demo: a domicilio en 30 minutos. Tu bot tomaría tu pedido real. 🍕'},
{id:'belleza',dis:'Espejo',ac:'#d4af5a',hue:43,nicho:'salón de belleza',
 ayuda:'agendar tu cita, ver servicios o precios',chipCita:'Agendar mi cita',
 horarioR:'Demo: lunes a sábado de 10:00 a 19:00 🕘 — tu bot usaría tu horario real.',
 citaR:'¡A brillar! 💅 En la demo atendemos de lunes a sábado de 10:00 a 19:00. ¿Corte, color o uñas?',
 precioR:'En la demo hay lista por servicio. Tu chatbot daría tus precios reales. ✨',
 dirR:'Demo: Av. Espejo 18 📍 — tu bot indicaría tu dirección real.',
 extraK:['unas','manicura','pedicura','maquillaje'],extraR:'Demo: acrílicas, soft gel y maquillaje. Tu bot conocería tus servicios. 💅'}
];

/* ============ 80 glifos SVG outline ÚNICOS (stroke blanco, estilo premium) ============
   [nombre evocador, svg interno]. El ✦ queda prohibido aquí: es de las 20 demos. */
const GLYPHS=[
['Centinela','<ellipse cx="12" cy="12" rx="9" ry="5.5"/><circle cx="12" cy="12" r="2.6"/>'],
['Chispa','<path d="M13 2.5 5.5 13.5h4.8L10 21.5l7.5-11h-4.8L13 2.5z"/>'],
['Enlace','<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><circle cx="12" cy="17" r="2.6"/><path d="M10.7 8.6l3.9-.4M9.4 10.6l1.2 3.9M15.2 11.2l-1.9 3.6"/>'],
['Lunaria','<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>'],
['Solsticio','<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.8M12 18.7v2.8M2.5 12h2.8M18.7 12h2.8M5.2 5.2l2 2M16.8 16.8l2 2M18.8 5.2l-2 2M7.2 16.8l-2 2"/>'],
['Marea','<path d="M2 14.5c2.6 0 2.6-3 5.2-3s2.6 3 5.2 3 2.6-3 5.2-3 2.4 3 4.4 3"/><path d="M2 19c2.6 0 2.6-3 5.2-3s2.6 3 5.2 3 2.6-3 5.2-3 2.4 3 4.4 3"/>'],
['Lumbre','<path d="M12 21.5c-3.8 0-6.3-2.6-6.3-6 0-4.3 3.3-7 3.3-11 2.8 2.4 3.8 4.8 4.3 6.8.7-.9 1.1-2 1.4-3.3 1.9 2.4 3.6 4.9 3.6 7.5 0 3.4-2.5 6-6.3 6z"/>'],
['Verdal','<path d="M5 19C5 9.5 11.5 4.5 20 4.5c0 8.5-6.5 14.5-15 14.5z"/><path d="M5 19c3-6 7-10 11.5-12"/>'],
['Realeza','<path d="M3.5 8.5 7.5 12 12 5.5 16.5 12l4-3.5L18.5 18h-13L3.5 8.5z"/><path d="M6 21h12"/>'],
['Clarín','<path d="M6.5 15.5v-4a5.5 5.5 0 0 1 11 0v4l1.8 3H4.7l1.8-3z"/><path d="M10 20.5a2.3 2.3 0 0 0 4 0"/>'],
['Latido','<path d="M12 20.5S3.8 14.8 3.8 9.3A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.2 2.5c0 5.5-8.2 11.2-8.2 11.2z"/>'],
['Mecanismo','<circle cx="12" cy="12" r="6.6"/><circle cx="12" cy="12" r="2.4"/><path d="M12 5.4V3M12 21v-2.4M5.4 12H3M21 12h-2.4M7.3 7.3 5.6 5.6M18.4 18.4l-1.7-1.7M16.7 7.3l1.7-1.7M5.6 18.4l1.7-1.7"/>'],
['Melodía','<path d="M9.5 17.5V6l9.5-2v11.5"/><circle cx="7" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>'],
['Enfoque','<rect x="3" y="7.5" width="18" height="12.5" rx="2.5"/><circle cx="12" cy="13.7" r="3.4"/><path d="M9 7.5 10.3 5h3.4L15 7.5"/>'],
['Filo','<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.2 7.6 20 19.4M8.2 16.4 20 4.6"/>'],
['Aroma','<path d="M4.5 10.5h12.5v5.5a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-5-5v-5.5z"/><path d="M17 11.5h1.3a2.6 2.6 0 0 1 0 5.2H17"/><path d="M8.5 3c0 1.2 1.2 1.4 1.2 2.6M12.5 3c0 1.2 1.2 1.4 1.2 2.6"/>'],
['Apertura','<circle cx="8" cy="8" r="4"/><path d="M10.8 10.8 19 19M16.5 16.5l2.2-2.2M14 14l1.8-1.8"/>'],
['Norte','<circle cx="12" cy="12" r="8.8"/><path d="M15.5 8.5l-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3z"/>'],
['Fondeo','<circle cx="12" cy="4.8" r="2"/><path d="M12 7v13.5M8.5 10.5h7"/><path d="M4.5 13.5c0 4.3 3.4 7.5 7.5 7.5s7.5-3.2 7.5-7.5"/>'],
['Tinta','<path d="M19.5 4.5c-6.5 0-11.5 4-13.5 11l4.5 4.5c7-2 11-7 11-13.5l-2-2z"/><path d="M6 20 16.5 9.5"/>'],
['Suerte','<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2" fill="#fff" stroke="none"/><circle cx="15" cy="9" r="1.2" fill="#fff" stroke="none"/><circle cx="9" cy="15" r="1.2" fill="#fff" stroke="none"/><circle cx="15" cy="15" r="1.2" fill="#fff" stroke="none"/>'],
['Quilate','<path d="M7.5 3.5h9L21 10l-9 10.5L3 10l4.5-6.5z"/><path d="M3 10h18M12 20.5 8.8 10 12 3.5 15.2 10 12 20.5"/>'],
['Señal','<circle cx="12" cy="12" r="2.4"/><path d="M10 10 4.5 4.5M14 14l5.5 5.5"/><path d="M2.5 9.5 6 6l3.5 3.5L6 13 2.5 9.5zM14.5 11l3.5-3.5 3.5 3.5-3.5 3.5-3.5-3.5z"/>'],
['Despegue','<path d="M12 2.5c2.8 2.3 3.8 5.5 3.8 8.5l2.7 2.7-3.8 1a12 12 0 0 1-2.7 3.8 12 12 0 0 1-2.7-3.8l-3.8-1 2.7-2.7c0-3 1-6.2 3.8-8.5z"/><circle cx="12" cy="9" r="1.5"/><path d="M9.5 15.5 8 21M14.5 15.5 16 21"/>'],
['Guía','<path d="M9.5 20.5 10.5 10h3l1 10.5M8 20.5h8"/><path d="M10 6.5h4V10h-4z"/><path d="M14 8l5.5-2M10 8 4.5 6"/>'],
['Resguardo','<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/><circle cx="12" cy="15.2" r="1.4" fill="#fff" stroke="none"/>'],
['Ajuste','<path d="M12 3.2 19 7.2v8L12 20.8 5 16.2v-8L12 3.2z"/><circle cx="12" cy="12" r="3"/>'],
['Clima','<path d="M10 4.5a2 2 0 0 1 4 0v8.8a4.3 4.3 0 1 1-4 0V4.5z"/><circle cx="12" cy="16.8" r="1.7" fill="#fff" stroke="none"/>'],
['Rocío','<path d="M12 3s6.2 6.8 6.2 11.2a6.2 6.2 0 0 1-12.4 0C5.8 9.8 12 3 12 3z"/>'],
['Invernal','<path d="M12 2.5v19M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M12 2.5 10 5M12 2.5 14 5M12 21.5 10 19M12 21.5 14 19"/>'],
['Hélice','<path d="M8.5 2.5c0 5.5 7 7 7 9.5s-7 4-7 9.5M15.5 2.5c0 5.5-7 7-7 9.5s7 4 7 9.5"/><path d="M10 7.5h4M10 16.5h4"/>'],
['Núcleo','<circle cx="12" cy="12" r="1.5" fill="#fff" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>'],
['Anillado','<circle cx="12" cy="12" r="5.8"/><ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(-18 12 12)"/>'],
['Estela','<circle cx="16.5" cy="7.5" r="3"/><path d="M14 10 4.5 19.5M14.5 13 8 19.5M11.5 11.5 7 16"/>'],
['Casiopea','<circle cx="4.5" cy="18" r="1.3" fill="#fff" stroke="none"/><circle cx="8.5" cy="12.5" r="1.3" fill="#fff" stroke="none"/><circle cx="13.5" cy="14.5" r="1.3" fill="#fff" stroke="none"/><circle cx="17.5" cy="8.5" r="1.3" fill="#fff" stroke="none"/><circle cx="21" cy="12.5" r="1.3" fill="#fff" stroke="none"/><path d="M5.6 17 8 13.4l4.6 1.6 3.4-5.4 3.4 2.4"/>'],
['Voz','<rect x="9" y="2.5" width="6" height="10.5" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M8.8 20.5h6.4"/>'],
['Ritmo','<path d="M4.5 14.5v-1.5a7.5 7.5 0 0 1 15 0v1.5"/><rect x="3" y="13" width="4.2" height="7" rx="2.1"/><rect x="16.8" y="13" width="4.2" height="7" rx="2.1"/>'],
['Volumen','<path d="M4 9.5v5h3.8L13 19V5L7.8 9.5H4z"/><path d="M16.3 9a4.8 4.8 0 0 1 0 6M18.8 6.5a8.2 8.2 0 0 1 0 11"/>'],
['Acción','<path d="M3.5 9.5h17V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V9.5z"/><path d="M4 9.5 5 4.8l15 2-1 3.7"/><path d="M8.3 5.4 7.2 9M12.2 6 11 9.6M16.1 6.5l-1.1 3.6"/>'],
['Lienzo','<circle cx="12" cy="12" r="8.3"/><circle cx="12" cy="12" r="2.4"/><circle cx="8.8" cy="7.6" r="1" fill="#fff" stroke="none"/><circle cx="15.6" cy="9.4" r="1" fill="#fff" stroke="none"/><circle cx="7.4" cy="14" r="1" fill="#fff" stroke="none"/>']
];

/* segunda mitad: 41–80 */
GLYPHS.push(
['Trazo','<path d="M17.5 3.5l3 3L11 16l-4.3 1 1-4.3 9.8-9.2z"/><path d="M15.2 5.8l3 3"/>'],
['Retrato','<rect x="4" y="5" width="16" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.4"/><path d="M4 16.5 9 12l3.5 3 3-2.5 4.5 4"/>'],
['Capítulo','<path d="M12 6C10 4.4 7.6 4 4.5 4v15c3.1 0 5.5.4 7.5 2 2-1.6 4.4-2 7.5-2V4c-3.1 0-5.5.4-7.5 2z"/><path d="M12 6v15"/>'],
['Graduación','<path d="M12 4 2.5 8.8 12 13.6l9.5-4.8L12 4z"/><path d="M6.5 11v4.5c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8V11"/><path d="M21.5 8.8v4.7"/>'],
['Alquimia','<path d="M10 3h4M10.5 3v5.5L5.3 18a2 2 0 0 0 1.8 3h9.8a2 2 0 0 0 1.8-3L13.5 8.5V3"/><path d="M7.8 14.5h8.4"/>'],
['Signo','<path d="M6 3.5V8a4 4 0 0 0 8 0V3.5"/><path d="M10 12v2.5a5 5 0 0 0 10 0V13"/><circle cx="20" cy="11" r="1.8"/>'],
['Sonrisa','<path d="M7.2 3.8C4.8 3.8 3.5 5.7 3.5 8c0 3.8 2.3 4.8 2.8 8.6.2 1.7 1 2.4 1.9 2.4 1.4 0 1.2-2.9 3.8-2.9s2.4 2.9 3.8 2.9c.9 0 1.7-.7 1.9-2.4.5-3.8 2.8-4.8 2.8-8.6 0-2.3-1.3-4.2-3.7-4.2-1.9 0-2.4 1.4-4.8 1.4s-2.9-1.4-4.8-1.4z"/>'],
['Afilado','<path d="M3.5 20.5 14 10l3.5 3.5L7 20.5H3.5z"/><path d="M14 10l6.5-6.5"/>'],
['Hierro','<circle cx="12" cy="14" r="6.3"/><path d="M8.7 9.7c0-3.4 1.5-5.7 3.3-5.7s3.3 2.3 3.3 5.7"/>'],
['Fuerza','<path d="M7.5 7.5v9M16.5 7.5v9M4.5 10v4M19.5 10v4M7.5 12h9"/>'],
['Marca','<circle cx="12" cy="13.8" r="6.8"/><path d="M12 13.8l3.3-3.3"/><path d="M12 4v3M9.5 2.5h5"/>'],
['Motor','<rect x="8" y="3" width="8" height="6.5" rx="1.5"/><path d="M12 9.5V19M8 21h8"/>'],
['Floración','<circle cx="12" cy="7.6" r="2.7"/><circle cx="16.1" cy="10.7" r="2.7"/><circle cx="14.5" cy="15.7" r="2.7"/><circle cx="9.5" cy="15.7" r="2.7"/><circle cx="7.9" cy="10.7" r="2.7"/><circle cx="12" cy="12.4" r="1.7" fill="#fff" stroke="none"/>'],
['Riego','<path d="M6.5 21v-7.5h8V21M6.5 13.5v-3h4.5"/><path d="M14.5 15.5 20 10"/><path d="M20.5 12.5l.6 2M22.5 13.5l.6 2"/>'],
['Corteza','<rect x="3" y="10" width="18" height="8" rx="4"/><path d="M8 10.8l1.6 2.2M12 10.8l1.6 2.2M16 10.8l1.6 2.2"/>'],
['Hojaldre','<path d="M5.5 16.5C3.5 12.5 5.5 7.5 12 5.5c6.5-2 10.5 2.5 7 4.8-1.8 1.2-3.8.3-3.8.3s.4 2.8-1.8 4.2-6 3.4-7.9 1.7z"/><path d="M9.5 8.8c1.8.8 4.3 1.2 6 .4"/>'],
['Porción','<path d="M5 5.5h14L12 20 5 5.5z"/><path d="M5 5.5c3.5 1.6 10.5 1.6 14 0"/><circle cx="10.6" cy="10.5" r="1.2"/><circle cx="13.4" cy="13.5" r="1.2"/>'],
['Doble','<path d="M4 10.5a8 5.2 0 0 1 16 0H4z"/><path d="M4 14h16M5 17.5h14"/>'],
['Antojo','<path d="M4 18.5a8 8 0 0 1 16 0"/><path d="M7.5 12.5c.8-2.2 1.8.6 2.8-1.4s1.8.6 2.8-1.4 1.8.6 2.8-1.4"/>'],
['Brindis','<path d="M7 3.5h10V8a5 5 0 0 1-10 0V3.5z"/><path d="M7 8h10"/><path d="M12 13v6.5M8.5 20.5h7"/>'],
['Mesa','<path d="M6.5 3v5M9.5 3v5M6.5 5.5h3"/><path d="M8 8v13"/><path d="M15.5 3c-1.6 4-1.6 7 0 9v9"/>'],
['Viaje','<rect x="4" y="8" width="16" height="12" rx="2.5"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M4 13h16"/>'],
['Recepción','<path d="M5.5 15.5a6.5 6.5 0 0 1 13 0"/><path d="M4 18.5h16"/><path d="M12 9V7.2"/><circle cx="12" cy="5.8" r="1.1"/>'],
['Descanso','<path d="M3.5 18V7.5M3.5 13.5H20.5V18"/><path d="M3.5 16h17"/><circle cx="7.5" cy="11" r="1.6"/>'],
['Vuelo','<path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 14.8 21.5l-3.8-8.5-8.5-3.8 19-6.7z"/>'],
['Frontera','<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="10.5" r="3.4"/><path d="M8.6 10.5h6.8M12 7.1c-1.9 2.2-1.9 4.6 0 6.8 1.9-2.2 1.9-4.6 0-6.8z"/>'],
['Ruta','<path d="M3.5 15.5 5 10.5l2.5-3.5h8L19 10.5l2 2v3h-2.5"/><circle cx="8" cy="17.5" r="2"/><circle cx="16" cy="17.5" r="2"/><path d="M10 17.5h4M3.5 15.5H6"/>'],
['Hogar','<path d="M3.5 11 12 4.5 20.5 11"/><path d="M6 9.8V20h12V9.8"/><path d="M10.2 20v-4.8h3.6V20"/>'],
['Torre','<rect x="5.5" y="3" width="13" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10.5 21v-2.8h3V21"/>'],
['Golpe','<path d="M13.5 4.5l6 6-2.3 2.3-6-6 2.3-2.3z"/><path d="M11.2 9.8 4.5 16.5l3 3 6.7-6.7"/>'],
['Corte','<path d="M3.5 16.5 14.5 6.5l6 1-1 4-11 6-5-1z"/><path d="M14.5 6.5 17 3.5l3.5 1-1.5 3"/>'],
['Rodillo','<rect x="3" y="4.5" width="11.5" height="5" rx="2.2"/><path d="M14.5 7h3.5v4h-5.5v4"/><path d="M12.5 15v6"/>'],
['Canasta','<path d="M3 4.5h2.3l2 11.5h10.4l2-7.5H7"/><circle cx="10" cy="19.5" r="1.6"/><circle cx="16.8" cy="19.5" r="1.6"/>'],
['Compra','<path d="M6 8.5h12l.9 12H5.1L6 8.5z"/><path d="M9 8.5V6.5a3 3 0 0 1 6 0v2"/>'],
['Oferta','<path d="M3.5 11.5v-7a1 1 0 0 1 1-1h7L20.5 12.5 12 21l-8.5-9.5z"/><circle cx="8.5" cy="8.5" r="1.4"/>'],
['Obsequio','<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M3.5 6.8h17V10h-17zM12 6.8V20.5"/><path d="M12 6.8C8.5 6.8 7.3 3.2 9.6 3.2c1.9 0 2.4 3.6 2.4 3.6zm0 0c3.5 0 4.7-3.6 2.4-3.6-1.9 0-2.4 3.6-2.4 3.6z"/>'],
['Crédito','<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M6.5 14.8h4"/>'],
['Fortuna','<circle cx="12" cy="12" r="8.3"/><path d="M14.8 9.3c-.7-1.1-1.7-1.6-2.8-1.6-1.7 0-3 1-3 2.4 0 3.2 6 1.6 6 4.8 0 1.4-1.3 2.4-3 2.4-1.1 0-2.1-.5-2.8-1.6M12 5.3v13.4"/>'],
['Alza','<path d="M4 4v16h16"/><path d="M8.5 16v-4.5M12.5 16V8M16.5 16v-2.5"/>'],
['Victoria','<path d="M8.5 3.5h7V9a3.5 3.5 0 0 1-7 0V3.5z"/><path d="M8.5 5H5a3.5 3.5 0 0 0 3.7 3.8M15.5 5H19a3.5 3.5 0 0 1-3.7 3.8"/><path d="M12 12.5V16M9 20h6M10 16.5h4"/>']
);

/* ============ arte: historias de color + tratamientos ============ */
const STYLES=['radial','linear','metal','duo'];
const TRS=[
 ['tr-glow','Resplandor'],['tr-halo','Halo'],['tr-glass','Cristal'],['tr-double','Doble borde'],
 ['tr-bevel','Bisel'],['tr-dots','Órbita punteada'],['tr-arc','Arco'],['tr-deep','Profundo']
];
const HUE_OFF=[0,150,215,300];
function artBG(hue,style){
 var base=h2h(hue,78,52),dark=h2h(hue,74,28),lite=h2h(hue,92,74);
 var sheen='radial-gradient(circle at 50% 15%,rgba(255,255,255,.42),rgba(255,255,255,0) 48%)';
 if(style==='radial')return sheen+',radial-gradient(circle at 34% 30%,'+lite+','+base+' 52%,'+dark+' 100%)';
 if(style==='linear')return sheen+',linear-gradient(135deg,'+lite+','+base+' 55%,'+dark+')';
 if(style==='metal')return sheen+',linear-gradient(135deg,'+dark+','+base+' 30%,'+lite+' 47%,'+base+' 63%,'+dark+')';
 var c2=h2h(hue+45,72,44);
 return sheen+',linear-gradient(135deg,'+base+' 0 50%,'+c2+' 50% 100%)';
}

/* ============ construir los 100 temas ============ */
const MVFAMS=['burbuja','pulso','brasa','barberia','taller','panaderia','tienda','veterinaria','inmobiliaria','floreria'];
function chatVars(pc){
 return {
  ac:pc, ac2:shade(pc,0.55), bg:mix(pc,'#0b0b10',0.88),
  head:'linear-gradient(120deg,'+mix(pc,'#0b0b10',0.82)+','+mix(pc,'#0b0b10',0.93)+')',
  bot:'#1a1a24', bottx:'#f4f2fa', botbd:mix(pc,'#0b0b10',0.55),
  user:pc, usertx:'#0A0A0C', userbd:'transparent',
  br:'18px', tail:'4px', av:'50%',
  inbg:'#0d0d13', bord:mix(pc,'#0b0b10',0.62),
  glow:'0 6px 26px '+mix(pc,'#000000',0.45),
  layout:'left'
 };
}
const THEMES=[];
/* diseños 1–20: las burbujas originales de las demos (círculo + ✦ + acento) */
FAMS.forEach(function(f){
 var lite=mix(f.ac,'#ffffff',0.35), dark=shade(f.ac,0.45);
 THEMES.push({
  id:f.id+'-demo', fam:f.id, famLabel:f.dis,
  nombre:f.dis+' · Original', kind:'demo', glyph:'✦',
  bg:'radial-gradient(circle at 34% 30%,'+lite+','+f.ac+' 55%,'+dark+' 100%)',
  pc:f.ac, glowc:f.ac, tr:'tr-glow', trLabel:'Original',
  mv:MVFAMS.indexOf(f.id)>=0,
  vars:chatVars(f.ac), data:f
 });
});
/* diseños 21–100: 4 piezas únicas por familia */
FAMS.forEach(function(f,fi){
 for(var k=0;k<4;k++){
  var idx=fi*4+k, gp=GLYPHS[idx];
  var hue=(f.hue+HUE_OFF[k])%360, style=STYLES[idx%4], tr=TRS[idx%8];
  var pc=h2h(hue,80,55);
  THEMES.push({
   id:'d'+(21+idx), fam:f.id, famLabel:f.dis,
   nombre:gp[0], kind:'art', glyph:gp[1],
   bg:artBG(hue,style),
   pc:pc, glowc:pc, tr:tr[0], trLabel:tr[1],
   mv:MVFAMS.indexOf(f.id)>=0,
   vars:chatVars(pc), data:f
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
