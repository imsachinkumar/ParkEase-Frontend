import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class NotificationsComponent implements OnInit {
  driverName = '';
  notifications: any[] = [];
  isLoading = false;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.loadNotifications();
  }

  loadNotifications() {
    const userId = this.authService.getUserId();
    this.isLoading = true;
    this.apiService.getMyNotifications(userId).subscribe({
      next: (res) => {
        this.notifications = (res.data || []).sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.notifications = [];
        this.cdr.detectChanges();
      }
    });
  }

  getIcon(type: string): string {
    switch(type) {
      case 'BOOKING_CONFIRMED': return '🅿️';
      case 'BOOKING_CANCELLED': return '🚗';
      case 'PAYMENT_SUCCESS': return '💳';
      case 'GENERAL': return '📋';
      default: return '🔔';
    }
  }

  markAsRead(notificationId: number) {
    this.notifications = this.notifications.map(n =>
      n.notificationId === notificationId ? { ...n, status: 'READ' } : n
    );
    this.cdr.detectChanges();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.status === 'UNREAD').length;
  }
}