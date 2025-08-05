import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.error = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }
}
