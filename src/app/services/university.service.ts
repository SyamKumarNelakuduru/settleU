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
  internationalCountryBreakdown?: { [country: string]: number }; // Country name -> student count
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

export interface AccommodationGroup {
  name: string;
  platform: 'Facebook' | 'Discord' | 'Telegram' | 'WhatsApp' | 'Website';
  url: string;
  note: string;
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
  accommodationGroups?: AccommodationGroup[];
  accommodationTips?: string[];
  createdAt?: any;
  
}

export interface UniversityDetail {
  name: string; // University name; example "Harvard University"
  description: string; // Brief description of the university; example "Harvard University is a prestigious Ivy League institution located in Cambridge, Massachusetts."
  location: string; // Location of the university; example "Cambridge, Massachusetts, USA"
  established: number; // Year the university was established; example 1636
  notablePrograms: string[]; // List of notable academic programs; example ["Law", "Medicine", "Business"]
  website: string; // Official website URL; example "https://www.harvard.edu"
  address: Address; // Address object containing street, city, state, country, and zip code
  student_population: StudentPopulation; // Student population details
}

export interface Address {
  street: string; // Street address; example "Massachusetts Hall, Cambridge, MA 02138"
  city: string; // City; example "Cambridge"
  state: string; // State or province; example "Massachusetts"
  country: string; // Country; example "USA"
  zipCode: string; // Postal code; example "02138"
}

export interface StudentPopulation {
  total_students: number; // Total number of students; example 20000
  undergraduate_students: number; // Number of undergraduate students; example 15000
  graduate_students: number; // Number of graduate students; example 5000
  international_students: InternationStudents; // International student details
  domestic_students: number; // Number of domestic students; example 16000
}

export interface InternationStudents {
  total_international_students: number; // Total number of international students; example 4000
  countries_represented: number; // Number of countries represented; example 100
  top_countries: string[]; // List of top countries by student count; example ["China", "India", "South Korea"]
  countires_percentage_population: { [country: string]: number }; // Percentage of total student population by country; example { "China": 10, "India": 8, "South Korea": 5 }
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
   * Update university with accommodation groups and tips
   * Use this for adding accommodation information to existing universities
   */
  async updateUniversityWithAccommodationData(
    universityId: string,
    accommodationGroups: AccommodationGroup[],
    accommodationTips: string[]
  ): Promise<void> {
    try {
      const docRef = doc(this.db, 'universities', universityId);
      await setDoc(docRef, { accommodationGroups, accommodationTips }, { merge: true });
      console.log('✅ Updated university with accommodation data:', universityId);
    } catch (error) {
      console.error('Error updating university accommodation data:', error);
      throw error;
    }
  }

  /**
   * Seed universities with accommodation groups and tips
   * This will add accommodation information to all universities
   */
  async seedUniversityAccommodationData(): Promise<{ updated: number; errors: string[] }> {
    const universityAccommodationData = [
      {
        id: 'uiuc',
        accommodationGroups: [
          { name: 'UIUC Housing, Sublets & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/uiuchousing', note: 'Most active housing group with 20K+ members' },
          { name: 'UIUC Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/illinihousing', note: 'Official university-monitored group' },
          { name: 'UIUC Sublets & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/uiucsublets', note: 'Best for short-term and semester sublets' },
          { name: 'r/UIUC Housing Thread', platform: 'Website' as const, url: 'https://www.reddit.com/r/UIUC/', note: 'Reddit community with housing megathreads' }
        ],
        accommodationTips: [
          'Start your housing search 3-4 months before your move-in date',
          'Green Street apartments are closest to campus but can be noisy',
          'West side apartments (Prospect Ave area) offer better value and quieter environment',
          'Most leases run August-August, sign early (Dec-Feb) for best options',
          'Budget $600-900/month for shared apartments, $900-1400 for studios',
          'Check Smile Student Living, JSM, and CPM for reputable property managers',
          'Avoid signing without seeing the property or reading reviews online',
          'University Housing also offers apartments for grad students and families'
        ]
      },
      {
        id: 'northwestern',
        accommodationGroups: [
          { name: 'Northwestern Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/northwesternhousing', note: 'Primary housing group for NU students' },
          { name: 'Northwestern Off-Campus Life', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/NUoffcampus', note: 'Official university resources and listings' },
          { name: 'Evanston Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/evanstonhousing', note: 'Broader Evanston community group' },
          { name: 'NU Housing Resources', platform: 'Website' as const, url: 'https://www.northwestern.edu/residential-services/', note: 'Official university housing portal' }
        ],
        accommodationTips: [
          'Downtown Evanston is walkable but expensive ($1200-2000/month)',
          'South Evanston offers better value with Purple Line access',
          'Rogers Park in Chicago is more affordable option with Red Line',
          'Most students live in Evanston for first 1-2 years',
          'Start searching in January-February for September move-in',
          'Check PPM, First Evanston, and Evanston Place for reliable landlords',
          'Utilities often not included in rent - budget extra $100-150/month',
          'Consider proximity to Purple Line for easy campus access'
        ]
      },
      {
        id: 'uchicago',
        accommodationGroups: [
          { name: 'UChicago Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/uchicagohousing', note: 'Main housing group for students' },
          { name: 'UChicago Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/uchicagooffcampus', note: 'University-affiliated listings' },
          { name: 'Hyde Park Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/hydeparkhousing', note: 'Neighborhood-wide listings' },
          { name: 'Mac Properties Housing Portal', platform: 'Website' as const, url: 'https://www.macapartments.com/', note: 'Major landlord in Hyde Park area' }
        ],
        accommodationTips: [
          'Hyde Park is the safest and most convenient neighborhood',
          'Rent ranges $800-1200 for shared, $1200-1800 for studios',
          'Mac Properties owns many buildings - reliable but corporate',
          'Start searching 2-3 months before move-in date',
          'Check university housing office for verified off-campus listings',
          'Avoid areas south of 61st Street for safety reasons',
          'Use university shuttle services in evenings',
          'Many students live in university-owned graduate housing'
        ]
      },
      {
        id: 'illinois-state',
        accommodationGroups: [
          { name: 'ISU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/isuhousing', note: 'Primary student housing group' },
          { name: 'Normal-Bloomington Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/bnhousing', note: 'Local community housing listings' },
          { name: 'ISU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/isuoffcampus', note: 'University-monitored group' },
          { name: 'ISU Housing Portal', platform: 'Website' as const, url: 'https://housing.illinoisstate.edu/', note: 'Official university housing resources' }
        ],
        accommodationTips: [
          'Old Town Normal is most popular for walkability to campus',
          'Rent typically $400-700/month for shared apartments',
          'Most leases are August-August, start searching by March',
          'Check Landmark, Camelot, and Town & Country for student housing',
          'College Hills area offers affordable options slightly farther from campus',
          'Many students use Connect Transit (free with ID) for commuting',
          'Avoid signing leases without visiting - scams do occur',
          'Budget for utilities separately ($50-100/month per person)'
        ]
      },
      {
        id: 'siue',
        accommodationGroups: [
          { name: 'SIUE Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/siuehousing', note: 'Main student housing community' },
          { name: 'SIUE Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/siueoffcampus', note: 'University-affiliated listings' },
          { name: 'Edwardsville/Glen Carbon Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/edwardsvillehousing', note: 'Local area housing group' },
          { name: 'SIUE Housing Portal', platform: 'Website' as const, url: 'https://www.siue.edu/housing/', note: 'Official housing resources' }
        ],
        accommodationTips: [
          'Consider on-campus apartments - competitive pricing and convenient',
          'Edwardsville and Glen Carbon are primary off-campus areas',
          'Rent ranges $500-800/month for shared housing',
          'Suburban setting means car is highly recommended',
          'Most affordable housing in Illinois compared to other universities',
          'Start looking 2 months before semester for best availability',
          'Check The District, Cougar Village, and Woodland Hall options',
          'Many students commute from surrounding towns (Maryville, Troy)'
        ]
      },
      {
        id: 'niu',
        accommodationGroups: [
          { name: 'NIU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/niuhousing', note: 'Primary housing group for students' },
          { name: 'NIU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/niuoffcampus', note: 'University housing resources' },
          { name: 'DeKalb Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/dekalbhousing', note: 'Community-wide listings' },
          { name: 'NIU Housing Portal', platform: 'Website' as const, url: 'https://www.niu.edu/housing/', note: 'Official university housing site' }
        ],
        accommodationTips: [
          'DeKalb is small college town - housing is affordable ($400-700/month)',
          'West Lincoln Highway area has many student apartment complexes',
          'Start searching by February-March for August move-in',
          'Check Campus Pointe, The Venue, and Greek Row properties',
          'Most apartments within walking/biking distance to campus',
          'Winters are harsh - ensure good heating and insulation',
          'Many landlords cater specifically to students with flexible terms',
          'Consider university housing for first year for easier transition'
        ]
      },
      {
        id: 'luc',
        accommodationGroups: [
          { name: 'Loyola Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/loyolahousing', note: 'Main housing group for LUC students' },
          { name: 'Loyola Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/loyolaoffcampus', note: 'Official university resources' },
          { name: 'Rogers Park Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/rogersparkhousing', note: 'Lake Shore campus area' },
          { name: 'Lincoln Park Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/lincolnparkhousing', note: 'Downtown campus area' }
        ],
        accommodationTips: [
          'Rogers Park (Lake Shore campus) is more affordable than Lincoln Park',
          'Expect $700-1000/month for shared apartments in Rogers Park',
          'Lincoln Park area costs $1000-1500/month for shared housing',
          'Red Line provides easy access between both campuses',
          'Start searching 2-3 months before move-in date',
          'Check Kiser Group and Habitat properties near campus',
          'Edgewater is a good middle-ground option for affordability',
          'Many students live along the Red Line corridor for accessibility'
        ]
      },
      {
        id: 'depaul',
        accommodationGroups: [
          { name: 'DePaul Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/depaulhousing', note: 'Largest housing group for DPU students' },
          { name: 'DePaul Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/depauloffcampus', note: 'Official university listings' },
          { name: 'Lincoln Park Apartments', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/lincolnparkapts', note: 'Main campus neighborhood' },
          { name: 'DePaul Loop Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/depaulloop', note: 'Downtown campus area' }
        ],
        accommodationTips: [
          'Lincoln Park is prime location but expensive ($900-1400/month)',
          'Lakeview offers good value with excellent public transit',
          'Loop/South Loop good for downtown campus students',
          'Start searching in January-February for best selection',
          'Check PPM, Planned Property Management, and First Choice properties',
          'Most leases are June 1 or September 1 in Chicago',
          'Budget for utilities (often not included) - $100-150/month',
          'Use CTA Red, Brown, or Purple lines for campus access'
        ]
      },
      {
        id: 'iwu',
        accommodationGroups: [
          { name: 'IWU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/iwuhousing', note: 'Student housing community' },
          { name: 'IWU Off-Campus Life', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/iwuoffcampus', note: 'University-affiliated resources' },
          { name: 'Bloomington-Normal Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/bnhousing', note: 'Local area listings' },
          { name: 'IWU Student Life', platform: 'Website' as const, url: 'https://www.iwu.edu/student-life/', note: 'Official university resources' }
        ],
        accommodationTips: [
          'Most students live on campus for all four years',
          'Limited off-campus housing due to small student body',
          'Rent is affordable ($500-800/month) for off-campus options',
          'Downtown Bloomington offers more diverse housing options',
          'Start searching early if seeking off-campus housing',
          'University housing offers strong sense of community',
          'Transportation needed for off-campus living in most cases',
          'Check with student life office for verified off-campus listings'
        ]
      },
      {
        id: 'bradley',
        accommodationGroups: [
          { name: 'Bradley Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/bradleyhousing', note: 'Main student housing group' },
          { name: 'Bradley Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/bradleyoffcampus', note: 'University resources' },
          { name: 'Peoria Area Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/peoriahousing', note: 'Broader community listings' },
          { name: 'Bradley Housing Portal', platform: 'Website' as const, url: 'https://www.bradley.edu/campus-life/housing/', note: 'Official university site' }
        ],
        accommodationTips: [
          'Bradley campus area offers safest and most convenient housing',
          'Rent typically $500-800/month for shared apartments',
          'West Peoria neighborhoods are safer than downtown',
          'Start searching 2-3 months before move-in',
          'Many students live in university-owned properties first year',
          'Check Bradley Housing office for approved landlord list',
          'Car recommended for off-campus living in Peoria',
          'Be selective about neighborhoods - crime varies significantly'
        ]
      },
      {
        id: 'siu-carbondale',
        accommodationGroups: [
          { name: 'SIU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/siuhousing', note: 'Primary student housing group' },
          { name: 'SIU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/siuoffcampus', note: 'University-affiliated listings' },
          { name: 'Carbondale Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/carbondalehousing', note: 'Community-wide group' },
          { name: 'SIU Housing Portal', platform: 'Website' as const, url: 'https://housing.siu.edu/', note: 'Official university resources' }
        ],
        accommodationTips: [
          'Very affordable housing - $400-700/month for shared apartments',
          'East Grand Avenue area is popular with students',
          'Most housing within walking/biking distance to campus',
          'Start searching 1-2 months before semester starts',
          'Check Saluki Row, Campus Pointe, and local landlords',
          'Many houses available for rent in addition to apartments',
          'Consider roommate situations for best value',
          'University housing available for upperclassmen and grad students'
        ]
      },
      {
        id: 'neiu',
        accommodationGroups: [
          { name: 'NEIU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/neiuhousing', note: 'Student housing community' },
          { name: 'NEIU Commuter Students', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/neiucommuters', note: 'Resources for commuting students' },
          { name: 'Albany Park Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/albanyparkhousing', note: 'Near-campus neighborhood' },
          { name: 'NEIU Student Resources', platform: 'Website' as const, url: 'https://www.neiu.edu/student-life', note: 'Official university resources' }
        ],
        accommodationTips: [
          'NEIU is primarily commuter school - limited housing culture',
          'Albany Park and North Park offer closest neighborhoods',
          'Rent ranges $700-1100/month for shared Chicago apartments',
          'Brown Line provides good access to campus',
          'Many students live at home or throughout Chicago area',
          'No university-owned housing available',
          'Consider proximity to Brown Line stations for commuting',
          'Check Chicago Apartment Finders for area listings'
        ]
      },
      {
        id: 'chicago-state',
        accommodationGroups: [
          { name: 'CSU Students Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/csuhousing', note: 'Student housing group' },
          { name: 'CSU Commuters & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/csucommuters', note: 'Commuter resources' },
          { name: 'South Side Chicago Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/southsidehousing', note: 'Area housing listings' },
          { name: 'CSU Housing Office', platform: 'Website' as const, url: 'https://www.csu.edu/studenthousing/', note: 'University housing resources' }
        ],
        accommodationTips: [
          'Primarily commuter school - many students live at home',
          'On-campus housing available and recommended for safety',
          'South Shore and Chatham are nearby residential areas',
          'Research neighborhoods carefully for safety',
          'Public transit access varies - plan commute carefully',
          'Consider university housing for convenience and security',
          'Many students carpool or drive to campus',
          'Contact housing office for approved off-campus options'
        ]
      },
      {
        id: 'elmhurst',
        accommodationGroups: [
          { name: 'Elmhurst Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/elmhursthousing', note: 'Student housing community' },
          { name: 'Elmhurst University Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/euhhousing', note: 'University-specific group' },
          { name: 'Elmhurst/Villa Park Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/elmhurstvillapark', note: 'Local area listings' },
          { name: 'EU Housing Portal', platform: 'Website' as const, url: 'https://www.elmhurst.edu/campus-life/housing/', note: 'Official university resources' }
        ],
        accommodationTips: [
          'Most students live on campus in residence halls',
          'Downtown Elmhurst offers limited off-campus apartments',
          'Expect $800-1200/month for apartments in Elmhurst',
          'Villa Park offers more affordable alternatives nearby',
          'Suburban location - car helpful but not essential',
          'Metra Union Pacific West line connects to Chicago',
          'Safe, family-friendly neighborhoods throughout area',
          'Start searching 2 months ahead if planning off-campus'
        ]
      },
      {
        id: 'millikin',
        accommodationGroups: [
          { name: 'Millikin Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/millikinhousing', note: 'Student housing group' },
          { name: 'Millikin Off-Campus Life', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/millikinoffcampus', note: 'University resources' },
          { name: 'Decatur Area Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/decaturhousing', note: 'Local housing listings' },
          { name: 'Millikin Residence Life', platform: 'Website' as const, url: 'https://millikin.edu/student-life/housing', note: 'Official housing info' }
        ],
        accommodationTips: [
          'Most students live on campus all four years',
          'Very affordable off-campus housing ($400-700/month)',
          'West End neighborhood near campus is popular',
          'Small school means limited off-campus housing market',
          'Start searching early for off-campus options',
          'Car recommended for off-campus living',
          'Check with residence life for housing resources',
          'On-campus housing creates strong community bonds'
        ]
      },
      {
        id: 'wiu',
        accommodationGroups: [
          { name: 'WIU Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/wiuhousing', note: 'Main student housing group' },
          { name: 'WIU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/wiuoffcampus', note: 'University resources' },
          { name: 'Macomb Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/macombhousing', note: 'Community listings' },
          { name: 'WIU Housing Portal', platform: 'Website' as const, url: 'https://www.wiu.edu/student_services/housing/', note: 'Official university site' }
        ],
        accommodationTips: [
          'Extremely affordable housing in Macomb ($350-600/month)',
          'Small college town - most housing within walking distance',
          'Start searching 1-2 months before semester',
          'Many apartment complexes cater specifically to students',
          'Downtown Macomb offers some apartment options',
          'Consider on-campus housing for convenience and community',
          'Winter weather harsh - ensure good heating and insulation',
          'Check University Housing office for approved landlord list'
        ]
      },
      {
        id: 'eiu',
        accommodationGroups: [
          { name: 'EIU Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/eiuhousing', note: 'Primary student housing group' },
          { name: 'EIU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/eiuoffcampus', note: 'University-affiliated listings' },
          { name: 'Charleston Housing & Sublets', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/charlestonilhousing', note: 'Community-wide group' },
          { name: 'EIU Housing Portal', platform: 'Website' as const, url: 'https://www.eiu.edu/housing/', note: 'Official university resources' }
        ],
        accommodationTips: [
          'Very affordable Charleston housing ($400-700/month)',
          'Most apartments within walking/biking distance to campus',
          'Start searching by March for August move-in',
          'Check Unique Properties, Lincoln Wood Pinetree, and local landlords',
          'Many houses available for group rentals',
          'On-campus housing guaranteed for freshmen',
          'Small town atmosphere - safe and friendly',
          'Budget for utilities separately in most rentals'
        ]
      },
      {
        id: 'augustana',
        accommodationGroups: [
          { name: 'Augustana Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/augustanahousing', note: 'Student housing community' },
          { name: 'Augustana College Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/augiehousing', note: 'College-affiliated group' },
          { name: 'Quad Cities Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/quadcitieshousing', note: 'Regional housing listings' },
          { name: 'Augustana Residence Life', platform: 'Website' as const, url: 'https://www.augustana.edu/student-life/housing', note: 'Official housing resources' }
        ],
        accommodationTips: [
          'Most students live on campus all four years',
          'Limited off-campus housing market due to small enrollment',
          'Rock Island and Moline offer affordable apartments ($500-800/month)',
          'Broadway District near campus has some rental options',
          'Consider on-campus living for full college experience',
          'Car helpful but not required for on-campus students',
          'Start searching early if planning off-campus living',
          'Contact residence life for housing guidance'
        ]
      },
      {
        id: 'benedictine',
        accommodationGroups: [
          { name: 'Benedictine Housing & Roommates', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/benedictinehousing', note: 'Student housing group' },
          { name: 'BenU Off-Campus Life', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/benuoffcampus', note: 'University resources' },
          { name: 'Lisle/Naperville Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/lislehousing', note: 'Local area listings' },
          { name: 'BenU Housing Portal', platform: 'Website' as const, url: 'https://www.ben.edu/student-life/housing/', note: 'Official university site' }
        ],
        accommodationTips: [
          'On-campus housing available and convenient',
          'Lisle and Naperville areas more expensive than other IL towns',
          'Expect $800-1200/month for shared apartments',
          'Suburban setting - car recommended for off-campus',
          'Metra BNSF line connects to Chicago from nearby stations',
          'Safe neighborhoods throughout Lisle/Naperville area',
          'Start searching 2-3 months before semester',
          'Many commuter students due to Chicago proximity'
        ]
      },
      {
        id: 'rockford',
        accommodationGroups: [
          { name: 'Rockford Univ Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/rockfordhousing', note: 'Student housing community' },
          { name: 'RU Off-Campus Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/ruoffcampus', note: 'University resources' },
          { name: 'Rockford Area Housing', platform: 'Facebook' as const, url: 'https://www.facebook.com/groups/rockfordilhousing', note: 'Local housing group' },
          { name: 'RU Student Life', platform: 'Website' as const, url: 'https://www.rockford.edu/campus-life/housing/', note: 'Official university info' }
        ],
        accommodationTips: [
          'Small university - many students live on campus',
          'Affordable off-campus housing ($500-800/month)',
          'East Rockford neighborhoods generally safer',
          'Research neighborhoods carefully before committing',
          'Loves Park offers family-friendly alternative',
          'Car recommended for off-campus living',
          'Contact housing office for neighborhood recommendations',
          'On-campus housing provides good community for small school'
        ]
      }
    ];

    let updated = 0;
    const errors: string[] = [];

    console.log('🏠 Starting university accommodation data seeding...');

    for (const uni of universityAccommodationData) {
      try {
        await this.updateUniversityWithAccommodationData(
          uni.id, 
          uni.accommodationGroups, 
          uni.accommodationTips
        );
        updated++;
        console.log(`✅ Updated ${uni.id}`);
      } catch (error: any) {
        const errorMsg = `❌ Error updating ${uni.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { updated, errors };
    console.log('🎉 University accommodation data seeding complete:', result);
    return result;
  }

  /**
   * Remove accommodation data from universities
   * This will delete accommodationGroups and accommodationTips fields
   */
  async removeAccommodationData(): Promise<{ updated: number; errors: string[] }> {
    const universityIds = [
      'uiuc', 'northwestern', 'uchicago', 'illinois-state', 'siue', 'niu',
      'luc', 'depaul', 'iwu', 'bradley', 'siu-carbondale', 'neiu',
      'chicago-state', 'elmhurst', 'millikin', 'wiu', 'eiu',
      'augustana', 'benedictine', 'rockford'
    ];

    let updated = 0;
    const errors: string[] = [];

    console.log('🗑️  Starting accommodation data removal...');

    for (const id of universityIds) {
      try {
        const docRef = doc(this.db, 'universities', id);
        await setDoc(docRef, { 
          accommodationGroups: null,
          accommodationTips: null 
        }, { merge: true });
        updated++;
        console.log(`✅ Removed accommodation data from ${id}`);
      } catch (error: any) {
        const errorMsg = `❌ Error removing data from ${id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { updated, errors };
    console.log('🎉 Accommodation data removal complete:', result);
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

  /**
   * Delete all universities from Firestore
   * WARNING: This will delete all university data!
   */
  async deleteAllUniversities(): Promise<{ deleted: number; errors: string[] }> {
    const universities = await this.getAllUniversities();
    let deleted = 0;
    const errors: string[] = [];

    console.log('⚠️  WARNING: Deleting all universities...');

    for (const uni of universities) {
      try {
        await this.deleteUniversity(uni.id);
        deleted++;
        console.log(`✅ Deleted ${uni.id}`);
      } catch (error: any) {
        const errorMsg = `❌ Error deleting ${uni.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = { deleted, errors };
    console.log('🎉 Deletion complete:', result);
    return result;
  }
}
