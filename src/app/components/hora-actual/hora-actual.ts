import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetaService } from '../../services/planeta.service';

@Component({
  selector: 'app-hora-actual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hora-actual.html',
  styleUrls: ['./hora-actual.scss']
})
export class HoraActualComponent implements OnInit {
  planetaActual: any = null;
  cargando = true;

  constructor(private planetaService: PlanetaService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const planetas = await this.planetaService.obtenerHorasPlanetarias();
      const ahora = new Date();

      // Hora actual en UTC timestamp
      const ahoraUTC = Date.UTC(
        ahora.getUTCFullYear(),
        ahora.getUTCMonth(),
        ahora.getUTCDate(),
        ahora.getUTCHours(),
        ahora.getUTCMinutes(),
        ahora.getUTCSeconds()
      );

      this.planetaActual = planetas.find(p => {
        const inicio = p.inicioDate.getTime();
        let fin = p.finDate.getTime();

        // Ajustar fin si menor que inicio (caso tramo noche que pasa a otro día)
        if (fin < inicio) fin += 24 * 60 * 60 * 1000;

        return ahoraUTC >= inicio && ahoraUTC < fin;
      });

      if (!this.planetaActual) {
        console.log('No se encontró la hora planetaria actual.');
      } else {
        console.log('Hora planetaria actual:', this.planetaActual.nombre);
      }
    } catch (e) {
      console.error('Error cargando hora actual:', e);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
