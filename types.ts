
export type SockType = 'zoquete' | '1/4' | '3/4';
export type Gender = 'hombre' | 'mujer' | 'unisex';

export interface Product {
  id: string;
  name: string;
  price: number;
  type: SockType;
  gender: Gender;
  images: string[];
  stock: number;
  description: string;
  salesCount: number; // Para ordenar por "Más vendidas"
  createdAt: string;  // Para ordenar por "Más recientes"
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pendiente' | 'pagado' | 'cancelado';

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
  }[];
  total: number;
  paymentMethod: 'transfer' | 'card';
  status: OrderStatus;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
