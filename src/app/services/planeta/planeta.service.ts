import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlanetaService {
  // Orden tradicional de los planetas según la astrología clásica
  private readonly ordenPlanetario = ['Marte', 'Júpiter', 'Saturno', 'Luna', 'Mercurio', 'Venus', 'Sol'];

  // Día de la semana → Planeta que inicia ese subdía
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
  ) { }

  // Devuelve las 24 horas planetarias del día actual según la ubicación
  async obtenerHorasPlanetarias(): Promise<any[]> {
    const coords = await this.getUbicacion();         // Ubicación actual (lat/lng)
    const ahora = new Date();                         // Fecha y hora actual

    const hoySol = await this.getSolData(coords.lat, coords.lng, ahora); // Datos solares para hoy

    const amanecer = new Date(hoySol.sunrise);

    // Si aún no amaneció, se usa el día anterior como subdía
    const usarFecha = ahora < amanecer ? new Date(ahora.setDate(ahora.getDate() - 1)) : ahora;

    // Datos solares de hoy y mañana
    const solDataHoy = await this.getSolData(coords.lat, coords.lng, usarFecha);
    const solDataManiana = await this.getSolData(coords.lat, coords.lng, new Date(usarFecha.getTime() + 86400000));

    // Subdía correspondiente
    const subDia = this.obtenerSubDia(usarFecha);

    // Calcula 12 horas planetarias para el día (entre amanecer y anochecer)
    const horasDia = this.generarHorasPlanetarias(new Date(solDataHoy.sunrise), new Date(solDataHoy.sunset), subDia, true);

    // Calcula 12 horas planetarias para la noche (entre anochecer de hoy y amanecer de mañana)
    const horasNoche = this.generarHorasPlanetarias(new Date(solDataHoy.sunset), new Date(solDataManiana.sunrise), subDia, false);

    // Devuelve las horas planetarias del día y la noche con un anuncio entre medio
    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  // Similar al anterior pero permite elegir una fecha concreta
  async obtenerHorasPorFecha(fecha: Date): Promise<any[]> {
    const coords = await this.getUbicacion();
    const solHoy = await this.getSolData(coords.lat, coords.lng, fecha);
    const solManiana = await this.getSolData(coords.lat, coords.lng, new Date(fecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(fecha);
    const horasDia = this.generarHorasPlanetarias(new Date(solHoy.sunrise), new Date(solHoy.sunset), subDia, true);
    const horasNoche = this.generarHorasPlanetarias(new Date(solHoy.sunset), new Date(solManiana.sunrise), subDia, false);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  // Devuelve la ubicación actual del usuario (latitud y longitud)
  public async getUbicacion(): Promise<{ lat: number; lng: number }> {
    if (!isPlatformBrowser(this.platformId)) {
      // Si se ejecuta del lado del servidor, retorna coordenadas por defecto (Montevideo)
      return { lat: -34.9011, lng: -56.1645 };
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject('Ubicación no permitida')
      );
    });
  }

  // Llama a la API de sunrise-sunset.org para obtener amanecer y anochecer de una fecha y lugar
  public async getSolData(lat: number, lng: number, fecha: Date): Promise<{ sunrise: string; sunset: string }> {
    const dateStr = fecha.toISOString().split('T')[0];

    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    return {
      sunrise: res.results.sunrise,
      sunset: res.results.sunset
    };
  }

  // A partir de una fecha devuelve qué subdía corresponde
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

  // Genera un array de 12 objetos con la información de cada hora planetaria
  private generarHorasPlanetarias(inicio: Date, fin: Date, subDia: string, dia: boolean): any[] {
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
        fecha: horaInicio.toLocaleDateString('es-UY'),
        dia: dia,
        imagenes: this.generarImagenesPorPlaneta(planeta)
      };
    });
  }

  // Devuelve una breve descripción simbólica del planeta
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

  // Retorna un objeto que representa un "anuncio"
  private anuncio(): any {
    return {
      nombre: 'ANUNCIO',
      tipo: 'Ad',
      esAnuncio: true
    };
  }

  private generarImagenesPorPlaneta(nombrePlaneta: string, cantidad: number = 3): string[] {
    const nombreKey = nombrePlaneta.toLowerCase();
    const imagenes: string[] = [];
    for (let i = 1; i <= cantidad; i++) {
      imagenes.push(`assets/planetas/${nombreKey}${i}.png`);
    }
    return imagenes;
  }

}
