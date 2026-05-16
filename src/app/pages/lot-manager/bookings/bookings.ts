import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class ManagerBookingsComponent implements OnInit {
  managerName = '';
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  selectedStatus = 'ALL';

  statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.managerName = user?.fullName || 'Manager';
    this.route.url.subscribe(() => {
      this.loadBookings();
    });
  }

  loadBookings() {
    this.isLoading = true;
    this.selectedStatus = 'ALL';
    this.apiService.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.data || [];
        this.filteredBookings = this.bookings;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(b => b.status === status);
    }
  }

  confirmBooking(bookingId: number) {
    this.apiService.updateBookingStatus(bookingId, 'CONFIRMED').subscribe({
      next: () => { this.loadBookings(); },
      error: () => {}
    });
  }

  cancelBooking(bookingId: number) {
    this.apiService.updateBookingStatus(bookingId, 'CANCELLED').subscribe({
      next: () => { this.loadBookings(); },
      error: () => {}
    });
  }
}