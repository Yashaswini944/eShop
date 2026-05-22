import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="card-title text-center mb-4">Create Account</h2>

              <div class="alert alert-danger" *ngIf="error" role="alert">
                {{ error }}
              </div>

              <div class="alert alert-success" *ngIf="success" role="alert">
                {{ success }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    <div *ngIf="registerForm.get('name')?.errors?.['required']">Name is required.</div>
                    <div *ngIf="registerForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required.</div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">Email must be valid.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">Phone *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone"
                    formControlName="phone"
                    [class.is-invalid]="isFieldInvalid('phone')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('phone')">
                    Phone is required.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="address" class="form-label">Address *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="address"
                    formControlName="address"
                    [class.is-invalid]="isFieldInvalid('address')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('address')">
                    Address is required.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required.</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [class.is-invalid]="isFieldInvalid('confirmPassword')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('confirmPassword')">
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm password.</div>
                    <div *ngIf="registerForm.errors?.['passwordMismatch']">Passwords do not match.</div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="registerForm.invalid || isLoading">
                  {{ isLoading ? 'Registering...' : 'Register' }}
                </button>
              </form>

              <hr>

              <p class="text-center mb-0">
                Already have an account? 
                <a routerLink="/account/login" class="text-decoration-none">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .is-invalid {
      border-color: #dc3545 !important;
    }
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875em;
      display: block;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  error: string = '';
  success: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    setTimeout(() => {
      this.success = 'Registration successful! Redirecting to login...';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/account/login']);
      }, 2000);
    }, 1000);
  }
}