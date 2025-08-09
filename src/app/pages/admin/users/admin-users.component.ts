import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  searchTerm = '';
  roleFilter = 'all';

  currentUser: Partial<User> = {};

  userRoles = ['guest', 'admin'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data || [];
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  filterUsers() {
    let filtered = [...this.users];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    this.filteredUsers = filtered;
  }

  openModal(user?: User) {
    this.showModal = true;
    if (user) {
      this.editMode = true;
      this.currentUser = { ...user };
    } else {
      this.editMode = false;
      this.currentUser = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'guest',
        isActive: true
      };
    }
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.currentUser = {};
  }

  saveUser() {
    if (this.editMode && this.currentUser.id) {
      this.adminService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => console.error('Error updating user:', error)
      });
    } else {
      // Create new user
      this.adminService.createUser(this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => console.error('Error creating user:', error)
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      this.adminService.deleteUser(user.id!).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }

  toggleUserStatus(user: User) {
    this.adminService.toggleUserStatus(user.id!).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => console.error('Error toggling user status:', error)
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getRoleClass(role: string): string {
    return role === 'admin' ? 'role-admin' : 'role-guest';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
