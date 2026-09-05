import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './women.html',
  styleUrl: './women.css'
})
export class WomenComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  addedToast = signal<string | null>(null);

  // Filters
  selectedCategory = signal<string>('all');
  selectedPriceRange = signal<string>('all');
  selectedSize = signal<string>('all');
  selectedColor = signal<string>('all');

  categories = ['All', 'Dresses', 'Tops', 'Skirts', 'Bags', 'Shoes', 'Jewelry', 'Beauty'];
  sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  colors = [
    { name: 'All', hex: 'transparent' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Gold', hex: '#eab308' },
    { name: 'Black', hex: '#0f172a' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Blue', hex: '#3b82f6' }
  ];

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      // Category filter (support Dress/Dresses, Tops, Skirts, Shoes, Jewelry, Beauty, Bags)
      if (this.selectedCategory() !== 'all') {
        const cat = this.selectedCategory().toLowerCase();
        const catKey = cat === 'dresses' ? 'dress' : cat === 'shoes' ? 'shoe' : cat === 'skirts' ? 'skirt' : cat === 'tops' ? 'top' : cat;
        const sub = (p.subCategory || '').toLowerCase();
        const title = p.title.toLowerCase();
        const mainCat = (p.category || '').toLowerCase();
        if (!sub.includes(catKey) && !title.includes(catKey) && !mainCat.includes(catKey)) return false;
      }

      // Price filter
      if (this.selectedPriceRange() === 'under-50' && p.price >= 50) return false;
      if (this.selectedPriceRange() === '50-100' && (p.price < 50 || p.price > 100)) return false;
      if (this.selectedPriceRange() === 'over-100' && p.price <= 100) return false;

      // Size filter
      if (this.selectedSize() !== 'all' && p.sizes && !p.sizes.includes(this.selectedSize())) {
        return false;
      }

      // Color filter (filters products by selected color)
      if (this.selectedColor() !== 'all') {
        const targetColor = this.selectedColor().toLowerCase();
        const colorMap: Record<string, string[]> = {
          pink: ['#ec4899', '#f472b6', '#f43f5e', 'pink'],
          red: ['#ef4444', '#dc2626', '#b91c1c', '#be123c', '#9f1239', 'red'],
          gold: ['#eab308', '#f59e0b', '#d97706', '#fbbf24', 'gold', 'yellow'],
          black: ['#0f172a', '#000000', '#18181b', '#1f2937', '#1e293b', 'black'],
          white: ['#f8fafc', '#ffffff', '#f1f5f9', '#e2e8f0', 'white'],
          blue: ['#3b82f6', '#1e3a8a', '#0284c7', '#2563eb', 'blue']
        };

        const matches = colorMap[targetColor] || [targetColor];
        const prodColors = (p.colors || []).map(c => c.toLowerCase());
        const hasColor = prodColors.some(c => matches.some(m => c === m || c.includes(m) || m.includes(c)));
        if (!hasColor) return false;
      }

      return true;
    });
  });

  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getWomenProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  scrollToProducts() {
    if (typeof document !== 'undefined') {
      const section = document.getElementById('women-products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat.toLowerCase());
  }

  setPriceRange(range: string) {
    this.selectedPriceRange.set(range);
  }

  setSize(size: string) {
    this.selectedSize.set(size);
  }

  setColor(colorName: string) {
    this.selectedColor.set(colorName.toLowerCase());
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
    this.addedToast.set(`Added "${product.title}" to cart!`);
    setTimeout(() => {
      this.addedToast.set(null);
    }, 2500);
  }

  onImageError(productId: number | string) {
    this.products.update(list => list.filter(p => p.id !== productId));
  }
}
