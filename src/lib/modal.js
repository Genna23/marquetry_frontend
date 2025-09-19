(function () {
  if (typeof window === 'undefined') return;
  if (window.__modalBound) return; // защита от повторной инициализации
  window.__modalBound = true;

  function $(sel, root = document) { return root.querySelector(sel); }
  function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function openDialog(target) {
    const dlg = (typeof target === 'string' ? $(target) : target);
    if (!dlg || !(dlg instanceof HTMLDialogElement)) return;

    dlg._lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dlg.open) dlg.showModal();

    dlg.classList.remove('closing'); // Убираем класс закрытия

    // Плавное появление с анимацией
    dlg.classList.add('opening'); // Добавляем класс для открытия

    // Фокус внутрь
    const focusable = dlg.querySelector('[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || dlg).focus({ preventScroll: true });
  }

  function closeDialog(target) {
    const dlg = (typeof target === 'string' ? $(target) : target);
    if (!dlg || !(dlg instanceof HTMLDialogElement) || !dlg.open) return;

    if (isReducedMotion()) {
      dlg.close();
      dlg._lastFocus && dlg._lastFocus.focus && dlg._lastFocus.focus({ preventScroll: true });
      return;
    }

    if (dlg._closing) return;
    dlg._closing = true;
    dlg.classList.add('closing'); // Добавляем класс для закрытия

    // Убираем класс открытия
    dlg.classList.remove('opening');

    const done = () => {
      dlg.classList.remove('closing');
      dlg.close();
      dlg._closing = false;
      dlg.removeEventListener('transitionend', onEnd);
      dlg._lastFocus && dlg._lastFocus.focus && dlg._lastFocus.focus({ preventScroll: true });
    };

    const onEnd = () => { clearTimeout(timer); done(); };
    const timer = setTimeout(done, 400); // страховка, если transition не сработает
    dlg.addEventListener('transitionend', onEnd, { once: true });
  }

  function handleBackdropClick(e) {
    const dlg = e.currentTarget;
    const r = dlg.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeDialog(dlg);
  }

  function handleCancel(e) {
    e.preventDefault();
    closeDialog(e.currentTarget);
  }

  function observeDialog(dlg) {
    if (!(dlg instanceof HTMLDialogElement)) return;
    if (dlg.__modalObserved) return;
    dlg.__modalObserved = true;
    dlg.addEventListener('click', handleBackdropClick);
    dlg.addEventListener('cancel', handleCancel);
  }

  function bind() {
    // Делегирование на клик по открывающим/закрывающим кнопкам
    document.addEventListener('click', (e) => {
      const t = e.target;
      const openBtn = t && t.closest && t.closest('[data-modal-open]');
      if (openBtn) {
        const sel = openBtn.getAttribute('data-modal-open');
        if (sel) openDialog(sel);
      }
      const closeBtn = t && t.closest && t.closest('[data-modal-close]');
      if (closeBtn) {
        const dlg = closeBtn.closest('dialog');
        if (dlg) closeDialog(dlg);
      }
    });

    document.querySelectorAll('dialog').forEach(observeDialog);

    // На случай динамического добавления
    new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLDialogElement) observeDialog(n);
          else if (n instanceof Element) n.querySelectorAll('dialog').forEach(observeDialog);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Простое глобальное API
    window.modal = { open: openDialog, close: closeDialog };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})();
