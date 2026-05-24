function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

function toggleMenu(nav, navSections, forceExpand) {
  const expanded = forceExpand !== undefined ? !forceExpand : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  navSections?.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    block.innerHTML = `
      <div class="nav-wrapper">
        <nav class="nav" aria-expanded="false">
          <div class="nav-brand">
            <a href="/" aria-label="Amtrak">
              <img src="/icons/amtrak-logo.svg" alt="Amtrak logo" width="120" height="40"/>
            </a>
          </div>
          <div class="nav-sections">
            <ul>
              <li><a href="/book">Book</a></li>
              <li><a href="/train-status">Train Status</a></li>
              <li><a href="/my-trip">My Trip</a></li>
              <li><a href="/plan">Plan</a></li>
              <li><a href="/deals">Deals</a></li>
              <li><a href="/onboard">Onboard</a></li>
            </ul>
          </div>
          <div class="nav-tools">
            <a href="/guest-rewards" class="nav-tool">Guest Rewards</a>
            <a href="#" class="nav-tool">Sign In</a>
          </div>
          <div class="nav-hamburger">
            <button type="button" aria-controls="nav" aria-label="Open navigation">
              <span class="nav-hamburger-icon"></span>
            </button>
          </div>
        </nav>
      </div>`;
    const hamburger = block.querySelector('.nav-hamburger');
    const nav = block.querySelector('.nav');
    const navSections = block.querySelector('.nav-sections');
    hamburger?.addEventListener('click', () => toggleMenu(nav, navSections));
    return;
  }

  const html = await resp.text();
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button').forEach((button) => {
      button.className = '';
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    });
  }

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.querySelectorAll('.button').forEach((button) => {
      button.className = '';
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    });
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
