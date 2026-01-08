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

  ngOnInit(): void {
    // Component initialization
  }

  openSearchModal(): void {
    this.modalService.openSearch();
  }

  searchByCity(cityName: string): void {
    // Open search modal with city pre-filled
    this.modalService.openSearch();
  }
}
