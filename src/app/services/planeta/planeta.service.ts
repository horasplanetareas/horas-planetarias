import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { lastValueFrom, BehaviorSubject } from 'rxjs';
// === MODELOS NUEVOS (puedes moverlos a un archivo models si querés) ===
export interface Actividad {
  titulo: string;
  descripcion: string;
  imagen: string;  // ruta a la imagen específica de la actividad
}

export interface Planeta {
  nombre: string;          // 'SOL', 'MARTE', etc. (en mayúsculas lo estás devolviendo)
  tipo?: string;            // 'Hora Planetaria'
  horaInicio?: string;      // hh:mm
  horaFin?: string;         // hh:mm
  descripcion?: string;    // párrafo inicial largo
  actividades?: Actividad[];  // actividades con imagen
  parrafoFinal?: string;      // párrafo final
  fecha?: string;              // dd/mm/aaaa
  dia?: boolean;               // si pertenece al bloque diurno
  // Extras operativos que ya traías (los mantenemos)
  inicioDate?: Date;
  finDate?: Date;
  // esAnuncio?: boolean  // sólo en el objeto especial 'ANUNCIO'
}

// Contenido rico (texto/imágenes) por planeta, sin horas.
// Para separar responsabilidades, guardamos acá los párrafos y actividades.
interface ContenidoPlaneta {
  descripcion: string;
  parrafoFinal: string;
  actividades: Actividad[];
}

@Injectable({ providedIn: 'root' })
export class PlanetaService {
  // Orden tradicional de planetas en astrología clásica
  private readonly ordenPlanetario = ['Marte', 'Júpiter', 'Saturno', 'Luna', 'Mercurio', 'Venus', 'Sol'];

  // Planeta que inicia el subdía según el día de la semana
  public readonly planetaInicioPorDia: Record<string, string> = {
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

  // Cache para horas planetarias (fecha+ubicación)
  private horasCache: { fecha: string; ubicacion: string; horas: any[] } | null = null;

  // Cache reactiva
  private cacheHorasPlanetarias$ = new BehaviorSubject<any[] | null>(null);

  // Flag para evitar llamadas simultáneas repetidas
  private cargandoHoras = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // =========================
  // CONTENIDOS POR PLANETA
  // =========================
  private readonly contenidos: Record<string, ContenidoPlaneta> = {
    // 🌞 SOL
    sol: {
      descripcion: `El Sol es el arquetipo central del ser. Representa nuestra identidad consciente, la vitalidad, el propósito de vida, la autoexpresión, la creatividad y la capacidad de liderazgo. Es el núcleo de nuestra personalidad, el "héroe" de nuestro propio viaje. Su energía radiante y afirmativa se manifiesta con una potencia particular durante su hora planetaria, un momento astrológico ideal para brillar, afirmar nuestra individualidad y tomar el centro del escenario en nuestras vidas. La hora planetaria del Sol, cuyo inicio y duración varían diariamente según la salida y puesta del sol en cada ubicación, es un período en el que la energía solar vital, segura y carismática está en su apogeo. Es el momento perfecto para actividades que requieran confianza, visibilidad y expresión auténtica.`,
      parrafoFinal: `La energía del Sol es un acto de afirmación del propio valor y de alineación con nuestro propósito vital. La hora planetaria del Sol nos brinda la oportunidad de dejar de lado las dudas, ocupar nuestro espacio con seguridad y permitir que nuestra luz interior brille con toda su intensidad. Aprovechar este período es sintonizar con la fuerza de nuestro corazón, liderar nuestra propia vida con coraje y expresar al mundo, sin reservas, quiénes somos realmente.`,
      actividades: [
        {
          titulo: 'Asumir el Liderazgo y Tomar Decisiones Importantes',
          descripcion: `La hora más propicia para tomar el mando, dirigir equipos, tomar decisiones ejecutivas importantes y actuar con la autoridad natural que emana de la confianza en uno mismo.`,
          imagen: 'assets/planetas/sol1.png'
        },
        {
          titulo: 'Presentaciones Públicas y Búsqueda de Reconocimiento',
          descripcion: `Momento ideal para ser visto y escuchado: presentaciones, defensas de tesis, audiciones, lanzamientos de producto o cualquier actividad en la que se busque captar atención y reconocimiento, con el carisma personal potenciado.`,
          imagen: 'assets/planetas/sol2.png'
        },
        {
          titulo: 'Expresión Creativa y Actividades Artísticas',
          descripcion: `El Sol rige el impulso creativo que nace del corazón. Excelente para pintura, actuación, música, baile o cualquier práctica que exprese de forma única y gozosa la esencia personal.`,
          imagen: 'assets/planetas/sol3.png'
        },
        {
          titulo: 'Buscar Favores de Figuras de Autoridad',
          descripcion: `La energía solar se asocia con reyes, presidentes, jefes y figuras de poder. Ideal para solicitar un aumento, pedir un favor a un superior o presentar propuestas a personas influyentes, con el carisma y la autoconfianza potenciados.`,
          imagen: 'assets/planetas/sol4.png'
        },
        {
          titulo: 'Fortalecer la Confianza y la Autoestima',
          descripcion: `El Sol es el centro de la autoestima. Momento perfecto para afirmaciones positivas, visualización de éxitos o vestirse de una manera que haga sentir poderoso y radiante.`,
          imagen: 'assets/planetas/sol5.png'
        },
        {
          titulo: 'Actividades al Aire Libre y Carga de Energía Vital',
          descripcion: `El Sol es fuente de vida y energía. Actividades al aire libre, baños de sol (con cuidado) o conectar con la naturaleza revitalizan cuerpo y espíritu, aumentando vitalidad y optimismo.`,
          imagen: 'assets/planetas/sol6.png'
        },
        {
          titulo: 'Iniciar Proyectos Importantes y Personales',
          descripcion: `Momento auspicioso para dar el impulso inicial a proyectos que sean un reflejo directo de quiénes somos y de nuestro propósito vital. Ideal para poner en marcha un emprendimiento con sello personal.`,
          imagen: 'assets/planetas/sol7.png'
        },
        {
          titulo: 'Celebración y Alegría de Vivir',
          descripcion: `El Sol encarna la alegría y la celebración de la vida. Excelente para socializar, organizar una fiesta, jugar con niños —quienes representan la espontaneidad solar— o cualquier actividad que llene de felicidad y entusiasmo.`,
          imagen: 'assets/planetas/sol8.png'
        }
      ]
    },
    // 🌙 LUNA 
    luna: {
      descripcion: `La Luna representa el mundo de las emociones, el inconsciente, la intuición, la memoria y nuestra necesidad innata de seguridad y nutrición. Asociada con el arquetipo materno y el hogar, su influencia se intensifica durante su hora planetaria, momento considerado propicio para conectar con estas facetas y realizar actividades que armonicen con su energía receptiva y protectora.`,
      parrafoFinal: `Conocer y aprovechar la hora planetaria de la Luna invita a una pausa consciente en la rutina diaria para atender las necesidades del alma, nutrir el mundo interior y fortalecer los lazos que nos brindan seguridad y bienestar emocional.`,
      actividades: [
        {
          titulo: 'Introspección y Trabajo con los Sueños',
          descripcion: `Ideal para meditación, journaling, terapia y exploración del subconsciente, descifrando los mensajes oníricos y conectando con emociones reprimidas.`,
          imagen: 'assets/planetas/luna1.png'
        },
        {
          titulo: 'Cuidado Personal y Nutrición',
          descripcion: `Propicio para baños relajantes, tratamientos para la piel, rituales de autocuidado y preparar comidas nutritivas que se disfruten con plena conciencia, honrando el instinto de cuidado maternal.`,
          imagen: 'assets/planetas/luna2.png'
        },
        {
          titulo: 'Actividades Creativas e Imaginativas',
          descripcion: `Favorece la pintura, escritura de poesía, música y cualquier expresión artística que nazca de la imaginación, la sensibilidad emocional y la inspiración íntima.`,
          imagen: 'assets/planetas/luna3.png'
        },
        {
          titulo: 'Fortalecer Vínculos Familiares y Afectivos',
          descripcion: `Tiempo perfecto para conversaciones íntimas, actividades en familia y gestos que refuercen la empatía, el sentido de pertenencia y el calor del hogar.`,
          imagen: 'assets/planetas/luna4.png'
        },
        {
          titulo: 'Desarrollo de la Intuición y Percepción Psíquica',
          descripcion: `Ideal para meditación que agudice la intuición, prácticas como la cartomancia, o simplemente prestar atención a corazonadas y sensaciones internas, conectando con lo oculto.`,
          imagen: 'assets/planetas/luna5.png'
        },
        {
          titulo: 'Planificación y Siembra de Intenciones',
          descripcion: `En sintonía con los ciclos de crecimiento y mengua de la Luna, es el momento de definir proyectos personales que requieran un desarrollo orgánico y visualizar su florecimiento.`,
          imagen: 'assets/planetas/luna6.png'
        },
        {
          titulo: 'Actividades Domésticas y Organización del Hogar',
          descripcion: `Favorece ordenar, limpiar y embellecer el hogar, creando un refugio físico y emocional que brinde seguridad y confort.`,
          imagen: 'assets/planetas/luna7.png'
        }
      ]
    },
    // ♂️ MARTE
    marte: {
      descripcion: `Marte es el arquetipo del guerrero interior. Representa energía vital, impulso para la acción, asertividad, deseo, competitividad y capacidad para poner límites. Su influencia se intensifica durante su hora planetaria, momento ideal para actividades que requieran coraje, decisión y un alto gasto energético.`,
      parrafoFinal: `La hora de Marte nos recuerda que actuar con decisión, defender lo nuestro y canalizar la energía física puede abrir caminos y fortalecer nuestra determinación.`,
      actividades: [
        {
          titulo: 'Ejercicio Físico Intenso y Deporte',
          descripcion: `Ideal para deportes competitivos, running, levantamiento de pesas, artes marciales o entrenamientos HIIT que exijan gran esfuerzo y resistencia sostenida.`,
          imagen: 'assets/planetas/marte1.png'
        },
        {
          titulo: 'Iniciar Proyectos y Tomar la Iniciativa',
          descripcion: `Momento perfecto para lanzar ideas, dar el primer paso en un nuevo proyecto, hacer esa llamada importante o cualquier acción decisiva que ponga las cosas en marcha.`,
          imagen: 'assets/planetas/marte2.png'
        },
        {
          titulo: 'Asertividad y Defensa de los Propios Derechos',
          descripcion: `Propicio para conversaciones difíciles en las que sea necesario afirmar tu lugar en el mundo, poner límites, defender un punto de vista o reclamar lo que te corresponde.`,
          imagen: 'assets/planetas/marte3.png'
        },
        {
          titulo: 'Competir y Asumir Retos',
          descripcion: `Perfecto para desafíos profesionales, deportivos o personales, cultivando una competencia sana y buscando superarte a ti mismo o a otros.`,
          imagen: 'assets/planetas/marte4.png'
        },
        {
          titulo: 'Actividades que Requieren Coraje y Valentía',
          descripcion: `Marte rige el coraje: este momento es un soporte energético para enfrentar miedos, asumir riesgos calculados o afrontar tareas que normalmente intimidan.`,
          imagen: 'assets/planetas/marte5.png'
        },
        {
          titulo: 'Trabajo Físico y Manual',
          descripcion: `Favorece la construcción, jardinería intensa, reparaciones y labores que requieran fuerza física, uso de herramientas y un esfuerzo corporal considerable.`,
          imagen: 'assets/planetas/marte6.png'
        },
        {
          titulo: 'Expresión de la Sexualidad Activa',
          descripcion: `Marte está ligado al deseo y la libido: momento propicio para encuentros apasionados y expresión activa de la sexualidad.`,
          imagen: 'assets/planetas/marte7.png'
        },
        {
          titulo: 'Toma de Decisiones Rápidas',
          descripcion: `A diferencia de la energía reflexiva de otros planetas, Marte impulsa la acción inmediata: actuar con instinto y determinación en decisiones que no requieren larga deliberación.`,
          imagen: 'assets/planetas/marte8.png'
        }
      ]
    },
    // ☿️ MERCURIO
    mercurio: {
      descripcion: `Mercurio es el arquetipo del mensajero, el intelecto y el conector. Gobierna la mente racional, la comunicación en todas sus formas, el aprendizaje, el comercio, el intercambio de información y la capacidad de adaptarnos. Su hora planetaria es ideal para actividades que requieren agilidad mental, elocuencia y la creación de puentes entre ideas y personas.`,
      parrafoFinal: `La hora de Mercurio es una invitación a utilizar el intelecto de manera constructiva, expresar ideas con claridad y tender puentes mediante la palabra.`,
      actividades: [
        {
          titulo: 'Comunicación Crucial y Negociaciones',
          descripcion: `El momento más propicio para llamadas importantes, correos decisivos, negociaciones, contratos o acuerdos, con la claridad mental y la elocuencia potenciadas.`,
          imagen: 'assets/planetas/mercurio1.png'
        },
        {
          titulo: 'Aprendizaje y Estudio',
          descripcion: `Facilita el estudio, la lectura, la investigación, la toma de cursos, el aprendizaje de idiomas o cualquier actividad que requiera una mente aguda y receptiva.`,
          imagen: 'assets/planetas/mercurio2.png'
        },
        {
          titulo: 'Escritura, Edición y Creación de Contenido',
          descripcion: `Ideal para informes, artículos, libros, publicaciones en redes sociales, edición de textos u organizar ideas por escrito mediante journaling.`,
          imagen: 'assets/planetas/mercurio3.png'
        },
        {
          titulo: 'Comercio, Compras y Ventas',
          descripcion: `Favorece todo tipo de transacciones comerciales: vender productos, buscar las mejores ofertas, realizar compras importantes —especialmente de tecnología o libros— y gestionar asuntos financieros con análisis cuidadoso.`,
          imagen: 'assets/planetas/mercurio4.png'
        },
        {
          titulo: 'Exámenes y Pruebas Intelectuales',
          descripcion: `Buen momento para afrontar tests y evaluaciones con agilidad mental, memoria clara y rapidez de pensamiento.`,
          imagen: 'assets/planetas/mercurio5.png'
        },
        {
          titulo: 'Planificación, Organización y Lluvia de Ideas',
          descripcion: `Propicio para ordenar la agenda, hacer listas, planificar viajes cortos o realizar sesiones de brainstorming que generen soluciones creativas.`,
          imagen: 'assets/planetas/mercurio6.png'
        },
        {
          titulo: 'Socialización y Networking',
          descripcion: `Favorable para asistir a eventos, crear nuevos contactos profesionales y disfrutar de conversaciones estimulantes y ligeras.`,
          imagen: 'assets/planetas/mercurio7.png'
        },
        {
          titulo: 'Trámites y Papeleo',
          descripcion: `Ideal para formularios, gestiones burocráticas y correspondencia que requieran atención al detalle y comunicación clara.`,
          imagen: 'assets/planetas/mercurio8.png'
        }
      ]
    },
    // ♀️ VENUS
    venus: {
      descripcion: `Venus es la personificación del principio de atracción, la armonía, la belleza, el placer y las relaciones. Representa nuestra capacidad para amar y ser amados, el sentido estético, los valores personales y el impulso hacia la unión. Su influencia, suave y magnética, se intensifica durante su hora planetaria, momento perfecto para cultivar belleza en todas sus formas, fomentar relaciones y disfrutar de los sentidos.`,
      parrafoFinal: `Conectar con la energía de Venus es un acto consciente de elegir la belleza sobre la fealdad, la armonía sobre el conflicto y el amor sobre el miedo. Nos recuerda que el placer no es una frivolidad, sino una parte esencial de una vida plena y saludable.`,
      actividades: [
        {
          titulo: 'Relaciones y Romance',
          descripcion: `La hora más propicia para el romance: ideal para citas, expresar sentimientos, pasar tiempo de calidad en pareja o, si estás soltero, socializar con la intención de conocer a alguien especial.`,
          imagen: 'assets/planetas/venus1.png'
        },
        {
          titulo: 'Actividades Sociales y Diplomacia',
          descripcion: `Perfecto para fiestas, reuniones, mediar conflictos y cualquier interacción donde la gracia social, la diplomacia y el encanto creen armonía.`,
          imagen: 'assets/planetas/venus2.png'
        },
        {
          titulo: 'Cuidado Personal y Embellecimiento',
          descripcion: `Momento para un cambio de look, tratamientos de belleza o compras de ropa y adornos que mejoren la apariencia y aumenten el atractivo personal.`,
          imagen: 'assets/planetas/venus3.png'
        },
        {
          titulo: 'Disfrute de las Artes y la Creatividad',
          descripcion: `Favorece visitas a museos, conciertos, decoración del hogar o prácticas artísticas como pintura, canto, danza o diseño.`,
          imagen: 'assets/planetas/venus4.png'
        },
        {
          titulo: 'Búsqueda del Placer y Goce Sensorial',
          descripcion: `Propicio para disfrutar de buena comida, vino, masajes, música agradable o cualquier experiencia que deleite los cinco sentidos.`,
          imagen: 'assets/planetas/venus5.png'
        },
        {
          titulo: 'Hacer las Paces y Reconciliarse',
          descripcion: `Facilita pedir perdón, resolver malentendidos y restaurar el equilibrio en relaciones que han estado tensas.`,
          imagen: 'assets/planetas/venus6.png'
        },
        {
          titulo: 'Compras de Objetos de Lujo y Belleza',
          descripcion: `Auspicioso para adquirir joyas, obras de arte, ropa de alta calidad o artículos de decoración que aporten belleza y placer a la vida.`,
          imagen: 'assets/planetas/venus7.png'
        },
        {
          titulo: 'Cultivar el Amor y la Autovaloración',
          descripcion: `Excelente para prácticas de amor propio, escribir una lista de cualidades personales, darse un capricho o dedicarse tiempo de calidad sin culpas.`,
          imagen: 'assets/planetas/venus8.png'
        }
      ]
    },
    // ♃ JÚPITER
    jupiter: {
      descripcion: `Júpiter es el arquetipo del maestro, el benefactor y el gran expansor. Representa la abundancia, la sabiduría, la justicia, la prosperidad y la fe en el futuro. Su hora planetaria es un momento propicio para abrirnos a nuevas oportunidades, tomar decisiones importantes y actuar con visión de largo plazo, confiando en que el universo favorece el crecimiento y la expansión.`,
      parrafoFinal: `Conectar con la energía de Júpiter nos recuerda que la vida se amplía en la medida en que nos atrevemos a soñar en grande, actuar con generosidad y confiar en que siempre hay más posibilidades de las que imaginamos.`,
      actividades: [
        {
          titulo: 'Búsqueda de Sabiduría y Estudios Superiores',
          descripcion: `Ideal para filosofía, espiritualidad, religión, leyes y conocimiento elevado; propicio para iniciar estudios universitarios o buscar el consejo de un mentor o guía sabia.`,
          imagen: 'assets/planetas/jupiter1.png'
        },
        {
          titulo: 'Planificación a Gran Escala y Visión de Futuro',
          descripcion: `Momento perfecto para metas a largo plazo, crear un plan de negocios expansivo y visualizar el futuro deseado con confianza.`,
          imagen: 'assets/planetas/jupiter2.png'
        },
        {
          titulo: 'Asuntos Legales y Búsqueda de Justicia',
          descripcion: `Propicio para iniciar trámites, solicitar asesoría jurídica o mediar disputas desde una perspectiva justa y ética.`,
          imagen: 'assets/planetas/jupiter3.png'
        },
        {
          titulo: 'Generosidad y Actos de Philantropía',
          descripcion: `Excelente para donar, ayudar y compartir recursos —tiempo, conocimiento o dinero— con espíritu abundante y expansivo.`,
          imagen: 'assets/planetas/jupiter4.png'
        },
        {
          titulo: 'Iniciar Viajes Largos o al Extranjero',
          descripcion: `Buen momento para comprar pasajes, planificar grandes viajes o iniciar aventuras que expandan la conciencia y el contacto con otras culturas.`,
          imagen: 'assets/planetas/jupiter5.png'
        },
        {
          titulo: 'Búsqueda de Oportunidades y Crecimiento Profesional',
          descripcion: `Auspicioso para solicitar ascensos, entrevistas de mayor responsabilidad o presentar proyectos ambiciosos a superiores.`,
          imagen: 'assets/planetas/jupiter6.png'
        },
        {
          titulo: 'Cultivar la Fe y el Optimismo',
          descripcion: `Propicio para gratitud, afirmaciones positivas y ceremonias espirituales o religiosas que fortalezcan la confianza en la vida.`,
          imagen: 'assets/planetas/jupiter7.png'
        },
        {
          titulo: 'Inversiones y Asuntos Financieros Mayores',
          descripcion: `Favorable para decisiones económicas de largo plazo: iniciar un plan de inversión o buscar financiación para un gran proyecto.`,
          imagen: 'assets/planetas/jupiter8.png'
        }
      ]
    },
    // ♄ SATURNO
    saturno: {
      descripcion: `Saturno es el arquetipo del maestro, el anciano sabio y el arquitecto de la realidad. Representa la estructura, la disciplina, la responsabilidad, el tiempo, los límites, la perseverancia y la construcción de un legado duradero. Su hora planetaria es ideal para tareas que requieren enfoque, paciencia y visión a largo plazo.`,
      parrafoFinal: `La energía de Saturno nos recuerda que los logros más sólidos se construyen con dedicación y constancia, y que la verdadera libertad nace de la responsabilidad y el compromiso con nuestras metas.`,
      actividades: [
        {
          titulo: 'Trabajo Profundo y Tareas Exigentes',
          descripcion: `Momento perfecto para el deep work: apagar distracciones y concentrarse en las tareas más difíciles que requieren enfoque absoluto y resistencia mental.`,
          imagen: 'assets/planetas/saturno1.png'
        },
        {
          titulo: 'Planificación a Largo Plazo y Estrategia',
          descripcion: `Propicio para diseñar planes de carrera, estrategias de negocio, planes de jubilación o proyectos que requieran bases sólidas y una hoja de ruta clara.`,
          imagen: 'assets/planetas/saturno2.png'
        },
        {
          titulo: 'Asumir Responsabilidades y Cumplir con Deberes',
          descripcion: `Tiempo de hacerse cargo de obligaciones pendientes, demostrar madurez y fiabilidad en compromisos asumidos.`,
          imagen: 'assets/planetas/saturno3.png'
        },
        {
          titulo: 'Establecer Límites y Decir “No”',
          descripcion: `Ideal para marcar fronteras saludables en relaciones personales y profesionales, protegiendo el tiempo y evitando desvíos de objetivos.`,
          imagen: 'assets/planetas/saturno4.png'
        },
        {
          titulo: 'Revisión, Edición y Perfeccionamiento',
          descripcion: `Excelente para revisar documentos importantes, editar proyectos y depurar errores buscando resultados impecables.`,
          imagen: 'assets/planetas/saturno5.png'
        },
        {
          titulo: 'Construcción y Trabajo con Estructuras',
          descripcion: `Favorece la arquitectura, la ingeniería, la carpintería y la edificación de las estructuras de nuestra vida: carrera, familia y proyectos duraderos.`,
          imagen: 'assets/planetas/saturno6.png'
        },
        {
          titulo: 'Conectar con la Tradición y los Ancestros',
          descripcion: `Momento para honrar la historia familiar, aprender de los mayores y preservar costumbres valiosas.`,
          imagen: 'assets/planetas/saturno7.png'
        },
        {
          titulo: 'Disciplina y Práctica Sostenida',
          descripcion: `Perfecto para cultivar hábitos que conduzcan a la maestría: práctica constante en una habilidad, entrenamiento físico o estudio especializado.`,
          imagen: 'assets/planetas/saturno8.png'
        }
      ]
    },
  };

  // =========================
  // API PÚBLICA
  // =========================

  /**
   * Obtiene las 24 horas planetarias del día actual, y por CADA hora
   * adjunta el contenido rico del planeta correspondiente (intro, actividades, final).
   */
  async obtenerHorasPlanetarias(): Promise<any[]> {
    const coords = await this.getUbicacion();
    const ahora = new Date();
    const fechaKey = ahora.toISOString().split('T')[0];
    const ubicacionKey = `${coords.lat}|${coords.lng}`;

    if (this.horasCache && this.horasCache.fecha === fechaKey && this.horasCache.ubicacion === ubicacionKey) {
      return this.horasCache.horas;
    }

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

    this.cargandoHoras = true;
    try {
      const horas = await this.calcularHorasPlanetarias(coords, ahora);
      this.horasCache = { fecha: fechaKey, ubicacion: ubicacionKey, horas };
      this.cacheHorasPlanetarias$.next(horas);
      return horas;
    } finally {
      this.cargandoHoras = false;
    }
  }

  /**
   * Obtiene horas para una fecha específica (sin cache persistente).
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

  // =========================
  // LÓGICA INTERNA
  // =========================

  private async calcularHorasPlanetarias(coords: { lat: number; lng: number }, fecha: Date): Promise<any[]> {
    const hoySol = await this.getSolData(coords.lat, coords.lng, fecha);
    const amanecer = new Date(hoySol.sunrise);

    // Si aún no amaneció, usar el día anterior para el subdía
    const usarFecha = fecha < amanecer ? new Date(fecha.getTime() - 86400000) : fecha;

    const solDataHoy = await this.getSolData(coords.lat, coords.lng, usarFecha);
    const solDataManiana = await this.getSolData(coords.lat, coords.lng, new Date(usarFecha.getTime() + 86400000));

    const subDia = this.obtenerSubDia(usarFecha);
    const horasDia = this.generarHorasPlanetarias(new Date(solDataHoy.sunrise), new Date(solDataHoy.sunset), subDia, true);
    const horasNoche = this.generarHorasPlanetarias(new Date(solDataHoy.sunset), new Date(solDataManiana.sunrise), subDia, false);

    return [...horasDia, this.anuncio(), ...horasNoche];
  }

  private async getUbicacion(): Promise<{ lat: number; lng: number }> {
    if (this.ubicacionCache) return this.ubicacionCache;

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

  private async getSolData(lat: number, lng: number, fecha: Date): Promise<{ sunrise: string; sunset: string }> {
    const dateStr = fecha.toISOString().split('T')[0];
    const key = `${lat}|${lng}|${dateStr}`;

    if (this.solCache.has(key)) return this.solCache.get(key)!;

    if (isPlatformBrowser(this.platformId)) {
      const cacheStr = localStorage.getItem(`sol_${key}`);
      if (cacheStr) {
        const data = JSON.parse(cacheStr);
        this.solCache.set(key, data);
        return data;
      }
    }

    const res: any = await lastValueFrom(
      this.http.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`)
    );

    const data = { sunrise: res.results.sunrise, sunset: res.results.sunset };
    this.solCache.set(key, data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`sol_${key}`, JSON.stringify(data));
    }
    return data;
  }

  public obtenerSubDia(fecha: Date): string {
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
   * Genera las 12 horas de un tramo (día/noche) y, para CADA hora,
   * inserta el contenido rico del planeta correspondiente.
   */
  private generarHorasPlanetarias(inicio: Date, fin: Date, subDia: string, dia: boolean): Planeta[] {
    const duracionHora = (fin.getTime() - inicio.getTime()) / 12;
    const planetaInicial = this.planetaInicioPorDia[subDia];
    const indiceInicial = this.ordenPlanetario.indexOf(planetaInicial);

    return Array.from({ length: 12 }, (_, i) => {
      const horaInicio = new Date(inicio.getTime() + i * duracionHora);
      const horaFin = new Date(inicio.getTime() + (i + 1) * duracionHora);
      const planetaNombre = this.ordenPlanetario[(indiceInicial + i) % 7]; // 'Sol', 'Marte', etc.

      // 👇 Contenido rico por planeta (intro, actividades con imagen, cierre)
      const contenido = this.obtenerContenidoPlaneta(planetaNombre);

      // Devolvemos el objeto completo listo para la vista de detalle
      const planeta: Planeta = {
        nombre: planetaNombre.toUpperCase(), // mantenemos tu formato actual
        tipo: 'Hora Planetaria',
        horaInicio: horaInicio.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
        horaFin: horaFin.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
        inicioDate: horaInicio,
        finDate: horaFin,
        descripcion: contenido.descripcion,
        actividades: contenido.actividades,
        parrafoFinal: contenido.parrafoFinal,
        fecha: horaInicio.toLocaleDateString('es-UY'),
        dia
      };

      return planeta;
    });
  }

  /**
   * Objeto separador (lo conservamos igual que tenías).
   * NOTA: Este objeto NO sigue la interfaz Planeta. La vista ya lo contempla con `esAnuncio`.
   */
  private anuncio(): any {
    return { nombre: 'ANUNCIO', tipo: 'Ad', esAnuncio: true };
  }

  /**
   * Devuelve el contenido rico para un planeta (case-insensitive).
   * Si no encontrás el contenido aún, vuelve un esqueleto vacío para no romper la UI.
   */
  public obtenerContenidoPlaneta(nombrePlaneta: string): ContenidoPlaneta {
    const key = nombrePlaneta.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); // quita acentos y baja a lowercase
    // Claves esperadas: 'sol', 'marte', 'jupiter'/'júpiter', 'saturno', 'luna', 'mercurio', 'venus'
    const contenido = this.contenidos[key as keyof typeof this.contenidos];

    return contenido ?? {
      descripcion: '',
      parrafoFinal: '',
      actividades: []
    };
  }
}
