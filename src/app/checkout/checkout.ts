import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {
  deliveryInfo = {
    fullName: '',
    phone: '',
    city: 'Cairo',
    address: '',
    building: '',
    notes: ''
  };

  selectedPaymentMethod = signal<'cod' | 'card' | 'fawry' | 'valu'>('cod');
  isOrderPlaced = signal(false);
  orderNumber = signal('');
  placedDate = signal(new Date());

  cities = ['Cairo', 'Giza', '6th of October', 'Alexandria', 'Mansoura', 'Tanta', 'Aswan', 'Luxor'];

  constructor(public cartService: CartService, private router: Router) {}

  updateQty(item: CartItem, change: number) {
    const newQty = item.quantity + change;
    this.cartService.updateQuantity(item.product.id, newQty, item.selectedSize, item.selectedColor);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
  }

  setPaymentMethod(method: 'cod' | 'card' | 'fawry' | 'valu') {
    this.selectedPaymentMethod.set(method);
  }

  placeOrder() {
    if (!this.deliveryInfo.fullName || !this.deliveryInfo.phone || !this.deliveryInfo.address) {
      alert('Please fill in your delivery details (Full Name, Phone, and Address).');
      return;
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber.set(`ECO-${randomNum}`);
    this.isOrderPlaced.set(true);
    
    // Clear cart in local storage
    this.cartService.clearCart();
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }
}
