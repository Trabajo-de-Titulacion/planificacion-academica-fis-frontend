import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModificarHorasNoDisponiblesComponent } from './componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component';
import { CambiosGuardadosGuard } from './guards/cambios-guardados.guard';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [CambiosGuardadosGuard],
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
