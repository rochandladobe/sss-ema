/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];

  const tabButtons = element.querySelectorAll('[role="tab"], .cmp-tabs__tab, .tab-button, button[data-tab]');
  const tabPanels = element.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel, .tab-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach((tab, i) => {
      const label = tab.textContent.trim();
      const panel = tabPanels[i];
      if (!panel) return;

      const labelCell = document.createElement('div');
      labelCell.textContent = label;

      const contentCell = document.createElement('div');
      const panelClone = panel.cloneNode(true);
      panelClone.querySelectorAll('script, style, [hidden]').forEach((el) => el.remove());
      contentCell.append(panelClone);

      cells.push([labelCell, contentCell]);
    });
  } else {
    const sections = element.querySelectorAll('.station-detail-section, .parsys > div, section, article');
    sections.forEach((section) => {
      const heading = section.querySelector('h2, h3, h4');
      const label = heading ? heading.textContent.trim() : 'Details';

      const labelCell = document.createElement('div');
      labelCell.textContent = label;

      const contentCell = document.createElement('div');
      const clone = section.cloneNode(true);
      clone.querySelectorAll('script, style, [hidden]').forEach((el) => el.remove());
      contentCell.append(clone);

      cells.push([labelCell, contentCell]);
    });
  }

  if (cells.length === 0) {
    const contentCell = document.createElement('div');
    contentCell.append(element.cloneNode(true));
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-station',
    cells,
  });
  element.replaceWith(block);
}
