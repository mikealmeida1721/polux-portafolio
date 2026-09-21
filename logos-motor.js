(function(){
'use strict';
/* ===== Motor paramétrico de logotipos (semilla determinística por id) =====
   Técnica: SVG generado desde parámetros con RNG sembrado — el mismo id
   siempre produce el mismo logo (byte-idéntico), como BezierForge / logo-design. */
function H(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function RNG(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const PAL={
 carbon:{bg:'#0A0A0C',fg:'#f4f2fa',a:'#A855F7',b:'#7c3aed'},
 brasa:{bg:'#1A0F0A',fg:'#FFF3E0',a:'#F59E0B',b:'#EF4444'},
 oliva:{bg:'#1C2A1A',fg:'#E8E3D5',a:'#A3B86B',b:'#6B7F3E'},
 mar:{bg:'#0B1E2A',fg:'#E0F2FE',a:'#38BDF8',b:'#0EA5E9'},
 vino:{bg:'#2A0F14',fg:'#F5E6C8',a:'#C9A227',b:'#8A6D1F'},
 grafito:{bg:'#17171A',fg:'#E5E5E5',a:'#D4D4D8',b:'#71717A'},
 terracota:{bg:'#2B1408',fg:'#F7E8D0',a:'#E2725B',b:'#B8542F'}
};
const SERIF="Georgia,'Times New Roman',serif", SANS="system-ui,-apple-system,'Segoe UI',sans-serif", MONO="'Courier New',monospace";
const NS='xmlns="http://www.w3.org/2000/svg"';
function T(x,y,s,size,fill,ff,ex){return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${ff}" font-size="${size}" fill="${fill}"${ex?` ${ex}`:''}>${s}</text>`}
function nz(n){return n.length>15?10.5:n.length>11?12:14}
function pie(nm,nicho,fg,acc,ff){return T(100,170,nm,nz(nm),fg,ff,'font-weight="700" letter-spacing="1"')+T(100,186,nicho.toUpperCase(),8,acc,SANS,'letter-spacing="2.5"')}
function star(cx,cy,r,fill,n,rot){n=n||5;rot=rot==null?-90:rot;let s='';for(let i=0;i<n*2;i++){const rr=i%2?r*.45:r,a=(rot+i*180/n)*Math.PI/180;s+=`${(cx+rr*Math.cos(a)).toFixed(1)},${(cy+rr*Math.sin(a)).toFixed(1)} `}return `<polygon points="${s.trim()}" fill="${fill}"/>`}
/* ===== Catálogo: 10 familias × 5 variantes ===== */
const FAMS=[
 {id:'monograma',label:'Monograma',items:[
  ['Casa Brasa','restaurante','CB','brasa'],['Armonía Spa','spa','AS','mar'],
  ['Navaja Barbería','barbería','NV','grafito'],['Forja Olímpica','gym','FO','terracota'],
  ['Manada Vet','veterinaria','MV','oliva']]},
 {id:'emblema',label:'Emblema',items:[
  ['Origen Café','cafetería','OC','terracota'],['Torque Taller','taller','TT','grafito'],
  ['Vestíbulo Hotel','hotel','VH','vino'],['Fermento Pan','panadería','FP','brasa'],
  ['Plano Inmobiliaria','inmobiliaria','PI','mar']]},
 {id:'geometrico',label:'Geométrico',items:[
  ['Órbita Lab','sistemas','OL','carbon'],['KAIRO','artista urbano','K','vino'],
  ['Leña Pizzería','pizzería','L','brasa'],['Esmalte Dental','dental','E','mar'],
  ['Obscura Foto','fotógrafo','O','grafito']]},
 {id:'wordmark',label:'Wordmark',items:[
  ['Pétalo','florería','P','oliva'],['Verbo Vivo','estudio bíblico','VV','vino'],
  ['Burbuja Express','lavandería','BE','mar'],['Alma Café','cafetería','AC','terracota'],
  ['Luz Urbana','tienda','LU','carbon']]},
 {id:'pictorico',label:'Pictórico',items:[
  ['Manada Vet','veterinaria','M','oliva'],['Espejo Belleza','belleza','E','vino'],
  ['Taza Dorada','cafetería','T','brasa'],['Casa Verde','jardinería','CV','oliva'],
  ['La Gota Pura','agua purificada','G','mar']]},
 {id:'lineal',label:'Lineal',items:[
  ['Armonía Spa','spa','A','mar'],['Espejo Belleza','belleza','E','vino'],
  ['Origen Café','cafetería','O','terracota'],['Luna Yoga','wellness','LY','grafito'],
  ['Río Claro','limpieza','RC','mar']]},
 {id:'vintage',label:'Vintage',items:[
  ['Navaja Barbería','barbería','NB','grafito'],['Don Pancho','taquería','DP','brasa'],
  ['El Taller Clásico','taller','TC','terracota'],['Café Centenario','cafetería','CC','vino'],
  ['Casa Brasa','restaurante','CB','brasa']]},
 {id:'organico',label:'Orgánico',items:[
  ['Pétalo Florería','florería','P','oliva'],['Armonía Spa','spa','A','mar'],
  ['Verde Vivo','alimentos naturales','VV','oliva'],['Espejo Belleza','belleza','E','vino'],
  ['Finca Serena','agroturismo','FS','terracota']]},
 {id:'industrial',label:'Industrial',items:[
  ['Torque Taller','taller','T','grafito'],['Forja Gym','gym','F','brasa'],
  ['Plano Constructora','construcción','PC','vino'],['Acero Norte','herrería','AN','grafito'],
  ['Vía Rápida','logística','VR','mar']]},
 {id:'tech',label:'Tech',items:[
  ['Órbita Lab','sistemas','O','carbon'],['Nube Segura','software','NS','mar'],
  ['Dato Vivo','datos','DV','carbon'],['KAIRO Music','música','K','vino'],
  ['Pulso Digital','agencia','PD','grafito']]},
 {id:'neon',label:'Neón',items:[
  ['Volta Club','club nocturno','VC','carbon'],['Lumen Tattoo','tatuaje','LT','vino'],
  ['Aurora DJ','dj','AD','mar'],['Pixel Arena','gaming','PA','grafito'],
  ['Neón Bar','bar','NB','terracota']]},
 {id:'degradado',label:'Degradado',items:[
  ['Bruma Café','cafetería','BC','mar'],['Iris Yoga','yoga','IY','vino'],
  ['Marea Surf','surf','MS','carbon'],['Prisma Print','imprenta','PP','terracota'],
  ['Alba Suites','hotel','AS','oliva']]},
 {id:'negativo',label:'Negativo',items:[
  ['Punto Final','editorial','PF','grafito'],['Clave Legal','abogacía','CL','vino'],
  ['Sombra Films','cine','SF','carbon'],['Tinta Plena','tatuaje','TP','grafito'],
  ['Blanco Total','fotografía','BT','mar']]},
 {id:'sello',label:'Sello',items:[
  ['Correo Real','mensajería','CR','brasa'],['Sello Dorado','notaría','SD','vino'],
  ['La Estampa','panadería','LE','terracota'],['Tinta Oficial','contaduría','TO','grafito'],
  ['Marca Viva','consultoría','MV','oliva']]},
 {id:'manuscrito',label:'Manuscrito',items:[
  ['Dulce Pluma','repostería','DP','vino'],['Carta Abierta','librería','CA','terracota'],
  ['Firma Propia','boutique','FP','mar'],['Verso Libre','café literario','VL','brasa'],
  ['Trazo Fino','caligrafía','TF','oliva']]},
 {id:'isometrico',label:'Isométrico',items:[
  ['Cubo Andamio','arquitectura','CA','grafito'],['Bloque Vivo','videojuegos','BV','carbon'],
  ['Prisma 3D','diseño 3d','P3','mar'],['Nivel Siete','gaming','N7','vino'],
  ['Terraza 360','bienes raíces','T3','terracota']]},
 {id:'glitch',label:'Glitch',items:[
  ['Error 404','software','E4','carbon'],['Ruido Blanco','música electrónica','RB','grafito'],
  ['Dato Roto','ciberseguridad','DR','mar'],['Señal Perdida','podcast','SP','vino'],
  ['Bug Café','café tech','BC','brasa']]},
 {id:'acuarela',label:'Acuarela',items:[
  ['Tinta Suave','papelería','TS','mar'],['Color Piel','cosmética','CP','vino'],
  ['Lluvia Fina','spa','LF','oliva'],['Papel Mojado','arte','PM','terracota'],
  ['Brisa Marina','hotel boutique','BM','mar']]},
 {id:'unalinea',label:'Una Línea',items:[
  ['Hilo Único','sastrería','HU','grafito'],['Trazo Continuo','diseño','TC','carbon'],
  ['Una Vuelta','ciclismo','UV','mar'],['Línea Viva','fisioterapia','LV','oliva'],
  ['Nudo Simple','joyería','NS','vino']]},
 {id:'mascota',label:'Mascota',items:[
  ['Don Bigote','cafetería','DB','brasa'],['Capitán Croqueta','petshop','CC','terracota'],
  ['El Zorro Veloz','mensajería','ZV','vino'],['Doña Empanada','comida','DE','brasa'],
  ['Rey Peludo','barbería kids','RP','grafito']]}
];
const ICON_P={veterinaria:'paw',belleza:'mirror',cafetería:'cup',jardinería:'leaf','agua purificada':'drop'};
const ICON_L={spa:'lotus',belleza:'profile',cafetería:'cup',wellness:'moon',limpieza:'waves'};
/* ===== Generadores por familia: G(familia)(e, variante, R) → inner SVG ===== */
const G={};
/* 1 · MONOGRAMA — iniciales entrelazadas */
G.monograma=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,ini=e.ini,a=ini[0]||'',b=ini[1]||'',s='';
 const fr=[
  `<circle cx="100" cy="80" r="52" fill="none" stroke="${A}" stroke-width="3"/><circle cx="100" cy="80" r="44" fill="none" stroke="${A}" stroke-width="1" opacity=".55"/>`+T(100,97,ini,42,F,SERIF,'font-weight="700" letter-spacing="3"'),
  `<rect x="48" y="28" width="104" height="104" fill="none" stroke="${A}" stroke-width="2.5"/><rect x="57" y="37" width="86" height="86" fill="none" stroke="${A}" stroke-width="1" opacity=".5"/>`+T(92,98,a,50,F,SANS,'font-weight="800"')+T(118,106,b,38,A,SERIF,'font-style="italic" font-weight="700"'),
  `<rect x="54" y="34" width="92" height="92" fill="none" stroke="${A}" stroke-width="2.5" transform="rotate(45 100 80)"/><rect x="64" y="44" width="72" height="72" fill="none" stroke="${A}" stroke-width="1" opacity=".5" transform="rotate(45 100 80)"/>`+T(100,94,ini.split('').join(' '),32,F,MONO,'font-weight="700"'),
  `<path d="M42 80 A58 58 0 0 1 42 128" fill="none" stroke="${A}" stroke-width="2"/><path d="M158 80 A58 58 0 0 0 158 128" fill="none" stroke="${A}" stroke-width="2"/>`+T(100,98,ini,44,F,SERIF,'font-weight="700"')+`<line x1="72" y1="110" x2="128" y2="110" stroke="${A}" stroke-width="2"/>`,
  `<rect x="52" y="34" width="96" height="92" rx="46" fill="none" stroke="${A}" stroke-width="2.5"/>`+T(100,98,ini,38,F,SANS,'font-weight="800" letter-spacing="2"')
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,v%2?SANS:SERIF);
};
/* 2 · EMBLEMA — insignia circular / escudo */
G.emblema=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,ini=e.ini;
 const bean=`<ellipse cx="100" cy="80" rx="20" ry="30" fill="${A}"/><path d="M100 52 C 88 70, 112 90, 100 108" fill="none" stroke="${p.bg}" stroke-width="4"/>`;
 const shield=`<path d="M100 30 L144 47 V90 C144 116 122 132 100 142 C78 132 56 116 56 90 V47 Z" fill="none" stroke="${A}" stroke-width="3"/><path d="M100 38 L136 52 V90 C136 111 118 124 100 133 C82 124 64 111 64 90 V52 Z" fill="none" stroke="${A}" stroke-width="1" opacity=".5"/>`;
 const fr=[
  `<circle cx="100" cy="80" r="54" fill="none" stroke="${A}" stroke-width="3.5"/><circle cx="100" cy="80" r="46" fill="none" stroke="${B}" stroke-width="1.5"/>`+star(100,80,26,A)+`<circle cx="100" cy="80" r="4" fill="${p.bg}"/>`,
  shield+T(100,102,ini,40,F,SERIF,'font-weight="700"'),
  `<polygon points="100,26 147,53 147,107 100,134 53,107 53,53" fill="none" stroke="${A}" stroke-width="3"/>`+bean,
  `<circle cx="100" cy="80" r="54" fill="none" stroke="${A}" stroke-width="2.5"/><line x1="52" y1="80" x2="148" y2="80" stroke="${A}" stroke-width="1.5" opacity=".6"/><line x1="100" y1="32" x2="100" y2="128" stroke="${A}" stroke-width="1.5" opacity=".6"/>`+T(100,97,ini,36,F,MONO,'font-weight="700"'),
  `<rect x="46" y="26" width="108" height="108" rx="26" fill="${A}" opacity=".14"/><rect x="46" y="26" width="108" height="108" rx="26" fill="none" stroke="${A}" stroke-width="2.5"/>`+star(100,72,20,A)+T(100,112,e.nicho.split(' ')[0].toUpperCase(),10,F,SANS,'letter-spacing="2"')
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SERIF);
};
/* 3 · GEOMÉTRICO — marca abstracta 2-4 formas */
G.geometrico=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,rot=(R()*40-20).toFixed(0);
 const tri=(cx,cy,r,f,rr)=>{const a=((rr||0)*Math.PI/180);let s='';for(let i=0;i<3;i++){const t=a+i*2*Math.PI/3;s+=`${(cx+r*Math.cos(t)).toFixed(1)},${(cy+r*Math.sin(t)).toFixed(1)} `}return `<polygon points="${s.trim()}" fill="${f}"/>`};
 const fr=[
  `<g transform="rotate(${rot} 100 80)"><path d="M60 110 A40 40 0 0 1 140 110" fill="none" stroke="${A}" stroke-width="12" stroke-linecap="round"/>${tri(100,62,20,B,0)}<circle cx="100" cy="108" r="10" fill="${F}"/></g>`,
  `<g transform="rotate(${rot} 100 80)"><rect x="60" y="72" width="80" height="14" rx="7" fill="${A}" transform="rotate(24 100 80)"/><rect x="60" y="72" width="80" height="14" rx="7" fill="${B}" transform="rotate(-24 100 80)"/><circle cx="100" cy="80" r="12" fill="${p.bg}" stroke="${F}" stroke-width="3"/></g>`,
  `<circle cx="100" cy="80" r="44" fill="none" stroke="${A}" stroke-width="10" stroke-dasharray="${(R()*60+40).toFixed(0)} 300" stroke-linecap="round" transform="rotate(${rot} 100 80)"/><circle cx="100" cy="80" r="22" fill="${B}"/>`,
  `<g transform="rotate(${rot} 100 80)">${tri(100,88,44,A,90)}${tri(100,88,44,p.bg,270)}<circle cx="100" cy="88" r="11" fill="${F}"/></g>`,
  `<path d="M100 36 A44 44 0 0 1 144 80 L122 80 A22 22 0 0 0 100 58 Z" fill="${A}"/><path d="M100 124 A44 44 0 0 1 56 80 L78 80 A22 22 0 0 0 100 102 Z" fill="${B}"/><circle cx="100" cy="80" r="9" fill="${F}"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 4 · WORDMARK — solo tipografía con un detalle */
G.wordmark=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,nm=e.nombre,ff=v%2?SERIF:SANS;
 const fs=nm.length>12?26:nm.length>8?32:40;
 const last=n=>n.slice(0,-1)+`<tspan fill="${A}">${n.slice(-1)}</tspan>`;
 const fr=[
  T(100,96,last(nm),fs,F,ff,'font-weight="800" letter-spacing="1"'),
  T(100,92,nm.toUpperCase(),fs*.72,F,ff,'font-weight="700" letter-spacing="4"')+`<path d="M${100-nm.length*9} 108 Q 100 122 ${100+nm.length*9} 104" fill="none" stroke="${A}" stroke-width="3" stroke-linecap="round"/>`,
  T(100,96,nm,fs,F,ff,'font-weight="800"')+`<circle cx="${100+nm.length*fs*.32}" cy="${96-fs*.72}" r="7" fill="${A}"/>`,
  T(100,96,nm.toUpperCase(),fs*.68,'none',ff,`font-weight="700" letter-spacing="6" stroke="${F}" stroke-width="1.4"`),
  T(100,96,nm.split('').join(' ◆ ').replace(/◆/g,'<tspan fill="'+A+'" font-size="'+(fs*.5)+'">◆</tspan>'),fs*.62,F,ff,'font-weight="700" letter-spacing="2"')
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,ff);
};
/* 5 · PICTÓRICO — icono simple + nombre (legible a 32px) */
function icoPaw(p,x,y,s){return `<g fill="${p.a}"><ellipse cx="${x}" cy="${y+s*.28}" rx="${s*.30}" ry="${s*.24}"/><circle cx="${x-s*.30}" cy="${y-s*.18}" r="${s*.13}"/><circle cx="${x-s*.10}" cy="${y-s*.30}" r="${s*.13}"/><circle cx="${x+s*.10}" cy="${y-s*.30}" r="${s*.13}"/><circle cx="${x+s*.30}" cy="${y-s*.18}" r="${s*.13}"/></g>`}
function icoMirror(p,x,y,s){return `<g><ellipse cx="${x}" cy="${y-s*.12}" rx="${s*.30}" ry="${s*.40}" fill="none" stroke="${p.a}" stroke-width="${s*.09}"/><line x1="${x}" y1="${y+s*.28}" x2="${x}" y2="${y+s*.52}" stroke="${p.a}" stroke-width="${s*.09}"/><line x1="${x-s*.18}" y1="${y+s*.52}" x2="${x+s*.18}" y2="${y+s*.52}" stroke="${p.a}" stroke-width="${s*.09}" stroke-linecap="round"/></g>`}
function icoCup(p,x,y,s){return `<g><path d="M${x-s*.32} ${y-s*.30} L${x-s*.22} ${y+s*.34} L${x+s*.22} ${y+s*.34} L${x+s*.32} ${y-s*.30} Z" fill="${p.a}"/><path d="M${x+s*.32} ${y-s*.18} q ${s*.34} 0 ${s*.22} ${s*.26} q -.10 ${s*.20} -${s*.30} ${s*.16}" fill="none" stroke="${p.a}" stroke-width="${s*.10}"/><line x1="${x-s*.30}" y1="${y-s*.42}" x2="${x+s*.30}" y2="${y-s*.42}" stroke="${p.fg}" stroke-width="${s*.07}" stroke-linecap="round"/></g>`}
function icoLeaf(p,x,y,s){return `<g><path d="M${x} ${y-s*.45} C ${x+s*.45} ${y-s*.20} ${x+s*.40} ${y+s*.30} ${x} ${y+s*.45} C ${x-s*.40} ${y+s*.30} ${x-s*.45} ${y-s*.20} ${x} ${y-s*.45} Z" fill="${p.a}"/><line x1="${x}" y1="${y-s*.40}" x2="${x}" y2="${y+s*.40}" stroke="${p.bg}" stroke-width="${s*.06}"/></g>`}
function icoDrop(p,x,y,s){return `<path d="M${x} ${y-s*.50} C ${x+s*.34} ${y-s*.02} ${x+s*.30} ${y+s*.20} ${x} ${y+s*.42} C ${x-s*.30} ${y+s*.20} ${x-s*.34} ${y-s*.02} ${x} ${y-s*.50} Z" fill="${p.a}"/>`}
G.pictorico=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,k=ICON_P[e.nicho]||'leaf';
 const fn={paw:icoPaw,mirror:icoMirror,cup:icoCup,leaf:icoLeaf,drop:icoDrop}[k];
 let inner;
 if(v===0)inner=fn(p,100,74,46);
 else if(v===1)inner=`<g fill="none" stroke="${A}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${fn(p,100,74,46).replace(/fill="[^"]*"/g,'fill="none"').replace(/stroke="[^"]*"/g,'')}</g>`;
 else if(v===2)inner=`<circle cx="100" cy="74" r="44" fill="none" stroke="${A}" stroke-width="2.5"/>`+fn(p,100,74,37);
 else if(v===3)inner=fn({a:A,bg:p.bg,fg:p.fg},88,74,41)+fn({a:p.b,bg:p.bg,fg:p.fg},116,84,25);
 else inner=fn(p,100,66,32);
 return inner+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 6 · LINEAL — un solo trazo continuo / líneas finas */
function linLotus(p){return `<g fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"><path d="M100 44 C 88 66, 88 84, 100 100 C 112 84, 112 66, 100 44 Z"/><path d="M100 44 C 78 58, 66 76, 66 100 C 82 92, 94 78, 100 44 Z"/><path d="M100 44 C 122 58, 134 76, 134 100 C 118 92, 106 78, 100 44 Z"/><path d="M62 112 Q 100 128 138 112"/></g>`}
function linProfile(p){return `<g fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"><path d="M60 110 C 70 78, 84 60, 104 58 C 112 57, 116 62, 114 68 C 112 74, 104 74, 102 80 C 100 88, 108 92, 104 100 C 100 108, 92 108, 90 116 L 86 128"/></g>`}
function linCup(p){return `<g fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"><path d="M64 62 L78 118 L122 118 L136 62 M136 74 q 26 2 18 24 q -7 18 -30 14 M64 62 L136 62 M84 50 q 4 -8 0 -14 M104 50 q 4 -8 0 -14 M124 50 q 4 -8 0 -14"/></g>`}
function linMoon(p){return `<g fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"><path d="M128 52 A34 34 0 1 0 128 108 A27 27 0 1 1 128 52 Z"/><path d="M52 120 Q 76 108 100 120 T 148 120"/></g>`}
function linWaves(p){return `<g fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"><path d="M52 78 Q 68 66 84 78 T 116 78 T 148 78"/><path d="M52 100 Q 68 88 84 100 T 116 100 T 148 100" opacity=".65"/><path d="M52 122 Q 68 110 84 122 T 116 122 T 148 122" opacity=".35"/></g>`}
G.lineal=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,fn={lotus:linLotus,profile:linProfile,cup:linCup,moon:linMoon,waves:linWaves}[ICON_L[e.nicho]||'waves'](p);
 let inner;
 if(v===0)inner=fn;
 else if(v===1)inner=`<g opacity=".55" transform="translate(4,3)">${fn}</g>`+fn;
 else if(v===2)inner=`<circle cx="100" cy="86" r="52" fill="none" stroke="${A}" stroke-width="1.5" opacity=".7"/>`+fn;
 else if(v===3)inner=fn+`<circle cx="150" cy="52" r="6" fill="${A}"/>`;
 else inner=fn+`<path d="M52 132 Q 100 146 148 130" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
 return inner+pie(e.nombre,e.nicho,F,A,v%2?SERIF:SANS);
};
/* 7 · VINTAGE — banners, serif condensada, ornamentos */
G.vintage=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,ini=e.ini,nm=e.nombre,fs=nz(nm)-1;
 const rib=(y)=>`<polygon points="40,${y} 60,${y} 54,${y+11} 60,${y+22} 40,${y+22}" fill="${p.b}"/><polygon points="160,${y} 140,${y} 146,${y+11} 140,${y+22} 160,${y+22}" fill="${p.b}"/><rect x="56" y="${y}" width="88" height="22" fill="${A}"/>`;
 const orn=`<polygon points="100,52 106,60 100,68 94,60" fill="${A}"/><circle cx="76" cy="60" r="2.5" fill="${A}"/><circle cx="124" cy="60" r="2.5" fill="${A}"/>`;
 const fr=[
  orn+rib(74)+T(100,90,nm.toUpperCase(),fs,F,SERIF,'font-weight="700" letter-spacing="2"'),
  `<circle cx="100" cy="80" r="52" fill="none" stroke="${A}" stroke-width="3"/><circle cx="100" cy="80" r="46" fill="none" stroke="${A}" stroke-width="1"/>`+T(100,88,nm.toUpperCase(),fs*.9,F,SERIF,'font-weight="700" letter-spacing="1"')+`<line x1="66" y1="102" x2="134" y2="102" stroke="${A}" stroke-width="1.5"/>`+T(100,118,ini,11,A,SANS,'letter-spacing="3"'),
  `<rect x="44" y="28" width="112" height="104" fill="none" stroke="${A}" stroke-width="2.5"/><rect x="50" y="34" width="100" height="92" fill="none" stroke="${A}" stroke-width="1" opacity=".6"/>`+`<polygon points="44,28 56,28 44,40" fill="${A}"/><polygon points="156,28 144,28 156,40" fill="${A}"/><polygon points="44,132 56,132 44,120" fill="${A}"/><polygon points="156,132 144,132 156,120" fill="${A}"/>`+T(100,84,nm.toUpperCase(),fs,F,SERIF,'font-weight="700" letter-spacing="1"')+T(100,104,e.nicho.toUpperCase(),8.5,A,SANS,'letter-spacing="3"'),
  `<path d="M52 92 Q 74 76 96 88" fill="none" stroke="${A}" stroke-width="2"/><path d="M148 92 Q 126 76 104 88" fill="none" stroke="${A}" stroke-width="2"/>`+T(100,88,nm.toUpperCase(),fs,F,SERIF,'font-weight="700" letter-spacing="2"')+`<polygon points="100,102 105,108 100,114 95,108" fill="${A}"/>`,
  `<path d="M100 30 L142 46 V88 C142 112 122 128 100 138 C78 128 58 112 58 88 V46 Z" fill="${A}" opacity=".16"/><path d="M100 30 L142 46 V88 C142 112 122 128 100 138 C78 128 58 112 58 88 V46 Z" fill="none" stroke="${A}" stroke-width="2.5"/>`+rib(66)+T(100,82,ini,20,p.bg,SERIF,'font-weight="700"')
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SERIF);
};
/* 8 · ORGÁNICO — curvas, hojas, ondas, gotas */
function orgFlower(p,x,y,s){let g='';for(let i=0;i<6;i++){const a=i*60;g+=`<ellipse cx="${x}" cy="${y-s*.32}" rx="${s*.15}" ry="${s*.32}" fill="${i%2?p.a:p.b}" transform="rotate(${a} ${x} ${y})"/>`}return g+`<circle cx="${x}" cy="${y}" r="${s*.13}" fill="${p.fg}"/>`}
function orgWaves(p){let s='';for(let i=0;i<3;i++){const y=58+i*22;s+=`<path d="M48 ${y} Q 74 ${y-16} 100 ${y} T 152 ${y}" fill="none" stroke="${i%2?p.b:p.a}" stroke-width="5" stroke-linecap="round"/>`}return s}
function orgLeaves(p){return `<g><path d="M100 40 C 130 60 134 96 100 118 C 66 96 70 60 100 40 Z" fill="${p.a}"/><path d="M100 48 L100 112" stroke="${p.bg}" stroke-width="3"/><path d="M100 70 L84 62 M100 70 L116 62 M100 88 L82 80 M100 88 L118 80" stroke="${p.bg}" stroke-width="2.5"/></g>`}
function orgDropLeaf(p){return icoDrop(p,88,70,52)+icoLeaf(p,122,84,44)}
function orgSun(p){return `<circle cx="100" cy="66" r="20" fill="${p.a}"/>`+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<line x1="${(100+28*Math.cos(a)).toFixed(0)}" y1="${(66+28*Math.sin(a)).toFixed(0)}" x2="${(100+38*Math.cos(a)).toFixed(0)}" y2="${(66+38*Math.sin(a)).toFixed(0)}" stroke="${p.a}" stroke-width="4" stroke-linecap="round"/>`}).join('')+`<path d="M52 116 Q 100 96 148 116" fill="none" stroke="${p.b}" stroke-width="5" stroke-linecap="round"/>`}
G.organico=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg;
 const k={florería:0,spa:1,'alimentos naturales':2,belleza:3,agroturismo:4}[e.nicho]??2;
 const base=[orgFlower(p,100,74,44),orgWaves(p),orgLeaves(p),orgDropLeaf(p),orgSun(p)][k];
 let inner;
 if(v===0)inner=base;
 else if(v===1)inner=`<circle cx="100" cy="76" r="50" fill="none" stroke="${A}" stroke-width="2"/>`+`<g transform="translate(100 76) scale(.78) translate(-100 -76)">${base}</g>`;
 else if(v===2)inner=`<g transform="translate(100 76) scale(1.25) translate(-100 -76)">${base}</g>`;
 else if(v===3)inner=`<g opacity=".9">${base}</g>`+`<path d="M60 128 Q 100 140 140 128" fill="none" stroke="${A}" stroke-width="2.5" stroke-linecap="round"/>`;
 else inner=`<rect x="48" y="24" width="104" height="104" rx="52" fill="${A}" opacity=".12"/>`+base;
 return inner+pie(e.nombre,e.nicho,F,A,v%2?SANS:SERIF);
};
/* 9 · INDUSTRIAL — ángulos, placas, tuercas, stencil */
function indGear(p,cx,cy,r){let t='';for(let i=0;i<8;i++){t+=`<rect x="${cx-7}" y="${cy-r-9}" width="14" height="18" fill="${p.a}" transform="rotate(${i*45} ${cx} ${cy})"/>`}return t+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.a}"/><circle cx="${cx}" cy="${cy}" r="${r*.42}" fill="${p.bg}"/>`}
G.industrial=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,ini=e.ini;
 const k={taller:0,gym:1,construcción:2,herrería:3,logística:4}[e.nicho]??0;
 const base=[
  indGear(p,100,76,30),
  `<rect x="52" y="44" width="96" height="64" rx="8" fill="none" stroke="${A}" stroke-width="4"/>`+[[58,50],[142,50],[58,102],[142,102]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="${A}"/>`).join('')+T(100,92,ini,34,F,MONO,'font-weight="700"'),
  `<polygon points="70,44 130,44 122,66 122,86 130,108 70,108 78,86 78,66" fill="none" stroke="${A}" stroke-width="4"/>`+T(100,88,ini,26,F,MONO,'font-weight="700"'),
  `<polygon points="100,40 131,58 131,94 100,112 69,94 69,58" fill="none" stroke="${A}" stroke-width="5"/><polygon points="100,58 116,67 116,85 100,94 84,85 84,67" fill="${B}"/>`,
  `<g fill="none" stroke="${A}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M62 52 L96 76 L62 100"/><path d="M104 52 L138 76 L104 100"/></g>`
 ][k];
 let inner;
 if(v===0)inner=base;
 else if(v===1)inner=`<g stroke-dasharray="6 3">${base}</g>`+T(100,140,'EST. 2026',9,A,MONO,'letter-spacing="3"');
 else if(v===2)inner=`<circle cx="100" cy="76" r="52" fill="none" stroke="${A}" stroke-width="2.5"/>`+`<g transform="translate(100 76) scale(.72) translate(-100 -76)">${base}</g>`;
 else if(v===3)inner=base.split(A).join('__T__').split(B).join(A).split('__T__').join(B);
 else inner=`<rect x="40" y="24" width="120" height="104" fill="none" stroke="${A}" stroke-width="1.5" opacity=".8"/>`+`<g opacity=".9">${base}</g>`;
 return inner+pie(e.nombre,e.nicho,F,A,MONO);
};
/* 10 · TECH — nodos, órbitas, gradientes */
G.tech=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,gid='g'+H(e.id+v).toString(36);
 const grad=`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient></defs>`;
 const k={sistemas:0,software:1,datos:2,música:3,agencia:4}[e.nicho]??0;
 const nd=[];for(let i=0;i<5;i++){nd.push([60+R()*80,44+R()*64])}
 const links=[[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]].map(l=>`<line x1="${nd[l[0]][0].toFixed(0)}" y1="${nd[l[0]][1].toFixed(0)}" x2="${nd[l[1]][0].toFixed(0)}" y2="${nd[l[1]][1].toFixed(0)}" stroke="${A}" stroke-width="1.5" opacity=".6"/>`).join('');
 const nodes=nd.map((n,i)=>`<circle cx="${n[0].toFixed(0)}" cy="${n[1].toFixed(0)}" r="${i===0?8:5}" fill="${i===0?A:p.bg}" stroke="${A}" stroke-width="2"/>`).join('');
 const base=[
  `<ellipse cx="100" cy="76" rx="52" ry="20" fill="none" stroke="url(#${gid})" stroke-width="3" transform="rotate(-24 100 76)"/><ellipse cx="100" cy="76" rx="52" ry="20" fill="none" stroke="${B}" stroke-width="2" opacity=".7" transform="rotate(28 100 76)"/><circle cx="100" cy="76" r="12" fill="url(#${gid})"/>`,
  links+nodes,
  Array.from({length:9},(_,i)=>{const h=12+R()*52;return `<rect x="${56+i*11}" y="${110-h}" width="7" height="${h}" rx="3.5" fill="${i%3?A:B}"/>`}).join(''),
  Array.from({length:12},(_,i)=>{const h=10+Math.abs(Math.sin(i*.9))*44;return `<rect x="${52+i*8.4}" y="${76-h/2}" width="4.5" height="${h}" rx="2" fill="url(#${gid})"/>`}).join(''),
  `<polygon points="100,32 137,54 137,98 100,120 63,98 63,54" fill="none" stroke="url(#${gid})" stroke-width="3.5"/><circle cx="100" cy="76" r="10" fill="${A}"/>`
 ][k];
 let inner;
 if(v===0)inner=grad+base;
 else if(v===1)inner=base+`<circle cx="100" cy="76" r="58" fill="none" stroke="${A}" stroke-width="1" opacity=".4" stroke-dasharray="4 6"/>`;
 else if(v===2)inner=`<rect x="40" y="20" width="120" height="112" rx="18" fill="#000" opacity=".35"/>`+base;
 else if(v===3)inner=base+`<circle cx="152" cy="36" r="5" fill="${A}"/>`;
 else inner=grad+`<g opacity=".92">${base}</g>`;
 return inner+pie(e.nombre,e.nicho,F,A,SANS);
};
/* ===== Familias 11-20 ===== */
function starPts(cx,cy,r,n,rot){n=n||5;rot=rot==null?-90:rot;let s='';for(let i=0;i<n*2;i++){const rr=i%2?r*.45:r,a=(rot+i*180/n)*Math.PI/180;s+=`${(cx+rr*Math.cos(a)).toFixed(1)},${(cy+rr*Math.sin(a)).toFixed(1)} `}return s.trim()}
/* 11 · NEÓN — trazos luminosos (doble trazo: halo tenue + núcleo brillante, sin filtros) */
function neonStroke(c,inner,w){return `<g fill="none" stroke="${c}" stroke-linecap="round" stroke-linejoin="round"><g opacity=".22" stroke-width="${w+9}">${inner}</g><g stroke-width="${w}">${inner}</g></g>`}
G.neon=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,ini=e.ini;
 const fr=[
  neonStroke(A,`<path d="M112 28 L82 86 L102 86 L90 128"/>`,4),
  neonStroke(A,`<circle cx="100" cy="78" r="46"/>`,3.5)+T(100,94,ini,36,A,SANS,'font-weight="800"'),
  neonStroke(A,`<path d="M48 70 Q 74 44 100 70 T 152 70"/><path d="M48 96 Q 74 70 100 96 T 152 96" opacity=".6"/>`,3.5),
  neonStroke(A,`<polygon points="${starPts(100,78,40)}"/>`,3),
  neonStroke(A,`<polygon points="100,32 139,55 139,101 100,124 61,101 61,55"/>`,3.5)+`<circle cx="100" cy="78" r="9" fill="${A}"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 12 · DEGRADADO — gradientes modernos (un linearGradient por logo, id único) */
G.degradado=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,gid='dg'+H(e.id+v).toString(36),ini=e.ini;
 const grad=`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient></defs>`;
 const fr=[
  `<rect x="52" y="30" width="96" height="96" rx="28" fill="url(#${gid})"/>`+T(100,96,ini,40,'#ffffff',SANS,'font-weight="800"'),
  `<circle cx="100" cy="78" r="48" fill="url(#${gid})"/>`+T(100,94,ini,38,'#ffffff',SERIF,'font-weight="700"'),
  Array.from({length:7},(_,i)=>{const h=18+((i*37+v*13)%52);return `<rect x="${58+i*13}" y="${112-h}" width="9" height="${h}" rx="4.5" fill="url(#${gid})" opacity="${(.55+i*.07).toFixed(2)}"/>`}).join(''),
  `<path d="M52 40 Q 100 20 148 44 Q 150 100 100 122 Q 50 100 52 40 Z" fill="url(#${gid})"/>`+T(100,88,ini,30,'#ffffff',SANS,'font-weight="800"'),
  `<path d="M40 30 L160 30 L160 78 L40 78 Z" fill="url(#${gid})" opacity=".92"/><path d="M40 78 L160 78 L160 126 L40 126 Z" fill="url(#${gid})" opacity=".45"/>`+T(100,88,e.nombre.split(' ')[0].toUpperCase(),20,'#ffffff',SANS,'font-weight="800" letter-spacing="2"')
 ][v];
 return grad+fr+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 13 · NEGATIVO — espacio negativo: forma clara recortada con el color de fondo */
G.negativo=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,bg=p.bg,ini=e.ini;
 const fr=[
  `<circle cx="100" cy="78" r="48" fill="${F}"/><circle cx="119" cy="63" r="40" fill="${bg}"/>`,
  `<rect x="52" y="30" width="96" height="96" rx="14" fill="${F}"/><polygon points="100,52 130,104 70,104" fill="${bg}"/>`,
  `<rect x="48" y="40" width="104" height="76" rx="38" fill="${F}"/>`+T(100,92,ini,34,bg,SANS,'font-weight="800"'),
  `<circle cx="100" cy="78" r="46" fill="none" stroke="${F}" stroke-width="15"/><circle cx="100" cy="78" r="46" fill="none" stroke="${bg}" stroke-width="15" stroke-dasharray="72 217" transform="rotate(-40 100 78)"/>`,
  [0,1,2,3].map(i=>`<rect x="58" y="${44+i*22}" width="84" height="12" rx="6" fill="${F}"/>`).join('')+`<polygon points="52,40 98,78 52,116" fill="${bg}"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 14 · SELLO — tampón circular, leve rotación aleatoria determinística */
G.sello=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,ini=e.ini,rot=(R()*10-5).toFixed(1);
 const ring=`<circle cx="100" cy="78" r="50" fill="none" stroke="${A}" stroke-width="3"/><circle cx="100" cy="78" r="42" fill="none" stroke="${A}" stroke-width="1.5"/>`;
 const fr=[
  `<g transform="rotate(${rot} 100 78)">${ring}`+T(100,70,e.nicho.split(' ')[0].toUpperCase(),11,A,SANS,'letter-spacing="2" font-weight="700"')+T(100,96,ini,30,F,SERIF,'font-weight="700"')+`</g>`,
  `<g transform="rotate(${rot} 100 78)">${ring}`+star(100,78,20,A)+`</g>`,
  `<g transform="rotate(${-rot} 100 78)"><rect x="50" y="28" width="100" height="100" fill="none" stroke="${A}" stroke-width="3"/><rect x="58" y="36" width="84" height="84" fill="none" stroke="${A}" stroke-width="1.5"/></g>`+T(100,92,ini,32,F,MONO,'font-weight="700"'),
  `<g transform="rotate(${rot} 100 78)">${ring}</g>`+T(100,66,'DESDE',9,A,SANS,'letter-spacing="3"')+T(100,104,'2026',13,A,MONO,'font-weight="700" letter-spacing="2"'),
  `<g transform="rotate(${-rot} 100 78)"><ellipse cx="100" cy="78" rx="52" ry="40" fill="none" stroke="${A}" stroke-width="3"/><ellipse cx="100" cy="78" rx="44" ry="33" fill="none" stroke="${A}" stroke-width="1.5"/></g>`+T(100,90,ini,28,F,SERIF,'font-style="italic" font-weight="700"')
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SERIF);
};
/* 15 · MANUSCRITO — caligrafía protagonista */
G.manuscrito=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,nm=e.nombre,CUR='cursive';
 const fl=`<path d="M52 108 Q 100 128 148 104" fill="none" stroke="${A}" stroke-width="2.5" stroke-linecap="round"/>`;
 const w2=nm.split(' '),seg=w2.length>1?w2.slice(1).join(' '):e.nicho;
 const fr=[
  T(100,88,nm,34,F,CUR,'font-weight="700"')+fl,
  `<circle cx="100" cy="74" r="46" fill="none" stroke="${A}" stroke-width="2"/>`+T(100,92,w2[0],30,F,CUR,'font-weight="700"'),
  T(100,80,nm,30,F,CUR,'font-weight="700"')+`<line x1="64" y1="100" x2="136" y2="100" stroke="${A}" stroke-width="2"/><polygon points="100,94 106,100 100,106 94,100" fill="${A}"/>`,
  T(100,66,w2[0],32,F,CUR,'font-weight="700"')+T(100,102,seg,20,A,CUR),
  T(100,88,nm,28,F,CUR,'font-weight="700"')+`<path d="M52 60 Q 70 44 92 56" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round"/><path d="M148 96 Q 130 112 108 100" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,CUR);
};
/* 16 · ISOMÉTRICO — cubos 3D simples (3 rombos por cubo) */
function isoCube(p,cx,cy,s){
 const t=`${cx},${cy-s} ${(cx+s*.87).toFixed(1)},${(cy-s*.5).toFixed(1)} ${cx},${cy} ${(cx-s*.87).toFixed(1)},${(cy-s*.5).toFixed(1)}`;
 const l=`${(cx-s*.87).toFixed(1)},${(cy-s*.5).toFixed(1)} ${cx},${cy} ${cx},${cy+s} ${(cx-s*.87).toFixed(1)},${(cy+s*.5).toFixed(1)}`;
 const r=`${(cx+s*.87).toFixed(1)},${(cy-s*.5).toFixed(1)} ${cx},${cy} ${cx},${cy+s} ${(cx+s*.87).toFixed(1)},${(cy+s*.5).toFixed(1)}`;
 return `<polygon points="${t}" fill="${p.a}"/><polygon points="${l}" fill="${p.b}"/><polygon points="${r}" fill="${p.a}" opacity=".55"/>`;
}
G.isometrico=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg;
 const fr=[
  isoCube(p,100,64,36),
  isoCube(p,76,56,24)+isoCube(p,124,56,24)+isoCube(p,100,92,24),
  isoCube(p,100,56,32)+T(100,118,e.ini,26,F,SANS,'font-weight="800"'),
  isoCube(p,100,52,26)+`<rect x="58" y="94" width="84" height="10" rx="5" fill="${p.b}"/>`,
  isoCube(p,64,68,22)+isoCube(p,100,58,22)+isoCube(p,136,68,22)+isoCube(p,100,92,22)
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,MONO);
};
/* 17 · GLITCH — desplazamiento RGB digital */
G.glitch=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg,ini=e.ini;
 const gl=(txt,y,size)=>`<text x="97" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="700" fill="#EF4444" opacity=".75">${txt}</text><text x="103" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="700" fill="#38BDF8" opacity=".75">${txt}</text><text x="100" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="700" fill="${F}">${txt}</text>`;
 const bars=`<rect x="52" y="58" width="96" height="7" fill="#38BDF8" opacity=".5"/><rect x="52" y="88" width="96" height="7" fill="#EF4444" opacity=".5"/><rect x="52" y="104" width="60" height="5" fill="${F}" opacity=".6"/>`;
 const fr=[
  gl(ini,96,52)+bars,
  Array.from({length:6},(_,i)=>`<rect x="${54+i*4}" y="${40+i*14}" width="${92-i*8}" height="9" fill="${i%2?'#38BDF8':(i%3?'#EF4444':F)}" opacity=".7"/>`).join(''),
  `<circle cx="100" cy="78" r="44" fill="none" stroke="${F}" stroke-width="4"/><circle cx="103" cy="78" r="44" fill="none" stroke="#38BDF8" stroke-width="2" opacity=".7"/><circle cx="97" cy="78" r="44" fill="none" stroke="#EF4444" stroke-width="2" opacity=".7"/>`+gl(ini[0]||'',94,34),
  gl(e.nombre.toUpperCase().slice(0,8),88,26)+`<rect x="52" y="100" width="96" height="4" fill="${A}"/>`,
  bars+`<text x="100" y="80" text-anchor="middle" font-family="${MONO}" font-size="17" fill="${F}">// SIGNAL //</text>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,MONO);
};
/* 18 · ACUARELA — manchas suaves en capas (sin blur: opacidad apilada) */
G.acuarela=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg;
 const blob=(cx,cy,rx,ry,c,o)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}"/>`;
 const wash=blob(100,76,52,40,A,.5)+blob(84,66,34,28,B,.45)+blob(118,86,30,24,A,.4)+blob(100,76,60,46,A,.18);
 const fr=[
  wash+T(100,90,e.ini,36,F,SERIF,'font-weight="700"'),
  blob(100,76,50,50,A,.45)+blob(100,76,38,38,B,.4)+T(100,90,e.ini,32,'#ffffff',SERIF,'font-weight="700"'),
  blob(70,70,40,30,A,.5)+blob(130,84,42,32,B,.5)+T(100,90,e.ini,34,F,SANS,'font-weight="800"'),
  `<rect x="44" y="52" width="112" height="52" rx="26" fill="${A}" opacity=".4"/>`+blob(100,78,58,30,B,.35)+T(100,92,e.nombre.split(' ')[0],22,'#ffffff',SANS,'font-weight="800"'),
  wash+`<circle cx="100" cy="76" r="54" fill="none" stroke="${A}" stroke-width="2" opacity=".7"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SERIF);
};
/* 19 · UNALINEA — un solo trazo continuo */
G.unalinea=function(e,v,R){
 const p=PAL[e.pal],A=p.a,F=p.fg;
 const w=`fill="none" stroke="${A}" stroke-width="3.5" stroke-linecap="round"`;
 const fr=[
  `<path d="M100 78 m0 -34 a34 34 0 1 1 -0.1 0 M100 78 m0 -22 a22 22 0 1 0 0.1 0 M100 78 m0 -10 a10 10 0 1 1 -0.1 0" ${w}/>`,
  `<path d="M48 92 C 70 60, 90 60, 100 84 C 110 108, 130 108, 152 76" ${w}/>`,
  `<path d="M64 110 C 64 60, 136 60, 136 96 C 136 122, 84 122, 84 100 C 84 84, 112 84, 112 100" ${w}/>`,
  `<path d="M100 36 C 132 36, 140 70, 118 88 C 100 102, 100 118, 122 122 C 140 125, 150 112, 142 104" ${w}/>`,
  `<path d="M52 78 L148 78 M100 40 C 100 60, 100 96, 100 116 M70 52 C 90 44, 110 44, 130 52" ${w}/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SANS);
};
/* 20 · MASCOTA — personaje simple (cara + orejas/ojos) */
function mFace(p,cx,cy,r){
 return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.a}"/>`
 +`<circle cx="${(cx-r*.32).toFixed(1)}" cy="${(cy-r*.08).toFixed(1)}" r="${(r*.16).toFixed(1)}" fill="#fff"/><circle cx="${(cx+r*.32).toFixed(1)}" cy="${(cy-r*.08).toFixed(1)}" r="${(r*.16).toFixed(1)}" fill="#fff"/>`
 +`<circle cx="${(cx-r*.32).toFixed(1)}" cy="${(cy-r*.06).toFixed(1)}" r="${(r*.07).toFixed(1)}" fill="${p.bg}"/><circle cx="${(cx+r*.32).toFixed(1)}" cy="${(cy-r*.06).toFixed(1)}" r="${(r*.07).toFixed(1)}" fill="${p.bg}"/>`
 +`<path d="M${(cx-r*.22).toFixed(1)} ${(cy+r*.28).toFixed(1)} Q ${cx} ${(cy+r*.42).toFixed(1)} ${(cx+r*.22).toFixed(1)} ${(cy+r*.28).toFixed(1)}" fill="none" stroke="${p.bg}" stroke-width="${(r*.07).toFixed(1)}" stroke-linecap="round"/>`;
}
G.mascota=function(e,v,R){
 const p=PAL[e.pal],A=p.a,B=p.b,F=p.fg,bg=p.bg;
 const fr=[
  `<polygon points="70,54 82,26 98,48" fill="${A}"/><polygon points="130,54 118,26 102,48" fill="${A}"/>`+mFace(p,100,80,34),
  mFace(p,100,78,34)+`<circle cx="89" cy="76" r="13" fill="none" stroke="${bg}" stroke-width="3"/><circle cx="111" cy="76" r="13" fill="none" stroke="${bg}" stroke-width="3"/>`,
  `<polygon points="68,58 54,32 80,42" fill="${B}"/><polygon points="132,58 146,32 120,42" fill="${B}"/>`+mFace(p,100,82,32),
  `<rect x="66" y="46" width="68" height="62" rx="18" fill="${A}"/><line x1="100" y1="46" x2="100" y2="30" stroke="${A}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="26" r="6" fill="${B}"/><circle cx="86" cy="72" r="7" fill="${bg}"/><circle cx="114" cy="72" r="7" fill="${bg}"/><path d="M86 92 Q 100 100 114 92" fill="none" stroke="${bg}" stroke-width="3.5" stroke-linecap="round"/>`,
  `<circle cx="100" cy="82" r="32" fill="${A}"/><polygon points="100,76 91,87 109,87" fill="${B}"/><circle cx="90" cy="70" r="4.5" fill="${bg}"/><circle cx="110" cy="70" r="4.5" fill="${bg}"/><path d="M72 56 q 4 -16 18 -20 M128 56 q -4 -16 -18 -20" stroke="${A}" stroke-width="4" fill="none" stroke-linecap="round"/>`
 ][v];
 return fr+pie(e.nombre,e.nicho,F,A,SANS);
};

/* ===== Construir el catálogo de 100 ===== */
const LOGOS=[];
FAMS.forEach(f=>{f.items.forEach((it,v)=>{
 const [nombre,nicho,ini,pal]=it;
 const id=f.id+'-'+(v+1);
 const R=RNG(H(id));
 const inner=G[f.id]({nombre,nicho,ini,pal,id},v,R);
 const svg=`<svg viewBox="0 0 200 200" ${NS} role="img" aria-label="Logo ${nombre}"><rect width="200" height="200" fill="${PAL[pal].bg}"/>${inner}</svg>`;
 LOGOS.push({id,fam:f.id,famLabel:f.label,nombre,nicho,svg});
})});
window.LOGOS = LOGOS;
window.LOGO_FAMS = FAMS;
})();
