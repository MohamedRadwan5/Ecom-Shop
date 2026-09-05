import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cart_items';
  
  cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  totalCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  shipping = computed(() => {
    if (this.cartItems().length === 0) return 0;
    return this.subtotal() >= 50 ? 0 : 9.99;
  });

  grandTotal = computed(() => {
    return this.subtotal() + this.shipping();
  });

  constructor() {
    // Automatically persist to localStorage on any cart change
    effect(() => {
      const items = this.cartItems();
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      }
    });
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  addToCart(product: Product, quantity: number = 1, size?: string, color?: string) {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(
        i => String(i.product.id) === String(product.id) &&
             i.selectedSize === size &&
             i.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...items, { product, quantity, selectedSize: size, selectedColor: color }];
      }
    });
  }

  updateQuantity(productId: string | number, quantity: number, size?: string, color?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, size, color);
      return;
    }

    this.cartItems.update(items => {
      return items.map(item => {
        if (String(item.product.id) === String(productId) &&
            (size === undefined || item.selectedSize === size) &&
            (color === undefined || item.selectedColor === color)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }

  removeFromCart(productId: string | number, size?: string, color?: string) {
    this.cartItems.update(items => {
      return items.filter(item => {
        if (String(item.product.id) === String(productId)) {
          if (size !== undefined && item.selectedSize !== size) return true;
          if (color !== undefined && item.selectedColor !== color) return true;
          return false;
        }
        return true;
      });
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
