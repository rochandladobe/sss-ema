/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Amtrak section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Sections (from page-templates.json):
 * 1. Booking Widget (.cmp-experiencefragment--fareFinder) - style: grey
 * 2. Hero Banner (.heroimageContainer)
 * 3. Deals & Promotions (.carousel.special-offer-carousel)
 * 4. Onboard Experience (.tabs.onboarding-experience-tabs)
 * 5. Travel Tools (.carousel-feature-area.basecomponent)
 * 6. Guest Rewards Banner (.cmp-experiencefragment--join-amtrak-guest-rewards-banner) - style: dark-blue
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) {
      return;
    }

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) {
        continue;
      }

      // Find the closest ancestor that is a direct child of main/element
      // so we insert hr and metadata at the correct level
      let targetEl = sectionEl;
      while (targetEl.parentElement && targetEl.parentElement !== element) {
        targetEl = targetEl.parentElement;
      }

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section content (before next section break)
        if (targetEl.nextSibling) {
          targetEl.parentElement.insertBefore(sectionMetadata, targetEl.nextSibling);
        } else {
          targetEl.parentElement.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        targetEl.parentElement.insertBefore(hr, targetEl);
      }
    }
  }
}
