import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Section2App } from './section2/section2.component';
import { Router } from '@angular/router';
import { Section3Component } from './section3/section3.component';
import { Section4Component } from './section4/section4.component';
import { appSection5 } from './section5/section5.component';
import { Section6Component } from './section6/section6.component';
import { Section7Component } from './section7/section7.component';
import { Section8Component } from './section8/section8.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Section2App,
    Section3Component,
    Section4Component,
    appSection5,
    Section6Component,
    Section7Component,
    Section8Component,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  homeTitle: HTMLElement | null = null;
  homeSubtitle: HTMLElement | null = null;
  headerHero: HTMLElement | null = null;
  count: number = 1;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.homeTitle = document.querySelector('.hero-title');
      this.homeSubtitle = document.querySelector('.hero-subtitle');
      this.headerHero = document.querySelector('.header-hero');
      
      if (this.homeTitle && this.homeSubtitle && this.headerHero) {
        this.homeTitle.textContent = 'Hôtel Tanfous Beach & Aquapark';
        this.homeSubtitle.textContent = 'VOTRE SÉJOUR DE RÊVE EN TUNISIE';
        this.headerHero.style.backgroundImage = `url('./assets/my_img/1.jpg')`;
        
        // Auto-switching disabled - background will stay static
      }
    }
  }

  private updateHeroContent(): void {
    if (this.homeTitle && this.homeSubtitle && this.headerHero) {
      switch (this.count) {
        case 1:
          this.homeTitle.textContent = 'Hôtel Tanfous Beach & Aquapark';
          this.homeSubtitle.textContent = 'VOTRE SÉJOUR DE RÊVE EN TUNISIE';
          break;
        case 2:
          this.homeTitle.textContent = 'Aquapark & Loisirs';
          this.homeSubtitle.textContent = '7 TOBOGGANS ET ACTIVITÉS FAMILLE';
          break;
        case 3:
          this.homeTitle.textContent = 'Plage Privée & Bien-être';
          this.homeSubtitle.textContent = 'DÉTENTE ET RELAXATION GARANTIES';
          break;
      }
      this.headerHero.style.backgroundImage = `url('./assets/my_img/1.jpg')`;
    }
  }

  changeRight(): void {
    if (this.count <= 2) {
      this.count++;
    } else {
      this.count = 1;
    }
    this.updateHeroContent();
  }

  changeLeft(): void {
    if (this.count > 1) {
      this.count--;
    } else {
      this.count = 3;
    }
    this.updateHeroContent();
  }
}
