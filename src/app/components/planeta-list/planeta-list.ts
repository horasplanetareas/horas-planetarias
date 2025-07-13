import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlanetaService } from '../../services/planeta.service';


@Component({
  selector: 'app-planeta-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planeta-list.html',
  styleUrl: './planeta-list.scss',
  host: { ngSkipHydration: '' }
  
})
export class PlanetaList implements OnInit {
  planetas: any[] = [];
  loading = true;

constructor(private planetaService: PlanetaService , private cdr: ChangeDetectorRef, private router: Router) {}

verDetalle(planeta: any) {
  this.router.navigate(['/detalle-hora'], { state: { planeta } });
}

async ngOnInit() {
  try {
    this.planetas = await this.planetaService.obtenerHorasPlanetarias();
    console.log('Planetas cargados:', this.planetas);
  } catch (error) {
    console.error('Error cargando planetas:', error);
    alert('No se pudo obtener la ubicación. Por favor, habilitá la geolocalización.');
  } finally {
    this.loading = false;
    this.cdr.detectChanges();  // <- FORZAR ACTUALIZACION DE VISTA
    console.log('loading desactivado');
  }
}
}
