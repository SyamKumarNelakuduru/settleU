import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('settleU');
  public readonly appName = signal('Lewis University');
  public currentUser = signal<User | null>(null);
  
  private authService = inject(AuthService);

  ngOnInit(): void {
    console.log('App initialized with name:', this.appName());
    
    // Subscribe to authentication state changes
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        console.log('User logged in:', user.displayName, user.email);
        console.log('User photo URL:', user.photoURL);
      } else {
        console.log('User logged out');
      }
    });
  }
}
