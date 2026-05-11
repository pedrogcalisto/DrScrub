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
   * Bump this when you ship (e.g. 1.1) so you can confirm the live build matches.
   * Shown fixed bottom-right on the site.
   */
  appVersion: '1.0',
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
