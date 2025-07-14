import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

    // Obtener hora local actual (sin transformación)
    const ahora = new Date();
    //console.log('Hora local actual:', ahora.toString());

    const planetasValidos = planetas.filter(p => p.inicioDate && p.finDate);
    this.planetaActual = planetasValidos.find(p => {
      //console.log(`Verificando ${p.nombre}: inicio ${p.inicioDate}, fin ${p.finDate}`);
      //console.log(`Hora actual: ${ahora.toString()}`);

      // Comparación directa, todas en hora local
      return ahora >= p.inicioDate && ahora < p.finDate;
    });

    if (!this.planetaActual) {
      console.warn('No se encontró la hora planetaria actual.');
    } else {
      console.log('Hora planetaria actual encontrada:', this.planetaActual.nombre);
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    this.cargando = false;
    this.cdr.detectChanges();
  }
}

}
