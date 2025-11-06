export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Address {
  tower: string;
  floor: string;
  flat: string;
  name?: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  timestamp: string;
}