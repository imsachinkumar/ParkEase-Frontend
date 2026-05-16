import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.scss'
})
export class AllBookingsComponent implements OnInit {
  adminName = '';
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  selectedStatus = 'ALL';

  statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || 'Admin';
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.apiService.getAllBookings().subscribe({
      next: (res) => {
        const raw = res.data || [];
        this.bookings = raw.map((b: any) => ({
          ...b,
          startTimeFormatted: b.startTime
            ? new Date(b.startTime).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          endTimeFormatted: b.endTime
            ? new Date(b.endTime).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          displayLot: b.lotName || b.parkingLotName || ('Lot #' + b.lotId) || 'N/A',
          displaySpot: b.spotId ? ('Spot #' + b.spotId) : 'Auto-assigned',
          displayVehicle: b.vehiclePlate || b.vehicleNumber || ('Vehicle #' + b.vehicleId) || 'N/A',
          displayAmount: b.totalAmount ? '₹' + b.totalAmount : 'TBD',
        }));
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