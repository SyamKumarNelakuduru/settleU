import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UniversityService, University } from '../../services/university.service';
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
  colleges: Array<University & { id: string }> = [];
  newCollege = {
    id: '',
    name: '',
    city: '',
    type: 'Public' as 'Public' | 'Private',
    website: ''
  };
  showCollegeForm = false;
  isLoadingColleges = false;
  isSavingCollege = false;
  
  // University seeding
  isSeeding = false;
  seedingResult: { added: number; skipped: number; errors: string[] } | null = null;
  
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private universityService = inject(UniversityService);
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
      } else {
        // Load colleges if admin
        this.loadColleges();
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

  toggleCollegeForm(): void {
    this.showCollegeForm = !this.showCollegeForm;
    if (!this.showCollegeForm) {
      this.resetCollegeForm();
    }
  }

  resetCollegeForm(): void {
    this.newCollege = {
      id: '',
      name: '',
      city: '',
      type: 'Public',
      website: ''
    };
  }

  async loadColleges(): Promise<void> {
    this.isLoadingColleges = true;
    try {
      this.colleges = await this.universityService.getAllUniversities();
      console.log('Loaded colleges:', this.colleges.length);
    } catch (error: any) {
      console.error('Error loading colleges:', error);
      alert('❌ Error loading colleges: ' + error.message);
    } finally {
      this.isLoadingColleges = false;
    }
  }

  async addCollege(): Promise<void> {
    if (!this.newCollege.name.trim() || !this.newCollege.city.trim() || !this.newCollege.website.trim()) {
      alert('⚠️ Please fill in all fields');
      return;
    }

    // Generate ID from name if not provided
    if (!this.newCollege.id.trim()) {
      this.newCollege.id = this.newCollege.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    this.isSavingCollege = true;
    try {
      await this.universityService.addUniversity(this.newCollege.id, {
        name: this.newCollege.name.trim(),
        city: this.newCollege.city.trim(),
        type: this.newCollege.type,
        website: this.newCollege.website.trim()
      });

      console.log('✅ College added:', this.newCollege.id);
      alert('✅ College added successfully!');
      
      // Reload colleges and reset form
      await this.loadColleges();
      this.resetCollegeForm();
      this.showCollegeForm = false;
    } catch (error: any) {
      console.error('Error adding college:', error);
      alert('❌ Error adding college: ' + error.message);
    } finally {
      this.isSavingCollege = false;
    }
  }

  async removeCollege(collegeId: string, collegeName: string): Promise<void> {
    if (!confirm(`Are you sure you want to remove "${collegeName}"?`)) {
      return;
    }

    try {
      await this.universityService.deleteUniversity(collegeId);
      
      console.log('✅ College removed:', collegeId);
      alert('✅ College removed successfully!');
      
      // Reload colleges
      await this.loadColleges();
    } catch (error: any) {
      console.error('Error removing college:', error);
      alert('❌ Error removing college: ' + error.message);
    }
  }

  async seedUniversities(): Promise<void> {
    if (this.isSeeding) return;
    
    if (!confirm('This will add 18 universities to Firestore. Continue?')) {
      return;
    }

    this.isSeeding = true;
    this.seedingResult = null;

    try {
      const result = await this.universityService.seedUniversities();
      this.seedingResult = result;
      
      if (result.added > 0) {
        alert(`✅ Successfully added ${result.added} universities!\n⏭️ Skipped ${result.skipped} existing\n${result.errors.length > 0 ? '❌ Errors: ' + result.errors.length : ''}`);
      } else {
        alert(`ℹ️ All universities already exist (${result.skipped} skipped)`);
      }
    } catch (error: any) {
      console.error('Seeding error:', error);
      alert('❌ Error seeding universities: ' + error.message);
    } finally {
      this.isSeeding = false;
    }
  }
}
