import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetaService } from '../../services/planeta.service';
import { FormsModule } from '@angular/forms';
import { AdsenseBannerComponent } from "../adsense-banner/adsense-banner";

@Component({
  selector: 'app-planeta-por-fecha',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsenseBannerComponent],
  templateUrl: './planeta-por-fecha.html',
  styleUrl: './planeta-por-fecha.scss',
})
export class PlanetaPorFecha implements OnInit {
  fechaSeleccionada: string = '';
  lat: number = -34.9011; // Montevideo por defecto
  lng: number = -56.1645;
  planetas: any[] = [];
  cargando: boolean = false;

  constructor(
    private planetaService: PlanetaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().split('T')[0];
  }

  async consultar() {
  if (!this.fechaSeleccionada) return;

  this.cargando = true;
  this.planetas = [];

  try {
    const fecha = new Date(this.fechaSeleccionada);
    this.planetas = await this.planetaService.obtenerHorasPorFecha(fecha);
  } catch (error) {
    alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización en tu dispositivo.');
    console.error('Error:', error);
  } finally {
    this.cargando = false;
    this.cdr.detectChanges();
  }
}

}
