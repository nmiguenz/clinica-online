import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPerfilAdminComponent } from './mi-perfil-admin.component';

describe('MiPerfilAdminComponent', () => {
  let component: MiPerfilAdminComponent;
  let fixture: ComponentFixture<MiPerfilAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiPerfilAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiPerfilAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
