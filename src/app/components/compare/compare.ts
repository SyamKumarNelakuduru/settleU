import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CompareService, CompareUniversity } from '../../services/compare.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compare.html',
  styleUrl: './compare.scss',
})
export class Compare implements OnInit {
  compareList: CompareUniversity[] = [];
  maxCompareCount: number = 4;
  selectedUniversities: Set<string> = new Set<string>();

  private compareService = inject(CompareService);
  private router = inject(Router);
  private aiService = inject(AiService);

  ngOnInit(): void {
    this.maxCompareCount = this.compareService.getMaxCompareCount();
    this.compareService.compareList$.subscribe(list => {
      this.compareList = list;
      // Remove selected IDs that no longer exist in the list (cleanup)
      this.selectedUniversities.forEach(id => {
        if (!list.some(u => u.id === id)) {
          this.selectedUniversities.delete(id);
        }
      });
    });
  }

  removeFromCompare(universityId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.compareService.removeFromCompare(universityId);
    // Remove from selection if it was selected
    if (this.selectedUniversities.has(universityId)) {
      this.selectedUniversities.delete(universityId);
    }
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all universities from compare?')) {
      this.compareService.clearCompareList();
      this.selectedUniversities.clear();
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

  /**
   * Toggles selection of a university for comparison
   * Enforces maximum of 4 selections
   */
  toggleSelection(universityId: string, event: Event): void {
    event.stopPropagation(); // Prevent card click
    event.preventDefault(); // Prevent default checkbox behavior
    
    if (this.selectedUniversities.has(universityId)) {
      // Deselect if already selected
      this.selectedUniversities.delete(universityId);
    } else {
      // Select if not already selected and limit not reached
      if (this.selectedUniversities.size >= this.maxCompareCount) {
        alert(`You can only select up to ${this.maxCompareCount} universities to compare. Please deselect one first.`);
        return;
      }
      this.selectedUniversities.add(universityId);
    }
  }

  /**
   * Checks if a university is selected for comparison
   */
  isSelected(universityId: string): boolean {
    return this.selectedUniversities.has(universityId);
  }

  /**
   * Gets the count of selected universities
   */
  getSelectedCount(): number {
    return this.selectedUniversities.size;
  }

  /**
   * Checks if selection limit is reached
   */
  isSelectionLimitReached(): boolean {
    return this.selectedUniversities.size >= this.maxCompareCount;
  }

  /**
   * Test AI service with a sample prompt
   */
  async testAI(event: Event): Promise<void> {
    event.stopPropagation();
    console.log('Testing Gemini AI...');
    await this.aiService.testGemini();
  }
}
