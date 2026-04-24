import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-vehicles.html',
  styleUrl: './my-vehicles.scss'
})
export class MyVehiclesComponent {
  showAddForm: boolean = false;

  vehicles = [
    { id: 1, plate: 'UP80AB1234', make: 'Honda', model: 'City',
      color: 'White', type: 'FOUR_WHEELER', isEV: false, active: true },
    { id: 2, plate: 'UP80CD5678', make: 'Honda', model: 'Activa',
      color: 'Black', type: 'TWO_WHEELER', isEV: false, active: true },
  ];

  newVehicle = {
    plate: '', make: '', model: '',
    color: '', type: 'FOUR_WHEELER', isEV: false
  };

  toggleForm() {
    this.showAddForm = !this.showAddForm;
  }

  addVehicle() {
    if (this.newVehicle.plate && this.newVehicle.make) {
      this.vehicles.push({
        id: this.vehicles.length + 1,
        plate: this.newVehicle.plate.toUpperCase(),
        make: this.newVehicle.make,
        model: this.newVehicle.model,
        color: this.newVehicle.color,
        type: this.newVehicle.type,
        isEV: this.newVehicle.isEV,
        active: true
      });
      this.newVehicle = { plate: '', make: '', model: '',
        color: '', type: 'FOUR_WHEELER', isEV: false };
      this.showAddForm = false;
    }
  }

  deleteVehicle(id: number) {
    this.vehicles = this.vehicles.filter(v => v.id !== id);
  }
}