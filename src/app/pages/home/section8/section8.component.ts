import { Component } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-section8',
  standalone: true,
  templateUrl: './section8.component.html',
  styleUrl: './section8.component.css',
  imports: [NgOptimizedImage, CommonModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          left: '50%',
          transform: 'translateX(-50%)',
        })
      ),
      state(
        'close',
        style({
          left: '1200px',
          transform: 'translateX(0)',
        })
      ),
      transition('close => open', [animate('1s')]),
      transition('open => close', [animate('0.5s')]),
    ]),
    trigger('closeOpen', [
      state(
        'open',
        style({
          left: '-1200px',
        })
      ),
      state(
        'close',
        style({
          left: '0',
        })
      ),
      transition('close => open', [animate('1s')]),
      transition('open => close', [animate('0.5s')]),
    ]),
  ],
})
export class Section8Component {
  selected: number = 0;
  active: number = 0;
  dots = new Array(2).fill(0);
  next: boolean = false;
  info = [
    [
      {
        id: 0,
        title: 'Main Musk',
        img: './assets/people/img0.jpg',
      },
      {
        id: 1,
        title: 'Jain Kane',
        img: './assets/people/img1.jpg',
      },
    ],
    [
      {
        id: 0,
        title: 'Lain Urol',
        img: './assets/people/img2.jpg',
      },
      {
        id: 1,
        title: 'George Hay',
        img: './assets/people/img3.jpg',
      },
    ],
  ];
  moveLeft() {
    this.next = false;
    this.active = 0;
  }
  moveRight() {
    this.next = true;
    this.active = 1;
  }
}
