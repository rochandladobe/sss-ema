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

function buildUSABanner() {
  const banner = document.createElement('div');
  banner.classList.add('usa-banner');
  banner.innerHTML = `
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='11'%3E%3Crect width='16' height='11' fill='%23002868'/%3E%3Crect width='16' height='1' y='2' fill='white'/%3E%3Crect width='16' height='1' y='4' fill='%23BF0A30'/%3E%3Crect width='16' height='1' y='6' fill='white'/%3E%3Crect width='16' height='1' y='8' fill='%23BF0A30'/%3E%3Crect width='16' height='1' y='10' fill='white'/%3E%3C/svg%3E" alt="U.S. flag">
    <span>An official website of the United States government</span>`;
  return banner;
}

export default async function decorate(block) {
  const usaBanner = buildUSABanner();
  block.prepend(usaBanner);

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="nav-wrapper">
        <nav class="nav" aria-expanded="false">
          <div class="nav-brand">
            <a href="/" aria-label="Selective Service System">
              <span>Selective Service System</span>
            </a>
          </div>
          <div class="nav-sections">
            <ul>
              <li class="nav-drop"><a href="/register">Registration</a>
                <ul>
                  <li><a href="/register">Register Now</a></li>
                  <li><a href="/register/who-needs-to-register">Who Needs to Register</a></li>
                  <li><a href="/register/benefits-and-penalties">Benefits &amp; Penalties</a></li>
                  <li><a href="/register/men-26-and-older">Men 26 and Older</a></li>
                  <li><a href="/verify">Verify Registration</a></li>
                </ul>
              </li>
              <li><a href="/faq">Frequently Asked Questions</a></li>
              <li><a href="/news-and-media">News &amp; Media</a></li>
              <li><a href="/reports">Reports &amp; Publications</a></li>
              <li class="nav-drop"><a href="/about">About</a>
                <ul>
                  <li><a href="/about">About Selective Service</a></li>
                  <li><a href="/history-and-records">History &amp; Records</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="nav-actions">
            <a href="/register" class="nav-btn nav-btn-primary">Register</a>
            <a href="/verify" class="nav-btn nav-btn-outline">Verify</a>
          </div>
          <div class="nav-search">
            <input type="search" placeholder="Search...">
          </div>
          <div class="nav-hamburger">
            <button type="button" aria-controls="nav" aria-label="Open navigation">
              <span class="nav-hamburger-icon"></span>
            </button>
          </div>
        </nav>
      </div>`;
    block.append(wrapper.firstElementChild);
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
    navSections.querySelectorAll('.button').forEach((btn) => {
      btn.classList.remove('button');
      const buttonContainer = btn.closest('.button-container');
      if (buttonContainer) buttonContainer.classList.remove('button-container');
    });
  }

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.querySelectorAll('.button').forEach((btn) => {
      btn.classList.remove('button');
      const buttonContainer = btn.closest('.button-container');
      if (buttonContainer) buttonContainer.classList.remove('button-container');
    });
  }

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('nav-search');
  searchDiv.innerHTML = '<input type="search" placeholder="Search...">';
  nav.append(searchDiv);

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
