import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetaDetalle } from './planeta-detalle';

describe('PlanetaDetalle', () => {
  let component: PlanetaDetalle;
  let fixture: ComponentFixture<PlanetaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
