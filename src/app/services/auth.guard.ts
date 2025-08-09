// This file is deprecated - user auth has been removed
// Only AdminGuard is used for admin-only routes

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Always redirect to home since user auth is disabled
    this.router.navigate(['/']);
    return false;
  }
}
