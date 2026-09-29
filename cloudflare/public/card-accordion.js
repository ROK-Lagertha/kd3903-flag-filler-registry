(() => {
  const MOBILE_QUERY = '(max-width: 900px)';
  const cards = [...document.querySelectorAll('#registryView .grid .card')];
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const icon = card.querySelector(':scope > .icon');
    const title = card.querySelector(':scope > h2');
    const info = card.querySelector(':scope > p');
    if (!icon || !title || !info) return;

    const body = document.createElement('div');
    body.className = 'card-body';

    [...card.children].forEach(node => {
      if (node !== icon && node !== title && node !== info) body.appendChild(node);
    });

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'card-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', `registry-card-body-${index + 1}`);

    const toggleIcon = icon.cloneNode(true);
    const copy = document.createElement('div');
    copy.className = 'card-toggle-copy';
    copy.append(title.cloneNode(true), info.cloneNode(true));

    const chevron = document.createElement('span');
    chevron.className = 'card-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';

    body.id = `registry-card-body-${index + 1}`;
    toggle.append(toggleIcon, copy, chevron);
    card.append(toggle, body);

    toggle.addEventListener('click', () => {
      if (!matchMedia(MOBILE_QUERY).matches) return;
      const willOpen = !card.classList.contains('is-open');

      cards.forEach(other => {
        other.classList.remove('is-open');
        const otherToggle = other.querySelector('.card-toggle');
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        card.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const sync = () => {
    if (!matchMedia(MOBILE_QUERY).matches) {
      cards.forEach(card => {
        card.classList.remove('is-open');
        const toggle = card.querySelector('.card-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  };

  addEventListener('resize', sync, { passive: true });
  sync();
})();
