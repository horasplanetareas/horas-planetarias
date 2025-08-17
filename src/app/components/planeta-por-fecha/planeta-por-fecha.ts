// Importaciones necesarias para el componente
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AdsenseBannerComponent } from "../adsense-banner/adsense-banner";
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

// Declaración del componente Angular
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

  // Fecha seleccionada por el usuario (formato YYYY-MM-DD)
  fechaSeleccionada: string = '';

  // Lista de planetas calculados para esa fecha
  planetas: any[] = [];

  // Indicador de carga para mostrar spinner o mensaje
  cargando: boolean = false;

  // Constructor con inyecciones de dependencias
  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  // Método que se ejecuta al hacer clic en una tarjeta de planeta
  // Navega a la ruta '/detalle-hora' pasando el planeta como estado
  verDetalle(planeta: any) {
    this.router.navigate(['/detalle-hora'], { state: { planeta } });
  }

  // Método que se ejecuta automáticamente al iniciar el componente
  ngOnInit(): void {
     
    // 🔹 Cambiar el título de la pestaña (SEO Title)
    this.titleService.setTitle('lista de las Horas Planetarias Para Un Dia A Elecsion | Lista Con Informacon Sobre Todas Las Hora Planetarias De Un Dia A Elecsion.');

    // 🔹 Cambiar la meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre Informaciion Sobre Las Horas Planetarias Del Un Dia A Elecsion Y El Horden En El Que Rigen.'
    });

    // (Opcional) otras meta tags útiles
    this.metaService.updateTag({ name: 'keywords', content: 'Lista De Horas Planetarias, Astrología, Horas Planetarias' });
    this.metaService.updateTag({ property: 'og:title', content: 'Lista Con Onformacion De los Planetas De Un Dia A Elecsion' });
    this.metaService.updateTag({ property: 'og:description', content: 'Lista Con Informcion Sobre Los Planeta Segun Astrologia Y A Que Horas Rigen En Una Fecha.' });

    // Intenta recuperar la última fecha consultada desde localStorage
    const fechaGuardada = localStorage.getItem('ultimaFechaConsultada');

    // Si hay una fecha guardada, intenta recuperar también los planetas de esa fecha
    const planetasGuardados = fechaGuardada
      ? localStorage.getItem('planetas_' + fechaGuardada)
      : null;

    // Si ambos existen, se cargan automáticamente en el componente
    if (fechaGuardada && planetasGuardados) {
      this.fechaSeleccionada = fechaGuardada;
      this.planetas = JSON.parse(planetasGuardados);
    }
  }

  // Método que se ejecuta cuando el usuario presiona "Consultar"
  async consultar() {
    // Si no hay fecha seleccionada, no hace nada
    if (!this.fechaSeleccionada) return;

    // Verifica si ya hay resultados guardados para esa fecha
    const cache = localStorage.getItem('planetas_' + this.fechaSeleccionada);
    if (cache) {
      // Si existe el cache, lo carga directamente sin recalcular
      this.planetas = JSON.parse(cache);
      // Actualiza la última fecha consultada
      localStorage.setItem('ultimaFechaConsultada', this.fechaSeleccionada);
      return;
    }

    // Si no hay cache, comienza la carga
    this.cargando = true;
    this.planetas = [];

    try {
      // Convierte la fecha seleccionada en un objeto Date con hora fija (12:00)
      // Esto evita problemas de desfase horario al calcular las horas planetarias
      const parts = this.fechaSeleccionada.split('-');
      const fecha = new Date(+parts[0], +parts[1] - 1, +parts[2], 12, 0, 0);

      // Llama al servicio para obtener las horas planetarias para esa fecha
      const resultado = await this.planetaService.obtenerHorasPorFecha(fecha);
      this.planetas = resultado;

      // Guarda los resultados y la fecha en localStorage
      localStorage.setItem('ultimaFechaConsultada', this.fechaSeleccionada);
      localStorage.setItem('planetas_' + this.fechaSeleccionada, JSON.stringify(resultado));

    } catch (error) {
      // Si ocurre un error (por ejemplo, no se obtiene la ubicación), muestra una alerta
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización.');
      console.error('Error:', error);

    } finally {
      // Finaliza la carga y actualiza la vista
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}