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

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const planetas = await this.planetaService.obtenerHorasPlanetarias();
      const ahora = new Date();

      this.planetaActual = planetas.find(p =>
        ahora >= p.inicioDate && ahora < p.finDate
      );

      if (!this.planetaActual) {
        console.warn('No se encontró la hora planetaria actual.');
      }
    } catch (error) {
      console.error('Error al obtener hora planetaria actual:', error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}