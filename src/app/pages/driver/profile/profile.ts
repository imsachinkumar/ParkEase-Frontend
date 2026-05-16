import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  driverName = '';
  email = '';
  phone = '';
  role = '';
  userId = 0;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  editData = {
    fullName: '',
    phone: ''
  };

  constructor(
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.email = user?.email || '';
    this.phone = user?.phone || '';
    this.role = user?.role || '';
    this.userId = user?.userId || 0;

    this.editData = {
      fullName: this.driverName,
      phone: this.phone
    };
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile() {
    // LocalStorage mein update karo
    const user = this.authService.getCurrentUser();
    const updatedUser = {
      ...user,
      fullName: this.editData.fullName,
      phone: this.editData.phone
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    this.driverName = this.editData.fullName;
    this.phone = this.editData.phone;
    this.isEditing = false;
    this.successMessage = 'Profile updated successfully! ✅';
    setTimeout(() => { this.successMessage = ''; }, 3000);
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
  }
}