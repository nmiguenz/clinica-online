import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallaHistoriaClinicaComponent } from './detalla-historia-clinica.component';

describe('DetallaHistoriaClinicaComponent', () => {
  let component: DetallaHistoriaClinicaComponent;
  let fixture: ComponentFixture<DetallaHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallaHistoriaClinicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallaHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
