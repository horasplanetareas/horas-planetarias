import { Component, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MenuComponent {
  isLoggedIn = false;
  platformId = inject(PLATFORM_ID);
  router = inject(Router);

  constructor() {
    this.isLoggedIn = this.checkLogin();
  }

  checkLogin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
  }
}
