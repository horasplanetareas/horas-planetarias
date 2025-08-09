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
  ) { }

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    const hoy = new Date();
    // Establece como valor inicial la fecha de hoy (formato compatible con <input type="date">)
    this.fechaSeleccionada = hoy.toISOString().split('T')[0];
  }
  // Función que se dispara cuando el usuario consulta por una fecha específica
  async consultar() {
    // Si no hay fecha seleccionada, no continuar
    if (!this.fechaSeleccionada) return;

    // Indicar que está cargando datos y limpiar resultados anteriores
    this.cargando = true;
    this.planetas = [];

    try {
      /* La fecha seleccionada viene como string "YYYY-MM-DD"
      Si creamos un Date directamente con ese string, JS lo interpreta en UTC a la medianoche,
      lo que puede generar que la fecha local sea el día anterior (por desfase horario).
      Para evitarlo, creamos el objeto Date con hora fija a mediodía local (12:00),
      así no habrá desfase que cause tomar el día anterior o siguiente.*/
      const parts = this.fechaSeleccionada.split('-'); // ["YYYY", "MM", "DD"]
      const fecha = new Date(
        +parts[0],       // Año (número)
        +parts[1] - 1,   // Mes (0-based, por eso -1)
        +parts[2],       // Día
        12, 0, 0         // Hora 12:00:00 local para evitar desfase UTC
      );

      // Llamar al servicio para obtener horas planetarias para la fecha corregida
      this.planetas = await this.planetaService.obtenerHorasPorFecha(fecha);

    } catch (error) {
      // Mostrar alerta si hubo un error, por ejemplo con geolocalización
      alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización en tu dispositivo.');
      console.error('Error:', error);

    } finally {
      // Termina la carga, actualizar la vista
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
