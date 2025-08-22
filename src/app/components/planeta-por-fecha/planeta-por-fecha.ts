// Importaciones necesarias para el componente
import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AdsenseBannerComponent } from "../adsense-banner/adsense-banner";
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-planeta-por-fecha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdsenseBannerComponent
  ],
  templateUrl: './planeta-por-fecha.html',
  styleUrl: './planeta-por-fecha.scss',
})
export class PlanetaPorFecha implements OnInit {

  fechaSeleccionada: string = '';      // Fecha seleccionada por el usuario
  planetas: any[] = [];                // Lista de planetas
  cargando: boolean = false;           // Indicador de carga

  isLoggedIn = false;                  // Estado de login
  subscriptionActive = false;          // Estado de suscripción

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object // 👈 Necesario para SSR
  ) {}

  verDetalle(planeta: any) {
    this.router.navigate(['/detalle-hora'], { state: { planeta } });
  }

  ngOnInit(): void {
    // 🔹 SEO: Título y Metas
    this.titleService.setTitle('Lista de las Horas Planetarias Para Un Día a Elección | Lista Con Información Sobre Todas Las Horas Planetarias De Un Día.');
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre información sobre las horas planetarias de un día a elección y el orden en que rigen.'
    });
    this.metaService.updateTag({ name: 'keywords', content: 'Horas Planetarias, Astrología, Lista de Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Lista con información de los planetas de un día a elección' });
    this.metaService.updateTag({ property: 'og:description', content: 'Lista con información sobre los planetas según la astrología y a qué horas rigen en una fecha.' });

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
