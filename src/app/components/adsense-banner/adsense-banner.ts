import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-adsense-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adsense-banner.html',
})
export class AdsenseBannerComponent implements AfterViewInit {
  mostrarBanner = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const esLocalhost = window.location.hostname === 'localhost';
      const estaLogueado = !!localStorage.getItem('token'); // cambiar cuando se haga los pagos si poago que no se muestre

      // Mostrar solo si NO está en localhost
      this.mostrarBanner = !esLocalhost;

      if (this.mostrarBanner) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('Error al cargar AdSense:', e);
        }
      } else {
        console.log('Adsense oculto:', { esLocalhost, estaLogueado });
      }
    }
  }
}
