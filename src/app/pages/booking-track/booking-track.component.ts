import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-track.component.html',
  styleUrls: ['./booking-track.component.css']
})
export class BookingTrackComponent implements OnInit {
  bookingId = '';
  loading = false;
  error: string | null = null;
  result: any = null;

  constructor(private bookingService: BookingService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('bookingId');
    if (id) {
      this.bookingId = id;
      this.search();
    }
  }

  search() {
    this.error = null;
    this.result = null;
    const id = this.bookingId.trim();
    if (!id) {
      this.error = 'Veuillez saisir la référence de réservation (ex: BK123456789).';
      return;
    }
    this.loading = true;
    this.bookingService.searchBooking(id).subscribe({
      next: (res) => {
        this.result = res?.data || null;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Réservation introuvable.';
        this.loading = false;
      }
    });
  }
}
