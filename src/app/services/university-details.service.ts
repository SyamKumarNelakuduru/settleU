import { Injectable, inject } from '@angular/core';
import { AiService } from './ai.service';

export interface UniversityDetail {
  name: string; // University name; example "Harvard University"
  description: string; // Brief description of the university; example "Harvard University is a prestigious Ivy League institution located in Cambridge, Massachusetts."
  location: string; // Location of the university; example "Cambridge, Massachusetts, USA"
  established: number; // Year the university was established; example 1636
  notablePrograms: string[]; // List of notable academic programs; example ["Law", "Medicine", "Business"]
  website: string; // Official website URL; example "https://www.harvard.edu"
  address: Address; // Address object containing street, city, state, country, and zip code
  student_population: StudentPopulation; // Student population details
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
  "need_car": boolean_value
}

Requirements:
- Use the most recent and accurate data available (2024-2025 academic year)
- All numbers should be integers (no quotes around numbers)
- Notable programs should list 5-8 of the university's strongest/most recognized programs
- Student population numbers should be based on official enrollment statistics
- Top countries for international students should be the actual top 3 countries
- Percentage calculations should represent % of total student population
- For nearby amenities (attractions, transportation, housing, food, parks, healthcare, cultural centers, shopping, sports facilities, libraries, pubs/bars, cities):
  * Provide 3-6 real, specific locations for each category
  * Use actual names of places, not generic descriptions
  * Focus on places within 1-5 miles of campus
  * Include popular student hangouts and practical necessities
- For transportation: Include public transit options, stations, bus routes, bike shares, etc.
- For housing: Include nearby neighborhoods, apartment complexes, student housing areas
- For food: Include diverse cuisine options, popular student restaurants, cafes
- For need_car: Set to false if campus is walkable and has good public transit; true if car is beneficial
- Ensure all fields are filled with accurate information
- Return ONLY the JSON object, nothing else`;

      console.log(`📡 Fetching details for: ${universityName}`);
      
      const response = await this.aiService.getGeminiResponse(prompt);
      console.log('🤖 Raw AI Response:', response);
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      // Parse the JSON response
      const universityDetail: UniversityDetail = JSON.parse(cleanedResponse);
      
      console.log('✅ Successfully fetched university details:', universityDetail.name);
      return universityDetail;
      
    } catch (error) {
      console.error(`❌ Error fetching university details for "${universityName}":`, error);
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
