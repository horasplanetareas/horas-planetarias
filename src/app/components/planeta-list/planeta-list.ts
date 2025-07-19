import {Component,OnInit,ChangeDetectorRef,Inject,PLATFORM_ID} from '@angular/core';
import {CommonModule} from '@angular/common';
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
  isLocalhost: boolean = false;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
      this.cdr.detectChanges();
      console.log('loading desactivado');
    }
  }
}
