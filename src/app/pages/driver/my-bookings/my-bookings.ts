import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookingsComponent {
  activeTab: string = 'ALL';

  bookings = [
    { id: 'BK-001', lot: 'City Center Parking', spot: 'A-12',
      date: '23 Apr 2024', startTime: '10:00 AM', endTime: '12:00 PM',
      amount: '₹80', status: 'ACTIVE', vehicle: 'UP80AB1234' },
    { id: 'BK-002', lot: 'Mall Parking Complex', spot: 'B-04',
      date: '20 Apr 2024', startTime: '02:00 PM', endTime: '04:00 PM',
      amount: '₹120', status: 'COMPLETED', vehicle: 'UP80AB1234' },
    { id: 'BK-003', lot: 'Station Road Parking', spot: 'C-07',
      date: '18 Apr 2024', startTime: '09:00 AM', endTime: '11:00 AM',
      amount: '₹60', status: 'COMPLETED', vehicle: 'UP80CD5678' },
    { id: 'BK-004', lot: 'Green Park Parking', spot: 'D-02',
      date: '15 Apr 2024', startTime: '03:00 PM', endTime: '05:00 PM',
      amount: '₹75', status: 'CANCELLED', vehicle: 'UP80AB1234' },
    { id: 'BK-005', lot: 'City Center Parking', spot: 'A-08',
      date: '10 Apr 2024', startTime: '11:00 AM', endTime: '01:00 PM',
      amount: '₹80', status: 'COMPLETED', vehicle: 'UP80CD5678' },
  ];

  setTab(tab: string) {
    this.activeTab = tab;
  }

  get filteredBookings() {
    if (this.activeTab === 'ALL') return this.bookings;
    return this.bookings.filter(b => b.status === this.activeTab);
  }
}