import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlanetaService {
  private readonly ordenPlanetario = ['Marte', 'Júpiter', 'Saturno', 'Luna', 'Mercurio', 'Venus', 'Sol'];

  private readonly planetaInicioPorDia: Record<string, string> = {
    'Lunes': 'Luna',
    'Martes': 'Marte',
    'Miércoles': 'Mercurio',
    'Jueves': 'Júpiter',
    'Viernes': 'Venus',
    'Sábado': 'Saturno',
    'Domingo': 'Sol'
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async obtenerHorasPlanetarias(): Promise<any[]> {
    const coords = await this.getUbicacion();
    const ahora = new Date();
    const hoySol = await this.getSolData(coords.lat, coords.lng, ahora);

    const amanecer = new Date(hoySol.sunrise);
    const usarFecha = ahora < amanecer ? new Date(ahora.setDate(ahora.getDate() - 1)) : ahora;

    const solDataHoy = await this.getSolData(coords.lat, coords.lng, usarFecha);
    const solDataManiana = await this.getSolData(coords.lat, coords.lng, new Date(usarFecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(usarFecha);
    const horasDia = this.generarHorasPlanetarias(new Date(solDataHoy.sunrise), new Date(solDataHoy.sunset), subDia);
    const horasNoche = this.generarHorasPlanetarias(new Date(solDataHoy.sunset), new Date(solDataManiana.sunrise), subDia);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  async obtenerHorasPorFecha(fecha: Date): Promise<any[]> {
    const coords = await this.getUbicacion();
    const solHoy = await this.getSolData(coords.lat, coords.lng, fecha);
    const solManiana = await this.getSolData(coords.lat, coords.lng, new Date(fecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(fecha);
    const horasDia = this.generarHorasPlanetarias(new Date(solHoy.sunrise), new Date(solHoy.sunset), subDia);
    const horasNoche = this.generarHorasPlanetarias(new Date(solHoy.sunset), new Date(solManiana.sunrise), subDia);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  public async getUbicacion(): Promise<{ lat: number; lng: number }> {
    if (!isPlatformBrowser(this.platformId)) {
      return { lat: -34.9011, lng: -56.1645 };
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject('Ubicación no permitida')
      );
    });
  }

  public  async getSolData(lat: number, lng: number, fecha: Date): Promise<{ sunrise: string; sunset: string }> {
    const dateStr = fecha.toISOString().split('T')[0];

    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    return {
      sunrise: res.results.sunrise,
      sunset: res.results.sunset
    };
  }

  private obtenerSubDia(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaNombre = dias[fecha.getDay()];

    const mapa: Record<string, string> = {
      'Lunes': 'Miércoles',
      'Martes': 'Viernes',
      'Miércoles': 'Domingo',
      'Jueves': 'Martes',
      'Viernes': 'Jueves',
      'Sábado': 'Sábado',
      'Domingo': 'Lunes'
    };

    return mapa[diaNombre];
  }

  private generarHorasPlanetarias(inicio: Date, fin: Date, subDia: string): any[] {
    const duracionHora = (fin.getTime() - inicio.getTime()) / 12;
    const planetaInicial = this.planetaInicioPorDia[subDia];
    const indiceInicial = this.ordenPlanetario.indexOf(planetaInicial);

    return Array.from({ length: 12 }, (_, i) => {
      const horaInicio = new Date(inicio.getTime() + i * duracionHora);
      const horaFin = new Date(inicio.getTime() + (i + 1) * duracionHora);
      const planeta = this.ordenPlanetario[(indiceInicial + i) % 7];

      return {
        nombre: planeta.toUpperCase(),
        tipo: 'Hora Planetaria',
        horaInicio: horaInicio.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
        horaFin: horaFin.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
        inicioDate: horaInicio,
        finDate: horaFin,
        descripcion: this.obtenerDescripcion(planeta),
        fecha: horaInicio.toLocaleDateString('es-UY')
      };
    });
  }

  private obtenerDescripcion(planeta: string): string {
    const descripciones: Record<string, string> = {
      'Luna': 'Emociones, intuición, lo femenino.',
      'Marte': 'Energía, acción, impulso.',
      'Mercurio': 'Comunicación, mente, lógica.',
      'Júpiter': 'Expansión, sabiduría, crecimiento.',
      'Venus': 'Amor, belleza, placer.',
      'Saturno': 'Disciplina, responsabilidad, límites.',
      'Sol': 'Identidad, voluntad, vitalidad.'
    };
    return descripciones[planeta] || '';
  }

  private anuncio(): any {
    return {
      nombre: 'ANUNCIO',
      tipo: 'Ad',
      esAnuncio: true
    };
  }
}