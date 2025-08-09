import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
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
  constructor(private bookingService: BookingService) {}
  bookingForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomType: 'standard',
    checkIn: '',
    checkOut: '',
    guestsAdults: 2,
    guestsChildren: 0,
    message: ''
  };

  roomTypes = [
    { value: 'standard', label: 'Chambre Standard' },
    { value: 'deluxe', label: 'Chambre Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Suite Présidentielle' }
  ];

  isSubmitted = false;
  isSubmitting = false;
  submitError = '';

  onSubmit() {
    if (!this.bookingForm.checkIn || !this.bookingForm.checkOut) {
      this.submitError = 'Veuillez sélectionner les dates d\'arrivée et de départ.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const bookingData = {
      contactEmail: this.bookingForm.email,
      contactPhone: this.bookingForm.phone,
      roomType: this.bookingForm.roomType,
      checkIn: this.bookingForm.checkIn,
      checkOut: this.bookingForm.checkOut,
      guestsAdults: this.bookingForm.guestsAdults,
      guestsChildren: this.bookingForm.guestsChildren,
      specialRequests: this.bookingForm.message
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.isSubmitted = true;
        this.isSubmitting = false;
        // Reset du formulaire après 5 secondes
        setTimeout(() => {
          this.isSubmitted = false;
          this.resetForm();
        }, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.error?.message || 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.';
        console.error('Booking error:', error);
      }
    });
  }

  resetForm() {
    this.bookingForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roomType: 'standard',
      checkIn: '',
      checkOut: '',
      guestsAdults: 2,
      guestsChildren: 0,
      message: ''
    };
    this.submitError = '';
  }
}