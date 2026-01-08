import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/university.model';

@Component({
  selector: 'app-university-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-details.component.html',
  styleUrl: './university-details.component.scss'
})
export class UniversityDetailsComponent implements OnInit {
  university = signal<University | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService
  ) {}

  ngOnInit() {
    const universityId = this.route.snapshot.paramMap.get('id');
    if (universityId) {
      this.loadUniversityDetails(universityId);
    } else {
      this.errorMessage.set('No university ID provided');
      this.isLoading.set(false);
    }
  }

  async loadUniversityDetails(id: string) {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      console.log('Fetching university with ID:', id);
      const data = await this.universityService.getUniversityById(id);
      console.log('University data received:', data);
      
      if (data) {
        this.university.set(data);
        console.log('University data loaded successfully');
      } else {
        console.warn('No university found for ID:', id);
        this.errorMessage.set('University not found');
      }
    } catch (error) {
      console.error('Error loading university:', error);
      this.errorMessage.set('Failed to load university details');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  openWebsite(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  handleImageError(event: any) {
    // Fallback to a default gradient if image fails to load
    event.target.style.display = 'none';
    if (event.target.parentElement) {
      event.target.parentElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
      event.target.parentElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      `;
    }
  }
}
