/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import bookingWidgetParser from './parsers/booking-widget.js';
import heroBannerParser from './parsers/hero-banner.js';
import carouselPromoParser from './parsers/carousel-promo.js';
import tabsOnboardParser from './parsers/tabs-onboard.js';
import carouselFeaturesParser from './parsers/carousel-features.js';
import heroRewardsParser from './parsers/hero-rewards.js';

// TRANSFORMER IMPORTS
import amtrakCleanupTransformer from './transformers/amtrak-cleanup.js';
import amtrakSectionsTransformer from './transformers/amtrak-sections.js';

// PARSER REGISTRY
const parsers = {
  'booking-widget': bookingWidgetParser,
  'hero-banner': heroBannerParser,
  'carousel-promo': carouselPromoParser,
  'tabs-onboard': tabsOnboardParser,
  'carousel-features': carouselFeaturesParser,
  'hero-rewards': heroRewardsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  amtrakCleanupTransformer,
  amtrakSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  url: 'https://www.amtrak.com',
  blocks: [
    {
      name: 'booking-widget',
      instances: ['.fareFinder', 'amt-md-farefinder', '.md-farefinder'],
      section: 'grey',
    },
    {
      name: 'hero-banner',
      instances: ['.heroimageContainer', '.heroimage'],
    },
    {
      name: 'carousel-promo',
      instances: ['.carousel.special-offer-carousel .cmp-carousel'],
    },
    {
      name: 'tabs-onboard',
      instances: ['.tabs.onboarding-experience-tabs .cmp-tabs'],
    },
    {
      name: 'carousel-features',
      instances: ['.carousel-feature-area.homepage-carousel'],
    },
    {
      name: 'hero-rewards',
      instances: ['.cmp-experiencefragment--join-amtrak-guest-rewards-banner .teaser.guest-rewards'],
      section: 'dark-blue',
    },
  ],
  sections: [
    {
      name: 'Booking Widget',
      selector: '.cmp-experiencefragment--fareFinder',
      style: 'grey',
    },
    {
      name: 'Hero Banner',
      selector: '.heroimageContainer',
    },
    {
      name: 'Deals & Promotions',
      selector: '.carousel.special-offer-carousel',
    },
    {
      name: 'Onboard Experience',
      selector: '.tabs.onboarding-experience-tabs',
    },
    {
      name: 'Travel Tools',
      selector: '.carousel-feature-area.basecomponent',
    },
    {
      name: 'Guest Rewards Banner',
      selector: '.cmp-experiencefragment--join-amtrak-guest-rewards-banner',
      style: 'dark-blue',
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
