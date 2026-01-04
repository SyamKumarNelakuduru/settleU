import { Component, OnInit, inject, HostListener } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private modalService = inject(ModalService);
  appName = 'Lewis University';
  isSearchOpen = false;

  ngOnInit(): void {
    console.log('Header initialized with app name:', this.appName);
  }

  onSearchClick(): void {
    // TODO: Implement search functionality
    console.log('Search clicked');
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  handleSearch(query: string): void {
    console.log('Search submitted:', query);
    // Perform any search handling here or navigate to search results
    this.closeSearch();
  }

  onLoginClick(): void {
    this.modalService.openLoginModal();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isSearchOpen) this.closeSearch();
  }
}
