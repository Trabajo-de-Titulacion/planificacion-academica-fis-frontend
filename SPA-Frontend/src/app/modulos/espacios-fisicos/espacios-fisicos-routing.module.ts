import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualizarEspacioFisicoComponent } from './componentes/actualizar-espacio-fisico/actualizar-espacio-fisico.component';
import { CrearEspacioFisicoComponent } from './componentes/crear-espacio-fisico/crear-espacio-fisico.component';
import { MostrarEspaciosFisicosComponent } from './componentes/mostrar-espacios-fisicos/mostrar-espacios-fisicos.component';

const routes: Routes = [
  {
    path: 'crear',
    component: CrearEspacioFisicoComponent,
  },
  {
    path: 'actualizar/:id',
    component: ActualizarEspacioFisicoComponent,
  },
  {
    path: '',
    component: MostrarEspaciosFisicosComponent,
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
export class EspaciosFisicosRoutingModule { }
