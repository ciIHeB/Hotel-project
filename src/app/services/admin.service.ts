import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Room {
  id?: number;
  roomNumber: string;
  type: string;
  title: string;
  description: string;
  price: number;
  capacityAdults: number;
  capacityChildren: number;
  bedType: string;
  size: number;
  amenities: string[];
  images: any[];
  isAvailable: boolean;
  floor: number;
  smokingAllowed: boolean;
  petFriendly: boolean;
}

export interface Booking {
  id?: number;
  bookingId: string;
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestsAdults: number;
  guestsChildren: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  specialRequests?: string;
  contactPhone: string;
  contactEmail: string;
  cancellationReason?: string;
  nights: number;
  User?: any;
  Room?: any;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  profileImage?: string;
  preferences?: any;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Rooms CRUD
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms`);
  }

  getRoom(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/${id}`);
  }

  createRoom(room: Room): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, room);
  }

  updateRoom(id: number, room: Room): Observable<any> {
    return this.http.put(`${this.apiUrl}/rooms/${id}`, room);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${id}`);
  }

  // Bookings CRUD
  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getBooking(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${id}`, booking);
  }

  // Users CRUD
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, user: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  toggleUserStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }
}
