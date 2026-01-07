import type { Product, Category } from '../types'

const img = '/assets/images/logo.png'

export const categories: Category[] = ['Lamp', 'Statue', 'Cars', 'Lego Toys']

export const products: Product[] = [
  {
    id: 'lamp-aurora',
    name: 'Aurora Lamp',
    description: '3D printed ambient lamp with gradient shade.',
    price: 1499,
    category: 'Lamp',
    imageUrl: img,
  },
  {
    id: 'statue-dragon',
    name: 'Dragon Statue',
    description: 'Detailed fantasy dragon figure for display.',
    price: 1999,
    category: 'Statue',
    imageUrl: img,
  },
  {
    id: 'car-retro',
    name: 'Retro Car Model',
    description: 'Classic car miniature with moving wheels.',
    price: 1299,
    category: 'Cars',
    imageUrl: img,
  },
  {
    id: 'lego-blocks',
    name: 'Lego Style Blocks Set',
    description: 'Interlocking blocks compatible with popular sets.',
    price: 799,
    category: 'Lego Toys',
    imageUrl: img,
  },
  {
    id: 'lamp-nebula',
    name: 'Nebula Lamp',
    description: 'Starfield pattern mood light in PLA.',
    price: 1799,
    category: 'Lamp',
    imageUrl: img,
  },
]
