import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations:[
    trigger('openClose',[
      state('open',style({
        backgroundColor:""
      })),
      state('closed',style({
        backgroundColor:"white"
      })),
      transition('open => closed',[animate('0.5s')]),
      transition('closed => open',[animate('0.5s')])
    ])
  ]
})
export class HeaderComponent implements OnInit{
  isOpen:boolean = true;
  active:number = 0;
  header: HTMLElement | null = null;
  
  handleClick(index:number):void{
    this.active = index;
  }

  headerLinks = [
    {
      link:"home",
      title:"ACCUEIL"
    },
    {
      link:"chambres",
      title:"CHAMBRES",
    },
    {
      link:"restauration",
      title:"RESTAURATION",
    },
    {
      link:"loisirs-activites",
      title:"LOISIRS & ACTIVITÉS",
    },
    {
      link:"bien-etre",
      title:"BIEN-ÊTRE",
    },
    {
      link:"reservation",
      title:"RÉSERVATION",
    },
    {
      link:"contact",
      title:"CONTACT",
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.header = document.querySelector("header");
      window.addEventListener('scroll',() => {
        const section2 = document.querySelector(".section-2");
        const sectRect = section2?.getBoundingClientRect();
        if(this.header && sectRect) {
          if(window.innerHeight >= sectRect.y + 150){
            this.isOpen = false;
            this.header.style.paddingBlock = '20px';
          }else{
            this.isOpen = true;
            this.header.style.paddingBlock = '40px';
          }
        }
      });
    }
  }
}
