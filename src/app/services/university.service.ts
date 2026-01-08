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

export interface StudentData {
  total: number;
  international: number;
  domestic: number;
  year: number;
  source: string;
}

export interface University {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  type: 'Public' | 'Private';
  website: string;
  about?: string;
  students?: StudentData;
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
   * Get a single university by ID from Firestore
   */
  async getUniversityById(id: string): Promise<(University & { id: string }) | null> {
    try {
      const docRef = doc(this.db, 'universities', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as University & { id: string };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting university:', error);
      throw error;
    }
  }

  /**
   * Update university with about and student data
   * Use this for adding the new fields to existing universities
   */
  async updateUniversityWithStudentData(
    universityId: string, 
    about: string, 
    students: StudentData
  ): Promise<void> {
    try {
      const docRef = doc(this.db, 'universities', universityId);
      await setDoc(docRef, { about, students }, { merge: true });
      console.log('✅ Updated university with student data:', universityId);
    } catch (error) {
      console.error('Error updating university:', error);
      throw error;
    }
  }

  /**
   * Seed universities with complete data including about and students
   * This will add the new fields to all universities at once
   */
  async seedUniversityDetails(): Promise<{ updated: number; errors: string[] }> {
    const universityDetails = [
      {
        id: 'uiuc',
        about: 'A flagship public research university known for excellence in engineering, computer science, and business. Located in the twin cities of Urbana and Champaign.',
        students: { total: 52679, international: 12746, domestic: 39933, year: 2024, source: 'UIUC Enrollment Report 2024' }
      },
      {
        id: 'northwestern',
        about: 'A private research university offering comprehensive liberal arts education. Home to highly ranked programs in journalism, law, medicine, and business.',
        students: { total: 22603, international: 4200, domestic: 18403, year: 2024, source: 'Northwestern Common Data Set 2024' }
      },
      {
        id: 'uchicago',
        about: 'A private research university renowned for rigorous academics and contributions to economics, sociology, and physics. Located in Hyde Park, Chicago.',
        students: { total: 18452, international: 3850, domestic: 14602, year: 2024, source: 'UChicago Factbook 2024' }
      },
      {
        id: 'illinois-state',
        about: 'A comprehensive public university offering over 160 undergraduate programs. Known for teacher education and commitment to personalized learning.',
        students: { total: 20163, international: 380, domestic: 19783, year: 2024, source: 'Illinois State University Data' }
      },
      {
        id: 'siue',
        about: 'A public university serving the St. Louis metropolitan region with strong programs in nursing, engineering, and business administration.',
        students: { total: 12656, international: 565, domestic: 12091, year: 2024, source: 'SIUE Factbook 2024' }
      },
      {
        id: 'niu',
        about: 'A public research university known for programs in meteorology, theater, and education. Located in DeKalb with easy access to Chicago.',
        students: { total: 16658, international: 850, domestic: 15808, year: 2024, source: 'NIU Data Summary 2024' }
      },
      {
        id: 'luc',
        about: 'A private Jesuit university with a strong commitment to social justice and liberal arts education. Multiple campuses throughout Chicago area.',
        students: { total: 17259, international: 1450, domestic: 15809, year: 2024, source: 'Loyola University CDS 2024' }
      },
      {
        id: 'depaul',
        about: 'The largest Catholic university in the US, known for strong business, communication, and computer science programs. Located in downtown Chicago.',
        students: { total: 21234, international: 2100, domestic: 19134, year: 2024, source: 'DePaul University Facts 2024' }
      },
      {
        id: 'iwu',
        about: 'A private liberal arts college emphasizing personalized education and research opportunities. Known for strong pre-professional programs.',
        students: { total: 1652, international: 145, domestic: 1507, year: 2024, source: 'IWU Institutional Data 2024' }
      },
      {
        id: 'bradley',
        about: 'A private university offering a comprehensive education with strong programs in engineering, business, and communications. Located in Peoria.',
        students: { total: 5400, international: 320, domestic: 5080, year: 2024, source: 'Bradley University Profile 2024' }
      },
      {
        id: 'siu-carbondale',
        about: 'A public research university with extensive programs in aviation, engineering, and agriculture. Beautiful campus in Southern Illinois.',
        students: { total: 11403, international: 550, domestic: 10853, year: 2024, source: 'SIU Carbondale Data 2024' }
      },
      {
        id: 'neiu',
        about: 'A public comprehensive university serving diverse student populations with accessible, high-quality education on Chicago\'s north side.',
        students: { total: 7136, international: 285, domestic: 6851, year: 2024, source: 'NEIU Enrollment Report 2024' }
      },
      {
        id: 'chicago-state',
        about: 'A public university on Chicago\'s South Side, committed to providing accessible education and serving underrepresented communities.',
        students: { total: 2574, international: 95, domestic: 2479, year: 2024, source: 'Chicago State Data 2024' }
      },
      {
        id: 'elmhurst',
        about: 'A private liberal arts university offering personalized education with strong business and nursing programs. Located in suburban Chicago.',
        students: { total: 3358, international: 180, domestic: 3178, year: 2024, source: 'Elmhurst University Facts 2024' }
      },
      {
        id: 'millikin',
        about: 'A private university emphasizing performance learning with strong programs in music, theater, and business. Located in Decatur, Illinois.',
        students: { total: 1897, international: 85, domestic: 1812, year: 2024, source: 'Millikin University Data 2024' }
      },
      {
        id: 'wiu',
        about: 'A public university offering affordable education with programs in law enforcement, agriculture, and education. Located in Macomb, Illinois.',
        students: { total: 7917, international: 340, domestic: 7577, year: 2024, source: 'WIU Enrollment Data 2024' }
      },
      {
        id: 'eiu',
        about: 'A public university known for teacher education and liberal arts programs. Provides a close-knit campus experience in Charleston, Illinois.',
        students: { total: 7276, international: 225, domestic: 7051, year: 2024, source: 'EIU Factbook 2024' }
      },
      {
        id: 'augustana',
        about: 'A private liberal arts college with Swedish heritage, offering rigorous academics and study abroad opportunities. Located in Rock Island.',
        students: { total: 2387, international: 165, domestic: 2222, year: 2024, source: 'Augustana College Profile 2024' }
      },
      {
        id: 'benedictine',
        about: 'A private Catholic university offering flexible learning options with strong programs in health sciences and business. Located in Lisle.',
        students: { total: 3743, international: 195, domestic: 3548, year: 2024, source: 'Benedictine University Data 2024' }
      },
      {
        id: 'rockford',
        about: 'A private university providing personalized education with strong nursing and business programs. Committed to student success in Rockford.',
        students: { total: 1156, international: 45, domestic: 1111, year: 2024, source: 'Rockford University Profile 2024' }
      }
    ];

    let updated = 0;
    const errors: string[] = [];

    console.log('🎓 Starting university details seeding...');

    for (const uni of universityDetails) {
      try {
        await this.updateUniversityWithStudentData(uni.id, uni.about, uni.students);
        updated++;
        console.log(`✅ Updated ${uni.id}`);
      } catch (error: any) {
        const errorMsg = `❌ Error updating ${uni.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { updated, errors };
    console.log('🎉 University details seeding complete:', result);
    return result;
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
