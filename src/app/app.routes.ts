import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { DriverDashboardComponent } from './pages/driver/dashboard/dashboard';
import { SearchLotsComponent } from './pages/driver/search-lots/search-lots';
import { MyBookingsComponent } from './pages/driver/my-bookings/my-bookings';
import { MyVehiclesComponent } from './pages/driver/my-vehicles/my-vehicles';
import { LotManagerDashboardComponent } from './pages/lot-manager/dashboard/dashboard';
import { MyLotsComponent } from './pages/lot-manager/my-lots/my-lots';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard';
import { ManageSpotsComponent } from './pages/lot-manager/manage-spots/manage-spots';
import { ManagerBookingsComponent } from './pages/lot-manager/bookings/bookings';
import { ManageUsersComponent } from './pages/admin/manage-users/manage-users';
import { AllBookingsComponent } from './pages/admin/all-bookings/all-bookings';
import { PaymentsComponent } from './pages/driver/payments/payments';
import { NotificationsComponent } from './pages/driver/notifications/notifications';
import { RevenueComponent } from './pages/lot-manager/revenue/revenue';
import { ManageLotsComponent } from './pages/admin/manage-lots/manage-lots';
import { AdminPaymentsComponent } from './pages/admin/payments/payments';
import { ProfileComponent } from './pages/driver/profile/profile';
import { Profile } from './pages/lot-manager/profile/profile';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'manager/profile', component: Profile },
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Driver
  { path: 'driver/dashboard', component: DriverDashboardComponent },
  { path: 'driver/search', component: SearchLotsComponent },
  { path: 'driver/bookings', component: MyBookingsComponent },
  { path: 'driver/vehicles', component: MyVehiclesComponent },
  { path: 'driver/payments', component: PaymentsComponent },
  { path: 'driver/notifications', component: NotificationsComponent },
  { path: 'driver/profile', component: ProfileComponent },

  // Manager
  { path: 'manager/dashboard', component: LotManagerDashboardComponent },
  { path: 'manager/lots', component: MyLotsComponent },
  { path: 'manager/spots', component: ManageSpotsComponent },
  { path: 'manager/manage-spots', component: ManageSpotsComponent },
  { path: 'manager/bookings', component: ManagerBookingsComponent },
  { path: 'manager/revenue', component: RevenueComponent },

  // Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: ManageUsersComponent },
  { path: 'admin/bookings', component: AllBookingsComponent },
  { path: 'admin/lots', component: ManageLotsComponent },
  { path: 'admin/payments', component: AdminPaymentsComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];