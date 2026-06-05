/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const SEAL_LOGO_URL = 'https://www.sss.gov/wp-content/themes/sss/assets/visuals/css-assets/sss-logo.svg';
const MOBILE_QUERY = window.matchMedia('(max-width: 899px)');

function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

function isMobile() {
  return MOBILE_QUERY.matches;
}

/* Build the thin "official US government" banner strip. */
function buildUSABanner() {
  const banner = document.createElement('div');
  banner.classList.add('usa-banner');
  banner.innerHTML = `
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='11'%3E%3Crect width='16' height='11' fill='%23002868'/%3E%3Crect width='16' height='1' y='2' fill='white'/%3E%3Crect width='16' height='1' y='4' fill='%23BF0A30'/%3E%3Crect width='16' height='1' y='6' fill='white'/%3E%3Crect width='16' height='1' y='8' fill='%23BF0A30'/%3E%3Crect width='16' height='1' y='10' fill='white'/%3E%3C/svg%3E" alt="U.S. flag">
    <span>An official website of the United States government</span>`;
  return banner;
}

/* Toggle the whole mobile nav open/closed. */
function toggleMenu(nav, forceExpand) {
  const expanded = forceExpand !== undefined
    ? !forceExpand
    : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = (!expanded && isMobile()) ? 'hidden' : '';
}

/* Close all open dropdowns within the sections list. */
function closeAllDropdowns(navSections, except) {
  navSections.querySelectorAll('.nav-drop.open').forEach((drop) => {
    if (drop === except) return;
    drop.classList.remove('open');
    const toggle = drop.querySelector(':scope > .nav-drop-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

/* Strip boilerplate button classes EDS adds to links. */
function stripButtonClasses(scope) {
  if (!scope) return;
  scope.querySelectorAll('.button').forEach((btn) => {
    btn.classList.remove('button');
    const container = btn.closest('.button-container');
    if (container) container.classList.remove('button-container');
  });
}

/* Build the brand block: seal logo image + wordmark link. */
function decorateBrand(navBrand) {
  if (!navBrand) return;
  stripButtonClasses(navBrand);

  const link = navBrand.querySelector('a');
  if (link) {
    link.classList.add('nav-brand-link');
    if (!link.getAttribute('href')) link.setAttribute('href', '/');

    const textSpan = document.createElement('span');
    textSpan.classList.add('nav-brand-text');
    textSpan.textContent = link.textContent.trim();

    const img = document.createElement('img');
    img.src = SEAL_LOGO_URL;
    img.alt = 'Selective Service System seal';
    img.classList.add('nav-brand-seal');
    img.width = 56;
    img.height = 56;
    img.loading = 'eager';

    link.textContent = '';
    link.append(img, textSpan);
  }
}

/* Convert sections list into nav with dropdown structure. */
function decorateSections(navSections) {
  if (!navSections) return;
  stripButtonClasses(navSections);

  const topList = navSections.querySelector(':scope > ul');
  if (!topList) return;

  topList.querySelectorAll(':scope > li').forEach((li) => {
    const strong = li.querySelector(':scope > strong');
    const submenu = li.querySelector(':scope > ul');

    if (strong && submenu) {
      // Dropdown item.
      li.classList.add('nav-drop');

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.classList.add('nav-drop-toggle');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-haspopup', 'true');

      const label = document.createElement('span');
      label.classList.add('nav-drop-label');
      label.textContent = strong.textContent.trim();

      const chevron = document.createElement('span');
      chevron.classList.add('nav-drop-chevron');
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '\u25BE'; // ▾

      toggle.append(label, chevron);

      submenu.classList.add('nav-drop-menu');

      strong.replaceWith(toggle);

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = li.classList.contains('open');
        closeAllDropdowns(navSections, li);
        li.classList.toggle('open', !isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });
    } else {
      // Plain link item.
      li.classList.add('nav-item');
    }
  });
}

/* Decorate the two CTA links as primary / outline buttons. */
function decorateTools(navTools) {
  if (!navTools) return;
  stripButtonClasses(navTools);

  const links = navTools.querySelectorAll('a');
  links.forEach((link, i) => {
    link.classList.add('nav-tool-btn');
    link.classList.add(i === 0 ? 'nav-tool-primary' : 'nav-tool-outline');
  });
}

/* Build the search input box. */
function buildSearch() {
  const search = document.createElement('div');
  search.classList.add('nav-search');
  search.innerHTML = `
    <form role="search" class="nav-search-form" action="/search">
      <span class="nav-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.49-1.49-5-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z"/>
        </svg>
      </span>
      <input type="search" name="q" placeholder="Search" aria-label="Search">
    </form>`;
  return search;
}

/* Build the hamburger toggle button. */
function buildHamburger() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  return hamburger;
}

export default async function decorate(block) {
  block.textContent = '';

  // 1. Thin US government banner strip (kept verbatim).
  block.append(buildUSABanner());

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  if (resp.ok) {
    nav.innerHTML = await resp.text();
  }

  // 2. Label the three top-level divs.
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const navSections = nav.querySelector('.nav-sections');
  const navTools = nav.querySelector('.nav-tools');

  // 3. Decorate each region.
  decorateBrand(navBrand);
  decorateSections(navSections);
  decorateTools(navTools);

  // 4. Build the right-hand group: search + tools (CTA buttons).
  const navRight = document.createElement('div');
  navRight.classList.add('nav-right');
  navRight.append(buildSearch());
  if (navTools) navRight.append(navTools);

  // 5. Hamburger for mobile.
  const hamburger = buildHamburger();
  const hamburgerBtn = hamburger.querySelector('button');
  hamburgerBtn.addEventListener('click', () => {
    toggleMenu(nav);
    hamburgerBtn.setAttribute('aria-expanded', nav.getAttribute('aria-expanded'));
  });

  // 6. Assemble the layout.
  // Top row: brand (left) + right group + hamburger.
  const navTop = document.createElement('div');
  navTop.classList.add('nav-top');
  if (navBrand) navTop.append(navBrand);
  navTop.append(navRight, hamburger);

  // Bottom row: sections nav.
  const navBottom = document.createElement('div');
  navBottom.classList.add('nav-bottom');
  if (navSections) navBottom.append(navSections);

  nav.append(navTop, navBottom);

  // 7. Close dropdowns when clicking outside, and on Escape.
  document.addEventListener('click', (e) => {
    if (navSections && !navSections.contains(e.target)) {
      closeAllDropdowns(navSections);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navSections) {
      closeAllDropdowns(navSections);
    }
  });

  // 8. Reset mobile state when crossing the breakpoint.
  MOBILE_QUERY.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    if (navSections) closeAllDropdowns(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper);
}
