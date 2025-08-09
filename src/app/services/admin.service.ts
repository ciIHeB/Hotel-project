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
  password?: string;
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

  createRoom(room: Room, files?: File[]): Observable<any> {
    const form = new FormData();
    form.append('roomNumber', room.roomNumber);
    form.append('type', room.type);
    form.append('title', room.title);
    form.append('description', room.description);
    form.append('price', String(room.price));
    form.append('capacityAdults', String(room.capacityAdults));
    form.append('capacityChildren', String(room.capacityChildren ?? 0));
    form.append('bedType', room.bedType);
    form.append('size', String(room.size));
    form.append('isAvailable', String(room.isAvailable));
    form.append('floor', String(room.floor));
    form.append('smokingAllowed', String(room.smokingAllowed));
    form.append('petFriendly', String(room.petFriendly));
    if (room.amenities) form.append('amenities', JSON.stringify(room.amenities));
    if (files && files.length) {
      files.forEach(f => form.append('images', f));
    }
    return this.http.post(`${this.apiUrl}/rooms`, form);
  }

  updateRoom(id: number, room: Room, files?: File[]): Observable<any> {
    const form = new FormData();
    if (room.roomNumber) form.append('roomNumber', room.roomNumber);
    if (room.type) form.append('type', room.type);
    if (room.title) form.append('title', room.title);
    if (room.description) form.append('description', room.description);
    if (room.price !== undefined) form.append('price', String(room.price));
    if (room.capacityAdults !== undefined) form.append('capacityAdults', String(room.capacityAdults));
    if (room.capacityChildren !== undefined) form.append('capacityChildren', String(room.capacityChildren));
    if (room.bedType) form.append('bedType', room.bedType);
    if (room.size !== undefined) form.append('size', String(room.size));
    if (room.isAvailable !== undefined) form.append('isAvailable', String(room.isAvailable));
    if (room.floor !== undefined) form.append('floor', String(room.floor));
    if (room.smokingAllowed !== undefined) form.append('smokingAllowed', String(room.smokingAllowed));
    if (room.petFriendly !== undefined) form.append('petFriendly', String(room.petFriendly));
    if (room.amenities) form.append('amenities', JSON.stringify(room.amenities));
    if (files && files.length) {
      files.forEach(f => form.append('images', f));
    }
    return this.http.put(`${this.apiUrl}/rooms/${id}`, form);
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

  updateBookingStatus(id: number, body: { status: string; cancellationReason?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${id}/status`, body);
  }

  approveBooking(id: number): Observable<any> {
    return this.updateBookingStatus(id, { status: 'confirmed' });
  }

  rejectBooking(id: number, cancellationReason?: string): Observable<any> {
    return this.updateBookingStatus(id, { status: 'cancelled', cancellationReason });
  }

  // Users CRUD
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
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
