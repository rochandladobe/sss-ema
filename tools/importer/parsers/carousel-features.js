/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-features
 * Base block: carousel
 * Source: https://www.amtrak.com
 * Description: Horizontal carousel of 4 feature articles with animated images, titles,
 *   subtitles, body text, and CTA buttons.
 * Generated: 2026-05-20
 *
 * Source DOM structure (per article):
 *   article.feature-area
 *     .feature-area__content_media-area > .feature-area__content_media-img > picture > img
 *     .feature-area__content_text-area > h2.feature-area__content_title
 *     .feature-area__content_text-area > h3.feature-area__content_sub (optional)
 *     .feature-area__content_text-area > p.feature-area__content_body-text
 *     .feature-area__content_text-area > a.feature-area__content_cta-btn
 *
 * Target block table structure:
 *   One row per slide, each row has two cells: [image, content]
 *   Content cell contains: title (h2), subtitle (h3, optional), body (p), CTA (a)
 */
export default function parse(element, { document }) {
  // Select all feature article items within the carousel
  const articles = element.querySelectorAll('article.feature-area, .feature-area');

  const cells = [];

  articles.forEach((article) => {
    // Extract image from the media area
    const image = article.querySelector(
      '.feature-area__content_media-img img, .feature-area__content_media-area img, img.feature-area__content_media-img_img'
    );

    // Extract title (h2)
    const title = article.querySelector(
      'h2.feature-area__content_title, .feature-area__content_text-area h2, .feature-area__content_title'
    );

    // Extract subtitle (h3) - optional, not all slides have one
    const subtitle = article.querySelector(
      'h3.feature-area__content_sub, .feature-area__content_text-area h3, .feature-area__content_sub'
    );

    // Extract body text (p)
    const bodyText = article.querySelector(
      'p.feature-area__content_body-text, .feature-area__content_text-area p, .feature-area__content_body-text'
    );

    // Extract CTA link
    const ctaLink = article.querySelector(
      'a.feature-area__content_cta-btn, .feature-area__content_text-area a, a[data-automation-id="featureCTABtn"]'
    );

    // Build image cell
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }

    // Build content cell: title + subtitle (optional) + body + CTA
    const contentCell = [];
    if (title) {
      contentCell.push(title);
    }
    if (subtitle) {
      contentCell.push(subtitle);
    }
    if (bodyText && bodyText.textContent.trim()) {
      contentCell.push(bodyText);
    }
    if (ctaLink) {
      contentCell.push(ctaLink);
    }

    // Each row is a slide with [image, content] columns
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-features', cells });
  element.replaceWith(block);
}
