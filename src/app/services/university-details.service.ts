import { Injectable, inject } from '@angular/core';
import { AiService } from './ai.service';

export interface CampusJob {
  title: string; // Job title; example "Graduate Assistant"
  description: string; // Brief job description; example "Assist professors with research and teaching duties"
  hourlyRate: string; // Pay rate range; example "$15-20/hour"
  availability: string; // Availability info; example "Available for graduate students"
}

export interface TuitionFees {
  annual_tuition?: string; // Annual tuition cost; example "$60,000"
  in_state_tuition?: string; // In-state tuition; example "$30,000"
  out_of_state_tuition?: string; // Out-of-state tuition; example "$60,000"
  room_and_board?: string; // Room and board cost; example "$20,000"
  books_and_supplies?: string; // Books and supplies cost; example "$1,200"
}

export interface AdmissionStats {
  acceptance_rate?: string; // Acceptance rate; example "15%"
  average_gpa?: string; // Average GPA; example "3.9"
  sat_range?: string; // SAT score range; example "1450-1570"
  act_range?: string; // ACT score range; example "33-35"
}

export interface FinancialAid {
  aid_types: string[]; // Types of aid available; example ["Scholarships", "Grants", "Loans"]
  international_student_support: string[]; // Support for international students; example ["Need-based aid", "Merit scholarships", "Work-study"]
}

export interface StudentReview {
  reviewer_name: string; // Name of the reviewer
  program: string; // Program/major of the reviewer
  year: string; // Year of study
  rating: number; // Rating out of 5
  review_text: string; // The review text
  highlights: string[]; // Key highlights/tags
}

export interface SocialMedia {
  facebook?: string; // Facebook profile URL
  twitter?: string; // Twitter profile URL
  instagram?: string; // Instagram profile URL
  linkedin?: string; // LinkedIn profile URL
  youtube?: string; // YouTube channel URL
}

export interface AdditionalResource {
  title: string; // Resource title
  description: string; // Resource description
  link: string; // Resource link
}

export interface ProfessorContact {
  name: string; // Professor name
  role: string; // Role (e.g., "Dean of Students", "Academic Advisor")
  email: string; // Email address
  phone?: string; // Phone number (optional)
  department?: string; // Department name (optional)
}

export interface SafetyInfo {
  overall_safety_rating: string; // Rating (e.g., "Safe", "Moderate", "Use Caution")
  crime_statistics?: string; // General crime information for the area
  safety_tips?: string[]; // Tips for students to stay safe
  places_to_avoid?: string[]; // Areas or locations to avoid
  emergency_contacts?: EmergencyContact[]; // Emergency numbers and contacts
  campus_security?: string; // Campus security information
}

export interface EmergencyContact {
  name: string; // Emergency service name (e.g., "Campus Police", "Medical Emergency")
  number: string; // Phone number
  description?: string; // Brief description
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
  campus_jobs?: CampusJob[]; // Optional list of on-campus job opportunities
  tuition_fees?: TuitionFees; // Optional tuition and fees information
  admission_stats?: AdmissionStats; // Optional admission statistics
  financial_aid?: FinancialAid; // Optional financial aid information
  student_reviews?: StudentReview[]; // Optional student reviews and testimonials
  social_media?: SocialMedia; // Optional social media links
  additional_resources?: AdditionalResource[]; // Optional additional resources
  indian_amenities?: string[]; // Optional list of Indian restaurants, grocery stores, and cultural amenities; example ["Maharaja Indian Restaurant", "India Bazaar Grocery", "Indian Spice House"]
  near_by_attractions?: string[]; // Optional list of nearby attractions; example ["Museum of Fine Arts", "Fenway Park"]
  near_by_transportation?: string[]; // Optional list of nearby transportation options; example ["Harvard Square T Station", "Bus routes 1, 66, 86"]
  near_by_housing_options?: string[]; // Optional list of nearby housing options; example ["Apartments on Mass Ave", "Student dormitories"]
  near_by_food_options?: string[]; // Optional list of nearby food options; example ["Clover Food Lab", "Tatte Bakery & Cafe"]
  near_by_parks_and_recreation?: string[]; // Optional list of nearby parks and recreation areas; example ["Cambridge Common", "Charles River Esplanade"]
  near_by_healthcare_facilities?: string[]; // Optional list of nearby healthcare facilities; example ["Massachusetts General Hospital", "Cambridge Health Alliance"]
  near_by_cultural_centers?: string[]; // Optional list of nearby cultural centers; example ["American Repertory Theater", "Harvard Art Museums"]
  near_by_shopping_centers?: string[]; // Optional list of nearby shopping centers; example ["Harvard Square Shops", "CambridgeSide Galleria"]
  near_by_sports_facilities?: string[]; // Optional list of nearby sports facilities; example ["Harvard Stadium", "Brighton Allston YMCA"]
  near_by_libraries?: string[]; // Optional list of nearby libraries; example ["Harvard Library", "Cambridge Public Library"]
  near_by_pubs_and_bars?: string[]; // Optional list of nearby pubs and bars; example ["The Sinclair", "Grendel's Den"]
  near_by_cities_of_interest?: string[]; // Optional list of nearby cities of interest; example ["Boston", "Somerville"]
  need_car?: boolean; // Optional boolean indicating if a car is needed; example false
  professor_contacts?: ProfessorContact[]; // Optional list of key contacts (DSO, advisors, etc.)
  safety_info?: SafetyInfo; // Optional safety information about the area and campus
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
export class UniversityDetailsService {
  private aiService = inject(AiService);

  /**
   * Get detailed university information from AI service
   * @param universityName The name of the university to get details for
   * @returns Promise with UniversityDetail object
   */
  async getUniversityDetails(universityName: string): Promise<UniversityDetail> {
    try {
      const prompt = `You are a university information assistant. Provide comprehensive and accurate information about "${universityName}".

IMPORTANT: Return ONLY a valid JSON object with no additional text, explanations, or markdown formatting. Do not wrap the response in code blocks or backticks.

The JSON must follow this exact structure:
{
  "name": "Full official university name",
  "description": "Detailed description of the university (2-3 sentences covering its reputation, focus areas, and notable characteristics)",
  "location": "City, State/Province, Country format",
  "established": year_as_number,
  "notablePrograms": ["Program1", "Program2", "Program3", "Program4", "Program5"],
  "website": "https://official-website-url.edu",
  "address": {
    "street": "Street address with building number",
    "city": "City name",
    "state": "State or Province",
    "country": "Country name",
    "zipCode": "Postal/ZIP code"
  },
  "student_population": {
    "total_students": total_number,
    "undergraduate_students": undergraduate_number,
    "graduate_students": graduate_number,
    "international_students": {
      "total_international_students": international_number,
      "countries_represented": number_of_countries,
      "top_countries": ["Country1", "Country2", "Country3"],
      "countires_percentage_population": {
        "Country1": percentage_number,
        "Country2": percentage_number,
        "Country3": percentage_number
      }
    },
    "domestic_students": domestic_number
  },
  "tuition_fees": {
    "annual_tuition": "$XX,XXX",
    "in_state_tuition": "$XX,XXX (if applicable)",
    "out_of_state_tuition": "$XX,XXX (if applicable)",
    "room_and_board": "$X,XXX",
    "books_and_supplies": "$XXX"
  },
  "admission_stats": {
    "acceptance_rate": "X%",
    "average_gpa": "X.XX",
    "sat_range": "XXXX-XXXX",
    "act_range": "XX-XX"
  },
  "financial_aid": {
    "aid_types": ["Scholarships", "Grants", "Loans", "Work-Study"],
    "international_student_support": ["Need-based aid", "Merit scholarships", "International student scholarships", "Assistantships"]
  },
  "student_reviews": [
    {
      "reviewer_name": "First Name Last Name",
      "program": "Program/Major",
      "year": "Freshman/Sophomore/Junior/Senior/Graduate",
      "rating": 4 or 5,
      "review_text": "A brief honest review about the student's experience at the university",
      "highlights": ["Campus Life", "Academics", "Support Services"]
    },
    {
      "reviewer_name": "Another Student",
      "program": "Different Program",
      "year": "Different Year",
      "rating": 4 or 5,
      "review_text": "Another genuine student perspective",
      "highlights": ["Diversity", "Research Opportunities", "Community"]
    }
  ],
  "social_media": {
    "facebook": "https://facebook.com/universitypage",
    "twitter": "https://twitter.com/universityhandle",
    "instagram": "https://instagram.com/universityhandle",
    "linkedin": "https://linkedin.com/school/universityname",
    "youtube": "https://youtube.com/@universityhandle"
  },
  "additional_resources": [
    {
      "title": "Resource Title",
      "description": "Brief description of what this resource offers",
      "link": "https://link-to-resource.edu"
    }
  ],
  "campus_jobs": [
    {
      "title": "Graduate Assistant (GA)",
      "description": "Brief description of GA responsibilities and departments",
      "hourlyRate": "$XX-XX/hour or stipend amount",
      "availability": "Available for graduate students enrolled in specific programs"
    },
    {
      "title": "Teaching Assistant (TA)",
      "description": "Brief description of TA responsibilities",
      "hourlyRate": "$XX-XX/hour",
      "availability": "Available for graduate and advanced undergraduate students"
    },
    {
      "title": "Dining Services",
      "description": "Brief description of dining hall positions",
      "hourlyRate": "$XX-XX/hour",
      "availability": "Available for all students"
    }
  ],
  "indian_amenities": ["Indian Restaurant 1", "Indian Grocery Store 1", "Indian Restaurant 2", "Indian Grocery Store 2", "Indian Cultural Center or Temple"],
  "near_by_attractions": ["Attraction1", "Attraction2", "Attraction3", "Attraction4", "Attraction5"],
  "near_by_transportation": ["Transit1", "Transit2", "Transit3", "Transit4"],
  "near_by_housing_options": ["Housing1", "Housing2", "Housing3", "Housing4"],
  "near_by_food_options": ["Restaurant1", "Restaurant2", "Restaurant3", "Restaurant4", "Restaurant5"],
  "near_by_parks_and_recreation": ["Park1", "Park2", "Park3"],
  "near_by_healthcare_facilities": ["Hospital1", "Clinic2", "Healthcare3"],
  "near_by_cultural_centers": ["Museum1", "Theater2", "Cultural3"],
  "near_by_shopping_centers": ["Mall1", "Store2", "Shopping3"],
  "near_by_sports_facilities": ["Gym1", "Stadium2", "Sports3"],
  "near_by_libraries": ["Library1", "Library2"],
  "near_by_pubs_and_bars": ["Bar1", "Pub2", "Bar3"],
  "near_by_cities_of_interest": ["City1", "City2", "City3"],
  "need_car": boolean_value,
  "professor_contacts": [
    {
      "name": "Full Name",
      "role": "Position/Title (e.g., Dean of Students, International Student Advisor)",
      "email": "email@university.edu",
      "phone": "+1-XXX-XXX-XXXX",
      "department": "Department Name (optional)"
    },
    {
      "name": "Another Name",
      "role": "Different Position (e.g., Graduate Program Advisor, DSO)",
      "email": "email@university.edu",
      "phone": "+1-XXX-XXX-XXXX",
      "department": "Department Name (optional)"
    }
  ],
  "safety_info": {
    "overall_safety_rating": "Safe/Moderate/Use Caution",
    "crime_statistics": "General information about crime rates in the area compared to national averages",
    "safety_tips": [
      "Always walk in groups, especially at night",
      "Be aware of your surroundings",
      "Use campus security escort services",
      "Keep valuables secure",
      "Trust your instincts and report suspicious activity"
    ],
    "places_to_avoid": [
      "Specific neighborhoods or areas",
      "Dangerous streets or blocks",
      "Areas known for crime"
    ],
    "campus_security": "Information about campus security services, patrolling, and emergency protocols",
    "emergency_contacts": [
      {
        "name": "Campus Police/Security",
        "number": "+1-XXX-XXX-XXXX",
        "description": "For emergencies and campus safety concerns"
      },
      {
        "name": "Local Police Non-Emergency",
        "number": "+1-XXX-XXX-XXXX",
        "description": "For non-emergency police reports"
      },
      {
        "name": "Emergency Medical Services",
        "number": "911",
        "description": "For medical emergencies"
      }
    ]
  }
}

Requirements:
- Use the most recent and accurate data available (2024-2025 academic year)
- All numbers should be integers (no quotes around numbers)
- Notable programs should list 5-8 of the university's strongest/most recognized programs
- Student population numbers should be based on official enrollment statistics
- Top countries for international students should be the actual top 3 countries
- Percentage calculations should represent % of total student population
- Tuition and financial aid should be accurate for 2024-2025
- Admission stats should reflect current admission requirements
- Student reviews should be realistic and diverse perspectives (3-4 reviews)
- Social media links should be the official university accounts
- For nearby amenities (attractions, transportation, housing, food, parks, healthcare, cultural centers, shopping, sports facilities, libraries, pubs/bars, cities):
  * Provide 3-6 real, specific locations for each category
  * Use actual names of places, not generic descriptions
  * Focus on places within 1-5 miles of campus
  * Include popular student hangouts and practical necessities
- For transportation: Include public transit options, stations, bus routes, bike shares, etc.
- For housing: Include nearby neighborhoods, apartment complexes, student housing areas
- For food: Include diverse cuisine options, popular student restaurants, cafes (exclude Indian food from this list)
- For indian_amenities: Include 4-6 Indian-specific places like Indian restaurants, Indian grocery stores, Indian sweet shops, temples, cultural centers within 1-10 miles of campus
- For campus_jobs: Include 3-5 common on-campus job opportunities (GA, TA, Dining Services, Library, Research Assistant, etc.) with realistic pay rates and availability requirements
- For need_car: Set to false if campus is walkable and has good public transit; true if car is beneficial
- For professor_contacts: Include 3-5 key contacts such as:
  * Dean of Students (DSO)
  * International Student Advisor
  * Graduate Program Advisor
  * Admissions Contact
  * Academic Advisor
  Each contact should include their name, role, email, phone number, and department
- For safety_info: Provide comprehensive safety information including:
  * overall_safety_rating: Rate as "Safe", "Moderate", or "Use Caution" based on crime statistics
  * crime_statistics: Provide factual information about crime rates in the area
  * safety_tips: Include 5-6 practical safety tips for students (e.g., travel in groups, avoid isolated areas, use escort services)
  * places_to_avoid: List 3-5 specific neighborhoods or areas known to have higher crime or that students should avoid
  * campus_security: Describe campus security services, patrol presence, and emergency protocols
  * emergency_contacts: Include campus police, local police non-emergency, and medical emergency numbers with descriptions
- Ensure all fields are filled with accurate information
- Return ONLY the JSON object, nothing else`;

      console.log(`📡 Fetching details for: ${universityName}`);
      
      const response = await this.aiService.getGeminiResponse(prompt);
      console.log('🤖 Raw AI Response:', response);
      
      if (!response || response.trim() === '') {
        throw new Error('Empty response from AI service');
      }
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      console.log('🧹 Cleaned response:', cleanedResponse.substring(0, 200) + '...');
      
      // Parse the JSON response
      const universityDetail: UniversityDetail = JSON.parse(cleanedResponse);
      
      console.log('✅ Successfully fetched university details:', universityDetail.name);
      return universityDetail;
      
    } catch (error) {
      console.error(`❌ Error fetching university details for "${universityName}":`, error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(`Failed to fetch university details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate that the returned data matches the expected interface
   * @param data The data to validate
   * @returns boolean indicating if data is valid
   */
  private validateUniversityDetail(data: any): boolean {
    return (
      typeof data.name === 'string' &&
      typeof data.description === 'string' &&
      typeof data.location === 'string' &&
      typeof data.established === 'number' &&
      Array.isArray(data.notablePrograms) &&
      typeof data.website === 'string' &&
      data.address &&
      typeof data.address.street === 'string' &&
      typeof data.address.city === 'string' &&
      typeof data.address.state === 'string' &&
      typeof data.address.country === 'string' &&
      typeof data.address.zipCode === 'string' &&
      data.student_population &&
      typeof data.student_population.total_students === 'number' &&
      typeof data.student_population.undergraduate_students === 'number' &&
      typeof data.student_population.graduate_students === 'number' &&
      data.student_population.international_students &&
      typeof data.student_population.international_students.total_international_students === 'number' &&
      typeof data.student_population.international_students.countries_represented === 'number' &&
      Array.isArray(data.student_population.international_students.top_countries) &&
      typeof data.student_population.international_students.countires_percentage_population === 'object' &&
      typeof data.student_population.domestic_students === 'number'
    );
  }
}
