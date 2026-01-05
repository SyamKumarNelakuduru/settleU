import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import MOCK_CITY_POIS, { POI_CATEGORIES } from '../../data/mock-pois';
import { CategoryListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, CategoryListComponent]
})
export class HomeComponent {
  showCategoryModal = false;
  modalTitle = '';
  modalItems: any[] = [];

  get naperville() {
    return MOCK_CITY_POIS.find(c => c.id === 'naperville')!;
  }

  get categories() {
    return POI_CATEGORIES;
  }

  getEmoji(key: string) {
    switch (key) {
      case 'malls': return '🛍️';
      case 'groceryStores': return '🛒';
      case 'gasStations': return '⛽';
      case 'hospitals': return '🏥';
      case 'transport': return '🚆';
      case 'restaurants': return '🍽️';
      case 'carShowrooms': return '🚗';
      default: return '📍';
    }
  }

  openCategory(categoryKey: string, label: string) {
    this.modalTitle = `${label} — Naperville`;
    this.modalItems = this.naperville.items[categoryKey] || [];
    this.showCategoryModal = true;
  }

  closeModal() { this.showCategoryModal = false; this.modalItems = []; this.modalTitle = ''; }
}
