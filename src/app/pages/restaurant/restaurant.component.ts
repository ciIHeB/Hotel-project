import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent {
  restaurants = [
    {
      name: 'Restaurant Principal',
      description: 'Buffet international avec spécialités tunisiennes',
      type: 'Buffet',
      hours: '7h00 - 22h00',
      image: 'assets/restaurant/dinner.jpg'
    },
    {
      name: 'Restaurant à la Carte',
      description: 'Cuisine méditerranéenne raffinée',
      type: 'À la carte',
      hours: '19h00 - 23h00',
      image: 'assets/restaurant/dinner2.jpg'
    },
    {
      name: 'Snack Bar',
      description: 'Snacks et boissons au bord de la piscine',
      type: 'Snack',
      hours: '10h00 - 18h00',
      image: 'assets/restaurant/dinner.jpg'
    }
  ];
} 