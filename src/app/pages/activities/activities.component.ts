import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
  activities = [
    {
      name: 'Aquapark',
      description: '7 toboggans, piscines pour tous âges, mini-club pour enfants',
      icon: '🏊‍♂️',
      image: 'assets/my_img/tobbogan.jpg'
    },
    {
      name: 'Plage Privée',
      description: 'Plage de sable fin avec transats et parasols inclus',
      icon: '🏖️',
      image: 'assets/my_img/16.jpg'
    },
    {
      name: 'Animations',
      description: 'Spectacles, soirées à thème, activités sportives',
      icon: '🎭',
      image: 'assets/my_img/13.jpg'
    },
    {
      name: 'Sports',
      description: 'Tennis, volley-ball, pétanque, activités nautiques',
      icon: '🎾',
      image: 'assets/my_img/4.jpg'
    }
  ];
} 