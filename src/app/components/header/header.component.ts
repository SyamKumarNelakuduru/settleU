import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  universityName = 'settleU';
  currentUser = signal<User | null>(null);
  isAdmin = signal<boolean>(false);
  
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  get isSearchOpen(): boolean {
    return this.modalService.isSearchModalOpen;
  }

  get isLoginOpen(): boolean {
    return this.modalService.isLoginModalOpen;
  }

  ngOnInit(): void {
    console.log('Header initialized with university name:', this.universityName);
    
    // Subscribe to authentication state
    this.authService.user$.subscribe(async (user) => {
      this.currentUser.set(user);
      
      if (user) {
        // Fetch user profile to check if admin
        const profile = await this.userService.getUserProfile(user.uid);
        this.isAdmin.set(profile?.isAdmin === true);
        console.log('User isAdmin:', profile?.isAdmin);
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  onSearchClick(): void {
    // TODO: Implement search functionality
    console.log('Search clicked');
  }

  openSearch(): void {
    this.modalService.openSearch();
  }

  closeSearch(): void {
    this.modalService.closeSearch();
  }

  openLogin(): void {
    this.modalService.openLoginModal();
  }

  closeLogin(): void {
    this.modalService.closeLoginModal();
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

  openAdminDashboard(): void {
    console.log('Navigating to admin dashboard');
    this.router.navigate(['/admin']);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const user = this.currentUser();
    const name = user?.displayName || user?.email || 'User';
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`;
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
