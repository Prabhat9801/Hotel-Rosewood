/**
 * Verified property data for SPOT ON Hotel Rosewood, Risali, Bhilai.
 *
 * Every value here is traceable to a public source. Do not add a field
 * unless it can be pointed at one of these:
 *
 *  - Google Maps place listing (identity, address, landmark)
 *      https://maps.app.goo.gl/yaCxdqNXu1PyiiGM6
 *  - OYO listing 352690 and its embedded schema.org Hotel payload
 *      (address, geo, check-in/out, room category, amenity flags,
 *       aggregateRating ratingValue 0 / reviewCount 0, telephone)
 *      https://www.oyorooms.com/352690/
 *
 * Deliberately absent because no source confirms them: star rating,
 * guest reviews, restaurant, room service, front-desk hours, luggage
 * storage, parking, room count, and any hotel-owned phone or email.
 */

export const hotel = {
  brand: 'SPOT ON',
  name: 'Hotel Rosewood',
  fullName: 'SPOT ON Hotel Rosewood',
  oyoId: '352690',

  address: {
    plot: 'Plot No. 65/19, Block 367',
    street: 'Street 4/5, Pragati Nagar',
    locality: 'Risali',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pin: '490006',
    country: 'India',
    landmark: 'Hotel Samayra Inn',
  },

  /** From the schema.org GeoCoordinates on the OYO listing. */
  geo: { lat: 21.1609381, lng: 81.343532 },

  links: {
    maps: 'https://maps.app.goo.gl/yaCxdqNXu1PyiiGM6',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(
        'SPOT ON Hotel Rosewood, Street Number 4, Pragati Nagar, Risali, Bhilai, Chhattisgarh 490006',
      ),
    /**
     * Centred on the listing's own coordinates rather than a name query:
     * a text query resolves to the neighbouring landmark (Samaira Inn) and
     * would label the map — and its rating — with another business.
     */
    mapEmbed: 'https://maps.google.com/maps?q=21.1609381,81.343532&z=17&output=embed',
    booking: 'https://www.oyorooms.com/352690/',
  },

  /**
   * OYO's published central reservations line, taken from the listing's
   * schema.org `telephone`. Labelled as OYO reservations everywhere it
   * appears — it is not a hotel-owned desk number, and no hotel-owned
   * number is publicly listed.
   */
  reservations: { label: 'OYO reservations', phone: '+91 93139 31393' },

  stay: {
    checkIn: '12:00 PM',
    checkOut: '11:00 AM',
    roomName: 'Classic Room',
    roomSize: '9 sqm',
    couplesWelcome: true,
    petsAllowed: false,
    idNote: 'Any local or outstation photo ID is accepted at check-in. PAN cards are not accepted.',
  },

  /** The five features flagged as available on the OYO listing. */
  amenities: [
    { icon: 'wifi', label: 'Free Wi-Fi', note: 'Wireless internet throughout the property' },
    { icon: 'ac', label: 'Air conditioning', note: 'Wall-mounted AC in the room' },
    { icon: 'tv', label: 'Television', note: 'In-room TV' },
    { icon: 'geyser', label: 'Geyser', note: 'Hot water in the bathroom' },
    { icon: 'power', label: 'Power backup', note: 'Cover for local supply cuts' },
  ],

  /**
   * Straight-line distances for the Pragati Nagar locality, published by
   * onefivenine's locality page. Presented as approximate distances,
   * never as travel times.
   */
  nearby: [
    { name: 'Maroda railway station', distance: '3.6 km' },
    { name: 'Bhilai Nagar railway station', distance: '5.2 km' },
    { name: 'Durg Junction railway station', distance: '6.9 km' },
    { name: 'Bhilai Power House railway station', distance: '8 km' },
  ],

  /**
   * The building's own signage reads "Hotel Best Wood" while OYO trades
   * the property as "Hotel Rosewood". Surfaced on the site so an arriving
   * guest is not confused by the board above the door.
   */
  signageNote: 'Signage on the building reads “Hotel Best Wood”. OYO lists the property as Hotel Rosewood.',
} as const;

export type GalleryCategory = 'Exterior' | 'Reception' | 'Rooms' | 'Bathroom';

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  note: string;
  category: GalleryCategory;
};

/**
 * The property's own photographs, published on its OYO listing under
 * images.oyoroomscdn.com/uploads/hotel_image/352690/. Downloaded from the
 * full-resolution originals (3456x2304) and resized to a 1600px long edge.
 *
 * One continuous photoshoot: consistent camera, lighting and fixtures
 * across exterior, entrance, reception, corridor, rooms and bathrooms.
 * Nothing here is stock and nothing is from another property.
 */
export const galleryImages: GalleryImage[] = [
  {
    src: 'images/hotel/exterior-01.jpg',
    alt: 'Front elevation of SPOT ON Hotel Rosewood, a pink two-storey building in Risali, Bhilai, with an OYO sign above the first floor',
    caption: 'The building',
    note: 'Pink two-storey frontage on Street 4/5',
    category: 'Exterior',
  },
  {
    src: 'images/hotel/exterior-02.jpg',
    alt: 'Angled view of the hotel building showing the OYO board, ground-floor shops and the Hotel Best Wood banner',
    caption: 'From the street',
    note: 'Ground-floor shopfronts, first-floor rooms',
    category: 'Exterior',
  },
  {
    src: 'images/hotel/entrance-01.jpg',
    alt: 'Grey laser-cut metal double gate forming the hotel entrance, set into a pink wall with patterned floor tiling',
    caption: 'The entrance',
    note: 'Laser-cut gate off the street',
    category: 'Exterior',
  },
  {
    src: 'images/hotel/reception-01.jpg',
    alt: 'Reception desk with a white chevron-panelled front, a red RECEPTION plate and an OYO sign on the wall behind',
    caption: 'Reception',
    note: 'Chevron desk, daylight from the window',
    category: 'Reception',
  },
  {
    src: 'images/hotel/reception-02.jpg',
    alt: 'The reception counter seen straight on, with the OYO sign mounted above it',
    caption: 'The front desk',
    note: 'Where you check in',
    category: 'Reception',
  },
  {
    src: 'images/hotel/room-01.jpg',
    alt: 'Classic Room with a double bed, olive tufted headboard, wall-mounted air conditioner and a window beside the entry door',
    caption: 'The Classic Room',
    note: 'Double bed, tufted headboard, split AC',
    category: 'Rooms',
  },
  {
    src: 'images/hotel/room-02.jpg',
    alt: 'Classic Room with framed prints above the bed and the tiled private bathroom visible through the doorway',
    caption: 'Room and bathroom',
    note: 'Private bathroom off the room',
    category: 'Rooms',
  },
  {
    src: 'images/hotel/room-03.jpg',
    alt: 'Classic Room interior with a curtained window, air conditioner and framed botanical prints above the bed',
    caption: 'Daylight and air conditioning',
    note: 'Window, curtain, wall-mounted AC',
    category: 'Rooms',
  },
  {
    src: 'images/hotel/room-04.jpg',
    alt: 'Classic Room with a double bed beneath two framed black-and-white palm-leaf prints',
    caption: 'Made up and ready',
    note: 'Framed prints, marble floor',
    category: 'Rooms',
  },
  {
    src: 'images/hotel/room-05.jpg',
    alt: 'Room in the second block with a maroon cushioned headboard, framed prints and a rosewood door',
    caption: 'A room in the second block',
    note: 'Same layout, maroon headboard',
    category: 'Rooms',
  },
  {
    src: 'images/hotel/bathroom-01.jpg',
    alt: 'Private bathroom with teal marbled wall tiling, a western WC and a health faucet',
    caption: 'Private bathroom',
    note: 'Western WC, health faucet',
    category: 'Bathroom',
  },
  {
    src: 'images/hotel/bathroom-02.jpg',
    alt: 'Bathroom wash area with a wall-hung basin, oval mirror and teal marbled tiling',
    caption: 'Basin and mirror',
    note: 'Geyser-fed hot water',
    category: 'Bathroom',
  },
];

/** Category tabs, in display order, limited to categories that have images. */
export const galleryCategories: GalleryCategory[] = (
  ['Exterior', 'Reception', 'Rooms', 'Bathroom'] as GalleryCategory[]
).filter((category) => galleryImages.some((image) => image.category === category));
