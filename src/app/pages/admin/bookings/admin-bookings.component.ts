import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Booking } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  loading = true;
  showModal = false;
  searchTerm = '';
  statusFilter = 'all';

  currentBooking: Partial<Booking> = {};

  bookingStatuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
  paymentStatuses = ['pending', 'paid', 'refunded', 'failed'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.adminService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.data || [];
        this.filteredBookings = [...this.bookings];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
      }
    });
  }

  filterBookings() {
    let filtered = [...this.bookings];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.User?.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.User?.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.User?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.Room?.roomNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === this.statusFilter);
    }

    this.filteredBookings = filtered;
  }

  openModal(booking: Booking) {
    this.showModal = true;
    this.currentBooking = { ...booking };
  }

  closeModal() {
    this.showModal = false;
    this.currentBooking = {};
  }

  updateBooking() {
    if (this.currentBooking.id) {
      this.adminService.updateBooking(this.currentBooking.id, this.currentBooking).subscribe({
        next: () => {
          this.loadBookings();
          this.closeModal();
        },
        error: (error) => console.error('Error updating booking:', error)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'checked-in': return 'status-checked-in';
      case 'checked-out': return 'status-checked-out';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'payment-paid';
      case 'refunded': return 'payment-refunded';
      case 'failed': return 'payment-failed';
      default: return 'payment-pending';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  calculateTotal(booking: Booking): number {
    return booking.totalAmount || 0;
  }
}
