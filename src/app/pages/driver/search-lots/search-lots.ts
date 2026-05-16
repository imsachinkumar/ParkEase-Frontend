import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-search-lots',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-lots.html',
  styleUrl: './search-lots.scss'
})
export class SearchLotsComponent implements OnInit {
  searchCity: string = '';
  showEVOnly: boolean = false;
  isSearched: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  driverName: string = '';
  successMessage: string = '';

  filteredLots: any[] = [];
  allLots: any[] = [];
  myVehicles: any[] = [];

  showBookingModal: boolean = false;
  selectedLot: any = null;
  bookingData = {
    vehicleId: '',
    startTime: '',
    endTime: ''
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.loadAllLots();
    this.loadMyVehicles();
  }

  loadMyVehicles() {
    const userId = this.authService.getUserId();
    this.apiService.getMyVehicles(userId).subscribe({
      next: (res) => { this.myVehicles = res.data || []; },
      error: () => { this.myVehicles = []; }
    });
  }

  loadAllLots() {
    this.isLoading = true;
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        const lots = res.data || [];
        this.allLots = lots.filter((lot: any, index: number, self: any[]) =>
          index === self.findIndex((l) => l.lotName === lot.lotName)
        );
        this.filteredLots = this.allLots;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.allLots = [];
        this.filteredLots = [];
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.isSearched = true;
    if (this.searchCity) {
      this.isLoading = true;
      this.apiService.searchLots(this.searchCity).subscribe({
        next: (res) => {
          let lots = res.data || [];
          lots = lots.filter((lot: any, index: number, self: any[]) =>
            index === self.findIndex((l) => l.lotName === lot.lotName)
          );
          if (this.showEVOnly) {
            lots = lots.filter((lot: any) =>
              lot.hasEVCharging || lot.hasEV || lot.isEV
            );
          }
          this.filteredLots = lots;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.filteredLots = [];
          this.cdr.detectChanges();
        }
      });
    } else {
      this.filteredLots = this.showEVOnly
        ? this.allLots.filter((lot: any) =>
            lot.hasEVCharging || lot.hasEV || lot.isEV)
        : this.allLots;
      this.cdr.detectChanges();
    }
  }

  quickSearch(city: string) {
    this.searchCity = city;
    this.onSearch();
  }

  openBooking(lot: any) {
    this.selectedLot = lot;
    this.bookingData = { vehicleId: '', startTime: '', endTime: '' };
    this.errorMessage = '';
    this.showBookingModal = true;
  }

  closeBooking() {
    this.showBookingModal = false;
    this.selectedLot = null;
  }

  getCalculatedAmount(): number {
    if (!this.bookingData.startTime || !this.bookingData.endTime) return 0;
    const start = new Date(this.bookingData.startTime);
    const end = new Date(this.bookingData.endTime);
    const hours = Math.max(1, Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    ));
    const pricePerHour = this.selectedLot?.pricePerHour || 30;
    return hours * pricePerHour;
  }

  confirmBooking() {
    if (!this.bookingData.vehicleId ||
        !this.bookingData.startTime ||
        !this.bookingData.endTime) {
      this.errorMessage = 'Saari fields fill karo!';
      return;
    }

    const start = new Date(this.bookingData.startTime);
    const end = new Date(this.bookingData.endTime);

    if (end <= start) {
      this.errorMessage = 'End time, start time se baad hona chahiye!';
      return;
    }

    const totalAmount = this.getCalculatedAmount();
    const userId = this.authService.getUserId();

    const data = {
      userId: userId,
      lotId: this.selectedLot.lotId,
      vehicleId: Number(this.bookingData.vehicleId),
      startTime: this.bookingData.startTime + ':00',
      endTime: this.bookingData.endTime + ':00',
      totalAmount: totalAmount
    };

    this.apiService.createBooking(data).subscribe({
      next: (res) => {
        this.showBookingModal = false;
        this.successMessage = `Booking successful! 🎉 Amount: ₹${totalAmount}`;
        this.loadAllLots();
        setTimeout(() => { this.successMessage = ''; }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Booking failed! Try again.';
        this.cdr.detectChanges();
      }
    });
  }
}