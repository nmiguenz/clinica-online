import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTurnosAdminComponent } from './tabla-turnos-admin.component';

describe('TablaTurnosAdminComponent', () => {
  let component: TablaTurnosAdminComponent;
  let fixture: ComponentFixture<TablaTurnosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaTurnosAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaTurnosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
