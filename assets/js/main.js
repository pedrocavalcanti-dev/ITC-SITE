'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initHeader() {
  const header = document.querySelector('.site-header');
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const mobile = window.matchMedia('(max-width: 700px)');
  const background = document.querySelectorAll('main, .site-footer, .utility, .header-cta');
  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    background.forEach((element) => { element.inert = open; });
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setOpen(false, true);
    if (event.key === 'Tab') {
      const focusable = [...document.querySelectorAll('.site-header .brand, .menu-toggle, #main-nav a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  nav.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!document.activeElement.closest('.site-header')) setOpen(false);
    });
  });
  mobile.addEventListener('change', () => setOpen(false));
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (!reducedMotion.matches) hero.classList.add('hero-enter');
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) hero.classList.remove('hero-enter');
  });
  const visual = hero.querySelector('.hero-visual');
  const pointer = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const layers = [...visual.querySelectorAll('.architecture-grid, .sun, .building-back, .building-front')];
  const strengths = [1.5, 2.5, 4, 5.5];
  let frame = 0;
  let x = 0;
  let y = 0;
  const reset = () => {
    cancelAnimationFrame(frame); frame = 0;
    layers.forEach((layer) => { layer.style.removeProperty('translate'); });
  };
  visual.addEventListener('pointermove', (event) => {
    if (!pointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = visual.getBoundingClientRect();
    x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      layers.forEach((layer, i) => { layer.style.translate = `${x * strengths[i]}px ${y * strengths[i]}px`; });
      frame = 0;
    });
  }, { passive: true });
  visual.addEventListener('pointerleave', reset);
  visual.addEventListener('pointercancel', reset);
  pointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
}

function initReveal() {
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const elements = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  const register = (element, variant = 'up', delay = 0) => {
    if (elements.has(element)) return;
    elements.add(element);
    element.classList.add('reveal', `reveal-${variant}`);
    element.style.setProperty('--delay', `${delay}ms`);
    // Never hide content already visible, anchored, or focused on initial load.
    if (element.getBoundingClientRect().top < window.innerHeight || element.contains(document.activeElement)) {
      element.classList.add('is-visible');
    } else observer.observe(element);
  };
  document.querySelectorAll('.section-heading, .floor-copy, .manifesto, .final-cta').forEach((element) => register(element));
  document.querySelectorAll('.about-visual, .floor-block:not(.reverse) .plan-wrap').forEach((element) => register(element, 'left'));
  document.querySelectorAll('.floor-block.reverse .plan-wrap').forEach((element) => register(element, 'right'));
  document.querySelectorAll('.network-art').forEach((element) => register(element, 'scale'));
  document.querySelectorAll('.area-grid, .tech-grid, .highlight-cards, .pillars, .pillar-words, .facts, .mission-grid').forEach((group) => {
    [...group.children].forEach((element, index) => register(element, 'up', (index % 3) * 80));
  });
  document.addEventListener('focusin', (event) => {
    const element = event.target.closest('.reveal');
    if (element) { element.classList.add('is-visible'); observer.unobserve(element); }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      elements.forEach((element) => element.classList.add('is-visible'));
    }
  });
}

function initNetworkMotion() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
  });
  document.querySelectorAll('.network-art').forEach((element) => observer.observe(element));
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
  let closeTimer;
  const close = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (reducedMotion.matches) { dialog.close(); return; }
    dialog.classList.add('is-closing');
    closeTimer = setTimeout(() => dialog.close(), 180);
  };
  const open = (plan, source) => {
    if (!plan) return;
    clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
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
  dialog.querySelector('.lightbox-close').addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    document.body.classList.remove('modal-open');
    if (trigger) trigger.focus();
  });
}

let toastController;

function initToast() {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.append(toast);
  }
  toast.removeAttribute('role');
  toast.removeAttribute('aria-live');
  const message = document.createElement('span');
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');
  message.setAttribute('aria-atomic', 'true');
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'toast-close';
  dismiss.setAttribute('aria-label', 'Fechar notificação');
  dismiss.textContent = '×';
  toast.replaceChildren(message, dismiss);
  let timeout;
  let returnFocus;
  const hide = () => {
    clearTimeout(timeout);
    if (toast.contains(document.activeElement) && returnFocus?.isConnected) returnFocus.focus();
    toast.classList.remove('visible');
  };
  const schedule = () => {
    clearTimeout(timeout);
    timeout = setTimeout(hide, 3000);
  };
  dismiss.addEventListener('click', hide);
  toast.addEventListener('pointerenter', () => clearTimeout(timeout));
  toast.addEventListener('pointerleave', () => { if (!toast.contains(document.activeElement)) schedule(); });
  toast.addEventListener('focusin', () => clearTimeout(timeout));
  toast.addEventListener('focusout', schedule);
  toastController = (text, type) => {
    if (!toast.contains(document.activeElement)) returnFocus = document.activeElement;
    message.textContent = text;
    toast.dataset.type = type === 'success' ? 'success' : 'info';
    toast.classList.add('visible');
    schedule();
  };
}

function showToast(message, type = 'info') {
  if (!toastController) initToast();
  toastController(message, type);
}

function initDemoForm() {
  const form = document.querySelector('#demo-form');
  if (!form) return;
  form.querySelector('[type="submit"]').disabled = false;
  // Persistent confirmation remains available after the transient toast closes.
  const feedback = document.querySelector('#form-feedback');
  feedback.removeAttribute('role');
  feedback.removeAttribute('aria-live');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = 'Formulário demonstrativo — nenhum dado foi enviado.';
    feedback.textContent = message;
    showToast(message);
  });
}

initHeader();
initMobileNav();
initHeroMotion();
initReveal();
initNetworkMotion();
initImageFallbacks();
initLightbox();
initToast();
initDemoForm();
