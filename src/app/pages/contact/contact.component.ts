import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactForm } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitted = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  contactInfo = {
    address: 'Avenue de la Paix, Hammamet Sud, Tunisie',
    phone: '+216 53479211',
    email: 'tanfous@gmail.com',
    hours: 'Réception 24h/24'
  };

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactService.sendMessage(this.contactForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message;
          this.isSubmitted = true;
          
          setTimeout(() => {
            this.isSubmitted = false;
            this.successMessage = '';
            this.resetForm();
          }, 5000);
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue lors de l\'envoi du message.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Contact form error:', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
      }
    });
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
