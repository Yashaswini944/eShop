import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="card-title text-center mb-4">Login</h2>

              <div class="alert alert-danger" *ngIf="error" role="alert">
                {{ error }}
              </div>

              <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm.value)">
                <div class="mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    name="email"
                    ngModel 
                    required 
                    email
                    #emailField="ngModel"
                    [class.is-invalid]="emailField.invalid && emailField.touched">
                  <div class="invalid-feedback" *ngIf="emailField.invalid && emailField.touched">
                    <div *ngIf="emailField.errors?.['required']">Email is required.</div>
                    <div *ngIf="emailField.errors?.['email']">Email must be valid.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    name="password"
                    ngModel 
                    required 
                    minlength="6"
                    #passwordField="ngModel"
                    [class.is-invalid]="passwordField.invalid && passwordField.touched">
                  <div class="invalid-feedback" *ngIf="passwordField.invalid && passwordField.touched">
                    <div *ngIf="passwordField.errors?.['required']">Password is required.</div>
                    <div *ngIf="passwordField.errors?.['minlength']">Password must be at least 6 characters.</div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="loginForm.invalid || isLoading">
                  {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
              </form>

              <hr>

              <p class="text-center mb-0">
                Don't have an account? 
                <a routerLink="/account/register" class="text-decoration-none">Register here</a>
              </p>

              <div class="alert alert-info mt-3">
                <small>
                  <strong>Demo Credentials:</strong><br>
                  Email: admin&#64;example.com (Admin)<br>
                  Email: customer&#64;example.com (Customer)<br>
                  Password: any password
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875em;
      display: block;
    }
    .form-control.ng-invalid.ng-touched {
      border-color: #dc3545;
    }
  `]
})
export class LoginComponent {
  isLoading = false;
  error: string = '';
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(credentials: LoginRequest): void {
    this.isLoading = true;
    this.error = '';

    this.authService.login(credentials).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.error = 'Login failed. Please try again.';
        this.isLoading = false;
      }
    );
  }
}