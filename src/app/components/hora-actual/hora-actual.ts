import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo/seo.service';

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
  isLoggedIn = false;
  private authSub?: Subscription;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private seo: SeoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.seo.updateMeta(
      'Horas Planetarias Hoy | Planeta Regente Hora Actual',
      'Descubre qué planeta rige en este momento del día y sus acciones recomendadas.'
    );

    this.authSub = this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);

    try {
      const planetas = await this.planetaService.obtenerHorasPlanetarias();
      const ahora = new Date();
      this.planetaActual = planetas.find(p => ahora >= p.inicioDate && ahora < p.finDate);

      if (!this.planetaActual) console.warn('No se encontró la hora planetaria actual.');
    } catch (error) {
      console.error('Error al obtener hora planetaria actual:', error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
