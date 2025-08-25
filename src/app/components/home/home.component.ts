import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanetaService} from '../../services/planeta/planeta.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth';
import { Title, Meta } from '@angular/platform-browser';
import { Planeta } from '../../models/planeta.model';

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
  isLoggedIn = false;               // Indica si el usuario está logueado
  private authSub?: Subscription;   // Suscripción al observable de login
  diaActual: string = '';           // Nombre del día actual
  subDia: string = '';              // Nombre del subdía
  planeta: Planeta | null = null;   // Objeto con info del planeta
  fechaActual: string = '';         // Fecha actual dd/mm/yyyy
  horaActual: string = '';          // Hora actual HH:MM

  constructor(
    private planetaService: PlanetaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef, // Para forzar la actualización de la vista
    private titleService: Title,    // SEO: título de pestaña
    private metaService: Meta       // SEO: meta tags
  ) { }

  // =========================
  // CICLO DE VIDA
  // =========================
  async ngOnInit() {

    // 🔹 Cambiar el título de la pestaña
    this.titleService.setTitle('Horas Planetarias Hoy | Planeta Regente');

    // 🔹 Cambiar meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre qué planeta rige y su influencia en astrología.'
    });

    // 🔹 Otras meta tags opcionales
    this.metaService.updateTag({ name: 'keywords', content: 'planeta regente, astrología, hoy, Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Planeta Regente Hoy' });
    this.metaService.updateTag({ property: 'og:description', content: 'Acciones recomendadas para el planeta regente de hoy según astrología.' });

    // 🔹 Suscribirse a cambios en el login
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Actualiza la variable local
    });

    try {
      // 1️⃣ Obtener todas las horas planetarias
      const horas = await this.planetaService.obtenerHorasPlanetarias();

      if (horas.length > 0) {
        const ahora = new Date();

        // 2️⃣ Obtener nombre del día
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        this.diaActual = diasSemana[ahora.getDay()];

        // 3️⃣ Formatear fecha actual
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        this.fechaActual = `${dia}/${mes}/${anio}`;

        // 4️⃣ Formatear hora actual
        this.horaActual = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

        // 5️⃣ Obtener subdía usando PlanetaService
        this.subDia = this.planetaService.obtenerSubDia(ahora);
        const planetaNombre = this.planetaService.planetaInicioPorDia[this.subDia];

        // 6️⃣ Obtener contenido completo del planeta
        const contenido = this.planetaService.obtenerContenidoPlaneta(planetaNombre);

        // Construir objeto planeta para la vista
        this.planeta = {
          nombre: planetaNombre.toUpperCase(),
          tipo: 'Hora Planetaria',
          descripcion: contenido.descripcion,
          actividades: contenido.actividades,
          parrafoFinal: contenido.parrafoFinal,
          horaInicio: "",
          horaFin: "",
          fecha: "",
          dia: true
        };

        // 7️⃣ Forzar actualización de la vista
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al obtener datos de horas planetarias:', error);
    }
  }
}
