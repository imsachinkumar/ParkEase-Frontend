import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss'
})
export class ManageUsersComponent implements OnInit {
  adminName = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = false;
  searchQuery = '';
  selectedRole = 'ALL';

  roles = ['ALL', 'DRIVER', 'MANAGER', 'ADMIN'];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || 'Admin';
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter() {
    let result = this.users;
    if (this.selectedRole !== 'ALL') {
      result = result.filter(u => u.role === this.selectedRole);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }
    this.filteredUsers = result;
  }

  filterByRole(role: string) {
    this.selectedRole = role;
    this.applyFilter();
  }

  onSearch() {
    this.applyFilter();
  }

  toggleUserStatus(user: any) {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.apiService.updateUserStatus(user.userId, newStatus).subscribe({
      next: () => { this.loadUsers(); },
      error: () => {}
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe({
        next: () => { this.loadUsers(); },
        error: () => {}
      });
    }
  }
}