import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-lots',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-lots.html',
  styleUrl: './search-lots.scss'
})
export class SearchLotsComponent {
  searchCity: string = '';
  showEVOnly: boolean = false;
  isSearched: boolean = false;

  allLots = [
    { id: 1, name: 'City Center Parking',  address: 'MG Road, Block A', city: 'Agra',    available: 23, total: 50,  price: 30,  rating: 4.5, status: 'Open',  hasEV: true  },
    { id: 2, name: 'Station Road Parking', address: 'Near Railway Station', city: 'Agra', available: 5,  total: 80,  price: 20,  rating: 4.2, status: 'Open',  hasEV: false },
    { id: 3, name: 'Mall Parking Complex', address: 'Phoenix Mall',     city: 'Agra',     available: 67, total: 120, price: 40,  rating: 4.8, status: 'Open',  hasEV: true  },
    { id: 4, name: 'Taj View Parking',     address: 'Fatehabad Road',   city: 'Agra',     available: 0,  total: 40,  price: 50,  rating: 3.9, status: 'Full',  hasEV: false },
    { id: 5, name: 'Sadar Bazaar Parking', address: 'Sadar Bazaar',     city: 'Agra',     available: 12, total: 60,  price: 15,  rating: 4.0, status: 'Open',  hasEV: false },
    { id: 6, name: 'Green Park Parking',   address: 'Kamla Nagar',      city: 'Mathura',  available: 18, total: 35,  price: 25,  rating: 4.6, status: 'Open',  hasEV: true  },
  ];

  filteredLots: any[] = [];

  onSearch() {
    this.isSearched = true;
    this.filteredLots = this.allLots.filter(lot => {
      const cityMatch = !this.searchCity ||
        lot.city.toLowerCase().includes(this.searchCity.toLowerCase()) ||
        lot.address.toLowerCase().includes(this.searchCity.toLowerCase());
      const evMatch = !this.showEVOnly || lot.hasEV;
      return cityMatch && evMatch;
    });
  }

  quickSearch(city: string) {
    this.searchCity = city;
    this.onSearch();
  }
}