import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsDocenteGuard } from 'src/app/servicios/auth/guards/es-docente.guard';
import { EsJefeDeDepartamentoGuard } from 'src/app/servicios/auth/guards/es-jefe-de-departamento.guard';
import { AprobarRechazarSolicitudesComponent } from './componentes/aprobar-rechazar-solicitudes/aprobar-rechazar-solicitudes.component';
import { ModificarHorasNoDisponiblesComponent } from './componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component';
import { VisualizarSolicitudesComponent } from './componentes/visualizar-solicitudes/visualizar-solicitudes.component';
import { CambiosGuardadosGuard } from './guards/cambios-guardados.guard';
import { EsCoordinadorGuard } from 'src/app/servicios/auth/guards/es-coordinador.guard';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [CambiosGuardadosGuard],
    canActivate: [EsCoordinadorGuard],
    component: ModificarHorasNoDisponiblesComponent,
  },
  {
    path: 'solicitudes',
    canActivate: [EsCoordinadorGuard],
    component: VisualizarSolicitudesComponent,
  },
  {
    path: 'solicitudes/:id',
    canActivate: [EsCoordinadorGuard],
    component: AprobarRechazarSolicitudesComponent,
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
