import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaTurnoAdminComponent } from './alta-turno-admin.component';

describe('AltaTurnoAdminComponent', () => {
  let component: AltaTurnoAdminComponent;
  let fixture: ComponentFixture<AltaTurnoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaTurnoAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaTurnoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
