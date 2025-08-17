import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hora-actual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hora-actual.html',
  styleUrls: ['./hora-actual.scss']
})
export class HoraActualComponent implements OnInit {
  // Variable que almacenará el planeta correspondiente a la hora actual
  planetaActual: any = null;

  // Indicador de carga para mostrar estado visual mientras se obtienen los datos
  cargando = true;

  // Estado de login: true si el usuario está logueado, false si no
  isLoggedIn = false;

  // Guardaremos la suscripción para poder cancelarla luego
  private authSub?: Subscription;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private titleService: Title,
    private metaService: Meta
  ) { }


  // Método que se ejecuta automáticamente al iniciar el componente
  async ngOnInit(): Promise<void> {

    // 🔹 Cambiar el título de la pestaña (SEO Title)
    this.titleService.setTitle('Horas Planetarias Hoy | Planeta Regente Hora Actial');

    // 🔹 Cambiar la meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre qué planeta rige en este momento del dia  y su influencia en astrología.'
    });

    // (Opcional) otras meta tags útiles
    this.metaService.updateTag({ name: 'keywords', content: 'planeta regente, astrología, hoy, Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Planeta Regente en esta hora planetaria' });
    this.metaService.updateTag({ property: 'og:description', content: 'Acsiones recomendadas para el planeta regente actual segun astrologia.' });

    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Actualizamos el estado local
    });
    try {
      // Obtener la lista de horas planetarias desde el servicio
      const planetas = await this.planetaService.obtenerHorasPlanetarias();
      const ahora = new Date(); // Obtener la hora actual

      // Buscar entre todas las horas planetarias cuál corresponde al momento actual
      this.planetaActual = planetas.find(p =>
        ahora >= p.inicioDate && ahora < p.finDate
      );

      // Si no se encuentra una hora planetaria activa, lo indica en consola
      if (!this.planetaActual) {
        console.warn('No se encontró la hora planetaria actual.');
      }

    } catch (error) {
      // Si ocurre un error en la obtención o cálculo, se muestra en consola
      console.error('Error al obtener hora planetaria actual:', error);

    } finally {
      // Se desactiva el estado de carga y se actualiza la vista
      this.cargando = false;
      console.log('cargando = false');//muestar cuando el cargado finaliza
      this.cdr.detectChanges();  // Esto asegura que Angular actualice la vista con los nuevos datos
    }
  }
}
