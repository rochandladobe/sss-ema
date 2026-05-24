/* eslint-disable */
/* global WebImporter */

/**
 * Parser for booking-widget
 * Base block: booking-widget
 * Source: https://www.amtrak.com
 * Selector: .fareFinder, amt-md-farefinder, .md-farefinder
 * Generated: 2026-05-20
 *
 * This is a complex interactive booking widget (Angular component) with station
 * search, date picker, traveler count, and trip type options. Since it cannot be
 * statically imported, the parser creates a placeholder block with an empty cell.
 * The actual widget will be rendered by the block's JavaScript at runtime.
 */
export default function parse(element, { document }) {
  // Interactive widget - create a placeholder block with an empty content cell.
  // The booking-widget block JS will handle rendering the full interactive form.
  const cells = [
    [''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'booking-widget', cells });
  element.replaceWith(block);
}
