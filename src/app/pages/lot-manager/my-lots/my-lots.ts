import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-lots',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-lots.html',
  styleUrl: './my-lots.scss'
})
export class MyLotsComponent implements OnInit {
  managerName = '';
  lots: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showAddForm = false;

  newLot = {
    lotName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    totalSpots: 0,
    pricePerHour: 0,
    latitude: 0,
    longitude: 0
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.managerName = user?.fullName || user?.name || 'Manager';
    this.loadLots();
  }

  loadLots() {
    this.isLoading = true;
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        const lots = res.data || [];
        this.lots = lots.filter((lot: any, index: number, self: any[]) =>
          index === self.findIndex((l) => l.lotName === lot.lotName)
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
  }

  addLot() {
    const userId = this.authService.getUserId();
    const data = {
      ...this.newLot,
      ownerId: userId,
      managerId: userId,
      availableSpots: this.newLot.totalSpots,
      status: 'ACTIVE',
      isOpen: true
    };

    this.apiService.createLot(data).subscribe({
      next: (res) => {
        console.log('Lot created:', JSON.stringify(res));
        this.successMessage = 'Lot added successfully! 🎉';
        this.showAddForm = false;
        this.newLot = {
          lotName: '', address: '', city: '',
          state: '', pincode: '',
          totalSpots: 0, pricePerHour: 0,
          latitude: 0, longitude: 0
        };
        this.loadLots();
        setTimeout(() => { this.successMessage = ''; }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to add lot!';
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ FIXED - API call hogi ab, DB mein save hoga
  toggleLotStatus(lot: any) {
    const newStatus = lot.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.apiService.updateLotStatus(lot.lotId, newStatus).subscribe({
      next: () => {
        lot.status = newStatus;
        this.successMessage = `Lot ${newStatus === 'ACTIVE' ? 'opened ✅' : 'closed ❌'} successfully!`;
        setTimeout(() => { this.successMessage = ''; }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to update lot status!';
        this.cdr.detectChanges();
      }
    });
  }
}