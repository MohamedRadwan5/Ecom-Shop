import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  hotDeals = signal<Product[]>([]);
  latestArrivals = signal<Product[]>([]);
  isLoading = signal(true);
  addedToast = signal<string | null>(null);

  // Section Pagination (12 products per page = 3 rows of 4 products)
  hotDealsPageIndex = signal(0);
  latestArrivalsPageIndex = signal(0);
  itemsPerPage = 12;

  displayedHotDeals = computed(() => {
    const list = this.hotDeals();
    if (!list || list.length === 0) return [];
    const totalPages = Math.ceil(list.length / this.itemsPerPage) || 1;
    const page = ((this.hotDealsPageIndex() % totalPages) + totalPages) % totalPages;
    const start = page * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  });

  displayedLatestArrivals = computed(() => {
    const list = this.latestArrivals();
    if (!list || list.length === 0) return [];
    const totalPages = Math.ceil(list.length / this.itemsPerPage) || 1;
    const page = ((this.latestArrivalsPageIndex() % totalPages) + totalPages) % totalPages;
    const start = page * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  });

  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getHotDeals().subscribe(deals => {
      this.hotDeals.set(deals);
    });

    this.productService.getLatestArrivals().subscribe(arrivals => {
      this.latestArrivals.set(arrivals);
      this.isLoading.set(false);
    });
  }

  getTotalPages(list: Product[]): number {
    return Math.ceil((list || []).length / this.itemsPerPage) || 1;
  }

  prevHotDeals() {
    const total = this.getTotalPages(this.hotDeals());
    this.hotDealsPageIndex.update(p => (p - 1 + total) % total);
  }

  nextHotDeals() {
    const total = this.getTotalPages(this.hotDeals());
    this.hotDealsPageIndex.update(p => (p + 1) % total);
  }

  setHotDealsPage(index: number) {
    this.hotDealsPageIndex.set(index);
  }

  prevLatestArrivals() {
    const total = this.getTotalPages(this.latestArrivals());
    this.latestArrivalsPageIndex.update(p => (p - 1 + total) % total);
  }

  nextLatestArrivals() {
    const total = this.getTotalPages(this.latestArrivals());
    this.latestArrivalsPageIndex.update(p => (p + 1) % total);
  }

  setLatestArrivalsPage(index: number) {
    this.latestArrivalsPageIndex.set(index);
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
    this.hotDeals.update(list => list.filter(p => p.id !== productId));
    this.latestArrivals.update(list => list.filter(p => p.id !== productId));
  }
}