import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class HomeComponent {
  diaActual: string = '';
  subDia: string = '';
  fechaActual: string = '';
  horaActual: string = '';

  constructor() {
    const ahora = new Date();

    // Día de la semana real
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombreDia = diasSemana[ahora.getDay()];

    // Subdía personalizado
    const subdiasMap: { [key: string]: string } = {
      'Lunes': 'Miércoles',
      'Martes': 'Viernes',
      'Miércoles': 'Domingo',
      'Jueves': 'Jueves',
      'Viernes': 'Jueves',
      'Sábado': 'Sábado',
      'Domingo': 'Lunes',
    };

    const subDia = subdiasMap[nombreDia];

    // Fecha formato dd/mm/aaaa
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const fecha = `${dia}/${mes}/${anio}`;

    // Hora hh:mm
    const hora = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

    // Asignar a propiedades
    this.diaActual = nombreDia;
    this.subDia = subDia;
    this.fechaActual = fecha;
    this.horaActual = hora;
  }
}
