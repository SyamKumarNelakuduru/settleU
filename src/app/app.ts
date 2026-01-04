import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('settleU');
  public readonly appName = signal('Lewis University');

  ngOnInit(): void {
    console.log('App initialized with name:', this.appName());
  }
}
