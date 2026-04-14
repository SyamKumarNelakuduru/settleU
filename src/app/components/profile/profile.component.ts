import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  isAdmin = signal<boolean>(false);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.user$.subscribe(async (user) => {
      this.currentUser.set(user);
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
      const profile = await this.userService.getUserProfile(user.uid);
      this.isAdmin.set(profile?.isAdmin === true);
    });
  }

  isGoogleUser(): boolean {
    return this.currentUser()?.providerData?.[0]?.providerId === 'google.com';
  }

  getAvatarUrl(): string {
    const user = this.currentUser();
    const name = user?.displayName || user?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getAvatarUrl();
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
