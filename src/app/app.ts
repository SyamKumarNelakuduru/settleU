import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
