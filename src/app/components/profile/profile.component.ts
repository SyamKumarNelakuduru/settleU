import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
      
      // Redirect to home if not logged in
      if (!user) {
        this.router.navigate(['/']);
      }
    });
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      console.log('User logged out successfully');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
