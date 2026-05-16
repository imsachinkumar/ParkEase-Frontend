import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payments.html',
  styleUrl: './payments.scss'
})
export class PaymentsComponent implements OnInit {
  driverName = '';
  payments: any[] = [];
  filteredPayments: any[] = [];
  isLoading = false;
  selectedStatus = 'ALL';

  statuses = ['ALL', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.loadPayments();
  }

  loadPayments() {
    const userId = this.authService.getUserId();
    this.isLoading = true;
    this.apiService.getMyPayments(userId).subscribe({
      next: (res) => {
        const raw = res.data || [];
        this.payments = raw.map((p: any) => ({
          ...p,
          paidAtFormatted: p.paidAt
            ? new Date(p.paidAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          createdAtFormatted: p.createdAt
            ? new Date(p.createdAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
        }));
        this.filteredPayments = this.payments;
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
      this.filteredPayments = this.payments;
    } else {
      this.filteredPayments = this.payments.filter(p => p.status === status);
    }
  }
}