import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetaPorFechaComponent } from './planeta-por-fecha-component';

describe('PlanetaPorFechaComponent', () => {
  let component: PlanetaPorFechaComponent;
  let fixture: ComponentFixture<PlanetaPorFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetaPorFechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetaPorFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
