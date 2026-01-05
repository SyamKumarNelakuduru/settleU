import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

export interface University {
  name: string;
  city: string;
  type: 'Public' | 'Private';
  website: string;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private firebaseService = inject(FirebaseService);
  private db = this.firebaseService.firestore;

  /**
   * One-time seeding function to insert universities into Firestore.
   * Safe to run multiple times - skips existing documents.
   */
  async seedUniversities(): Promise<{ added: number; skipped: number; errors: string[] }> {
    const universities: Array<{ id: string; data: University }> = [
      { id: 'uiuc', data: { name: 'University of Illinois Urbana-Champaign', city: 'Urbana-Champaign', type: 'Public', website: 'https://illinois.edu' }},
      { id: 'northwestern', data: { name: 'Northwestern University', city: 'Evanston', type: 'Private', website: 'https://www.northwestern.edu' }},
      { id: 'uchicago', data: { name: 'University of Chicago', city: 'Chicago', type: 'Private', website: 'https://www.uchicago.edu' }},
      { id: 'illinois-state', data: { name: 'Illinois State University', city: 'Normal', type: 'Public', website: 'https://illinoisstate.edu' }},
      { id: 'siue', data: { name: 'Southern Illinois University Edwardsville', city: 'Edwardsville', type: 'Public', website: 'https://www.siue.edu' }},
      { id: 'niu', data: { name: 'Northern Illinois University', city: 'DeKalb', type: 'Public', website: 'https://www.niu.edu' }},
      { id: 'luc', data: { name: 'Loyola University Chicago', city: 'Chicago', type: 'Private', website: 'https://www.luc.edu' }},
      { id: 'depaul', data: { name: 'DePaul University', city: 'Chicago', type: 'Private', website: 'https://www.depaul.edu' }},
      { id: 'iwu', data: { name: 'Illinois Wesleyan University', city: 'Bloomington', type: 'Private', website: 'https://www.iwu.edu' }},
      { id: 'bradley', data: { name: 'Bradley University', city: 'Peoria', type: 'Private', website: 'https://www.bradley.edu' }},
      { id: 'siu-carbondale', data: { name: 'Southern Illinois University Carbondale', city: 'Carbondale', type: 'Public', website: 'https://siu.edu' }},
      { id: 'neiu', data: { name: 'Northeastern Illinois University', city: 'Chicago', type: 'Public', website: 'https://www.neiu.edu' }},
      { id: 'chicago-state', data: { name: 'Chicago State University', city: 'Chicago', type: 'Public', website: 'https://www.csu.edu' }},
      { id: 'elmhurst', data: { name: 'Elmhurst University', city: 'Elmhurst', type: 'Private', website: 'https://www.elmhurst.edu' }},
      { id: 'millikin', data: { name: 'Millikin University', city: 'Decatur', type: 'Private', website: 'https://www.millikin.edu' }},
      { id: 'wiu', data: { name: 'Western Illinois University', city: 'Macomb', type: 'Public', website: 'https://www.wiu.edu' }},
      { id: 'eiu', data: { name: 'Eastern Illinois University', city: 'Charleston', type: 'Public', website: 'https://www.eiu.edu' }},
      { id: 'augustana', data: { name: 'Augustana College', city: 'Rock Island', type: 'Private', website: 'https://www.augustana.edu' }},
      { id: 'benedictine', data: { name: 'Benedictine University', city: 'Lisle', type: 'Private', website: 'https://www.ben.edu' }},
      { id: 'rockford', data: { name: 'Rockford University', city: 'Rockford', type: 'Private', website: 'https://www.rockford.edu' }}
    ];

    let added = 0;
    let skipped = 0;
    const errors: string[] = [];

    console.log('🌱 Starting university seeding...');

    for (const university of universities) {
      try {
        const docRef = doc(this.db, 'universities', university.id);
        
        // Check if document already exists
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log(`⏭️  Skipping ${university.id} - already exists`);
          skipped++;
          continue;
        }

        // Add createdAt timestamp and save
        const dataWithTimestamp = {
          ...university.data,
          createdAt: serverTimestamp()
        };

        await setDoc(docRef, dataWithTimestamp);
        console.log(`✅ Added ${university.id}`);
        added++;
      } catch (error: any) {
        const errorMsg = `❌ Error adding ${university.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { added, skipped, errors };
    console.log('🎉 Seeding complete:', result);
    return result;
  }
}
