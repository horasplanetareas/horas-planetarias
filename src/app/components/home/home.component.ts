import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanetaService } from '../../services/planeta/planeta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  diaActual: string = '';
  subDia: string = '';
  fechaActual: string = '';
  horaActual: string = '';

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      // Obtenemos las horas planetarias de hoy (ya calcula todo internamente)
      const horas = await this.planetaService.obtenerHorasPlanetarias();

      if (horas.length > 0) {
        const ahora = new Date();
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        const nombreDiaReal = diasSemana[ahora.getDay()];
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        const fecha = `${dia}/${mes}/${anio}`;
        const hora = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

        // Usamos el primer bloque de horas para extraer el subdía
        const subDia = horas[0].nombre ? horas[0].nombre : '';

        this.diaActual = nombreDiaReal;
        this.subDia = this.planetaService['obtenerSubDia'](ahora); // Si quieres mantener subdía real
        this.fechaActual = fecha;
        this.horaActual = hora;

        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al obtener datos de horas planetarias:', error);
    }
  }
}
