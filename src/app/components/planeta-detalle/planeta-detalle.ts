import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planeta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planeta-detalle.html',
  styleUrls: ['./planeta-detalle.scss']
})
export class PlanetaDetalleComponent implements OnDestroy {

  // Guarda la información del planeta que viene desde la navegación
  planeta: any = null;

  // Estado de login: true si el usuario está logueado, false si no
  isLoggedIn = false;

  // Guardaremos la suscripción para poder cancelarla luego
  private authSub?: Subscription;

  // Inyectamos Router para recibir datos pasados por navegación
  // e inyectamos AuthService para saber si el usuario está logueado
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Intentamos recuperar el estado enviado al navegar a este componente
    const nav = this.router.getCurrentNavigation();

    // Si existe, lo guardamos en la variable planeta, sino dejamos un objeto vacío
    this.planeta = nav?.extras.state?.['planeta'] ?? {};
  }

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit() {
    // Nos suscribimos al observable de AuthService para detectar cambios en el login
    // Esto nos permite reaccionar si el usuario inicia o cierra sesión
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Actualizamos el estado local
    });
  }

  // Método que se ejecuta cuando el componente se destruye
  ngOnDestroy() {
    // Cancelamos la suscripción para evitar fugas de memoria
    this.authSub?.unsubscribe();
  }
}
