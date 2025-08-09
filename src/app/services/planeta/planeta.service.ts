import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlanetaService {
  // Orden tradicional de planetas en astrología clásica
  private readonly ordenPlanetario = ['Marte', 'Júpiter', 'Saturno', 'Luna', 'Mercurio', 'Venus', 'Sol'];

  // Planeta que inicia el subdía según el día de la semana
  private readonly planetaInicioPorDia: Record<string, string> = {
    'Lunes': 'Luna',
    'Martes': 'Marte',
    'Miércoles': 'Mercurio',
    'Jueves': 'Júpiter',
    'Viernes': 'Venus',
    'Sábado': 'Saturno',
    'Domingo': 'Sol'
  };

  // Cache para datos solares (amanecer/anochecer) en memoria
  private solCache = new Map<string, { sunrise: string; sunset: string }>();

  // Cache para ubicación geográfica
  private ubicacionCache: { lat: number; lng: number } | null = null;

  // Cache para horas planetarias, guardando fecha, ubicación y horas calculadas
  private horasCache: { fecha: string; ubicacion: string; horas: any[] } | null = null;

  // BehaviorSubject para cache reactiva de horas planetarias
  private cacheHorasPlanetarias$ = new BehaviorSubject<any[] | null>(null);

  // Flag para evitar llamadas simultáneas repetidas
  private cargandoHoras = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Obtiene las 24 horas planetarias del día actual según la ubicación actual.
   * Usa cache para evitar llamadas repetidas el mismo día y ubicación.
   * @returns Promise con el arreglo de horas planetarias
   */
  async obtenerHorasPlanetarias(): Promise<any[]> {
    // 1. Obtener ubicación actual
    const coords = await this.getUbicacion();

    // 2. Claves para identificar cache según fecha y ubicación
    const ahora = new Date();
    const fechaKey = ahora.toISOString().split('T')[0];
    const ubicacionKey = `${coords.lat}|${coords.lng}`;

    // 3. Verificar si hay cache válida y devolverla si existe
    if (this.horasCache && this.horasCache.fecha === fechaKey && this.horasCache.ubicacion === ubicacionKey) {
      return this.horasCache.horas;
    }

    // 4. Si ya está cargando, esperar a que termine y devolver datos
    if (this.cargandoHoras) {
      return new Promise(resolve => {
        const sub = this.cacheHorasPlanetarias$.subscribe(data => {
          if (data) {
            resolve(data);
            sub.unsubscribe();
          }
        });
      });
    }

    // 5. Si no hay cache y no está cargando, empezar carga
    this.cargandoHoras = true;
    try {
      // Calcular horas planetarias con lógica original
      const horas = await this.calcularHorasPlanetarias(coords, ahora);

      // Actualizar cache local y BehaviorSubject reactivo
      this.horasCache = { fecha: fechaKey, ubicacion: ubicacionKey, horas };
      this.cacheHorasPlanetarias$.next(horas);

      return horas;

    } finally {
      this.cargandoHoras = false;
    }
  }

  /**
   * Método que calcula las horas planetarias, usando la lógica original,
   * consultando datos solares y generando las horas diurnas y nocturnas.
   * @param coords Latitud y longitud
   * @param fecha Fecha actual
   */
  private async calcularHorasPlanetarias(coords: { lat: number; lng: number }, fecha: Date): Promise<any[]> {
    const hoySol = await this.getSolData(coords.lat, coords.lng, fecha);
    const amanecer = new Date(hoySol.sunrise);

    // Si aún no amaneció, se usa el día anterior para calcular subdía
    const usarFecha = fecha < amanecer ? new Date(fecha.getTime() - 86400000) : fecha;

    const solDataHoy = await this.getSolData(coords.lat, coords.lng, usarFecha);
    const solDataManiana = await this.getSolData(coords.lat, coords.lng, new Date(usarFecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(usarFecha);

    const horasDia = this.generarHorasPlanetarias(new Date(solDataHoy.sunrise), new Date(solDataHoy.sunset), subDia, true);
    const horasNoche = this.generarHorasPlanetarias(new Date(solDataHoy.sunset), new Date(solDataManiana.sunrise), subDia, false);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  /**
   * Obtener horas planetarias para una fecha específica (sin caché)
   */
  async obtenerHorasPorFecha(fecha: Date): Promise<any[]> {
    const coords = await this.getUbicacion();
    const solHoy = await this.getSolData(coords.lat, coords.lng, fecha);
    const solManiana = await this.getSolData(coords.lat, coords.lng, new Date(fecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(fecha);
    const horasDia = this.generarHorasPlanetarias(new Date(solHoy.sunrise), new Date(solHoy.sunset), subDia, true);
    const horasNoche = this.generarHorasPlanetarias(new Date(solHoy.sunset), new Date(solManiana.sunrise), subDia, false);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  /**
   * Obtener ubicación del usuario.
   * Usa cache en memoria, y devuelve ubicación por defecto si no está en navegador.
   */
  private async getUbicacion(): Promise<{ lat: number; lng: number }> {
    if (this.ubicacionCache) {
      return this.ubicacionCache;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.ubicacionCache = { lat: -34.9011, lng: -56.1645 }; // Montevideo por defecto
      return this.ubicacionCache;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.ubicacionCache = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          resolve(this.ubicacionCache);
        },
        () => reject('Ubicación no permitida')
      );
    });
  }

  /**
   * Obtener datos de amanecer y anochecer para lat/lng y fecha.
   * Usa cache en memoria y localStorage para evitar llamadas HTTP repetidas.
   */
  private async getSolData(lat: number, lng: number, fecha: Date): Promise<{ sunrise: string; sunset: string }> {
    const dateStr = fecha.toISOString().split('T')[0];
    const key = `${lat}|${lng}|${dateStr}`;

    // 1. Intentar obtener de cache en memoria
    if (this.solCache.has(key)) {
      return this.solCache.get(key)!;
    }

    // 2. Intentar obtener de localStorage si está en navegador
    if (isPlatformBrowser(this.platformId)) {
      const cacheStr = localStorage.getItem(`sol_${key}`);
      if (cacheStr) {
        const data = JSON.parse(cacheStr);
        this.solCache.set(key, data);
        return data;
      }
    }

    // 3. Si no hay cache, hacer la llamada HTTP a sunrise-sunset.org
    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    const data = { sunrise: res.results.sunrise, sunset: res.results.sunset };

    // Guardar en cache memoria y localStorage
    this.solCache.set(key, data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`sol_${key}`, JSON.stringify(data));
    }

    return data;
  }

  /**
   * Obtener subdía para una fecha determinada según la astrología clásica.
   */
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

  /**
   * Genera el array con las 12 horas planetarias para un período dado.
   * Calcula planeta correspondiente y otros datos para cada hora.
   */
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

  /**
   * Descripción simbólica de cada planeta
   */
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

  /**
   * Genera un objeto "anuncio" para separar día y noche en las horas planetarias
   */
  private anuncio(): any {
    return { nombre: 'ANUNCIO', tipo: 'Ad', esAnuncio: true };
  }

  /**
   * Genera las URLs de imágenes correspondientes a cada planeta
   */
  private generarImagenesPorPlaneta(nombrePlaneta: string, cantidad: number = 3): string[] {
    const nombreKey = nombrePlaneta.toLowerCase();
    const imagenes: string[] = [];
    for (let i = 1; i <= cantidad; i++) {
      imagenes.push(`assets/planetas/${nombreKey}${i}.png`);
    }
    return imagenes;
  }
}
