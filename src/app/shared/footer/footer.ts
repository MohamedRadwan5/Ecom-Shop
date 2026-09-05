import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  trustItems = [
    {
      icon: '🚚',
      title: 'Fast & Free Delivery',
      desc: 'Free delivery on all orders over $50'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      desc: '100% secure payment & data encryption'
    },
    {
      icon: '🎧',
      title: '24/7 Support',
      desc: 'Dedicated customer assistance anytime'
    }
  ];
}
