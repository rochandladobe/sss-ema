/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Amtrak site-wide cleanup.
 * Removes non-authorable content (header, footer, modals, alerts, labels fragment)
 * and cleans up AEM-specific attributes.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modals that could interfere with block parsing
    // Found in cleaned.html lines 99, 394: <div class="modal travel-status-modal fade">
    WebImporter.DOMUtils.remove(element, [
      '.modal.travel-status-modal',
    ]);

    // Remove OneTrust consent SDK if present (referenced in requirements)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header navigation
    // Found in cleaned.html line 64: <header class="experiencefragment am-js__site-topnav_hpr ...">
    // Found in cleaned.html line 65: <div ... class="cmp-experiencefragment cmp-experiencefragment--header">
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
    ]);

    // Remove footer
    // Found in cleaned.html line 1964: <footer class="experiencefragment ...">
    // Found in cleaned.html line 1965: <div ... class="cmp-experiencefragment cmp-experiencefragment--footer">
    WebImporter.DOMUtils.remove(element, [
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
    ]);

    // Remove home alerts / notifications (non-authorable system content)
    // Found in cleaned.html line 27: <div class="home-alerts basecomponent parbase ...">
    // Found in cleaned.html line 30: <article class="notifications am-js__notifications">
    WebImporter.DOMUtils.remove(element, [
      '.home-alerts.basecomponent',
      '.am-js__notifications',
    ]);

    // Remove labels/B2C experience fragment (non-authorable config data)
    // Found in cleaned.html line 47: <div ... class="cmp-experiencefragment cmp-experiencefragment--labels-used-in-b2c">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--labels-used-in-b2c',
    ]);

    // Remove guest rewards logged-in/out templates from header area (non-authorable)
    // Found in cleaned.html line 606: <div id="agr-logged-out-template" class="cmp-experiencefragment cmp-experiencefragment--guest-rewards-logged-out">
    // Found in cleaned.html line 701: <div id="agr-logged-in-template" class="cmp-experiencefragment cmp-experiencefragment--guest-rewards-logged-in">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--guest-rewards-logged-out',
      '.cmp-experiencefragment--guest-rewards-logged-in',
    ]);

    // Remove iframes, link elements, noscript
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up AEM-specific data attributes
    // Found in cleaned.html line 1: data-cmp-link-accessibility-enabled, data-require-authentication,
    // data-cmp-link-accessibility-text, data-inq-observer
    const aemAttributes = [
      'data-cmp-link-accessibility-enabled',
      'data-cmp-link-accessibility-text',
      'data-require-authentication',
      'data-inq-observer',
      'data-cmp-data-layer',
      'data-component',
    ];
    element.querySelectorAll('*').forEach((el) => {
      aemAttributes.forEach((attr) => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
    });
  }
}
