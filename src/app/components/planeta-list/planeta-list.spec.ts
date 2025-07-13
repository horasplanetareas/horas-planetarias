import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetaList } from './planeta-list';

describe('PlanetaList', () => {
  let component: PlanetaList;
  let fixture: ComponentFixture<PlanetaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
