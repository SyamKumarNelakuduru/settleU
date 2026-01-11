import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CompareService, CompareUniversity } from '../../services/compare.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compare.html',
  styleUrl: './compare.scss',
})
export class Compare implements OnInit {
  compareList: CompareUniversity[] = [];

  private compareService = inject(CompareService);
  private router = inject(Router);

  ngOnInit(): void {
    this.compareService.compareList$.subscribe(list => {
      this.compareList = list;
    });
  }

  removeFromCompare(universityId: string): void {
    this.compareService.removeFromCompare(universityId);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all universities from compare?')) {
      this.compareService.clearCompareList();
    }
  }

  goToUniversity(universityId: string): void {
    this.router.navigate(['/university', universityId]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openWebsite(url: string, event: Event): void {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  getUniversityLogo(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=667eea&color=fff&bold=true&font-size=0.4`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%23667eea" stroke-width="2"%3E%3Cpath d="M22 10v6M2 10l10-5 10 5-10 5z"%3E%3C/path%3E%3Cpath d="M6 12v5c3 3 9 3 12 0v-5"%3E%3C/path%3E%3C/svg%3E';
  }
}
