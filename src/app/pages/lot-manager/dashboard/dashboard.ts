import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lot-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class LotManagerDashboardComponent {
  managerName = 'Rahul';

  stats = [
    { label: 'Total Lots', value: '3' },
    { label: 'Active Bookings', value: '18' },
    { label: "Today's Revenue", value: '₹2,840' },
    { label: 'Total Spots', value: '210' }
  ];

  myLots = [
    { id: 1, name: 'City Center Parking', address: 'MG Road, Agra',
      totalSpots: 50, availableSpots: 23, status: 'OPEN' },
    { id: 2, name: 'Station Road Parking', address: 'Near Railway Station, Agra',
      totalSpots: 80, availableSpots: 5, status: 'OPEN' },
    { id: 3, name: 'Mall Parking Complex', address: 'Phoenix Mall, Agra',
      totalSpots: 80, availableSpots: 40, status: 'CLOSED' },
  ];

  recentBookings = [
    { id: 'BK-101', lot: 'City Center Parking', driver: 'Sachin K.',
      date: '23 Apr 2024', amount: '₹60', status: 'ACTIVE' },
    { id: 'BK-102', lot: 'Station Road Parking', driver: 'Amit S.',
      date: '22 Apr 2024', amount: '₹40', status: 'ACTIVE' },
    { id: 'BK-103', lot: 'City Center Parking', driver: 'Priya M.',
      date: '21 Apr 2024', amount: '₹30', status: 'COMPLETED' },
    { id: 'BK-104', lot: 'Mall Parking Complex', driver: 'Raj P.',
      date: '20 Apr 2024', amount: '₹40', status: 'COMPLETED' },
  ];

  toggleLotStatus(lot: any) {
    lot.status = lot.status === 'OPEN' ? 'CLOSED' : 'OPEN';
  }
}