import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  bookingForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomType: 'double',
    checkIn: '',
    checkOut: '',
    guests: 2,
    message: ''
  };

  roomTypes = [
    { value: 'double', label: 'Chambre Double' },
    { value: 'triple', label: 'Chambre Triple' },
    { value: 'quadruple', label: 'Chambre Quadruple' }
  ];

  isSubmitted = false;

  onSubmit() {
    // Simulation d'envoi du formulaire
    // TODO: Implémenter l'envoi réel vers le backend
    this.isSubmitted = true;
    
    // Reset du formulaire après 3 secondes
    setTimeout(() => {
      this.isSubmitted = false;
      this.resetForm();
    }, 3000);
  }

  resetForm() {
    this.bookingForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roomType: 'double',
      checkIn: '',
      checkOut: '',
      guests: 2,
      message: ''
    };
  }
} 