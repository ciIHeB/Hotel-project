import { Component, OnInit } from '@angular/core';
import { BookingService, BookingResponse } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  constructor(private bookingService: BookingService, private route: ActivatedRoute) {}

  selectedService: string | null = null;
  wellnessOptions = ['Spa', 'Hammam', 'Massages', 'Salle de Sport'];
  selectedRoomName: string | null = null;

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
    message: '',
    wellnessService: '',
    wellnessTime: ''
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

  // Multi-room support
  additionalRooms: Array<{ roomType: 'standard' | 'deluxe' | 'suite' | 'presidential'; quantity: number }> = [];
  newRoom: { roomType: 'standard' | 'deluxe' | 'suite' | 'presidential' | ''; quantity: number } = { roomType: '', quantity: 1 };

  ngOnInit(): void {
    const svc = this.route.snapshot.queryParamMap.get('service');
    const roomName = this.route.snapshot.queryParamMap.get('room');
    if (svc) {
      this.selectedService = svc;
      this.bookingForm.wellnessService = svc;
      if (!this.bookingForm.message) {
        this.bookingForm.message = `Service bien-être souhaité: ${svc}`;
      }
    }
    if (roomName) {
      this.selectedRoomName = roomName;
      const mapped = this.mapRoomNameToType(roomName);
      if (mapped) {
        this.bookingForm.roomType = mapped;
      }
    }
  }

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
      specialRequests: this.composeSpecialRequests()
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
      message: '',
      wellnessService: '',
      wellnessTime: ''
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

  private composeSpecialRequests(): string {
    const lines: string[] = [];
    if (this.bookingForm.message) lines.push(this.bookingForm.message);
    if (this.bookingForm.wellnessService) lines.push(`Wellness: ${this.bookingForm.wellnessService}`);
    if (this.bookingForm.wellnessTime) lines.push(`Heure souhaitée: ${this.bookingForm.wellnessTime}`);
    if (this.additionalRooms.length) {
      const label = (val: string) => this.roomTypes.find(t => t.value === val)?.label || val;
      const parts = this.additionalRooms.map(r => `${r.quantity}× ${label(r.roomType)}`);
      lines.push(`Chambres supplémentaires: ${parts.join(', ')}`);
    }
    return lines.join(' | ');
  }

  private mapRoomNameToType(name: string): 'standard' | 'deluxe' | 'suite' | 'presidential' | '' {
    const n = name.toLowerCase();
    if (/(standard)/.test(n)) return 'standard';
    if (/(deluxe)/.test(n)) return 'deluxe';
    if (/(presidential|presidentielle|présidentielle)/.test(n)) return 'presidential';
    if (/(suite)/.test(n)) return 'suite';
    return '';
  }

  getRoomTypeLabel(value: string): string {
    return this.roomTypes.find(t => t.value === value)?.label || value;
  }

  addAdditionalRoom() {
    if (!this.newRoom.roomType || this.newRoom.quantity < 1) return;
    const idx = this.additionalRooms.findIndex(r => r.roomType === this.newRoom.roomType);
    if (idx >= 0) {
      this.additionalRooms[idx].quantity += this.newRoom.quantity;
    } else {
      this.additionalRooms.push({ roomType: this.newRoom.roomType as any, quantity: this.newRoom.quantity });
    }
    this.newRoom = { roomType: '', quantity: 1 };
  }

  removeAdditionalRoom(index: number) {
    this.additionalRooms.splice(index, 1);
  }
}