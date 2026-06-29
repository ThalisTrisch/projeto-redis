import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

export function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="bg-white rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col group cursor-pointer h-full">
      {/* Image Container */}
      <div className="w-full aspect-square border-b border-gray-100 p-4 flex items-center justify-center bg-white rounded-t-md">
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h2 className="text-[22px] text-[#333] font-light leading-none mb-1">
            {formatPrice(product.price)}
          </h2>
          
          {product.installments && (
            <p className="text-sm text-[#00a650] mb-2">
              em {product.installments.count}x {formatPrice(product.installments.value)}
            </p>
          )}

          {product.freeShipping && (
            <p className="text-xs font-semibold text-[#00a650] mb-3">
              Frete grátis
            </p>
          )}

          <h3 className="text-sm text-[#666] font-normal line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={isAdding}
          className="mt-4 w-full bg-[#3483fa]/10 text-[#3483fa] hover:bg-[#3483fa]/20 font-semibold py-2 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  );
}
