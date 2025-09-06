import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo/seo.service';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-planeta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planeta-detalle.html',
  styleUrls: ['./planeta-detalle.scss']
})
export class PlanetaDetalleComponent implements OnInit, OnDestroy {

  planeta: Planeta = {
    nombre: '',
    tipo: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
    actividades: [],
    parrafoFinal: '',
    fecha: '',
    dia: false,
    inicioDate: undefined,
    finDate: undefined
  };

  isLoggedIn = false;
  private authSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private seo: SeoService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['planeta']) {
      this.planeta = { ...this.planeta, ...nav.extras.state['planeta'] };
    }
  }

  ngOnInit() {
    // Usamos SeoService para actualizar metatags con imagen global
    this.seo.updateMeta(
      `Detalle: ${this.planeta.nombre} | Horas Planetarias`,
      `Información sobre la hora planetaria del planeta ${this.planeta.nombre}`,
      undefined, // deja que SeoService use defaultImage
      undefined
    );

    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}
