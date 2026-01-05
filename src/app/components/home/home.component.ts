import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import MOCK_CITY_POIS from '../../data/mock-pois';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent {
  get naperville() {
    return MOCK_CITY_POIS.find(c => c.id === 'naperville')!;
  }
}
