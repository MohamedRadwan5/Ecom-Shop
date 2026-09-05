import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  menuOpen = false;
  formAction = 'https://formsubmit.co/se1629@fayoum.edu.eg';
  
  faqs: FaqItem[] = [
    {
      question: 'Shipping & Delivery',
      answer: 'We deliver across Egypt within 2-5 business days, with free shipping on orders over 500 EGP.',
      open: false
    },
    {
      question: 'Return Policy',
      answer: "Items can be returned within 14 days of delivery, provided they're unused and in original packaging.",
      open: false
    },
    {
      question: 'Payment Methods',
      answer: 'We accept cash on delivery, credit/debit cards, and mobile wallets.',
      open: false
    },
    {
      question: 'Any Quick Links',
      answer: 'Check our Help Center for account, order tracking, and product guides.',
      open: false
    }
  ];

  features: { icon: string; label: string }[] = [
    { icon: '🚚', label: 'Fast & Free Delivery' },
    { icon: '🔒', label: 'Secure Payments' },
    { icon: '🎧', label: '24/7 Support' }
  ];

  toggleFaq(item: FaqItem): void {
    item.open = !item.open;
  }
}