import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-manage-spots',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-spots.html',
  styleUrl: './manage-spots.scss'
})
export class ManageSpotsComponent implements OnInit {
  managerName = '';
  lots: any[] = [];
  spots: any[] = [];
  selectedLotId: number = 0;
  selectedLotName: string = '';
  showAddForm = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  newSpot = {
    spotNumber: '',
    spotType: 'FOUR_WHEELER',
    isEV: false,
    isCovered: false
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.managerName = user?.fullName || 'Manager';
    this.loadLots();
  }

  loadLots() {
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        this.lots = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  selectLot(lot: any) {
    this.selectedLotId = lot.lotId;
    this.selectedLotName = lot.lotName;
    this.loadSpots(lot.lotId);
  }

  loadSpots(lotId: number) {
    this.isLoading = true;
    this.apiService.getSpotsByLot(lotId).subscribe({
      next: (res) => {
        this.spots = res.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.spots = [];
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
  }

  addSpot() {
    if (!this.selectedLotId) {
      this.errorMessage = 'Please select a lot first!';
      return;
    }

    const data = {
      lotId: this.selectedLotId,
      spotNumber: this.newSpot.spotNumber,
      spotType: this.newSpot.spotType,
      isEV: this.newSpot.isEV,
      isCovered: this.newSpot.isCovered
    };

    this.apiService.createSpot(data).subscribe({
      next: () => {
        this.successMessage = 'Spot added successfully!';
        this.showAddForm = false;
        this.newSpot = { spotNumber: '', spotType: 'FOUR_WHEELER',
          isEV: false, isCovered: false };
        this.loadSpots(this.selectedLotId);
        setTimeout(() => { this.successMessage = ''; }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to add spot!';
        this.cdr.detectChanges();
      }
    });
  }

  deleteSpot(spotId: number) {
    this.apiService.deleteSpot(spotId).subscribe({
      next: () => {
        this.loadSpots(this.selectedLotId);
      },
      error: () => {
        this.errorMessage = 'Failed to delete spot!';
      }
    });
  }
}