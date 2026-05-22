import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest, User } from '../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.example.com/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private getUserFromStorage(): AuthUser | null {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user !== null)
    );
  }

  get isAdmin$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user?.role === 'Admin')
    );
  }

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // For demo: accept any email/password
    const authUser: AuthUser = {
      id: 'CUST001',
      name: 'Demo User',
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'Admin' : 'Customer',
      token: 'demo-jwt-token-' + Date.now()
    };
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      localStorage.setItem('token', authUser.token);
    }
    
    this.currentUserSubject.next(authUser);
    
    return new Observable(observer => {
      observer.next({
        token: authUser.token,
        user: {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          phone: '555-0000',
          address: '123 Demo St',
          role: authUser.role,
          createdDate: new Date()
        }
      });
      observer.complete();
    });
  }

  register(userData: RegisterRequest): Observable<User> {
    const newUser: User = {
      id: 'CUST' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: 'Customer',
      createdDate: new Date()
    };
    
    return new Observable(observer => {
      observer.next(newUser);
      observer.complete();
    });
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  testService(): Observable<any> {
    return new Observable(observer => {
      observer.next({
        message: 'Auth Service is working correctly',
        isAuthenticated: this.currentUserValue !== null,
        currentUser: this.currentUserValue
      });
      observer.complete();
    });
  }
}