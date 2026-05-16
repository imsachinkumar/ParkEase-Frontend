import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-vehicles.html',
  styleUrl: './my-vehicles.scss'
})
export class MyVehiclesComponent implements OnInit {
  showAddForm: boolean = false;
  vehicles: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  driverName: string = '';

  newVehicle = {
    plate: '', make: '', model: '',
    color: '', type: 'FOUR_WHEELER', isEV: false
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.loadVehicles();
  }

  loadVehicles() {
    const userId = this.authService.getUserId();
    this.isLoading = true;
    this.apiService.getMyVehicles(userId).subscribe({
      next: (res) => {
        console.log('Vehicles Response:', JSON.stringify(res));
        this.vehicles = res.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Vehicles array:', this.vehicles.length);
      },
      error: () => {
        this.isLoading = false;
        this.vehicles = [];
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
  }

  addVehicle() {
    const userId = this.authService.getUserId();
    const data = {
      ownerId: userId,
      licensePlate: this.newVehicle.plate.toUpperCase(),
      make: this.newVehicle.make,
      model: this.newVehicle.model,
      color: this.newVehicle.color,
      vehicleType: this.newVehicle.type,
      isEV: this.newVehicle.isEV
    };

    this.apiService.registerVehicle(data).subscribe({
      next: () => {
        this.loadVehicles();
        this.newVehicle = { plate: '', make: '', model: '',
          color: '', type: 'FOUR_WHEELER', isEV: false };
        this.showAddForm = false;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to add vehicle!';
      }
    });
  }

  deleteVehicle(id: number) {
    this.apiService.deleteVehicle(id).subscribe({
      next: () => { this.loadVehicles(); },
      error: () => { this.errorMessage = 'Failed to delete!'; }
    });
  }
}