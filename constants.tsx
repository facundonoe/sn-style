
import { Product } from './types';

export const WHATSAPP_NUMBER = '5493434054418';
export const INSTAGRAM_URL = 'https://www.instagram.com/sn.stylepna/';
export const DEFAULT_STOCK = 100;

// CONFIGURACIÓN DE BASE DE DATOS (Obtener de Supabase.com)
export const SUPABASE_URL = ''; // Ej: 'https://xyz.supabase.co'
export const SUPABASE_ANON_KEY = ''; // Tu Anon Key larga

export const LIST_PRICE = 2500;
export const SALE_PRICE = 2000;
export const PROMO_PACK_PRICE = 5000;
export const MIN_CARD_AMOUNT = 15000;

export interface CouponConfig {
  discount: number;
  limit: number;
  active: boolean;
}

export const VALID_COUPONS: Record<string, CouponConfig> = {
  'BIENVENIDA': {
    discount: 0.15,
    limit: 1,
    active: true
  },
  'MAYORISTA': {
    discount: 0.35,
    limit: 9999,
    active: true
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'am-1',
    name: 'Amanecer Oso Pink',
    price: SALE_PRICE,
    type: 'zoquete',
    gender: 'mujer',
    images: [
      'https://images.unsplash.com/photo-1582966298601-83c44a162935?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590243455799-73e48810c926?q=80&w=800&auto=format&fit=crop'
    ],
    stock: DEFAULT_STOCK,
    description: 'Diseño Amanecer con tierno personaje de oso en fondo rosa pastel.',
    salesCount: 45,
    createdAt: '2024-01-10'
  },
  {
    id: 'am-2',
    name: 'Amanecer Doggy White',
    price: SALE_PRICE,
    type: 'zoquete',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1603533273187-54890d70305a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ], 
    stock: DEFAULT_STOCK,
    description: 'Personaje Snoopy-style sobre base blanca de algodón premium.',
    salesCount: 120,
    createdAt: '2024-01-15'
  },
  {
    id: 'am-3',
    name: 'Amanecer Seal Blue',
    price: SALE_PRICE,
    type: '1/4',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1542219550-37153d387c27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1ec124?q=80&w=800&auto=format&fit=crop'
    ],
    stock: DEFAULT_STOCK,
    description: 'Medias 1/4 con diseño de foca y detalles celestes.',
    salesCount: 30,
    createdAt: '2024-02-01'
  },
  {
    id: 'st-vans',
    name: 'Street Vans Classic',
    price: 2200,
    type: '1/4',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1620138546344-7b2c38516edf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop'
    ],
    stock: DEFAULT_STOCK,
    description: 'El clásico logo de Vans en negro profundo, ideal para skaters.',
    salesCount: 200,
    createdAt: '2023-12-20'
  }
];
