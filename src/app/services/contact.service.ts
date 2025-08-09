import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  errors?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000'}/api/contact`;

  constructor(private http: HttpClient) { }

  /**
   * Send contact form message to admin
   */
  sendMessage(contactData: ContactForm): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, contactData);
  }

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter(email: string, name?: string): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/newsletter`, {
      email,
      name
    });
  }
}
