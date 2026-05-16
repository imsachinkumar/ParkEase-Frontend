import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-manage-lots',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-lots.html',
  styleUrl: './manage-lots.scss'
})
export class ManageLotsComponent implements OnInit {
  adminName = '';
  lots: any[] = [];
  filteredLots: any[] = [];
  isLoading = false;
  selectedStatus = 'ALL';
  statuses = ['ALL', 'ACTIVE', 'INACTIVE'];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || 'Admin';
    this.loadLots();
  }

  loadLots() {
    this.isLoading = true;
    this.apiService.getAllLots().subscribe({
      next: (res) => {
        this.lots = res.data || [];
        this.filteredLots = this.lots;
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
      this.filteredLots = this.lots;
    } else {
      this.filteredLots = this.lots.filter(l => l.status === status);
    }
  }

  updateLotStatus(lotId: number, status: string) {
    this.apiService.updateLotStatus(lotId, status).subscribe({
      next: () => { this.loadLots(); },
      error: () => {}
    });
  }

  approveLot(lotId: number) {
    this.updateLotStatus(lotId, 'ACTIVE');
  }

  rejectLot(lotId: number) {
    this.updateLotStatus(lotId, 'INACTIVE');
  }

  activateLot(lotId: number) {
    this.updateLotStatus(lotId, 'ACTIVE');
  }

  closeLot(lotId: number) {
    this.updateLotStatus(lotId, 'INACTIVE');
  }
}