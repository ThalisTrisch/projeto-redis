import { Product } from './types';

export const fakeProducts: Product[] = [
  {
    id: '1',
    title: 'Smartphone Samsung Galaxy S23 Ultra 5g 512gb',
    price: 6599.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=Galaxy+S23',
    freeShipping: true,
    installments: { count: 10, value: 659.90 }
  },
  {
    id: '2',
    title: 'Notebook Apple MacBook Air M1 13.3" 8gb 256gb',
    price: 5999.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=MacBook+Air',
    freeShipping: true,
    installments: { count: 12, value: 499.91 }
  },
  {
    id: '3',
    title: 'Smart TV 55" 4K UHD Samsung Cu8000',
    price: 2499.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=Smart+TV',
    freeShipping: true,
    installments: { count: 10, value: 249.90 }
  },
  {
    id: '4',
    title: 'Console PlayStation 5 825GB Sony',
    price: 3999.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=PS5',
    freeShipping: true,
    installments: { count: 10, value: 399.90 }
  },
  {
    id: '5',
    title: 'Fone de Ouvido Apple AirPods Pro 2ª Geração',
    price: 1899.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=AirPods',
    freeShipping: true,
    installments: { count: 12, value: 158.25 }
  },
  {
    id: '6',
    title: 'Monitor Gamer LG UltraGear 27" 144Hz IPS',
    price: 1299.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=Monitor',
    freeShipping: false,
    installments: { count: 10, value: 129.90 }
  },
  {
    id: '7',
    title: 'Cadeira Gamer ThunderX3 TGC12 Preta',
    price: 1099.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=Cadeira',
    freeShipping: true,
    installments: { count: 10, value: 109.90 }
  },
  {
    id: '8',
    title: 'Mouse Gamer Sem Fio Logitech G Pro X Superlight',
    price: 799.00,
    image: 'https://placehold.co/400x400/ffffff/333333?text=Mouse',
    freeShipping: true,
    installments: { count: 10, value: 79.90 }
  }
];

export const endpoint = "http://localhost:1000"
