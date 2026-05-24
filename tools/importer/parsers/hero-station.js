/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];

  const h1 = element.querySelector('h1');
  const subtitle = element.querySelector('h3, .station-subtitle, .hero-subtitle');
  const img = element.querySelector('img');

  const contentCell = document.createElement('div');
  if (h1) contentCell.append(h1.cloneNode(true));
  if (subtitle) contentCell.append(subtitle.cloneNode(true));

  if (img) {
    const imgCell = document.createElement('div');
    imgCell.append(img.cloneNode(true));
    cells.push([imgCell, contentCell]);
  } else {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-station',
    cells,
  });
  element.replaceWith(block);
}
