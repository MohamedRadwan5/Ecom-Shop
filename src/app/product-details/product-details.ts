import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  isLoading = signal(true);
  quantity = signal(1);
  selectedSize = signal<string>('M');
  selectedColor = signal<string>('');
  addedToCartMessage = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        if (prod) {
          this.product.set(prod);
          if (prod.sizes && prod.sizes.length > 0) {
            this.selectedSize.set(prod.sizes[0]);
          }
          if (prod.colors && prod.colors.length > 0) {
            this.selectedColor.set(prod.colors[0]);
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  increaseQty() {
    this.quantity.update(q => q + 1);
  }

  decreaseQty() {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  setSize(size: string) {
    this.selectedSize.set(size);
  }

  setColor(color: string) {
    this.selectedColor.set(color);
  }

  addToCart() {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(
        prod,
        this.quantity(),
        this.selectedSize(),
        this.selectedColor()
      );
      this.addedToCartMessage.set(true);
      setTimeout(() => {
        this.addedToCartMessage.set(false);
      }, 3000);
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }
}
