import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

// Declarar bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MenuComponent implements AfterViewInit {
  isLoggedIn = false;
  platformId = inject(PLATFORM_ID);

  // Referencia al botón toggle
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef<HTMLAnchorElement>;
  dropdownInstance: any;

  constructor() {
    this.isLoggedIn = this.checkLogin();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.dropdownToggle) {
      this.dropdownInstance = new bootstrap.Dropdown(this.dropdownToggle.nativeElement);
    }
  }

  checkLogin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.closeDropdown();
  }

  closeDropdown() {
    if (this.dropdownInstance) {
      this.dropdownInstance.hide();
    }
  }
}
