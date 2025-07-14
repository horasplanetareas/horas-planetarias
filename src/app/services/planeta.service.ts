import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlanetaService {
  private ordenPlanetario = ['Saturno', 'Júpiter', 'Marte', 'Sol', 'Venus', 'Mercurio', 'Luna'];

  private planetaInicioPorDia: { [key: string]: string } = {
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

  // Obtener datos solares de hoy y mañana
  const solHoy = await this.getSolData(coords.lat, coords.lng, ahora);

  const amanecerHoy = new Date(solHoy.sunrise);
  const anochecerHoy = new Date(solHoy.sunset);

  // Si la hora actual es antes del amanecer, usar día anterior para el cálculo
  let fechaParaCalculo = new Date(ahora);
  if (ahora < amanecerHoy) {
    fechaParaCalculo.setDate(fechaParaCalculo.getDate() - 1);
  }

  // Obtener datos solares para la fecha usada en cálculo y la siguiente para la noche
  const solCalculo = await this.getSolData(coords.lat, coords.lng, fechaParaCalculo);
  const fechaSiguiente = new Date(fechaParaCalculo);
  fechaSiguiente.setDate(fechaParaCalculo.getDate() + 1);
  const solSiguiente = await this.getSolData(coords.lat, coords.lng, fechaSiguiente);

  const subDia = this.obtenerSubDia(fechaParaCalculo);

  const horasDia = this.generarHorasPlanetarias(new Date(solCalculo.sunrise), new Date(solCalculo.sunset), subDia);
  const horasNoche = this.generarHorasPlanetarias(new Date(solCalculo.sunset), new Date(solSiguiente.sunrise), subDia);

  const anuncio = {
    nombre: 'ANUNCIO',
    tipo: 'Ad',
    esAnuncio: true
  };

  return [...horasDia, anuncio, ...horasNoche];
}


  async getUbicacion(): Promise<{ lat: number; lng: number }> {
  if (!isPlatformBrowser(this.platformId)) {
    // Valor por defecto si está en SSR
    return { lat: -34.9011, lng: -56.1645 }; // Montevideo, por ejemplo
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject('Ubicación no permitida')
    );
  });
  }

  private async getSolData(lat: number, lng: number, fecha: Date): Promise<{ sunrise: string; sunset: string }> {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    return {
      sunrise: res.results.sunrise,
      sunset: res.results.sunset
    };
  }

  private obtenerSubDia(fecha: Date): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia = diasSemana[fecha.getDay()];
    const mapa: { [key: string]: string } = {
      'Lunes': 'Miércoles',
      'Martes': 'Viernes',
      'Miércoles': 'Domingo',
      'Jueves': 'Jueves',
      'Viernes': 'Jueves',
      'Sábado': 'Sábado',
      'Domingo': 'Lunes'
    };
    return mapa[dia];
  }

  private generarHorasPlanetarias(inicio: Date, fin: Date, subDia: string): any[] {
  const duracionMs = fin.getTime() - inicio.getTime();
  const duracionHora = duracionMs / 12;

  const planetaInicial = this.planetaInicioPorDia[subDia];
  const indiceInicial = this.ordenPlanetario.indexOf(planetaInicial);

  const lista: any[] = [];

  for (let i = 0; i < 12; i++) {
    const horaInicio = new Date(inicio.getTime() + i * duracionHora);
    const horaFin = new Date(inicio.getTime() + (i + 1) * duracionHora);

    const planeta = this.ordenPlanetario[(indiceInicial + i) % 7];

    lista.push({
      nombre: planeta.toUpperCase(),
      tipo: 'Hora Planetaria',
      horaInicio: horaInicio.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
      horaFin: horaFin.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
      inicioDate: horaInicio, // ya es UTC
      finDate: horaFin,       // ya es UTC
      descripcion: this.obtenerDescripcion(planeta),
      fecha: horaInicio.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });
  }

  return lista;
  }

  private obtenerDescripcion(planeta: string): string {
    const descripciones: { [key: string]: string } = {
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

  async getAmanecer(lat: number, lng: number, fecha: Date): Promise<string> {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    return res.results.sunrise;
  }
}

