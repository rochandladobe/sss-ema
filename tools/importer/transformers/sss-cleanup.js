/* eslint-disable */
/* global WebImporter */

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    const selectorsToRemove = [
      'header',
      'footer',
      'nav',
      '.usa-banner',
      '.usa-nav',
      '.usa-footer',
      '.site-header',
      '.site-footer',
      '#masthead',
      '#colophon',
      '.skip-link',
      '[role="banner"]',
      '[role="contentinfo"]',
      'script',
      'style',
      'noscript',
      'iframe',
      '.cookie-banner',
      '#cookie-consent',
      '.wp-block-navigation',
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
    element.querySelectorAll('[data-wp-context]').forEach((el) => {
      el.removeAttribute('data-wp-context');
    });
  }
}
