import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTurnoAdminComponent } from './detalle-turno-admin.component';

describe('DetalleTurnoAdminComponent', () => {
  let component: DetalleTurnoAdminComponent;
  let fixture: ComponentFixture<DetalleTurnoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTurnoAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTurnoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
