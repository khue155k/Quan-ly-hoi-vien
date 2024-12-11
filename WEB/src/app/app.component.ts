import { Component, inject, OnInit } from '@angular/core';
import { iconSubset } from './icons/icon-subset';
import { IconSetService } from '@coreui/icons-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  // imports: [
  //   RouterOutlet,

  // ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';
  readonly #iconSetService = inject(IconSetService);

  constructor(private router: Router) {
    this.#iconSetService.icons = { ...iconSubset };
  }

}
