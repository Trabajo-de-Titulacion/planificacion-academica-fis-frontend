import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MostrarActividadesComponent } from './componentes/mostrar-actividades/mostrar-actividades.component';

const routes: Routes = [
  {
    path: '',
    component: MostrarActividadesComponent,
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
export class ActividadesRoutingModule { }
