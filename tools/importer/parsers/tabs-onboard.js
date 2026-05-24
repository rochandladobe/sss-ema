/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-onboard
 * Base block: tabs
 * Source: https://www.amtrak.com
 * Description: Tabbed interface with 4 tabs (Seating, Private Rooms, Food & Dining, Baggage).
 *   Each tab panel contains a heading, description text, CTA link, and a large image.
 * Generated: 2026-05-20
 *
 * DOM structure (validated against source):
 *   .cmp-tabs
 *     ol.cmp-tabs__tablist > li.cmp-tabs__tab (tab labels)
 *     div.cmp-tabs__tabpanel (one per tab)
 *       .teaser.onboarding-experience-teaser > .cmp-teaser
 *         .cmp-teaser__content
 *           h3.cmp-teaser__title
 *           .cmp-teaser__description > p
 *           a.cmp-teaser__action-link
 *         .cmp-teaser__image img
 *
 * Target EDS table: one row per tab with [tab-label, panel-content]
 */
export default function parse(element, { document }) {
  // Extract tab labels from the ordered list
  const tabLabels = Array.from(element.querySelectorAll('ol.cmp-tabs__tablist > li.cmp-tabs__tab, .cmp-tabs__tablist > li'));

  // Extract tab panels
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];

  tabPanels.forEach((panel, index) => {
    // Get the label text for this tab
    const labelText = tabLabels[index] ? tabLabels[index].textContent.trim() : `Tab ${index + 1}`;

    // Extract content from the teaser within this panel
    const teaser = panel.querySelector('.cmp-teaser, .onboarding-experience-teaser');

    // Build the content cell elements
    const contentElements = [];

    if (teaser) {
      // Heading
      const heading = teaser.querySelector('.cmp-teaser__title, h3, h2');
      if (heading) contentElements.push(heading);

      // Description text
      const description = teaser.querySelector('.cmp-teaser__description');
      if (description) {
        const descParas = Array.from(description.querySelectorAll('p'));
        if (descParas.length > 0) {
          descParas.forEach((p) => contentElements.push(p));
        } else {
          // Fallback: use the description div itself if no <p> children
          contentElements.push(description);
        }
      }

      // CTA link
      const ctaLink = teaser.querySelector('a.cmp-teaser__action-link, a[class*="action"], .cmp-teaser__content a');
      if (ctaLink) contentElements.push(ctaLink);

      // Image
      const image = teaser.querySelector('.cmp-teaser__image img, img');
      if (image) contentElements.push(image);
    } else {
      // Fallback: grab all content from the panel directly
      const allContent = Array.from(panel.children);
      allContent.forEach((child) => contentElements.push(child));
    }

    // Each row: [tab label (string), panel content (array of elements)]
    cells.push([labelText, contentElements]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-onboard', cells });
  element.replaceWith(block);
}
