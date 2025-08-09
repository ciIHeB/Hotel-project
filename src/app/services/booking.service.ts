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

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    bookingId: string;
    status: string;
    totalAmount: number;
    checkIn: string;
    checkOut: string;
    Room: {
      type: string;
      title: string;
      price: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/bookings`, booking);
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

  // Admin methods for managing bookings
  getAllBookings(params?: { page?: number; limit?: number; status?: string }): Observable<any> {
    let queryParams = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.status) searchParams.append('status', params.status);
      queryParams = searchParams.toString() ? '?' + searchParams.toString() : '';
    }
    return this.http.get(`${this.apiUrl}/bookings${queryParams}`);
  }

  updateBookingStatus(bookingId: number, status: string, cancellationReason?: string): Observable<any> {
    const body: any = { status };
    if (cancellationReason) {
      body.cancellationReason = cancellationReason;
    }
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/status`, body);
  }
}
