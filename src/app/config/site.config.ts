/**
 * Media in `src/app/img/` → built into `media/<filename>` (see `angular.json` assets).
 *
 * Use a path **without** a leading slash so it respects `<base href>` on GitHub Pages
 * (e.g. site at /DrScrub.github.io/). A root path like `/media/...` would load from
 * https://user.github.io/media/... and break images/videos.
 */
function mediaFile(filename: string): string {
  return `media/${encodeURIComponent(filename)}`;
}

export const SITE_CONFIG = {
  /**
   * Increment when you change code and deploy (e.g. 1.1 → 1.2) so the live site shows the new build.
   * Shown bottom-right as `v…`.
   */
  appVersion: '1.4',
  /** Shown with the build badge (bottom-right). */
  creditName: 'Pedro Calisto',
  brand: 'Dr. Scrub',
  /** Full geography for body copy (always include country). */
  serviceArea: 'New England, United States',
  /** Shorter label for the header, chips, and badges. */
  serviceAreaShort: 'New England, USA',
  tagline: 'Mirror-finish floors. Zero drama.',
  subhead:
    'Dr. Scrub serves commercial and residential properties — stores, offices, warehouses, and homes — with strip, wax, and ongoing floor care. Based in New England, United States; we operate across the six-state region.',
  services: [
    {
      key: 'strip-wax',
      title: 'Strip & wax',
      blurb:
        'Full finish removal, deep prep, and premium wax systems that restore depth, clarity, and slip-resistant shine.',
      points: ['Finish removal & neutralization', 'Coating build to spec', 'Burnishable brilliance'],
    },
    {
      key: 'maintenance',
      title: 'Floor maintenance',
      blurb:
        'Scheduled programs that protect your investment: scrub/recoat cycles, spot care, and proactive traffic-pattern management.',
      points: ['Programmed visits', 'Traffic-zone focus', 'Asset life extension'],
    },
  ],
  markets: ['Commercial', 'Residential'],
  /**
   * U.S. business contact (country code +1 / NANP).
   * Replace placeholders with your real email and mobile before going live.
   */
  contact: {
    email: 'hello@drscrub.example',
    /** Shown on the page, e.g. +1 (area) exchange-number */
    phoneDisplay: '+1 (617) 555-0123',
    /** E.164 for tel: and sms: (required for tap-to-call and Messages/SMS) */
    phoneE164: '+16175550123',
  },
  clients: [
    'AutoZone',
    'Ocean State Job Lot',
    'Hobby Lobby',
    'Petco',
    'Staples',
    "Shaw's",
    'Cumberland Farms',
    '& many more',
  ],
  media: {
    /** Hero background — equipment / machine */
    hero: mediaFile('WhatsApp Image 2026-05-10 at 17.36.31.jpeg'),
    machine: mediaFile('WhatsApp Image 2026-05-10 at 17.36.31.jpeg'),
    /** Before photo (slider) */
    before: mediaFile('BEFORE.jpeg'),
    /** After photo (slider) */
    after: mediaFile('after.jpeg'),
    /** On-site process footage */
    videoMake: mediaFile('MAKE.mp4'),
    /** Finished results footage */
    videoDone: mediaFile('done.mp4'),
  },
};
