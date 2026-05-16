import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  adminName = '';

  stats = [
    { label: 'Total Users', value: '0' },
    { label: 'Total Lots', value: '0' },
    { label: 'Total Bookings', value: '0' },
    { label: 'Platform Revenue', value: '₹0' }
  ];

  recentUsers: any[] = [];
  pendingLots: any[] = [];
  recentBookings: any[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || user?.name || 'Admin';
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Lots load karo
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        const lots = res.data || [];
        const uniqueLots = lots.filter((lot: any, index: number, self: any[]) =>
          index === self.findIndex((l) => l.lotName === lot.lotName)
        );
        this.stats[1].value = uniqueLots.length.toString();
        this.pendingLots = uniqueLots.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  approveLot(lot: any) {
    alert('Lot approved: ' + (lot.lotName || lot.name));
  }

  rejectLot(lot: any) {
    alert('Lot rejected: ' + (lot.lotName || lot.name));
  }

  suspendUser(user: any) {
    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  }
}