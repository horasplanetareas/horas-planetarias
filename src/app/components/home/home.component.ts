import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanetaService, Planeta } from '../../services/planeta/planeta.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  // =========================
  // VARIABLES DEL COMPONENTE
  // =========================
  isLoggedIn = false;// Estado de login: true si el usuario está logueado, false si no
  private authSub?: Subscription;// Guardaremos la suscripción para poder cancelarla luego
  diaActual: string = '';     // Nombre del día actual (Lunes, Martes, etc.)
  subDia: string = '';        // Nombre del subdía (según tu lógica en PlanetaService)
  planeta: Planeta | null = null; // Planeta correspondiente al subdía
  fechaActual: string = '';   // Fecha en formato dd/mm/yyyy
  horaActual: string = '';    // Hora actual en formato HH:MM

  constructor(
    private planetaService: PlanetaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private titleService: Title, 
    private metaService: Meta
  ) { }

  // =========================
  // CICLO DE VIDA
  // =========================
  async ngOnInit() {

    // 🔹 Cambiar el título de la pestaña (SEO Title)
    this.titleService.setTitle('Horas Planetarias Hoy | Planeta Regente');

    // 🔹 Cambiar la meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre qué planeta rige  y su influencia en astrología.'
    });

    // (Opcional) otras meta tags útiles
    this.metaService.updateTag({ name: 'keywords', content: 'planeta regente, astrología, hoy, Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Planeta Regente Hoy' });
    this.metaService.updateTag({ property: 'og:description', content: 'Acsiones recomendadas para el planeta regente de hoy segun astrologia.' });

    // Nos suscribimos al observable de AuthService para detectar cambios en el login
    // Esto nos permite reaccionar si el usuario inicia o cierra sesión
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Actualizamos el estado local
    });
    try {
      // 1️⃣ Obtener todas las horas planetarias del día (con contenido rico)
      const horas = await this.planetaService.obtenerHorasPlanetarias();

      if (horas.length > 0) {
        const ahora = new Date();

        // 2️⃣ Obtener nombre del día
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        this.diaActual = diasSemana[ahora.getDay()];

        // 3️⃣ Formatear fecha actual dd/mm/yyyy
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        this.fechaActual = `${dia}/${mes}/${anio}`;

        // 4️⃣ Formatear hora actual HH:MM
        this.horaActual = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

        // 5️⃣ Obtener subdía usando la lógica de tu PlanetaService
        this.subDia = this.planetaService.obtenerSubDia(ahora);
        const planetaNombre = this.planetaService.planetaInicioPorDia[this.subDia];

        // 6️⃣ Obtener planeta correspondiente al subdía
        const contenido = this.planetaService.obtenerContenidoPlaneta(planetaNombre);

        // Devolvemos el objeto completo listo para la vista de detalle
        this.planeta = {
          nombre: planetaNombre.toUpperCase(), // mantenemos tu formato actual
          tipo: 'Hora Planetaria',
          descripcion: contenido.descripcion,
          actividades: contenido.actividades,
          parrafoFinal: contenido.parrafoFinal,
        };
        // 7️⃣ Detectar cambios para actualizar la vista
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al obtener datos de horas planetarias:', error);
    }
  }
}
