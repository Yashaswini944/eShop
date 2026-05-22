import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid mt-5">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2>User Management</h2>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-success" (click)="openAddUserModal()">
            + Add New User
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Users List</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td><strong>{{ user.id }}</strong></td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>
                    <span [ngClass]="getRoleClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>{{ user.createdDate | date:'short' }}</td>
                  <td>
                    <button class="btn btn-sm btn-primary me-2" (click)="editUser(user)">
                      Edit
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteUser(user.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal for Add/Edit User -->
      <div class="modal" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="userForm" (ngSubmit)="saveUser()">
                <div class="mb-3">
                  <label class="form-label">Name *</label>
                  <input type="text" class="form-control" formControlName="name" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" formControlName="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Phone *</label>
                  <input type="tel" class="form-control" formControlName="phone" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Address *</label>
                  <input type="text" class="form-control" formControlName="address" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role *</label>
                  <select class="form-select" formControlName="role" required>
                    <option value="">Select Role</option>
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeModal()">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="!userForm.valid">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop fade" [class.show]="showModal" 
        *ngIf="showModal" (click)="closeModal()"></div>
    </div>
  `,
  styles: [`
    .modal.show {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .role-customer {
      background-color: #17a2b8;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .role-admin {
      background-color: #dc3545;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  showModal = false;
  userForm!: FormGroup;
  editingUser: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  getRoleClass(role: string): string {
    return `role-${role.toLowerCase()}`;
  }

  openAddUserModal(): void {
    this.editingUser = null;
    this.userForm.reset();
    this.showModal = true;
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  saveUser(): void {
    if (!this.userForm.valid) return;

    if (this.editingUser) {
      this.userService.updateUser(this.editingUser.id, {
        ...this.editingUser,
        ...this.userForm.value
      }).subscribe(
        () => {
          alert('User updated successfully');
          this.loadUsers();
          this.closeModal();
        },
        error => {
          alert('Error updating user');
          console.error(error);
        }
      );
    } else {
      const newUser: User = {
        id: '',
        ...this.userForm.value,
        createdDate: new Date()
      };
      this.userService.createUser(newUser).subscribe(
        () => {
          alert('User created successfully');
          this.loadUsers();
          this.closeModal();
        },
        error => {
          alert('Error creating user');
          console.error(error);
        }
      );
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        success => {
          if (success) {
            alert('User deleted successfully');
            this.loadUsers();
          }
        },
        error => {
          alert('Error deleting user');
          console.error(error);
        }
      );
    }
  }
}