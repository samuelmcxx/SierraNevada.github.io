/* ════════════════════════════════════════════════════════════
   SIERRA NEVADA DE SANTA MARTA — Animaciones e Interactividad
   script.js
   ════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────
   1. PANTALLA DE CARGA
   ────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('done');
  }, 1800);
});


/* ──────────────────────────────────────────
   2. MODO CLARO / OSCURO
   ────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});


/* ──────────────────────────────────────────
   3. MENÚ HAMBURGUESA (móvil)
   ────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


/* ──────────────────────────────────────────
   4. BARRA DE PROGRESO DE LECTURA
   ────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ──────────────────────────────────────────
   5. CURSOR GLOW (sigue el mouse)
   ────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});


/* ──────────────────────────────────────────
   6. PARALLAX EN EL HERO (montaña)
   ────────────────────────────────────────── */
const heroMountain = document.getElementById('heroMountain');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroMountain.style.transform = `translateY(${y * 0.3}px)`;
  }
}, { passive: true });


/* ──────────────────────────────────────────
   7. NAV: se encoge al hacer scroll
   ────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.style.height = window.scrollY > 60 ? '56px' : '68px';
}, { passive: true });


/* ──────────────────────────────────────────
   8. PARTÍCULAS FLOTANTES (canvas)
   ────────────────────────────────────────── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const EMOJIS = ['', '🌿', '', '', '', '', '', ''];

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x         = Math.random() * canvas.width;
    this.y         = Math.random() * canvas.height;
    this.size      = Math.random() * 12 + 6;
    this.speedY    = -(Math.random() * 0.4 + 0.1);
    this.speedX    = (Math.random() - 0.5) * 0.3;
    this.opacity   = Math.random() * 0.4 + 0.1;
    this.emoji     = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    this.angle     = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.01;
  }

  update() {
    this.y     += this.speedY;
    this.x     += this.speedX;
    this.angle += this.angleSpeed;
    this.opacity += (Math.random() - 0.5) * 0.01;
    this.opacity  = Math.max(0.05, Math.min(0.5, this.opacity));
    if (this.y < -50) this.reset();
    if (this.x < -50 || this.x > canvas.width + 50) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha   = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.font          = `${this.size}px serif`;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

const particles = [];
for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ──────────────────────────────────────────
   9. REVEAL EN SCROLL (IntersectionObserver)
   ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const numEl = entry.target.querySelector('[data-target]');
      if (numEl && !numEl.dataset.animated) {
        animateCounter(numEl);
        numEl.dataset.animated = '1';
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* ──────────────────────────────────────────
   10. LÍNEA DE TIEMPO — reveal individual
   ────────────────────────────────────────── */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
  timelineObserver.observe(item);
});


/* ──────────────────────────────────────────
   11. BARRAS DE SEVERIDAD (amenazas)
   ────────────────────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.severity-fill').forEach(bar => {
        if (!bar.dataset.animated) {
          setTimeout(() => { bar.style.width = bar.dataset.width; }, 400);
          bar.dataset.animated = '1';
        }
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.threat-card').forEach(card => {
  barObserver.observe(card);
});


/* ──────────────────────────────────────────
   12. CONTADOR ANIMADO DE ESTADÍSTICAS
   ────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('es-CO');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/* ──────────────────────────────────────────
   13. MAPA — Activar card seleccionada
   ────────────────────────────────────────── */
function activateMapCard(card) {
  document.querySelectorAll('.map-point-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}

document.querySelectorAll('.map-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const zone = dot.dataset.zone;
    const card = document.querySelector(`.map-point-card[data-zone="${zone}"]`);
    if (card) activateMapCard(card);
  });
});


/* ──────────────────────────────────────────
   14. MODAL — Datos de cada tarjeta de biodiversidad
   ────────────────────────────────────────── */
const modalData = {
  fauna1: {
    emoji: '',
    title: 'Aves Endémicas de la Sierra Nevada',
    desc:  'La Sierra Nevada de Santa Marta es uno de los lugares con mayor diversidad de fauna endémica del mundo. Debido a su aislamiento geográfico y a la variedad de ecosistemas que posee, alberga especies que **solo se encuentran de forma natural en esta región**. Entre ellas destacan el **Paujil de Pico Azul (Crax alberti)**, la **Reinita de Santa Marta (Myiothlypis basilica)**, el **Colibrí de Santa Marta (Aglaiocercus astreans)** y el **Periquito de Santa Marta (Pyrrhura viridicata)**. Estas especies hacen de la Sierra Nevada un territorio único y de gran importancia para la conservación de la biodiversidad de Colombia.',
    facts: [
      ['Especies de aves',   '628+'],
      ['Endémicas',          '60+'],
      ['En peligro crítico', '8'],
      ['Rango de altitud',   '0–5.000 m']
    ]
  },
  fauna2: {
    image: '',
    title: 'Mamíferos de la Sierra Nevada',
    desc:  'La Sierra Nevada de Santa Marta alberga una gran diversidad de mamíferos, adaptados a sus diferentes ecosistemas y alturas. Entre ellos se encuentran el jaguar (Panthera onca), el puma (Puma concolor), el venado de páramo (Mazama rufina), el mono aullador rojo (Alouatta seniculus) y el coatí (Nasua nasua). Estas especies cumplen funciones importantes en el ecosistema, como controlar poblaciones de otras especies, dispersar semillas y contribuir al equilibrio de los bosques. Algunas enfrentan amenazas como la pérdida de hábitat, la cacería y la fragmentación de los ecosistemas, por lo que su conservación es fundamental para mantener la biodiversidad de la Sierra Nevada.',
    facts: [
      ['Mamíferos registrados', '130+'],
      ['Carnívoros apex',       '4'],
      ['En peligro',           '22 sp.'],
      ['Endémicos',             '9']
    ]
  },
  flora1: {
    emoji: '',
    title: 'Orquídeas y Bromelias',
    desc:  'La Sierra Nevada concentra una de las mayores diversidades de orquídeas del mundo: más de 600 especies, muchas descubiertas en los últimos 30 años. Las bromelias actúan como micro-ecosistemas: sus rosetas acumulan agua donde viven ranas, insectos y microorganismos únicos. La orquídea Cattleya trianae, flor nacional de Colombia, tiene aquí poblaciones silvestres amenazadas.',
    facts: [
      ['Orquídeas',       '600+'],
      ['Bromelias',       '400+'],
      ['Helechos',        '320+'],
      ['Musgos/líquenes', '800+']
    ]
  },
  flora2: {
    emoji: '',
    title: 'Bosques de Niebla',
    desc:  'Entre los 2.000 y 3.500 m.s.n.m., la niebla constante crea un mundo donde cada centímetro está cubierto de musgos, líquenes y epífitas. Estos bosques son los principales captadores de agua: la niebla "peinada" por el follaje aporta hasta el 40 % del agua de los ríos que abastecen la región Caribe. Su desaparición equivale a destruir los acueductos naturales de toda la costa norte colombiana.',
    facts: [
      ['Captación extra de agua', '40 %'],
      ['Temperatura',             '8–15 °C'],
      ['Precipitación',           '2.000–4.000 mm/año'],
      ['Estado de conservación',  'Vulnerable']
    ]
  },
  eco1: {
    emoji: '',
    title: 'Glaciares Tropicales',
    desc:  'Los picos Simón Bolívar y Cristóbal Colón, a 5.775 m.s.n.m., albergan los únicos glaciares tropicales de Colombia. En el último siglo, el volumen glaciar se ha reducido más del 70 % por el calentamiento global. Son termómetros naturales del cambio climático y reservorios de agua dulce que alimentan los ríos en épocas de sequía. Su desaparición proyectada para 2070 representa una crisis hídrica para la región.',
    facts: [
      ['Altura máxima',        '5.775 m.s.n.m.'],
      ['Reducción glaciar',    '70 % en 100 años'],
      ['Proyección extinción', '~2070'],
      ['Calentamiento',        '+0.3 °C/década']
    ]
  },
  eco2: {
    emoji: '',
    title: 'Sistemas Hídricos',
    desc:  'Treinta y seis cuencas hidrográficas nacen en las laderas de la Sierra Nevada. Este sistema abastece de agua potable a más de 1.5 millones de personas en Magdalena, Cesar y La Guajira. Los páramos y bosques de niebla actúan como esponjas que regulan el caudal durante todo el año, evitando inundaciones en invierno y garantizando agua en verano.',
    facts: [
      ['Ríos principales',      '36'],
      ['Personas beneficiadas', '1.5 millones'],
      ['Precipitación media',   '1.500–4.000 mm'],
      ['Cuencas aportantes',    '3 departamentos']
    ]
  }
};

function openModal(id) {
  const data = modalData[id];
  if (!data) return;

  const factsHTML = data.facts
    .map(([label, value]) =>
      `<div class="modal-fact"><span>${label}</span><strong>${value}</strong></div>`
    ).join('');

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-image">${data.image}</div>
    <h2>${data.title}</h2>
    <p>${data.desc}</p>
    <div class="modal-facts">${factsHTML}</div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  const overlay = document.getElementById('modalOverlay');
  if (!e || e.target === overlay || e.target.classList.contains('modal-close')) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ──────────────────────────────────────────
   15. MICROINTERACCIONES — hover en stat cards
   ────────────────────────────────────────── */
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.stat-icon');
    icon.style.transform  = 'scale(1.2)';
    icon.style.transition = 'transform 0.2s ease';
  });
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.stat-icon');
    icon.style.transform = 'scale(1)';
  });
});


/* ──────────────────────────────────────────
   16. SMOOTH SCROLL (refuerzo navegadores)
   ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────
   17. GALERÍA — Filtros y vistas
   ────────────────────────────────────────── */

// ── AGREGA O EDITA TUS FOTOS AQUÍ ──────────────────────────────────────────
// img: ruta a tu foto (ej: "img/paujil.jpg")  →  "" si aún no tienes foto
// cat: "aves" | "flora" | "fauna" | "paisaje" | "acuatico"
const GALLERY_ITEMS = [
  { title: 'Picos Nevados', desc: '5.775 m.s.n.m.', cat: 'paisaje', img: 'img/picos.jpg', icon: '🏔️' },
  { title: 'Paujil de Pico Azul', desc: 'Crax alberti', cat: 'aves', img: 'img/pauji.webp', icon: '🦜' },
  { title: 'Selva Tropical', desc: 'Bosque húmedo primario', cat: 'paisaje', img: 'img/selva.webp', icon: '🌳' },

  { title: 'Jaguar', desc: 'Panthera onca', cat: 'fauna', img: 'img/jaguar.jpg', icon: '🐆' },
  { title: 'Puma', desc: 'Puma concolor', cat: 'fauna', img: 'img/puma.webp', icon: '🐈' },
  { title: 'Ocelote', desc: 'Leopardus pardalis', cat: 'fauna', img: 'img/ocelote.webp', icon: '🐆' },
  { title: 'Tigrillo', desc: 'Leopardus wiedii', cat: 'fauna', img: 'img/tigrillo.webp', icon: '🐈' },
  { title: 'Mono Aullador Rojo', desc: 'Alouatta seniculus', cat: 'fauna', img: 'img/mono-aullador-rojo.webp', icon: '🐒' },
  { title: 'Coatí', desc: 'Nasua nasua', cat: 'fauna', img: 'img/Coatí.webp', icon: '🦝' },
  { title: 'Pacarana', desc: 'Dinomys branickii', cat: 'fauna', img: 'img/pacarana.webp', icon: '🐀' },
  { title: 'Venado de Páramo', desc: 'Mazama rufina', cat: 'fauna', img: 'img/venado-paramo.webp', icon: '🦌' },
  { title: 'Danta', desc: 'Tapirus terrestris', cat: 'fauna', img: 'img/danta.webp', icon: '🦣' },
  { title: 'Oso Hormiguero', desc: 'Myrmecophaga tridactyla', cat: 'fauna', img: 'img/oso-hormiguero.webp', icon: '🐜' },
  { title: 'Rana Arlequín de Santa Marta', desc: 'Atelopus laetissimus', cat: 'fauna', img: 'img/rana-arlequin-santa-marta.webp', icon: '🐸' },
  { title: 'Rana de Santa Marta', desc: 'Tachiramantis tayrona', cat: 'fauna', img: 'img/rana-santa-marta.webp', icon: '🐸' },
  { title: 'Periquito de Santa Marta', desc: 'Pyrrhura viridicata', cat: 'aves', img: 'img/periquito-santa-marta.webp', icon: '🦜' },
  { title: 'Arañero de Santa Marta', desc: 'Myiothlypis basilica', cat: 'aves', img: 'img/aranero-santa-marta.webp', icon: '🐦' },
  { title: 'Tororoi de Santa Marta', desc: 'Grallaria bangsi', cat: 'aves', img: 'img/tororoi-santa-marta.webp', icon: '🐦' },
  { title: 'Colibrí de Santa Marta', desc: 'Campylopterus phainopeplus', cat: 'aves', img: 'img/colibri-santa-marta.webp', icon: '🐦' },
  { title: 'Orquídeas', desc: '600+ especies registradas', cat: 'flora', img: 'img/orquidea.jpg', icon: '🌸' },
  { title: 'Palma de Cera', desc: 'Árbol nacional de Colombia', cat: 'flora', img: 'img/palma-cera.webp', icon: '🌿' },
  { title: 'Bromelia', desc: 'Familia Bromeliaceae', cat: 'flora', img: 'img/bromelia.webp', icon: '🌺' },
  { title: 'Cascada Don Diego', desc: 'Río Don Diego', cat: 'acuatico', img: 'img/a.webp', icon: '💦' },
  { title: 'Rana Arlequín Arsyecue', desc: 'Atelopus arsyecue', cat: 'fauna', img: 'img/atelopus-arsyecue.webp', icon: '🐸' },
  { title: 'Rana Arlequín de Carriker', desc: 'Atelopus carrikeri', cat: 'fauna', img: 'img/atelopus-carrikeri.webp', icon: '🐸' },
  { title: 'Rana Arlequín Nahuma', desc: 'Atelopus nahumae', cat: 'fauna', img: 'img/atelopus-nahumae.webp', icon: '🐸' },
  { title: 'Rana Arlequín de Walker', desc: 'Atelopus walkeri', cat: 'fauna', img: 'img/atelopus-walkeri.webp', icon: '🐸' },
  { title: 'Salamandra de Santa Marta', desc: 'Bolitoglossa savagei', cat: 'fauna', img: 'img/bolitoglossa-savagei.webp', icon: '🦎' },
  { title: 'Rana Cohete de Ruthven', desc: 'Colostethus ruthveni', cat: 'fauna', img: 'img/colostethus-ruthveni.webp', icon: '🐸' },
  { title: 'Rana Marsupial de Boulenger', desc: 'Cryptobatrachus boulengeri', cat: 'fauna', img: 'img/cryptobatrachus-boulengeri.webp', icon: '🐸' },
  { title: 'Rana Marsupial de Ruthven', desc: 'Cryptobatrachus ruthveni', cat: 'fauna', img: 'img/cryptobatrachus-ruthveni.webp', icon: '🐸' },
  { title: 'Rana de la Sierra de Walker', desc: 'Geobatrachus walkeri', cat: 'fauna', img: 'img/geobatrachus-walkeri.webp', icon: '🐸' },
  { title: 'Rana de Cristal de Santa Marta', desc: 'Ikakogi tayrona', cat: 'fauna', img: 'img/ikakogi-tayrona.webp', icon: '🐸' },
  { title: 'Rana de Lluvia de Carmelita', desc: 'Pristimantis carmelitae', cat: 'fauna', img: 'img/pristimantis-carmelitae.webp', icon: '🐸' },
  { title: 'Rana de Lluvia de Cristina', desc: 'Pristimantis cristinae', cat: 'fauna', img: 'img/pristimantis-cristinae.webp', icon: '🐸' },
  { title: 'Rana de Lluvia de la Sierra', desc: 'Pristimantis insignitus', cat: 'fauna', img: 'img/pristimantis-insignitus.webp', icon: '🐸' },
  { title: 'Rana de Lluvia de Ruthven', desc: 'Pristimantis ruthveni', cat: 'fauna', img: 'img/pristimantis-ruthveni.webp', icon: '🐸' },
  { title: 'Rana de Lluvia de Santa Marta', desc: 'Pristimantis sanctaemartae', cat: 'fauna', img: 'img/pristimantis-sanctaemartae.webp', icon: '🐸' },
  { title: 'Rana de Lluvia Tayrona', desc: 'Pristimantis tayrona', cat: 'fauna', img: 'img/pristimantis-tayrona.webp', icon: '🐸' },
  { title: 'Lagarto de Santa Marta', desc: 'Lepidoblepharis miyatai', cat: 'fauna', img: 'img/lepidoblepharis-miyatai.webp', icon: '🦎' },
  { title: 'Geco de Santa Marta', desc: 'Pseudogonatodes furvus', cat: 'fauna', img: 'img/pseudogonatodes-furvus.webp', icon: '🦎' },
  { title: 'Geco de Heliconia', desc: 'Sphaerodactylus heliconiae', cat: 'fauna', img: 'img/sphaerodactylus-heliconiae.webp', icon: '🦎' },
  { title: 'Anolis de Santa Marta', desc: 'Anolis santamartae', cat: 'fauna', img: 'img/anolis-santamartae.webp', icon: '🦎' },
  { title: 'Chamicero de Santa Marta', desc: 'Synallaxis fuscorufa', cat: 'aves', img: 'img/chamicero-santa-marta.webp', icon: '🐦' },
  { title: 'Tapaculo de Santa Marta', desc: 'Scytalopus sanctaemartae', cat: 'aves', img: 'img/tapaculo-santa-marta.webp', icon: '🐦' }
];
// ────────────────────────────────────────────────────────────────────────────

const CAT_LABELS = {
  aves: 'Aves', flora: 'Flora', fauna: 'Fauna',
  paisaje: 'Paisaje', acuatico: 'Acuático'
};

let currentCat  = 'all';
let currentView = 'grid';

function renderGrid(items) {
  document.getElementById('gallery-grid').innerHTML = items.map(item => `
    <div class="gallery-card">
      ${item.img
        ? `<img class="gallery-card-img" src="${item.img}" alt="${item.title}"
               onerror="this.outerHTML='<div class=gallery-card-placeholder>${item.icon}</div>'">`
        : `<div class="gallery-card-placeholder">${item.icon}</div>`
      }
      <div class="gallery-card-info">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <span class="gallery-badge badge-${item.cat}">${CAT_LABELS[item.cat]}</span>
      </div>
    </div>
  `).join('');
}

function renderList(items) {
  document.getElementById('gallery-list').innerHTML = items.map(item => `
    <div class="gallery-list-row">
      <div class="gallery-list-thumb">
        ${item.img
          ? `<img src="${item.img}" alt="${item.title}"
                 onerror="this.outerHTML='${item.icon}'">`
          : item.icon
        }
      </div>
      <div class="gallery-list-text">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
      <span class="gallery-badge badge-${item.cat}">${CAT_LABELS[item.cat]}</span>
    </div>
  `).join('');
}

function updateGallery() {
  const filtered = currentCat === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.cat === currentCat);

  document.getElementById('gallery-count').textContent =
    filtered.length + ' foto' + (filtered.length !== 1 ? 's' : '');

  const gGrid  = document.getElementById('gallery-grid');
  const gList  = document.getElementById('gallery-list');
  const gEmpty = document.getElementById('gallery-empty');

  if (filtered.length === 0) {
    gGrid.style.display  = 'none';
    gList.style.display  = 'none';
    gEmpty.style.display = 'block';
    return;
  }

  gEmpty.style.display = 'none';

  if (currentView === 'grid') {
    gGrid.style.display = 'grid';
    gList.style.display = 'none';
    renderGrid(filtered);
  } else {
    gList.style.display = 'flex';
    gGrid.style.display = 'none';
    renderList(filtered);
  }
}

document.getElementById('gallery-filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = btn.dataset.cat;
  updateGallery();
});

document.getElementById('btn-grid').addEventListener('click', () => {
  currentView = 'grid';
  document.getElementById('btn-grid').classList.add('active');
  document.getElementById('btn-list').classList.remove('active');
  updateGallery();
});

document.getElementById('btn-list').addEventListener('click', () => {
  currentView = 'list';
  document.getElementById('btn-list').classList.add('active');
  document.getElementById('btn-grid').classList.remove('active');
  updateGallery();
});

updateGallery();


/* ═══════════════════════════════════════
   11. QUIZ EDUCATIVO
═══════════════════════════════════════ */
const quizData = [
  {
    question: '¿Cuál es la montaña costera más alta del mundo?',
    options: ['El Kilimanjaro', 'La Sierra Nevada de Santa Marta', 'El Monte Fuji', 'Los Alpes Suizos'],
    correct: 1,
    feedback: 'Correcto: en solo 42 km pasa del mar Caribe a los 5.775 m de altitud.'
  },
  {
    question: '¿Cómo se le llama a una especie que solo existe en un lugar del mundo?',
    options: ['Migratoria', 'Invasora', 'Endémica', 'Silvestre'],
    correct: 2,
    feedback: 'Correcto: una especie endémica existe de forma natural únicamente en una región determinada.'
  },
  {
    question: '¿En qué año la UNESCO declaró a la Sierra Nevada Reserva de la Biosfera?',
    options: ['1964', '1979', '2000', '2010'],
    correct: 1,
    feedback: 'Correcto: fue declarada Reserva de la Biosfera en 1979.'
  },
  {
    question: '¿Cuál es una de las principales amenazas para los glaciares de la Sierra?',
    options: ['La sobrepesca', 'El cambio climático', 'Los terremotos', 'La minería submarina'],
    correct: 1,
    feedback: 'Correcto: el calentamiento global contribuye al retroceso de los glaciares.'
  },
  {
    question: '¿Qué significa "Corazón del Mundo" para los pueblos indígenas de la Sierra?',
    options: ['Es solo un nombre turístico', 'Creen que cuidarla es cuidar el equilibrio del planeta', 'Es el centro geográfico de Colombia', 'Es donde se fundó la primera ciudad'],
    correct: 1,
    feedback: 'Correcto: la Sierra tiene un profundo significado espiritual y cultural para estos pueblos.'
  },
  {
    question: '¿Cuál es la altitud máxima indicada para los picos Simón Bolívar y Cristóbal Colón?',
    options: ['3.500 m', '4.200 m', '5.775 m', '6.800 m'],
    correct: 2,
    feedback: 'Correcto: los dos picos aparecen en el contenido con una altitud de 5.775 m.s.n.m.'
  },
  {
    question: '¿Cuántas cuencas hidrográficas se mencionan en la página?',
    options: ['12', '24', '36', '50'],
    correct: 2,
    feedback: 'Correcto: la página menciona 36 cuencas hidrográficas.'
  },
  {
    question: '¿Qué ecosistema se caracteriza por la presencia constante de niebla entre aproximadamente 2.000 y 3.500 m?',
    options: ['Bosque de niebla', 'Desierto', 'Manglar', 'Sabana'],
    correct: 0,
    feedback: 'Correcto: los bosques de niebla se encuentran en ese rango de altitud.'
  },
  {
    question: '¿Cuál de estas especies aparece en la galería como ave de la Sierra Nevada?',
    options: ['Periquito de Santa Marta', 'Oso hormiguero', 'Jaguar', 'Danta'],
    correct: 0,
    feedback: 'Correcto: el Periquito de Santa Marta aparece en la galería.'
  },
  {
    question: '¿Cuál de estos animales aparece como mamífero de la Sierra Nevada?',
    options: ['Jaguar', 'Cóndor de los Andes', 'Rana arlequín', 'Colibrí'],
    correct: 0,
    feedback: 'Correcto: el jaguar aparece entre los mamíferos descritos.'
  }
];

let quizIndex = 0;
let quizScore = 0;

const quizQuestionsEl = document.getElementById('quizQuestions');
const quizProgressText = document.getElementById('quizProgressText');
const quizProgressFill = document.getElementById('quizProgressFill');
const quizResultEl = document.getElementById('quizResult');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultText = document.getElementById('quizResultText');
const quizRestartBtn = document.getElementById('quizRestartBtn');

function renderQuizQuestion() {
  const q = quizData[quizIndex];
  quizProgressText.textContent = `Pregunta ${quizIndex + 1} de ${quizData.length}`;
  quizProgressFill.style.width = `${(quizIndex / quizData.length) * 100 + (100 / quizData.length)}%`;

  quizQuestionsEl.innerHTML = `
    <div class="quiz-question">
      <h3>${q.question}</h3>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join('')}
      </div>
      <div class="quiz-feedback-slot"></div>
    </div>
  `;

  quizQuestionsEl.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(btn, q));
  });
}

function handleQuizAnswer(btn, q) {
  const chosenIndex = parseInt(btn.dataset.index, 10);
  const allBtns = quizQuestionsEl.querySelectorAll('.quiz-option');

  allBtns.forEach(b => b.disabled = true);

  if (chosenIndex === q.correct) {
    btn.classList.add('correct');
    quizScore++;
  } else {
    btn.classList.add('incorrect');
    allBtns[q.correct].classList.add('correct');
  }

  const slot = quizQuestionsEl.querySelector('.quiz-feedback-slot');
  slot.innerHTML = `
    <div class="quiz-feedback">${q.feedback}</div>
    <button class="btn-primary quiz-next-btn" id="quizNextBtn">
      ${quizIndex === quizData.length - 1 ? 'Ver resultado' : 'Siguiente pregunta →'}
    </button>
  `;

  document.getElementById('quizNextBtn').addEventListener('click', () => {
    quizIndex++;
    if (quizIndex < quizData.length) {
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  });
}

function showQuizResult() {
  quizProgressFill.style.width = '100%';
  quizQuestionsEl.innerHTML = '';
  quizResultEl.style.display = 'block';

  let title, text;
  if (quizScore === quizData.length) {
    title = '¡Excelente! Puntaje perfecto 🏆';
    text = `Respondiste correctamente las ${quizData.length} preguntas. Conoces muy bien la Sierra Nevada de Santa Marta.`;
  } else if (quizScore >= quizData.length / 2) {
    title = '¡Buen trabajo!';
    text = `Acertaste ${quizScore} de ${quizData.length} preguntas. Vas por buen camino, repasa la página para reforzar lo que falta.`;
  } else {
    title = 'Sigue explorando la página';
    text = `Acertaste ${quizScore} de ${quizData.length} preguntas. Vuelve a leer las secciones de arriba y vuelve a intentarlo.`;
  }
  quizResultTitle.textContent = title;
  quizResultText.textContent = text;
}

quizRestartBtn.addEventListener('click', () => {
  quizIndex = 0;
  quizScore = 0;
  quizResultEl.style.display = 'none';
  renderQuizQuestion();
});

if (quizQuestionsEl) {
  renderQuizQuestion();
}