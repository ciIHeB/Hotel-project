import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  rooms = [
    {
      name: 'Chambre Double',
      description: 'Chambre confortable pour 2 personnes avec vue mer ou jardin',
      capacity: '2 personnes',
      size: '25-30 m²',
      amenities: ['Climatisation', 'Balcon', 'Salle de bain privée', 'WiFi gratuit'],
      image: 'assets/roomsImg/img1.jpg',
      price: 'À partir de 250 DT/nuit'
    },
    {
      name: 'Chambre Triple',
      description: 'Chambre spacieuse pour 3 personnes, idéale pour les familles',
      capacity: '3 personnes',
      size: '30-35 m²',
      amenities: ['Climatisation', 'Balcon', 'Salle de bain privée', 'WiFi gratuit', 'Canapé-lit'],
      image: 'assets/roomsImg/img2.jpg',
      price: 'À partir de 320 DT/nuit'
    },
    {
      name: 'Chambre Quadruple',
      description: 'Chambre familiale pour 4 personnes avec espace de vie',
      capacity: '4 personnes',
      size: '35-40 m²',
      amenities: ['Climatisation', 'Balcon', 'Salle de bain privée', 'WiFi gratuit', '2 lits doubles'],
      image: 'assets/roomsImg/img3.jpg',
      price: 'À partir de 380 DT/nuit'
    }
  ];
}
