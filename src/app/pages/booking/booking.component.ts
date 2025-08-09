import { Component } from '@angular/core';
import { BookingService, BookingResponse } from '../../services/booking.service';
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
  bookingConfirmation: any = null;

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
      next: (response: BookingResponse) => {
        this.isSubmitted = true;
        this.isSubmitting = false;
        this.bookingConfirmation = response.data;
        // Reset du formulaire après 10 secondes
        setTimeout(() => {
          this.isSubmitted = false;
          this.bookingConfirmation = null;
          this.resetForm();
        }, 10000);
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
    this.bookingConfirmation = null;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onCheckInChange() {
    // If check-out is before or same as check-in, clear it
    if (this.bookingForm.checkOut && this.bookingForm.checkOut <= this.bookingForm.checkIn) {
      this.bookingForm.checkOut = '';
    }
  }

  getMinCheckOutDate(): string {
    if (this.bookingForm.checkIn) {
      const checkInDate = new Date(this.bookingForm.checkIn);
      checkInDate.setDate(checkInDate.getDate() + 1);
      return checkInDate.toISOString().split('T')[0];
    }
    return this.getMinDate();
  }
}