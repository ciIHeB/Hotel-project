import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wellness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wellness.component.html',
  styleUrl: './wellness.component.css'
})
export class WellnessComponent {
  wellnessServices = [
    {
      name: 'Spa',
      description: 'Soins relaxants et revitalisants dans un cadre apaisant',
      icon: '🧖‍♀️',
      image: 'assets/my_img/18.jpg'
    },
    {
      name: 'Hammam',
      description: 'Rituel traditionnel tunisien pour purifier le corps et l\'esprit',
      icon: '🛁',
      image: 'assets/my_img/19.webp'
    },
    {
      name: 'Massages',
      description: 'Massages thérapeutiques et relaxants par nos experts',
      icon: '💆‍♀️',
      image: 'assets/my_img/21.jpg'
    },
    {
      name: 'Salle de Sport',
      description: 'Équipements modernes pour maintenir votre forme',
      icon: '💪',
      image: 'assets/my_img/22.webp'
    }
  ];
} 