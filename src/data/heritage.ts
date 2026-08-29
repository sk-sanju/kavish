export interface HeritageStory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  details: string[];
}

export const HERITAGE_STORIES: HeritageStory[] = [
  {
    id: 'kuthampully-legacy',
    title: 'The 500-Year Legacy of Kuthampully',
    subtitle: 'Thrissur’s Royal Weaving Village & Devanga Master Weavers',
    description: 'Situated along the banks of the Bharathapuzha (Nila) river in Thiruvilwamala, Thrissur, Kuthampully has been Kerala’s epicenter of handloom weaving for over 5 centuries. In the 16th century, the erstwhile Royal Family of Kochi invited master weavers from the Devanga community to craft exclusive ceremonial attire, Kasavu sarees, and temple vestments for the royal court.',
    image: '/assets/heritage/heritage_mastery.jpg',
    details: [
      'Invited by the Kochi Royal Court over 500 years ago',
      'Preserved by Devanga Chettiar master artisan families',
      'Granted official Geographical Indication (GI Tag) Status in 2011',
      'Traditional non-motorized pit-loom & jacquard weaving'
    ]
  },
  {
    id: 'pitloom-artistry',
    title: 'Authentic Pit-Loom Craftsmanship',
    subtitle: 'Zero Mechanization, 100% Hand-Woven Perfection',
    description: 'Every Kavish garment is produced in our Kuthampully weaving house on traditional pit looms. A single Kasavu tissue saree takes between 7 to 14 days of intensive manual weaving, ensuring incredible softness, structural integrity, and exquisite drape that power looms can never replicate.',
    image: '/assets/heritage/heritage_craft.jpg',
    details: [
      'Hand-twisted unbleached combed cotton yarns',
      '24k electroplated gold zari & silver thread border drapes',
      'Eco-friendly starching with native tapioca and organic rice sizing',
      'Fair-wage patronage for Kuthampully artisan families'
    ]
  },
  {
    id: 'kasavu-royalty',
    title: 'The Royal Kasavu Signature',
    subtitle: 'From Temple Ceremonies to Global Haute Couture',
    description: 'The golden Kasavu border of Kuthampully is synonymous with Kerala’s celebratory spirit — worn during Onam, Vishu, royal weddings, and sacred festivities. Kavish honors this legacy while tailoring modern relaxed silhouettes for discerning patrons worldwide.',
    image: '/assets/heritage/heritage_gitag.jpg',
    details: [
      'Certified 100% authentic Kuthampully GI Handloom',
      'Tarnish-resistant electroplated gold thread protection',
      'Tailored European linen & organic cotton blends',
      'Delivered in royal gold-embossed keepsake boxes'
    ]
  }
];
