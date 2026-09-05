import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-electronics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './electronics.html',
  styleUrl: './electronics.css'
})
export class ElectronicsComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  addedToast = signal<string | null>(null);

  // Filters
  selectedCategory = signal<string>('all');
  selectedPriceRange = signal<string>('all');
  selectedBrand = signal<string>('all');

  categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming'];
  brands = ['All', 'TechPro', 'NovaTech', 'SonicWave', 'PulseGear', 'PlayPro', 'BassBoom'];
  priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $100', value: 'under-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: 'Over $500', value: 'over-500' }
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

      // Brand filter
      if (this.selectedBrand() !== 'all') {
        if ((p.brand || '').toLowerCase() !== this.selectedBrand().toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (this.selectedPriceRange() === 'under-100' && p.price >= 100) return false;
      if (this.selectedPriceRange() === '100-500' && (p.price < 100 || p.price > 500)) return false;
      if (this.selectedPriceRange() === 'over-500' && p.price <= 500) return false;

      return true;
    });
  });

  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getElectronicsProducts().subscribe({
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
      const section = document.getElementById('electronics-products-section');
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

  setBrand(brand: string) {
    this.selectedBrand.set(brand);
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
