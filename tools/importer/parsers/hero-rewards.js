/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-rewards
 * Base block: hero
 * Source: https://www.amtrak.com
 * Description: Promotional banner with Amtrak Guest Rewards logo, description text about earning points, and JOIN NOW CTA link
 * Generated: 2026-05-20
 */
export default function parse(element, { document }) {
  // Extract the Guest Rewards logo image from .cmp-teaser__image
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img[alt*="Rewards"], img[alt*="Guest"]');

  // Extract description paragraph from .cmp-teaser__description
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description');

  // Extract CTA link from .cmp-teaser__action-container
  const ctaLink = element.querySelector('.cmp-teaser__action-container a, .cmp-teaser__action-link, a[href*="enroll"], a[href*="guestrewards"]');

  // Build cells array matching hero-rewards block structure
  // Row 1: Logo/image
  // Row 2: Description text + CTA link
  const cells = [];

  // Row 1: Image (Guest Rewards logo)
  if (image) {
    cells.push([image]);
  }

  // Row 2: Content cell with description and CTA
  const contentCell = [];
  if (description) {
    contentCell.push(description);
  }
  if (ctaLink) {
    // Wrap CTA in a paragraph element for proper formatting
    const ctaParent = ctaLink.closest('p');
    if (ctaParent) {
      contentCell.push(ctaParent);
    } else {
      contentCell.push(ctaLink);
    }
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-rewards', cells });
  element.replaceWith(block);
}
