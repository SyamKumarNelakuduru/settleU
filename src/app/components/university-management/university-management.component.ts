import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UniversityService, University } from '../../services/university.service';
import { CompareService } from '../../services/compare.service';
import { SeedAccommodationComponent } from '../seed-accommodation/seed-accommodation.component';
import { FlyToCompareService } from '../../services/fly-to-compare.service';

@Component({
  selector: 'app-university-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SeedAccommodationComponent],
  templateUrl: './university-management.component.html',
  styleUrl: './university-management.component.scss'
})
export class UniversityManagementComponent implements OnInit {
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
  isSeedingDetails = false;
  isSeedingSafety = false;
  seedingResult: { added: number; skipped: number; errors: string[] } | null = null;
  
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private universityService = inject(UniversityService);
  private router = inject(Router);
  private compareService = inject(CompareService);
  private flyToCompareService = inject(FlyToCompareService);

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.user$.subscribe(async (user) => {
      if (!user) {
        // Redirect to home if not logged in
        this.router.navigate(['/']);
        return;
      }

      // Get user profile to verify admin status
      const profile = await this.userService.getUserProfile(user.uid);

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

  async addToCompare(university: University & { id: string }, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    // Check if university can be added (only checks if already in list)
    if (!this.compareService.canAddUniversity(university.id)) {
      console.log('Already in compare list:', university.name);
      return;
    }

    // Get the source element (the compare icon button)
    const sourceElement = event?.currentTarget as HTMLElement;
    if (!sourceElement) {
      console.warn('Source element not found for animation');
      return;
    }

    const compareUniversity = {
      id: university.id,
      name: university.name,
      city: university.city,
      state: university.state,
      type: university.type,
      website: university.website
    };

    // Trigger fly animation (uses CSS selector for target element)
    await this.flyToCompareService.animate(sourceElement, '.compare-btn');

    // Add to compare list after animation completes
    const result = this.compareService.addToCompare(compareUniversity);
    if (result.success) {
      console.log('Added to compare:', university.name);
    }
  }

  async seedUniversities(): Promise<void> {
    if (this.isSeeding) return;
    
    if (!confirm('This will add 20 universities to Firestore. Continue?')) {
      return;
    }

    this.isSeeding = true;
    this.seedingResult = null;

    try {
      const result = await this.universityService.seedUniversities();
      this.seedingResult = result;
      
      if (result.added > 0) {
        alert(`✅ Successfully added ${result.added} universities!\n⏭️ Skipped ${result.skipped} existing\n${result.errors.length > 0 ? '❌ Errors: ' + result.errors.length : ''}`);
        await this.loadUniversities();
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

  async seedUniversityDetails(): Promise<void> {
    if (this.isSeedingDetails) return;
    
    if (!confirm('This will add About & Student data (real NCES data) to all 20 universities. Continue?')) {
      return;
    }

    this.isSeedingDetails = true;

    try {
      const result = await this.universityService.seedUniversityDetails();
      
      if (result.updated > 0) {
        alert(`✅ Successfully updated ${result.updated} universities with About & Student data!\n${result.errors.length > 0 ? '❌ Errors: ' + result.errors.length : ''}`);
        await this.loadUniversities();
      }
    } catch (error: any) {
      console.error('Seeding details error:', error);
      alert('❌ Error seeding university details: ' + error.message);
    } finally {
      this.isSeedingDetails = false;
    }
  }

  async seedSafetyData(): Promise<void> {
    if (this.isSeedingSafety) return;
    
    if (!confirm('This will add Safety info and Best Areas to Live data to all 20 universities. Continue?')) {
      return;
    }

    this.isSeedingSafety = true;

    try {
      const result = await this.universityService.seedUniversitySafetyData();
      
      if (result.updated > 0) {
        alert(`✅ Successfully updated ${result.updated} universities with Safety & Best Areas data!\n${result.errors.length > 0 ? '❌ Errors: ' + result.errors.length : ''}`);
        await this.loadUniversities();
      }
    } catch (error: any) {
      console.error('Seeding safety data error:', error);
      alert('❌ Error seeding safety data: ' + error.message);
    } finally {
      this.isSeedingSafety = false;
    }
  }
}
