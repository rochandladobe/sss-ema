/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const h1 = element.querySelector('h1, h2');
  const img = element.querySelector('img');
  const p = element.querySelector('p');

  const contentCell = document.createElement('div');
  if (h1) contentCell.append(h1.cloneNode(true));
  if (p) contentCell.append(p.cloneNode(true));

  if (img) {
    const imgCell = document.createElement('div');
    imgCell.append(img.cloneNode(true));
    cells.push([imgCell, contentCell]);
  } else {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-city',
    cells,
  });
  element.replaceWith(block);
}
