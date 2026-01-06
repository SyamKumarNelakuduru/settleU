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
  
  // University management
  universities: Array<University & { id: string }> = [];
  newUniversity = {
    id: '',
    name: '',
    streetAddress: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    type: 'Public' as 'Public' | 'Private',
    website: ''
  };
  showUniversityForm = false;
  isLoadingUniversities = false;
  isSavingUniversity = false;
  
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

      // Get user profile to verify admin status
      const profile = await this.userService.getUserProfile(user.uid);
      this.userProfile.set(profile);

      if (profile?.isAdmin !== true) {
        // Redirect non-admins to home
        console.warn('Access denied: User is not an admin');
        this.router.navigate(['/']);
      } else {
        // Load universities if admin
        this.loadUniversities();
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

  toggleUniversityForm(): void {
    this.showUniversityForm = !this.showUniversityForm;
    if (!this.showUniversityForm) {
      this.resetUniversityForm();
    }
  }

  resetUniversityForm(): void {
    this.newUniversity = {
      id: '',
      name: '',
      streetAddress: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      type: 'Public',
      website: ''
    };
  }

  async loadUniversities(): Promise<void> {
    this.isLoadingUniversities = true;
    try {
      this.universities = await this.universityService.getAllUniversities();
      console.log('Loaded universities:', this.universities.length);
    } catch (error: any) {
      console.error('Error loading universities:', error);
      alert('❌ Error loading universities: ' + error.message);
    } finally {
      this.isLoadingUniversities = false;
    }
  }

  async addUniversity(): Promise<void> {
    if (!this.newUniversity.name.trim() || !this.newUniversity.streetAddress.trim() || 
        !this.newUniversity.city.trim() || !this.newUniversity.state.trim() || 
        !this.newUniversity.zipcode.trim() || !this.newUniversity.country.trim() || 
        !this.newUniversity.website.trim()) {
      alert('⚠️ Please fill in all fields');
      return;
    }

    // Generate ID from name if not provided
    if (!this.newUniversity.id.trim()) {
      this.newUniversity.id = this.newUniversity.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    this.isSavingUniversity = true;
    try {
      await this.universityService.addUniversity(this.newUniversity.id, {
        name: this.newUniversity.name.trim(),
        streetAddress: this.newUniversity.streetAddress.trim(),
        city: this.newUniversity.city.trim(),
        state: this.newUniversity.state.trim(),
        zipcode: this.newUniversity.zipcode.trim(),
        country: this.newUniversity.country.trim(),
        type: this.newUniversity.type,
        website: this.newUniversity.website.trim()
      });

      console.log('✅ University added:', this.newUniversity.id);
      alert('✅ University added successfully!');
      
      // Reload universities and reset form
      await this.loadUniversities();
      this.resetUniversityForm();
      this.showUniversityForm = false;
    } catch (error: any) {
      console.error('Error adding university:', error);
      alert('❌ Error adding university: ' + error.message);
    } finally {
      this.isSavingUniversity = false;
    }
  }

  async removeUniversity(universityId: string, universityName: string): Promise<void> {
    if (!confirm(`Are you sure you want to remove "${universityName}"?`)) {
      return;
    }

    try {
      await this.universityService.deleteUniversity(universityId);
      
      console.log('✅ University removed:', universityId);
      alert('✅ University removed successfully!');
      
      // Reload universities
      await this.loadUniversities();
    } catch (error: any) {
      console.error('Error removing university:', error);
      alert('❌ Error removing university: ' + error.message);
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
