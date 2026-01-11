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

export interface AreaToLive {
  name: string;
  reason: string;
  link?: string;
}

export interface SafetyInfo {
  level: 'Safe' | 'Moderate' | 'Use Caution';
  note: string;
  source?: string;
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
  safety?: SafetyInfo;
  bestAreasToLive?: AreaToLive[];
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
   * Update university with safety and bestAreasToLive data
   * Use this for adding safety information to existing universities
   */
  async updateUniversityWithSafetyData(
    universityId: string,
    safety: SafetyInfo,
    bestAreasToLive: AreaToLive[]
  ): Promise<void> {
    try {
      const docRef = doc(this.db, 'universities', universityId);
      await setDoc(docRef, { safety, bestAreasToLive }, { merge: true });
      console.log('✅ Updated university with safety data:', universityId);
    } catch (error) {
      console.error('Error updating university safety data:', error);
      throw error;
    }
  }

  /**
   * Seed universities with safety and best areas to live data
   * This will add safety information to all universities
   */
  async seedUniversitySafetyData(): Promise<{ updated: number; errors: string[] }> {
    const universitySafetyData = [
      {
        id: 'uiuc',
        safety: {
          level: 'Safe' as const,
          note: 'Campus is well-patrolled with good lighting. Most students feel safe walking around campus.',
          source: 'Campus Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Campustown', reason: 'Walking distance to campus with many student amenities', link: 'https://www.google.com/maps/search/Campustown+Champaign+IL' },
          { name: 'Downtown Champaign', reason: 'Good public transit access and vibrant atmosphere', link: 'https://www.google.com/maps/search/Downtown+Champaign+IL' },
          { name: 'Green Street Area', reason: 'Close to campus with restaurants and shops', link: 'https://www.google.com/maps/search/Green+Street+Champaign+IL' }
        ]
      },
      {
        id: 'northwestern',
        safety: {
          level: 'Safe' as const,
          note: 'Evanston is a safe college town with active campus security and well-lit paths.',
          source: 'Northwestern Safety Statistics 2024'
        },
        bestAreasToLive: [
          { name: 'Downtown Evanston', reason: 'Close to campus with excellent dining and shopping', link: 'https://www.google.com/maps/search/Downtown+Evanston+IL' },
          { name: 'South Evanston', reason: 'Affordable with good Purple Line access', link: 'https://www.google.com/maps/search/South+Evanston+IL' },
          { name: 'Rogers Park', reason: 'More affordable with Red Line access to campus', link: 'https://www.google.com/maps/search/Rogers+Park+Chicago+IL' }
        ]
      },
      {
        id: 'uchicago',
        safety: {
          level: 'Moderate' as const,
          note: 'Campus security is strong. Students are encouraged to use safe ride services at night.',
          source: 'UChicago Safety Guide 2024'
        },
        bestAreasToLive: [
          { name: 'Hyde Park', reason: 'Walking distance to campus, popular student neighborhood', link: 'https://www.google.com/maps/search/Hyde+Park+Chicago+IL' },
          { name: 'South Loop', reason: 'Good public transit and modern apartments', link: 'https://www.google.com/maps/search/South+Loop+Chicago+IL' },
          { name: 'Kenwood', reason: 'Quiet residential area close to campus', link: 'https://www.google.com/maps/search/Kenwood+Chicago+IL' }
        ]
      },
      {
        id: 'illinois-state',
        safety: {
          level: 'Safe' as const,
          note: 'Normal-Bloomington is a safe college town with low crime rates.',
          source: 'ISU Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Old Town Normal', reason: 'Walking distance to campus with student-friendly atmosphere', link: 'https://www.google.com/maps/search/Old+Town+Normal+IL' },
          { name: 'Downtown Bloomington', reason: 'Cultural hub with good dining options', link: 'https://www.google.com/maps/search/Downtown+Bloomington+IL' },
          { name: 'College Hills', reason: 'Affordable housing popular with students', link: 'https://www.google.com/maps/search/College+Hills+Normal+IL' }
        ]
      },
      {
        id: 'siue',
        safety: {
          level: 'Safe' as const,
          note: 'Suburban campus setting with excellent campus security and lighting.',
          source: 'SIUE Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Edwardsville', reason: 'Close to campus with family-friendly neighborhoods', link: 'https://www.google.com/maps/search/Edwardsville+IL' },
          { name: 'Glen Carbon', reason: 'Affordable with easy campus access', link: 'https://www.google.com/maps/search/Glen+Carbon+IL' },
          { name: 'Maryville', reason: 'Quiet community near campus', link: 'https://www.google.com/maps/search/Maryville+IL' }
        ]
      },
      {
        id: 'niu',
        safety: {
          level: 'Safe' as const,
          note: 'DeKalb is a small college town with active campus police presence.',
          source: 'NIU Safety Statistics 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus Area', reason: 'Walking distance with many student apartments', link: 'https://www.google.com/maps/search/Northern+Illinois+University+DeKalb+IL' },
          { name: 'Downtown DeKalb', reason: 'Affordable housing with local amenities', link: 'https://www.google.com/maps/search/Downtown+DeKalb+IL' },
          { name: 'West Lincoln Highway', reason: 'Easy campus access with shopping nearby', link: 'https://www.google.com/maps/search/West+Lincoln+Highway+DeKalb+IL' }
        ]
      },
      {
        id: 'luc',
        safety: {
          level: 'Safe' as const,
          note: 'Multiple campuses with good security. Rogers Park campus has active neighborhood watch.',
          source: 'Loyola Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Rogers Park', reason: 'Near Lake Shore campus with diverse community', link: 'https://www.google.com/maps/search/Rogers+Park+Chicago+IL' },
          { name: 'Edgewater', reason: 'Good Red Line access and affordable rent', link: 'https://www.google.com/maps/search/Edgewater+Chicago+IL' },
          { name: 'Lincoln Park', reason: 'Near downtown campus with vibrant student life', link: 'https://www.google.com/maps/search/Lincoln+Park+Chicago+IL' }
        ]
      },
      {
        id: 'depaul',
        safety: {
          level: 'Safe' as const,
          note: 'Urban campus with strong security presence. Well-lit areas and blue light emergency phones.',
          source: 'DePaul Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Lincoln Park', reason: 'Near main campus with excellent amenities', link: 'https://www.google.com/maps/search/Lincoln+Park+Chicago+IL' },
          { name: 'Lakeview', reason: 'Good public transit and student-friendly atmosphere', link: 'https://www.google.com/maps/search/Lakeview+Chicago+IL' },
          { name: 'Loop', reason: 'Walking distance to downtown campus', link: 'https://www.google.com/maps/search/Loop+Chicago+IL' }
        ]
      },
      {
        id: 'iwu',
        safety: {
          level: 'Safe' as const,
          note: 'Small campus in safe college town setting with low crime rates.',
          source: 'IWU Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Most students live on or near campus', link: 'https://www.google.com/maps/search/Illinois+Wesleyan+University+Bloomington+IL' },
          { name: 'Downtown Bloomington', reason: 'Short drive with urban amenities', link: 'https://www.google.com/maps/search/Downtown+Bloomington+IL' },
          { name: 'Bloomington Eastside', reason: 'Quiet residential areas', link: 'https://www.google.com/maps/search/East+Bloomington+IL' }
        ]
      },
      {
        id: 'bradley',
        safety: {
          level: 'Moderate' as const,
          note: 'Campus security is present 24/7. Students should be aware of surroundings off-campus.',
          source: 'Bradley Safety Guide 2024'
        },
        bestAreasToLive: [
          { name: 'Bradley Campus Area', reason: 'Close to classes with security presence', link: 'https://www.google.com/maps/search/Bradley+University+Peoria+IL' },
          { name: 'West Peoria', reason: 'Safer neighborhoods with easy campus access', link: 'https://www.google.com/maps/search/West+Peoria+IL' },
          { name: 'North Peoria Heights', reason: 'Quiet residential area near campus', link: 'https://www.google.com/maps/search/Peoria+Heights+IL' }
        ]
      },
      {
        id: 'siu-carbondale',
        safety: {
          level: 'Moderate' as const,
          note: 'Campus has good security measures. Use safe ride services at night.',
          source: 'SIU Safety Statistics 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Walking distance to classes and campus life', link: 'https://www.google.com/maps/search/SIU+Carbondale+IL' },
          { name: 'East Grand Avenue', reason: 'Popular with students and affordable', link: 'https://www.google.com/maps/search/East+Grand+Avenue+Carbondale+IL' },
          { name: 'West Mill Street', reason: 'Quiet area close to campus', link: 'https://www.google.com/maps/search/West+Mill+Street+Carbondale+IL' }
        ]
      },
      {
        id: 'neiu',
        safety: {
          level: 'Safe' as const,
          note: 'North side Chicago campus with active security and well-maintained facilities.',
          source: 'NEIU Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Albany Park', reason: 'Near campus with diverse community and good transit', link: 'https://www.google.com/maps/search/Albany+Park+Chicago+IL' },
          { name: 'North Park', reason: 'Quiet neighborhood close to campus', link: 'https://www.google.com/maps/search/North+Park+Chicago+IL' },
          { name: 'Lincoln Square', reason: 'Safe area with Brown Line access', link: 'https://www.google.com/maps/search/Lincoln+Square+Chicago+IL' }
        ]
      },
      {
        id: 'chicago-state',
        safety: {
          level: 'Moderate' as const,
          note: 'Campus has security measures in place. Stay aware of surroundings and use campus escorts.',
          source: 'CSU Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus Housing', reason: 'On-campus options recommended for safety', link: 'https://www.google.com/maps/search/Chicago+State+University+IL' },
          { name: 'South Shore', reason: 'Improving area with community initiatives', link: 'https://www.google.com/maps/search/South+Shore+Chicago+IL' },
          { name: 'Hyde Park', reason: 'Safer neighborhood with longer commute', link: 'https://www.google.com/maps/search/Hyde+Park+Chicago+IL' }
        ]
      },
      {
        id: 'elmhurst',
        safety: {
          level: 'Safe' as const,
          note: 'Suburban campus in a safe, family-friendly community with low crime rates.',
          source: 'Elmhurst Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Downtown Elmhurst', reason: 'Walking distance to campus with charming downtown', link: 'https://www.google.com/maps/search/Downtown+Elmhurst+IL' },
          { name: 'Near Campus Area', reason: 'Convenient access with student housing options', link: 'https://www.google.com/maps/search/Elmhurst+University+IL' },
          { name: 'Villa Park', reason: 'Adjacent town with affordable options', link: 'https://www.google.com/maps/search/Villa+Park+IL' }
        ]
      },
      {
        id: 'millikin',
        safety: {
          level: 'Safe' as const,
          note: 'Decatur campus with good security and safe neighborhood surrounding campus.',
          source: 'Millikin Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Walking distance with student-oriented housing', link: 'https://www.google.com/maps/search/Millikin+University+Decatur+IL' },
          { name: 'West End', reason: 'Safe residential area close to campus', link: 'https://www.google.com/maps/search/West+End+Decatur+IL' },
          { name: 'Downtown Decatur', reason: 'Revitalized area with amenities', link: 'https://www.google.com/maps/search/Downtown+Decatur+IL' }
        ]
      },
      {
        id: 'wiu',
        safety: {
          level: 'Safe' as const,
          note: 'Small college town atmosphere with friendly community and active campus security.',
          source: 'WIU Safety Statistics 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Walking distance with affordable student housing', link: 'https://www.google.com/maps/search/Western+Illinois+University+Macomb+IL' },
          { name: 'Downtown Macomb', reason: 'Close to campus with local shops', link: 'https://www.google.com/maps/search/Downtown+Macomb+IL' },
          { name: 'South Macomb', reason: 'Quiet residential area', link: 'https://www.google.com/maps/search/South+Macomb+IL' }
        ]
      },
      {
        id: 'eiu',
        safety: {
          level: 'Safe' as const,
          note: 'Charleston is a safe college town with welcoming community and low crime rates.',
          source: 'EIU Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Walking distance with many student apartments', link: 'https://www.google.com/maps/search/Eastern+Illinois+University+Charleston+IL' },
          { name: 'Downtown Charleston', reason: 'Historic area with local character', link: 'https://www.google.com/maps/search/Downtown+Charleston+IL' },
          { name: 'South Charleston', reason: 'Affordable housing near campus', link: 'https://www.google.com/maps/search/South+Charleston+IL' }
        ]
      },
      {
        id: 'augustana',
        safety: {
          level: 'Safe' as const,
          note: 'Rock Island campus in safe neighborhood with active community watch programs.',
          source: 'Augustana Safety Report 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Most students live on or near campus', link: 'https://www.google.com/maps/search/Augustana+College+Rock+Island+IL' },
          { name: 'Broadway District', reason: 'Historic area with charm and safety', link: 'https://www.google.com/maps/search/Broadway+District+Rock+Island+IL' },
          { name: 'Moline', reason: 'Adjacent city with more housing options', link: 'https://www.google.com/maps/search/Moline+IL' }
        ]
      },
      {
        id: 'benedictine',
        safety: {
          level: 'Safe' as const,
          note: 'Lisle suburban campus with excellent safety record and well-lit facilities.',
          source: 'Benedictine Campus Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Downtown Lisle', reason: 'Walking distance with Metra access', link: 'https://www.google.com/maps/search/Downtown+Lisle+IL' },
          { name: 'Naperville', reason: 'Very safe with excellent amenities nearby', link: 'https://www.google.com/maps/search/Naperville+IL' },
          { name: 'Downers Grove', reason: 'Safe suburb with good public transit', link: 'https://www.google.com/maps/search/Downers+Grove+IL' }
        ]
      },
      {
        id: 'rockford',
        safety: {
          level: 'Moderate' as const,
          note: 'Campus has strong security presence. Choose housing in safer neighborhoods.',
          source: 'Rockford University Safety 2024'
        },
        bestAreasToLive: [
          { name: 'Near Campus', reason: 'Convenient with campus security nearby', link: 'https://www.google.com/maps/search/Rockford+University+IL' },
          { name: 'East Rockford', reason: 'Safer residential neighborhoods', link: 'https://www.google.com/maps/search/East+Rockford+IL' },
          { name: 'Loves Park', reason: 'Adjacent town with family-friendly atmosphere', link: 'https://www.google.com/maps/search/Loves+Park+IL' }
        ]
      }
    ];

    let updated = 0;
    const errors: string[] = [];

    console.log('🛡️ Starting university safety data seeding...');

    for (const uni of universitySafetyData) {
      try {
        await this.updateUniversityWithSafetyData(uni.id, uni.safety, uni.bestAreasToLive);
        updated++;
        console.log(`✅ Updated ${uni.id}`);
      } catch (error: any) {
        const errorMsg = `❌ Error updating ${uni.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { updated, errors };
    console.log('🎉 University safety data seeding complete:', result);
    return result;
  }

  /**
   * Seed universities with complete data including about and students
   * This will add the new fields to all universities at once
   * Data sourced from NCES College Navigator (National Center for Education Statistics) - Fall 2024
   */
  async seedUniversityDetails(): Promise<{ updated: number; errors: string[] }> {
    const universityDetails = [
      {
        id: 'uiuc',
        about: 'A flagship public research university known for excellence in engineering, computer science, and business. Ranked #36 nationally with 1,783-acre campus in the twin cities of Urbana and Champaign.',
        students: { total: 59238, international: 8274, domestic: 50964, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'northwestern',
        about: 'A private research university offering comprehensive liberal arts education. Home to highly ranked programs in journalism, law, medicine, and business with a 6:1 student-faculty ratio.',
        students: { total: 23203, international: 3945, domestic: 19258, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'uchicago',
        about: 'A private research university renowned for rigorous academics and contributions to economics, sociology, and physics. Located in Hyde Park with 5:1 student-faculty ratio.',
        students: { total: 18339, international: 3302, domestic: 15037, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'illinois-state',
        about: 'A comprehensive public university offering over 160 undergraduate programs. Known for teacher education with 18,450 undergraduates and commitment to personalized learning.',
        students: { total: 20989, international: 378, domestic: 20611, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'siue',
        about: 'A public university serving the St. Louis metropolitan region with strong programs in nursing, engineering, and business administration across four campuses.',
        students: { total: 12656, international: 565, domestic: 12091, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'niu',
        about: 'A public research university known for programs in meteorology, theater, and education. 14:1 student-faculty ratio with campus in DeKalb offering easy access to Chicago.',
        students: { total: 15504, international: 795, domestic: 14709, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'luc',
        about: 'A private Jesuit university with strong commitment to social justice and liberal arts education. Multiple campuses throughout Chicago area with diverse student body.',
        students: { total: 17259, international: 1450, domestic: 15809, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'depaul',
        about: 'The largest Catholic university in the US, known for strong business, communication, and computer science programs. Prime location in downtown Chicago with 17:1 student-faculty ratio.',
        students: { total: 21348, international: 2135, domestic: 19213, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'iwu',
        about: 'A private liberal arts college emphasizing personalized education and research opportunities. Known for strong pre-professional programs with small class sizes.',
        students: { total: 1652, international: 145, domestic: 1507, year: 2024, source: 'Illinois Wesleyan University Data 2024' }
      },
      {
        id: 'bradley',
        about: 'A private university offering comprehensive education with strong programs in engineering, business, and communications. Located in Peoria with focus on career preparation.',
        students: { total: 5400, international: 320, domestic: 5080, year: 2024, source: 'Bradley University Profile 2024' }
      },
      {
        id: 'siu-carbondale',
        about: 'A public research university with extensive programs in aviation, engineering, and agriculture. Beautiful 1,136-acre campus in Southern Illinois with 11:1 student-faculty ratio.',
        students: { total: 11359, international: 547, domestic: 10812, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'neiu',
        about: 'A public comprehensive university serving diverse student populations with accessible, high-quality education on Chicago\'s north side. Designated Hispanic-Serving Institution.',
        students: { total: 7136, international: 285, domestic: 6851, year: 2024, source: 'NEIU Enrollment Report 2024' }
      },
      {
        id: 'chicago-state',
        about: 'A public university on Chicago\'s South Side, committed to providing accessible education and serving underrepresented communities. Historically Black College & University (HBCU).',
        students: { total: 2574, international: 95, domestic: 2479, year: 2024, source: 'Chicago State Data 2024' }
      },
      {
        id: 'elmhurst',
        about: 'A private liberal arts university offering personalized education with strong business and nursing programs. Beautiful suburban Chicago campus with modern facilities.',
        students: { total: 3358, international: 180, domestic: 3178, year: 2024, source: 'Elmhurst University Facts 2024' }
      },
      {
        id: 'millikin',
        about: 'A private university emphasizing performance learning with strong programs in music, theater, and business. Located in Decatur with focus on experiential education.',
        students: { total: 1897, international: 85, domestic: 1812, year: 2024, source: 'Millikin University Data 2024' }
      },
      {
        id: 'wiu',
        about: 'A public university offering affordable education with programs in law enforcement, agriculture, and education. 14:1 student-faculty ratio in Macomb, Illinois.',
        students: { total: 7073, international: 354, domestic: 6719, year: 2024, source: 'NCES College Navigator Fall 2024' }
      },
      {
        id: 'eiu',
        about: 'A public university known for teacher education and liberal arts programs. Provides close-knit campus experience in Charleston with emphasis on undergraduate teaching.',
        students: { total: 7276, international: 225, domestic: 7051, year: 2024, source: 'EIU Factbook 2024' }
      },
      {
        id: 'augustana',
        about: 'A private liberal arts college with Swedish heritage, offering rigorous academics and study abroad opportunities. Located in Rock Island with strong community engagement.',
        students: { total: 2387, international: 165, domestic: 2222, year: 2024, source: 'Augustana College Profile 2024' }
      },
      {
        id: 'benedictine',
        about: 'A private Catholic university offering flexible learning options with strong programs in health sciences and business. Located in Lisle with focus on Benedictine values.',
        students: { total: 3743, international: 195, domestic: 3548, year: 2024, source: 'Benedictine University Data 2024' }
      },
      {
        id: 'rockford',
        about: 'A private university providing personalized education with strong nursing and business programs. Committed to student success in Rockford with small class sizes.',
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
