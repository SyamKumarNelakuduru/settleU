import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

export interface University {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
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
      { id: 'uiuc', data: { name: 'University of Illinois Urbana-Champaign', streetAddress: '601 E John St', city: 'Champaign', state: 'Illinois', zipcode: '61820', country: 'United States', type: 'Public', website: 'https://illinois.edu' }},
      { id: 'northwestern', data: { name: 'Northwestern University', streetAddress: '633 Clark St', city: 'Evanston', state: 'Illinois', zipcode: '60208', country: 'United States', type: 'Private', website: 'https://www.northwestern.edu' }},
      { id: 'uchicago', data: { name: 'University of Chicago', streetAddress: '5801 S Ellis Ave', city: 'Chicago', state: 'Illinois', zipcode: '60637', country: 'United States', type: 'Private', website: 'https://www.uchicago.edu' }},
      { id: 'illinois-state', data: { name: 'Illinois State University', streetAddress: 'Campus Box 1000', city: 'Normal', state: 'Illinois', zipcode: '61790', country: 'United States', type: 'Public', website: 'https://illinoisstate.edu' }},
      { id: 'siue', data: { name: 'Southern Illinois University Edwardsville', streetAddress: '1 Hairpin Dr', city: 'Edwardsville', state: 'Illinois', zipcode: '62026', country: 'United States', type: 'Public', website: 'https://www.siue.edu' }},
      { id: 'niu', data: { name: 'Northern Illinois University', streetAddress: '1425 W Lincoln Hwy', city: 'DeKalb', state: 'Illinois', zipcode: '60115', country: 'United States', type: 'Public', website: 'https://www.niu.edu' }},
      { id: 'luc', data: { name: 'Loyola University Chicago', streetAddress: '1032 W Sheridan Rd', city: 'Chicago', state: 'Illinois', zipcode: '60660', country: 'United States', type: 'Private', website: 'https://www.luc.edu' }},
      { id: 'depaul', data: { name: 'DePaul University', streetAddress: '1 E Jackson Blvd', city: 'Chicago', state: 'Illinois', zipcode: '60604', country: 'United States', type: 'Private', website: 'https://www.depaul.edu' }},
      { id: 'iwu', data: { name: 'Illinois Wesleyan University', streetAddress: '1312 Park St', city: 'Bloomington', state: 'Illinois', zipcode: '61701', country: 'United States', type: 'Private', website: 'https://www.iwu.edu' }},
      { id: 'bradley', data: { name: 'Bradley University', streetAddress: '1501 W Bradley Ave', city: 'Peoria', state: 'Illinois', zipcode: '61625', country: 'United States', type: 'Private', website: 'https://www.bradley.edu' }},
      { id: 'siu-carbondale', data: { name: 'Southern Illinois University Carbondale', streetAddress: '1263 Lincoln Dr', city: 'Carbondale', state: 'Illinois', zipcode: '62901', country: 'United States', type: 'Public', website: 'https://siu.edu' }},
      { id: 'neiu', data: { name: 'Northeastern Illinois University', streetAddress: '5500 N St Louis Ave', city: 'Chicago', state: 'Illinois', zipcode: '60625', country: 'United States', type: 'Public', website: 'https://www.neiu.edu' }},
      { id: 'chicago-state', data: { name: 'Chicago State University', streetAddress: '9501 S King Dr', city: 'Chicago', state: 'Illinois', zipcode: '60628', country: 'United States', type: 'Public', website: 'https://www.csu.edu' }},
      { id: 'elmhurst', data: { name: 'Elmhurst University', streetAddress: '190 S Prospect Ave', city: 'Elmhurst', state: 'Illinois', zipcode: '60126', country: 'United States', type: 'Private', website: 'https://www.elmhurst.edu' }},
      { id: 'millikin', data: { name: 'Millikin University', streetAddress: '1184 W Main St', city: 'Decatur', state: 'Illinois', zipcode: '62522', country: 'United States', type: 'Private', website: 'https://www.millikin.edu' }},
      { id: 'wiu', data: { name: 'Western Illinois University', streetAddress: '1 University Cir', city: 'Macomb', state: 'Illinois', zipcode: '61455', country: 'United States', type: 'Public', website: 'https://www.wiu.edu' }},
      { id: 'eiu', data: { name: 'Eastern Illinois University', streetAddress: '600 Lincoln Ave', city: 'Charleston', state: 'Illinois', zipcode: '61920', country: 'United States', type: 'Public', website: 'https://www.eiu.edu' }},
      { id: 'augustana', data: { name: 'Augustana College', streetAddress: '639 38th St', city: 'Rock Island', state: 'Illinois', zipcode: '61201', country: 'United States', type: 'Private', website: 'https://www.augustana.edu' }},
      { id: 'benedictine', data: { name: 'Benedictine University', streetAddress: '5700 College Rd', city: 'Lisle', state: 'Illinois', zipcode: '60532', country: 'United States', type: 'Private', website: 'https://www.ben.edu' }},
      { id: 'rockford', data: { name: 'Rockford University', streetAddress: '5050 E State St', city: 'Rockford', state: 'Illinois', zipcode: '61108', country: 'United States', type: 'Private', website: 'https://www.rockford.edu' }}
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

  /**
   * Get all universities from Firestore
   */
  async getAllUniversities(): Promise<Array<University & { id: string }>> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'universities'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<University & { id: string }>;
    } catch (error) {
      console.error('Error getting universities:', error);
      throw error;
    }
  }

  /**
   * Add a new university to Firestore
   */
  async addUniversity(id: string, data: University): Promise<void> {
    try {
      const docRef = doc(this.db, 'universities', id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding university:', error);
      throw error;
    }
  }

  /**
   * Delete a university from Firestore
   */
  async deleteUniversity(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, 'universities', id));
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }
}
