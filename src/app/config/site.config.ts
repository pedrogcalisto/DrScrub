function mediaFile(filename: string): string {
  return `media/${encodeURIComponent(filename)}`;
}

export const SITE_CONFIG = {
  appVersion: '2.5',
  creditName: 'Pedro Calisto',
  creditLinkedInUrl: 'https://www.linkedin.com/in/pedrogcalisto',
  brand: 'Dr. Scrub',
  logoUrl: 'img/logo.png',
  serviceArea: 'New England, United States',
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
  contact: {
    phoneDisplay: '(774) 245-4980',
    phoneE164: '+17742454980',
    addressLine1: '15 Fruit Street',
    addressLine2: 'Milford, Massachusetts',
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
    hero: mediaFile('WhatsApp Image 2026-05-10 at 17.36.31.jpeg'),
    machine: mediaFile('WhatsApp Image 2026-05-10 at 17.36.31.jpeg'),
    before: mediaFile('BEFORE.jpeg'),
    after: mediaFile('after.jpeg'),
    videoMake: mediaFile('MAKE.mp4'),
    videoDone: mediaFile('done.mp4'),
  },
};
