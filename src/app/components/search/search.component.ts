import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UniversityService, University } from '../../services/university.service';
import { CompareService } from '../../services/compare.service';
import { FlyToCompareService } from '../../services/fly-to-compare.service';

interface SearchUniversity {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  website: string;
}

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
  isLoading = signal(true);

  private allUniversities: SearchUniversity[] = [];
  filteredUniversities: SearchUniversity[] = [];

  private universityService = inject(UniversityService);
  private router = inject(Router);
  private compareService = inject(CompareService);
  private flyToCompareService = inject(FlyToCompareService);

  async ngAfterViewInit(): Promise<void> {
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    await this.loadUniversities();
  }

  private async loadUniversities(): Promise<void> {
    try {
      const universities = await this.universityService.getAllUniversities();
      this.allUniversities = universities
        .map(u => ({
          id: u.id ?? '',
          name: (u.name ?? '').trim(),
          city: (u.city ?? '').trim(),
          state: (u.state ?? '').trim(),
          type: (u.type ?? '').trim(),
          website: (u.website ?? '').trim()
        }))
        .filter(u => u.name.length > 0)           // drop records with no name
        .sort((a, b) => a.name.localeCompare(b.name));
      this.filterUniversities();
    } catch (error) {
      console.error('Failed to load universities:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private filterUniversities(): void {
    const q = (this.query ?? '').trim().toLowerCase();
    if (!q) {
      this.filteredUniversities = this.allUniversities.slice(0, 12);
    } else {
      this.filteredUniversities = this.allUniversities
        .filter(u =>
          (u.name  ?? '').toLowerCase().includes(q) ||
          (u.city  ?? '').toLowerCase().includes(q) ||
          (u.state ?? '').toLowerCase().includes(q)
        )
        .slice(0, 12);
    }
  }

  // Returns true when user typed something that has no exact match in the Firestore list
  get showFreeSearch(): boolean {
    const q = (this.query ?? '').trim();
    if (!q) return false;
    const qLower = q.toLowerCase();
    return !this.allUniversities.some(u => (u.name ?? '').toLowerCase() === qLower);
  }

  onInputChange(): void {
    this.filterUniversities();
  }

  submit(): void {
    const q = this.query.trim();
    if (q) {
      this.navigateToFreeSearch(q);
    }
  }

  selectUniversity(u: SearchUniversity): void {
    this.router.navigate(['/university', u.id]);
    this.close.emit();
  }

  // Navigate to a university by its full name — AI will look it up
  navigateToFreeSearch(name: string): void {
    // Use the name directly as the route param (URL-encoded automatically by Angular router)
    this.router.navigate(['/university', name]);
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

  getUniversityLogo(university: SearchUniversity): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=667eea&color=fff&size=128&bold=true&font-size=0.4`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.startsWith('data:image/svg+xml')) {
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%23667eea" stroke-width="2"%3E%3Cpath d="M22 10v6M2 10l10-5 10 5-10 5z"%3E%3C/path%3E%3Cpath d="M6 12v5c3 3 9 3 12 0v-5"%3E%3C/path%3E%3C/svg%3E';
    }
  }

  async addToCompare(university: SearchUniversity, event?: Event): Promise<void> {
    if (event) event.stopPropagation();

    if (this.compareService.isInCompareList(university.id)) return;
    if (!this.compareService.canAddUniversity(university.id)) return;

    const sourceElement = event?.currentTarget as HTMLElement;
    if (!sourceElement) return;

    const compareUniversity = {
      id: university.id,
      name: university.name,
      city: university.city,
      state: university.state,
      type: university.type as 'Public' | 'Private',
      website: university.website
    };

    await this.flyToCompareService.animate(sourceElement, '.compare-btn');
    this.compareService.addToCompare(compareUniversity);
  }
}
