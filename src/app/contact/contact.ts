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
  isSending = signal(false);

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

  async onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    this.isSending.set(true);

    // Store contact data in the user JSON file / record
    this.authService.saveContactMessage(this.formData);

    // Send email to mr8161115@gmail.com via FormSubmit AJAX endpoint
    try {
      await fetch('https://formsubmit.co/ajax/mr8161115@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone || 'N/A',
          message: this.formData.message,
          _subject: `📩 New Contact Form Message from ${this.formData.name} - E-Com Shop`,
          _template: 'table'
        })
      });
    } catch (err) {
      console.error('Error sending email:', err);
    } finally {
      this.isSending.set(false);
      this.isSubmitted.set(true);
      setTimeout(() => {
        this.formData.message = '';
      }, 1000);
    }
  }
}