import { Component, Inject, PLATFORM_ID, AfterViewInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu';
import { AdsterraComponent } from "./components/adsense-banner/adsense-banner";
import { Footer } from "./components/footer/footer";
import { SeoService } from './services/seo/seo.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth';
import { AdsterraSideComponent } from "./components/adsterra-sidebar-component/adsterra-sidebar-component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    AdsterraComponent,
    Footer,
    //AdsterraSideComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {

  subscriptionActive = false;
  windowWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = (event.target as Window).innerWidth;
  }

  constructor(
    private seo: SeoService,
        private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.seo.setGlobalMeta();
    }
  }
}
