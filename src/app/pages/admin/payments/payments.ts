import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payments.html',
  styleUrl: './payments.scss'
})
export class AdminPaymentsComponent implements OnInit {
  adminName = '';
  payments: any[] = [];
  filteredPayments: any[] = [];
  isLoading = false;
  selectedStatus = 'ALL';
  statuses = ['ALL', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];

  totalRevenue = 0;
  totalTransactions = 0;
  successCount = 0;
  pendingCount = 0;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || 'Admin';
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.apiService.getAllPayments().subscribe({
      next: (res) => {
        const raw = res.data || [];
        this.payments = raw.map((p: any) => ({
          ...p,
          createdAtFormatted: p.createdAt
            ? new Date(p.createdAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          paidAtFormatted: p.paidAt
            ? new Date(p.paidAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
        }));
        this.filteredPayments = this.payments;
        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.totalTransactions = this.payments.length;
    this.totalRevenue = this.payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    this.successCount = this.payments.filter(p => p.status === 'SUCCESS').length;
    this.pendingCount = this.payments.filter(p => p.status === 'PENDING').length;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filteredPayments = this.payments;
    } else {
      this.filteredPayments = this.payments.filter(p => p.status === status);
    }
  }

  processPayment(paymentId: number) {
    this.apiService.processPayment(paymentId).subscribe({
      next: () => { this.loadPayments(); },
      error: () => {}
    });
  }

  refundPayment(paymentId: number) {
    this.apiService.refundPayment(paymentId).subscribe({
      next: () => { this.loadPayments(); },
      error: () => {}
    });
  }
}