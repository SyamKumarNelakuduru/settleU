import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  appName = 'Lewis University';
  isSearchOpen = false;
  isLoginOpen = false;
  currentUser = signal<User | null>(null);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    console.log('Header initialized with app name:', this.appName);
    
    // Subscribe to authentication state
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
    });
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

  openLogin(): void {
    this.isLoginOpen = true;
  }

  closeLogin(): void {
    this.isLoginOpen = false;
  }

  handleSearch(query: string): void {
    console.log('Search submitted:', query);
    // Perform any search handling here or navigate to search results
    this.closeSearch();
  }

  onLoginClick(): void {
    this.openLogin();
  }

  openProfile(): void {
    console.log('Navigating to profile page');
    this.router.navigate(['/profile']);
  }
  
  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isSearchOpen) this.closeSearch();
    if (this.isLoginOpen) this.closeLogin();
  }
}
