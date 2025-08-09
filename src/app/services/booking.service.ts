import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BookingRequest {
  contactEmail: string;
  contactPhone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsAdults: number;
  guestsChildren?: number;
  specialRequests?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, booking);
  }

  getUserBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getBookingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }

  searchBooking(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/search/${bookingId}`);
  }
}
