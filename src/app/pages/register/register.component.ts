// Registration is disabled. Keep a friendly page instead of redirecting.
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: `
    <div class="register-disabled">
      <h2>Inscription utilisateur désactivée</h2>
      <p>Seul l\'accès administrateur est disponible pour la gestion interne.</p>
      <p>Vous pouvez toutefois effectuer une réservation en tant qu\'invité depuis la page Réservation.</p>
      <button (click)="goHome()">Retour à l\'accueil</button>
    </div>
  `,
  styles: [
    `.register-disabled { padding: 2rem; text-align: center; }
     .register-disabled button { margin-top: 1rem; padding: .5rem 1rem; border-radius: 6px; border: none; background:#6c5ce7; color: #fff; cursor: pointer; }`
  ]
})
export class RegisterComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
