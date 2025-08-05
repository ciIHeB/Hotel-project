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
  selector: 'app-section7',
  standalone: true,
  templateUrl: './section7.component.html',
  styleUrl: './section7.component.css',
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
export class Section7Component {
  imgSrc = new Array(2).fill(new Array(3).fill(0));
  dots = new Array(2).fill(0);
  active: number = 0;
  selected: number = 0;
  next: boolean = false;
  moveLeft() {
    this.next = false;
    this.active = 0;
  }
  moveRight() {
    this.next = true;
    this.active = 1;
  }
}
