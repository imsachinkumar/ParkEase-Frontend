import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DriverDashboardComponent {
  driverName = 'Sachin';

  stats = [
    { label: 'Total Bookings', value: '13' },
    { label: 'Active Now', value: '1' },
    { label: 'Total Spent', value: '₹835' },
    { label: 'Vehicles', value: '3' }
  ];

  recentBookings = [
    { id: 'BK-001', lot: 'City Center Parking',
      date: '23 Apr 2024', amount: '₹80', status: 'ACTIVE' },
    { id: 'BK-002', lot: 'Mall Parking Complex',
      date: '20 Apr 2024', amount: '₹120', status: 'COMPLETED' },
    { id: 'BK-003', lot: 'Station Road Parking',
      date: '18 Apr 2024', amount: '₹60', status: 'COMPLETED' },
    { id: 'BK-004', lot: 'Green Park Parking',
      date: '15 Apr 2024', amount: '₹75', status: 'CANCELLED' },
  ];
}