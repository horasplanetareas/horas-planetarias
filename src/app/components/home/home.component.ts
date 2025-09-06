import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo/seo.service';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  private authSub?: Subscription;
  diaActual = '';
  subDia = '';
  planeta: Planeta | null = null;
  fechaActual = '';
  horaActual = '';

  constructor(
    private planetaService: PlanetaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private seo: SeoService
  ) { }

  async ngOnInit() {
    this.seo.updateMeta(
      'Horas Planetarias Hoy | Planeta Regente',
      'Descubre qué planeta rige y sus acciones recomendadas hoy.'
    );

    this.authSub = this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);

    try {
      const horas = await this.planetaService.obtenerHorasPlanetarias();
      if (horas.length > 0) {
        const ahora = new Date();
        const diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        this.diaActual = diasSemana[ahora.getDay()];
        const dia = String(ahora.getDate()).padStart(2,'0');
        const mes = String(ahora.getMonth()+1).padStart(2,'0');
        const anio = ahora.getFullYear();
        this.fechaActual = `${dia}/${mes}/${anio}`;
        this.horaActual = ahora.toLocaleTimeString('es-UY',{hour:'2-digit',minute:'2-digit'});
        this.subDia = this.planetaService.obtenerSubDia(ahora);
        const planetaNombre = this.planetaService.planetaInicioPorDia[this.subDia];
        const contenido = this.planetaService.obtenerContenidoPlaneta(planetaNombre);

        this.planeta = {
          nombre: planetaNombre.toUpperCase(),
          tipo: 'Hora Planetaria',
          descripcion: contenido.descripcion,
          actividades: contenido.actividades,
          parrafoFinal: contenido.parrafoFinal,
          horaInicio: "",
          horaFin: "",
          fecha: "",
          dia: true
        };
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al obtener datos de horas planetarias:', error);
    }
  }
}
