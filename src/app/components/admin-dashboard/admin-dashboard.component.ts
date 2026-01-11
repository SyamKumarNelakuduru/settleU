import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'firebase/auth';
import { SeedAccommodationComponent } from '../seed-accommodation/seed-accommodation.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SeedAccommodationComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  userProfile = signal<any>(null);
  
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.user$.subscribe(async (user) => {
      this.currentUser.set(user);
      
      if (!user) {
        // Redirect to home if not logged in
        this.router.navigate(['/']);
        return;
      }

      // Get user profile to verify admin status
      const profile = await this.userService.getUserProfile(user.uid);
      this.userProfile.set(profile);

      if (profile?.isAdmin !== true) {
        // Redirect non-admins to home
        console.warn('Access denied: User is not an admin');
        this.router.navigate(['/']);
      }
    });
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      console.log('Admin logged out successfully');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const user = this.currentUser();
    const name = user?.displayName || user?.email || 'Admin';
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`;
  }
}
