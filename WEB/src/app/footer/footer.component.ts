import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}