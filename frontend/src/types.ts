export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  freeShipping: boolean;
  installments?: {
    count: number;
    value: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}
