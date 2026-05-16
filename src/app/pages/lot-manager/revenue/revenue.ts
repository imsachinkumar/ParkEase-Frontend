import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './revenue.html',
  styleUrl: './revenue.scss'
})
export class RevenueComponent implements OnInit {
  managerName = '';
  payments: any[] = [];
  isLoading = false;

  totalRevenue = 0;
  successPayments = 0;
  pendingPayments = 0;
  failedPayments = 0;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.managerName = user?.fullName || 'Manager';
    this.loadRevenue();
  }

  loadRevenue() {
    this.isLoading = true;
    this.apiService.getAllPayments().subscribe({
      next: (res) => {
        this.payments = res.data || [];
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
    this.totalRevenue = 0;
    this.successPayments = 0;
    this.pendingPayments = 0;
    this.failedPayments = 0;

    this.payments.forEach(p => {
      if (p.status === 'SUCCESS') {
        this.totalRevenue += p.amount || 0;
        this.successPayments++;
      } else if (p.status === 'PENDING') {
        this.pendingPayments++;
      } else if (p.status === 'FAILED') {
        this.failedPayments++;
      }
    });
  }

  getMethodCount(method: string): number {
    return this.payments.filter(p =>
      p.paymentMethod === method && p.status === 'SUCCESS'
    ).length;
  }

  getMethodRevenue(method: string): number {
    return this.payments
      .filter(p => p.paymentMethod === method && p.status === 'SUCCESS')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }
}