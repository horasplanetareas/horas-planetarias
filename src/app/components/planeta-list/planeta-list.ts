import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AdsenseBannerComponent } from '../adsense-banner/adsense-banner';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-planeta-list', 
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdsenseBannerComponent
  ],
  templateUrl: './planeta-list.html',
  styleUrl: './planeta-list.scss',
  host: { ngSkipHydration: '' }
})
export class PlanetaList implements OnInit {

  // Lista de horas planetarias a mostrar
  planetas: any[] = [];

  // Indicador de carga mientras se obtienen los datos
  loading = true;

  // Variable opcional para verificar si se está en localhost (no se está usando acá)
  isLocalhost: boolean = false;

  constructor(
    private planetaService: PlanetaService,          // Servicio que obtiene las horas planetarias
    private cdr: ChangeDetectorRef,                  
    private router: Router,
    private titleService: Title,
    private metaService: Meta,                          
    @Inject(PLATFORM_ID) private platformId: Object  
  ) {}

  // Función que se ejecuta al hacer clic en un planeta: redirige al detalle, pasando datos por el estado de navegación
  verDetalle(planeta: any) {
    this.router.navigate(['/detalle-hora'], { state: { planeta } });
  }

  // Método que se ejecuta automáticamente al iniciar el componente
  async ngOnInit() {
    
    // 🔹 Cambiar el título de la pestaña (SEO Title)
    this.titleService.setTitle('lista de las Horas Planetarias | lista con informacon sobre todas las hora planetarias de hoy.');

    // 🔹 Cambiar la meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre informaciion sobre las horas planetarias del dia de hoy.'
    });

    // (Opcional) otras meta tags útiles
    this.metaService.updateTag({ name: 'keywords', content: 'lista de horas planetarias, astrología, hoy, Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'lista con informacion De los Planetas' });
    this.metaService.updateTag({ property: 'og:description', content: 'lista con informcion sobre los planeta segun astrologia y a que horas rigen el dia de hoy.' });

    try {
      // Intenta obtener la lista de horas planetarias desde el servicio
      this.planetas = await this.planetaService.obtenerHorasPlanetarias();
      console.log('Planetas cargados:', this.planetas);

    } catch (error) {
      // Si ocurre un error (por ejemplo, no se obtiene la ubicación), muestra un mensaje
      console.error('Error cargando planetas:', error);
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización.');

    } finally {
      // Una vez que termina, sea con éxito o error, desactiva el estado de carga
      this.loading = false;
      // Fuerza a Angular a detectar cambios en la vista
      this.cdr.detectChanges();

      console.log('loading desactivado');
    }
  }
}
