import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsenseBanner } from './adsense-banner';

describe('AdsenseBanner', () => {
  let component: AdsenseBanner;
  let fixture: ComponentFixture<AdsenseBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsenseBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsenseBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
