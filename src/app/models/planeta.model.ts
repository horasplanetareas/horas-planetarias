export interface Actividad {
  titulo: string;
  descripcion: string;
  imagen: string;
}

export interface Planeta {
  nombre: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  descripcion?: string;       // Párrafo inicial largo
  actividades?: Actividad[];  // Cada actividad con imagen, título y texto
  parrafoFinal?: string;      // Párrafo final largo
  fecha: string;
  dia: boolean;
}
