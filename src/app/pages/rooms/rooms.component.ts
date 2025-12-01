import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Array<{
    name: string;
    description: string;
    capacity: string;
    size: string;
    amenities: string[];
    image: string;
    price: string;
  }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  private loadRooms() {
    this.http.get<any>(`${environment.apiUrl}/rooms?limit=50`).subscribe({
      next: (res) => {
        const data = res?.data || [];
        if (!data.length) {
          this.rooms = this.fallbackRooms();
          return;
        }
        this.rooms = data.map((r: any) => ({
          name: r.title || r.roomNumber || 'Chambre',
          description: r.description || '',
          capacity: `${r.capacityAdults || 1} personnes`,
          size: `${r.size || 20} m²`,
          amenities: Array.isArray(r.amenities) ? r.amenities : [],
          image: this.toAbsoluteImage((Array.isArray(r.images) && r.images[0]) ? r.images[0] : ''),
          price: `À partir de ${Math.round(r.price || 0)} DT/nuit`
        }));
      },
      error: () => {
        this.rooms = this.fallbackRooms();
      }
    });
  }

  private toAbsoluteImage(pathOrUrl: string): string {
    if (!pathOrUrl) return 'assets/roomsImg/img1.jpg';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
    // environment.apiUrl ends with /api; strip it to get backend origin
    const backendBase = environment.apiUrl.replace(/\/?api\/?$/, '');
    if (pathOrUrl.startsWith('/')) return `${backendBase}${pathOrUrl}`;
    return `${backendBase}/${pathOrUrl}`;
  }

  private fallbackRooms() {
    return [
      {
        name: 'Chambre Standard',
        description: 'Chambre confortable pour 2 personnes avec équipements essentiels.',
        capacity: '2 personnes',
        size: '22 m²',
        amenities: ['Climatisation', 'WiFi gratuit', 'Salle de bain privée'],
        image: 'assets/roomsImg/img1.jpg',
        price: 'À partir de 90 DT/nuit'
      },
      {
        name: 'Suite Exécutive',
        description: 'Suite spacieuse avec salon séparé et prestations premium.',
        capacity: '3 personnes',
        size: '60 m²',
        amenities: ['Climatisation', 'WiFi gratuit', 'Jacuzzi', 'Balcon'],
        image: 'assets/roomsImg/img2.jpg',
        price: 'À partir de 249 DT/nuit'
      }
    ];
  }
}
