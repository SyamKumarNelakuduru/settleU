import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  universities = [
    { name: 'University of Illinois Urbana-Champaign', city: 'Urbana-Champaign', type: 'Public', website: 'https://illinois.edu' },
    { name: 'Northwestern University', city: 'Evanston', type: 'Private', website: 'https://www.northwestern.edu' },
    { name: 'University of Chicago', city: 'Chicago', type: 'Private', website: 'https://www.uchicago.edu' },
    { name: 'Illinois State University', city: 'Normal', type: 'Public', website: 'https://illinoisstate.edu' },
    { name: 'Southern Illinois University Edwardsville', city: 'Edwardsville', type: 'Public', website: 'https://www.siue.edu' },
    { name: 'Northern Illinois University', city: 'DeKalb', type: 'Public', website: 'https://www.niu.edu' },
    { name: 'Loyola University Chicago', city: 'Chicago', type: 'Private', website: 'https://www.luc.edu' },
    { name: 'DePaul University', city: 'Chicago', type: 'Private', website: 'https://www.depaul.edu' },
    { name: 'Illinois Wesleyan University', city: 'Bloomington', type: 'Private', website: 'https://www.iwu.edu' },
    { name: 'Bradley University', city: 'Peoria', type: 'Private', website: 'https://www.bradley.edu' },
    { name: 'Southern Illinois University Carbondale', city: 'Carbondale', type: 'Public', website: 'https://siu.edu' },
    { name: 'Northeastern Illinois University', city: 'Chicago', type: 'Public', website: 'https://www.neiu.edu' },
    { name: 'Chicago State University', city: 'Chicago', type: 'Public', website: 'https://www.csu.edu' },
    { name: 'Elmhurst University', city: 'Elmhurst', type: 'Private', website: 'https://www.elmhurst.edu' },
    { name: 'Millikin University', city: 'Decatur', type: 'Private', website: 'https://www.millikin.edu' },
    { name: 'Western Illinois University', city: 'Macomb', type: 'Public', website: 'https://www.wiu.edu' },
    { name: 'Eastern Illinois University', city: 'Charleston', type: 'Public', website: 'https://www.eiu.edu' },
    { name: 'Augustana College', city: 'Rock Island', type: 'Private', website: 'https://www.augustana.edu' },
    { name: 'Benedictine University', city: 'Lisle', type: 'Private', website: 'https://www.ben.edu' },
    { name: 'Rockford University', city: 'Rockford', type: 'Private', website: 'https://www.rockford.edu' }
  ];

  get filteredUniversities() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.universities.slice(0, 10);
    return this.universities.filter(u => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)).slice(0, 10);
  }

  ngAfterViewInit(): void {
    // autofocus the input when the modal opens
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
  }

  submit(): void {
    this.searchSubmit.emit(this.query);
  }

  selectUniversity(u: { name: string }): void {
    this.query = u.name;
    this.searchSubmit.emit(this.query);
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
