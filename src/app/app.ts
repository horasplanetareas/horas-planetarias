import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { MenuComponent } from './components/menu/menu';
import { AdsenseBannerComponent } from "./components/adsense-banner/adsense-banner";
import { Footer } from "./components/footer/footer";
import { SeoService } from './services/seo/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    MenuComponent,
    AdsenseBannerComponent,
    Footer
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {
  protected title = 'Horas';

  constructor(
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Esto actualizará automáticamente los meta tags globales
      this.seo.setGlobalMeta();
    }
  }
}
