import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';



@Component({
  selector: 'app-lot-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterLinkActive ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class LotManagerDashboardComponent implements OnInit {
  managerName = '';

  stats = [
    { label: 'Total Lots', value: '0' },
    { label: 'Active Bookings', value: '0' },
    { label: "Today's Revenue", value: '₹0' },
    { label: 'Total Spots', value: '0' }
  ];

  myLots: any[] = [];
  recentBookings: any[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.managerName = user?.fullName || user?.name || 'Manager';
    this.loadDashboardData();
  }

  loadDashboardData() {
    const userId = this.authService.getUserId();

    // Lots load karo
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        const allLots = res.data || [];
        // Manager ke lots filter karo
        this.myLots = allLots.filter((lot: any) => lot.ownerId === userId || lot.managerId === userId);
        this.stats[0].value = this.myLots.length.toString();
        const totalSpots = this.myLots.reduce((sum: number, lot: any) => sum + (lot.totalSpots || 0), 0);
        this.stats[3].value = totalSpots.toString();
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // Bookings load karo
    this.apiService.getMyBookings(userId).subscribe({
      next: (res) => {
        const bookings = res.data || [];
        const active = bookings.filter((b: any) =>
          b.status === 'CONFIRMED' || b.status === 'ACTIVE').length;
        this.stats[1].value = active.toString();
        this.recentBookings = bookings.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  toggleLotStatus(lot: any) {
    lot.status = lot.status === 'OPEN' ? 'CLOSED' : 'OPEN';
  }
}