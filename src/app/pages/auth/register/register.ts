import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  role: string = 'DRIVER';
  errorMessage: string = '';

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.errorMessage = '';
    console.log('Register:', this.email, this.role);
  }
}