import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CompareUniversity {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'Public' | 'Private';
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompareService {
  private readonly STORAGE_KEY = 'compareUniversities';
  private readonly MAX_COMPARE_COUNT = 4; // Maximum number of universities that can be compared
  private compareListSubject = new BehaviorSubject<CompareUniversity[]>([]);
  public compareList$: Observable<CompareUniversity[]> = this.compareListSubject.asObservable();

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const universities = JSON.parse(stored);
        this.compareListSubject.next(universities);
      }
    } catch (error) {
      console.error('Error loading compare list from storage:', error);
    }
  }

  private saveToStorage(universities: CompareUniversity[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(universities));
    } catch (error) {
      console.error('Error saving compare list to storage:', error);
    }
  }

  getCompareList(): CompareUniversity[] {
    return this.compareListSubject.value;
  }

  getCompareCount(): number {
    return this.compareListSubject.value.length;
  }

  /**
   * Gets the maximum number of universities that can be compared
   */
  getMaxCompareCount(): number {
    return this.MAX_COMPARE_COUNT;
  }

  /**
   * Checks if a specific university can be added (only checks if already in list)
   * Note: Users can now add unlimited universities; limit only applies to selection on compare page
   */
  canAddUniversity(universityId: string): boolean {
    const currentList = this.compareListSubject.value;
    // Check if already in list
    if (currentList.some(u => u.id === universityId)) {
      return false; // Already in compare list
    }
    return true; // Can always add if not already in list
  }

  addToCompare(university: CompareUniversity): { success: boolean; reason?: 'already_added' } {
    const currentList = this.compareListSubject.value;
    
    // Check if already in list
    if (currentList.some(u => u.id === university.id)) {
      return { success: false, reason: 'already_added' }; // Already in compare list
    }

    // No limit on adding - users can add as many as they want
    const newList = [...currentList, university];
    this.compareListSubject.next(newList);
    this.saveToStorage(newList);
    return { success: true }; // Successfully added
  }

  removeFromCompare(universityId: string): void {
    const currentList = this.compareListSubject.value;
    const newList = currentList.filter(u => u.id !== universityId);
    this.compareListSubject.next(newList);
    this.saveToStorage(newList);
  }

  clearCompareList(): void {
    this.compareListSubject.next([]);
    this.saveToStorage([]);
  }

  isInCompareList(universityId: string): boolean {
    return this.compareListSubject.value.some(u => u.id === universityId);
  }
}
