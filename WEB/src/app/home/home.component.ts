import { Component, OnInit } from '@angular/core';

import { INavData } from '@coreui/angular';
import { NavigationEnd, Router } from '@angular/router';
import { navItems, navItemsLogout } from './navItem';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  navItems?: INavData[]; 
  navItemsLogout = navItemsLogout;
  isSidebarVisible = true;

  constructor(private router: Router) {
    this.navItems = navItems;
  }

  ngOnInit(): void {
    const savedRoute = localStorage.getItem('currentRoute');

    if (savedRoute) {
      this.router.navigateByUrl(savedRoute);
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('currentRoute', event.url);
      }
    });
  }

  logout() {
    localStorage.removeItem("token");
    // localStorage.removeItem("email");
    // localStorage.removeItem("password");
    this.router.navigate(['/login']);
  }
}
