import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private mockUsers: User[] = [
    {
      id: 'CUST001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0101',
      address: '123 Main St, City, State 12345',
      role: 'Customer',
      createdDate: new Date('2024-01-01')
    },
    {
      id: 'CUST002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-0102',
      address: '456 Oak Ave, Town, State 67890',
      role: 'Customer',
      createdDate: new Date('2024-01-05')
    },
    {
      id: 'ADM001',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '555-0001',
      address: '789 Admin St, Admin City, State 99999',
      role: 'Admin',
      createdDate: new Date('2023-12-01')
    }
  ];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersSubject.next(this.mockUsers);
  }

  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.mockUsers.find(u => u.id === id));
  }

  createUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: 'CUST' + Date.now(),
      createdDate: new Date()
    };
    this.mockUsers.push(newUser);
    this.usersSubject.next(this.mockUsers);
    return of(newUser);
  }

  updateUser(id: string, user: User): Observable<User | undefined> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...user, id };
      this.usersSubject.next([...this.mockUsers]);
    }
    return of(this.mockUsers[index]);
  }

  deleteUser(id: string): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
      this.mockUsers.splice(index, 1);
      this.usersSubject.next([...this.mockUsers]);
      return of(true);
    }
    return of(false);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return of(this.mockUsers.filter(u => u.role === role));
  }

  testService(): Observable<any> {
    return of({
      message: 'User Service is working correctly',
      totalUsers: this.mockUsers.length,
      users: this.mockUsers
    });
  }
}