import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  appName = 'Lewis University';

  ngOnInit(): void {
    console.log('Header initialized with app name:', this.appName);
  }

  onSearchClick(): void {
    // TODO: Implement search functionality
    console.log('Search clicked');
  }

  onLoginClick(): void {
    // TODO: Navigate to login page or open login modal
    console.log('Login clicked');
  }
}
