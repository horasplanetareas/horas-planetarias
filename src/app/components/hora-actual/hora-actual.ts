import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetaService } from '../../services/planeta/planeta.service';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo/seo.service';
import { HomeComponent } from "../home/home.component";
import { AdsterraComponent } from "../adsense-banner/adsense-banner";

@Component({
  selector: 'app-hora-actual',
  standalone: true,
  imports: [CommonModule, HomeComponent, AdsterraComponent],
  templateUrl: './hora-actual.html',
  styleUrls: ['./hora-actual.scss']
})
export class HoraActualComponent implements OnInit {
  planetaActual: any = null; // Guarda el planeta que rige en este momento
  cargando = true; // Controla el spinner/mensaje de carga
  isLoggedIn = false; // Saber si el usuario está logueado
  private authSub?: Subscription; // Suscripción al estado de login

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private seo: SeoService
  ) { }

  // ==============================
  // PEDIR PERMISO DE NOTIFICACIÓN
  // ==============================
  async solicitarPermisoNotificacion() {
    // Verifica si el navegador soporta notificaciones
    if ("Notification" in window) {
      // Pide permiso al usuario (puede devolver: "granted", "denied" o "default")
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        console.warn("El usuario no aceptó las notificaciones.");
      }
    }
  }

  // ==============================
  // MOSTRAR NOTIFICACIÓN
  // ==============================
  mostrarNotificacion(mensaje: string) {
    // Si el navegador soporta notificaciones y el usuario dio permiso
    if ("Notification" in window && Notification.permission === "granted") {
      // Crea una notificación del sistema (como WhatsApp Web)
      new Notification("Hora Planetaria", { body: mensaje });
    } else {
      // Si no hay permisos, usar un alert como fallback
      alert(mensaje);
    }
  }

  // ==============================
  // PROGRAMAR NOTIFICACIÓN CUANDO CAMBIE LA HORA
  // ==============================
  programarNotificacionCambio() {
    if (!this.planetaActual) return; // Si no hay planeta actual, no hacer nada

    const ahora = new Date();
    // Calcula cuántos milisegundos faltan hasta que termine la hora planetaria actual
    const msHastaCambio = this.planetaActual.finDate.getTime() - ahora.getTime();

    if (msHastaCambio > 0) {
      // Usa setTimeout para ejecutar justo al terminar la hora actual
      setTimeout(() => {
        // Muestra la notificación con el planeta que regía (el que terminó)
        this.mostrarNotificacion(`Ahora rige ${this.planetaActual.nombre}`);

        // Recarga el componente para obtener el nuevo planeta actual
        this.ngOnInit();
      }, msHastaCambio);
    }
  }

  // ==============================
  // NGONINIT: CARGA INICIAL
  // ==============================
  async ngOnInit(): Promise<void> {
    // Configura título y descripción para SEO
    this.seo.updateMeta(
      'Horas Planetarias Hoy | Planeta Regente Hora Actual',
      'Descubre qué planeta rige en este momento del día y sus acciones recomendadas.'
    );

    // Pide permisos para notificaciones (se hará la primera vez que entres)
    await this.solicitarPermisoNotificacion();

    // Suscribirse al estado de login
    this.authSub = this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);

    try {
      // Trae todas las horas planetarias del servicio
      const planetas = await this.planetaService.obtenerHorasPlanetarias();

      // Obtiene la hora actual del sistema
      const ahora = new Date();

      // Busca la hora planetaria que corresponde a "ahora"
      this.planetaActual = planetas.find(
        p => ahora >= p.inicioDate && ahora < p.finDate
      );

      if (this.planetaActual) {
        // Si encontró planeta actual → programa notificación para el cambio
        this.programarNotificacionCambio();
      } else {
        // Si no encuentra, avisa en consola
        console.warn('No se encontró la hora planetaria actual.');
      }
    } catch (error) {
      console.error('Error al obtener hora planetaria actual:', error);
    } finally {
      // Saca el "Cargando..." y actualiza vista
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}
