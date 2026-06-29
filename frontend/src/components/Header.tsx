import { Search, ShoppingCart, User as UserIcon, Menu } from 'lucide-react';
import { User, CartItem } from '../types';

interface HeaderProps {
  user: User | null;
  cartItems: CartItem[];
  onOpenLogin: () => void;
  onOpenCart: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Header({ user, cartItems, onOpenLogin, onOpenCart, onLogout, searchQuery, setSearchQuery }: HeaderProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-[#ffe600] w-full sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center gap-3">
        {/* Top Row: Logo & Search */}
        <div className="flex items-center gap-4 flex-1">
          <a href="#" className="flex-shrink-0">
            {/* Minimalist Logo approach */}
            <div className="text-[#333] font-bold text-xl tracking-tight leading-none flex items-center gap-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-serif italic text-2xl">
                e
              </div>
              <span className="hidden sm:block">commercelibre</span>
            </div>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Buscar produtos, marcas e muito mais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-sm py-2.5 px-4 pr-10 text-sm shadow-sm outline-none text-[#333] placeholder-gray-400 focus:shadow-md transition-shadow"
            />
            <button className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 border-l border-gray-200">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom/Right Row: Actions */}
        <nav className="flex items-center gap-6 justify-end text-sm text-[#333]">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                </div>
                <span className="hidden md:block truncate max-w-[120px]">Olá, {user.name}</span>
              </div>
              <button onClick={onLogout} className="hover:text-gray-600 transition-colors">
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              className="flex items-center gap-1 hover:text-gray-600 transition-colors font-medium"
            >
              <UserIcon className="w-5 h-5 md:hidden" />
              <span className="hidden md:block">Entre</span>
            </button>
          )}

          <button onClick={onOpenCart} className="relative flex items-center hover:text-gray-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#ffe600]">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
