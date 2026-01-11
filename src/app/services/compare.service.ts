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

  addToCompare(university: CompareUniversity): boolean {
    const currentList = this.compareListSubject.value;
    
    // Check if already in list
    if (currentList.some(u => u.id === university.id)) {
      return false; // Already in compare list
    }

    const newList = [...currentList, university];
    this.compareListSubject.next(newList);
    this.saveToStorage(newList);
    return true; // Successfully added
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
