import { Component, ChangeDetectorRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AdsterraComponent } from "../adsense-banner/adsense-banner";
import { AuthService } from '../../services/auth/auth';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-planeta-por-fecha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdsterraComponent
  ],
  templateUrl: './planeta-por-fecha.html',
  styleUrls: ['./planeta-por-fecha.scss'],
})
export class PlanetaPorFecha implements OnInit {

  fechaSeleccionada: string = '';
  planetas: any[] = [];
  cargando: boolean = false;

  isLoggedIn = false;
  subscriptionActive = false;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  verDetalle(planeta: any) {
    this.router.navigate(['/detalle-hora'], { state: { planeta } });
  }

  ngOnInit(): void {
    // 🔹 SEO usando SeoService
    this.seo.updateMeta(
      'Horas Planetarias por Fecha | Consulta un día específico',
      'Descubre la información de las horas planetarias de un día a elección y el orden en que rigen.'
      // dejamos image y url undefined para usar la global KAIROS.png
    );

    // 🔹 Recuperar cache SOLO en navegador
    if (isPlatformBrowser(this.platformId)) {
      const fechaGuardada = localStorage.getItem('ultimaFechaConsultada');
      const planetasGuardados = fechaGuardada
        ? localStorage.getItem('planetas_' + fechaGuardada)
        : null;

      if (fechaGuardada && planetasGuardados) {
        this.fechaSeleccionada = fechaGuardada;
        this.planetas = JSON.parse(planetasGuardados);
      }
    }

    // 🔹 Suscripción a login/premium
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (!status) {
        this.router.navigate(['/login']);
      } else {
        this.authService.isPremium$.subscribe(active => {
          this.subscriptionActive = active;
          if (active === false && !this.authService.loadingSubscription) {
            this.router.navigate(['/checkout']);
          }
        });
      }
    });
  }

  async consultar() {
    if (!this.fechaSeleccionada) return;

    // 🔹 Usar cache SOLO en navegador
    if (isPlatformBrowser(this.platformId)) {
      const cache = localStorage.getItem('planetas_' + this.fechaSeleccionada);
      if (cache) {
        this.planetas = JSON.parse(cache);
        localStorage.setItem('ultimaFechaConsultada', this.fechaSeleccionada);
        return;
      }
    }

    this.cargando = true;
    this.planetas = [];

    try {
      const parts = this.fechaSeleccionada.split('-');
      const fecha = new Date(+parts[0], +parts[1] - 1, +parts[2], 12, 0, 0);

      const resultado = await this.planetaService.obtenerHorasPorFecha(fecha);
      this.planetas = resultado;

      // Guardar resultados SOLO en navegador
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('ultimaFechaConsultada', this.fechaSeleccionada);
        localStorage.setItem('planetas_' + this.fechaSeleccionada, JSON.stringify(resultado));
      }

    } catch (error) {
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización.');
      console.error('Error:', error);

    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
