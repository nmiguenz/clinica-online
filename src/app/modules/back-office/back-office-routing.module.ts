import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeccionUsuarioComponent } from 'src/app/components/seccion-usuario/seccion-usuario.component';
import { BackOfficeComponent } from './back-office.component';

const routes: Routes = [
  { path: '', component: BackOfficeComponent },
  { path: 'seccionUsuarios', component: SeccionUsuarioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
