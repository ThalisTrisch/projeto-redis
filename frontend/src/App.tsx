import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { LoginModal } from './components/LoginModal';
import { CartSidebar } from './components/CartSidebar';
import { Product, CartItem, User } from './types';
import { api } from './services/api';
import { fakeProducts, endpoint } from './data';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // UI State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => p.title.toLowerCase().includes(lowerQuery));
  }, [products, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const expirou = await logado();
    if (expirou) return;

    setAddingToCartId(product.id);
    try {
      await api.addToCart(user.email, product.id);
      
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      
      // Abre o carrinho para dar feedback visual
      setIsCartOpen(true);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    const expirou = await logado();
    if (expirou) return;
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCartQuantity = async (id: string, quantity: number) => {
    const expirou = await logado();
    if (expirou) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const logado = async () => {
    try {
      if (user?.email) {
        const response = await axios.get(`${endpoint}/ttl/auth:${user.email}`);
        console.log(response)
        if (response.data.expirou) {
          setUser(null);
          setIsLoginOpen(true);
          setCartItems([]);
          return true;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar usuário na API externa:', error);
    }
  }

  // Carrega o carrinho do Redis quando o usuário loga
  useEffect(() => {
    if (!user?.email) return;

    api.getCarrinho(user.email)
      .then(ids => {
        const itensDoCarrinho = fakeProducts
          .filter(p => ids.includes(p.id))
          .map(p => ({ ...p, quantity: 1 }));
        setCartItems(itensDoCarrinho);
      })
      .catch(err => console.error('Erro ao carregar carrinho:', err));
  }, [user]);

  // Fetch initial products
  useEffect(() => {
    setIsLoadingProducts(true);
    api.getProducts()
      .then(setProducts)
      .catch(err => console.error("Erro ao carregar produtos", err))
      .finally(() => setIsLoadingProducts(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#ebebeb] font-sans selection:bg-[#3483fa]/30">
      <Header 
        user={user}
        cartItems={cartItems}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={() => {
          setUser(null);
          setCartItems([]);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner/Slider Placeholder */}
        <div className="w-full h-48 md:h-72 bg-gradient-to-r from-[#ffe600] to-[#f4d03f] rounded-md mb-8 flex items-center justify-center shadow-sm overflow-hidden relative">
           <div className="absolute inset-0 bg-black/5"></div>
           <h1 className="text-3xl md:text-5xl font-light text-[#333] relative z-10 text-center px-4">
             As melhores ofertas <br/> <span className="font-semibold text-[#3483fa]">para você</span>
           </h1>
        </div>

        <h2 className="text-2xl text-[#666] font-light mb-6 flex items-center gap-2">
          {searchQuery ? 'Resultados da busca' : 'Ofertas do dia'}
        </h2>

        {isLoadingProducts ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3483fa]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-md shadow-sm">
             <p className="text-gray-500 text-lg">Nenhum produto encontrado para "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard    
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingToCartId === product.id}
              />
            ))}
          </div>
        )}
      </main>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={setUser}
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />
    </div>
  );
}
