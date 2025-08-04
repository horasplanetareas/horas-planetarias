import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AdsenseBannerComponent } from "../adsense-banner/adsense-banner";

@Component({
  selector: 'app-planeta-por-fecha',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsenseBannerComponent],
  templateUrl: './planeta-por-fecha.html',
  styleUrl: './planeta-por-fecha.scss',
})
export class PlanetaPorFecha implements OnInit {

  // Fecha seleccionada por el usuario en formato YYYY-MM-DD (usado por input tipo date)
  fechaSeleccionada: string = '';

  // Coordenadas por defecto (Montevideo)
  lat: number = -34.9011;
  lng: number = -56.1645;

  // Lista de planetas calculados para la fecha ingresada
  planetas: any[] = [];

  // Indica si los datos están siendo cargados (útil para mostrar spinners)
  cargando: boolean = false;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    const hoy = new Date();
    // Establece como valor inicial la fecha de hoy (formato compatible con <input type="date">)
    this.fechaSeleccionada = hoy.toISOString().split('T')[0];
  }
  // Función que se dispara cuando el usuario consulta por una fecha específica
  async consultar() {
    // Si no hay fecha seleccionada, no continúa
    if (!this.fechaSeleccionada) return;

    // Muestra que se está cargando
    this.cargando = true;
    this.planetas = [];

    try {
      // Convierte la fecha del input (string) a objeto Date
      const fecha = new Date(this.fechaSeleccionada);

      // Llama al servicio para obtener las horas planetarias de esa fecha
      this.planetas = await this.planetaService.obtenerHorasPorFecha(fecha);

    } catch (error) {
      // Manejo de error si no se puede obtener ubicación u ocurre otro problema
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización en tu dispositivo.');
      console.error('Error:', error);

    } finally {
      // Cuando termina (éxito o error), se desactiva el spinner
      this.cargando = false;
      console.log('cargando', this.cargando);
      // Se fuerza la actualización de la vista
      this.cdr.detectChanges();
    }
  }
}
