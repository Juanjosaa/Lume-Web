/* ==========================================================
   LUME · Interacciones
   1. Header que cambia al hacer scroll
   2. Menú móvil
   3. Enlace activo según la sección visible
   4. Animaciones de aparición al hacer scroll
   5. Acordeón de preguntas frecuentes
   6. Botones "Lo quiero" → rellenan el formulario
   7. Validación del formulario de contacto
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Header con fondo al hacer scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Menú móvil ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  // Cerrar el menú al elegir una opción o presionar Escape
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- 3. Enlace activo en el menú ---------- */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href')));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => s && sectionObserver.observe(s));

  /* ---------- 4. Aparición gradual al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  // Pequeño retraso escalonado entre elementos hermanos (efecto cascada)
  revealEls.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const index = siblings.indexOf(el);
    el.style.setProperty('--delay', `${Math.min(index, 5) * 0.1}s`);
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 5. Acordeón ---------- */
  const items = document.querySelectorAll('.accordion__item');

  items.forEach(item => {
    const btn = item.querySelector('.accordion__btn');
    const panel = item.querySelector('.accordion__panel');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Cierra los demás para que solo haya uno abierto
      items.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.accordion__btn').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion__panel').style.height = '0px';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 6. "Lo quiero" → mensaje prellenado ---------- */
  const mensaje = document.getElementById('mensaje');
  document.querySelectorAll('[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      mensaje.value = `¡Hola Lume! Quiero el producto "${btn.dataset.product}". ¿Me cuentan cómo comprarlo?`;
      setTimeout(() => document.getElementById('nombre').focus({ preventScroll: true }), 700);
    });
  });

  /* ---------- 7. Formulario de contacto ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form__field').forEach(field => {
      const input = field.querySelector('input, textarea');
      const value = input.value.trim();
      const ok = input.type === 'email' ? emailOk(value) : value.length > 1;
      field.classList.toggle('has-error', !ok);
      if (!ok) valid = false;
    });

    if (!valid) return;

    // Aquí se enviaría el formulario a un servicio real (Formspree, EmailJS, etc.)
    form.reset();
    success.hidden = false;
    setTimeout(() => { success.hidden = true; }, 6000);
  });

  // Quita el error mientras la persona escribe
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => input.closest('.form__field').classList.remove('has-error'));
  });
});
