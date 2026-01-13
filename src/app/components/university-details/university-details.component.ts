import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityDetailsService, UniversityDetail } from '../../services/university-details.service';

@Component({
  selector: 'app-university-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-details.component.html',
  styleUrl: './university-details.component.scss'
})
export class UniversityDetailsComponent implements OnInit {
  universityDetails = signal<UniversityDetail | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  private universityId: string | null = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private universityDetailsService = inject(UniversityDetailsService);

  // Map university IDs to their full names
  private universityNames: { [key: string]: string } = {
    'uiuc': 'University of Illinois Urbana-Champaign',
    'northwestern': 'Northwestern University',
    'uchicago': 'University of Chicago',
    'illinois-state': 'Illinois State University',
    'siue': 'Southern Illinois University Edwardsville',
    'niu': 'Northern Illinois University',
    'luc': 'Loyola University Chicago',
    'depaul': 'DePaul University',
    'iwu': 'Illinois Wesleyan University',
    'bradley': 'Bradley University',
    'siu-carbondale': 'Southern Illinois University Carbondale',
    'neiu': 'Northeastern Illinois University',
    'chicago-state': 'Chicago State University',
    'elmhurst': 'Elmhurst University',
    'millikin': 'Millikin University',
    'wiu': 'Western Illinois University',
    'eiu': 'Eastern Illinois University',
    'augustana': 'Augustana College',
    'benedictine': 'Benedictine University',
    'rockford': 'Rockford University'
  };

  ngOnInit() {
    this.universityId = this.route.snapshot.paramMap.get('id');
    if (this.universityId) {
      this.loadUniversityDetails(this.universityId);
    } else {
      this.errorMessage.set('No university ID provided');
      this.isLoading.set(false);
    }
  }

  async loadUniversityDetails(id: string) {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      // Get university name from the mapping
      const universityName = this.universityNames[id];
      
      if (!universityName) {
        console.warn('No university name found for ID:', id);
        this.errorMessage.set('University not found');
        this.isLoading.set(false);
        return;
      }
      
      console.log('Fetching AI-powered details for:', universityName);
      
      // Fetch AI-generated details directly from Gemini
      const details = await this.universityDetailsService.getUniversityDetails(universityName);
      this.universityDetails.set(details);
      console.log('AI university details loaded successfully:', details);
      
    } catch (error) {
      console.error('Error loading university details:', error);
      this.errorMessage.set('Failed to load university details. Please try again.');
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

}
