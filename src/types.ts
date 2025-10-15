export interface Store {
  id: string;
  name: string;
  logo: string;
  averageDeliveryTime: number;
  deliveryFee: number;
  minimumOrder: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  unit: string;
  inStock: boolean;
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit?: 'pieces' | 'kg' | 'g';
  weight?: number;
}

export interface ComparisonResult {
  store: Store;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  deliveryTime: number;
  itemsFound: number;
  itemsMissing: number;
  matchedProducts: Array<{
    requestedItem: string;
    product: Product;
    quantity: number;
  }>;
  missingItems: string[];
}
