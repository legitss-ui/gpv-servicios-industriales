// ============================================
// SECCIÓN 1: CONTROL DEL MENÚ HAMBURGER (MÓVIL)
// ============================================

// QUÉ HACE:
// Este bloque controla la apertura/cierre del menú en pantallas móviles.
// Cuando el usuario presiona el botón ☰ (hamburger), el menú se despliega.
// Al presionar un enlace del menú, se cierra automáticamente.

// CORRELACIÓN CON HTML:
// En index.html existe:
// - <button class="header__burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav">
// - <nav class="header__nav" id="nav" aria-label="Navegación principal">
// Este JS busca estos elementos por ID y los controla.

// ============================================
// PASO 1: Capturar referencias a elementos HTML
// ============================================
const burger = document.getElementById("burger");
// Busca el botón con id="burger" (el ☰ hamburger)
// Ahora 'burger' contiene TODO EL ELEMENTO del HTML

const nav = document.getElementById("nav");
// Busca la navegación con id="nav"
// Ahora 'nav' contiene TODO EL ELEMENTO <nav> del HTML

// ============================================
// PASO 2: Evento CLICK en el botón hamburger
// ============================================
burger.addEventListener("click", () => {
  // Cuando alguien hace clic en el botón hamburger, entra aquí

  burger.classList.toggle("open");
  // TOGGLE = enciende/apaga la clase "open"
  // SI el botón tiene clase "open" → la quita
  // SI el botón NO tiene clase "open" → la añade
  //
  // QUÉ HACE EN CSS:
  // .slider__burger.open { /* mostrar menú, animar icono */ }
  // El CSS rota las líneas del hamburger (☰ → ✕)

  nav.classList.toggle("open");
  // Lo MISMO en la navegación:
  // Si nav NO tiene "open", la añade (menú visible)
  // Si nav YA tiene "open", la quita (menú oculto)
  //
  // QUÉ HACE EN CSS:
  // .header__nav.open { /* display: block; transform: slideDown(); */ }
  // El menú se despliega o se oculta
});

// ============================================
// PASO 3: Cerrar menú al tocar un enlace
// ============================================
// Cierra el nav al tocar un link
document.querySelectorAll(".header__nav a").forEach((link) => {
  // querySelectorAll busca TODOS los <a> dentro de .header__nav
  // Retorna una lista de elementos
  // .forEach itera sobre CADA uno de ellos

  link.addEventListener("click", () => {
    // Cuando el usuario hace clic en UNO DE ESTOS enlaces

    burger.classList.remove("open");
    // REMOVE = quita la clase "open" del botón burger
    // El icono vuelve del ✕ al ☰

    nav.classList.remove("open");
    // Quita la clase "open" del nav
    // El menú desaparece (se oculta)
  });
});

// ============================================
// PARA QUÉ SIRVE TODO ESTO:
// ============================================
// EJEMPLO 1: Usuario ve página en MÓVIL
// 1. Menú está OCULTO (clase open NO existe)
// 2. Usuario presiona ☰ hamburger
// 3. JS añade clase "open" a burger y nav
// 4. CSS muestra el menú desplegado
// 5. Usuario ve 4 enlaces: Inicio, Servicios, Nosotros, Contacto
// 6. Usuario presiona "Servicios"
// 7. JS quita clase "open" de burger y nav
// 8. Menú se OCULTA automáticamente
//
// SIN ESTE JavaScript:
// - El botón existiría pero NO haría nada al presionarlo
// - El menú estaría siempre visible o siempre oculto
// - Usuario no podría abrir/cerrar el menú en móvil
// - Mala experiencia: menú bloquearía pantalla pequeña
//
// ACCESIBILIDAD QUE FALTA:
// ⚠️ ERROR IMPORTANTE: El código NO actualiza aria-expanded
// En HTML: aria-expanded="false"
// Debería cambiar a: aria-expanded="true" cuando se abre, y "false" cuando se cierra
// Los lectores de pantalla no sabrían si el menú está abierto o cerrado
// SOLUCIÓN: Agregar:
// burger.setAttribute("aria-expanded", burger.classList.contains("open"));

// ============================================
// SECCIÓN 2: SLIDER/CARRUSEL DE PROYECTOS
// ============================================

// QUÉ HACE:
// Este bloque crea un carrusel interactivo que:
// 1. Muestra proyectos de forma rotativa
// 2. Permite navegar con botones anterior/siguiente
// 3. Permite navegar con dots (puntos) debajo
// 4. Avanza automáticamente cada 3.5 segundos
// 5. Muestra barra de progreso (se llena mientras espera)
// 6. Muestra contador "1 / 5", "2 / 5", etc.

// CORRELACIÓN CON HTML:
// En index.html existe:
// - <div class="slider" role="region" aria-label="Carrusel de proyectos realizados">
//   - <div class="slider__track" id="sliderTrack" aria-live="polite">
//     - 5 <div class="slider__slide"> (cada uno es un proyecto)
//   - <div class="slider__progress">
//   - <div class="slider__nav">
//     - <button id="sliderPrev"> (flecha izquierda)
//     - <div id="sliderDots"></div> (aquí insertamos los dots dinámicamente)
//     - <span id="sliderCounter"> (muestra "1 / 5")
//     - <button id="sliderNext"> (flecha derecha)

// ============================================
// PASO 1: Capturar referencias a elementos del slider
// ============================================
const track = document.getElementById("sliderTrack");
// El contenedor de slides que se DESLIZA horizontalmente
// CSS: display flex, cada slide 100% ancho
// JS lo moverá con transform translateX

const dotsContainer = document.getElementById("sliderDots");
// Contenedor VACÍO donde insertaremos los dots dinámicamente
// Cada dot es un <button> creado por JS

const counter = document.getElementById("sliderCounter");
// Elemento que muestra "1 / 5", "2 / 5", etc.
// Su textContent será actualizado por JS

const progressFill = document.getElementById("sliderProgress");
// Barra que se llena (ancho 0% → 100%) mientras espera siguiente slide
// Se anima linealmente en INTERVAL ms (3500ms = 3.5 segundos)

// ============================================
// PASO 2: Obtener información de los slides
// ============================================
const slides = track.querySelectorAll(".slider__slide");
// Busca TODOS los slides dentro del track
// Si hay 5 <div class="slider__slide">, slides.length = 5
// Útil: si cambias cantidad de slides en HTML, JS se adapta automáticamente

const total = slides.length;
// TOTAL = cantidad de slides
// Si HTML tiene 5 slides, total = 5
// Usado para modulo: (n + total) % total (permite "envolvimiento")

let current = 0;
// Índice del slide ACTUAL mostrado (0-4 para 5 slides)
// Comienza en 0 porque el primer slide es el primero
// Cambia cuando usuario navega

let timer;
// Variable que ALMACENARÁ el ID del setInterval
// Necesario para poder limpiarlo después (clearInterval)

const INTERVAL = 3500;
// Milisegundos que espera antes de NEXT slide automático
// 3500ms = 3.5 segundos
// Este valor se usa en:
// 1. setInterval para avanzar automáticamente
// 2. Animación de barra de progreso

console.log(`Carrusel iniciado: ${total} slides encontrados`);
// Debug: mensaje en consola para verificar que el carrusel se cargó

// ============================================
// PASO 3: Crear puntos (dots) dinámicamente
// ============================================
// QUÉ PASA AQUÍ:
// El HTML tiene <div id="sliderDots"></div> VACÍO
// Este código crea un <button> por cada slide y lo inserta

slides.forEach((_, i) => {
  // Itera sobre CADA slide
  // '_' = el slide actual (ignorado, no lo necesitamos)
  // 'i' = índice (0, 1, 2, 3, 4)

  const dot = document.createElement("button");
  // Crea un <button> NUEVO en memoria (NO en HTML aún)

  dot.classList.add("slider__dot");
  // Le añade clase CSS "slider__dot"
  // CSS: pequeño círculo, cursor pointer, etc.

  if (i === 0) dot.classList.add("active");
  // Si es el PRIMER dot (i === 0), añade clase "active"
  // CSS: hace que el primer dot se vea diferente (lleno, resaltado)

  dot.addEventListener("click", () => {
    // Cuando usuario HACE CLIC en este dot:

    goTo(i);
    // Salta al slide número 'i'
    // goTo(0) = muestra slide 1
    // goTo(1) = muestra slide 2
    // etc.

    resetTimer();
    // Reinicia el temporizador automático
    // Evita que JS pise al usuario mientras está interactuando
  });

  dotsContainer.appendChild(dot);
  // INSERTA el dot creado en el HTML
  // Ahora el usuario lo ve en la página
});

// RESULTADO EN HTML:
// Lo que ERA: <div id="sliderDots"></div>
// Lo que ES AHORA: <div id="sliderDots">
//                    <button class="slider__dot active"></button>
//                    <button class="slider__dot"></button>
//                    <button class="slider__dot"></button>
//                    <button class="slider__dot"></button>
//                    <button class="slider__dot"></button>
//                  </div>
//
// ⚠️ FALTA DE ACCESIBILIDAD:
// Los dots NO tienen role="tab" ni aria-selected
// Deberían tener:
// dot.setAttribute("role", "tab");
// dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
// Los lectores de pantalla no sabrían que son tabs

// ============================================
// PASO 4: Función CORE - goTo(n)
// ============================================
// Esta es LA FUNCIÓN más importante del carrusel
// Hace TRES cosas:
// 1. Calcula y actualiza el índice actual
// 2. Mueve visualmente el slider
// 3. Actualiza UI (dots, contador, barra)

function goTo(n) {
  // 'n' = índice del slide al que queremos ir (0-4)

  // PASO A: Cálculo CIRCULAR (envolvimiento)
  current = (n + total) % total;
  // FÓRMULA: (n + total) % total
  // EJEMPLO: total = 5
  //   goTo(0) → current = (0 + 5) % 5 = 0 ✓
  //   goTo(1) → current = (1 + 5) % 5 = 1 ✓
  //   goTo(4) → current = (4 + 5) % 5 = 4 ✓ (último slide)
  //   goTo(5) → current = (5 + 5) % 5 = 0 ✓ (vuelve al primero!)
  //   goTo(-1) → current = (-1 + 5) % 5 = 4 ✓ (retrocede al último!)
  //
  // IMPORTANTE: permite "envolvimiento circular"
  // Si User está en slide 5 y presiona NEXT → vuelve a slide 1
  // Si User está en slide 1 y presiona PREV → va a slide 5
  //
  // SIN ESTO:
  // goTo(-1) sería índice -1 (error, no existe)
  // goTo(5) intentaría acceder slide 5 (no existe, solo hay 0-4)

  // PASO B: MOVER VISUALMENTE el track
  track.style.transform = `translateX(-${current * 100}%)`;
  // CSS transform translateX: mueve elemento horizontalmente
  // El track es un flex container con 5 slides, cada uno 100% ancho
  //
  // EJEMPLO: total = 5 slides
  //   current = 0 → translateX(-0%) → muestra slide 1
  //   current = 1 → translateX(-100%) → muestra slide 2 (1 slide fuera de vista)
  //   current = 2 → translateX(-200%) → muestra slide 3 (2 slides fuera)
  //   current = 3 → translateX(-300%) → muestra slide 4
  //   current = 4 → translateX(-400%) → muestra slide 5
  //
  // Animation: CSS transition hace que sea smooth
  // (en style.css hay: .slider__track { transition: transform 0.5s ease; })

  // PASO C: ACTUALIZAR DOTS (puntos de navegación)
  document.querySelectorAll(".slider__dot").forEach((d, i) => {
    // Para CADA dot creado dinámicamente:

    d.classList.toggle("active", i === current);
    // Si 'i' es el slide actual, añade "active"
    // Si no, la quita
    // EJEMPLO: current = 2
    //   Dot 0: classList.toggle("active", false) → quita "active"
    //   Dot 1: classList.toggle("active", false) → quita "active"
    //   Dot 2: classList.toggle("active", true) → añade "active" ✓
    //   Dot 3: classList.toggle("active", false) → quita "active"
    //   Dot 4: classList.toggle("active", false) → quita "active"
    //
    // RESULTADO VISUAL: solo el dot 3 está resaltado (CSS lo hace más grande/coloreado)
  });

  // PASO D: ACTUALIZAR CONTADOR de texto
  counter.textContent = `${current + 1} / ${total}`;
  // EJEMPLO: current = 1, total = 5
  //   Texto: "2 / 5"
  // Se suma +1 porque usuarios ven "slide 1-5", no "slide 0-4" (índices internos)
  //
  // ACCESIBILIDAD:
  // Counter tiene aria-live="polite" en HTML
  // Cuando JS cambia textContent, lector de pantalla anuncia el cambio
  // Usuario ciego: "slide 2 de 5" (oye automáticamente)

  // PASO E: REINICIAR BARRA DE PROGRESO
  // La barra muestra paso de tiempo antes del siguiente slide automático

  progressFill.style.transition = "none";
  // QUITA la animación TEMPORALMENTE
  // Si no hiciéramos esto: la barra seguiría animando
  // Queremos resetear la barra, no continuar de donde estaba

  progressFill.style.width = "0%";
  // Pon barra en 0% (vacía)
  // Ahora mismo la barra está "salteada" sin animación (se ve instantáneo)

  setTimeout(() => {
    // Espera 30ms (casi instantáneo, imperceptible)
    // PROP\u00d3SITO: dar tiempo al navegador para procesar la línea anterior
    // Sin este setTimeout, la transición "none" y "linear" se solaparían

    progressFill.style.transition = `width ${INTERVAL}ms linear`;
    // AHORA sí: añade animación smooth durante INTERVAL ms
    // linear = velocidad constante (no acelera/desacelera)

    progressFill.style.width = "100%";
    // Anima la barra de 0% a 100% en 3500ms linealmente
    // Usuario ve: barra llena lentamente → cuando llega a 100%, siguiente slide
  }, 30);
}

// ============================================
// PASO 5: Funciones de temporizador
// ============================================

function resetTimer() {
  // Detiene y reinicia el automático
  // Se llama cuando usuario interactúa (click dot, next, prev)
  // PROP\u00d3SITO: evitar que JS pise al usuario

  clearInterval(timer);
  // Detiene el setInterval actual
  // Sin esto: seguiría avanzando cada 3.5s automáticamente
  // Usuario presiona dot → pero JS sigue avanzando → caos

  startAuto();
  // Reinicia el automático desde cero
  // Carrusel vuelve a avanzar automáticamente
  // Ahora el temporizador empieza "limpio"
}

function startAuto() {
  // Comienza el automático
  // Se llama al cargar la página y después de cada resetTimer()

  goTo(current);
  // Primero, asegura que el slide actual está bien posicionado
  // Útil al iniciar la página

  timer = setInterval(() => goTo(current + 1), INTERVAL);
  // Cada 3500ms (INTERVAL), llama goTo(current + 1)
  // Ejemplo:
  //   T=0s: goTo(0) → muestra slide 1
  //   T=3.5s: goTo(0 + 1) → goTo(1) → muestra slide 2
  //   T=7s: goTo(1 + 1) → goTo(2) → muestra slide 3
  //   T=10.5s: goTo(2 + 1) → goTo(3) → muestra slide 4
  //   ... y así
  //
  // El ID del setInterval se guarda en 'timer'
  // Necesario para poder hacer clearInterval(timer) después
}

// ============================================
// PASO 6: Botones de navegación manual
// ============================================

document.getElementById("sliderPrev").addEventListener("click", () => {
  // Cuando usuario presiona botón "anterior" (flecha izquierda)

  goTo(current - 1);
  // Retrocede un slide
  // EJEMPLO: current = 2 → goTo(1) → muestra slide anterior
  // SIN módulo: si current = 0 → goTo(-1) → ERROR
  // CON módulo (en goTo): goTo(-1) → (-1 + 5) % 5 = 4 → slide último ✓

  resetTimer();
  // Reinicia el temporizador automático
  // Así el carrusel no pisa mientras el usuario navega
});

document.getElementById("sliderNext").addEventListener("click", () => {
  // Cuando usuario presiona botón "siguiente" (flecha derecha)

  goTo(current + 1);
  // Avanza un slide
  // EJEMPLO: current = 2 → goTo(3) → muestra slide siguiente
  // SIN módulo: si current = 4 → goTo(5) → ERROR
  // CON módulo: goTo(5) → (5 + 5) % 5 = 0 → slide primero ✓

  resetTimer();
  // Reinicia el temporizador automático
});

// ============================================
// PASO 7: Iniciar el carrusel
// ============================================

startAuto();
// Se ejecuta cuando carga la página
// El carrusel comienza automáticamente
// SIN ESTO: los slides estarían quietos, nunca avanzarían
// RESULTADO:
// 1. goTo(0) → muestra slide 1
// 2. setInterval comienza → cada 3.5s avanza un slide
// 3. Barra de progreso se anima
// 4. Usuario puede clickear dots/botones para controlar

// ============================================
// SECCIÓN 3: FORMULARIO Y ENVÍO POR WHATSAPP
// ============================================

// QUÉ HACE:
// Este bloque maneja el formulario de cotización.
// Captura los datos del usuario, los organiza, y abre WhatsApp con un mensaje pre-rellenado.

// CORRELACIÓN CON HTML:
// En index.html existe:
// <form class="contacto__form" onsubmit="enviarWhatsapp(event)" aria-label="Formulario de cotización">
//   <input type="text" id="nombre">
//   <input type="tel" id="telefono">
//   <input type="email" id="email">
//   <select id="servicio">
//   <textarea id="mensaje">
//   <button type="submit">
// </form>
//
// FLUJO:
// 1. Usuario completa campos y presiona "Enviar"
// 2. HTML dispara evento "submit"
// 3. onsubmit="enviarWhatsapp(event)" llama esta función
// 4. JS captura los datos, arma mensaje, abre WhatsApp

function enviarWhatsapp(event) {
  // 'event' = objeto que contiene información del evento "submit"

  // ============================================
  // PASO 1: Prevenir comportamiento por defecto
  // ============================================

  event.preventDefault();
  // IMPORTANTE: detiene el envío tradicional de formulario
  // SIN esto:
  //   - Formulario se enviaría a un servidor (no queremos eso)
  //   - Página se recargaría
  //   - Usuario perdería el contexto
  // CON esto:
  //   - Tomamos control manualmente
  //   - Abrimos WhatsApp con datos pre-rellenados
  //   - Página no se recarga, experiencia fluida

  // ============================================
  // PASO 2: Capturar valores del formulario
  // ============================================

  const nombre = document.getElementById("nombre").value;
  // Busca <input id="nombre">
  // .value lee lo que el usuario escribió
  // EJEMPLO: usuario escribió "Juan" → nombre = "Juan"

  const telefono = document.getElementById("telefono").value;
  // Lee el teléfono
  // EJEMPLO: "+52 449 906 1873" → telefono = "+52 449 906 1873"

  const email = document.getElementById("email").value;
  // Lee el email
  // EJEMPLO: "juan@gmail.com" → email = "juan@gmail.com"

  const servicio = document.getElementById("servicio").value;
  // Lee la opción <select> elegida
  // EJEMPLO: usuario seleccionó "Balconería" → servicio = "balconeria"

  const mensaje = document.getElementById("mensaje").value;
  // Lee el texto del <textarea> (descripción del proyecto)
  // EJEMPLO: "Necesito barandal para casa" → mensaje = "Necesito barandal para casa"

  // ============================================
  // PASO 3: Armar mensaje formateado
  // ============================================
  if (
    !nombre.trim() ||
    !telefono.trim() ||
    !email.trim() ||
    !servicio ||
    !mensaje.trim()
  ) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const texto = `Hola, soy ${nombre}.
Teléfono: ${telefono}
Correo: ${email}
Servicio: ${servicio}
Proyecto: ${mensaje}`;

  // Template literal (backticks ``):
  // Permite multi-línea y interpolación ${variable}
  //
  // RESULTADO EJEMPLO (si usuario escribió):
  // Nombre: "Juan García"
  // Teléfono: "+52 449 906 1873"
  // Email: "juan@example.com"
  // Servicio: "balconeria"
  // Mensaje: "Necesito barandal residencial"
  //
  // El texto sería:
  // "Hola, soy Juan García.
  // Teléfono: +52 449 906 1873
  // Correo: juan@example.com
  // Servicio: balconeria
  // Proyecto: Necesito barandal residencial"
  //
  // Este formato es LEGIBLE y PROFESIONAL
  // Cuando se abre en WhatsApp, se ve bien estructurado

  // ============================================
  // PASO 4: Crear URL de WhatsApp
  // ============================================

  const url = `https://wa.me/524499061873?text=${encodeURIComponent(texto)}`;

  // wa.me/NÚMERO?text=MENSAJE:
  // Protocolo especial de WhatsApp
  // 524499061873 = número de GPV (sin + ni espacios)
  //
  // encodeURIComponent(texto):
  // IMPORTANTE: convierte caracteres especiales para URL segura
  // EJEMPLO: espacios → %20, saltos de línea → %0A, etc.
  // SIN esto: saltos de línea se perderían, mensaje sería una línea
  // CON esto: mensaje mantiene formato y se ve bien
  //
  // RESULTADO URL EJEMPLO:
  // https://wa.me/524499061873?text=Hola%2C%20soy%20Juan%20Garc%C3%ADa.%0ATel%C3%A9fono%3A%20...
  // Se ve feo en barra de direcciones pero WhatsApp lo decodifica perfectamente

  // ============================================
  // PASO 5: Abrir WhatsApp
  // ============================================

  window.open(url, "_blank");
  // window.open(url, target):
  // Abre una nueva ventana/pestaña con la URL
  //
  // "_blank" = NUEVA PESTAÑA
  // Alternativas:
  //   "_self" = misma pestaña (usuario abandona tu sitio)
  //   "_blank" = nueva pestaña (usuario puede volver a tu sitio) ✓ MEJOR
  //
  // FLUJO FINAL:
  // 1. URL se abre en nueva pestaña
  // 2. Si usuario tiene WhatsApp Web → abre WhatsApp Web
  // 3. Si tiene app → la abre
  // 4. Mensaje aparece PRE-RELLENADO
  // 5. Usuario solo presiona "Enviar"
  //
  // VENTAJA: usuario no tiene que escribir reseña, datos ya están
  // Aumenta probabilidad de que termine el mensaje y lo envíe

  // ============================================
  // QUÉ PASARÍA SIN ESTE JavaScript:
  // ============================================
  // 1. Sin preventDefault: formulario se enviaría a servidor (no existe)
  //    → Error 404 o comportamiento inesperado
  // 2. Sin captura de datos: no habría información para enviar
  // 3. Sin encodeURIComponent: mensajes con saltos de línea se rompen
  // 4. Sin window.open: nada sucedería al presionar enviar
  //    → Usuario frustrado, no sabe si funcionó

}
