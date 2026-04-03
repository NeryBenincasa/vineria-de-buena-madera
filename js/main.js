/* ============================================================
   De Buena Madera — main.js
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   CLUB DBM — ACTUALIZAR MENSUALMENTE
   Cambiá los precios, el vino y la bodega acá abajo.
   El resto de la página se actualiza solo.
   ────────────────────────────────────────────────────────────── */
const BODEGA_DEL_MES = {
  nombre: 'Manos Negras',
  imagen: 'imagenes/BENEFICIOS DBM/BODEGA DEL MES.jpg'
};

const PLANES_CLUB = [
  {
    nombre: 'Standard',
    precio: '$27.000',
    descripcion: 'Llevate tres botellas de',
    vino: 'Manos Negras Varietal',
    imagen: 'imagenes/BENEFICIOS DBM/CUOTA STANDAR.jpg',
    destacado: false
  },
  {
    nombre: 'Premium',
    precio: '$38.000',
    descripcion: 'Llevate tres botellas de',
    vino: 'Manos Negras Soil',
    imagen: 'imagenes/BENEFICIOS DBM/CUOTA PREMIUM.jpg',
    destacado: true
  },
  {
    nombre: 'Alta Gama',
    precio: '$61.000',
    descripcion: 'Llevate tres botellas de',
    vino: 'Manos Negras Artesano',
    imagen: 'imagenes/BENEFICIOS DBM/CUOTA ALTA GAMA.jpg',
    destacado: false
  }
];

/* Número de WhatsApp para el formulario (formato internacional sin +) */
const WA_NUMBER = '5493414250202';

/* ============================================================
   NAV — scroll effect + mobile toggle
   ============================================================ */
const navbar  = document.getElementById('navbar');
const waFloat = document.querySelector('.wa-float');
window.addEventListener('scroll', () => {
  const heroH = document.getElementById('hero')?.offsetHeight ?? 400;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  if (waFloat) waFloat.classList.toggle('visible', window.scrollY > heroH * 0.6);
});

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
});

/* Cerrar menú al hacer clic en un link */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ============================================================
   SMOOTH SCROLL para links internos
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   CLUB DBM — render bodega del mes + planes
   ============================================================ */
function renderBodega() {
  const img  = document.getElementById('bodega-img');
  const nom  = document.getElementById('bodega-nombre');
  if (img) img.src = BODEGA_DEL_MES.imagen;
  if (nom) nom.textContent = BODEGA_DEL_MES.nombre;
}

function renderPlanes() {
  const grid = document.getElementById('planes-grid');
  if (!grid) return;

  grid.innerHTML = PLANES_CLUB.map(plan => `
    <div class="plan-card ${plan.destacado ? 'featured' : ''}">
      ${plan.destacado ? '<div class="plan-badge">Más elegido</div>' : ''}
      <div class="plan-img-wrap">
        <img src="${plan.imagen}" alt="Plan ${plan.nombre}" />
        <div class="plan-img-overlay"></div>
      </div>
      <div class="plan-body">
        <h3 class="plan-nombre">Cuota ${plan.nombre}</h3>
        <div class="plan-precio">${plan.precio}</div>
        <p class="plan-desc">${plan.descripcion}</p>
        <p class="plan-vino">${plan.vino}</p>
        <button class="btn-plan ${plan.destacado ? 'btn-plan-featured' : ''}"
                data-plan="${plan.nombre}" data-precio="${plan.precio}">
          Elegir este plan
        </button>
      </div>
    </div>
  `).join('');

  /* Botones de plan abren el modal con el plan preseleccionado */
  grid.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.plan);
    });
  });
}

/* Rellenar select del form con los planes del config */
function renderFormSelect() {
  const sel = document.getElementById('f-plan');
  if (!sel) return;
  sel.innerHTML = '<option value="">Seleccioná un plan</option>' +
    PLANES_CLUB.map(p =>
      `<option value="${p.nombre}">${p.nombre} — ${p.precio}</option>`
    ).join('');
}

/* ============================================================
   MODAL FORMULARIO
   ============================================================ */
const modalOverlay = document.getElementById('modal-overlay');

function openModal(planPreseleccionado = '') {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (planPreseleccionado) {
    const sel = document.getElementById('f-plan');
    if (sel) sel.value = planPreseleccionado;
  }
  /* Focus al primer campo */
  setTimeout(() => {
    const first = modalOverlay.querySelector('input, select');
    if (first) first.focus();
  }, 100);
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* Botones que abren el modal */
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal());
});

/* ============================================================
   FORMULARIO — envía por WhatsApp
   ============================================================ */
const form = document.getElementById('form-asociate');
form.addEventListener('submit', e => {
  e.preventDefault();

  const nombre  = document.getElementById('f-nombre').value.trim();
  const tel     = document.getElementById('f-tel').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const plan    = document.getElementById('f-plan').value;
  const mensaje = document.getElementById('f-mensaje').value.trim();

  /* Validación básica */
  if (!nombre || !tel || !plan) {
    showFormError('Por favor completá nombre, teléfono y plan.');
    return;
  }

  const lineas = [
    `¡Hola! Quiero asociarme al *Club DBM* 🍷`,
    ``,
    `👤 *Nombre:* ${nombre}`,
    `📱 *Teléfono:* ${tel}`,
    email ? `📧 *Email:* ${email}` : null,
    `📦 *Plan elegido:* ${plan}`,
    mensaje ? `💬 *Consulta:* ${mensaje}` : null
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lineas)}`;
  window.open(url, '_blank', 'noopener');
  closeModal();
  form.reset();
});

function showFormError(msg) {
  let err = form.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    form.prepend(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 4000);
}

/* ============================================================
   INTERSECTION OBSERVER — fade-in al hacer scroll
   ============================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================================
   HIGHLIGHT del día actual en la tabla de horarios
   ============================================================ */
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const hoy  = DIAS[new Date().getDay()];
document.querySelectorAll('.hours-table tr[data-dia]').forEach(row => {
  if (row.dataset.dia === hoy) row.classList.add('today');
});

/* ============================================================
   INIT
   ============================================================ */
renderBodega();
renderPlanes();
renderFormSelect();

/* Copyright year */
const yearEl = document.getElementById('copy-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
