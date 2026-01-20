
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Footer from './components/Footer';
import PromoBar from './components/PromoBar';
import { Product, CartItem, SockType, Order } from './types';
import { PRODUCTS, MIN_CARD_AMOUNT, SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import { CreditCard, ChevronDown, ListFilter } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase (solo si hay llaves)
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

type SortOption = 'price-asc' | 'price-desc' | 'best-sellers' | 'newest';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCloudSync, setIsCloudSync] = useState(!!supabase);
  const [isLoading, setIsLoading] = useState(true);
  
  const [typeFilter, setTypeFilter] = useState<SockType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');

  // Carga inicial (Nube o Local)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (supabase) {
        try {
          const { data: cloudProducts, error: pError } = await supabase.from('products').select('*');
          const { data: cloudOrders, error: oError } = await supabase.from('orders').select('*');

          if (!pError && cloudProducts && cloudProducts.length > 0) {
            setProducts(cloudProducts);
          } else {
            setProducts(PRODUCTS);
          }

          if (!oError && cloudOrders) {
            setOrders(cloudOrders);
          }
          setIsCloudSync(true);
        } catch (e) {
          console.error("Cloud Error, falling back to local", e);
          loadLocalData();
          setIsCloudSync(false);
        }
      } else {
        loadLocalData();
        setIsCloudSync(false);
      }
      setIsLoading(false);
    };

    const loadLocalData = () => {
      const savedProducts = localStorage.getItem('sn_style_products_v2');
      const savedOrders = localStorage.getItem('sn_style_orders_v2');
      setProducts(savedProducts ? JSON.parse(savedProducts) : PRODUCTS);
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    };

    loadData();
  }, []);

  const syncChanges = async (updatedProducts: Product[], updatedOrders: Order[]) => {
    setProducts(updatedProducts);
    setOrders(updatedOrders);
    
    localStorage.setItem('sn_style_products_v2', JSON.stringify(updatedProducts));
    localStorage.setItem('sn_style_orders_v2', JSON.stringify(updatedOrders));

    if (supabase) {
      try {
        await supabase.from('products').upsert(updatedProducts);
        if (updatedOrders.length > 0) {
          await supabase.from('orders').upsert(updatedOrders[0]);
        }
      } catch (e) {
        console.error("Sync Error", e);
      }
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products].filter(p => typeFilter === 'all' || p.type === typeFilter);
    switch (sortOrder) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'best-sellers': result.sort((a, b) => b.salesCount - a.salesCount); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [typeFilter, sortOrder, products]);

  const addToCart = (product: Product) => {
    const currentProduct = products.find(p => p.id === product.id);
    if (!currentProduct || currentProduct.stock <= 0) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= currentProduct.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = (orderId: string, paymentMethod: 'transfer' | 'card', total: number) => {
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cartItems.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity })),
      total,
      paymentMethod,
      status: 'pendiente'
    };

    const newProducts = products.map(p => {
      const itemInCart = cartItems.find(i => i.id === p.id);
      return itemInCart ? { 
        ...p, 
        stock: p.stock - itemInCart.quantity,
        salesCount: p.salesCount + itemInCart.quantity 
      } : p;
    });

    syncChanges(newProducts, [newOrder, ...orders]);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const confirmPayment = (orderId: string) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o as Order, status: 'pagado' as const } : o);
    syncChanges(products, newOrders);
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'cancelado') return;

    const newProducts = products.map(p => {
      const itemInOrder = order.items.find(i => i.productId === p.id);
      return itemInOrder ? { ...p, stock: p.stock + itemInOrder.quantity, salesCount: Math.max(0, p.salesCount - itemInOrder.quantity) } : p;
    });

    const newOrders = orders.map(o => o.id === orderId ? { ...o as Order, status: 'cancelado' as const } : o);
    syncChanges(newProducts, newOrders);
  };

  const updateFullProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    syncChanges(newProducts, orders);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pt-9">
      <PromoBar />
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        adminData={{ 
          isCloudSync,
          products, 
          orders, 
          confirmPayment, 
          cancelOrder, 
          manualStockAdjust: (id, q) => updateFullProduct({...products.find(p=>p.id===id)!, stock: q}), 
          updateFullProduct 
        }}
      />
      
      <main>
        <Hero />

        {/* Status de Sincronización (Oculto de la vista principal) */}
        <div className="flex justify-center -mt-20 relative z-20 pb-12 gap-4">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 border border-white/10 rounded-full">
            <CreditCard className="w-4 h-4 text-red-600" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/80">
              MINIMO TARJETA: ${MIN_CARD_AMOUNT}
            </span>
          </div>
        </div>

        <section id="shop" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
          {isLoading ? (
            <div className="py-40 flex flex-col items-center justify-center opacity-40 animate-pulse">
               <div className="w-12 h-12 border-4 border-white/10 border-t-red-600 rounded-full animate-spin mb-6" />
               <p className="font-sync text-xs uppercase tracking-[0.5em]">Sincronizando Stock...</p>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <span className="text-red-600 text-xs font-bold uppercase tracking-[0.5em] mb-4 block">Catálogo sn.style</span>
                <h2 className="text-5xl md:text-8xl font-sync font-bold tracking-tighter mb-12 uppercase leading-[0.9]">ELEGÍ TU <br className="hidden md:block" /> ESTILO</h2>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8">
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {(['all', 'zoquete', '1/4', '3/4'] as const).map((type) => (
                      <button key={type} onClick={() => setTypeFilter(type)} className={`px-8 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all border rounded-full ${typeFilter === type ? 'bg-white text-black border-white' : 'text-white/40 border-white/10 hover:border-white'}`}>{type === 'all' ? 'Ver Todo' : type}</button>
                    ))}
                  </div>
                  <div className="relative inline-block w-48">
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOption)} className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest py-3 pl-10 pr-4 appearance-none rounded-sm cursor-pointer outline-none focus:border-red-600/50">
                      <option value="newest" className="bg-black">Recientes</option>
                      <option value="best-sellers" className="bg-black">Más Vendidas</option>
                      <option value="price-asc" className="bg-black">Menor Precio</option>
                      <option value="price-desc" className="bg-black">Mayor Precio</option>
                    </select>
                    <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-600" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, q) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: q} : i))} onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} onCheckout={handleCheckout} />
    </div>
  );
};

export default App;
