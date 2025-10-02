(() => {
  const modal = document.getElementById('modal');
  const dialog = modal.querySelector('.modal__dialog');
  const openBtn = document.querySelector('[data-open-modal]');
  const closeBtns = modal.querySelectorAll('[data-close-modal]');
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('open', '');
    modal.removeAttribute('aria-hidden');

    // фокус на діалог
    requestAnimationFrame(() => dialog.focus());

    // заблокувати прокрутку фону
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.removeAttribute('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  // Закриття по кліку по фону
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Клавіатурні обробники: Esc і трап фокуса (Tab)
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
      if (!list.length) return;

      const first = list[0];
      const last  = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
})();
