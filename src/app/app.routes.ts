import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { DriverDashboardComponent } from './pages/driver/dashboard/dashboard';
import { SearchLotsComponent } from './pages/driver/search-lots/search-lots';
import { MyBookingsComponent } from './pages/driver/my-bookings/my-bookings';
import { MyVehiclesComponent } from './pages/driver/my-vehicles/my-vehicles';
import { LotManagerDashboardComponent } from './pages/lot-manager/dashboard/dashboard';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'driver/dashboard', component: DriverDashboardComponent },
  { path: 'driver/search', component: SearchLotsComponent },
  { path: 'driver/bookings', component: MyBookingsComponent },
  { path: 'driver/vehicles', component: MyVehiclesComponent },
  { path: 'manager/dashboard', component: LotManagerDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];