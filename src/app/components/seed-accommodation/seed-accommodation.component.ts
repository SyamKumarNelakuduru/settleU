/**
 * Browser-Based Accommodation Data Seeding Tool
 * 
 * This component can be temporarily added to the admin dashboard
 * to seed accommodation data using authenticated Firebase connection.
 * 
 * Usage:
 * 1. Add this component to your admin dashboard
 * 2. Login as admin
 * 3. Click "Seed Accommodation Data" button
 * 4. Remove component after seeding
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';

interface AccommodationGroup {
  name: string;
  platform: 'Facebook' | 'Discord' | 'Telegram' | 'WhatsApp' | 'Website';
  url: string;
  note: string;
}

interface SeedData {
  accommodationGroups: AccommodationGroup[];
  accommodationTips: string[];
}

@Component({
  selector: 'app-seed-accommodation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seed-container">
      <h2>Accommodation Data Seeding Tool</h2>
      
      <div class="seed-status">
        <p>Status: {{ status() }}</p>
        <p *ngIf="progress()">Progress: {{ progress() }}</p>
      </div>

      <button 
        class="seed-btn" 
        (click)="seedData()" 
        [disabled]="isSeeding()">
        {{ isSeeding() ? 'Seeding...' : 'Seed Accommodation Data' }}
      </button>

      <div class="results" *ngIf="results().length > 0">
        <h3>Results:</h3>
        <ul>
          <li *ngFor="let result of results()">{{ result }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .seed-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .seed-status {
      margin: 1rem 0;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
    }

    .seed-btn {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background: #5568d3;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .results {
      margin-top: 2rem;
      
      ul {
        list-style: none;
        padding: 0;
        
        li {
          padding: 0.5rem;
          margin: 0.25rem 0;
          background: white;
          border-radius: 4px;
          border-left: 3px solid #10b981;
          
          &:contains('Error') {
            border-left-color: #ef4444;
          }
        }
      }
    }
  `]
})
export class SeedAccommodationComponent {
  private firebaseService = inject(FirebaseService);
  private db = this.firebaseService.firestore;

  isSeeding = signal(false);
  status = signal('Ready to seed');
  progress = signal('');
  results = signal<string[]>([]);

  private readonly accommodationData: Record<string, SeedData> = {
    'uiuc': {
      accommodationGroups: [
        {
          name: 'UIUC Off-Campus Housing',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/uiucoffcampushousing',
          note: 'Active group with daily posts. Verify landlord credentials before signing.'
        },
        {
          name: 'UIUC Housing & Roommates',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/uiuchousing',
          note: 'Large community for finding roommates and sublease options.'
        },
        {
          name: 'UIUC Student Housing Discord',
          platform: 'Discord',
          url: 'https://discord.gg/uiuchousing',
          note: 'Real-time chat for urgent housing needs. Moderated server.'
        },
        {
          name: 'University Housing Services',
          platform: 'Website',
          url: 'https://housing.illinois.edu/resources/off-campus',
          note: 'Official university resource with verified listings and legal guidance.'
        }
      ],
      accommodationTips: [
        'Never pay deposits before seeing the lease and property in person.',
        'Use the university\'s official housing portal for verified listings.',
        'Check landlord reviews on campus forums before committing.',
        'Understand Illinois tenant rights - the university provides free legal consultations.',
        'Popular areas: Campustown, West Campus, Champaign Downtown.'
      ]
    },
    
    'northwestern': {
      accommodationGroups: [
        {
          name: 'Northwestern Off-Campus Housing',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/northwesternhousing',
          note: 'Official student-run group. Always meet in public places.'
        },
        {
          name: 'NU Student Housing Hub',
          platform: 'Website',
          url: 'https://www.northwestern.edu/communityhousing',
          note: 'University-managed listings with verified landlords.'
        },
        {
          name: 'Evanston Housing Network',
          platform: 'Discord',
          url: 'https://discord.gg/evanstonhousing',
          note: 'Community for Evanston area housing. Ask questions before committing.'
        }
      ],
      accommodationTips: [
        'Evanston has strict rental ordinances - familiarize yourself with them.',
        'Never wire money or use gift cards for deposits.',
        'The university offers free lease review services.',
        'Winter sublets are common - negotiate rates for off-season.'
      ]
    },

    'uchicago': {
      accommodationGroups: [
        {
          name: 'UChicago Housing Marketplace',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/uchicagohousing',
          note: 'Verify all listings through official channels before payment.'
        },
        {
          name: 'Hyde Park Housing Community',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/hydeparkhousing',
          note: 'Local neighborhood group with apartment and roommate listings.'
        },
        {
          name: 'UChicago Off-Campus Housing',
          platform: 'Website',
          url: 'https://offcampushousing.uchicago.edu',
          note: 'Official university resource with safety tips and vetted landlords.'
        }
      ],
      accommodationTips: [
        'Hyde Park is the primary student area - check safety reports.',
        'University provides shuttle services - consider this when choosing location.',
        'Join the official housing Facebook group managed by Student Affairs.',
        'Never pay deposits to unverified landlords - use escrow services.'
      ]
    },

    'depaul': {
      accommodationGroups: [
        {
          name: 'DePaul Housing & Sublets',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/depaulhousing',
          note: 'Active group for both Lincoln Park and Loop campuses.'
        },
        {
          name: 'DePaul Student Housing',
          platform: 'Website',
          url: 'https://offices.depaul.edu/student-affairs/housing',
          note: 'Official resource with neighborhood guides and lease templates.'
        },
        {
          name: 'Chicago Student Housing Hub',
          platform: 'Telegram',
          url: 'https://t.me/chicagostudenthousing',
          note: 'Multi-university group for Chicago area. Be cautious of scams.'
        }
      ],
      accommodationTips: [
        'Lincoln Park and Loop have different price ranges - compare carefully.',
        'Chicago has renter\'s insurance requirements - budget for this.',
        'Use the university\'s Off-Campus Life office for lease reviews.',
        'Winter heating costs can be high - ask about average utility bills.'
      ]
    },

    'luc': {
      accommodationGroups: [
        {
          name: 'Loyola Housing & Roommates',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/loyolahousing',
          note: 'Students from all campuses. Verify Loyola email before sharing info.'
        },
        {
          name: 'Rogers Park Housing Network',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/rogersparkhousing',
          note: 'Neighborhood-focused group for Lake Shore Campus students.'
        },
        {
          name: 'Loyola Off-Campus Resources',
          platform: 'Website',
          url: 'https://www.luc.edu/offcampus',
          note: 'Official listings and Chicago rental law information.'
        }
      ],
      accommodationTips: [
        'Rogers Park is more affordable than downtown - good CTA access.',
        'Ask about parking availability and costs if you have a car.',
        'Join neighborhood safety groups and download Citizen app.',
        'University offers free legal advice for lease questions.'
      ]
    },

    'illinois-state': {
      accommodationGroups: [
        {
          name: 'ISU Off-Campus Housing',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/isuhousing',
          note: 'Main group for Normal-Bloomington area housing.'
        },
        {
          name: 'ISU Housing Services',
          platform: 'Website',
          url: 'https://housing.illinoisstate.edu/off-campus',
          note: 'Official portal with verified listings and roommate matching.'
        }
      ],
      accommodationTips: [
        'Start searching 3-4 months before move-in date.',
        'Most leases start in August - summer sublets are common.',
        'Normal-Bloomington has good public transit options.',
        'Ask about snow removal policies in winter months.'
      ]
    },

    'siue': {
      accommodationGroups: [
        {
          name: 'SIUE Student Housing',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/siuehousing',
          note: 'Community for Edwardsville area housing.'
        },
        {
          name: 'SIUE Off-Campus Housing',
          platform: 'Website',
          url: 'https://www.siue.edu/housing/offcampus',
          note: 'University resource with local listings and guides.'
        }
      ],
      accommodationTips: [
        'Many students commute - consider proximity to public transit.',
        'Utilities often not included - ask for estimates.',
        'Check both Edwardsville and Glen Carbon areas.',
        'Campus security offers safety escorts - use this service.'
      ]
    },

    'niu': {
      accommodationGroups: [
        {
          name: 'NIU Off-Campus Housing',
          platform: 'Facebook',
          url: 'https://www.facebook.com/groups/niuhousing',
          note: 'DeKalb area housing with frequent updates.'
        },
        {
          name: 'NIU Housing Portal',
          platform: 'Website',
          url: 'https://niu.offcampuspartners.com',
          note: 'Official university housing search tool.'
        }
      ],
      accommodationTips: [
        'DeKalb is a college town - many housing options near campus.',
        'Winter can be harsh - check heating systems and insulation.',
        'Ask landlords about snow parking regulations.',
        'Popular areas: Greek Row, Annie Glidden North.'
      ]
    }
  };

  async seedData() {
    this.isSeeding.set(true);
    this.status.set('Seeding in progress...');
    this.results.set([]);

    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const newResults: string[] = [];

    const universities = Object.keys(this.accommodationData);
    
    for (let i = 0; i < universities.length; i++) {
      const universityId = universities[i];
      const data = this.accommodationData[universityId];
      
      this.progress.set(`Processing ${i + 1}/${universities.length}: ${universityId}`);

      try {
        const docRef = doc(this.db, 'universities', universityId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          newResults.push(`⏭️ Skipped ${universityId} - document not found`);
          skipped++;
          continue;
        }

        await updateDoc(docRef, {
          accommodationGroups: data.accommodationGroups,
          accommodationTips: data.accommodationTips
        });

        newResults.push(`✅ Updated ${universityId} with accommodation data`);
        updated++;
      } catch (error: any) {
        newResults.push(`❌ Error updating ${universityId}: ${error.message}`);
        errors++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    newResults.push('');
    newResults.push(`📊 Summary: ✅ ${updated} updated, ⏭️ ${skipped} skipped, ❌ ${errors} errors`);

    this.results.set(newResults);
    this.status.set('Seeding complete!');
    this.progress.set('');
    this.isSeeding.set(false);
  }
}
