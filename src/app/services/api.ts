import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = 'http://localhost:8080/web';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // AUTH
  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register`, data);
  }

  // VEHICLES
  getMyVehicles(ownerId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/vehicles/owner/${ownerId}`,
      { headers: this.getHeaders() });
  }

  registerVehicle(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/vehicles/register`, data,
      { headers: this.getHeaders() });
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/vehicles/delete/${vehicleId}`,
      { headers: this.getHeaders() });
  }

  // PARKING LOTS
  searchLots(city: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/parking-lots/city/${city}`);
  }

  getAllLots(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/parking-lots/all`);
  }

  getLotById(lotId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/parking-lots/${lotId}`);
  }

  createLot(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/parking-lots/create`, data,
      { headers: this.getHeaders() });
  }

  // SPOTS
  getAvailableSpots(lotId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/spots/lot/${lotId}/available`);
  }

  getSpotsByLot(lotId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/spots/lot/${lotId}`,
      { headers: this.getHeaders() });
  }

  createSpot(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/spots/create`, data,
      { headers: this.getHeaders() });
  }

  deleteSpot(spotId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/spots/delete/${spotId}`,
      { headers: this.getHeaders() });
  }

  // BOOKINGS
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/bookings/create`, data,
      { headers: this.getHeaders() });
  }

  getMyBookings(userId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/bookings/user/${userId}`,
      { headers: this.getHeaders() });
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/bookings/all`,
      { headers: this.getHeaders() });
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/bookings/cancel/${bookingId}`,
      {}, { headers: this.getHeaders() });
  }

  updateBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}/bookings/${bookingId}/status`,
      { status }, { headers: this.getHeaders() });
  }

  checkIn(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.BASE_URL}/bookings/checkin/${bookingId}`,
      {}, { headers: this.getHeaders() });
  }

  // ✅ UPDATED - amount bhi bhej raha hai
  checkOut(bookingId: number, amount: number): Observable<any> {
    return this.http.patch(
      `${this.BASE_URL}/bookings/checkout/${bookingId}?amount=${amount}`,
      {}, { headers: this.getHeaders() });
  }

  // PAYMENTS
  createPayment(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/payments/create`, data,
      { headers: this.getHeaders() });
  }

  getMyPayments(userId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/payments/user/${userId}`,
      { headers: this.getHeaders() });
  }

  // NOTIFICATIONS
  getMyNotifications(userId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/notifications/user/${userId}`,
      { headers: this.getHeaders() });
  }

  // USERS (ADMIN)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/users/all`,
      { headers: this.getHeaders() });
  }

  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}/users/${userId}/status`,
      { status }, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/users/delete/${userId}`,
      { headers: this.getHeaders() });
  }

  getAllPayments(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/payments/all`,
      { headers: this.getHeaders() });
  }

  updateLotStatus(lotId: number, status: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}/parking-lots/${lotId}/status`,
      { status }, { headers: this.getHeaders() });
  }

  processPayment(paymentId: number): Observable<any> {
    return this.http.put(`${this.BASE_URL}/payments/process/${paymentId}`,
      {}, { headers: this.getHeaders() });
  }

  refundPayment(paymentId: number): Observable<any> {
    return this.http.put(`${this.BASE_URL}/payments/refund/${paymentId}`,
      {}, { headers: this.getHeaders() });
  }
}