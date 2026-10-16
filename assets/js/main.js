'use strict';

function initHeader() {
  const header = document.querySelector('.site-header');
  const update = () => header.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  nav.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!nav.contains(document.activeElement) && document.activeElement !== toggle) setOpen(false);
    });
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', () => setOpen(false));
}

function initRevealAnimations() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .floor-block, .manifesto, .final-cta').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('reveal-pending');
      observer.observe(element);
    }
  });
}

/* Optional files are requested only when their visual approaches the viewport.
   A failed request never inserts a broken image or replaces the CSS fallback. */
function initImageFallbacks() {
  const load = (element) => {
    const paths = element.dataset.image.split('|');
    const tryNext = () => {
      const path = paths.shift();
      if (!path) return;
      const image = new Image();
      image.alt = element.dataset.alt || '';
      image.className = 'asset-image';
      image.decoding = 'async';
      // Detached lazy images may never load; the observer already defers this request.
      image.loading = 'eager';
      if (element.classList.contains('hero-visual')) image.fetchPriority = 'high';
      image.onload = () => {
        if (!element.classList.contains('hero-visual')) image.loading = 'lazy';
        element.append(image);
        element.classList.add('has-image');
        if (element.dataset.plan) {
          element.querySelector('.plan-kind').textContent = 'PLANTA DO PROJETO · CLIQUE PARA AMPLIAR';
          element.closest('.plan-wrap').querySelector('.plan-note').textContent = 'Selecione a planta para visualizar em tamanho ampliado.';
        }
      };
      image.onerror = tryNext;
      image.src = path;
    };
    tryNext();
  };
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-image]').forEach(load);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('[data-image]').forEach((element) => observer.observe(element));
}

function initLightbox() {
  const dialog = document.querySelector('.lightbox');
  const content = dialog.querySelector('.lightbox-content');
  const title = dialog.querySelector('#lightbox-title');
  let trigger;
  const open = (plan, source) => {
    if (!plan) return;
    trigger = source;
    const image = plan.querySelector('.asset-image');
    title.textContent = `${plan.dataset.plan} — ${image ? 'planta do projeto' : 'esquema conceitual'}`;
    const clone = (image || plan.querySelector('.plan-drawing')).cloneNode(true);
    clone.removeAttribute('aria-hidden');
    clone.classList.remove('asset-image');
    content.replaceChildren(clone);
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('.lightbox-close').focus();
  };
  document.querySelectorAll('[data-plan]').forEach((plan) => {
    plan.setAttribute('aria-label', `Ampliar planta: ${plan.dataset.plan}`);
    plan.addEventListener('click', () => open(plan, plan));
  });
  document.querySelectorAll('[data-open-plan]').forEach((button) => {
    button.addEventListener('click', () => open(document.getElementById(button.dataset.openPlan).querySelector('[data-plan]'), button));
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (trigger) trigger.focus();
  });
}

function initDemoForm() {
  const form = document.querySelector('#demo-form');
  if (!form) return;
  const toast = document.querySelector('.toast');
  form.querySelector('[type="submit"]').disabled = false;
  let timeout;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = 'Formulário demonstrativo — nenhum dado foi enviado.';
    document.querySelector('#form-feedback').textContent = message;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(timeout);
    timeout = setTimeout(() => toast.classList.remove('visible'), 6000);
  });
}

initHeader();
initMobileNav();
initRevealAnimations();
initImageFallbacks();
initLightbox();
initDemoForm();
