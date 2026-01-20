import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  private modalService = inject(ModalService);

  popularCities = [
    { name: 'Chicago', universities: 25, image: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=600&fit=crop' },
    { name: 'Boston', universities: 35, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop' },
    { name: 'New York', universities: 45, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop' },
    { name: 'Los Angeles', universities: 30, image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&h=600&fit=crop' },
    { name: 'Austin', universities: 15, image: 'https://images.unsplash.com/photo-1564630482055-97f1f4a9e7cf?w=800&h=600&fit=crop' },
    { name: 'Seattle', universities: 20, image: 'https://images.unsplash.com/photo-1492515114975-b062d1a270ae?w=800&h=600&fit=crop' }
  ];

  quickSearchUniversities = [
    { label: 'Top 10 Universities', count: 10 },
    { label: 'Top 20 Universities', count: 20 },
    { label: 'Top 50 Universities', count: 50 },
    { label: 'Top 100 Universities', count: 100 }
  ];

  successStories = [
    {
      name: 'Sarah Johnson',
      initial: 'S',
      university: 'Boston University',
      city: 'Boston, MA',
      quote: 'SettleU made finding my student accommodation so easy! The verified listings gave me peace of mind, and I found the perfect place near my university.'
    },
    {
      name: 'Michael Chen',
      initial: 'M',
      university: 'NYU',
      city: 'New York, NY',
      quote: 'The search functionality and comparison tools helped me find the best deal. The support team answered all my questions and made the process stress-free.'
    },
    {
      name: 'Emily Rodriguez',
      initial: 'E',
      university: 'UCLA',
      city: 'Los Angeles, CA',
      quote: 'I compared multiple options and found the best accommodation through SettleU. The price guarantee saved me hundreds of dollars!'
    },
    {
      name: 'David Kim',
      initial: 'D',
      university: 'University of Chicago',
      city: 'Chicago, IL',
      quote: 'The detailed city guides and neighborhood information helped me choose the perfect area. Couldn\'t be happier with my new place!'
    }
  ];

  faqs = [
    {
      question: 'What is SettleU?',
      answer: 'SettleU is a comprehensive and easy-to-use online platform that provides free resources and end-to-end services to help students find verified accommodations near universities across the United States. With over 500,000 users, SettleU is America\'s most trusted student accommodation platform.'
    },
    {
      question: 'Does SettleU charge for its services?',
      answer: 'Basic search and browsing are completely free! We provide access to verified listings, city guides, and comparison tools at no cost. Premium services like personalized matching and booking assistance are available for students who want expert guidance throughout their accommodation search.'
    },
    {
      question: 'Are all listings verified?',
      answer: 'Yes, we verify all properties listed on our platform. This includes checking property ownership, accurate photos and descriptions, and ensuring all amenities are as advertised. We also collect and display real student reviews to help you make informed decisions.'
    },
    {
      question: 'Does SettleU help with budgeting and payments?',
      answer: 'Yes, we provide financial guidance including average rent ranges by city, payment plan options, deposit protection information, and tips for budgeting your accommodation expenses. Our team can also help you understand lease terms and negotiate better deals.'
    },
    {
      question: 'Can I compare different accommodations?',
      answer: 'Absolutely! Our platform allows you to compare multiple properties side-by-side, including prices, amenities, locations, proximity to universities, and student reviews. This makes it easy to find the best option for your needs and budget.'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  openSearchModal(): void {
    this.modalService.openSearch();
  }

  searchByUniversityRank(count: number): void {
    // Open search modal filtered by top N universities
    // This could be connected to an API that fetches real-time rankings
    this.modalService.openSearch();
  }

  searchByCity(cityName: string): void {
    // Open search modal with city pre-filled
    this.modalService.openSearch();
  }

  getCityDescription(cityName: string): string {
    const descriptions: { [key: string]: string } = {
      'Chicago': 'The Windy City boasts iconic architecture, world-famous deep-dish pizza, and a thriving arts scene. Home to Northwestern University, University of Chicago, and UIC, Chicago offers diverse neighborhoods like Lincoln Park and Wicker Park. Known for Navy Pier, Millennium Park, and the Chicago Riverwalk. Average rent: $1,200-1,800/month. Top student areas: Lincoln Park, Lakeview, and Wicker Park.',
      'Boston': 'America\'s college town with over 100 colleges and universities including Harvard, MIT, and Boston University. Rich in history with the Freedom Trail, Fenway Park, and vibrant neighborhoods like Back Bay and Cambridge. Known for excellent public transit (T system), seafood, and four distinct seasons. Average rent: $1,500-2,200/month. Top student areas: Allston, Brighton, and Mission Hill.',
      'New York': 'The Big Apple - a global hub with Columbia University, NYU, and Fordham. Iconic landmarks like Central Park, Times Square, and Broadway. Diverse neighborhoods from Brooklyn to Manhattan offer unique cultural experiences. Excellent public transportation (24/7 subway). Average rent: $1,800-3,000/month. Top student areas: East Village, Washington Heights, and Astoria.',
      'Los Angeles': 'Sunny Southern California with UCLA, USC, and Caltech. Beautiful beaches, Hollywood entertainment, and diverse food scene. Neighborhoods range from Westwood to Downtown LA. Year-round warm weather perfect for outdoor activities. Average rent: $1,400-2,500/month. Top student areas: Westwood, Koreatown, and Hollywood.',
      'Austin': 'Live Music Capital of the World and tech hub with UT Austin. Known for SXSW, food trucks, and the vibrant 6th Street. Growing tech industry with major companies like Apple and Google. Beautiful outdoor spaces like Lady Bird Lake and Zilker Park. Average rent: $1,200-1,800/month. Top student areas: West Campus, North Campus, and Riverside.',
      'Seattle': 'Emerald City known for coffee culture (Starbucks origin), tech giants (Amazon, Microsoft), and UW. Beautiful waterfront, Space Needle, and Pike Place Market. Mild climate with stunning natural scenery. Thriving job market in tech. Average rent: $1,500-2,200/month. Top student areas: University District, Capitol Hill, and Fremont.'
    };
    return descriptions[cityName] || 'A great city for students with excellent educational opportunities and vibrant culture.';
  }
}
