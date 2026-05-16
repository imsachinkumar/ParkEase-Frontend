import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DriverDashboardComponent implements OnInit {
  driverName = '';

  stats = [
    { label: 'Total Bookings', value: '0' },
    { label: 'Active Now', value: '0' },
    { label: 'Total Spent', value: '₹0' },
    { label: 'Vehicles', value: '0' }
  ];

  recentBookings: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || user?.email || 'Driver';
    this.loadDashboardData();
  }

  loadDashboardData() {
    const userId = this.authService.getUserId();

    // Bookings load karo
    this.apiService.getMyBookings(userId).subscribe({
      next: (res) => {
        const bookings = res.data || [];
        const active = bookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'ACTIVE').length;
        const totalSpent = bookings
          .filter((b: any) => b.status === 'COMPLETED')
          .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

        this.stats[0].value = bookings.length.toString();
        this.stats[1].value = active.toString();
        this.stats[2].value = '₹' + totalSpent;

        // Recent 4 bookings
        this.recentBookings = bookings.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // Vehicles load karo
    this.apiService.getMyVehicles(userId).subscribe({
      next: (res) => {
        const vehicles = res.data || [];
        this.stats[3].value = vehicles.length.toString();
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }
}