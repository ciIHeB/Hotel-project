import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    
    const userData = this.registerForm.value;
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
