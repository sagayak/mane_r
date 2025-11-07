
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  tower: string;
  floor: string;
  flat: string;
}
