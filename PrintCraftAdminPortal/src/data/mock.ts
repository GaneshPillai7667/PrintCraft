export type AdminProduct = {
  id: string;
  name: string;
  category: 'T-Shirts' | 'Shirts' | 'Shorts' | 'Tank Tops' | 'Other';
  stock: number;
  status: 'Active' | 'Draft';
  price: number;
  sold: number;
};

export type AdminOrder = {
  id: string;
  customer: string;
  amount: number;
  status: 'Queued' | 'In Production' | 'Shipped';
  date: string;
  priority: 'Same Day' | 'Express' | 'VIP' | 'Normal';
  orderType: 'Standard' | 'Bulk';
  paymentStatus: 'Pending Contact' | 'Quote Sent' | 'Paid Offline';
  paymentMode: 'Manual Contact';
  clothingType: 'tshirt' | 'shirt' | 'shorts' | 'tanktop' | 'other';
  size: string;
  quantity: number;
  designFileName: string;
  notes?: string;
  contactPhone?: string;
};

export type AdminBulkOrder = {
  id: string;
  company: string;
  contactPerson: string;
  contactEmail: string;
  totalUnits: number;
  productMix: string;
  requestedDate: string;
  status: 'New Lead' | 'Quoted' | 'Negotiation' | 'Confirmed' | 'In Production';
  paymentStatus: 'Pending Contact' | 'Quote Sent' | 'Paid Offline';
  estimatedAmount: number;
  notes?: string;
};

export const adminProducts: AdminProduct[] = [
  { id: 'p1', name: 'Custom Print T-Shirt', category: 'T-Shirts', stock: 120, status: 'Active', price: 24, sold: 1340 },
  { id: 'p2', name: 'Custom Print Shirt', category: 'Shirts', stock: 84, status: 'Active', price: 29, sold: 920 },
  { id: 'p3', name: 'Custom Print Shorts', category: 'Shorts', stock: 96, status: 'Active', price: 27, sold: 710 },
  { id: 'p4', name: 'Custom Print Tank Top', category: 'Tank Tops', stock: 132, status: 'Active', price: 22, sold: 880 },
  { id: 'p5', name: 'Special Item (Other)', category: 'Other', stock: 28, status: 'Draft', price: 35, sold: 140 }
];

export const adminOrders: AdminOrder[] = [
  {
    id: 'ORD-1001',
    customer: 'Alice V',
    amount: 112,
    status: 'Queued',
    date: '2026-03-01',
    priority: 'Express',
    orderType: 'Standard',
    paymentStatus: 'Pending Contact',
    paymentMode: 'Manual Contact',
    clothingType: 'tshirt',
    size: 'M',
    quantity: 4,
    designFileName: 'alice_logo_front.png',
    contactPhone: '+1-555-303-0091'
  },
  {
    id: 'ORD-1002',
    customer: 'Beta Corp',
    amount: 1480,
    status: 'In Production',
    date: '2026-03-02',
    priority: 'VIP',
    orderType: 'Bulk',
    paymentStatus: 'Quote Sent',
    paymentMode: 'Manual Contact',
    clothingType: 'other',
    size: 'Mixed',
    quantity: 120,
    designFileName: 'beta_campaign_artwork_v3.jpeg',
    notes: 'Need corporate tag on each item',
    contactPhone: '+1-555-900-4500'
  },
  {
    id: 'ORD-1003',
    customer: 'North Hub',
    amount: 264,
    status: 'Shipped',
    date: '2026-02-28',
    priority: 'Normal',
    orderType: 'Standard',
    paymentStatus: 'Paid Offline',
    paymentMode: 'Manual Contact',
    clothingType: 'shirt',
    size: 'L',
    quantity: 8,
    designFileName: 'northhub_uniform_shirt.webp'
  },
  {
    id: 'ORD-1004',
    customer: 'Crea Labs',
    amount: 790,
    status: 'Queued',
    date: '2026-03-02',
    priority: 'Same Day',
    orderType: 'Bulk',
    paymentStatus: 'Pending Contact',
    paymentMode: 'Manual Contact',
    clothingType: 'tanktop',
    size: 'Mixed',
    quantity: 60,
    designFileName: 'crealabs_sport_campaign.png',
    notes: 'Require color match check before print'
  }
];

export const adminBulkOrders: AdminBulkOrder[] = [
  {
    id: 'BLK-2201',
    company: 'Beta Corp',
    contactPerson: 'Mira Lewis',
    contactEmail: 'mira@betacorp.com',
    totalUnits: 120,
    productMix: 'Other (special item), T-Shirts',
    requestedDate: '2026-03-05',
    status: 'Negotiation',
    paymentStatus: 'Quote Sent',
    estimatedAmount: 1480,
    notes: 'Final artwork approved; waiting PO confirmation'
  },
  {
    id: 'BLK-2202',
    company: 'Riverside Schools',
    contactPerson: 'Daniel Park',
    contactEmail: 'daniel@riverside.edu',
    totalUnits: 340,
    productMix: 'T-Shirts, Shorts',
    requestedDate: '2026-03-08',
    status: 'Quoted',
    paymentStatus: 'Quote Sent',
    estimatedAmount: 5520
  },
  {
    id: 'BLK-2203',
    company: 'FitWear Teams',
    contactPerson: 'Anika Rao',
    contactEmail: 'anika@fitwear.com',
    totalUnits: 500,
    productMix: 'Tank Tops, Shirts',
    requestedDate: '2026-03-15',
    status: 'New Lead',
    paymentStatus: 'Pending Contact',
    estimatedAmount: 9100
  }
];

export const cmsSections = [
  { id: 'hero', title: 'Hero Banner', enabled: true, order: 1 },
  { id: 'featured', title: 'Featured Products', enabled: true, order: 2 },
  { id: 'brands', title: 'Brand Partners', enabled: true, order: 3 },
  { id: 'testimonials', title: 'Testimonials', enabled: false, order: 4 },
  { id: 'footer', title: 'Footer CTA', enabled: true, order: 5 }
];
