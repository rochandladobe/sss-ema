/* eslint-disable */
/* global WebImporter */

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    const selectorsToRemove = [
      'header',
      'footer',
      'nav.navbar',
      '.site-header',
      '.site-footer',
      '#masthead',
      '#colophon',
      '.wp-block-navigation',
      '.skip-link',
      'script',
      'style',
      'noscript',
      'iframe',
      '[role="banner"]',
      '[role="contentinfo"]',
      '.usa-banner',
      '.usa-nav',
      '.usa-footer',
      '#uswds-banner',
      '.cookie-banner',
      '#cookie-consent',
    ];

    selectorsToRemove.forEach((selector) => {
      try {
        element.querySelectorAll(selector).forEach((el) => el.remove());
      } catch (e) { /* ignore */ }
    });
  }

  if (hookName === 'afterTransform') {
    element.querySelectorAll('link, meta').forEach((el) => el.remove());
    element.querySelectorAll('[data-wp-interactive]').forEach((el) => {
      el.removeAttribute('data-wp-interactive');
    });
  }
}
