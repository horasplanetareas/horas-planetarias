import { TestBed } from '@angular/core/testing';
import { PlanetaService } from './planeta.service';

describe('HorasPlanetariasService', () => {
  let service: PlanetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanetaService);
  });

  it('debería mantener el subdía anterior después de medianoche hasta el amanecer', async () => {
    // Coordenadas de Colonia del Sacramento (ejemplo)
    const coords = { lat: -34.4711, lng: -57.8441 };

    // Fecha simulada: 19/09/2025 00:30 (antes del amanecer)
    const fechaMedianoche = new Date("2025-09-19T00:30:00");

    // Fecha simulada: 19/09/2025 09:00 (después del amanecer)
    const fechaManiana = new Date("2025-09-19T09:00:00");

    const horasMedianoche = await (service as any).calcularHorasPlanetarias(coords, fechaMedianoche);
    const horasManiana = await (service as any).calcularHorasPlanetarias(coords, fechaManiana);

    // El planeta regente del primer bloque indica el subdía
    const planetaMedianoche = horasMedianoche[0].planeta;
    const planetaManiana = horasManiana[0].planeta;

    console.log("00:30 planeta:", planetaMedianoche);
    console.log("09:00 planeta:", planetaManiana);

    expect(planetaMedianoche).not.toEqual(planetaManiana);
  });
});
