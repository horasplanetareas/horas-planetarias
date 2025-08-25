import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-adsense-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adsense-banner.html',
})
export class AdsenseBannerComponent implements AfterViewInit {
  mostrarBanner = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const esLocalhost = window.location.hostname === 'localhost';
    const token = localStorage.getItem('authToken'); // ✅ Detecta si el usuario tiene premium

    // Mostrar solo si NO está en localhost y el usuario NO tiene premium
    this.mostrarBanner = !esLocalhost && !token;

    if (this.mostrarBanner) {
      try {
        // 👇 Asegura que window.adsbygoogle existe y carga el anuncio
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('Error al cargar AdSense:', e);
      }
    } else {
      console.log('Adsense oculto:', { esLocalhost, tienePremium: !!token });
    }
  }
}

}
