import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanetaService } from '../../services/planeta.service';

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
    const ahora = new Date();
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    try {
      const coords = await this.planetaService.getUbicacion();
      const amanecerStr = await this.planetaService.getAmanecer(coords.lat, coords.lng, ahora);
      const amanecer = new Date(amanecerStr);

      let fechaParaSubDia = ahora;
      if (ahora < amanecer) {
        fechaParaSubDia = new Date(ahora);
        fechaParaSubDia.setDate(ahora.getDate() - 1);
      }

      const nombreDiaReal = diasSemana[ahora.getDay()];
      const dia = String(ahora.getDate()).padStart(2, '0');
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const anio = ahora.getFullYear();
      const fecha = `${dia}/${mes}/${anio}`;
      const hora = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

      const subdiasMap: { [key: string]: string } = {
        'Lunes': 'Miércoles',
        'Martes': 'Viernes',
        'Miércoles': 'Domingo',
        'Jueves': 'Jueves',
        'Viernes': 'Jueves',
        'Sábado': 'Sábado',
        'Domingo': 'Lunes',
      };
      const subDia = subdiasMap[diasSemana[fechaParaSubDia.getDay()]];

      // ✅ Ahora sí actualizamos el estado
      this.diaActual = nombreDiaReal;
      this.subDia = subDia;
      this.fechaActual = fecha;
      this.horaActual = hora;

      // ✅ Forzamos la detección de cambios
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error al obtener datos de ubicación o amanecer:', error);
    }
  }
}
