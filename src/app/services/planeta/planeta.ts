import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PlanetaService {
  getPlanetas() {
    return [
      { nombre: 'MERCURIO', tipo: 'Comunicación', descripcion: '...' },
      { nombre: 'VENUS', tipo: 'Armonización', descripcion: '...' },
      { nombre: 'SOL', tipo: 'Integración', descripcion: '...' },
      // etc.
    ];
  }
  constructor() { }
}
