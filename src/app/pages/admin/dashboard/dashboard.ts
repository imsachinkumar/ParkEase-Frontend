import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent {
  adminName = 'Admin';

  stats = [
    { label: 'Total Users', value: '1,248' },
    { label: 'Total Lots', value: '42' },
    { label: 'Total Bookings', value: '3,891' },
    { label: 'Platform Revenue', value: '₹1.2L' }
  ];

  recentUsers = [
    { id: 'U-001', name: 'Sachin Kumar', email: 'sachin@gmail.com',
      role: 'DRIVER', date: '23 Apr 2024', status: 'ACTIVE' },
    { id: 'U-002', name: 'Rahul Sharma', email: 'rahul@gmail.com',
      role: 'MANAGER', date: '22 Apr 2024', status: 'ACTIVE' },
    { id: 'U-003', name: 'Priya Singh', email: 'priya@gmail.com',
      role: 'DRIVER', date: '21 Apr 2024', status: 'SUSPENDED' },
    { id: 'U-004', name: 'Amit Gupta', email: 'amit@gmail.com',
      role: 'MANAGER', date: '20 Apr 2024', status: 'ACTIVE' },
  ];

  pendingLots = [
    { id: 'L-001', name: 'New City Parking', manager: 'Rahul S.',
      city: 'Agra', spots: 50, date: '23 Apr 2024' },
    { id: 'L-002', name: 'Highway Parking', manager: 'Amit G.',
      city: 'Mathura', spots: 30, date: '22 Apr 2024' },
  ];

  recentBookings = [
    { id: 'BK-201', lot: 'City Center Parking', driver: 'Sachin K.',
      date: '23 Apr 2024', amount: '₹80', status: 'ACTIVE' },
    { id: 'BK-202', lot: 'Mall Parking', driver: 'Priya S.',
      date: '22 Apr 2024', amount: '₹120', status: 'COMPLETED' },
    { id: 'BK-203', lot: 'Station Parking', driver: 'Raj P.',
      date: '21 Apr 2024', amount: '₹60', status: 'CANCELLED' },
  ];

  approveLot(lot: any) {
    alert('Lot approved: ' + lot.name);
  }

  rejectLot(lot: any) {
    alert('Lot rejected: ' + lot.name);
  }

  suspendUser(user: any) {
    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  }
}