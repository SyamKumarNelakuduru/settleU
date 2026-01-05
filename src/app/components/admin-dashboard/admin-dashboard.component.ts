import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  userProfile = signal<any>(null);
  
  // College management
  colleges: string[] = [];
  newCollege = '';
  showCollegeForm = false;
  
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

      // Get user profile to verify admin role
      const profile = await this.userService.getUserProfile(user.uid);
      this.userProfile.set(profile);

      if (profile?.role !== 'admin') {
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

  toggleCollegeForm(): void {
    this.showCollegeForm = !this.showCollegeForm;
    if (!this.showCollegeForm) {
      this.newCollege = '';
    }
  }

  addCollege(): void {
    if (this.newCollege.trim()) {
      this.colleges.push(this.newCollege.trim());
      this.newCollege = '';
      console.log('College added. Total colleges:', this.colleges.length);
      // TODO: Save to Firestore
    }
  }

  removeCollege(index: number): void {
    const collegeName = this.colleges[index];
    if (confirm(`Are you sure you want to remove "${collegeName}"?`)) {
      this.colleges.splice(index, 1);
      console.log('College removed. Remaining colleges:', this.colleges.length);
      // TODO: Update Firestore
    }
  }
}
