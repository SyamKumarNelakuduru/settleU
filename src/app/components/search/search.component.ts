import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UniversityService, University, StudentData } from '../../services/university.service';
import { CompareService } from '../../services/compare.service';
import { FlyToCompareService } from '../../services/fly-to-compare.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() searchSubmit = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  query = '';
  selectedUniversity: (University & { id: string }) | null = null;
  isLoadingDetails = false;

  private universityService = inject(UniversityService);
  private router = inject(Router);
  private compareService = inject(CompareService);
  private flyToCompareService = inject(FlyToCompareService);

  universities = [
    { id: 'uiuc', name: 'University of Illinois Urbana-Champaign', city: 'Urbana-Champaign', type: 'Public', website: 'https://illinois.edu', logo: 'https://logo.clearbit.com/illinois.edu' },
    { id: 'northwestern', name: 'Northwestern University', city: 'Evanston', type: 'Private', website: 'https://www.northwestern.edu', logo: 'https://logo.clearbit.com/northwestern.edu' },
    { id: 'uchicago', name: 'University of Chicago', city: 'Chicago', type: 'Private', website: 'https://www.uchicago.edu', logo: 'https://logo.clearbit.com/uchicago.edu' },
    { id: 'illinois-state', name: 'Illinois State University', city: 'Normal', type: 'Public', website: 'https://illinoisstate.edu', logo: 'https://logo.clearbit.com/illinoisstate.edu' },
    { id: 'siue', name: 'Southern Illinois University Edwardsville', city: 'Edwardsville', type: 'Public', website: 'https://www.siue.edu', logo: 'https://logo.clearbit.com/siue.edu' },
    { id: 'niu', name: 'Northern Illinois University', city: 'DeKalb', type: 'Public', website: 'https://www.niu.edu', logo: 'https://logo.clearbit.com/niu.edu' },
    { id: 'luc', name: 'Loyola University Chicago', city: 'Chicago', type: 'Private', website: 'https://www.luc.edu', logo: 'https://logo.clearbit.com/luc.edu' },
    { id: 'depaul', name: 'DePaul University', city: 'Chicago', type: 'Private', website: 'https://www.depaul.edu', logo: 'https://logo.clearbit.com/depaul.edu' },
    { id: 'iwu', name: 'Illinois Wesleyan University', city: 'Bloomington', type: 'Private', website: 'https://www.iwu.edu', logo: 'https://logo.clearbit.com/iwu.edu' },
    { id: 'bradley', name: 'Bradley University', city: 'Peoria', type: 'Private', website: 'https://www.bradley.edu', logo: 'https://logo.clearbit.com/bradley.edu' },
    { id: 'siu-carbondale', name: 'Southern Illinois University Carbondale', city: 'Carbondale', type: 'Public', website: 'https://siu.edu', logo: 'https://logo.clearbit.com/siu.edu' },
    { id: 'neiu', name: 'Northeastern Illinois University', city: 'Chicago', type: 'Public', website: 'https://www.neiu.edu', logo: 'https://logo.clearbit.com/neiu.edu' },
    { id: 'chicago-state', name: 'Chicago State University', city: 'Chicago', type: 'Public', website: 'https://www.csu.edu', logo: 'https://logo.clearbit.com/csu.edu' },
    { id: 'elmhurst', name: 'Elmhurst University', city: 'Elmhurst', type: 'Private', website: 'https://www.elmhurst.edu', logo: 'https://logo.clearbit.com/elmhurst.edu' },
    { id: 'millikin', name: 'Millikin University', city: 'Decatur', type: 'Private', website: 'https://www.millikin.edu', logo: 'https://logo.clearbit.com/millikin.edu' },
    { id: 'wiu', name: 'Western Illinois University', city: 'Macomb', type: 'Public', website: 'https://www.wiu.edu', logo: 'https://logo.clearbit.com/wiu.edu' },
    { id: 'eiu', name: 'Eastern Illinois University', city: 'Charleston', type: 'Public', website: 'https://www.eiu.edu', logo: 'https://logo.clearbit.com/eiu.edu' },
    { id: 'augustana', name: 'Augustana College', city: 'Rock Island', type: 'Private', website: 'https://www.augustana.edu', logo: 'https://logo.clearbit.com/augustana.edu' },
    { id: 'benedictine', name: 'Benedictine University', city: 'Lisle', type: 'Private', website: 'https://www.ben.edu', logo: 'https://logo.clearbit.com/ben.edu' },
    { id: 'rockford', name: 'Rockford University', city: 'Rockford', type: 'Private', website: 'https://www.rockford.edu', logo: 'https://logo.clearbit.com/rockford.edu' }
  ];

  filteredUniversities: { id: string, name: string, city: string, type: string, website: string, logo: string }[] = [];

  // get filteredUniversities() {
  //   const q = this.query.trim().toLowerCase();
  //   if (!q) return this.universities.slice(0, 10);
  //   return this.universities.filter(u => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)).slice(0, 10);
  // }

  ngAfterViewInit(): void {
    // autofocus the input when the modal opens
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    this.getFilteredUniversities();
  }

  getFilteredUniversities(): void {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      this.filteredUniversities = this.universities;
    } else {
      this.filteredUniversities = this.universities.filter(u => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)).slice(0, 10);
    }
  }

  onInputChange(): void {
    this.getFilteredUniversities();
  }

  submit(): void {
    this.searchSubmit.emit(this.query);
  }

  selectUniversity(u: { id: string, name: string }): void {
    // Navigate to university details page and close modal
    this.router.navigate(['/university', u.id]);
    this.close.emit();
  }

  onOverlayClick(): void {
    this.close.emit();
  }

  closeModal(): void {
    this.close.emit();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  getUniversityLogo(university: any): string {
    // Return the logo URL if available, otherwise fallback to UI Avatars
    return university.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=667eea&color=fff&size=128&bold=true&font-size=0.4`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Fallback to a default university icon
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%23667eea" stroke-width="2"%3E%3Cpath d="M22 10v6M2 10l10-5 10 5-10 5z"%3E%3C/path%3E%3Cpath d="M6 12v5c3 3 9 3 12 0v-5"%3E%3C/path%3E%3C/svg%3E';
  }

  async addToCompare(university: { id: string, name: string, city: string, type: string, website: string }, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    // Check if already in compare list
    if (this.compareService.isInCompareList(university.id)) {
      console.log('Already in compare list:', university.name);
      return;
    }

    // Get the source element (the compare icon button)
    const sourceElement = event?.currentTarget as HTMLElement;
    if (!sourceElement) {
      console.warn('Source element not found for animation');
      return;
    }

    // Extract state from city if available, otherwise default to Illinois (all search universities are in Illinois)
    // This is a simple mapping - you may want to enhance this based on your needs
    const state = this.getStateFromCity(university.city);
    
    const compareUniversity = {
      id: university.id,
      name: university.name,
      city: university.city,
      state: state,
      type: university.type as 'Public' | 'Private',
      website: university.website
    };

    // Check if university can be added (only checks if already in list)
    if (!this.compareService.canAddUniversity(university.id)) {
      console.log('Already in compare list:', university.name);
      return;
    }

    // Trigger fly animation (uses CSS selector for target element)
    await this.flyToCompareService.animate(sourceElement, '.compare-btn');

    // Add to compare list after animation completes
    const result = this.compareService.addToCompare(compareUniversity);
    if (result.success) {
      console.log('Added to compare:', university.name);
    }
  }

  private getStateFromCity(city: string): string {
    // Since all universities in the search component are in Illinois, default to Illinois
    // You can enhance this with a proper mapping if needed
    return 'Illinois';
  }
}
