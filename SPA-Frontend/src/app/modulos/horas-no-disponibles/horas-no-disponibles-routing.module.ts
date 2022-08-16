import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModificarHorasNoDisponiblesComponent } from './componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component';

const routes: Routes = [
  {
    path: '',
    component: ModificarHorasNoDisponiblesComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorasNoDisponiblesRoutingModule { }
