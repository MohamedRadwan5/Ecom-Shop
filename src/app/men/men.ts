import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-men',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './men.html',
  styleUrl: './men.css'
})
export class MenComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  addedToast = signal<string | null>(null);

  // Filters
  selectedCategory = signal<string>('all');
  selectedPriceRange = signal<string>('all');
  selectedSize = signal<string>('all');
  selectedColor = signal<string>('all');

  categories = ['All', 'Shirts', 'Suits', 'Shoes', 'Pants', 'Bags', 'Watches'];
  sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL'];
  colors = [
    { name: 'All', hex: 'transparent' },
    { name: 'Black', hex: '#0f172a' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Brown', hex: '#78350f' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Grey', hex: '#64748b' }
  ];

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      // Category filter
      if (this.selectedCategory() !== 'all') {
        const cat = this.selectedCategory().toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
        const title = p.title.toLowerCase();
        if (!sub.includes(cat) && !title.includes(cat)) return false;
      }

      // Price filter
      if (this.selectedPriceRange() === 'under-50' && p.price >= 50) return false;
      if (this.selectedPriceRange() === '50-100' && (p.price < 50 || p.price > 100)) return false;
      if (this.selectedPriceRange() === 'over-100' && p.price <= 100) return false;

      // Size filter
      if (this.selectedSize() !== 'all' && p.sizes && !p.sizes.includes(this.selectedSize())) {
        return false;
      }

      // Color filter
      if (this.selectedColor() !== 'all') {
        const targetColor = this.selectedColor().toLowerCase();
        const colorMap: Record<string, string[]> = {
          black: ['#0f172a', '#000000', '#18181b', '#1e293b', 'black'],
          blue: ['#2563eb', '#3b82f6', '#1e3a8a', '#1d4ed8', 'blue'],
          brown: ['#78350f', '#92400e', '#d97706', 'brown'],
          white: ['#f8fafc', '#ffffff', '#f1f5f9', 'white'],
          grey: ['#64748b', '#475569', 'grey', 'gray']
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
    this.productService.getMenProducts().subscribe({
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
      const section = document.getElementById('men-products-section');
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
