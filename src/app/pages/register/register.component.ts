// This file is deprecated - user registration has been removed
// Only admin login is supported via /admin-login

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: '<div><h2>User registration is disabled</h2><p>Only admin access is available.</p></div>',
  styles: ['div { padding: 2rem; text-align: center; }']
})
export class RegisterComponent {
  constructor(private router: Router) {
    // Redirect to home since registration is disabled
    this.router.navigate(['/']);
  }
}
