/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Base block: hero
 * Source: https://www.amtrak.com
 * Description: Full-width background image with overlaid heading, subheading paragraph, and CTA link
 * Generated: 2026-05-20
 */
export default function parse(element, { document }) {
  // Extract background image (direct child img of .heroimage)
  const bgImage = element.querySelector(':scope > img, img[src]');

  // Extract heading (h1.heroimageH1 or fallback to any h1/h2)
  const heading = element.querySelector('h1.heroimageH1, h1, h2, [class*="heroimageH"]');

  // Extract subheading paragraph (p.heroParagraph or fallback)
  const paragraph = element.querySelector('p.heroParagraph, p[class*="heroParagraph"], .carousel-heading-container > p:not(:has(a))');

  // Extract CTA link (the action button link)
  const ctaLink = element.querySelector('a.action-button-row__btn-element, a[class*="action-button"], .carousel-heading-container a');

  // Build cells array matching hero-banner block structure
  // Row 1: Background image
  // Row 2: Content (heading + paragraph + CTA)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with heading, paragraph, and CTA
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (paragraph) {
    contentCell.push(paragraph);
  }
  if (ctaLink) {
    // Wrap CTA in a paragraph if it isn't already inside one
    const ctaParent = ctaLink.closest('p');
    if (ctaParent) {
      contentCell.push(ctaParent);
    } else {
      contentCell.push(ctaLink);
    }
  }
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
