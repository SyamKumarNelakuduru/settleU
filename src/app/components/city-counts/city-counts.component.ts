import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import MOCK_CITY_POIS, { POI_CATEGORIES } from '../../data/mock-pois';
import { CategoryListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'app-city-counts',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryListComponent],
  templateUrl: './city-counts.component.html',
  styleUrls: ['./city-counts.component.scss']
})
export class CityCountsComponent {
  categories = POI_CATEGORIES;
  cities = MOCK_CITY_POIS;
  searchTerm = '';
  selectedCityId = this.cities[0]?.id ?? '';

  // modal state
  showCategoryModal = false;
  modalTitle = '';
  modalItems: any[] = [];

  get filteredCities() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.cities;
    return this.cities.filter(c => c.name.toLowerCase().includes(q));
  }

  get selectedCity() {
    return this.cities.find(c => c.id === this.selectedCityId) ?? this.cities[0]!;
  }

  selectCity(id: string) {
    this.selectedCityId = id;
  }

  getEmoji(key: string) {
    switch (key) {
      case 'malls':
        return '🛍️';
      case 'groceryStores':
        return '🛒';
      case 'gasStations':
        return '⛽';
      case 'hospitals':
        return '🏥';
      case 'transport':
        return '🚆';
      case 'restaurants':
        return '🍽️';
      case 'carShowrooms':
        return '🚗';
      default:
        return '📍';
    }
  }

  getCount(catKey: string): number {
    const city = this.selectedCity;
    if (!city || !city.counts) return 0;
    return city.counts[catKey] ?? 0;
  }

  openCategory(categoryKey: string, label: string) {
    this.modalTitle = `${label} — ${this.selectedCity.name}`;
    this.modalItems = this.selectedCity.items[categoryKey] || [];
    this.showCategoryModal = true;
  }

  closeModal() {
    this.showCategoryModal = false;
    this.modalItems = [];
    this.modalTitle = '';
  }
}
