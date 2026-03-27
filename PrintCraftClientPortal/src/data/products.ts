export type ProductKind = 'tshirt' | 'shirt' | 'shorts' | 'tanktop' | 'other' | 'hoodie' | 'joggers' | 'sweatshirt';

export type Product = {
  id: string;
  name: string;
  kind: ProductKind;
  category: string;
  price: number;
  rating: number;
  description: string;
  badge?: string;
  leadTimeDays: number;
  minDpi: number;
  supportedFormats: string[];
  maxFileSizeMb: number;
};

export const products: Product[] = [
  {
    id: 'f4a9a1f1-6ab3-4e2a-b3d5-8d67ef4f1001',
    name: 'Custom Print T-Shirt',
    kind: 'tshirt',
    category: 'T-Shirts',
    price: 24,
    rating: 4.9,
    description: 'Classic cotton tee with front and back high-resolution print support.',
    badge: 'Most Ordered',
    leadTimeDays: 2,
    minDpi: 300,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    maxFileSizeMb: 20
  },
  {
    id: 'f4a9a1f1-6ab3-4e2a-b3d5-8d67ef4f1002',
    name: 'Custom Print Shirt',
    kind: 'shirt',
    category: 'Shirts',
    price: 29,
    rating: 4.8,
    description: 'Button-down shirt with premium direct-to-fabric print areas.',
    badge: 'Premium',
    leadTimeDays: 3,
    minDpi: 300,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    maxFileSizeMb: 20
  },
  {
    id: 'f4a9a1f1-6ab3-4e2a-b3d5-8d67ef4f1003',
    name: 'Custom Print Shorts',
    kind: 'shorts',
    category: 'Shorts',
    price: 27,
    rating: 4.7,
    description: 'Lightweight shorts with side-panel and lower-leg print zones.',
    leadTimeDays: 3,
    minDpi: 300,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    maxFileSizeMb: 20
  },
  {
    id: 'f4a9a1f1-6ab3-4e2a-b3d5-8d67ef4f1004',
    name: 'Custom Print Tank Top',
    kind: 'tanktop',
    category: 'Tank Tops',
    price: 22,
    rating: 4.8,
    description: 'Performance tank top built for vibrant artwork and logos.',
    badge: 'Fast Print',
    leadTimeDays: 2,
    minDpi: 300,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    maxFileSizeMb: 20
  },
  {
    id: 'f4a9a1f1-6ab3-4e2a-b3d5-8d67ef4f1005',
    name: 'Special Item (Other)',
    kind: 'other',
    category: 'Other',
    price: 35,
    rating: 4.6,
    description: 'Special-case item for custom printing requests outside the standard catalog.',
    badge: 'Special Case',
    leadTimeDays: 4,
    minDpi: 300,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    maxFileSizeMb: 25
  }
];

export const categories = ['All', 'T-Shirts', 'Shirts', 'Shorts', 'Tank Tops', 'Other'] as const;

