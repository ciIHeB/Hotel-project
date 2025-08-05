import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-section6',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './section6.component.html',
  styleUrl: './section6.component.css',
})
export class Section6Component {
  // List of all image filenames in my_img folder
  imageNames = [
    '1.jpg', '2.jpg', '3.jpg', 'ball.jpg', 'dinner.jpg', 'dinner2.jpg',
    'games.jpg', 'hall.jpg', 'hall1.jpg', 'hall2.jpg', 'img0.jpg',
    'pool.jpg', 'pool1.jpg', 'pool2.jpg', 'room.jpg', 'room2.jpg', 'tobbogan.jpg'
  ];
  selectedImg: string = '';
  
  select(index: number) {
    this.selectedImg = `./assets/my_img/${this.imageNames[index]}`;
  }
  unselect() {
    this.selectedImg = '';
  }
}
