import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.apiService.login({ email, password }).pipe(
      tap((response: any) => {
        console.log('Login Response:', JSON.stringify(response));
        if (response?.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.apiService.register(data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return (user && user !== 'undefined') ? JSON.parse(user) : null;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.userId || 0;
  }
}