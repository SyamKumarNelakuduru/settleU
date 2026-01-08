import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniversityService, University, StudentData } from '../../services/university.service';

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

  universities = [
    { id: 'uiuc', name: 'University of Illinois Urbana-Champaign', city: 'Urbana-Champaign', type: 'Public', website: 'https://illinois.edu' },
    { id: 'northwestern', name: 'Northwestern University', city: 'Evanston', type: 'Private', website: 'https://www.northwestern.edu' },
    { id: 'uchicago', name: 'University of Chicago', city: 'Chicago', type: 'Private', website: 'https://www.uchicago.edu' },
    { id: 'illinois-state', name: 'Illinois State University', city: 'Normal', type: 'Public', website: 'https://illinoisstate.edu' },
    { id: 'siue', name: 'Southern Illinois University Edwardsville', city: 'Edwardsville', type: 'Public', website: 'https://www.siue.edu' },
    { id: 'niu', name: 'Northern Illinois University', city: 'DeKalb', type: 'Public', website: 'https://www.niu.edu' },
    { id: 'luc', name: 'Loyola University Chicago', city: 'Chicago', type: 'Private', website: 'https://www.luc.edu' },
    { id: 'depaul', name: 'DePaul University', city: 'Chicago', type: 'Private', website: 'https://www.depaul.edu' },
    { id: 'iwu', name: 'Illinois Wesleyan University', city: 'Bloomington', type: 'Private', website: 'https://www.iwu.edu' },
    { id: 'bradley', name: 'Bradley University', city: 'Peoria', type: 'Private', website: 'https://www.bradley.edu' },
    { id: 'siu-carbondale', name: 'Southern Illinois University Carbondale', city: 'Carbondale', type: 'Public', website: 'https://siu.edu' },
    { id: 'neiu', name: 'Northeastern Illinois University', city: 'Chicago', type: 'Public', website: 'https://www.neiu.edu' },
    { id: 'chicago-state', name: 'Chicago State University', city: 'Chicago', type: 'Public', website: 'https://www.csu.edu' },
    { id: 'elmhurst', name: 'Elmhurst University', city: 'Elmhurst', type: 'Private', website: 'https://www.elmhurst.edu' },
    { id: 'millikin', name: 'Millikin University', city: 'Decatur', type: 'Private', website: 'https://www.millikin.edu' },
    { id: 'wiu', name: 'Western Illinois University', city: 'Macomb', type: 'Public', website: 'https://www.wiu.edu' },
    { id: 'eiu', name: 'Eastern Illinois University', city: 'Charleston', type: 'Public', website: 'https://www.eiu.edu' },
    { id: 'augustana', name: 'Augustana College', city: 'Rock Island', type: 'Private', website: 'https://www.augustana.edu' },
    { id: 'benedictine', name: 'Benedictine University', city: 'Lisle', type: 'Private', website: 'https://www.ben.edu' },
    { id: 'rockford', name: 'Rockford University', city: 'Rockford', type: 'Private', website: 'https://www.rockford.edu' }
  ];

  filteredUniversities: { id: string, name: string, city: string, type: string, website: string }[] = [];

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
    this.query = u.name;
    this.loadUniversityDetails(u.id);
  }

  async loadUniversityDetails(universityId: string): Promise<void> {
    this.isLoadingDetails = true;
    try {
      const university = await this.universityService.getUniversityById(universityId);
      if (university) {
        this.selectedUniversity = university;
      } else {
        console.warn('University not found:', universityId);
        this.selectedUniversity = null;
      }
    } catch (error) {
      console.error('Error loading university details:', error);
      this.selectedUniversity = null;
    } finally {
      this.isLoadingDetails = false;
    }
  }

  closeDetails(): void {
    this.selectedUniversity = null;
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
}
