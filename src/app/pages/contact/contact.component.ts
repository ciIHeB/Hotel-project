import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitted = false;

  contactInfo = {
    address: 'Avenue de la Paix, Hammamet Sud, Tunisie',
    phone: '+216 53479211',
    email: 'tanfous@gmail.com',
    hours: 'Réception 24h/24'
  };

  onSubmit() {
    // TODO: Implémenter l'envoi réel vers le backend
    this.isSubmitted = true;
    
    setTimeout(() => {
      this.isSubmitted = false;
      this.resetForm();
    }, 3000);
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
