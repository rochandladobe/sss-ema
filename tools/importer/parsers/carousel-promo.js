/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-promo
 * Base block: carousel
 * Source: https://www.amtrak.com
 * Description: Carousel of promotional cards, each with an image and title/description linking to deal pages.
 *              Each slide has an image column and a content column with heading and link.
 * Generated: 2026-05-20
 */
export default function parse(element, { document }) {
  // Each slide is a .card-panel within .cmp-carousel__innerpanel
  const slides = element.querySelectorAll('.card-panel, .cmp-carousel__item');

  const cells = [];

  slides.forEach((slide) => {
    // Extract the image from .cmp-teaser__image > .cmp-image > img
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Extract the title heading (h3.cmp-teaser__title or fallback)
    const title = slide.querySelector('h3.cmp-teaser__title, .cmp-teaser__title, h3, h2');

    // Extract the link wrapping the teaser content (the entire card links to a promo page)
    const link = slide.querySelector('a.cmp-teaser__link, .cmp-teaser > a, a[href]');

    // Build the content cell (column 2): heading + CTA link
    // Block library structure: heading + optional description + optional CTA
    const contentCell = [];

    if (title) {
      // Create a heading that preserves the title text
      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      contentCell.push(heading);
    }

    // Add a CTA link pointing to the deal/promo page
    if (link) {
      const href = link.getAttribute('href') || link.href;
      if (href) {
        const ctaLink = document.createElement('a');
        ctaLink.href = href;
        ctaLink.textContent = 'Learn More';
        const ctaParagraph = document.createElement('p');
        ctaParagraph.appendChild(ctaLink);
        contentCell.push(ctaParagraph);
      }
    }

    // Build the row: [image, content]
    // Column 1: image, Column 2: text content (heading + CTA)
    if (image || contentCell.length > 0) {
      cells.push([image || [], contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-promo', cells });
  element.replaceWith(block);
}
