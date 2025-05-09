export const fashionEvents = [
  {
    id: 'event1',
    title: 'GARANOO FASHION',
    date: 'NOV 24, 2025',
    location: 'PARIS',
    image: require('../../assets/image/granoofashion.jpg'), // Adjusted path
  },
  {
    id: 'event2',
    title: 'HIJAB FASHION',
    date: 'OCT 6, 2025',
    location: 'New York',
    image: require('../../assets/image/HijabFashion.jpg'), // Adjusted path
  },
  {
    id: 'event3',
    title: 'New York Fashion Week',
    date: 'AUGUST 19-20, 2023',
    location: 'New York',
    image: require('../../assets/image/newyorkFashion.jpg'), // Adjusted path
  },
  {
    id: 'event4',
    title: 'SOUTHEASTERN AFRICA FASHION SHOW',
    date: 'MAY 28, 2021',
    location: 'Nigeria',
    image: require('../../assets/image/AfricaFashion.jpg'), // Adjusted path
  },
  {
    id: 'event5',
    title: 'THE TUXEDO',
    date: 'APRIL 28, 2024',
    location: 'New York',
    image: require('../../assets/image/theTuxido.jpg'), // Adjusted path
  },
];

export const outfit = [
  {
    id: 'outfit1',
    title: 'African Elegant Dress',
    description: 'A light and breezy outfit perfect for occasions.',
    designer: 'Nindi Folawiyo',
    brand: 'Afro design',
    image: require('../../assets/image/African.jpg'), // Adjusted path
  },
  {
    id: 'outfit2',
    title: 'Elegant Evening Dress',
    description: 'A stunning evening dress for formal occasions.',
    designer: 'John Smith',
    brand: 'Evening Elegance',
    image: require('../../assets/image/Classic.jpg'), // Adjusted path
  },
  {
    id: 'outfit3',
    title: 'Business Casual',
    description: 'A smart outfit suitable for the office or meetings.',
    designer: 'Emily Johnson',
    brand: 'Office Chic',
    image: require('../../assets/image/businessCasual.jpg'), // Adjusted path
  },
  {
    id: 'outfit4',
    title: 'Hijab',
    description: 'Embrace sophistication and style with this elegant hijab outfit.',
    designer: 'Fatima Ibrahim',
    brand: 'Zara',
    image: require('../../assets/image/hijab.jpg'), // Adjusted path
  },
  {
    id: 'outfit5',
    title: 'Kids Collection',
    description: 'Comfortable for kids.',
    designer: 'Sarah Wilson',
    brand: 'Cozy Collection',
    image: require('../../assets/image/kids.jpg'), // Adjusted path
  },
];

export const mockUser = {
  id: 'user1',
  name: 'Nardos Kebede',
  username: '@styleexplorer',
  membership: 'Premium Member',
  avatar: require('../../assets/image/avatar.jpg'), // Adjusted path
  preferences: {
    styles: ['Streetwear', 'Minimalist', 'Business Casual'],
    brands: ['Zara', 'Nike', 'Gucci'],
    sizes: ['M', 'L', 'US 9'],
    colors: ['Neutrals', 'Blues', 'Black']
  },
  votes: [
    { id: '1', item: 'Oversized Denim Jacket', action: 'liked', date: '2023-10-15' },
    { id: '2', item: 'High-Waisted Trousers', action: 'disliked', date: '2023-10-10' }
  ],
  suggestions: [
    { id: '1', title: 'Monochromatic Outfits', reason: 'Matches your minimalist votes' },
    { id: '2', title: 'Oversized Blazers', reason: 'Trend you frequently engage with' }
  ]
};