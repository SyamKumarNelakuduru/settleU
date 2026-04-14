import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityDetailsService, UniversityDetail, CampusJob } from '../../services/university-details.service';
import { CompareService } from '../../services/compare.service';
import { FlyToCompareService } from '../../services/fly-to-compare.service';
import { University } from '../../models/university.model';
import { UniversityService } from '../../services/university.service';
import { InternationalStudentDemographicsComponent } from '../international-student-demographics/international-student-demographics.component';

type SectionType = 'overview' | 'accommodation' | 'amenities' | 'academics' | 'demographics' | 'safety' | 'financial' | 'contact' | 'reviews' | 'jobs';

interface NavSection {
  id: SectionType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-university-details',
  standalone: true,
  imports: [CommonModule, InternationalStudentDemographicsComponent],
  templateUrl: './university-details.component.html',
  styleUrl: './university-details.component.scss'
})
export class UniversityDetailsComponent implements OnInit {
  university = signal<University | null>(null);
  aiDetails = signal<UniversityDetail | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  aiUnavailable = signal(false); // true when AI failed but Firestore data is shown
  isDemographicModalOpen = signal(false);
  activeSection = signal<SectionType>('overview');
  
  // Accommodation subsection tracking
  accommodationView = signal<'list' | 'onCampus' | 'offCampus'>('list');
  expandedOffCampusCard = signal<string | null>(null);
  expandedStudentArea = signal<string | null>(null);

  universityId: string | null = null;
  document = document; // Expose document to template
  
  // Make universityId accessible in template
  get universityIdValue(): string | null {
    return this.universityId;
  }
  
  navigationSections: NavSection[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'accommodation', label: 'Accommodation', icon: '🏠' },
    { id: 'amenities', label: 'Amenities & Neighborhood', icon: '🏙️' },
    { id: 'academics', label: 'Academic Programs', icon: '📚' },
    { id: 'demographics', label: 'Demographics', icon: '👥' },
    { id: 'safety', label: 'Safety & Security', icon: '🛡️' },
    { id: 'financial', label: 'Tuition & Financial Aid', icon: '💰' },
    { id: 'contact', label: 'Contact & Links', icon: '📧' },
    { id: 'reviews', label: 'Student Reviews', icon: '⭐' },
    { id: 'jobs', label: 'Jobs On Campus', icon: '💼' }
  ];
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private universityDetailsService = inject(UniversityDetailsService);
  private compareService = inject(CompareService);
  private flyToCompareService = inject(FlyToCompareService);
  private universityService = inject(UniversityService);

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
      this.aiUnavailable.set(false);

      // Step 1: Resolve university name — Firestore first, then decode URL param
      let universityName = id;
      let firestoreUniversity: University | null = null;
      try {
        firestoreUniversity = await this.universityService.getUniversityById(id);
        if (firestoreUniversity) {
          universityName = firestoreUniversity.name;
          console.log('✅ Found in Firestore:', universityName);
        } else {
          universityName = decodeURIComponent(id);
          console.log('ℹ️ Not in Firestore, using name from URL:', universityName);
        }
      } catch {
        universityName = decodeURIComponent(id);
      }

      // Step 2: Fetch rich details from AI
      try {
        console.log('🤖 Fetching details from AI for:', universityName);
        const aiDetails = await this.universityDetailsService.getUniversityDetails(universityName);
        this.aiDetails.set(aiDetails);
        this.university.set(this.convertAIDetailsToUniversity(aiDetails));
        console.log('✅ AI details loaded:', aiDetails.name);

      } catch (aiError: any) {
        console.warn('⚠️ AI service failed, falling back to Firestore data:', aiError?.message);
        this.aiUnavailable.set(true);

        // Fallback: use whatever Firestore gave us (may be partial)
        if (firestoreUniversity) {
          this.university.set(firestoreUniversity);
          console.log('📦 Showing Firestore data as fallback');
        } else {
          // Nothing to show — create a minimal placeholder so the page renders
          this.university.set({
            name: universityName,
            city: '',
            state: '',
            country: '',
            type: 'Public',
            website: '',
            about: ''
          } as University);
        }
      }

    } catch (error) {
      console.error('Error loading university:', error);
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

  getInternationalCountryBreakdown(): Array<{ country: string; count: number; percentage: number }> {
    const students = this.university()?.students;
    if (!students?.internationalCountryBreakdown || !students.international || students.international === 0) {
      return [];
    }

    const breakdown = students.internationalCountryBreakdown;
    const totalInternational = students.international;

    // Convert to array and calculate percentages
    return Object.entries(breakdown)
      .map(([country, count]) => ({
        country,
        count: count as number,
        percentage: ((count as number) / totalInternational) * 100
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }

  async addToCompare(university: University, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    if (!this.universityId) {
      console.error('Cannot add to compare: university ID not found');
      return;
    }

    // Check if university can be added (only checks if already in list)
    if (!this.compareService.canAddUniversity(this.universityId)) {
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
      id: this.universityId,
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

  openGroupUrl(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Opens the real student employment portal for this job.
   * Uses the AI-provided apply_url, falls back to university website /jobs,
   * then falls back to a Google search for the university's student employment page.
   */
  applyForJob(job: CampusJob): void {
    const url = this.getApplyUrl(job);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  getApplyUrl(job: CampusJob): string {
    // Prefer AI-provided URL
    if (job.apply_url && job.apply_url.startsWith('http') && !job.apply_url.includes('actual-university')) {
      return job.apply_url;
    }
    return this.getJobsPortalUrl();
  }

  /**
   * Returns the best available URL for the university's jobs portal.
   * Falls back to a targeted Google search if no URL is known.
   */
  getJobsPortalUrl(): string {
    const name = this.aiDetails()?.name || '';
    const website = this.aiDetails()?.website || '';

    // Use the first AI job's apply_url as the portal URL if valid
    const jobs = this.aiDetails()?.campus_jobs;
    if (jobs?.length) {
      const firstUrl = jobs[0].apply_url;
      if (firstUrl && firstUrl.startsWith('http') && !firstUrl.includes('actual-university')) {
        return firstUrl;
      }
    }

    // Fallback: Google search for the university's student employment page
    const query = name
      ? `${name} student employment jobs portal`
      : 'student employment on campus jobs';
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  getAccommodationTips(): string[] {
    const uni = this.university();
    if (uni?.accommodationTips && uni.accommodationTips.length > 0) {
      return uni.accommodationTips;
    }
    
    // Default tips if none provided
    return [
      'Never pay deposits before seeing the lease.',
      'Prefer university-affiliated housing resources when possible.'
    ];
  }

  openDemographicModal(): void {
    this.isDemographicModalOpen.set(true);
  }

  closeDemographicModal(): void {
    this.isDemographicModalOpen.set(false);
  }

  selectSection(section: SectionType) {
    this.activeSection.set(section);
    // Reset accommodation view when switching to accommodation
    if (section === 'accommodation') {
      this.accommodationView.set('list');
    }
  }

  selectAccommodationView(view: 'list' | 'onCampus' | 'offCampus') {
    this.accommodationView.set(view);
    // Reset expanded card when switching views
    this.expandedOffCampusCard.set(null);
  }

  toggleOffCampusCard(cardName: string) {
    if (this.expandedOffCampusCard() === cardName) {
      this.expandedOffCampusCard.set(null);
    } else {
      this.expandedOffCampusCard.set(cardName);
    }
  }

  toggleStudentArea(areaName: string) {
    if (this.expandedStudentArea() === areaName) {
      this.expandedStudentArea.set(null);
    } else {
      this.expandedStudentArea.set(areaName);
    }
  }

  /**
   * Convert AI UniversityDetail to University format
   */
  private convertAIDetailsToUniversity(aiDetail: UniversityDetail): University {
    // Convert international students data
    const internationalCountryBreakdown: { [country: string]: number } = {};
    if (aiDetail.student_population.international_students.countires_percentage_population) {
      const totalIntl = aiDetail.student_population.international_students.total_international_students;
      Object.entries(aiDetail.student_population.international_students.countires_percentage_population).forEach(([country, percentage]) => {
        internationalCountryBreakdown[country] = Math.round((totalIntl * percentage) / 100);
      });
    }

    return {
      name: aiDetail.name,
      streetAddress: aiDetail.address.street,
      city: aiDetail.address.city,
      state: aiDetail.address.state,
      zipcode: aiDetail.address.zipCode,
      country: aiDetail.address.country,
      type: 'Public', // Default to Public, can be enhanced later
      website: aiDetail.website,
      about: aiDetail.description,
      students: {
        total: aiDetail.student_population.total_students,
        international: aiDetail.student_population.international_students.total_international_students,
        domestic: aiDetail.student_population.domestic_students,
        year: new Date().getFullYear(),
        source: 'AI Generated (Gemini)',
        internationalCountryBreakdown: internationalCountryBreakdown
      }
    };
  }
}
