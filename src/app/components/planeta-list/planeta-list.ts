import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlanetaService } from '../../services/planeta.service';
import { AdsenseBannerComponent } from '../adsense-banner/adsense-banner';

@Component({
  selector: 'app-planeta-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdsenseBannerComponent],
  templateUrl: './planeta-list.html',
  styleUrl: './planeta-list.scss',
  host: { ngSkipHydration: '' }
})
export class PlanetaList implements OnInit {
  planetas: any[] = [];
  loading = true;
  esBrowser: boolean;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.esBrowser = isPlatformBrowser(this.platformId); // detecta si corre en el navegador
  }

  verDetalle(planeta: any) {
    this.router.navigate(['/detalle-hora'], { state: { planeta } });
  }

  async ngOnInit() {
    try {
      this.planetas = await this.planetaService.obtenerHorasPlanetarias();
      console.log('Planetas cargados:', this.planetas);
    } catch (error) {
      console.error('Error cargando planetas:', error);
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();  // <- Forzar actualización de vista
      console.log('loading desactivado');
    }
  }
}
