 interface Actividad {
  titulo: string;
  descripcion: string;
  imagen: string;
}

export interface Planeta {
  nombre: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string;       // siempre string, nunca undefined
  actividades: Actividad[];  // siempre array, nunca undefined
  parrafoFinal: string;      // siempre string, nunca undefined
  fecha: string;
  dia: boolean;
  inicioDate?: Date;
  finDate?: Date;
}

export interface ContenidoPlaneta {
  descripcion: string;
  parrafoFinal: string;
  actividades: Actividad[];
}