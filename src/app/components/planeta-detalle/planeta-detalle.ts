import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-planeta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planeta-detalle.html',
  styleUrls: ['./planeta-detalle.scss']
})
export class PlanetaDetalleComponent implements OnInit, OnDestroy {

  // 🔹 Planeta siempre inicializado
  planeta: Planeta = {
    nombre: '',
    tipo: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
    actividades: [],   // 👈 siempre array
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
    private titleService: Title,
    private metaService: Meta
  ) {
    const nav = this.router.getCurrentNavigation();

    // Sobreescribimos el planeta vacío con lo que venga de navegación (si hay)
    if (nav?.extras.state?.['planeta']) {
      this.planeta = { 
        ...this.planeta,        // 👈 mantiene valores vacíos por defecto
        ...nav.extras.state['planeta'] 
      };
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Detalle De La Hora Planetarias | información sobre una hora planetaria específica');
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre información profunda sobre la influencia de un planeta según la astrología.'
    });

    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}
