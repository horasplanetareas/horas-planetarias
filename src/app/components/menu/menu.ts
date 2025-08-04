import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
//import { AuthService } from '../../services/auth/auth'; // Ajusta la ruta según tu proyecto

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MenuComponent {
  // Observable que indica si está logueado
  //isLoggedIn$: Observable<boolean>;
  isLoggedIn$ = false; // Cambia a true o false según tu lógica de autenticación

  constructor(/*private authService: AuthService*/) {
    // Nos suscribimos al estado de autenticación reactivo del AuthService
    //this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$ = false;
  }

  logout() {
    //this.authService.logout();
  }
}
