import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookingsComponent implements OnInit {
  activeTab: string = 'ALL';
  bookings: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  driverName: string = '';

  showPaymentModal = false;
  selectedBooking: any = null;
  selectedMethod = 'UPI';
  paymentMethods = ['UPI', 'CARD', 'CASH', 'NET_BANKING', 'WALLET'];
  paymentSuccess = false;
  paymentError = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.driverName = user?.fullName || user?.name || 'Driver';
    this.loadBookings();
  }

  loadBookings() {
    const userId = this.authService.getUserId();
    this.isLoading = true;
    this.apiService.getMyBookings(userId).subscribe({
      next: (res) => {
        const raw = res.data || [];
        this.bookings = raw.map((b: any) => ({
          ...b,
          startTimeFormatted: b.startTime
            ? new Date(b.startTime).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          endTimeFormatted: b.endTime
            ? new Date(b.endTime).toLocaleString('en-IN', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              })
            : 'N/A',
          displayLot: b.lotId ? 'Lot #' + b.lotId : 'N/A',
          displaySpot: b.spotId ? 'Spot #' + b.spotId : 'Auto-assigned',
          displayVehicle: b.vehicleId ? 'Vehicle #' + b.vehicleId : 'N/A',
          displayAmount: b.totalAmount ? '₹' + b.totalAmount : '₹TBD',
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.bookings = [];
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  cancelBooking(bookingId: number) {
    this.apiService.cancelBooking(bookingId).subscribe({
      next: () => { this.loadBookings(); },
      error: () => { this.loadBookings(); }
    });
  }

  checkIn(bookingId: number) {
    this.apiService.checkIn(bookingId).subscribe({
      next: () => { this.loadBookings(); },
      error: () => { this.loadBookings(); }
    });
  }

  checkOut(booking: any) {
    const startRaw = booking.startTime;
    const startUTC = startRaw.endsWith('Z') ? startRaw : startRaw + 'Z';
    const start = new Date(startUTC);
    const end = new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    const hours = Math.max(1, Math.ceil(diffMinutes / 60));
    const amount = hours * 30;

    this.apiService.checkOut(booking.bookingId, amount).subscribe({
      next: () => { this.loadBookings(); },
      error: () => { this.loadBookings(); }
    });
  }

  openPayment(booking: any) {
    this.selectedBooking = booking;
    this.showPaymentModal = false; // Modal nahi kholenge — seedha Razorpay
    this.paymentError = '';
    this.paymentSuccess = false;
    this.launchRazorpay(booking);
  }

  launchRazorpay(booking: any) {
    const userId = this.authService.getUserId();
    const user = this.authService.getCurrentUser();

    let amount = booking.totalAmount || 0;
    if (!amount || amount === 0) {
      const startRaw = booking.startTime;
      const startUTC = startRaw.endsWith('Z') ? startRaw : startRaw + 'Z';
      const start = new Date(startUTC);
      const end = new Date(booking.endTime);
      const hours = Math.max(1, Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      ));
      amount = hours * 30;
    }

    const options = {
      key: 'rzp_test_SnJwfBpaGfRmkn', // ✅ Razorpay Test Key
      amount: amount * 100, // Paise mein
      currency: 'INR',
      name: 'ParkEase',
      description: `Parking Booking #${booking.bookingId}`,
      image: '',
      handler: (response: any) => {
        console.log('✅ Razorpay Payment Success:', response);
        this.savePayment(
          userId,
          amount,
          response.razorpay_payment_id,
          booking
        );
      },
      prefill: {
        name: user?.fullName || user?.name || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      notes: {
        bookingId: booking.bookingId,
        lotId: booking.lotId
      },
      theme: {
        color: '#1a1a2e'
      },
      modal: {
        ondismiss: () => {
          this.paymentError = 'Payment cancelled!';
          this.cdr.detectChanges();
        }
      }
    };

    const rzp = new (globalThis as any).Razorpay(options);
    rzp.open();
  }

 savePayment(userId: number, amount: number,
            razorpayId: string, booking: any) {
  const data = {
    bookingId: booking.bookingId,
    userId: userId,
    amount: amount,
    paymentMethod: 'RAZORPAY', 
    transactionId: razorpayId
  };

  this.apiService.createPayment(data).subscribe({
    next: () => {
      this.apiService.updateBookingStatus(
        booking.bookingId, 'CONFIRMED'
      ).subscribe({
        next: () => {
          this.paymentSuccess = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.paymentSuccess = false;
            this.loadBookings();
          }, 1500);
        },
        error: () => {
          this.paymentSuccess = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.paymentSuccess = false;
            this.loadBookings();
          }, 1500);
        }
      });
    },
    error: () => {
      this.paymentError = 'Payment record save failed!';
      this.cdr.detectChanges();
    }
  });
}

  closePayment() {
    this.showPaymentModal = false;
    this.selectedBooking = null;
  }

  get filteredBookings() {
    if (this.activeTab === 'ALL') return this.bookings;
    if (this.activeTab === 'CONFIRMED')
      return this.bookings.filter(b => b.status === 'CONFIRMED');
    if (this.activeTab === 'COMPLETED')
      return this.bookings.filter(b => b.status === 'COMPLETED');
    if (this.activeTab === 'CANCELLED')
      return this.bookings.filter(b => b.status === 'CANCELLED');
    return this.bookings.filter(b => b.status === this.activeTab);
  }

  printReceipt(booking: any) {
    const receiptWindow = window.open('', '_blank', 'width=600,height=700');
    if (!receiptWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ParkEase Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px;
            color: #1a1a2e; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #1a1a2e;
            padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 700; color: #1a1a2e; }
          .logo span { color: #2563eb; }
          .title { font-size: 14px; color: #6b7280; margin-top: 4px; }
          .status-badge { display: inline-block; background: #d1fae5;
            color: #065f46; padding: 4px 12px; border-radius: 20px;
            font-size: 12px; font-weight: 600; margin-top: 8px; }
          .receipt-id { font-size: 13px; color: #6b7280; margin-top: 8px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 12px; font-weight: 600;
            color: #6b7280; text-transform: uppercase;
            letter-spacing: 0.05em; margin-bottom: 12px; }
          .row { display: flex; justify-content: space-between;
            padding: 8px 0; border-bottom: 1px solid #f3f4f6;
            font-size: 14px; }
          .row:last-child { border-bottom: none; }
          .row .label { color: #6b7280; }
          .row .value { font-weight: 600; color: #1a1a2e; }
          .total-row { background: #f0f4ff; border-radius: 8px;
            padding: 12px 16px; display: flex;
            justify-content: space-between; align-items: center;
            margin-top: 16px; }
          .total-label { font-weight: 600; font-size: 15px; }
          .total-value { font-size: 20px; font-weight: 700; color: #2563eb; }
          .footer { text-align: center; margin-top: 30px;
            padding-top: 20px; border-top: 1px solid #e5e7eb;
            font-size: 12px; color: #6b7280; }
          .thank-you { font-size: 16px; font-weight: 600;
            color: #1a1a2e; margin-bottom: 4px; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Park<span>Ease</span></div>
          <div class="title">Smart Parking Management Platform</div>
          <div class="status-badge">✅ COMPLETED</div>
          <div class="receipt-id">Receipt #RCPT-${booking.bookingId}-${Date.now().toString().slice(-6)}</div>
        </div>
        <div class="section">
          <div class="section-title">Booking Details</div>
          <div class="row">
            <span class="label">Booking ID</span>
            <span class="value">#${booking.bookingId}</span>
          </div>
          <div class="row">
            <span class="label">Parking Lot</span>
            <span class="value">${booking.displayLot}</span>
          </div>
          <div class="row">
            <span class="label">Spot</span>
            <span class="value">${booking.displaySpot}</span>
          </div>
          <div class="row">
            <span class="label">Vehicle</span>
            <span class="value">${booking.displayVehicle}</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Time Details</div>
          <div class="row">
            <span class="label">Check In</span>
            <span class="value">${booking.startTimeFormatted}</span>
          </div>
          <div class="row">
            <span class="label">Check Out</span>
            <span class="value">${booking.endTimeFormatted}</span>
          </div>
          <div class="row">
            <span class="label">Status</span>
            <span class="value">COMPLETED</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Payment Details</div>
          <div class="row">
            <span class="label">Amount</span>
            <span class="value">₹${booking.totalAmount || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Payment Method</span>
            <span class="value">Razorpay</span>
          </div>
          <div class="row">
            <span class="label">Payment Status</span>
            <span class="value">PAID</span>
          </div>
          <div class="row">
            <span class="label">Date</span>
            <span class="value">${new Date().toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}</span>
          </div>
        </div>
        <div class="total-row">
          <span class="total-label">Total Amount Paid</span>
          <span class="total-value">₹${booking.totalAmount || '0'}</span>
        </div>
        <div class="footer">
          <div class="thank-you">Thank you for using ParkEase! 🅿️</div>
          <div>Find. Reserve. Park. Effortlessly.</div>
          <div style="margin-top: 8px;">© 2026 ParkEase. All rights reserved.</div>
          <br/>
          <button class="no-print" onclick="window.print()"
            style="background:#1a1a2e; color:#fff; border:none;
            padding:10px 24px; border-radius:8px; font-size:14px;
            font-weight:600; cursor:pointer; margin-right:8px;">
            🖨️ Print Receipt
          </button>
          <button class="no-print" onclick="window.close()"
            style="background:#f3f4f6; color:#374151;
            border:1px solid #e5e7eb; padding:10px 24px;
            border-radius:8px; font-size:14px; cursor:pointer;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;

    receiptWindow.document.documentElement.innerHTML = html;
  }
}