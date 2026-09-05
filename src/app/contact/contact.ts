import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';
import { AuthService } from '../services/auth.service';

interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent implements OnInit {
  private authService = inject(AuthService);

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  isSubmitted = signal(false);

  faqs: FAQ[] = [
    {
      question: 'How long does standard delivery take?',
      answer: 'Standard shipping inside Egypt takes 2 to 3 business days, with express same-day shipping available in Cairo & Giza.',
      open: true
    },
    {
      question: 'What is your return & exchange policy?',
      answer: 'You can return or exchange any unworn product within 14 days of delivery with original tags and packaging.',
      open: false
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Visa, MasterCard, Meeza, ValU installments, Fawry, and Cash on Delivery (COD).',
      open: false
    },
    {
      question: 'How can I track my live order status?',
      answer: 'Once your order is confirmed, you will receive an SMS and email with a live tracking link to follow your courier.',
      open: false
    }
  ];

  ngOnInit() {
    const currentUser = this.authService.getFullCurrentUser();
    if (currentUser) {
      this.formData.name = `${currentUser.firstName} ${currentUser.lastName}`.trim();
      this.formData.email = currentUser.email || '';
      this.formData.phone = currentUser.phoneNumber || '';
    }
  }

  toggleFaq(faq: FAQ) {
    faq.open = !faq.open;
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    // Store contact data in the user JSON file / record
    this.authService.saveContactMessage(this.formData);

    this.isSubmitted.set(true);
    setTimeout(() => {
      this.formData.message = '';
    }, 1000);
  }
}